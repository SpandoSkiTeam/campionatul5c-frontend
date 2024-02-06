export function downloadJson(jsonData: any, filename: string): void {
  // Convert JSON data to string
  const jsonString = JSON.stringify(jsonData, null, 2);

  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a link element
  const link = document.createElement("a");

  // Set the download attribute with the filename
  link.download = filename;

  // Create a URL for the blob and set it as the href attribute
  link.href = window.URL.createObjectURL(blob);

  // Append the link to the document body
  document.body.appendChild(link);

  // Trigger the download by simulating a click on the link
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
}

export const calculatePoints = (position) => {
  switch (position) {
    case 1:
      return 100;
    case 2:
      return 80;
    case 3:
      return 60;
    case 4:
      return 40;
    case 5:
      return 20;
    default:
      return 10;
  }
};

export const timeStringToMilliseconds = (timeString) => {
  if (!timeString || timeString === "N/A" || timeString.trim() === "") {
    return Infinity; // To handle non-finishers
  }

  // Split the time string into its components
  const parts = timeString.split(":");
  let hours = "",
    minutes = "",
    seconds = "",
    milliseconds = "";

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
  } else {
    [seconds] = parts;
  }

  const secondsParts = seconds.split(".");
  if (secondsParts.length === 2) {
    seconds = secondsParts[0];
    milliseconds = secondsParts[1].padEnd(3, "0").slice(0, 3);
  }

  let result =
    parseInt(minutes) * 60000 +
    parseInt(seconds) * 1000 +
    parseInt(milliseconds);
  if (hours) result += parseInt(hours) * 3600000;
  return result;
};

export const getTotalTimeMilliseconds = (time1, time2) => {
  return timeStringToMilliseconds(time1) + timeStringToMilliseconds(time2);
};

export const getTotalTime = (time1, time2) => {
  const totalMilliseconds = getTotalTimeMilliseconds(time1, time2);
  // Convert total milliseconds back to the time format
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const milliseconds = totalMilliseconds % 1000;
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
};
