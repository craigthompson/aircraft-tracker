import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import Leaflet from "leaflet";
import MyLocationMarker from "./MyLocationMarker";
import Aircraft from "./Aircraft";

// Fix for missing marker icons in Webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = Leaflet.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

Leaflet.Marker.prototype.options.icon = DefaultIcon;

function Map() {
  return (
    <div id="map" style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[40.7909957, -111.9851671]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "800px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MyLocationMarker />
        <Aircraft lat={40.7909957} lon={-111.9851671} />
      </MapContainer>
    </div>
  );
}

export default Map;
