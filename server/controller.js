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
    const watchedAircraft = await createWatchedAircraft(
      req.body.callsign.toUpperCase()
    );
    res.status(200).send(watchedAircraft);
  },

  deleteWatchedAircraft: async (req, res) => {
    await deleteWatchedAircraft(req.params.id);
    const watchedAircraft = await queryWatchedAircraft();
    res.status(200).send(watchedAircraft);
  },
};

export default handlerFunctions;
