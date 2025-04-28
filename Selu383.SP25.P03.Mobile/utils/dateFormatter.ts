export const formatDate = (date: Date, formatString: string): string => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = date.getMinutes().toString();
  const seconds = date.getSeconds().toString();
  const ampm = hours24 < 12 ? "am" : "pm";
  const AMPM = hours24 < 12 ? "AM" : "PM";

  return formatString
    .replace("YYYY", year)
    .replace("YY", year.slice(-2))
    .replace("MM", month.padStart(2, "0"))
    .replace("M", month)
    .replace("DD", day.padStart(2, "0"))
    .replace("D", day)
    .replace("HH", hours24.toString().padStart(2, "0"))
    .replace("H", hours24.toString())
    .replace("hh", hours12.toString().padStart(2, "0"))
    .replace("h", hours12.toString())
    .replace("mm", minutes.padStart(2, "0"))
    .replace("m", minutes)
    .replace("ss", seconds.padStart(2, "0"))
    .replace("s", seconds)
    .replace("A", AMPM)
    .replace("a", ampm);
};

export const formatRelativeTime = (
  date: Date,
  baseDate = new Date()
): string => {
  const MINUTE = 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const WEEK = DAY * 7;
  const MONTH = DAY * 30;
  const YEAR = DAY * 365;

  const seconds = Math.round((date.getTime() - baseDate.getTime()) / 1000);
  const absSeconds = Math.abs(seconds);
  const isFuture = seconds > 0;
  const prefix = isFuture ? "in " : "";
  const suffix = isFuture ? "" : " ago";

  if (absSeconds < MINUTE) {
    return seconds === 0
      ? "just now"
      : `${prefix}${absSeconds} seconds${suffix}`;
  } else if (absSeconds < HOUR) {
    const minutes = Math.round(absSeconds / MINUTE);
    return `${prefix}${minutes} minute${minutes !== 1 ? "s" : ""}${suffix}`;
  } else if (absSeconds < DAY) {
    const hours = Math.round(absSeconds / HOUR);
    return `${prefix}${hours} hour${hours !== 1 ? "s" : ""}${suffix}`;
  } else if (absSeconds < WEEK) {
    const days = Math.round(absSeconds / DAY);
    return `${prefix}${days} day${days !== 1 ? "s" : ""}${suffix}`;
  } else if (absSeconds < MONTH) {
    const weeks = Math.round(absSeconds / WEEK);
    return `${prefix}${weeks} week${weeks !== 1 ? "s" : ""}${suffix}`;
  } else if (absSeconds < YEAR) {
    const months = Math.round(absSeconds / MONTH);
    return `${prefix}${months} month${months !== 1 ? "s" : ""}${suffix}`;
  } else {
    const years = Math.round(absSeconds / YEAR);
    return `${prefix}${years} year${years !== 1 ? "s" : ""}${suffix}`;
  }
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const endMonth = endDate.toLocaleString("default", { month: "short" });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  if (startYear !== endYear) {
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
  } else if (startMonth !== endMonth) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
  } else {
    return `${startMonth} ${startDay} - ${endDay}, ${startYear}`;
  }
};

export const getDateStringForPeriod = (
  period: "today" | "tomorrow" | "thisWeek" | "nextWeek" | "thisMonth"
): string => {
  const today = new Date();

  switch (period) {
    case "today":
      return formatDate(today, "MMMM D, YYYY");
    case "tomorrow":
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDate(tomorrow, "MMMM D, YYYY");
    case "thisWeek":
      const startOfWeek = new Date(today);
      const endOfWeek = new Date(today);
      const currentDay = today.getDay();
      startOfWeek.setDate(today.getDate() - currentDay);
      endOfWeek.setDate(today.getDate() + (6 - currentDay));
      return formatDateRange(startOfWeek, endOfWeek);
    case "nextWeek":
      const nextWeekStart = new Date(today);
      const nextWeekEnd = new Date(today);
      nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
      return formatDateRange(nextWeekStart, nextWeekEnd);
    case "thisMonth":
      const monthName = today.toLocaleString("default", { month: "long" });
      const year = today.getFullYear();
      return `${monthName} ${year}`;
    default:
      return formatDate(today, "MMMM D, YYYY");
  }
};
