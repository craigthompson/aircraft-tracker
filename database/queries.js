import db, { Aircraft } from "./model.js";

// Get all aircraft from DB
export const queryAllAircraft = async () => {
  const allAircraft = await Aircraft.findAll({
    order: [
      // Order by on_ground descending
      ["on_ground", "DESC"],
      // Conditional order: if on_ground is true, order by velocity ascending
      // If on_ground is false, this doesn't affect the order
      [
        db.literal("CASE WHEN on_ground = true THEN velocity ELSE NULL END"),
        "ASC",
      ],
      // Order by baro_altitude ascending for all rows
      ["baro_altitude", "ASC"],
    ],
    // order: [
    //   // Will order the aircraft by on_ground in ascending order
    //   ["on_ground", "DESC"],
    //   // Will then order the aircraft by altitude in ascending order
    //   ["baro_altitude", "ASC"],
    // ],
  });
  // console.log("All Aircraft:", allAircraft);
  return allAircraft;
};
