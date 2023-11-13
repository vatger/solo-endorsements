export function addDaysToDate(startDate, daysToAdd) {
  const result = new Date(startDate);
  result.setDate(startDate.getDate() + daysToAdd);
  return result;
}

export function createDateWithDayOffset(offsetInDays: number) {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  date.setDate(date.getDate() + offsetInDays);

  return date;
}

export function calculateDayDifference(startDate, endDate) {
  // Convert both dates to milliseconds
  const startMilliseconds = startDate.getTime();
  const endMilliseconds = endDate.getTime();

  // Calculate the time difference in milliseconds
  const timeDifference = endMilliseconds - startMilliseconds;

  // Calculate the day difference by dividing the time difference by the number of milliseconds in a day (24 * 60 * 60 * 1000)
  const dayDifference = Math.floor(timeDifference / (24 * 60 * 60 * 1000));

  return dayDifference;
}
