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

import { socket } from "../socket.js";

// // Fix for missing marker icons in Webpack
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";

// let DefaultIcon = Leaflet.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
// });

function Map() {
  const [allAircraft, setAllAircraft] = useState([]);

  const allAircraftInstances = allAircraft.map((plane, index) => (
    <Aircraft
      icao24={plane.icao24}
      callsign={plane.callsign}
      lastContact={plane.lastContact}
      latitude={plane.latitude}
      longitude={plane.longitude}
      baroAltitude={plane.baroAltitude}
      onGround={plane.onGround}
      velocity={plane.velocity}
      trueTrack={plane.trueTrack}
      verticalRate={plane.verticalRate}
      zIndex={index}
      key={plane.aircraftId}
    />
  ));

  useEffect(() => {
    // getData();

    socket.on("all_aircraft", (planes) => {
      console.log("Message from server:", planes);
      setAllAircraft(planes);
    });

    return () => {
      socket.off("all_aircraft");
    };
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
