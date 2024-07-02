import os from "node:os";

// const ipAddress = os.networkInterfaces().en0[1].address; // TODO: can remove this later if wanted

const socketConfig = {
  SOCKET_PORT: 3000,
  SOCKET_PROD_URL_DOMAIN: "REPLACE-WITH-DEPLOYED-DOMAIN-URL", // TODO: When deploying, set this to correct value
  SOCKET_DEV_URL_DOMAIN: "http://localhost",
  // SOCKET_DEV_URL_DOMAIN: `http://192.168.10.184`, // At office IP. TODO: can remove this later if wanted
  // SOCKET_DEV_URL_DOMAIN: `192.168.1.243`, // At home IP. TODO: can remove this later if wanted
};

export default socketConfig;
