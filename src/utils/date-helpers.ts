export function getWeekDates(referenceDate: Date = new Date()): Array<Date> {
  // Create a copy of the reference date to avoid mutation
  const date = new Date(referenceDate);

  // Get the day of the week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = date.getDay();

  // Calculate Sunday (start of week)
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayOfWeek);
  sunday.setHours(0, 0, 0, 0);

  // Calculate Saturday (end of week)
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  saturday.setHours(23, 59, 59, 999);

  // Generate all dates in the week
  const weekDates: Date[] = [];
  const currentDate = new Date(sunday);

  while (currentDate <= saturday) {
    weekDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekDates;
}

function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function combineDateAndTimeSafe(
  datePart: Date,
  timePart: Date,
): Date | null {
  if (!isValidDate(datePart) || !isValidDate(timePart)) {
    return null;
  }
  return new Date(
    datePart.getFullYear(),
    datePart.getMonth(),
    datePart.getDate(),
    timePart.getHours(),
    timePart.getMinutes(),
    timePart.getSeconds(),
    timePart.getMilliseconds(),
  );
}

function isDateToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
