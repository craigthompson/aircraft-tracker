import axios from "axios";
import { upsertAircraft } from "../database/aircraft.js";
import "dotenv/config";
import chalk from "chalk";

const debug = true; // Set true to enable console log debugging of this file

const openskyUrl = "https://opensky-network.org";

/**
 * Takes a single aircraft array object (from the /states/all API
 *   endpoint)and parses out the different data elements.
 *
 * @param {array} aircraft the array of data for a single aircraft
 * @returns {object} object containing the data for the given
 *   aircraft
 */
export const parseAircraftData = (aircraft) => {
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
 */
export const getAircraft = async (latMin, lonMin, latMax, lonMax) => {
  const response = await axios.get(`${openskyUrl}/api/states/all`, {
    auth: {
      username: process.env.OPENSKY_USERNAME,
      password: process.env.OPENSKY_PASSWORD,
    },
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
  // debug && console.log("Response.data:", response.data);

  const aircraftInDB = await Promise.all(
    response.data.states.map(async (aircraft) => {
      const aircraftObj = parseAircraftData(aircraft);
      return upsertAircraft(aircraftObj);
    })
  );
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
 */
export const getOwnReportedAircraft = async (
  latMin,
  lonMin,
  latMax,
  lonMax
) => {
  const response = await axios.get(`${openskyUrl}/api/states/own`, {
    auth: {
      username: process.env.OPENSKY_USERNAME,
      password: process.env.OPENSKY_PASSWORD,
    },
    params: {
      lamin: latMin,
      lomin: lonMin,
      lamax: latMax,
      lomax: lonMax,
    },
  });

  // debug && console.log("Response.data:", response.data);

  if (response.data.states) {
    const aircraftInDB = await Promise.all(
      response.data.states.map(async (aircraft) => {
        const aircraftObj = parseAircraftData(aircraft);
        return upsertAircraft(aircraftObj);
      })
    );
  }
};
