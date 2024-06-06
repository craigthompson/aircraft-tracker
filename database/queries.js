import { Aircraft } from "./model.js";

// Get all aircraft from DB
export const queryAllAircraft = async () => {
  const allAircraft = await Aircraft.findAll({});
  return allAircraft;
};
