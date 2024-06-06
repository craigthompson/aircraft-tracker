import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Leaflet from "leaflet";
import MyLocationMarker from "./MyLocationMarker";
import Aircraft from "./Aircraft";
import axios from "axios";

// Fix for missing marker icons in Webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = Leaflet.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

function Map() {
  const [allAircraft, setAllAircraft] = useState([]);

  const allAircraftInstances = allAircraft.map((plane) => (
    <Aircraft
      lat={plane.latitude}
      lon={plane.longitude}
      key={plane.aircraftId}
    />
  ));

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await axios.get("/api/aircraft/all");
    setAllAircraft(data);
  };

  return (
    <div id="map" style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[40.7909957, -111.9851671]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100vh", width: "100vw" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MyLocationMarker />
        {/* <Aircraft lat={40.7909957} lon={-111.9851671} /> */}
        {allAircraftInstances}
      </MapContainer>
    </div>
  );
}

export default Map;
