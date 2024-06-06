export const unixSecondsToLocal = (unixSec) => {
  // Convert the unixSec from seconds to milliseconds
  const date = new Date(unixSec * 1000);

  // Extract individual components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  // Get the timezone offset in minutes and convert to hours and minutes
  const timezoneOffset = -date.getTimezoneOffset(); // getTimezoneOffset() returns the offset in minutes from UTC
  const offsetSign = timezoneOffset >= 0 ? "+" : "-";
  const offsetHours = String(
    Math.floor(Math.abs(timezoneOffset) / 60)
  ).padStart(2, "0");
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, "0");
  const timezone = `${offsetSign}${offsetHours}:${offsetMinutes}`;

  // Construct the formatted date string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${timezone}`;
};

console.log(unixSecondsToLocal(1717448875)); // 2024-06-05 14:20:22.185-06
