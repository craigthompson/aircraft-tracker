import os from "node:os";

// const ipAddress = os.networkInterfaces().en0[1].address; // TODO: can remove this later if wanted

const socketConfig = {
  SOCKET_PORT: 3000,
  SOCKET_PROD_URL_DOMAIN: "REPLACE-WITH-DEPLOYED-DOMAIN-URL", // TODO: After deploying, set this to correct value
  SOCKET_DEV_URL_DOMAIN: "http://localhost",
  // SOCKET_DEV_URL_DOMAIN: `http://192.168.1.243`, // TODO: can remove this later if wanted
};

export default socketConfig;
