import React, { useRef, useState } from "react";
import { TileLayer, LayersControl, useMapEvent } from "react-leaflet";
import RadarLegend from "./RadarLegend";

const WeatherRadarMapOverlay = ({ name, url }) => {
  const tileLayerRef = useRef();
  const [isEnabled, setIsEnabled] = useState(false);

  useMapEvent("overlayadd", (e) => {
    if (e.name === name && tileLayerRef.current) {
      tileLayerRef.current.bringToFront();
    }
    if (e.name === name) setIsEnabled(true);
  });

  useMapEvent("overlayremove", (e) => {
    if (e.name === name) setIsEnabled(false);
  });

  return (
    <>
      <LayersControl.Overlay name={name}>
        <TileLayer
          ref={tileLayerRef}
          attribution="RainViewer.com"
          url={url}
          opacity={0.7}
          maxNativeZoom={7}
        />
      </LayersControl.Overlay>
      {isEnabled && <RadarLegend />}
    </>
  );
};

export default WeatherRadarMapOverlay;
