import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Legend = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create(
        "div",
        "info legend bg-white rounded-md shadow-lg"
      );

      const grades = [35000, 30000, 25000, 20000, 15000, 10000, 5000, "Ground"];
      const labels = [
        `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${getColor(
              35000
            )}"></i>
            <span class="ml-2 text-secondary-600">${35000 / 1000}k+</span>
          </div>
        `,
        `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${getColor(
              30000
            )}"></i>
            <span class="ml-2 text-secondary-600">${30000 / 1000}k - ${
          35000 / 1000
        }k</span>
          </div>
        `,
        `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${getColor(
              25000
            )}"></i>
            <span class="ml-2 text-secondary-600">${25000 / 1000}k - ${
          30000 / 1000
        }k</span>
          </div>
        `,
        `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${getColor(
              20000
            )}"></i>
            <span class="ml-2 text-secondary-600">${20000 / 1000}k - ${
          25000 / 1000
        }k</span>
          </div>
        `,
        `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${getColor(
              15000
            )}"></i>
            <span class="ml-2 text-secondary-600">${15000 / 1000}k - ${
          20000 / 1000
        }k</span>
          </div>
        `,
        `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${getColor(
              10000
            )}"></i>
            <span class="ml-2 text-secondary-600">${10000 / 1000}k - ${
          15000 / 1000
        }k</span>
          </div>
        `,
        `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${getColor(
              5000
            )}"></i>
            <span class="ml-2 text-secondary-600">${5000 / 1000}k - ${
          10000 / 1000
        }k</span>
          </div>
        `,
        `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${getColor(
              0
            )}"></i>
            <span class="ml-2 text-secondary-600">0 - ${5000 / 1000}k</span>
          </div>
        `,
        `
          <div class="flex items-center mb-1">
            <i class="w-4 h-4 inline-block rounded-md drop-shadow-md" style="background:${getColor(
              "Ground"
            )}"></i>
            <span class="ml-2 text-secondary-600">Ground</span>
          </div>
        `,
      ].join("");

      div.innerHTML = `
        <div class="flex justify-center items-center py-1 rounded-t-md drop-shadow-md bg-secondary-100 text-secondary-600 font-semibold">
          Altitude (ft)
        </div>
        <div class="px-2 py-1">
          ${labels}
        </div>
      `;

      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  function getColor(d) {
    return d >= 35000
      ? "#93c5fd"
      : d >= 30000
      ? "#60a5fa"
      : d >= 25000
      ? "#3b82f6"
      : d >= 20000
      ? "#2563eb"
      : d >= 15000
      ? "#1d4ed8"
      : d >= 10000
      ? "#1e40af"
      : d >= 5000
      ? "#1e3a8a"
      : d !== "Ground"
      ? "#172554"
      : "#6B7280";
  }

  return null;
};

export default Legend;
