import type { GameTime } from "@/types/game";

// Fictional simplified calendar: every month has exactly 30 days.
// This keeps payday/rent-cycle math simple and deterministic.
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;

export function toAbsoluteDay(time: GameTime): number {
  return time.year * MONTHS_PER_YEAR * DAYS_PER_MONTH + (time.month - 1) * DAYS_PER_MONTH + (time.day - 1);
}

export function addMinutes(time: GameTime, minutes: number): GameTime {
  let totalMinutes = time.hour * 60 + time.minute + minutes;
  let day = time.day;
  let month = time.month;
  let year = time.year;

  while (totalMinutes >= 24 * 60) {
    totalMinutes -= 24 * 60;
    day += 1;
    if (day > DAYS_PER_MONTH) {
      day = 1;
      month += 1;
      if (month > MONTHS_PER_YEAR) {
        month = 1;
        year += 1;
      }
    }
  }

  return {
    year,
    month,
    day,
    hour: Math.floor(totalMinutes / 60),
    minute: totalMinutes % 60,
  };
}

export function daysBetween(a: GameTime, b: GameTime): number {
  return toAbsoluteDay(b) - toAbsoluteDay(a);
}

export function isWithinWorkingHours(time: GameTime, start: number, end: number): boolean {
  return time.hour >= start && time.hour < end;
}

export const INITIAL_TIME: GameTime = {
  year: 1,
  month: 1,
  day: 1,
  hour: 8,
  minute: 0,
};
