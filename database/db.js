import { Sequelize } from "sequelize";
import config from "../config/config.js";

async function connectToDB(dbURI) {
  console.log(`Connecting to DB: ${dbURI}`);

  const sequelize = new Sequelize(dbURI, {
    logging: console.log,
    logging: false, // set logging: false to disable outputting SQL queries to console
    define: {
      timestamps: false, // don't want created_at or updated_at columns
      underscored: true, // use snake_case rather than camelCase column names
    },
    password: config.DB_PASSWORD,
  });

  try {
    await sequelize.authenticate();
    console.log("Connected to DB successfully!");
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }

  return sequelize;
}

export default connectToDB;
