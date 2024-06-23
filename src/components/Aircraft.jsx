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
import CallsignFlightDetailsLink from "./CallsignFlightDetailsLink.jsx";
import AircraftImage from "./AircraftImage.jsx";

/**
 * Aircraft map marker at the given geographical coordinates
 * with popup showing additional given aircraft details.
 *
 * @component
 * @param {Object} props - The component given properties
 * @param {String} props.callsign - Callsign of the vehicle (8 chars).
 * @param {String} props.icao24 - Unique ICAO 24-bit address of the
 *   transponder in hex string representation. (up to 12 chars)
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
  const currentTime = new Date().getTime() / 1000; // current time in seconds
  if (currentTime - lastContact > 180) {
    return null;
  }

  if (!latitude || !longitude) {
    return null;
  }

  const map = useMap();
  const altitudeFeet = metersToFeet(baroAltitude);
  const climbRateFpm = toFeetPerMinute(verticalRate).toFixed(2);

  const [currentPosition, setCurrentPosition] = useState({
    lat: latitude,
    lon: longitude,
  });
  const [currentAltitude, setCurrentAltitude] = useState(baroAltitude);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().getTime());
  const [mapView, setMapView] = useState({
    center: map.getCenter(),
    zoom: map.getZoom(),
  });

  useEffect(() => {
    setCurrentPosition({ lat: latitude, lon: longitude });
    setCurrentAltitude(baroAltitude);
    setLastUpdateTime(new Date().getTime());
  }, [latitude, longitude, baroAltitude]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = (currentTime - lastUpdateTime) / 1000; // Elapsed time in seconds

      if (elapsedTime > 0) {
        const distancePerStep = velocity * elapsedTime; // Distance to move in meters
        const altitudeChangePerStep = verticalRate * elapsedTime; // Altitude change in meters

        const newLat =
          currentPosition.lat +
          (distancePerStep * Math.cos(trueTrack * (Math.PI / 180))) / 111320;
        const newLon =
          currentPosition.lon +
          (distancePerStep * Math.sin(trueTrack * (Math.PI / 180))) /
            (111320 * Math.cos(currentPosition.lat * (Math.PI / 180)));

        setCurrentPosition({ lat: newLat, lon: newLon });
        setCurrentAltitude(
          (prevAltitude) => prevAltitude + altitudeChangePerStep
        );
        setLastUpdateTime(currentTime);
      }
    }, 250); // Update every 250 milliseconds

    return () => clearInterval(intervalId);
  }, [velocity, trueTrack, verticalRate, lastUpdateTime]);

  useEffect(() => {
    if (lastContact > lastUpdateTime / 1000) {
      setCurrentPosition({ lat: latitude, lon: longitude });
      setCurrentAltitude(baroAltitude);
      setLastUpdateTime(new Date().getTime());
    }
  }, [lastContact]);

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
    markerLayerPoint = map.latLngToLayerPoint([
      currentPosition.lat,
      currentPosition.lon,
    ]);
    setAdjustedZOffset(zIndex - markerLayerPoint.y);
  }, [currentPosition, mapView, allAircraft]);

  const iconDivSize = iconSize(map.getZoom()).pixelSize;
  const iconClassSize = iconSize(map.getZoom()).cssSize;
  const aircraftIcon = () =>
    L.divIcon({
      html: ReactDOMServer.renderToString(
        <>
          <IoMdAirplane
            className={`${iconColor(
              metersToFeet(currentAltitude)
            )} ${iconClassSize}`}
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
      className: aircraftIconDropShadow(metersToFeet(currentAltitude)),
      iconSize: [iconDivSize, iconDivSize],
      iconAnchor: [iconDivSize / 2, iconDivSize / 2],
    });

  return (
    <Marker
      position={[currentPosition.lat, currentPosition.lon]}
      icon={aircraftIcon()}
      zIndexOffset={adjustedZOffset}
      title={callsign ? callsign.trim() : ""}
      riseOnHover={true}
      riseOffset={totalAircraft + 1}
    >
      <Popup>
        <AircraftImage icao24={icao24} />
        <table className="mt-2 table-auto">
          <tbody>
            <tr>
              <td>ICAO24:</td>
              <td className="pl-2">{icao24.toUpperCase()}</td>
            </tr>
            <CallsignFlightDetailsLink callsign={callsign} />
            {currentAltitude != null && (
              <tr>
                <td>{`Altitude:`}</td>
                <td className="pl-2">{`${metersToFeet(currentAltitude).toFixed(
                  2
                )} ft`}</td>
              </tr>
            )}
            {velocity != null && (
              <tr>
                <td>{`Speed:`}</td>
                <td className="pl-2">{`${toMilesPerHour(velocity).toFixed(
                  2
                )} mph (${toKnots(toMilesPerHour(velocity)).toFixed(
                  2
                )} kts)`}</td>
              </tr>
            )}
            {verticalRate != null && (
              <tr>
                <td>{`Climb rate:`}</td>
                <td className="pl-2">{`${climbRateFpm} fpm`}</td>
              </tr>
            )}
            {trueTrack != null && (
              <tr>
                <td>{`Track:`}</td>
                <td className="pl-2">{`${trueTrack.toFixed(2)} deg`}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-2 text-gray-400 text-xs">
          Last Contact: {unixSecondsToLocal(lastContact)}
        </div>
      </Popup>
    </Marker>
  );
};

export default Aircraft;
