import { queryAllAircraft, queryWatchedAircraft } from "../database/queries.js";

//////////////////////////////////////////////
//  Handler Functions
//////////////////////////////////////////////
const handlerFunctions = {
  getAllAircraft: async (req, res) => {
    const allAircraft = await queryAllAircraft();
    // console.log(allAircraft);
    res.status(200).send(allAircraft);
  },

  getWatchedAircraft: async (req, res) => {
    const watchedAircraft = await queryWatchedAircraft();
    res.status(200).send(watchedAircraft);
  },
};

export default handlerFunctions;
