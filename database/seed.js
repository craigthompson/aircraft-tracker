import db, { Aircraft } from "./model.js";
import { parseAircraftData } from "../server/opensky.js";
import aircraftData from "./aircraft.json" assert { type: "json" };

console.log("Syncing DB...");
await db.sync({ force: true });
console.log("Seeding DB...");

const aircraftInDB = await Promise.all(
  aircraftData.states.map(async (aircraft) => {
    const aircraftObj = parseAircraftData(aircraft);

    const newAircraft = await Aircraft.create({
      icao24: aircraftObj.icao24,
      callsign: aircraftObj.callsign,
      originCountry: aircraftObj.originCountry,
      timePosition: aircraftObj.timePosition,
      lastContact: aircraftObj.lastContact,
      longitude: aircraftObj.longitude,
      latitude: aircraftObj.latitude,
      baroAltitude: aircraftObj.baroAltitude,
      onGround: aircraftObj.onGround,
      velocity: aircraftObj.velocity,
      trueTrack: aircraftObj.trueTrack,
      verticalRate: aircraftObj.verticalRate,
      sensors: aircraftObj.sensors,
      geoAltitude: aircraftObj.geoAltitude,
      squawk: aircraftObj.squawk,
      spi: aircraftObj.spi,
      positionSource: aircraftObj.positionSource,
      vehicleCategory: aircraftObj.vehicleCategory,
    });

    return newAircraft;
  })
);

await db.close();
console.log("Finished seeding DB.");
