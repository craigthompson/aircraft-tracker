import { useState } from "react";

function WatchedFlight({
  icao24,
  callsign,
  flightStatus,
  departureAirport,
  arrivalAirport,
}) {
  return (
    <tr>
      <td className="px-1">{callsign}</td>
    </tr>
  );
}

export default WatchedFlight;
