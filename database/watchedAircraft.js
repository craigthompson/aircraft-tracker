import { WatchedAircraft } from "./model.js";

export const upsertWatchedAircraft = async (aircraft) => {
  const newWatchedAircraft = await WatchedAircraft.upsert(
    {
      icao24: aircraft.icao24,
      callsign: aircraft.callsign,
      flightStatus: aircraft.flightStatus,
      departureAirport: aircraft.departureAirport,
      arrivalAirport: aircraft.arrivalAirport,
    },
    {
      conflict: {
        target: ["callsign"],
      },
    }
  );

  return newWatchedAircraft;
};
