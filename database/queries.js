import { Aircraft } from "./model.js";

// Get all aircraft from DB
export const queryAllAircraft = async () => {
  const allAircraft = await Aircraft.findAll({
    order: [
      // Will order the aircraft by on_ground in ascending order
      ["on_ground", "DESC"],
      // Will then order the aircraft by altitude in ascending order
      ["baro_altitude", "ASC"],
    ],
  });
  // console.log("All Aircraft:", allAircraft);
  return allAircraft;
};
