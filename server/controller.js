import { queryAllAircraft } from "../database/queries.js";

//////////////////////////////////////////////
//  Handler Functions
//////////////////////////////////////////////
const handlerFunctions = {
  getAllAircraft: async (req, res) => {
    const allAircraft = await queryAllAircraft();
    // console.log(allAircraft);
    res.status(200).send(allAircraft);
  },
};

export default handlerFunctions;
