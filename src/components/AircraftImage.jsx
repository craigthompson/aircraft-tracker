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
      <div class="relative rounded-xl overflow-hidden">
        {/*loading indicator */}
        <a href={planespotterLinkUrl}>
          {!isImageLoaded && <div>Loading...</div>}
          <img
            className={`drop-shadow-md ${isImageLoaded ? "" : "hidden"}`}
            src={imgUrl}
            alt={`Photo of `} // TODO: change alt text
            onLoad={handleImageLoad}
          />
          {isImageLoaded && (
            <div className="absolute inset-x-0 bottom-0 h-5 bg-slate-900/30 ">
              <span
                className="absolute left-1.5 bottom-0.5 text-slate-50 text-xs"
                style={{
                  filter: `drop-shadow(2px 2px 3px rgb(0 0 0 / 0.2)) 
                    drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4))
                    drop-shadow(-1px -1px 1px rgb(0 0 0 / 0.25))`,
                }}
              >
                {`© ${photographer}`}
              </span>
              <FaExternalLinkAlt
                className="absolute right-1.5 bottom-1 text-slate-50 text-xs"
                style={{
                  filter: `drop-shadow(2px 2px 3px rgb(0 0 0 / 0.2)) 
                  drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4))
                  drop-shadow(-1px -1px 1px rgb(0 0 0 / 0.25))`,
                }}
              />
            </div>
          )}
        </a>
      </div>
    );
  } else {
    return <></>;
  }
}

export default AircraftImage;
