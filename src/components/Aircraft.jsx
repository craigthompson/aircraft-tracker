import { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { unixSecondsToLocal } from "../../utils/timeAndDate";
import {
  toMilesPerHour,
  toFeetPerMinute,
  toKnots,
} from "../../utils/velocity.js";
import { metersToFeet } from "../../utils/distance.js";
import { IoMdAirplane } from "react-icons/io";

/**
 * Aircraft map marker at the given geographical coordinates.
 *
 * @component
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
}) => {
  const iconColor = () => {
    const altitudeFeet = metersToFeet(baroAltitude);
    if (onGround) {
      return "text-gray-500";
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

  const aircraftIcon = () =>
    L.divIcon({
      html: ReactDOMServer.renderToString(
        <IoMdAirplane
          className={`${iconColor()} text-4xl`}
          style={{ transform: `rotate(${trueTrack}deg)` }}
        />
      ),
      className: "", // Ensure no additional classes affect the styling
      iconSize: [24, 24], // Size of the icon (adjust as needed)
      iconAnchor: [12, 24], // Point of the icon which will correspond to marker's location
    });

  // Lat and lon can be null, so only render if both truthy
  if (latitude && longitude) {
    return (
      <Marker position={[latitude, longitude]} icon={aircraftIcon()}>
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
          <div>
            {verticalRate != null &&
              `Climb rate: ${toFeetPerMinute(verticalRate).toFixed(2)} fpm`}
          </div>
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
