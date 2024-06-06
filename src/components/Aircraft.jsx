import { Marker, Popup } from "react-leaflet";

/**
 * Aircraft map marker at the given geographical coordinates.
 *
 * @param {float} lat - the latitude of the aircraft location
 * @param {float} lon - longitude of the aircraft's location
 * @component
 */
const Aircraft = ({ lat, lon }) => {
  // console.log("*** Aircraft component:", lat, lon); // TODO: remove later
  return (
    <Marker position={[lat, lon]}>
      <Popup>A pretty popup</Popup>
    </Marker>
  );
};

export default Aircraft;
