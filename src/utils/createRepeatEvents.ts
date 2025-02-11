import { Event, RepeatType } from '../types';
import { formatDate } from './dateUtils';

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

// 반복 타입에 따라 다음 날짜를 계산하는 헬퍼 함수
const getNextDate = (baseDate: Date, type: RepeatType, i: number): Date => {
  const newDate = new Date(baseDate);
  switch (type) {
    case 'daily':
      newDate.setDate(newDate.getDate() + i);
      break;
    case 'weekly':
      newDate.setDate(newDate.getDate() + i * 7);
      break;
    case 'monthly':
      if (baseDate.getDate() === 31) {
        return getNthMonthWith31(baseDate, i);
      }
      return getNextMonth(baseDate, i);
    case 'yearly':
      // 윤년 처리
      if (baseDate.getMonth() === 1 && baseDate.getDate() === 29) {
        const nextLeapYear = getNextLeapYear(baseDate.getFullYear(), i);
        newDate.setFullYear(nextLeapYear);
      } else {
        // 2월 29일이 아니면 일반적으로 i년을 더한다.
        newDate.setFullYear(newDate.getFullYear() + i);
      }
      break;
  }
  return newDate;
};

export const createRepeatEvents = (event: Event): Event[] => {
  // 반복 정보가 없거나 반복 타입이 'none'이면 빈 배열 반환
  if (!event.repeat || event.repeat.type === 'none') return [];

  const { type, interval, endDate } = event.repeat;
  const baseDate = new Date(event.date);

  // 원래 일정 포함 + 추가 반복: 예를 들어 interval이 1이면 두 개의 이벤트(원래 일정 + 1회 반복)를 생성
  const repeatEvents = Array.from({ length: interval + 1 }, (_, i) => ({
    ...event,
    date: formatDate(getNextDate(baseDate, type, i)),
  }));

  return endDate ? repeatEvents.filter((event) => event.date <= endDate) : repeatEvents;
};
