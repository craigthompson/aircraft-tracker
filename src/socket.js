import { io } from "socket.io-client";
import socketConfig from "../config/socket.config";

const URL = (() => {
  if (import.meta.env.MODE === "development") {
    return `${socketConfig.SOCKET_DEV_URL_DOMAIN}:${socketConfig.SOCKET_PORT}`;
  } else {
    return `${socketConfig.SOCKET_PROD_URL_DOMAIN}:${socketConfig.SOCKET_PORT}`;
  }
})();

export const socket = io(URL, {
  withCredentials: true,
});
