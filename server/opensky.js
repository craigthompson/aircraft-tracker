import axios from "axios";
import { upsertAircraft } from "../database/aircraft.js";
import "dotenv/config";
import chalk from "chalk";

const debug = true; // Set true to enable console log debugging of this file

const openskyUrl = "https://opensky-network.org";
const openskyTokenUrl =
  "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";

/**
 * OpenSky API Documentation https://openskynetwork.github.io/opensky-api/rest.html#response
 */

// Cached OAuth2 token state
let cachedToken = null;
let tokenExpiresAt = null;

/**
 * Fetches an OAuth2 Bearer token using client credentials.
 * Caches the token and reuses it until 60 seconds before expiry.
 *
 * @returns {string|null} Bearer token, or null if credentials are not configured
 */
const getAccessToken = async () => {
  if (!process.env.OPENSKY_CLIENT_ID || !process.env.OPENSKY_CLIENT_SECRET) {
    return null;
  }

  const now = Date.now();
  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.OPENSKY_CLIENT_ID);
  params.append("client_secret", process.env.OPENSKY_CLIENT_SECRET);

  const response = await axios.post(openskyTokenUrl, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  cachedToken = response.data.access_token;
  // Token lifespan is 30 minutes; refresh 60 seconds early
  tokenExpiresAt = now + (response.data.expires_in - 60) * 1000;

  debug &&
    console.log(chalk.magentaBright("[OpenSky] "), "Fetched new access token");

  return cachedToken;
};

/**
 * Takes a single aircraft array object (from the /states/all API
 *   endpoint)and parses out the different data elements.
 *
 * @param {array} aircraft the array of data for a single aircraft
 * @returns {object} object containing the data for the given
 *   aircraft
 *
 * @see {@link https://openskynetwork.github.io/opensky-api/rest.html#response}
 *   OpenSky Network API documentation.
 */
export const parseAircraftData = (aircraft) => {
  try {
    return {
      icao24: aircraft[0],
      callsign: aircraft[1],
      originCountry: aircraft[2],
      timePosition: aircraft[3],
      lastContact: aircraft[4],
      longitude: aircraft[5],
      latitude: aircraft[6],
      baroAltitude: aircraft[7],
      onGround: aircraft[8],
      velocity: aircraft[9],
      trueTrack: aircraft[10],
      verticalRate: aircraft[11],
      sensors: aircraft[12],
      geoAltitude: aircraft[13],
      squawk: aircraft[14],
      spi: aircraft[15],
      positionSource: aircraft[16],
      vehicleCategory: aircraft[17] || null,
    };
  } catch (error) {
    console.error("Error in parsing aircraft data:", error);
  }
};

/**
 * Fetches the live aircraft in the given rectangular geographic
 *   area from the OpenSky Network API, then upserts the received
 *   aircraft data into the "aircraft" table of the database.
 *
 * The geographic area is defined by the minimum and maximum
 *   latitude and longitude of the desired rectangular geographic
 *   area.
 *
 * Upsert -- adds the data to DB if not already present, or
 *   updates the data if already in DB.
 *
 * @param {float} latMin - minimum latitude of the desired area
 *   (decimal degress)
 * @param {float} lonMin - minimum longitude of the desired area
 *   (decimal degress)
 * @param {float} latMax - maximum latitude of the desired area
 *   (decimal degress)
 * @param {float} lonMax - maximum longitude of the desired area
 *   (decimal degress)
 *
 * @see {@link https://openskynetwork.github.io/opensky-api/rest.html#response}
 *   OpenSky Network API documentation.
 */
export const getAircraft = async (latMin, lonMin, latMax, lonMax) => {
  try {
    const token = await getAccessToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(`${openskyUrl}/api/states/all`, {
      headers,
      params: {
        lamin: latMin,
        lomin: lonMin,
        lamax: latMax,
        lomax: lonMax,
      },
    });

    debug &&
      console.log(
        chalk.magentaBright("[OpenSky] "),
        "Rate limit remaining:",
        response.headers["x-rate-limit-remaining"]
      );

    if (!response.data.states) {
      console.log(chalk.magentaBright("[OpenSky] "), "No states returned — unauthenticated or rate limited");
      return;
    }

    const aircraftInDB = await Promise.all(
      response.data.states.map(async (aircraft) => {
        const aircraftObj = parseAircraftData(aircraft);
        return upsertAircraft(aircraftObj);
      })
    );
  } catch (error) {
    console.error("Error in getAircraft:", error);
  }
};

/**
 * Fetches the live aircraft reported from my own ADS-B receiver
 *   to the OpenSky Network in the given rectangular geographic
 *   area from the OpenSky Network API, then upserts the received
 *   aircraft data into the "aircraft" table of the database.
 *
 * The geographic area is defined by the minimum and maximum
 *   latitude and longitude of the desired rectangular geographic
 *   area.
 *
 * Upsert -- adds the data to DB if not already present, or
 *   updates the data if already in DB.
 *
 * @param {float} latMin - minimum latitude of the desired area
 *   (decimal degress)
 * @param {float} lonMin - minimum longitude of the desired area
 *   (decimal degress)
 * @param {float} latMax - maximum latitude of the desired area
 *   (decimal degress)
 * @param {float} lonMax - maximum longitude of the desired area
 *   (decimal degress)
 *
 * @see {@link https://openskynetwork.github.io/opensky-api/rest.html#response}
 *   OpenSky Network API documentation.
 */
export const getOwnReportedAircraft = async (
  latMin,
  lonMin,
  latMax,
  lonMax
) => {
  try {
    const token = await getAccessToken();
    if (!token) return;

    const response = await axios.get(`${openskyUrl}/api/states/own`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        lamin: latMin,
        lomin: lonMin,
        lamax: latMax,
        lomax: lonMax,
      },
    });

    if (response.data.states) {
      const aircraftInDB = await Promise.all(
        response.data.states.map(async (aircraft) => {
          const aircraftObj = parseAircraftData(aircraft);
          return upsertAircraft(aircraftObj);
        })
      );
    }
  } catch (error) {
    console.error("Error in getting own reported aircraft:", error);
    return null;
  }
};
