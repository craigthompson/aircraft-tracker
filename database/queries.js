import db, { Aircraft } from "./model.js";

/**
 * Queries all aircraft data from the aircraft table of the
 * database and returns an array of the aircraft. See return info
 * for details of the ordering of the returned array.
 *
 *
 * @returns {Array.<{
 *   aircraftId: Number,
 *   icao24: String,
 *   callsign: String,
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
