import db from "../model.js";
import { parseAircraftData } from "../../server/opensky.js";
import aircraftData from "./aircraft.json" assert { type: "json" };
import { upsertAircraft } from "../aircraft.js";

console.log("Syncing DB...");

/**
 * sync with "alter:true" checks what is the current state of the table in the
 *   database (which columns it has, what are their data types, etc), and then
 *   performs the necessary changes in the table to make it match the model.
 */
await db.sync({ alter: true });
console.log("Seeding DB...");

const aircraftInDB = await Promise.all(
  aircraftData.states.map(async (aircraft) => {
    const aircraftObj = parseAircraftData(aircraft);
    return upsertAircraft(aircraftObj);
  })
);

// await db.close();
console.log("Finished seeding DB.");
