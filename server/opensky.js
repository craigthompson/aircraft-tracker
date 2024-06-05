import axios from "axios";

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
  };
};

export const getAircraft = async (latMin, lonMin, latMax, lonMax) => {
  const params = {
    params: {
      // lamin: 39.429927,
      // lomin: -112.879124,
      // lamax: 41.114634,
      // lomax: -110.308323,

      lamin: latMin,
      lomin: lonMin,
      lamax: latMax,
      lomax: lonMax,
    },
  };

  const { data } = await axios.get(
    "https://opensky-network.org/api/states/all"
  );
  setLaunchesData(data);
};
