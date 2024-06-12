import { queryAllAircraft } from "../database/queries.js";
import chalk from "chalk";
import socketIo from "./index.js";

//////////////////////////////////////////////
//  Helper Functions
//////////////////////////////////////////////
/**
 * Returns an array of the socket IDs of a given server.
 *
 * @param {server} server - to get the current socket IDs from.
 * @returns {array} array of socket IDs (strings).
 */
export const getIdsOfServerSockets = (server) => {
  const arrIds = [];
  server.sockets.sockets.forEach((socket) => arrIds.push(socket.id));
  return arrIds;
};

/**
 * Returns an array of the client IDs of a given server.
 *
 * @param {server} server - to get the current client IDs from.
 * @returns {array} array of client IDs (strings).
 */
export const getIdsOfServerClients = (server) => {
  const arrIds = [];
  for (const [key, value] of Object.entries(server.eio.clients)) {
    arrIds.push(key);
  }
  return arrIds;
};

/**
 * Returns the number of sockets currently on given server.
 *
 * @param {server} server - to get the current number of sockets from
 * @returns {number} number of sockets on given server
 */
export const getNumOfSockets = (server) => {
  return server.sockets.sockets.size;
};

/**
 * Returns the number of clients currently connected on given server.
 *
 * @param {server} server - to get the current number of clients from
 * @returns {number} number of clients on given server
 */
export const getNumOfClients = (server = socketIo) => {
  return server.eio.clientsCount;
};

//////////////////////////////////////////////
//  Handler Functions
//////////////////////////////////////////////
const socketHandlerFunctions = {
  /**
   * Queries database for all aircraft and then emits (sends) them
   * over the given socket as an "all_aircraft" event.
   *
   * @param {socket} socket - the socket to send the event data on
   */
  emitAllAircraftToSingleSocket: async (socket) => {
    const allAircraft = await queryAllAircraft();
    socket.emit("all_aircraft", allAircraft);
    console.log(
      chalk.cyan("[Socket Emit]"),
      "Sent aircraft data to newly connected socket, socket id:",
      socket.id
    );
  },

  /**
   * Queries database for all aircraft and then emits (sends) them
   * over the server as an "all_aircraft" event. This sends to all
   * sockets connected on the server.
   */
  emitAllAircraftForAllSockets: async () => {
    const allAircraft = await queryAllAircraft();
    socketIo.emit("all_aircraft", allAircraft);
    console.log(
      chalk.blue("[Server Emit]"),
      `Sent aircraft data to ${getNumOfClients(
        socketIo
      )} clients, on ${getNumOfSockets(socketIo)} sockets:`,
      `\n\tClients:`,
      getIdsOfServerClients(socketIo),
      `\n\tSockets:`,
      getIdsOfServerSockets(socketIo)
    );
  },
};

export default socketHandlerFunctions;
