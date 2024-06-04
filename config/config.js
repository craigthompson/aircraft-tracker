import "dotenv/config";

const config = {
  SERVER_PORT: 8001,
  DB_PASSWORD: process.env.DATABASE_PASSWORD,
  DB_USER: process.env.DATABASE_USER,
};

export default config;
