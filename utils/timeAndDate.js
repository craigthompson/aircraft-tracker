const convertToLocalDate = (unixSec) => {
  // Convert the unixSec from seconds to milliseconds
  const date = new Date(unixSec * 1000);

  // Extract individual date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return { year: year, month: month, day: day };
};

const convertToLocalTime = (unixSec) => {
  // Convert the unixSec from seconds to milliseconds
  const date = new Date(unixSec * 1000);

  // Extract individual time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: milliseconds,
  };
};

const timezone = () => {
  // Get the timezone
  return Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.replace(/^[A-z]*\//g, "");
};

export const unixSecondsToLocalDateTime = (unixSec) => {
  const date = convertToLocalDate(unixSec);
  const time = convertToLocalTime(unixSec);

  // Construct the formatted date string
  return `${date.year}-${date.month}-${date.day} ${time.hours}:${
    time.minutes
  }:${time.seconds} ${timezone()}`;
};

export const unixSecondsToLocalTime = (unixSec) => {
  const time = convertToLocalTime(unixSec);

  // Construct the formatted time string
  return `${time.hours}:${time.minutes}:${time.seconds} (${timezone()} Time)`;
};

export const currentLocalTime = () => {
  const currentUnixTimeSeconds = Date.now() / 1000; // Convert to seconds from millis
  const time = convertToLocalTime(currentUnixTimeSeconds);

  // Construct the formatted time string
  return `${time.hours}:${time.minutes}:${time.seconds} (${timezone()} Time)`;
};
