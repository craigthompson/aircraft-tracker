import { useEffect } from "react";
import axios from "axios";

function AircraftDetails({ icao24, setAircraftDetails }) {
  const getAircraftDetails = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `https://opensky-network.org/api/metadata/aircraft/icao/${icao24}`,
        headers: { "Access-Control-Allow-Origin": "/" },
      });
      // const response = await axios.get(
      //   `https://opensky-network.org/api/metadata/aircraft/icao/${icao24}`
      // );
      console.log("Details response:", response);
      setAircraftDetails({
        registration: response?.data?.registration ?? null,
      });
    } catch (error) {
      console.error("Error fetching aircraft details:", error);
    }
  };

  useEffect(() => {
    getAircraftDetails();
  }, []);
}

export default AircraftDetails;
