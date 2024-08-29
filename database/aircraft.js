import { parseAircraftData } from "../server/opensky.js";
import { Aircraft } from "./model.js";
import axios from "axios";
import chalk from "chalk";

const openskyMetadataAircraftUrl =
  "https://opensky-network.org/api/metadata/aircraft/icao";

/**
 * Takes a given aircraft object and adds it to the database
 *   if it doesn't already exist in the DB. If it already is
 *   in the DB, then it updates the existing entry only if the
 *   new lastContact timestamp is newer than the existing one.
 *   If the existing aircraft entry has a lastContact value
 *   that is newer or equal, it does not update.
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
            // Return the updated aircraft model
            returning: true,
          }
        );

        // Return the updated aircraft model
        return updatedAircraft[1][0];
      } else {
        // If the aircraft doesn't exist, create a new entry
        // try {
        //   const response = await axios.get(
        //     `${openskyMetadataAircraftUrl}/${aircraft.icao24}`
        //   );
        //   console.log(
        //     chalk.blueBright("[OpenSky Metadata] "),
        //     "Aircraft metadata:",
        //     response.data
        //   );
        //   // await new Promise((resolve) => setTimeout(resolve, 1000));
        // } catch (error) {
        //   console.error("Error in getting aircraft metadata:", error);
        // }

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
