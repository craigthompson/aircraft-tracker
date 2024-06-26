import { MdArrowRightAlt } from "react-icons/md";
import WatchFlightDeleteButton from "./WatchFlightDeleteButton";

function WatchedFlight({
  icao24,
  callsign,
  flightStatus,
  departureAirport,
  arrivalAirport,
  airlineLogoUrl,
  deleteWatchFlight,
}) {
  const currentlyTracking = icao24 ? "true" : "false"; // TODO: remove if not using again

  return (
    <tr className="flex w-full mb-3 text-secondary-500">
      <td className="px-1 w-full">
        <div className="w-full px-2 pt-2 pb-1 bg-secondary-0 rounded-md shadow-md flex flex-row">
          <div className="flex flex-col text-left w-11/12">
            <div className="text-md">
              {airlineLogoUrl && (
                <img src={airlineLogoUrl} alt="" className="h-4" />
              )}
              {callsign}
            </div>
            {/* TODO: Remove if not needed anymore 
              <div className="text-xs text-gray-500">
              Tracking:
              <span className="ml-1 text-black">{currentlyTracking}</span>
            </div> */}
            {/* <div className="text-xs text-gray-500">
              Status:
              <div className="ml-1 text-black">{flightStatus}</div>
            </div> */}
            {flightStatus && (
              <div className="text-[10px] text-secondary-600">
                {flightStatus}
              </div>
            )}
            <div className="text-[10px] text-secondary-500 mb-1">
              Route:
              <span className="ml-1 text-secondary-600">
                {departureAirport && departureAirport.slice(1, 4)}
                <MdArrowRightAlt className="inline text-sm" />
                {arrivalAirport && arrivalAirport.slice(1, 4)}
              </span>
            </div>
          </div>
          <WatchFlightDeleteButton clickedDeleteButton={deleteWatchFlight} />
        </div>
      </td>
    </tr>
  );
}

export default WatchedFlight;
