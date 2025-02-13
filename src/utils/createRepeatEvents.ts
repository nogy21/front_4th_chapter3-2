import { Event } from '../types';
import { formatDate, getNextDate, getRepeatCount, MAX_REPEAT_DATE } from './dateUtils';

/**
 * 반복 이벤트를 생성한다.
 *
 * @description
 *   - 반복 타입이 'none'이거나 반복 정보가 없으면 빈 배열 반환
 *   - 원래 일정 포함 + 추가 반복
 *     e.g. type: daily, interval: 1, date: '2025-02-14', endDate: '2025-02-17' 라면 오늘, 1일 뒤, 2일 뒤, 3일 뒤의 일정(총 4개)을 생성
 *     e.g. type: monthly, interval: 2, date: '2025-02-14' 라면 2월 14일, 4월 14일, 6월 14일, ... 의 일정을 생성
 *   - 종료일이 없을 경우 2025-06-30 까지 반복 일정을 생성
 *   - 종료일이 지정되어 있을 경우 종료일 이후의 이벤트는 생성되지 않는다.
 */
export const createRepeatEvents = (event: Event): Event[] => {
  if (!event.repeat || event.repeat.type === 'none') return [];

  const { type, interval, endDate = MAX_REPEAT_DATE } = event.repeat;

  const baseDate = new Date(event.date);
  const repeatCount = getRepeatCount(type, baseDate, endDate);
  const repeatEvents = Array.from({ length: repeatCount }, (_, i) => ({
    ...event,
    date: formatDate(getNextDate(baseDate, type, i * interval)),
  }));

  return endDate ? repeatEvents.filter((event) => event.date <= endDate) : repeatEvents;
};
