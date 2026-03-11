import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

/**
 * Checks if Cloudflare's challenge page is present and attempts to click
 * the verification checkbox if found.
 *
 * @param {import('puppeteer').Page} page
 */
async function checkCloudflare(page) {
  try {
    // Wait for the Cloudflare challenge widget to fully render
    console.log("[Scraper] Waiting 5s for Cloudflare widget to render...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // The iframe is in a closed shadow root so JS DOM APIs can't find it.
    // Use CDP directly: Page.getFrameTree to find the Cloudflare frame ID,
    // then DOM.getFrameOwner to get its element, then DOM.getBoxModel for position.
    const cdpSession = await page.createCDPSession();

    const { frameTree } = await cdpSession.send("Page.getFrameTree");
    function findFrameId(node) {
      if (
        node.frame.url &&
        node.frame.url.includes("challenges.cloudflare.com")
      ) {
        return node.frame.id;
      }
      for (const child of node.childFrames ?? []) {
        const found = findFrameId(child);
        if (found) return found;
      }
      return null;
    }

    const cfFrameId = findFrameId(frameTree);
    if (!cfFrameId) {
      console.log("[Scraper] Cloudflare frame ID not found via CDP");
      return;
    }
    console.log("[Scraper] Cloudflare frame ID:", cfFrameId);

    const { backendNodeId } = await cdpSession.send("DOM.getFrameOwner", {
      frameId: cfFrameId,
    });
    const { model } = await cdpSession.send("DOM.getBoxModel", {
      backendNodeId,
    });

    // model.content is a flat quad [x1,y1, x2,y1, x2,y2, x1,y2]
    const iframeLeft = model.content[0];
    const iframeTop = model.content[1];
    const iframeBottom = model.content[5];
    const clickX = iframeLeft + 20;
    const clickY = (iframeTop + iframeBottom) / 2;
    console.log(
      `[Scraper] Cloudflare iframe box: left=${iframeLeft} top=${iframeTop} bottom=${iframeBottom}`,
    );
    console.log(`[Scraper] Clicking checkbox at (${clickX}, ${clickY})`);

    await page.mouse.click(clickX, clickY);
    console.log("[Scraper] Clicked, waiting for challenge to pass...");

    await page
      .waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 })
      .catch(() => {
        console.log(
          "[Scraper] No navigation after checkbox click (challenge may still be processing)",
        );
      });
    await cdpSession.detach();
  } catch {
    // No Cloudflare challenge present, continue normally
    console.log("[Scraper] No Cloudflare challenge detected");
  }
}

async function scrapeFlightData(
  flightNumber,
  debugLog = false,
  debugScreenshot = true,
) {
  const url = `https://www.airnavradar.com/data/flights/${flightNumber}`;

  // Launch the browser
  const browser = await puppeteer.launch({ headless: "true" });
  const page = await browser.newPage();

  // Set a viewport to emulate typical browser behavior
  await page.setViewport({ width: 1280, height: 800 });

  // Optionally set user-agent to mimic a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
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
  // The airline logo image element selector
  const airlineLogoSelector = "#main > img.AirlineLogo";

  let flightData = {};

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await checkCloudflare(page);

    try {
      await page.waitForSelector(airportSelector, { timeout: 15000 });
      if (debugLog) console.log("Found airport selector, so page has loaded");

      // Extract the departure and arrival airport details
      flightData = await page.evaluate((selector) => {
        const airports = document.querySelectorAll(selector);
        console.log("Airports:", airports);
        const departureAirport = airports[0]?.textContent.trim() ?? null;
        console.log("Dep airports:", departureAirport);
        const arrivalAirport = airports[1]?.textContent.trim() ?? null;
        console.log("Arr airports:", arrivalAirport);
        return { departureAirport, arrivalAirport };
      }, airportSelector);
    } catch (error) {
      flightData = { departureAirport: null, arrivalAirport: null };
    }

    // Capture a screenshot for debugging
    if (debugScreenshot) {
      await page.screenshot({
        path: "./server/webScraper/screenshots/debug_screenshot.png",
      });
    }

    // Get the airline name
    try {
      await page.waitForSelector(airlineSelector, { timeout: 15000 });
      if (debugLog) console.log("Found airline selector");

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
      await page.waitForSelector(flightStatusSelector, { timeout: 15000 });
      if (debugLog) console.log("Found flight status selector");

      // Extract the departure and arrival airport details
      flightData["flightStatus"] = await page.evaluate((selector) => {
        const status = document.querySelector(selector)?.textContent.trim();
        return status;
      }, flightStatusSelector);
    } catch {
      flightData["flightStatus"] = null;
    }

    // Get the flight airline logo
    try {
      await page.waitForSelector(airlineLogoSelector, { timeout: 15000 });
      if (debugLog) console.log("Found flight airline logo selector");

      // Extract the departure and arrival airport details
      flightData["airlineLogoUrl"] = await page.evaluate((selector) => {
        const logo = document.querySelector(selector)?.src;
        return logo;
      }, airlineLogoSelector);
    } catch {
      flightData["airlineLogoUrl"] = null;
    }
  } catch (error) {
    console.error("Error while scraping for flight details:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
  return flightData;
}

// Flight to go scrape details for
// const flightNumber = "SKW3453";
// const flightNumber = "CXK276"; // Owner has flight private from FlightAware
// const flightNumber = "N430HJ";

// // Run the scrape function
// scrapeFlightData(flightNumber)
//   .then((flightData) => {
//     console.log("Flight Data:", flightData);
//   })
//   .catch((error) => {
//     console.error("Error scraping flight data:", error);
//   });

export default scrapeFlightData;
