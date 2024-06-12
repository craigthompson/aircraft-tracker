import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { unixSecondsToLocal } from "../../utils/timeAndDate";
import {
  toMilesPerHour,
  toFeetPerMinute,
  toKnots,
} from "../../utils/velocity.js";
import { metersToFeet } from "../../utils/distance.js";
import { IoMdAirplane } from "react-icons/io";

/**
 * Aircraft map marker at the given geographical coordinates
 * with popup showing additional given aircraft details.
 *
 * @component
 * @param {Object} props - The component given properties
 * @param {Number} props.aircraftId - The unique primary key of the aircraft
 *   in the database.
 * @param {String} props.icao24 - Unique ICAO 24-bit address of the
 *   transponder in hex string representation. (up to 12 chars)
 * @param {String} props.callsign - Callsign of the vehicle (8 chars). Can be
 *   null if no callsign has been received.
 * @param {String} props.originCountry - Country name inferred from the ICAO
 *   24-bit address. (up to 100 chars)
 * @param {Integer} props.timePosition - Unix timestamp (seconds) for the
 *     last position update.
 *   Can be null if no position report was received by OpenSky within the
 *     past 15s.
 * @param {Integer} props.lastContact - Unix timestamp (seconds) for the last
 *     update in general.
 *   This field is updated for any new, valid message received from the
 *     transponder.
 * @param {Float} props.longitude - WGS-84 longitude in decimal degrees.
 *   Can be null.
 * @param {Float} props.latitude - WGS-84 latitude in decimal degrees.
 *   Can be null.
 * @param {Float} props.baroAltitude - Barometric altitude in meters.
 *   Can be null.
 * @param {Boolean} props.onGround - Boolean value which indicates if the
 *     position was retrieved from a surface position report.
 *   Seems to be determined on OpenSky's side by the velocity of the
 *     aircraft. If fast enough, < ~50kts, considered to be on the ground.
 * @param {Float} props.velocity - Velocity over ground in m/s.
 *   Can be null.
 * @param {Float} props.trueTrack - True track in decimal degrees clockwise
 *     from north (north=0°).
 *   Can be null.
 * @param {Float} props.verticalRate - Vertical rate in m/s.
 *   A positive value indicates that the airplane is climbing, a negative
 *     value indicates that it descends.
 *   Can be null.
 * @param {Integer} props.sensors - IDs of the receivers which contributed to
 *     this state vector.
 *   Is null if no filtering for sensor was used in the request.
 * @param {Float} props.geoAltitude - Geometric altitude in meters.
 *   Can be null.to
 * @param {String} props.squawk - The transponder code aka Squawk.
 *   Can be null. (up to 4 chars)
 * @param {Boolean} props.spi - Whether flight status indicates special
 *   purpose indicator.
 * @param {Integer} props.positionSource - Origin of this state’s position:
 *   0 = ADS-B
 *   1 = ASTERIX
 *   2 = MLAT
 *   3 = FLARM
 * @param {Integer} props.vehicleCategory - Aircraft category:
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
 *
 * @returns {JSX.Element} The rendered map marker component.
 */
const Aircraft = ({
  icao24,
  callsign,
  lastContact,
  latitude,
  longitude,
  baroAltitude,
  onGround,
  velocity,
  trueTrack,
  verticalRate,
  geoAltitude,
  zIndex,
  totalAircraft,
  allAircraft,
}) => {
  const map = useMap();
  const altitudeFeet = metersToFeet(baroAltitude);
  const climbRateFpm = toFeetPerMinute(verticalRate).toFixed(2);

  const [grounded, setGrounded] = useState(onGround);
  const [mapState, setMapState] = useState(useMap());
  const [mapView, setMapView] = useState({
    center: map.getCenter(),
    zoom: map.getZoom(),
  });
  // const markerZIndex = React.useRef(zIndex);

  const iconColor = () => {
    if (onGround) {
      return "text-gray-600 drop-shadow-md";
    } else if (altitudeFeet < 5000) {
      return `text-sky-900`;
    } else if (altitudeFeet < 10000) {
      return `text-sky-700`;
    } else if (altitudeFeet < 15000) {
      return `text-sky-600`;
    } else if (altitudeFeet < 20000) {
      return `text-sky-500`;
    } else if (altitudeFeet < 25000) {
      return `text-sky-400`;
    } else {
      return `text-cyan-400`;
    }
  };

  const iconOutline = () => {
    const minClimbRateFactor = 50;

    function mapValue(x, a, b, c, d) {
      return c + ((x - a) * (d - c)) / (b - a);
    }

    // Define the original and new ranges
    const originalMin = minClimbRateFactor;
    const originalMax = 1500;
    const newMin = 100;
    const newMax = 255;

    // Example usage
    const climbRate = 1000; // This is the value you want to map
    const mappedValue = mapValue(
      Math.abs(climbRateFpm),
      originalMin,
      originalMax,
      newMin,
      newMax
    );

    const colorBrightness = Math.min(Math.round(mappedValue), 255);
    if (climbRateFpm <= -minClimbRateFactor) {
      // return "outline outline-offset-2 outline-red-400";
      return `rgba(${colorBrightness}, 0, 0, 0.9)`;
    } else if (climbRateFpm >= minClimbRateFactor) {
      // return "outline outline-offset-2 outline-green-400";
      return `rgba(0, ${colorBrightness}, 0, 0.9)`;
    }
    return "";
  };

  let dropShadow;
  switch (Math.floor(altitudeFeet / 1000)) {
    case 0:
      dropShadow = "drop-shadow-0md";
      break;
    case 1:
      dropShadow = "drop-shadow-1md";
      break;
    case 2:
      dropShadow = "drop-shadow-2md";
      break;
    case 3:
      dropShadow = "drop-shadow-3md";
      break;
    case 4:
      dropShadow = "drop-shadow-4md";
      break;
    case 5:
      dropShadow = "drop-shadow-5md";
      break;
    case 6:
      dropShadow = "drop-shadow-6md";
      break;
    case 7:
      dropShadow = "drop-shadow-7md";
      break;
    case 8:
      dropShadow = "drop-shadow-8md";
      break;
    case 9:
      dropShadow = "drop-shadow-9md";
      break;
    case 10:
      dropShadow = "drop-shadow-10md";
      break;
    case 11:
      dropShadow = "drop-shadow-11md";
      break;
    case 12:
      dropShadow = "drop-shadow-12md";
      break;
    case 13:
      dropShadow = "drop-shadow-13md";
      break;
    case 14:
      dropShadow = "drop-shadow-14md";
      break;
    case 15:
      dropShadow = "drop-shadow-15md";
      break;
    case 16:
      dropShadow = "drop-shadow-16md";
      break;
    case 17:
      dropShadow = "drop-shadow-17md";
      break;
    case 18:
      dropShadow = "drop-shadow-18md";
      break;
    case 19:
      dropShadow = "drop-shadow-19md";
      break;
    case 20:
      dropShadow = "drop-shadow-20md";
      break;
    case 21:
      dropShadow = "drop-shadow-21md";
      break;
    case 22:
      dropShadow = "drop-shadow-22md";
      break;
    case 23:
      dropShadow = "drop-shadow-23md";
      break;
    case 24:
      dropShadow = "drop-shadow-24md";
      break;
    case 25:
      dropShadow = "drop-shadow-25md";
      break;
    case 26:
      dropShadow = "drop-shadow-26md";
      break;
    case 27:
      dropShadow = "drop-shadow-27md";
      break;
    case 28:
      dropShadow = "drop-shadow-28md";
      break;
    case 29:
      dropShadow = "drop-shadow-29md";
      break;
    default:
      dropShadow = "drop-shadow-30md";
  }

  const aircraftIcon = () =>
    L.divIcon({
      html: ReactDOMServer.renderToString(
        <>
          <IoMdAirplane
            className={`${iconColor()} text-4xl ${iconOutline()}`}
            style={{
              transform: `rotate(${trueTrack}deg)`,
              filter: `drop-shadow(0 0px 2px ${iconOutline()}) drop-shadow(0 0 1px rgba(255, 255, 255, 1))`,
            }}
          />
          <span
            className="p-0.5 rounded filter-none"
            style={{
              backgroundColor: `rgba(255, 255, 255, 0.65)`,
              boxShadow: `0 0 6px rgba(255, 255, 255, 0.8)`,
            }}
          >
            {callsign}
          </span>
        </>
      ),
      // className: ``, // Ensures no additional classes affect the styling
      className: dropShadow, // Ensures no additional classes affect the styling
      iconSize: [36, 36], // Size of the icon
      iconAnchor: [18, 18], // Point of the icon which will correspond to marker's location
    });

  // TODO: Remove later
  if (icao24.toUpperCase() === "AB39E9" || icao24.toUpperCase() === "AB9A32") {
    console.log(
      "Aircraft:",
      icao24.toUpperCase(),
      "altitude:",
      altitudeFeet,
      "latitude:",
      latitude,
      "z-index:",
      zIndex,
      "lat lon:"
    );
  }

  useMapEvents({
    moveend: () => {
      setMapView({
        center: map.getCenter(),
        zoom: map.getZoom(),
      });
    },
    zoomend: () => {
      setMapView({
        center: map.getCenter(),
        zoom: map.getZoom(),
      });
    },
  });

  let markerLayerPoint;
  const [adjustedZOffset, setAdjustedZOffset] = useState(0);

  useEffect(() => {
    // Get the (x, y) pixel based coordinate of the marker's point on the map
    markerLayerPoint = map.latLngToLayerPoint([latitude, longitude]);
    // Calculates a value that when Leaflet calculates z-index will result in our intended z-index
    // adjustedZOffset = zIndex - markerLayerPoint.y;
    setAdjustedZOffset(zIndex - markerLayerPoint.y);

    // TODO: Remove later
    if (icao24.toUpperCase() === "A34E9D") {
      console.log("latLngToLayerPoint:", markerLayerPoint);
      console.log("Calculated z-offset:", adjustedZOffset);
    }
  }, [mapView, allAircraft]);

  // Lat and lon can be null, so only render if both truthy
  if (latitude && longitude) {
    return (
      <Marker
        position={[latitude, longitude]}
        icon={aircraftIcon()}
        zIndexOffset={adjustedZOffset}
        title={callsign.trim()}
        riseOnHover={true}
        // Make the z offset for a hovered plane higher than any other plane on the map
        riseOffset={totalAircraft + 1}
      >
        <Popup>
          <div>ICAO24: {icao24.toUpperCase()}</div>
          <div>{callsign != null && `Callsign: ${callsign.toUpperCase()}`}</div>
          <div>
            {baroAltitude != null &&
              `Altitude: ${metersToFeet(baroAltitude).toFixed(2)} ft`}
          </div>
          <div>
            {velocity != null &&
              `Speed: ${toMilesPerHour(velocity).toFixed(2)} mph (${toKnots(
                toMilesPerHour(velocity)
              ).toFixed(2)} kts)`}
          </div>
          <div>
            {geoAltitude != null && `Altitude: ${geoAltitude.toFixed(2)} ft`}
          </div>
          <div>{verticalRate != null && `Climb rate: ${climbRateFpm} fpm`}</div>
          <div>{trueTrack != null && `Track: ${trueTrack} deg`}</div>
          Last Contact: {unixSecondsToLocal(lastContact)}
        </Popup>
      </Marker>
    );
  } else {
    return null;
  }
};

export default Aircraft;
