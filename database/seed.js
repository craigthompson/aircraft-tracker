import db, { Aircraft } from "./model.js";
import aircraftData from "./aircraft.json" assert { type: "json" };

console.log("Syncing DB...");
await db.sync({ force: true });
console.log("Seeding DB...");

const aircraftInDB = await Promise.all(
  aircraftData.states.map(async (aircraft) => {
    const icao24 = aircraft[0];
    const callsign = aircraft[1];
    const originCountry = aircraft[2];
    const timePosition = aircraft[3];
    const lastContact = aircraft[4];
    const longitude = aircraft[5];
    const latitude = aircraft[6];
    const baroAltitude = aircraft[7];
    const onGround = aircraft[8];
    const velocity = aircraft[9];
    const trueTrack = aircraft[10];
    const verticalRate = aircraft[11];
    const sensors = aircraft[12];
    const geoAltitude = aircraft[13];
    const squawk = aircraft[14];
    const spi = aircraft[15];
    const positionSource = aircraft[16];

    const newAircraft = await Aircraft.create({
      icao24,
      callsign,
      originCountry,
      timePosition,
      lastContact,
      longitude,
      latitude,
      baroAltitude,
      onGround,
      velocity,
      trueTrack,
      verticalRate,
      sensors,
      geoAltitude,
      squawk,
      spi,
      positionSource,
    });

    return newAircraft;
  })
);

await db.close();
console.log("Finished seeding DB.");
