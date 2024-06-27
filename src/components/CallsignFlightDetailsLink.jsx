import { FaExternalLinkAlt } from "react-icons/fa";

function CallsignFlightDetailsLink({ callsign }) {
  return (
    callsign != null &&
    callsign != "" && (
      <tr>
        <td className="text-secondary-500 font-normal px-2 py-1 border-r border-b border-secondary-200">{`Callsign: `}</td>
        <td className="px-2 py-1 border-l border-b border-secondary-200">
          <a
            href={`https://www.flightaware.com/live/flight/${callsign.toUpperCase()}`}
            target="_blank"
            className="inline-flex items-center text-primary-600 hover:text-primary-500"
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
