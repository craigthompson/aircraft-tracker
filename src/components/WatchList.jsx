import { useState, useEffect, useRef } from "react";
import WatchedFlight from "./WatchedFlight";
import AddWatchFlightButton from "./AddWatchFlightButton";
import InputWatchFlight from "./InputWatchFlight";
import axios from "axios";
import { socket } from "../socket.js";

const WatchList = () => {
  const [allWatchedAircraft, setAllWatchedAircraft] = useState([]);
  const [isAddingFlight, setIsAddingFlight] = useState(false);
  const [isScrapingFlight, setIsScrapingFlight] = useState(false);
  const watchlistFooterRef = useRef(null);

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
      console.log("Watched flights returned from server:", data);
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

  const scrollWatchListFooterIntoView = () => {
    console.log("Current:", watchlistFooterRef.current);
    watchlistFooterRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    socket.on("all_watched_aircraft", (watchedFlights) => {
      console.log("Message from server for watched flights:", watchedFlights);
      setAllWatchedAircraft(watchedFlights);
    });

    return () => {
      socket.off("all_watched_aircraft");
    };
  }, []);

  useEffect(() => {
    console.log("In use effect");
    console.log("isScrapingFlight:", isScrapingFlight);
    if (isScrapingFlight) scrollWatchListFooterIntoView();
    setIsScrapingFlight(false);

    return () => {
      console.log("Unmounting", isScrapingFlight);
    };
  }, [allWatchedAircraft]);

  useEffect(() => {
    console.log("setIsScrapingFlight");
  }, [setIsScrapingFlight]);

  return (
    <div className="flex flex-col h-screen w-2/12 bg-gray-50 border-l-2 border-gray-300 ">
      <div className="text-xl">Watch List</div>
      <table className="flex flex-col w-full h-full overflow-y-auto">
        <tbody>{allWatchedAircraftInstances}</tbody>
        <tfoot ref={watchlistFooterRef} className="flex flex-col mb-4 mt-2">
          <tr className="flex">
            {isAddingFlight ? (
              <InputWatchFlight
                addWatchFlight={addWatchFlight}
                isAddingFlight={isAddingFlight}
                setIsAddingFlight={setIsAddingFlight}
                isScrapingFlight={isScrapingFlight}
                setIsScrapingFlight={setIsScrapingFlight}
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
