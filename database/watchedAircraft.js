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

  // await db.close();  // TODO: remove if not needed
  return newWatchedAircraft;
};

export const scrapeWatchedFlightsStatus = async () => {
  const watchedFlights = await queryWatchedAircraft();
  await Promise.all(
    watchedFlights.map(async (flight) => {
      const scrapedFlight = await scrapeGivenWatchedFlightStatus(flight);
    })
  );
  // await db.close();  // TODO: remove if not needed
  return watchedFlights;
};

export const scrapeGivenWatchedFlightStatus = async (flight) => {
  try {
    console.log("Flight:", flight);
    const flightDetails = await scrapeFlightData(flight.callsign);
    flightDetails["callsign"] = flight.callsign;
    flightDetails["watchId"] = flight.watchId;
    console.log("Flight details: ", flightDetails);
    console.log("Upserting flight details into watched aircraft table...");
    const upsertedWatchedFlight = await upsertWatchedAircraftFlightDetails(
      flightDetails
    );
    console.log("Done upserting flight details.");
    return upsertedWatchedFlight;
  } catch (error) {
    console.error("Error during scraping for flight:", flight.callsign, error);
  }
};

export const upsertWatchedAircraftFlightDetails = async (flight) => {
  const newWatchedAircraftFlightDetails = await WatchedAircraft.upsert({
    callsign: flight.callsign,
    flightStatus: flight.flightStatus,
    departureAirport: flight.departureAirport,
    arrivalAirport: flight.arrivalAirport,
    airlineLogoUrl: flight.airlineLogoUrl,
  });

  return newWatchedAircraftFlightDetails[0];
};

export const createWatchedAircraft = async (callsign) => {
  const watchedAircraft = {
    callsign: callsign,
    flightStatus: null,
    departureAirport: null,
    arrivalAirport: null,
    airlineLogoUrl: null,
  };
  const newWatchedAircraft = await scrapeGivenWatchedFlightStatus(
    watchedAircraft
  );
  // const watchedAircraft = await WatchedAircraft.findAll({});
  console.log("New watched aircraft:", newWatchedAircraft);
  const watchedFlights = await queryWatchedAircraft();
  return watchedFlights;
};

// await scrapeWatchedFlightsStatus(); // TODO: remove after dev
