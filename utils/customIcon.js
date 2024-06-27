import Tailwind from "../tailwind.config.js";

/**
 * Returns an icon Tailwind CSS classnames appropriate for a
 *   given aircraft altitude, in feet.
 *
 * @param altitudeFeet - the aircraft's current
 *   altitude, in feet, or null if the aircraft is on the
 *   ground.
 * @returns {String} Appropriate Tailwind CSS classnames to
 *   style the icon based on given altitude, in feet.
 */
export const iconColor = (altitudeFeet) => {
  // Is aircraft on the ground
  if (altitudeFeet === null) {
    return "text-secondary-500 drop-shadow-md";
  } else if (altitudeFeet < 5000) {
    return `text-primary-1000`;
  } else if (altitudeFeet < 10000) {
    return `text-primary-900`;
  } else if (altitudeFeet < 15000) {
    return `text-primary-800`;
  } else if (altitudeFeet < 20000) {
    return `text-primary-700`;
  } else if (altitudeFeet < 25000) {
    return `text-primary-600`;
  } else if (altitudeFeet < 30000) {
    return `text-primary-500`;
  } else if (altitudeFeet < 35000) {
    return `text-primary-400`;
  } else {
    return `text-primary-300`;
  }
};

/**
 * Returns an rgba color value appropriate for the given climb
 *   rate.
 * If the aircraft is descending it gets a red color, with a
 *   brighter tone for faster rates.
 * If the aircraft is ascending it gets a green color, with a
 *   brighter tone for faster rates.
 *
 * @param {Float} climbRateFpm - the climb rate in feet per
 *   minute.
 * @returns {String} A string of the rgba color value.
 */
export const iconOutline = (climbRateFpm) => {
  const minClimbRateFactor = 50;

  const mappedValue = () => {
    const climbRatFpmAbsoluteValue = Math.abs(climbRateFpm);
    const originalMin = minClimbRateFactor;
    const originalMax = 1500;
    const newMin = 100;
    const newMax = 255;

    return (
      newMin +
      ((climbRatFpmAbsoluteValue - originalMin) * (newMax - newMin)) /
        (originalMax - originalMin)
    );
  };

  // Cap the value at a max of 255
  const colorBrightness = Math.min(Math.round(mappedValue()), 255);
  if (climbRateFpm <= -minClimbRateFactor) {
    return `rgba(${colorBrightness}, 0, 0, 0.9)`;
  } else if (climbRateFpm >= minClimbRateFactor) {
    return `rgba(0, ${colorBrightness}, 0, 0.9)`;
  }
  return "";
};

/**
 * Returns a string of an appropriate custom Tailwind CSS drop
 *   shadow based on the given aircraft altitude in feet.
 * If the aircraft is on the ground it gets a very close shadow.
 * If the aircraft is at higher altitudes it gets a more distant
 *   and blurred shadow.
 *
 * @see {@link Tailwind~dropShadow} for the custom Tailwind
 *   drop shadow configurations
 *
 * @param {Float} altitudeFeet - the altitude, in feet.
 * @returns {String} A string of the appropriate custom Tailwind
 *   CSS drop shadow class name, or an empty string.
 */
export const aircraftIconDropShadow = (altitudeFeet) => {
  let dropShadow = "";
  switch (Math.floor(altitudeFeet / 1000)) {
    case 0:
      dropShadow = "drop-shadow-0md";
      break;
    case 1:
      dropShadow = "drop-shadow-1md";
      break;
    case 2:
      dropShadow = "drop-shadow-2md";
      break;
    case 3:
      dropShadow = "drop-shadow-3md";
      break;
    case 4:
      dropShadow = "drop-shadow-4md";
      break;
    case 5:
      dropShadow = "drop-shadow-5md";
      break;
    case 6:
      dropShadow = "drop-shadow-6md";
      break;
    case 7:
      dropShadow = "drop-shadow-7md";
      break;
    case 8:
      dropShadow = "drop-shadow-8md";
      break;
    case 9:
      dropShadow = "drop-shadow-9md";
      break;
    case 10:
      dropShadow = "drop-shadow-10md";
      break;
    case 11:
      dropShadow = "drop-shadow-11md";
      break;
    case 12:
      dropShadow = "drop-shadow-12md";
      break;
    case 13:
      dropShadow = "drop-shadow-13md";
      break;
    case 14:
      dropShadow = "drop-shadow-14md";
      break;
    case 15:
      dropShadow = "drop-shadow-15md";
      break;
    case 16:
      dropShadow = "drop-shadow-16md";
      break;
    case 17:
      dropShadow = "drop-shadow-17md";
      break;
    case 18:
      dropShadow = "drop-shadow-18md";
      break;
    case 19:
      dropShadow = "drop-shadow-19md";
      break;
    case 20:
      dropShadow = "drop-shadow-20md";
      break;
    case 21:
      dropShadow = "drop-shadow-21md";
      break;
    case 22:
      dropShadow = "drop-shadow-22md";
      break;
    case 23:
      dropShadow = "drop-shadow-23md";
      break;
    case 24:
      dropShadow = "drop-shadow-24md";
      break;
    case 25:
      dropShadow = "drop-shadow-25md";
      break;
    case 26:
      dropShadow = "drop-shadow-26md";
      break;
    case 27:
      dropShadow = "drop-shadow-27md";
      break;
    case 28:
      dropShadow = "drop-shadow-28md";
      break;
    case 29:
      dropShadow = "drop-shadow-29md";
      break;
    default:
      dropShadow = "drop-shadow-30md";
  }
  return dropShadow;
};

/**
 * Returns appropriate icon size properties based on the
 *   given map zoom level.
 *
 * @param {Number} mapZoom - the map's current zoom level.
 * @returns {{
 *   cssSize: String,
 *   pixelSize: Number
 * }}
 * An object with a cssSize of a Tailwind CSS classname and
 *   a pixelSize for the square dimensions of the icon.
 */
export const iconSize = (mapZoom) => {
  const iconSizeProps = {
    cssSize: "",
    pixelSize: 0,
  };
  const transition = "transform transition-all duration-1000 ease-linear";

  if (mapZoom < 12) {
    iconSizeProps.cssSize = `${transition} text-4xl`;
    iconSizeProps.pixelSize = 36;
  } else if (mapZoom < 16) {
    iconSizeProps.cssSize = `${transition} text-5xl`;
    iconSizeProps.pixelSize = 48;
  } else if (mapZoom < 18) {
    iconSizeProps.cssSize = `${transition} text-6xl`;
    iconSizeProps.pixelSize = 60;
  } else {
    iconSizeProps.cssSize = `${transition} text-7xl`;
    iconSizeProps.pixelSize = 72;
  }
  return iconSizeProps;
};
