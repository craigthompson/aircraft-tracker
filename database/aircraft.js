import { parseAircraftData } from "../server/opensky.js";
import { Aircraft } from "./model.js";

/**
 * Takes a given aircraft object and adds it to the database
 *   if it doesn't already exist in the DB. If it already is
 *   in the DB, then it updates the existing row only if the
 *   new lastContact timestamp is newer than the existing one.
 *
 * @param {object} aircraft to add or update in the DB.
 * @returns {Aircraft} Aircraft model that was added or updated.
 */
export const upsertAircraft = async (aircraft) => {
  try {
    if (aircraft.icao24) {
      // Check if the aircraft already exists in the database
      const existingAircraft = await Aircraft.findOne({
        where: {
          icao24: aircraft.icao24,
        },
      });

      if (existingAircraft) {
        // If the existing aircraft's lastContact is newer or equal, do not update
        if (existingAircraft.lastContact >= aircraft.lastContact) {
          // console.log(
          //   `Aircraft with icao24 ${aircraft.icao24} already exists and is newer or equal.`
          // );
          return existingAircraft;
        }

        // Update the existing aircraft with the new data
        const updatedAircraft = await Aircraft.update(
          {
            callsign: aircraft.callsign,
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
            where: {
              icao24: aircraft.icao24,
            },
            returning: true, // Return the updated aircraft model
          }
        );

        return updatedAircraft[1][0]; // Return the updated aircraft model
      } else {
        // If the aircraft doesn't exist, create a new entry
        const newAircraft = await Aircraft.create({
          icao24: aircraft.icao24,
          callsign: aircraft.callsign,
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
        });

        return newAircraft;
      }
    }
  } catch (error) {
    console.error("Error during upsert:", error);
  }
};
