import React, { useState, useEffect } from "react";
import { LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./mapStyles.css"; // Import custom styles

function CustomLayersControl({ children, title }) {
  const [expanded, setExpanded] = useState(false);
  const [titleState, setTitleState] = useState("");

  const customTitle = document.querySelector(
    ".custom-layers-control-title-wrapping-div"
  );

  useEffect(() => {
    const layersControl = document.querySelector(".leaflet-control-layers");

    if (layersControl && !customTitle) {
      const titleWrappingDiv = document.createElement("div");
      titleWrappingDiv.className =
        "custom-layers-control-title-wrapping-div hidden";
      const titleElement = document.createElement("div");
      titleElement.className =
        "custom-layers-control-title flex justify-center items-center py-1 rounded-t-md drop-shadow-md bg-secondary-100 text-secondary-600 text-xs";
      titleElement.innerHTML = title;
      titleWrappingDiv.prepend(titleElement);
      layersControl.prepend(titleWrappingDiv);
    }
  }, []);

  useEffect(() => {
    const layersControl = document.querySelector(".leaflet-control-layers");

    if (layersControl) {
      layersControl.addEventListener("mouseover", handleMouseOver);
      layersControl.addEventListener("mouseout", handleMouseOut);

      return () => {
        layersControl.removeEventListener("mouseover", handleMouseOver);
        layersControl.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, []);

  useEffect(() => {
    if (customTitle) {
      if (expanded)
        customTitle.className =
          "custom-layers-control-title-wrapping-div block";
      else if (!expanded)
        customTitle.className =
          "custom-layers-control-title-wrapping-div hidden";
    }
  }, [expanded]);

  const handleMouseOver = () => {
    setExpanded(true);
  };

  const handleMouseOut = () => {
    setExpanded(false);
  };

  return <LayersControl>{children}</LayersControl>;
}

export default CustomLayersControl;
