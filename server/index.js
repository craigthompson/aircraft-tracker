//////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////
import express from "express";
import ViteExpress from "vite-express";
import config from "../config/config.js";
import "dotenv/config";
import handlerFunctions from "./controller.js";
import socketHandlerFunctions from "./socketController.js";
import chalk from "chalk";
import cron from "node-cron";
import { getAircraft } from "./opensky.js";

import http from "http";
import { Server } from "socket.io";

//////////////////////////////////////////////
//  Express instance and Middleware
//////////////////////////////////////////////
// Create Express instance
const app = express();

// HTTP server for socket.io
const server = http.createServer(app);

// Initialize Socket.IO
const socketIo = new Server(server);

// Set up middleware
// app.use(express.json());

//////////////////////////////////////////////
//  Endpoints
//////////////////////////////////////////////
// TODO: Consider making my API require authorization, to prevent attacks that could max out my allowed rate limits with my external API providers (i.e. OpenSky) or with my hosting provider.
const { getAllAircraft } = handlerFunctions;

const { emitAllAircraftForNewlyConnectedSocket, emitAllAircraftForAllSockets } =
  socketHandlerFunctions;

app.get("/api/aircraft/all", getAllAircraft);

//////////////////////////////////////////////
//  Socket.io Events
//////////////////////////////////////////////
// Handle WebSocket connections
socketIo.on("connection", (socket) => {
  console.log(
    chalk.cyan("[Socket Event]"),
    "A user connected. Socket ID:",
    socket.id
  );
  emitAllAircraftForNewlyConnectedSocket(socket);

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
    console.log("Running scheduled task to get aircraft data.");
    // getAircraft(40.579247, -112.2624345, 40.8955744, -111.6382737);
    await getAircraft(38.7219, -114.2791, 42.3219, -109.5991); // Optimized for a single credit on the API
    await emitAllAircraftForAllSockets();
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

server.listen(config.SOCKET_PORT, () => {
  console.log(
    `Socket server running at http://localhost:${config.SOCKET_PORT}`
  );
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
