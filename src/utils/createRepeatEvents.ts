import { Event } from '../types';
import { formatDate } from './dateUtils';

export const createRepeatEvents = (event: Event): Event[] => {
  // 반복 정보가 없거나 반복 타입이 'none'이면 빈 배열 반환
  if (!event.repeat || event.repeat.type === 'none') return [];

  const repeatEvents: Event[] = [];
  const { type, interval } = event.repeat;
  const baseDate = new Date(event.date);

  // 원래 일정 포함 + 추가 반복: 예를 들어 interval이 1이면 두 개의 이벤트(원래 일정 + 1회 반복)를 생성
  for (let i = 0; i <= interval; i++) {
    const nextDate = new Date(baseDate);

    if (type === 'daily') {
      nextDate.setDate(nextDate.getDate() + i);
    } else if (type === 'weekly') {
      nextDate.setDate(nextDate.getDate() + i * 7);
    } else if (type === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + i);
    }

    repeatEvents.push({
      ...event,
      date: formatDate(nextDate),
    });
  }

  return repeatEvents;
};
