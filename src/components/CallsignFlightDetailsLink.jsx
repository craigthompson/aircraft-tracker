function CallsignFlightDetailsLink({ callsign }) {
  return (
    callsign != null && (
      <div>
        {`Callsign: `}
        <a
          href={`https://www.flightaware.com/live/flight/${callsign.toUpperCase()}`}
          target="_blank"
        >
          {callsign.toUpperCase()}
        </a>
      </div>
    )
  );
}

export default CallsignFlightDetailsLink;
