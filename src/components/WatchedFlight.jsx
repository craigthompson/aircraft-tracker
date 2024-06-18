import { MdModeEdit } from "react-icons/md";

function WatchedFlight({
  icao24,
  callsign,
  flightStatus,
  departureAirport,
  arrivalAirport,
}) {
  const currentlyTracking = icao24 ? "true" : "false";

  return (
    <tr className="flex w-full my-2">
      <td className="px-1 w-full">
        <div className="w-full px-2 bg-white rounded flex flex-row">
          <div className="flex flex-col text-left w-11/12">
            <div className="text-md">{callsign}</div>
            <div className="text-sm text-gray-500">
              Tracking:
              <span className="ml-1 text-black">{currentlyTracking}</span>
            </div>
            <div className="text-sm text-gray-500">
              Status:
              <span className="ml-1 text-black">{"none"}</span>
            </div>
            <div className="text-sm text-gray-500">
              Route:
              <span className="ml-1 text-black">{"none"}</span>
            </div>
          </div>
          <div className="inline-block content-center">
            <MdModeEdit className="text-xl" />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default WatchedFlight;
