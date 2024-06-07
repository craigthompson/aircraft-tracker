import { metersToFeet } from "./distance.js";

/**
 * Converts metric velocity (m/s) to imperial miles per hour (mph).
 *
 * @param {float} metersPerSecond m/s to convert to mph.
 * @returns {float} calculated miles per hour (mph).
 */
export const toMilesPerHour = (metersPerSecond) => {
  const milesPerSecond = toFeetPerSecond(metersPerSecond) * (1 / 5280);
  const milesPerMinute = milesPerSecond * 60;
  return milesPerMinute * 60; // Miles per hour
};

/**
 * Converts given meters per second to feet per second.
 *
 * @param {float} metersPerSecond to convert to feet per second.
 * @returns {float} calculated feet per second.
 */
export const toFeetPerSecond = (metersPerSecond) => {
  return metersToFeet(metersPerSecond);
};

/**
 * Converts given meters per second to feet per minute.
 *
 * @param {float} metersPerSecond to convert to feet per minute.
 * @returns {float} calculated feet per minute.
 */
export const toFeetPerMinute = (metersPerSecond) => {
  return metersToFeet(metersPerSecond) * 60;
};

/**
 * Converts miles per hour (mph) to imperial knots.
 *
 * @param {float} milesPerHour mph to convert to knots (kts).
 * @returns {float} calculated knots (kts).
 */
export const toKnots = (milesPerHour) => milesPerHour * 0.868976;
