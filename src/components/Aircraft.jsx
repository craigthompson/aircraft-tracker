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
import {
  iconColor,
  iconOutline,
  aircraftIconDropShadow,
  iconSize,
} from "../../utils/customIcon.js";

/**
 * Aircraft map marker at the given geographical coordinates
 * with popup showing additional given aircraft details.
 *
 * @component
 * @param {Object} props - The component given properties
 * @param {Number} props.aircraftId - The unique primary key of the aircraft
 *   in the database.
 * @param {String} props.icao24 - Unique ICAO 24-bit address of the
 *   transponder in hex string representation. (up to 12 chars)
 * @param {String} props.callsign - Callsign of the vehicle (8 chars). Can be
 *   null if no callsign has been received.
 * @param {String} props.originCountry - Country name inferred from the ICAO
 *   24-bit address. (up to 100 chars)
 * @param {Integer} props.timePosition - Unix timestamp (seconds) for the
 *     last position update.
 *   Can be null if no position report was received by OpenSky within the
 *     past 15s.
 * @param {Integer} props.lastContact - Unix timestamp (seconds) for the last
 *     update in general.
 *   This field is updated for any new, valid message received from the
 *     transponder.
 * @param {Float} props.longitude - WGS-84 longitude in decimal degrees.
 *   Can be null.
 * @param {Float} props.latitude - WGS-84 latitude in decimal degrees.
 *   Can be null.
 * @param {Float} props.baroAltitude - Barometric altitude in meters.
 *   Can be null.
 * @param {Boolean} props.onGround - Boolean value which indicates if the
 *     position was retrieved from a surface position report.
 *   Seems to be determined on OpenSky's side by the velocity of the
 *     aircraft. If fast enough, < ~50kts, considered to be on the ground.
 * @param {Float} props.velocity - Velocity over ground in m/s.
 *   Can be null.
 * @param {Float} props.trueTrack - True track in decimal degrees clockwise
 *     from north (north=0°).
 *   Can be null.
 * @param {Float} props.verticalRate - Vertical rate in m/s.
 *   A positive value indicates that the airplane is climbing, a negative
 *     value indicates that it descends.
 *   Can be null.
 * @param {Integer} props.sensors - IDs of the receivers which contributed to
 *     this state vector.
 *   Is null if no filtering for sensor was used in the request.
 * @param {Float} props.geoAltitude - Geometric altitude in meters.
 *   Can be null.to
 * @param {String} props.squawk - The transponder code aka Squawk.
 *   Can be null. (up to 4 chars)
 * @param {Boolean} props.spi - Whether flight status indicates special
 *   purpose indicator.
 * @param {Integer} props.positionSource - Origin of this state’s position:
 *   0 = ADS-B
 *   1 = ASTERIX
 *   2 = MLAT
 *   3 = FLARM
 * @param {Integer} props.vehicleCategory - Aircraft category:
 *   0  = No information at all
 *   1  = No ADS-B Emitter Category Information
 *   2  = Light (< 15500 lbs)
 *   3  = Small (15500 to 75000 lbs)
 *   4  = Large (75000 to 300000 lbs)
 *   5  = High Vortex Large (aircraft such as B-757)
 *   6  = Heavy (> 300000 lbs)
 *   7  = High Performance (> 5g acceleration and 400 kts)
 *   8  = Rotorcraft
 *   9  = Glider / sailplane
 *   10 = Lighter-than-air
 *   11 = Parachutist / Skydiver
 *   12 = Ultralight / hang-glider / paraglider
 *   13 = Reserved
 *   14 = Unmanned Aerial Vehicle
 *   15 = Space / Trans-atmospheric vehicle
 *   16 = Surface Vehicle – Emergency Vehicle
 *   17 = Surface Vehicle – Service Vehicle
 *   18 = Point Obstacle (includes tethered balloons)
 *   19 = Cluster Obstacle
 *   20 = Line Obstacle
 *
 * @returns {JSX.Element} The rendered map marker component.
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
  totalAircraft,
  allAircraft,
}) => {
  const map = useMap();
  const altitudeFeet = metersToFeet(baroAltitude);
  const climbRateFpm = toFeetPerMinute(verticalRate).toFixed(2);

  const [mapView, setMapView] = useState({
    center: map.getCenter(),
    zoom: map.getZoom(),
  });

  const iconDivSize = iconSize(map.getZoom()).pixelSize;
  const iconClassSize = iconSize(map.getZoom()).cssSize;
  const aircraftIcon = () =>
    L.divIcon({
      html: ReactDOMServer.renderToString(
        <>
          <IoMdAirplane
            className={`${iconColor(altitudeFeet)} ${iconClassSize}`}
            style={{
              transform: `rotate(${trueTrack}deg)`,
              filter: `drop-shadow(0 0px 2px ${iconOutline(
                climbRateFpm
              )}) drop-shadow(0 0 1px rgba(255, 255, 255, 1))`,
            }}
          />
          <span
            className="p-0.5 rounded filter-none"
            style={{
              backgroundColor: `rgba(255, 255, 255, 0.65)`,
              boxShadow: `0 0 6px rgba(255, 255, 255, 0.8)`,
            }}
          >
            {callsign}
          </span>
        </>
      ),
      // className: ``, // Ensures no additional classes affect the styling
      className: aircraftIconDropShadow(altitudeFeet), // Ensures no additional classes affect the styling
      iconSize: [iconDivSize, iconDivSize], // Size of the icon
      iconAnchor: [iconDivSize / 2, iconDivSize / 2], // Point of the icon which will correspond to marker's location
    });

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
      console.log("Map zoom:", map.getZoom());
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
        title={callsign.trim()}
        riseOnHover={true}
        // Make the z offset for a hovered plane higher than any other plane on the map
        riseOffset={totalAircraft + 1}
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
          <div>{verticalRate != null && `Climb rate: ${climbRateFpm} fpm`}</div>
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
