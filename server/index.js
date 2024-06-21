//////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////
import express from "express";
import ViteExpress from "vite-express";
import config from "../config/config.js";
import socketConfig from "../config/socket.config.js";
import "dotenv/config";
import handlerFunctions from "./controller.js";
import socketHandlerFunctions from "./socketController.js";
import chalk from "chalk";
import cron from "node-cron";
import { getAircraft, getOwnReportedAircraft } from "./opensky.js";
import { getNumOfClients } from "./socketController.js";
import cors from "cors";

import http from "http";
import { Server } from "socket.io";

//////////////////////////////////////////////
//  Express instance and Middleware
//////////////////////////////////////////////
// Create Express instance
const app = express();

// HTTP server for socket.io
const server = http.createServer(app);

app.use(cors());

// Get URL for server socket
const socketUrl = (() => {
  console.log("Node environment:", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    return `${socketConfig.SOCKET_DEV_URL_DOMAIN}:${socketConfig.SOCKET_PORT}`;
  } else {
    return `${socketConfig.SOCKET_PROD_URL_DOMAIN}:${socketConfig.SOCKET_PORT}`;
  }
})();

// Initialize Socket.IO
const socketIo = new Server(server, {
  cors: {
    origin: socketUrl,
    credentials: true,
  },
});

// Set up middleware
app.use(express.json());

//////////////////////////////////////////////
//  Endpoints
//////////////////////////////////////////////
// TODO: Consider making my API require authorization, to prevent attacks that could max out my allowed rate limits with my external API providers (i.e. OpenSky) or with my hosting provider.
const { getAllAircraft, getWatchedAircraft, addWatchedAircraft } =
  handlerFunctions;

app.get("/api/aircraft/all", getAllAircraft);

app.get("/api/watched/aircraft", getWatchedAircraft);
app.post("/api/watched/aircraft", addWatchedAircraft);

//////////////////////////////////////////////
//  Socket.io
//////////////////////////////////////////////
const { emitAllAircraftToSingleSocket, emitAllAircraftForAllSockets } =
  socketHandlerFunctions;

// Handle WebSocket connections
socketIo.on("connection", (socket) => {
  console.log(
    chalk.cyan("[Socket Event]"),
    "A user connected. Socket ID:",
    socket.id
  );
  emitAllAircraftToSingleSocket(socket);

  socket.on("disconnect", () => {
    console.log(
      chalk.cyan("[Socket Event]"),
      "User disconnected. Socket ID:",
      socket.id
    );
  });
});

//////////////////////////////////////////////
//  Scheduled Cron Tasks
//////////////////////////////////////////////
// Schedule fetching Opensky aircraft data every 20 seconds
// Schedule tasks using other intervals. Examples:
// '0 * * * *'        - every hour
// '0 0 * * *'        - every day at midnight
// '0 0 * * 0'        - every Sunday at midnight
// '0 0 1 * *'        - the first day of every month
// '0 0 1 1 *'        - once a year, on January 1st
cron.schedule("*/20 * * * * *", async () => {
  try {
    if (getNumOfClients(socketIo) > 0) {
      // console.log(
      //   chalk.magentaBright("[OpenSky] "),
      //   "Running scheduled task to get aircraft data."
      // );
      // await getAircraft(38.7219, -114.2791, 42.3219, -109.5991); // Optimized for a single credit on the API
      // await emitAllAircraftForAllSockets();
    } else {
      console.log(
        "Skipping scheduled task to get aircraft data, since no clients currently connected."
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Schedule fetching own reported Opensky aircraft data every 3 seconds
cron.schedule("*/3 * * * * *", async () => {
  try {
    if (getNumOfClients(socketIo) > 0) {
      console.log(
        chalk.greenBright(`[Own Reported] `),
        "Running scheduled task to get my receiver reported aircraft data."
      );
      await getOwnReportedAircraft(38.7219, -114.2791, 42.3219, -109.5991);
      await emitAllAircraftForAllSockets();
    } else {
      console.log(
        "Skipping scheduled task to get my receiver reported aircraft data, since no clients currently connected."
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

//////////////////////////////////////////////
//  Config server on port
//////////////////////////////////////////////
// Open door to server with .listen()
// ViteExpress.listen(app, config.SERVER_PORT, async () =>
//   console.log(`Server running, view at http://localhost:${config.SERVER_PORT}`)
// );

server.listen(socketConfig.SOCKET_PORT, () => {
  console.log(`Server running at`, chalk.blue(socketUrl));
});

ViteExpress.bind(app, server);

//
//
// const delaySeconds = 5;
// setTimeout(async () => {
//   console.log(`Delayed for ${delaySeconds} seconds.`);
//   // const allAircraft = await queryAllAircraft();
//   emitAllAircraftForAllSockets();
//   // socketIo.emit("all_aircraft", allAircraft);
// }, delaySeconds * 1000);

export default socketIo;
