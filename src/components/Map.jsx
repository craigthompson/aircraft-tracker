import {
  MapContainer,
  TileLayer,
  LayersControl,
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
      key={plane.icao24}
      totalAircraft={allAircraft.length}
      allAircraft={allAircraft}
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

  // const getData = async () => {
  //   const { data } = await axios.get("/api/aircraft/all");
  //   setAllAircraft(data);
  // };

  const { BaseLayer } = LayersControl;

  const openAipClientId = import.meta.env.VITE_OPENAIP_CLIENT_ID;

  return (
    <div id="map" className="h-lvh w-10/12">
      <MapContainer
        center={[40.7909957, -111.9851671]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100vh" }}
      >
        <LayersControl>
          <BaseLayer checked name="ArcGIS Esri Topo">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
          <BaseLayer name="ArcGIS Esri Imagery">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
          <BaseLayer name="ArcGIS Esri World Gray Canvas">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              minNativeZoom={2}
              maxNativeZoom={16}
            />
          </BaseLayer>
          <BaseLayer name="Open Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Alidade Satellite">
            <TileLayer
              attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
              minNativeZoom={2}
              maxNativeZoom={18}
            />
          </BaseLayer>
          <BaseLayer name="Alidade Smooth">
            <TileLayer
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              minNativeZoom={2}
              maxNativeZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="Alidade Smooth Dark">
            <TileLayer
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              minNativeZoom={2}
              maxNativeZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="Stamen Toner Lite">
            <TileLayer
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
              minNativeZoom={2}
              maxNativeZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="Stamen Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
              minNativeZoom={2}
              maxNativeZoom={18}
            />
          </BaseLayer>
          <BaseLayer name="Stamen Terrain (No Labels)">
            <TileLayer
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png"
              minNativeZoom={2}
              maxNativeZoom={18}
            />
          </BaseLayer>
          <BaseLayer name="CartoDB Positron Light">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              minNativeZoom={2}
              maxNativeZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="CartoDB Dark Matter">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              minNativeZoom={2}
              maxNativeZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="CartoDB Dark Matter (No Labels)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
              minNativeZoom={2}
              maxNativeZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="USGS Imagery">
            <TileLayer
              attribution="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"
              url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"
              minNativeZoom={2}
              maxNativeZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="USGS Topo">
            <TileLayer
              attribution='Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
              url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}"
              minNativeZoom={2}
              maxNativeZoom={19}
            />
          </BaseLayer>
          {/* <BaseLayer name="Aeronautical Chart"> */}
          <LayersControl.Overlay checked name="Aeronautical Chart">
            <TileLayer
              url={`https://api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=${openAipClientId}`}
              attribution='&copy; <a href="https://www.openaip.net/">OpenAIP</a>'
            />
            {/* </BaseLayer> */}
          </LayersControl.Overlay>
        </LayersControl>
        <MyLocationMarker />
        {/* <Aircraft lat={40.7909957} lon={-111.9851671} /> */}
        {allAircraftInstances}
      </MapContainer>
    </div>
  );
}

export default Map;
