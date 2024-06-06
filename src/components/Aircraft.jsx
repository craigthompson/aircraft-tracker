import { Marker, Popup } from "react-leaflet";
import { unixSecondsToLocal } from "../../utils/timeAndDate";

/**
 * Aircraft map marker at the given geographical coordinates.
 *
 * @param {float} lat - the latitude of the aircraft location
 * @param {float} lon - longitude of the aircraft's location
 * @component
 */
const Aircraft = ({ icao24, callsign, lastContact, lat, lon }) => {
  // console.log("*** Aircraft component:", lat, lon); // TODO: remove later
  return (
    <Marker position={[lat, lon]}>
      <Popup>
        ICAO24: {icao24.toUpperCase()} <br />
        Callsign: {callsign.toUpperCase()} <br />
        Last Contact: {unixSecondsToLocal(lastContact)}
      </Popup>
    </Marker>
  );
};

export default Aircraft;
