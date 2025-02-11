import { Event, RepeatType } from '../types';
import { formatDate } from './dateUtils';

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
      newDate.setMonth(newDate.getMonth() + i);
      break;
    case 'yearly':
      newDate.setFullYear(newDate.getFullYear() + i);
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
