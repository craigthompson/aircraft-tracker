import db, { WatchedAircraft } from "./model.js";
import scrapeFlightData from "../server/webScraper/flightStatusScraper.js";
import { queryWatchedAircraft } from "./queries.js";

export const upsertWatchedAircraft = async (aircraft) => {
  const newWatchedAircraft = await WatchedAircraft.upsert({
    icao24: aircraft.icao24,
    callsign: aircraft.callsign,
    flightStatus: aircraft.flightStatus,
    departureAirport: aircraft.departureAirport,
    arrivalAirport: aircraft.arrivalAirport,
    airlineLogoUrl: aircraft.airlineLogoUrl,
  });

  await db.close();
  return newWatchedAircraft;
};

export const scrapeWatchedFlightsStatus = async () => {
  const watchedFlights = await queryWatchedAircraft();
  for (const flight of watchedFlights) {
    console.log("Flight:", flight);
    const flightDetails = await scrapeFlightData(flight.callsign);
    flightDetails["callsign"] = flight.callsign;
    flightDetails["watchId"] = flight.watchId;
    console.log("Flight details: ", flightDetails);
    console.log("Upserting flight details into watched aircraft table...");
    await upsertWatchedAircraftFlightDetails(flightDetails);
    console.log("Done upserting flight details.");
  }
  await db.close();
};

export const upsertWatchedAircraftFlightDetails = async (flight) => {
  const newWatchedAircraftFlightDetails = await WatchedAircraft.upsert({
    callsign: flight.callsign,
    flightStatus: flight.flightStatus,
    departureAirport: flight.departureAirport,
    arrivalAirport: flight.arrivalAirport,
    airlineLogoUrl: flight.airlineLogoUrl,
  });

  return newWatchedAircraftFlightDetails;
};

// await scrapeWatchedFlightsStatus(); // TODO: remove after dev
