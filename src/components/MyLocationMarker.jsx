import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import Leaflet from "leaflet";

// Fix for missing marker icons in Webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = Leaflet.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [25 / 2, 41 / 2], // Point of the icon which will correspond to marker's
});

Leaflet.Marker.prototype.options.icon = DefaultIcon;

function MyLocationMarker() {
  const [myPosition, setMyPosition] = useState(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setMyPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return myPosition === null ? null : (
    <Marker position={myPosition}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default MyLocationMarker;
