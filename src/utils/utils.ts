export const isWithinDateRange = (
  reviewDate: string,
  startDate: string,
  endDate: string
): boolean => {
  const reviewTime = new Date(reviewDate).getTime();
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  return reviewTime >= startTime && reviewTime <= endTime;
};


export const validateDate = (dateStr: string): boolean => {
  const iso8601Regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (!iso8601Regex.test(dateStr)) {
    console.error(`Invalid date format: ${dateStr}. Expected format is YYYY-MM-DD.`);
    return false;
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.error(`Invalid date: ${dateStr}. The date does not exist in the calendar.`);
    return false;
  }

  const currentDate = new Date();
  const minDate = new Date("2000-01-01");
  if (date < minDate || date > currentDate) {
    console.error(`Date out of range: ${dateStr}. Must be between 2000-01-01 and today.`);
    return false;
  }

  return true;
};

export function calculateYearsAgo(date: string) {
  const currentDate = new Date();
  const givenDate = new Date(date);
  const yearsAgo = currentDate.getFullYear() - givenDate.getFullYear();

  // Adjust for cases where the given date is after the current month's day , have to write the logic for months ago as well
  if (
    currentDate.getMonth() < givenDate.getMonth() ||
    (currentDate.getMonth() === givenDate.getMonth() &&
      currentDate.getDate() < givenDate.getDate())
  ) {
    return yearsAgo - 1;
  }
  return yearsAgo;
}
