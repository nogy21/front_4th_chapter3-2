import { Event, RepeatType } from '../types';

/**
 * 주어진 년도와 월의 일수를 반환합니다.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 주어진 날짜가 속한 주의 모든 날짜를 반환합니다.
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const sunday = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(sunday);
    nextDate.setDate(sunday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
}

export function getWeeksAtMonth(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month + 1);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = [];

  const initWeek = () => Array(7).fill(null);

  let week: Array<number | null> = initWeek();

  for (let i = 0; i < firstDayOfMonth; i++) {
    week[i] = null;
  }

  for (const day of days) {
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    week[dayIndex] = day;
    if (dayIndex === 6 || day === daysInMonth) {
      weeks.push(week);
      week = initWeek();
    }
  }

  return weeks;
}

export function getEventsForDay(events: Event[], date: number): Event[] {
  return events.filter((event) => new Date(event.date).getDate() === date);
}

export function formatWeek(targetDate: Date) {
  const dayOfWeek = targetDate.getDay();
  const diffToThursday = 4 - dayOfWeek;
  const thursday = new Date(targetDate);
  thursday.setDate(targetDate.getDate() + diffToThursday);

  const year = thursday.getFullYear();
  const month = thursday.getMonth() + 1;

  const firstDayOfMonth = new Date(thursday.getFullYear(), thursday.getMonth(), 1);

  const firstThursday = new Date(firstDayOfMonth);
  firstThursday.setDate(1 + ((4 - firstDayOfMonth.getDay() + 7) % 7));

  const weekNumber: number =
    Math.floor((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return `${year}년 ${month}월 ${weekNumber}주`;
}

/**
 * 주어진 날짜의 월 정보를 "YYYY년 M월" 형식으로 반환합니다.
 */
export function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * 주어진 날짜가 특정 범위 내에 있는지 확인합니다.
 */
export function isDateInRange(date: Date, rangeStart: Date, rangeEnd: Date): boolean {
  const normalizedDate = stripTime(date);
  const normalizedStart = stripTime(rangeStart);
  const normalizedEnd = stripTime(rangeEnd);

  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
}

export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, '0');
}

export function formatDate(currentDate: Date, day?: number) {
  return [
    currentDate.getFullYear(),
    fillZero(currentDate.getMonth() + 1),
    fillZero(day ?? currentDate.getDate()),
  ].join('-');
}

// baseDate가 31일인 경우, n번째 31일이 있는 달의 31일 날짜를 반환하는 헬퍼 함수
const getNthMonthWith31 = (baseDate: Date, n: number): Date => {
  let year = baseDate.getFullYear();
  let month = baseDate.getMonth();
  let count = 0;
  // n번째 31일이 존재하는 달을 찾을 때까지 달을 증가시킨다.
  while (count < n) {
    month++;
    if (month > 11) {
      year += Math.floor(month / 12);
      month = month % 12;
    }
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // 해당 달에 31일이 존재하면 count 증가
    if (daysInMonth >= 31) {
      count++;
    }
  }
  return new Date(year, month, 31);
};

const getNextMonth = (baseDate: Date, n: number): Date => {
  const nextMonth = baseDate.getMonth() + n;
  if (nextMonth > 11) {
    baseDate.setFullYear(baseDate.getFullYear() + Math.floor(nextMonth / 12));
  }
  baseDate.setMonth(nextMonth);
  return baseDate;
};

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getNextLeapYear = (year: number, i: number): number => {
  let leapCount = 0;
  // i번째 다음 윤년을 찾는다.
  while (leapCount < i) {
    if (isLeapYear(++year)) {
      leapCount++;
    }
  }
  return year;
};

/**
 * 반복 타입에 따라 다음 날짜를 계산한다.
 * @param baseDate 시작 날짜
 * @param type 반복 타입
 * @param interval 반복 횟수
 * @returns 다음 날짜
 */
export const getNextDate = (baseDate: Date, type: RepeatType, interval: number): Date => {
  const newDate = new Date(baseDate);
  switch (type) {
    case 'daily':
      newDate.setDate(newDate.getDate() + interval);
      break;
    case 'weekly':
      newDate.setDate(newDate.getDate() + interval * 7);
      break;
    case 'monthly':
      if (baseDate.getDate() === 31) {
        return getNthMonthWith31(baseDate, interval);
      }
      return getNextMonth(baseDate, interval);
    case 'yearly':
      // 윤년 처리
      if (baseDate.getMonth() === 1 && baseDate.getDate() === 29) {
        const nextLeapYear = getNextLeapYear(baseDate.getFullYear(), interval);
        newDate.setFullYear(nextLeapYear);
      } else {
        // 2월 29일이 아니면 일반적으로 i년을 더한다.
        newDate.setFullYear(newDate.getFullYear() + interval);
      }
      break;
  }
  return newDate;
};

export const MAX_REPEAT_DATE = '2025-06-30';
const DAY_IN_SECONDS = 1000 * 60 * 60 * 24;

/**
 * 반복 타입에 따라 반복 횟수를 계산한다.
 * @param type 반복 타입
 * @param baseDate 시작 날짜
 * @param endDate 종료 날짜
 * @returns 반복 횟수
 */
export const getRepeatCount = (type: RepeatType, baseDate: Date, endDate: string): number => {
  const start = new Date(baseDate);
  const end = new Date(
    `${new Date(endDate).getTime() > new Date(MAX_REPEAT_DATE).getTime() ? MAX_REPEAT_DATE : endDate}T23:59:59.000Z`
  );

  const timeDiff = end.getTime() - start.getTime();
  const monthDiff = end.getMonth() - start.getMonth();
  const yearDiff = end.getFullYear() - start.getFullYear();

  switch (type) {
    case 'daily':
      return Math.floor(timeDiff / DAY_IN_SECONDS);
    case 'weekly':
      return Math.floor(timeDiff / (DAY_IN_SECONDS * 7));
    case 'monthly':
      return yearDiff * 12 + monthDiff;
    case 'yearly':
      return yearDiff;
    default:
      return 1;
  }
};
