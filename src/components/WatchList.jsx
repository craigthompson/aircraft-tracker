import { useState, useEffect } from "react";
import WatchedFlight from "./WatchedFlight";
import AddWatchFlightButton from "./AddWatchFlightButton";
import InputWatchFlight from "./InputWatchFlight";
import axios from "axios";

const WatchList = () => {
  const [allWatchedAircraft, setAllWatchedAircraft] = useState([]);
  const [isAddingFlight, setIsAddingFlight] = useState(false);

  const allWatchedAircraftInstances = allWatchedAircraft.map(
    (watchedFlight, index) => (
      <WatchedFlight
        icao24={watchedFlight.icao24}
        callsign={watchedFlight.callsign}
        flightStatus={watchedFlight.flightStatus}
        departureAirport={watchedFlight.departureAirport}
        arrivalAirport={watchedFlight.arrivalAirport}
        airlineLogoUrl={watchedFlight.airlineLogoUrl}
        key={watchedFlight.watchId}
        deleteWatchFlight={() => deleteWatchFlight(watchedFlight.watchId)}
      />
    )
  );

  const setAddingFlightTrue = () => setIsAddingFlight(true);

  const addWatchFlight = async (inputValue) => {
    const newWatchFlight = {
      callsign: inputValue,
      isEditing: true,
    };

    try {
      const { data } = await axios.post(
        "/api/watched/aircraft",
        newWatchFlight
      );
      setAllWatchedAircraft(data);
      setIsAddingFlight(false);
    } catch (error) {
      console.error("Error adding watch flight:", error);
    }
  };

  const getData = async () => {
    const { data } = await axios.get("api/watched/aircraft");
    console.log("Received:", data);
    setAllWatchedAircraft(data);
  };

  const deleteWatchFlight = async (id) => {
    const { data } = await axios.delete(`/api/watched/aircraft/${id}`);
    setAllWatchedAircraft(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col h-screen w-2/12 bg-gray-50 border-l-2 border-gray-300 ">
      <div className="text-xl">Watch List</div>
      <table className="flex flex-col w-full h-full overflow-y-auto">
        <tbody>{allWatchedAircraftInstances}</tbody>
        <tfoot className="flex flex-col mb-4">
          <tr className="flex">
            {isAddingFlight ? (
              <InputWatchFlight
                addWatchFlight={addWatchFlight}
                isAddingFlight={isAddingFlight}
                setIsAddingFlight={setIsAddingFlight}
              />
            ) : (
              <AddWatchFlightButton clickedButton={setAddingFlightTrue} />
            )}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default WatchList;
