export function adjustTime(inputTime: string, offsetMinutes: number): string {
  const timeParts = inputTime.split(':');
  if (timeParts.length !== 3) {
    throw new Error('Invalid time format. Please use HH:mm format.');
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(
      'Invalid time. Hours must be between 0-23 and minutes between 0-59.',
    );
  }

  const totalMinutes = hours * 60 + minutes + offsetMinutes;

  const newHours = Math.floor((((totalMinutes % 1440) + 1440) % 1440) / 60);
  const newMinutes = ((totalMinutes % 60) + 60) % 60;

  const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:00`;
  return formattedTime;
}

export function formatDurationInMinutes(durationInSec: number): string {
  const minutes = Math.ceil(durationInSec / 60);
  return `${minutes}m`;
}

export function formatDateFromDateTime(timestamp: Date) {
  return timestamp.toISOString().slice(0, 10);
}

export function timeToSeconds(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function timeDifferenceInSeconds(time1, time2) {
  const seconds1 = timeToSeconds(time1);
  const seconds2 = timeToSeconds(time2);

  return seconds1 - seconds2;
}

export function processTimeStatus(
  updatedAt: string | Date,
  reviewTime: number,
  returnTime: boolean = false,
) {
  try {
    const currentTime = new Date().getTime();
    const updatedTime = new Date(updatedAt).getTime();

    return returnTime
      ? [
          Math.max(reviewTime - (currentTime - updatedTime), 0),
          currentTime - updatedTime > reviewTime,
        ]
      : currentTime - updatedTime > reviewTime;
  } catch (error) {
    throw error;
  }
}
