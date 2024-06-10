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

const {
  emitAllAircraftForNewlyConnectedSocket: getAllAircraftForNewlyConnectedClient,
  emitAllAircraftForAllSockets: getAllAircraftForSocket,
} = socketHandlerFunctions;

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
  getAllAircraftForNewlyConnectedClient(socket);

  socket.on("disconnect", () => {
    console.log(
      chalk.cyan("[Socket Event]"),
      "User disconnected. Socket ID:",
      socket.id
    );
  });
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
const delaySeconds = 5;
setTimeout(async () => {
  console.log(`Delayed for ${delaySeconds} seconds.`);
  // const allAircraft = await queryAllAircraft();
  getAllAircraftForSocket();
  // socketIo.emit("all_aircraft", allAircraft);
}, delaySeconds * 1000);

export default socketIo;
