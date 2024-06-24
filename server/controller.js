import {
  queryAllAircraft,
  queryWatchedAircraft,
  deleteWatchedAircraft,
} from "../database/queries.js";

import { createWatchedAircraft } from "../database/watchedAircraft.js";

//////////////////////////////////////////////
//  Handler Functions
//////////////////////////////////////////////
const handlerFunctions = {
  getAllAircraft: async (req, res) => {
    const allAircraft = await queryAllAircraft();
    res.status(200).send(allAircraft);
  },

  getWatchedAircraft: async (req, res) => {
    const watchedAircraft = await queryWatchedAircraft();
    res.status(200).send(watchedAircraft);
  },

  addWatchedAircraft: async (req, res) => {
    try {
      const callsignWithoutWhitespace = req.body.callsign.replace(/\s/g, "");
      const callsignUpperCase = callsignWithoutWhitespace.toUpperCase();
      const watchedAircraft = await createWatchedAircraft(callsignUpperCase);
      res.status(200).send(watchedAircraft);
    } catch (error) {
      console.error("Error in processing request:", error);
      const watchedAircraft = await queryWatchedAircraft();
      res.status(200).send(watchedAircraft);
    }
  },

  deleteWatchedAircraft: async (req, res) => {
    await deleteWatchedAircraft(req.params.id);
    const watchedAircraft = await queryWatchedAircraft();
    res.status(200).send(watchedAircraft);
  },
};

export default handlerFunctions;
