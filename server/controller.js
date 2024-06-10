import { queryAllAircraft } from "../database/queries.js";
import socketIo from "./index.js";

//////////////////////////////////////////////
//  Handler Functions
//////////////////////////////////////////////
const handlerFunctions = {
  getAllAircraft: async (req, res) => {
    const allAircraft = await queryAllAircraft();
    // console.log(allAircraft);
    res.status(200).send(allAircraft);
  },

  getAllAircraftForSocket: async () => {
    const allAircraft = await queryAllAircraft();
    socketIo.emit("all_aircraft", allAircraft);
  },
};

export default handlerFunctions;
