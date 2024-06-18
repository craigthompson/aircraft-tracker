import db, { Aircraft, WatchedAircraft } from "./model.js";
import { Op } from "sequelize";

//////////////////////////////////////////////
//  Aircraft Table Queries
//////////////////////////////////////////////
/**
 * Queries all aircraft data from the aircraft table of the
 * database and returns an array of the aircraft. See return info
 * for details of the ordering of the returned array.
 *
 *
 * @returns {Array.<{
 *   callsign: String,
 *   icao24: String,
 *   originCountry: String,
 *   timePosition: Integer,
 *   lastContact: Integer,
 *   longitude: Float,
 *   latitude: Float,
 *   baroAltitude: Float,
 *   onGround: Boolean,
 *   velocity: Float,
 *   trueTrack: Float,
 *   verticalRate: Float,
 *   sensors: Integer,
 *   geoAltitude: Float,
 *   squawk: String,
 *   spi: Boolean,
 *   positionSource: Integer,
 *   vehicleCategory: Integer
 * }>} Array of aircraft objects ordered first
 * by aircraft on the ground, aircraft on the ground are ordered
 * by velocity (ascending), then aircraft not on the ground
 * (flying) are ordered by altitude (ascending)
 *
 * @see {@link Aircraft} for more information about the Aircraft
 * model (DB table)
 */
export const queryAllAircraft = async () => {
  await deleteOldAircraft().catch((err) => {
    console.error("Error deleting old aircraft:", err);
  });

  const allAircraft = await Aircraft.findAll({
    order: [
      // Will order the aircraft by on_ground in descending order
      ["on_ground", "DESC"],
      // Conditional order: if on_ground is true, order by velocity ascending
      // If on_ground is false, this doesn't affect the order
      [
        db.literal("CASE WHEN on_ground = true THEN velocity ELSE NULL END"),
        "ASC",
      ],
      // Order the aircraft by altitude in ascending order
      ["baro_altitude", "ASC"],
    ],
  });
  // console.log("All Aircraft:", allAircraft);
  return allAircraft;
};

/**
 * Deletes old aircraft from the aircraft table if the
 * lastContact time was over 30 seconds ago for own reported
 * aircraft, and 60 seconds for community reported aircraft.
 */
async function deleteOldAircraft() {
  const currentTime = Math.floor(Date.now() / 1000); // Get the current time in UNIX timestamp (seconds)
  const cutoffTimeForOwnReported = currentTime - 30; // Define the cutoff time (30 seconds ago)
  const cutoffTimeForOpenSkyNetworkReported = currentTime - 60; // Define the cutoff time (60 seconds ago)

  await Aircraft.destroy({
    where: {
      sensors: {
        [Op.ne]: null,
      },
      lastContact: {
        [Op.lt]: cutoffTimeForOwnReported,
      },
    },
  });

  await Aircraft.destroy({
    where: {
      sensors: {
        [Op.eq]: null,
      },
      lastContact: {
        [Op.lt]: cutoffTimeForOpenSkyNetworkReported,
      },
    },
  });
}

//////////////////////////////////////////////
//  Watched Aircraft Table Queries
//////////////////////////////////////////////
export const queryWatchedAircraft = async () => {
  const watchedAircraft = await WatchedAircraft.findAll({});
  return watchedAircraft;
};
