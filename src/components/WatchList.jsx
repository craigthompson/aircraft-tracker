import { useState, useEffect } from "react";
import WatchedFlight from "./WatchedFlight";
import axios from "axios";

const WatchList = () => {
  // const [watchListData, setWatchListData] = useState([]);
  const [allWatchedAircraft, setAllWatchedAircraft] = useState([]);

  const allWatchedAircraftInstances = allWatchedAircraft.map(
    (watchedFlight, index) => (
      <WatchedFlight
        icao24={watchedFlight.icao24}
        callsign={watchedFlight.callsign}
        flightStatus={watchedFlight.flightStatus}
        departureAirport={watchedFlight.departureAirport}
        arrivalAirport={watchedFlight.arrivalAirport}
        key={watchedFlight.watchId}
      />
    )
  );

  const addWatchFlight = async () => {
    // const newWatchFlight = {
    //   // TODO: change to correct data for watch list flights
    //   mission: "",
    //   vehicle: "",
    //   location: "",
    //   days_till_launch: 0,
    //   isEditing: true,
    // };
    // const { data } = await axios.post("/api/launches", newWatchFlight); // TODO: change to new endpoint
    // setAllWatchedAircraft(data);
  };

  const getData = async () => {
    const { data } = await axios.get("api/watched/aircraft/all");
    console.log("Received:", data);
    setAllWatchedAircraft(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen w-2/12 bg-gray-200 border-l-2 border-gray-500">
      Watch List
      <table className="w-full">
        <tbody>{allWatchedAircraftInstances}</tbody>
        <tfoot>
          <tr className="">
            <td className="px-1">
              <button
                className="w-full bg-gray-600 rounded"
                onClick={addWatchFlight}
              >
                Add Flight
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default WatchList;
