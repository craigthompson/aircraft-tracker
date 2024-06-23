import { MdArrowRightAlt } from "react-icons/md";
import WatchFlightButtons from "./WatchFlightButtons";

function WatchedFlight({
  icao24,
  callsign,
  flightStatus,
  departureAirport,
  arrivalAirport,
  airlineLogoUrl,
}) {
  const currentlyTracking = icao24 ? "true" : "false";

  return (
    <tr className="flex w-full my-2 text-gray-600">
      <td className="px-1 w-full">
        <div className="w-full px-2 pt-2 pb-1 bg-gray-200 rounded flex flex-row">
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
              <div className="text-[10px] text-gray-600">{flightStatus}</div>
            )}
            <div className="text-[10px] text-gray-500 mb-1">
              Route:
              <span className="ml-1 text-gray-600">
                {departureAirport && departureAirport.slice(1, 4)}
                <MdArrowRightAlt className="inline text-sm" />
                {arrivalAirport && arrivalAirport.slice(1, 4)}
              </span>
            </div>
          </div>
          <WatchFlightButtons />
        </div>
      </td>
    </tr>
  );
}

export default WatchedFlight;
