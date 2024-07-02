import React, { useRef } from "react";
import { TileLayer, LayersControl, useMapEvent } from "react-leaflet";

const WeatherRadarMapOverlay = ({
  name,
  url,
  attribution,
  opacity,
  zIndex,
}) => {
  const tileLayerRef = useRef(null);

  // Using a map event to handle bringToFront when the overlay is added.
  //  bringToFront will bring the layer to the top of all overlays.
  useMapEvent("overlayadd", (e) => {
    if (e.name === name && tileLayerRef.current) {
      tileLayerRef.current.bringToFront();
    }
  });

  return (
    <LayersControl.Overlay name={name}>
      <TileLayer
        ref={tileLayerRef}
        attribution="RainViewer.com"
        url={url}
        opacity={0.6}
      />
    </LayersControl.Overlay>
  );
};

export default WeatherRadarMapOverlay;
