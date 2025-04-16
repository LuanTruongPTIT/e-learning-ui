import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const adjustEventsToThisWeek = (events: typeof calendarEvents) => {
  const today = new Date();
  const currentWeekDay = today.getDay(); // Chủ nhật = 0, Thứ 2 = 1, ..., Thứ 7 = 6
  const mondayOfThisWeek = new Date(today);
  mondayOfThisWeek.setDate(today.getDate() - currentWeekDay + 1); // Lấy thứ 2 trong tuần này

  return events.map((event) => {
    const dayOffset = event.start.getDay(); // giữ nguyên thứ của event gốc
    const newStart = new Date(mondayOfThisWeek);
    newStart.setDate(mondayOfThisWeek.getDate() + (dayOffset - 1));
    newStart.setHours(event.start.getHours(), event.start.getMinutes());

    const duration = event.end.getTime() - event.start.getTime();

    const newEnd = new Date(newStart.getTime() + duration);

    return {
      ...event,
      start: newStart,
      end: newEnd,
    };
  });
};
