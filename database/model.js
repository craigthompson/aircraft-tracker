import { DataTypes, Model } from "sequelize";
import util from "util";
import url from "url";
import connectToDB from "./db.js";
import config from "../config/config.js";

const db = await connectToDB(`postgresql:///${config.DB_NAME}`);

/**
 * The aircraft table in the database.
 *
 * @see {@link https://openskynetwork.github.io/opensky-api/rest.html#response} OpenSky Network API documentation.
 */
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
    // Unique ICAO 24-bit address of the transponder in hex string representation.
    icao24: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    // Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
    callsign: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    // Country name inferred from the ICAO 24-bit address.
    originCountry: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // Unix timestamp (seconds) for the last position update.
    // Can be null if no position report was received by OpenSky within the past 15s.
    timePosition: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Unix timestamp (seconds) for the last update in general.
    // This field is updated for any new, valid message received from the transponder.
    lastContact: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // WGS-84 longitude in decimal degrees.
    // Can be null.
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    // WGS-84 latitude in decimal degrees.
    // Can be null.
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    // Barometric altitude in meters.
    // Can be null.
    baroAltitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    // Boolean value which indicates if the position was retrieved from a surface position report.
    onGround: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    // Velocity over ground in m/s.
    // Can be null.
    velocity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    // True track in decimal degrees clockwise from north (north=0°).
    // Can be null.
    trueTrack: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    /**
     * Vertical rate in m/s.
     * A positive value indicates that the airplane is climbing,
     *   a negative value indicates that it descends.
     * Can be null.
     */
    verticalRate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    // IDs of the receivers which contributed to this state vector.
    // Is null if no filtering for sensor was used in the request.
    sensors: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    // Geometric altitude in meters.
    // Can be null.
    geoAltitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    // The transponder code aka Squawk.
    // Can be null.
    squawk: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    // Whether flight status indicates special purpose indicator.
    spi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    /**
     * Origin of this state’s position.
     *   0 = ADS-B
     *   1 = ASTERIX
     *   2 = MLAT
     *   3 = FLARM
     */
    positionSource: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    /**
     * Aircraft category.
     *   0  = No information at all
     *   1  = No ADS-B Emitter Category Information
     *   2  = Light (< 15500 lbs)
     *   3  = Small (15500 to 75000 lbs)
     *   4  = Large (75000 to 300000 lbs)
     *   5  = High Vortex Large (aircraft such as B-757)
     *   6  = Heavy (> 300000 lbs)
     *   7  = High Performance (> 5g acceleration and 400 kts)
     *   8  = Rotorcraft
     *   9  = Glider / sailplane
     *   10 = Lighter-than-air
     *   11 = Parachutist / Skydiver
     *   12 = Ultralight / hang-glider / paraglider
     *   13 = Reserved
     *   14 = Unmanned Aerial Vehicle
     *   15 = Space / Trans-atmospheric vehicle
     *   16 = Surface Vehicle – Emergency Vehicle
     *   17 = Surface Vehicle – Service Vehicle
     *   18 = Point Obstacle (includes tethered balloons)
     *   19 = Cluster Obstacle
     *   20 = Line Obstacle
     */
    vehicleCategory: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
  await db.sync({ force: true });
  console.log("Finished syncing database!");
  await db.close();
}

export default db;
