import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import {
  unixSecondsToLocalTime,
  currentLocalTime,
} from "../../utils/timeAndDate";
import {
  toMilesPerHour,
  toFeetPerMinute,
  toKnots,
} from "../../utils/velocity.js";
import { metersToFeet, flightLevelFeet } from "../../utils/distance.js";
import { IoMdAirplane } from "react-icons/io";
import {
  iconColor,
  iconOutline,
  aircraftIconDropShadow,
  iconSize,
} from "../../utils/customIcon.js";
import CallsignFlightDetailsLink from "./CallsignFlightDetailsLink.jsx";
import AircraftImage from "./AircraftImage.jsx";
import {
  FaAngleUp,
  FaAngleDoubleUp,
  FaAngleDown,
  FaAngleDoubleDown,
} from "react-icons/fa";
import AircraftMarkerLabel from "./AircraftMarkerLabel.jsx";

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
 * @param {Integer} props.positionSource - Origin of this state's position:
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
  // if (currentTime - lastContact > 180) {
  //   return null;
  // }

  if (!latitude || !longitude) {
    return null;
  }

  const map = useMap();
  const climbRateFpm = toFeetPerMinute(verticalRate).toFixed(1);
  const markerRef = useRef(null);

  const [mapZoom, setMapZoom] = useState(map.getZoom());

  // Refs for smooth position animation (no re-renders)
  const posRef = useRef({ lat: latitude, lon: longitude });
  const altRef = useRef(baroAltitude);
  const lastUpdateRef = useRef(Date.now());

  // Keep latest props in refs for the interval to read
  const velocityRef = useRef(velocity);
  const trueTrackRef = useRef(trueTrack);
  const verticalRateRef = useRef(verticalRate);
  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);
  useEffect(() => {
    trueTrackRef.current = trueTrack;
  }, [trueTrack]);
  useEffect(() => {
    verticalRateRef.current = verticalRate;
  }, [verticalRate]);

  /**
   * Calculate a predicted position from a given starting point.
   * Returns the new position/altitude without setting any state.
   */
  const predictPosition = useCallback((lat, lon, altitude, lastTimestamp) => {
    const now = Date.now();
    const elapsedTime = (now - lastTimestamp) / 1000;

    if (elapsedTime <= 0) return { lat, lon, altitude, timestamp: now };

    const v = velocityRef.current || 0;
    const track = trueTrackRef.current || 0;
    const vr = verticalRateRef.current || 0;

    const distancePerStep = v * elapsedTime;
    const altitudeChange = vr * elapsedTime;

    const newLat =
      lat + (distancePerStep * Math.cos(track * (Math.PI / 180))) / 111320;

    const newLon =
      lon +
      (distancePerStep * Math.sin(track * (Math.PI / 180))) /
        (111320 * Math.cos(lat * (Math.PI / 180)));

    const newAlt = altitude != null ? altitude + altitudeChange : null;

    return { lat: newLat, lon: newLon, altitude: newAlt, timestamp: now };
  }, []);

  // When server data arrives, snap refs to the predicted-from-server position
  useEffect(() => {
    const predicted = predictPosition(
      latitude,
      longitude,
      baroAltitude,
      lastContact * 1000,
    );
    posRef.current = { lat: predicted.lat, lon: predicted.lon };
    altRef.current = predicted.altitude;
    lastUpdateRef.current = predicted.timestamp;

    // Also move the Leaflet marker immediately
    if (markerRef.current) {
      markerRef.current.setLatLng([predicted.lat, predicted.lon]);
    }
  }, [latitude, longitude, baroAltitude, verticalRate, trueTrack, velocity]);

  // Smooth position animation every 250ms using refs + native Leaflet
  useEffect(() => {
    const intervalId = setInterval(() => {
      const { lat, lon } = posRef.current;
      const predicted = predictPosition(
        lat,
        lon,
        altRef.current,
        lastUpdateRef.current,
      );

      posRef.current = { lat: predicted.lat, lon: predicted.lon };
      altRef.current = predicted.altitude;
      lastUpdateRef.current = predicted.timestamp;

      // Move marker via Leaflet API — no React re-render
      if (markerRef.current) {
        markerRef.current.setLatLng([predicted.lat, predicted.lon]);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [predictPosition]);

  useMapEvents({
    zoomend: () => {
      setMapZoom(map.getZoom());
    },
  });

  const markerLayerPoint = map.latLngToLayerPoint([
    posRef.current.lat,
    posRef.current.lon,
  ]);
  const adjustedZOffset = useMemo(
    () => zIndex - markerLayerPoint.y,
    [markerLayerPoint, zIndex],
  );

  const iconDivSize = iconSize(map.getZoom()).pixelSize;
  const iconClassSize = iconSize(map.getZoom()).cssSize;
  const aircraftIcon = useMemo(
    () =>
      L.divIcon({
        html: ReactDOMServer.renderToString(
          <div className="flex flex-col justify-center items-center">
            <IoMdAirplane
              className={`${iconColor(metersToFeet(baroAltitude))} ${iconClassSize}`}
              style={{ transform: `rotate(${trueTrack}deg)` }}
            />
            <AircraftMarkerLabel
              callsign={callsign}
              onGround={onGround}
              threeDigitAltitude={flightLevelFeet(baroAltitude)
                .toString()
                .padStart(3, "0")}
              climbRateFpm={climbRateFpm}
            />
          </div>,
        ),
        className: aircraftIconDropShadow(metersToFeet(baroAltitude)),
        iconSize: [iconDivSize, iconDivSize],
        iconAnchor: [iconDivSize / 2, iconDivSize / 2],
      }),
    [
      baroAltitude,
      trueTrack,
      iconClassSize,
      callsign,
      onGround,
      climbRateFpm,
      iconDivSize,
    ],
  );

  return (
    <Marker
      ref={markerRef}
      position={[posRef.current.lat, posRef.current.lon]}
      icon={aircraftIcon}
      zIndexOffset={adjustedZOffset}
      title={callsign ? callsign.trim() : ""}
      riseOnHover={true}
      riseOffset={totalAircraft + 1}
    >
      <Popup offset={L.point(0, -15)}>
        <AircraftImage icao24={icao24} />
        <div className="mt-2 bg-secondary-0 rounded-xl drop-shadow-md">
          <table className="mt-4 table-auto text-secondary-600 font-semibold antialiased text-xs">
            <tbody>
              <tr>
                <td className="text-secondary-500 font-normal px-2 pt-2 pb-1 border-r border-b border-secondary-200">
                  ICAO24:
                </td>
                <td className="px-2 pt-2 pb-1 border-l border-b border-secondary-200">
                  {icao24.toUpperCase()}
                </td>
              </tr>
              <CallsignFlightDetailsLink callsign={callsign} />
              {baroAltitude != null && (
                <tr>
                  <td className="text-secondary-500 font-normal px-2 py-1 border-r border-b border-secondary-200">{`Altitude:`}</td>
                  <td className="px-2 border-l border-b border-secondary-200">{`${metersToFeet(
                    baroAltitude,
                  ).toFixed(1)} ft`}</td>
                </tr>
              )}
              {verticalRate != null && (
                <tr>
                  <td className="text-secondary-500 font-normal px-2 py-1 border-r border-b border-secondary-200">{`Vertical speed:`}</td>
                  <td className="pl-1 pr-2 border-l border-b border-secondary-200">
                    <span className="flex items-center">
                      <span>
                        {climbRateFpm > 0 && climbRateFpm < 500 && (
                          <FaAngleUp />
                        )}
                      </span>
                      <span>{climbRateFpm >= 500 && <FaAngleDoubleUp />}</span>
                      <span>
                        {climbRateFpm < 0 && climbRateFpm > -500 && (
                          <FaAngleDown />
                        )}
                      </span>
                      {/* {climbRateFpm == 0 && <span className="ml-1"></span>} */}
                      <span>
                        {climbRateFpm <= -500 && <FaAngleDoubleDown />}
                      </span>
                      <span className="ml-1">{`${Math.abs(
                        climbRateFpm,
                      )} fpm`}</span>
                    </span>
                  </td>
                </tr>
              )}
              {velocity != null && (
                <tr>
                  <td className="text-secondary-500 font-normal px-2 py-1 border-r border-b border-secondary-200">{`Speed:`}</td>
                  <td className="px-2 border-l border-b border-secondary-200">
                    <span>{`${toMilesPerHour(velocity).toFixed(1)} mph `}</span>
                    <span className="text-secondary-500 font-normal">
                      {`(${toKnots(toMilesPerHour(velocity)).toFixed(1)} kts)`}
                    </span>
                  </td>
                </tr>
              )}
              {trueTrack != null && (
                <tr>
                  <td className="text-secondary-500 font-normal px-2 pt-1 pb-2 border-r border-secondary-200">{`Track:`}</td>
                  <td className="px-2 pt-1 pb-2 border-l border-secondary-200">{`${trueTrack.toFixed(
                    1,
                  )}°`}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <table className="mt-2 table-auto text-gray-400 text-xs w-full">
          <tbody>
            <tr className="text-center">
              <td>Last Contact:</td>
              <td className="text-secondary-500">
                {unixSecondsToLocalTime(lastContact)}
              </td>
            </tr>
            <tr className="text-center">
              <td>Current Time:</td>
              <td className="text-secondary-500">{currentLocalTime()}</td>
            </tr>
          </tbody>
        </table>
      </Popup>
    </Marker>
  );
};

export default React.memo(Aircraft);
