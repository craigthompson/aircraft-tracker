//////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////
import express from "express";
import ViteExpress from "vite-express";
import config from "../config/config.js";
import "dotenv/config";
import handlerFunctions from "./controller.js";

import http from "http";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";

import { queryAllAircraft } from "../database/queries.js";

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
const { getAllAircraft, getAllAircraftForSocket } = handlerFunctions;

app.get("/api/aircraft/all", getAllAircraft);

//////////////////////////////////////////////
//  Socket.io Events
//////////////////////////////////////////////
// Handle WebSocket connections
socketIo.on("connection", (socket) => {
  console.log("A user connected. Socket ID:", socket.id);
  // console.log("Sending all aircraft through socket");
  // socket.emit;
  // getAllAircraftForSocket();

  socket.on("disconnect", () => {
    console.log("User disconnected. Socket ID:", socket.id);
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
setTimeout(async () => {
  console.log("Delayed for 2 second.");
  // const allAircraft = await queryAllAircraft();
  getAllAircraftForSocket();
  // socketIo.emit("all_aircraft", allAircraft);
}, "2000");

export default socketIo;
