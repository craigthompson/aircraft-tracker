import React, { useState, useEffect } from "react";
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
  const climbRateFpm = toFeetPerMinute(verticalRate).toFixed(1);

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

  const calculatePredictivePosition = () => {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - lastUpdateTime) / 1000; // Elapsed time in seconds

    if (elapsedTime > 0) {
      const distancePerStep = velocity * elapsedTime; // Distance to move in meters
      const altitudeChangePerStep = verticalRate * elapsedTime; // Altitude change in meters

      /**
       *  Calculates a predicted next latitude point in degrees.
       *    - currentPosition.lat is the current latitude of the aircraft.
       *    - trueTrack is the aircraft's track angle in degrees, which is
       *      converted to radians by multiplying with (Math.PI / 180).
       *    - Math.cos(trueTrack * (Math.PI / 180)) gives the cosine of the
       *      track angle, representing the horizontal component of the distance.
       *    - The product of distance and Math.cos(trueTrack * (Math.PI / 180))
       *      gives the north-south distance component in meters, which is then
       *      converted to degrees by dividing by 111320.
       *        * 111320 is the number of meters per degree of latitude.
       *          I use this value to convert the distance from meters to degrees.
       *    - Adding to currentPosition.lat gives the new latitude.
       */
      const newLat =
        currentPosition.lat +
        (distancePerStep * Math.cos(trueTrack * (Math.PI / 180))) / 111320;

      /**
       *  Calculates a predicted next longitude point in degrees.
       *    - currentPosition.lon is the current longitude of the aircraft.
       *    - Math.sin(trueTrack * (Math.PI / 180)) gives the sine of the track
       *      angle, representing the east-west component of the distance.
       *    - 111320 * Math.cos(currentPosition.lat * (Math.PI / 180)) adjusts
       *      the meters per degree of longitude, accounting for the latitude.
       *      This factor accounts for the fact that the distance represented
       *      by one degree of longitude varies with latitude.
       *        * 111320 is the number of meters per degree of longitude.
       *          I use this value to convert the distance from meters to degrees.
       *    - The product of distance and Math.sin(trueTrack * (Math.PI / 180))
       *      gives the east-west distance component in meters.
       *        * I convert the product mentioned above to degrees by dividing
       *          by 111320 * Math.cos(currentPosition.lat * (Math.PI / 180)).
       *            ~ 111320 is the number of meters per degree of longitude.
       *    - Adding to currentPosition.lon gives the new longitude.
       */
      const newLon =
        currentPosition.lon +
        (distancePerStep * Math.sin(trueTrack * (Math.PI / 180))) /
          (111320 * Math.cos(currentPosition.lat * (Math.PI / 180)));

      setCurrentPosition({ lat: newLat, lon: newLon });
      setCurrentAltitude((prevAltitude) => {
        if (prevAltitude) {
          return prevAltitude + altitudeChangePerStep;
        }
        return null;
      });
      setLastUpdateTime(currentTime);
    }
  };

  // Update aircraft's position when data updates from server
  useEffect(() => {
    setCurrentPosition({ lat: latitude, lon: longitude });
    setCurrentAltitude(baroAltitude);
    setLastUpdateTime(lastContact * 1000); // convert to millisecond unix time
    /*
     *   Data from server is often a couple seconds behind actual, so
     *   we need to calculate the position as of now from that time.
     */
    calculatePredictivePosition();
  }, [latitude, longitude, baroAltitude]);

  // Regular cadence of predictive positioning aircraft
  useEffect(() => {
    const intervalId = setInterval(() => {
      calculatePredictivePosition();
    }, 250); // Update every 250 milliseconds

    return () => clearInterval(intervalId);
  }, [velocity, trueTrack, verticalRate, lastUpdateTime]);

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
        <div className="flex flex-col justify-center items-center">
          <IoMdAirplane
            className={`${iconColor(
              metersToFeet(currentAltitude)
            )} ${iconClassSize}`}
            style={{
              transform: `rotate(${trueTrack}deg)`,
              // // Disabling this for now
              // filter: `drop-shadow(0 0px 2px ${iconOutline(
              //   climbRateFpm
              // )}) drop-shadow(0 0 1px rgba(255, 255, 255, 1))`,
              // filter: `drop-shadow(0 0 1px rgba(255, 255, 255, 1))`,
            }}
          />
          <span className="flex flex-col items-center w-fit p-0.5 rounded filter-none text-secondary-600 bg-secondary-0 bg-opacity-70 shadow-[0_0_6px_rgba(255,255,255,0.6)] shadow-secondary-0">
            <span className="px-1">{callsign}</span>
            {currentAltitude != null && (
              <span className="flex items-center">
                {climbRateFpm !== 0 && (
                  <span className="mr-1">
                    <span>
                      {climbRateFpm > 0 && climbRateFpm < 500 && <FaAngleUp />}
                    </span>
                    <span>{climbRateFpm >= 500 && <FaAngleDoubleUp />}</span>
                    <span>
                      {climbRateFpm < 0 && climbRateFpm > -500 && (
                        <FaAngleDown />
                      )}
                    </span>
                    <span>{climbRateFpm <= -500 && <FaAngleDoubleDown />}</span>
                  </span>
                )}
                {climbRateFpm === 0 && <span></span>}
                <span>
                  {flightLevelFeet(currentAltitude).toString().padStart(3, "0")}
                </span>
              </span>
            )}
          </span>
        </div>
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
      <Popup offset={L.point(0, -10)}>
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
              {currentAltitude != null && (
                <tr>
                  <td className="text-secondary-500 font-normal px-2 py-1 border-r border-b border-secondary-200">{`Altitude:`}</td>
                  <td className="px-2 border-l border-b border-secondary-200">{`${metersToFeet(
                    currentAltitude
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
                        climbRateFpm
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
                    1
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

export default Aircraft;
