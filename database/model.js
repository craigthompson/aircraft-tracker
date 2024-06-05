import { DataTypes, Model } from "sequelize";
import util from "util";
import url from "url";
import connectToDB from "./db.js";
import config from "../config/config.js";

const db = await connectToDB(`postgresql:///${config.DB_NAME}`);

export class Aircraft extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Aircraft.init(
  {
    aircraftId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    icao24: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    callsign: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    originCountry: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    timePosition: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lastContact: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    baroAltitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    onGround: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    velocity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    trueTrack: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    verticalRate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sensors: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    geoAltitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    squawk: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    spi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    positionSource: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    modelName: "Aircraft",
    sequelize: db,
  }
);

// Only execute if this file is run directly
if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  console.log(`Syncing ${config.DB_NAME} database...`);
  await db.sync();
  console.log("Finished syncing database!");
}

export default db;
