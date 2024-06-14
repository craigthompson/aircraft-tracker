function CallsignFlightDetailsLink({ callsign }) {
  return (
    callsign != null && (
      <>
        <td>{`Callsign: `}</td>
        <td className="pl-2">
          <a
            href={`https://www.flightaware.com/live/flight/${callsign.toUpperCase()}`}
            target="_blank"
          >
            {callsign.toUpperCase()}
          </a>
        </td>
      </>
    )
  );
}

export default CallsignFlightDetailsLink;
