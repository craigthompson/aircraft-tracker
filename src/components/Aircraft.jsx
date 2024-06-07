import { Marker, Popup } from "react-leaflet";
import { unixSecondsToLocal } from "../../utils/timeAndDate";
import {
  metersToFeet,
  milesPerHour,
  feetPerMinute,
} from "../../utils/metricToImperial.js";

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
  // Lat and lon can be null, so only render if both truthy
  if (latitude && longitude) {
    return (
      <Marker position={[latitude, longitude]}>
        <Popup>
          <div>ICAO24: {icao24.toUpperCase()}</div>
          <div>{callsign != null && `Callsign: ${callsign.toUpperCase()}`}</div>
          <div>
            {baroAltitude != null &&
              `Altitude: ${metersToFeet(baroAltitude).toFixed(2)} ft`}
          </div>
          <div>
            {velocity != null &&
              `Speed: ${milesPerHour(velocity).toFixed(2)} mph`}
          </div>
          <div>
            {geoAltitude != null && `Altitude: ${geoAltitude.toFixed(2)} ft`}
          </div>
          <div>
            {verticalRate != null &&
              `Climb rate: ${feetPerMinute(verticalRate).toFixed(2)} fpm`}
          </div>
          Last Contact: {unixSecondsToLocal(lastContact)}
        </Popup>
      </Marker>
    );
  } else {
    return null;
  }
};

export default Aircraft;
