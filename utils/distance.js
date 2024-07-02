/**
 * Converts given meters to equivalent feet.
 *
 * @param {float} meters to convert to feet.
 * @returns {float} calculated feet from given meters, or null if given
 *   meters is null.
 */
export const metersToFeet = (meters) => {
  if (meters === null) {
    return null;
  } else {
    return meters * 3.281;
  }
};

/**
 * Converts a given alitude in meters to an aviation flight level
 *   representing hundreds of feet above sea level.
 * @param {float} altitudeInMeters
 * @returns {integer} calculated flight level in hundreds of feet.
 */
export const flightLevelFeet = (altitudeInMeters) => {
  const altitudeInFeet = metersToFeet(altitudeInMeters);
  return Math.round(altitudeInFeet / 100);
};
