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
