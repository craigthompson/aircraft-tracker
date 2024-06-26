import { FaExternalLinkAlt } from "react-icons/fa";

function CallsignFlightDetailsLink({ callsign }) {
  return (
    callsign != null &&
    callsign != "" && (
      <tr>
        <td>{`Callsign: `}</td>
        <td className="pl-2">
          <a
            href={`https://www.flightaware.com/live/flight/${callsign.toUpperCase()}`}
            target="_blank"
            className="inline-flex items-center text-primary-600 hover:text-primary-800"
          >
            {`${callsign.toUpperCase()} `}{" "}
            <FaExternalLinkAlt className="ml-1 text-xs" />
          </a>
        </td>
      </tr>
    )
  );
}

export default CallsignFlightDetailsLink;
