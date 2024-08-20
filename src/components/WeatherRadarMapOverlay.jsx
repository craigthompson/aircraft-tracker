import React, { useRef } from "react";
import { TileLayer, LayersControl, useMapEvent } from "react-leaflet";

const WeatherRadarMapOverlay = ({ name, url }) => {
  const tileLayerRef = useRef();

  // Using map event to handle bringToFront when the overlay is added or another map event occurs.
  //    bringToFront will bring the layer to the top of all overlays.
  useMapEvent("overlayadd", (e) => {
    if (tileLayerRef.current) {
      tileLayerRef.current.bringToFront();
    }
  });

  return (
    <LayersControl.Overlay name={name}>
      <TileLayer
        ref={tileLayerRef}
        attribution="RainViewer.com"
        url={url}
        opacity={0.7}
      />
    </LayersControl.Overlay>
  );
};

export default WeatherRadarMapOverlay;
