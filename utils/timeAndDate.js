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

  // Get the timezone
  const timezone = Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone.replace(/^[A-z]*\//g, "");

  // Construct the formatted date string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${timezone}`;
};
