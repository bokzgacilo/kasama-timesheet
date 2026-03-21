export type Weekday = {
  label: string;
  value: number;
  weekend: boolean;
};

export const WEEKDAYS: Weekday[] = [
  { label: "Mon", value: 1, weekend: false },
  { label: "Tue", value: 2, weekend: false },
  { label: "Wed", value: 3, weekend: false },
  { label: "Thu", value: 4, weekend: false },
  { label: "Fri", value: 5, weekend: false },
  { label: "Sat", value: 6, weekend: true },
  { label: "Sun", value: 0, weekend: true },
];

export const projects = ["Brand Junkie", "JHP", "Kasama Internal"];

export const cloneDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, amount: number) => {
  const next = cloneDate(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

const pad = (value: number) => String(value).padStart(2, "0");

export const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseDateKey = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const isWeekend = (date: Date) =>
  date.getDay() === 0 || date.getDay() === 6;

export const getStartOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(date, diff);
};

export const getWeekDates = (anchorDate: Date, showWeekends: boolean) => {
  const start = getStartOfWeek(anchorDate);
  const dates: Date[] = [];

  for (let index = 0; index < 7; index += 1) {
    const date = addDays(start, index);

    if (!showWeekends && isWeekend(date)) {
      continue;
    }

    dates.push(date);
  }

  return dates;
};

export const getMonthDates = (anchorDate: Date, showWeekends: boolean) => {
  const firstDay = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const lastDay = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);
  const gridStart = getStartOfWeek(firstDay);
  const lastWeekStart = getStartOfWeek(lastDay);
  const gridEnd = addDays(lastWeekStart, 6);
  const dates: Date[] = [];

  for (
    let cursor = cloneDate(gridStart);
    cursor <= gridEnd;
    cursor = addDays(cursor, 1)
  ) {
    if (!showWeekends && isWeekend(cursor)) {
      continue;
    }

    dates.push(cursor);
  }

  return dates;
};

export const formatMonthLabel = (date: Date) =>
  date.toLocaleString("en-US", { month: "long", year: "numeric" });

export const formatWeekLabel = (date: Date) => {
  const start = getStartOfWeek(date);
  const end = addDays(start, 6);

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleString("en-US", {
        month: "long",
      })} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`;
    }

    return `${start.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${end.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  return `${start.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} - ${end.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

export const getVisibleWeekdays = (showWeekends: boolean) =>
  WEEKDAYS.filter((day) => showWeekends || !day.weekend);
