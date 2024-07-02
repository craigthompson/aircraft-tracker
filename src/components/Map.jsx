import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import MyLocationMarker from "./MyLocationMarker";
import Aircraft from "./Aircraft";
import Legend from "./Legend.jsx";
import CustomLayersControl from "./CustomLayersControl.jsx";
import { socket } from "../socket.js";
import { unixSecondsToLocalTime } from "../../utils/timeAndDate.js";
import WeatherRadarMapOverlay from "./WeatherRadarMapOverlay.jsx";
import "./mapStyles.css";
import axios from "axios";

const RADAR_MAPS_URL = "https://api.rainviewer.com/public/weather-maps.json";

function Map() {
  const [allAircraft, setAllAircraft] = useState([]);
  const [mostRecentWeatherMap, setMostRecentWeatherMap] = useState(null);
  const [mostRecentCloudMap, setMostRecentCloudMap] = useState(null);

  const getMostRecentWeatherMap = async () => {
    console.log("Getting most recent weather data.");
    const { data } = await axios.get(RADAR_MAPS_URL);
    console.log(
      "Weather data timestamp:",
      unixSecondsToLocalTime(data.generated)
    );
    console.log("Weather:", data);
    return data;
  };

  // Radar data changes every 5 minutes.
  // Fetch new weather radar overlay every 60 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      (async () => {
        const data = await getMostRecentWeatherMap();
        setMostRecentWeatherMap(data.radar.nowcast[0].path);
        console.log("infrared:", data.satellite.infrared[0].path);
        setMostRecentCloudMap(data.satellite.infrared[0].path);
      })();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch new weather radar overlay on initial render
  useEffect(() => {
    (async () => {
      const data = await getMostRecentWeatherMap();
      setMostRecentWeatherMap(data.radar.nowcast[0].path);
      console.log("infrared:", data.satellite.infrared[0].path);
      setMostRecentCloudMap(data.satellite.infrared[0].path);
    })();
  }, []);

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

  // Receive updated aircraft data from socket
  useEffect(() => {
    socket.on("all_aircraft", (planes) => {
      console.log("Message from server:", planes);
      setAllAircraft(planes);
    });

    return () => {
      socket.off("all_aircraft");
    };
  }, []);

  const { BaseLayer } = LayersControl;

  const openAipClientId = import.meta.env.VITE_OPENAIP_CLIENT_ID;

  return (
    <div id="map" className="h-lvh w-10/12">
      <MapContainer
        center={[40.7909957, -111.9851671]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100vh" }}
      >
        <CustomLayersControl
          title="Map Layers"
          className="left-aligned-layers-control"
        >
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
          <LayersControl.Overlay checked name="Aeronautical Chart">
            <TileLayer
              url={`https://api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=${openAipClientId}`}
              attribution='&copy; <a href="https://www.openaip.net/">OpenAIP</a>'
            />
          </LayersControl.Overlay>
          <WeatherRadarMapOverlay
            name="Weather Radar"
            url={`https://tilecache.rainviewer.com${mostRecentWeatherMap}/256/{z}/{x}/{y}/2/1_1.png`}
          />
          <LayersControl.Overlay name="Infrared Clouds">
            <TileLayer
              attribution="RainViewer.com"
              url={`https://tilecache.rainviewer.com${mostRecentCloudMap}/256/{z}/{x}/{y}/0/0_0.png`}
              opacity={0.6}
              zIndex={2}
            />
          </LayersControl.Overlay>
        </CustomLayersControl>
        <MyLocationMarker />
        {allAircraftInstances}
        <Legend />
      </MapContainer>
    </div>
  );
}

export default Map;
