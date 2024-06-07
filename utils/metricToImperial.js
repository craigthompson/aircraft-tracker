/**
 * Converts given meters to equivalent feet.
 *
 * @param {float} meters to convert to feet.
 * @returns {float} calculated feet from given meters.
 */
export const metersToFeet = (meters) => meters * 3.281;

/**
 * Converts metric velocity (m/s) to imperial miles per hour (mph).
 *
 * @param {float} metersPerSecond m/s to convert to mph.
 * @returns {float} calculated miles per hour (mph).
 */
export const milesPerHour = (metersPerSecond) => {
  const milesPerSecond = feetPerSecond(metersPerSecond) * (1 / 5280);
  const milesPerMinute = milesPerSecond * 60;
  return milesPerMinute * 60; // Miles per hour
};

/**
 * Converts given meters per second to feet per second.
 *
 * @param {float} metersPerSecond to convert to feet per second.
 * @returns {float} calculated feet per second.
 */
export const feetPerSecond = (metersPerSecond) => {
  return metersToFeet(metersPerSecond);
};

/**
 * Converts given meters per second to feet per minute.
 *
 * @param {float} metersPerSecond to convert to feet per minute.
 * @returns {float} calculated feet per minute.
 */
export const feetPerMinute = (metersPerSecond) => {
  return metersToFeet(metersPerSecond) * 60;
};
