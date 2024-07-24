import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

function MapViewport({ setMapView }) {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      console.log("Zoom level:", map.getZoom());
      console.log("Bounds:", map.getBounds());
      setMapView({
        center: map.getCenter(),
        bounds: map.getBounds(),
        zoom: map.getZoom(),
      });
    },
    zoomend: () => {
      console.log("Zoom level:", map.getZoom());
      console.log("Bounds:", map.getBounds());
      setMapView({
        center: map.getCenter(),
        bounds: map.getBounds(),
        zoom: map.getZoom(),
      });
    },
  });

  useEffect(() => {
    console.log("Zoom level:", map.getZoom());
    console.log("Bounds:", map.getBounds());
    setMapView({
      center: map.getCenter(),
      bounds: map.getBounds(),
      zoom: map.getZoom(),
    });
  }, []);

  return null;
}

export default MapViewport;
