import axios from "axios";
import { upsertAircraft } from "../database/aircraft.js";
import "dotenv/config";

const debug = true; // Set true to enable console log debugging of this file

const openskyUrl = "https://opensky-network.org";

/**
 * Takes a single aircraft array object (from the /states/all API endpoint)
 *   and parses out the different data elements.
 *
 * @param {array} aircraft the array of data for a single aircraft
 * @returns {object} object containing the data for the given aircraft
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

export const getAircraft = async (latMin, lonMin, latMax, lonMax) => {
  const response = await axios.get(`${openskyUrl}/api/states/all`, {
    auth: {
      username: process.env.OPENSKY_USERNAME,
      password: process.env.OPENSKY_PASSWORD,
    },
    params: {
      // TODO: remove these test values
      // lamin: 39.429927,
      // lomin: -112.879124,
      // lamax: 41.114634,
      // lomax: -110.308323,

      lamin: latMin,
      lomin: lonMin,
      lamax: latMax,
      lomax: lonMax,
    },
  });
  debug &&
    console.log(
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
  // setLaunchesData(data);
};

// getAircraft(39.429927, -112.879124, 41.114634, -110.308323);
