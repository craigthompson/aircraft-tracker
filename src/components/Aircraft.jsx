import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { unixSecondsToLocal } from "../../utils/timeAndDate";
import {
  toMilesPerHour,
  toFeetPerMinute,
  toKnots,
} from "../../utils/velocity.js";
import { metersToFeet } from "../../utils/distance.js";
import { IoMdAirplane } from "react-icons/io";

/**
 * Aircraft map marker at the given geographical coordinates.
 *
 * @component
 */
const Aircraft = ({
  icao24,
  callsign,
  lastContact,
  latitude,
  longitude,
  baroAltitude,
  onGround,
  velocity,
  trueTrack,
  verticalRate,
  geoAltitude,
  zIndex,
  allAircraft,
}) => {
  const map = useMap();
  const [grounded, setGrounded] = useState(onGround);
  const altitudeFeet = metersToFeet(baroAltitude);
  // const [mapState, setMapState] = useState(useMap());
  const [mapState, setMapState] = useState(useMap());
  const [mapView, setMapView] = useState({
    center: map.getCenter(),
    zoom: map.getZoom(),
  });
  // const markerZIndex = React.useRef(zIndex);

  const iconColor = () => {
    if (onGround) {
      return "text-gray-400";
    } else if (altitudeFeet < 5000) {
      return `text-sky-900`;
    } else if (altitudeFeet < 10000) {
      return `text-sky-700`;
    } else if (altitudeFeet < 15000) {
      return `text-sky-600`;
    } else if (altitudeFeet < 20000) {
      return `text-sky-500`;
    } else if (altitudeFeet < 25000) {
      return `text-sky-400`;
    } else {
      return `text-cyan-400`;
    }
  };

  let dropShadow;
  switch (Math.floor(altitudeFeet / 1000)) {
    case 0:
      dropShadow = "drop-shadow-0md";
      break;
    case 1:
      dropShadow = "drop-shadow-1md";
      break;
    case 2:
      dropShadow = "drop-shadow-2md";
      break;
    case 3:
      dropShadow = "drop-shadow-3md";
      break;
    case 4:
      dropShadow = "drop-shadow-4md";
      break;
    case 5:
      dropShadow = "drop-shadow-5md";
      break;
    case 6:
      dropShadow = "drop-shadow-6md";
      break;
    case 7:
      dropShadow = "drop-shadow-7md";
      break;
    case 8:
      dropShadow = "drop-shadow-8md";
      break;
    case 9:
      dropShadow = "drop-shadow-9md";
      break;
    case 10:
      dropShadow = "drop-shadow-10md";
      break;
    case 11:
      dropShadow = "drop-shadow-11md";
      break;
    case 12:
      dropShadow = "drop-shadow-12md";
      break;
    case 13:
      dropShadow = "drop-shadow-13md";
      break;
    case 14:
      dropShadow = "drop-shadow-14md";
      break;
    case 15:
      dropShadow = "drop-shadow-15md";
      break;
    case 16:
      dropShadow = "drop-shadow-16md";
      break;
    case 17:
      dropShadow = "drop-shadow-17md";
      break;
    case 18:
      dropShadow = "drop-shadow-18md";
      break;
    case 19:
      dropShadow = "drop-shadow-19md";
      break;
    case 20:
      dropShadow = "drop-shadow-20md";
      break;
    case 21:
      dropShadow = "drop-shadow-21md";
      break;
    case 22:
      dropShadow = "drop-shadow-22md";
      break;
    case 23:
      dropShadow = "drop-shadow-23md";
      break;
    case 24:
      dropShadow = "drop-shadow-24md";
      break;
    case 25:
      dropShadow = "drop-shadow-25md";
      break;
    case 26:
      dropShadow = "drop-shadow-26md";
      break;
    case 27:
      dropShadow = "drop-shadow-27md";
      break;
    case 28:
      dropShadow = "drop-shadow-28md";
      break;
    case 29:
      dropShadow = "drop-shadow-29md";
      break;
    default:
      dropShadow = "drop-shadow-30md";
  }

  const aircraftIcon = () => {
    const thing = L.divIcon({
      html: ReactDOMServer.renderToString(
        <IoMdAirplane
          className={`${iconColor()} text-4xl`}
          style={{ transform: `rotate(${trueTrack}deg)` }}
        />
      ),
      // className: ``, // Ensures no additional classes affect the styling
      className: dropShadow, // Ensures no additional classes affect the styling
      iconSize: [36, 36], // Size of the icon
      iconAnchor: [18, 18], // Point of the icon which will correspond to marker's location
    });
    console.log("Icon:", thing);
    return thing;
  };

  // TODO: Remove later
  if (icao24.toUpperCase() === "AB39E9" || icao24.toUpperCase() === "AB9A32") {
    console.log(
      "Aircraft:",
      icao24.toUpperCase(),
      "altitude:",
      altitudeFeet,
      "latitude:",
      latitude,
      "z-index:",
      zIndex,
      "lat lon:"
    );
  }

  useMapEvents({
    moveend: () => {
      setMapView({
        center: map.getCenter(),
        zoom: map.getZoom(),
      });
    },
    zoomend: () => {
      setMapView({
        center: map.getCenter(),
        zoom: map.getZoom(),
      });
    },
  });

  let markerLayerPoint;
  const [adjustedZOffset, setAdjustedZOffset] = useState(0);

  useEffect(() => {
    // Get the (x, y) pixel based coordinate of the marker's point on the map
    markerLayerPoint = map.latLngToLayerPoint([latitude, longitude]);
    // Calculates a value that when Leaflet calculates z-index will result in our intended z-index
    // adjustedZOffset = zIndex - markerLayerPoint.y;
    setAdjustedZOffset(zIndex - markerLayerPoint.y);

    // TODO: Remove later
    if (icao24.toUpperCase() === "A34E9D") {
      console.log("latLngToLayerPoint:", markerLayerPoint);
      console.log("Calculated z-offset:", adjustedZOffset);
    }
  }, [mapView, allAircraft]);

  // Lat and lon can be null, so only render if both truthy
  if (latitude && longitude) {
    return (
      <Marker
        position={[latitude, longitude]}
        icon={aircraftIcon()}
        zIndexOffset={adjustedZOffset}
      >
        <Popup>
          <div>ICAO24: {icao24.toUpperCase()}</div>
          <div>{callsign != null && `Callsign: ${callsign.toUpperCase()}`}</div>
          <div>
            {baroAltitude != null &&
              `Altitude: ${metersToFeet(baroAltitude).toFixed(2)} ft`}
          </div>
          <div>
            {velocity != null &&
              `Speed: ${toMilesPerHour(velocity).toFixed(2)} mph (${toKnots(
                toMilesPerHour(velocity)
              ).toFixed(2)} kts)`}
          </div>
          <div>
            {geoAltitude != null && `Altitude: ${geoAltitude.toFixed(2)} ft`}
          </div>
          <div>
            {verticalRate != null &&
              `Climb rate: ${toFeetPerMinute(verticalRate).toFixed(2)} fpm`}
          </div>
          <div>{trueTrack != null && `Track: ${trueTrack} deg`}</div>
          Last Contact: {unixSecondsToLocal(lastContact)}
        </Popup>
      </Marker>
    );
  } else {
    return null;
  }
};

export default Aircraft;
