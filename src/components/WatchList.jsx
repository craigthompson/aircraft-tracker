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
    <div className="flex flex-col h-screen w-2/12 bg-gray-200 border-l-2 border-gray-300 ">
      <div className="text-xl">Watch List</div>
      <table className="flex flex-col w-full h-full overflow-y-auto">
        <tbody>{allWatchedAircraftInstances}</tbody>
        <tfoot className="flex flex-col">
          <tr className="flex">
            <td className="w-full px-1">
              <button
                className="w-full bg-gray-400 rounded"
                onClick={addWatchFlight}
              >
                + Add Flight
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default WatchList;
