import { parseAircraftData } from "../server/opensky.js";
import { Aircraft } from "./model.js";

/**
 * Takes a given aircraft object and adds it to the database
 *   if it doesn't already exist in the DB. If it already is
 *   in the DB, then it updates the existing row.
 *
 * @param {object} aircraft to add or update in the DB.
 * @returns {Aircraft} Aircraft model that was added or updated.
 */
export const upsertAircraft = async (aircraft) => {
  try {
    if (aircraft.callsign) {
      const newAircraft = await Aircraft.upsert(
        {
          callsign: aircraft.callsign,
          icao24: aircraft.icao24,
          originCountry: aircraft.originCountry,
          timePosition: aircraft.timePosition,
          lastContact: aircraft.lastContact,
          longitude: aircraft.longitude,
          latitude: aircraft.latitude,
          baroAltitude: aircraft.baroAltitude,
          onGround: aircraft.onGround,
          velocity: aircraft.velocity,
          trueTrack: aircraft.trueTrack,
          verticalRate: aircraft.verticalRate,
          sensors: aircraft.sensors,
          geoAltitude: aircraft.geoAltitude,
          squawk: aircraft.squawk,
          spi: aircraft.spi,
          positionSource: aircraft.positionSource,
          vehicleCategory: aircraft.vehicleCategory,
        },
        {
          conflictFields: ["icao24"],
        }
      );

      return newAircraft;
    }
  } catch (error) {
    console.error("Error during upsert:", error);
  }
};
