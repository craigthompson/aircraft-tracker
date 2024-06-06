//////////////////////////////////////////////
//  Imports
//////////////////////////////////////////////
import express from "express";
import ViteExpress from "vite-express";
import config from "../config/config.js";
import "dotenv/config";
import handlerFunctions from "./controller.js";

//////////////////////////////////////////////
//  Express instance and Middleware
//////////////////////////////////////////////
// Create Express instance
const app = express();

// Set up middleware
app.use(express.json());

//////////////////////////////////////////////
//  Endpoints
//////////////////////////////////////////////
// TODO: Consider making my API require authorization, to prevent attacks that could max out my allowed rate limits with my external API providers (i.e. OpenSky).
const { getAllAircraft } = handlerFunctions;

app.get("/api/aircraft/all", getAllAircraft);

//////////////////////////////////////////////
//  Config server on port
//////////////////////////////////////////////
// Open door to server with .listen()
ViteExpress.listen(app, config.SERVER_PORT, async () =>
  console.log(`Server running, view at http://localhost:${config.SERVER_PORT}`)
);
