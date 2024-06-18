import puppeteer from "puppeteer";

async function scrapeFlightData(flightNumber) {
  const url = `https://www.radarbox.com/data/flights/${flightNumber}`;

  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Set a viewport to emulate typical browser behavior
  await page.setViewport({ width: 1280, height: 800 });

  // Optionally set user-agent to mimic a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  // Set additional headers
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  // The specific airport code element selector
  const airportSelector = "#code";
  // The airline name element selector
  const airlineSelector = "#value > a[href*='/data/airlines']";
  // The flight status element selector
  const flightStatusSelector = "#top > div.FlightStatus";

  // Navigate to the page and wait for selector to be present in DOM (page loaded)
  await page.goto(url);
  await page.waitForSelector(airportSelector, { timeout: 15000 });
  console.log("Found airport selector, so page has loaded");

  // Capture a screenshot for debugging
  await page.screenshot({
    path: "./server/webScraper/screenshots/debug_screenshot.png",
  });

  // Extract the departure and arrival airport details
  const flightData = await page.evaluate((selector) => {
    const airports = document.querySelectorAll(selector);
    console.log("Airports:", airports);
    const departureAirport = airports[0]?.textContent.trim() ?? null;
    console.log("Dep airports:", departureAirport);
    const arrivalAirport = airports[1]?.textContent.trim() ?? null;
    console.log("Arr airports:", arrivalAirport);
    return { departureAirport, arrivalAirport };
  }, airportSelector);

  // Get the airline name
  try {
    await page.waitForSelector(airlineSelector, { timeout: 2000 });
    console.log("Found airline selector");

    // Extract the departure and arrival airport details
    flightData["airline"] = await page.evaluate((selector) => {
      const airline = document.querySelector(selector)?.textContent.trim();
      return airline;
    }, airlineSelector);
  } catch {
    flightData["airline"] = null;
  }

  // Get the flight status
  try {
    await page.waitForSelector(flightStatusSelector, { timeout: 2000 });
    console.log("Found flight status selector");

    // Extract the departure and arrival airport details
    flightData["status"] = await page.evaluate((selector) => {
      const status = document.querySelector(selector)?.textContent.trim();
      return status;
    }, flightStatusSelector);
  } catch {
    flightData["status"] = null;
  }

  // Close the browser
  await browser.close();

  return flightData;
}

// URL to scrape
const flightNumber = "SKW3453";
// const flightNumber = "N230DC";

// Run the scrape function
scrapeFlightData(flightNumber)
  .then((flightData) => {
    console.log("Flight Data:", flightData);
  })
  .catch((error) => {
    console.error("Error scraping flight data:", error);
  });

export default scrapeFlightData;
