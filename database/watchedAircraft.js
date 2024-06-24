import db, { WatchedAircraft } from "./model.js";
import scrapeFlightData from "../server/webScraper/flightStatusScraper.js";
import { queryWatchedAircraft } from "./queries.js";
import chalk from "chalk";

export const upsertWatchedAircraft = async (aircraft) => {
  try {
    const newWatchedAircraft = await WatchedAircraft.upsert({
      icao24: aircraft.icao24,
      callsign: aircraft.callsign,
      flightStatus: aircraft.flightStatus,
      departureAirport: aircraft.departureAirport,
      arrivalAirport: aircraft.arrivalAirport,
      airlineLogoUrl: aircraft.airlineLogoUrl,
    });

    return newWatchedAircraft;
  } catch (error) {
    console.error("Error during upserting watched aircraft:", error);
    return null;
  }
};

export const scrapeWatchedFlightsStatus = async () => {
  try {
    const watchedFlights = await queryWatchedAircraft();
    await Promise.all(
      watchedFlights.map(async (flight) => {
        const scrapedFlight = await scrapeGivenWatchedFlightStatus(flight);
      })
    );

    return watchedFlights;
  } catch (error) {
    console.error("Error during scraping watched aircraft:", error);
    return null;
  }
};

export const scrapeGivenWatchedFlightStatus = async (flight) => {
  try {
    console.log(
      chalk.cyanBright(`[Scraper Bot] `),
      "Scraping for flight:",
      flight
    );
    const flightDetails = await scrapeFlightData(flight.callsign);
    flightDetails["callsign"] = flight.callsign;
    flightDetails["watchId"] = flight.watchId;
    console.log(
      chalk.cyanBright(`[Scraper Bot] `),
      "Flight details: ",
      flightDetails
    );
    console.log(
      chalk.cyanBright(`[Scraper Bot] `),
      "Upserting flight details into watched aircraft table..."
    );
    const upsertedWatchedFlight = await upsertWatchedAircraftFlightDetails(
      flightDetails
    );
    console.log(
      chalk.cyanBright(`[Scraper Bot] `),
      "Done upserting flight details."
    );
    return upsertedWatchedFlight;
  } catch (error) {
    console.error("Error during scraping for flight:", flight.callsign, error);
    return null;
  }
};

export const upsertWatchedAircraftFlightDetails = async (flight) => {
  try {
    const newWatchedAircraftFlightDetails = await WatchedAircraft.upsert({
      callsign: flight.callsign,
      flightStatus: flight.flightStatus,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      airlineLogoUrl: flight.airlineLogoUrl,
    });

    return newWatchedAircraftFlightDetails[0];
  } catch (error) {
    console.error("Error in upserting watched flight details:", error);
    return null;
  }
};

export const createWatchedAircraft = async (callsign) => {
  try {
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
  } catch (error) {
    console.error(
      "Error while trying to scrape and add watched flight.",
      error
    );
  }
  const watchedFlights = await queryWatchedAircraft();
  return watchedFlights;
};
