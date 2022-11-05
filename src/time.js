import {padStart} from "lodash";

export function wrapHours(hour) {
  if (hour < 0) {
    return hour + 24;
  }
  if (hour > 23) {
    return hour - 24;
  }
  return hour;
}

export function wrapMinSecs(minutesOrSeconds) {
  return minutesOrSeconds < 0 ? minutesOrSeconds + 60 : minutesOrSeconds;
}

export function padTime(time) {
  return padStart(time, 2, '0');
}

export function secondsFromSeconds(seconds) {
  return padTime(seconds % 60);
}

export function minutesFromSeconds(seconds) {
  return padStart(Math.floor(seconds / 60) % 60, 2, '0');
}

export function hoursFromSeconds(seconds) {
  return padStart(Math.floor(seconds / 3600), 2, '0')
}

export function formatSecondsToHHMMSS(seconds) {
  const formatted = `${minutesFromSeconds(seconds)}:${secondsFromSeconds(seconds)}`;
  const hours = seconds > 3600 ? `${hoursFromSeconds(seconds)}:` : '';
  return hours + formatted;
}

export const tourQueueTime = 120;
