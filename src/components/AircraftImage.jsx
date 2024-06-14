import axios from "axios";
import { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

function AircraftImage({ icao24 }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [photographer, setPhotographer] = useState(null);
  const [planespotterLinkUrl, setPlanespotterLinkUrl] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const getUrl = async () => {
    try {
      const response = await axios.get(
        `https://api.planespotters.net/pub/photos/hex/${icao24}`
      );
      setImgUrl(response?.data?.photos?.[0]?.thumbnail_large?.src ?? null);
      setPhotographer(response?.data?.photos?.[0]?.photographer ?? "");
      setPlanespotterLinkUrl(response?.data?.photos?.[0]?.link ?? "");
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    getUrl();
  }, []);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  if (imgUrl) {
    return (
      <div class="relative">
        {/*loading indicator */}
        <a href={planespotterLinkUrl}>
          {!isImageLoaded && <div>Loading...</div>}
          <img
            className={`p-0.5 rounded-xl drop-shadow-md ${
              isImageLoaded ? "" : "hidden"
            }`}
            src={imgUrl}
            alt={`Photo of `} // TODO: change alt text
            onLoad={handleImageLoad}
          />
          {isImageLoaded && (
            <span
              className="absolute bottom-1.5 left-2 text-slate-50 text-xs"
              style={{
                filter: `drop-shadow(1px 2px 2px rgb(0 0 0 / 0.35)) 
                  drop-shadow(0px 1px 1px rgb(0 0 0 / 0.25))`,
              }}
            >
              {`© ${photographer}`}
            </span>
          )}
          {isImageLoaded && (
            <FaExternalLinkAlt
              className="absolute bottom-2 right-2 text-slate-50 text-xs"
              style={{
                filter: `drop-shadow(1px 2px 2px rgb(0 0 0 / 0.35)) 
                  drop-shadow(0px 1px 1px rgb(0 0 0 / 0.25))`,
              }}
            />
          )}
        </a>
      </div>
    );
  } else {
    return <></>;
  }
}

export default AircraftImage;
