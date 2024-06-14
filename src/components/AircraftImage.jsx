import axios from "axios";
import { useState, useEffect } from "react";

function AircraftImage({ icao24 }) {
  const [imgUrl, setImgUrl] = useState([]);

  const getUrl = async () => {
    const response = await axios.get(
      `https://api.planespotters.net/pub/photos/hex/${icao24}`
    );
    console.log(response.data);
    return response.data?.photos?.[0]?.thumbnail_large?.src ?? null;
  };

  useEffect(() => {
    const getUrl = async () => {
      const response = await axios.get(
        `https://api.planespotters.net/pub/photos/hex/${icao24}`
      );
      console.log(response.data);
      setImgUrl(response.data?.photos?.[0]?.thumbnail_large?.src ?? null);
    };
    getUrl();
  }, []);

  if (imgUrl) {
    return <img src={imgUrl} alt={"Temporary Filler"} />; // TODO: change alt text
  } else {
    return <></>;
  }
}

export default AircraftImage;
