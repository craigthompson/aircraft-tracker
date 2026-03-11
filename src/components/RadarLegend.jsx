import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Colors taken directly from RainViewer's color table CSV (Universal Blue, scheme 2)
// https://www.rainviewer.com/files/rainviewer_api_colors_table.csv
const RAIN_LEVELS = [
  { color: "#ffffff", label: "Hail" },
  { color: "#ff77ff", label: "Extreme" },
  { color: "#c10000", label: "Very Heavy" },
  { color: "#ff8100", label: "Heavy" },
  { color: "#ffee00", label: "Moderate" },
  { color: "#005588", label: "Light-Moderate" },
  { color: "#00a3e0", label: "Light" },
];

const SNOW_LEVELS = [
  { color: "#3f7fff", label: "Moderate-Heavy Snow" },
  { color: "#b8f8ff", label: "Light Snow" },
];

const RadarLegend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create(
        "div",
        "info legend bg-white rounded-md shadow-md border-solid border-2 border-secondary-400",
      );

      const rainRows = RAIN_LEVELS.map(
        ({ label, color }) => `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md border border-gray-200" style="background:${color}"></i>
            <span class="ml-2 text-secondary-600 text-xs">${label}</span>
          </div>
        `,
      ).join("");

      const snowRows = SNOW_LEVELS.map(
        ({ label, color }) => `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${color}"></i>
            <span class="ml-2 text-secondary-600 text-xs">${label}</span>
          </div>
        `,
      ).join("");

      div.innerHTML = `
        <div class="flex justify-center items-center py-1 rounded-t-md drop-shadow-md bg-secondary-100 text-secondary-600">
          Weather Radar
        </div>
        <div class="px-2 pt-2 pb-1">
          ${rainRows}
        </div>
        <div class="px-2 pt-2 pb-1 border-t border-secondary-300">
          ${snowRows}
        </div>
      `;

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

export default RadarLegend;
