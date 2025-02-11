import { Event } from '../../types';
import { createRepeatEvents } from '../../utils/createRepeatEvents';

it('이벤트를 전달받으면 반복 일정 정보에 맞는 이벤트를 생성한다.', () => {
  const event: Event = {
    id: '1',
    title: 'test',
    date: '2024-01-01',
    startTime: '10:00',
    endTime: '11:00',
    description: 'test',
    location: 'test',
    category: 'test',
    repeat: {
      type: 'daily',
      interval: 1,
    },
    notificationTime: 10,
  };

  const repeatEvents = createRepeatEvents(event);

  expect(repeatEvents).toBeDefined();
  expect(repeatEvents.length).toBe(2);
  expect(repeatEvents[0].date).toBe('2024-01-01');
  expect(repeatEvents[1].date).toBe('2024-01-02');
});

it('반복 종료일이 지정되어 있고, 종료일 이후의 이벤트는 생성되지 않는다.', () => {
  const event: Event = {
    id: '1',
    title: 'test',
    date: '2024-01-01',
    startTime: '10:00',
    endTime: '11:00',
    description: 'test',
    location: 'test',
    category: 'test',
    repeat: {
      type: 'daily',
      interval: 2,
      endDate: '2024-01-02',
    },
    notificationTime: 10,
  };

  const repeatEvents = createRepeatEvents(event);

  expect(repeatEvents.length).toBe(2);
  expect(repeatEvents[0].date).toBe('2024-01-01');
  expect(repeatEvents[1].date).toBe('2024-01-02');
});

it('윤년 2월 29일 이벤트 생성 시 윤년마다 이벤트가 생성된다.', () => {
  const event: Event = {
    id: '1',
    title: 'test',
    date: '2024-02-29',
    startTime: '10:00',
    endTime: '11:00',
    description: 'test',
    location: 'test',
    category: 'test',
    repeat: {
      type: 'yearly',
      interval: 1,
    },
    notificationTime: 10,
  };

  const repeatEvents = createRepeatEvents(event);

  expect(repeatEvents.length).toBe(2);
  expect(repeatEvents[0].date).toBe('2024-02-29');
  expect(repeatEvents[1].date).not.toBe('2025-02-28');
  expect(repeatEvents[1].date).toBe('2028-02-29');
});

it('매월 31일 이벤트 생성 시 31일이 존재하는 달에 이벤트가 생성된다.', () => {
  const event: Event = {
    id: '1',
    title: 'test',
    date: '2024-01-31',
    startTime: '10:00',
    endTime: '11:00',
    description: 'test',
    location: 'test',
    category: 'test',
    repeat: {
      type: 'monthly',
      interval: 7,
    },
    notificationTime: 10,
  };

  const repeatEvents = createRepeatEvents(event);

  expect(repeatEvents.length).toBe(8);
  expect(repeatEvents[0].date).toBe('2024-01-31');
  expect(repeatEvents[1].date).not.toBe('2024-02-29');
  expect(repeatEvents[1].date).toBe('2024-03-31');
  expect(repeatEvents[2].date).not.toBe('2024-04-30');
  expect(repeatEvents[2].date).toBe('2024-05-31');
  expect(repeatEvents[3].date).not.toBe('2024-06-30');
  expect(repeatEvents[3].date).toBe('2024-07-31');
  expect(repeatEvents[4].date).toBe('2024-08-31');
  expect(repeatEvents[5].date).not.toBe('2024-09-30');
  expect(repeatEvents[5].date).toBe('2024-10-31');
  expect(repeatEvents[6].date).not.toBe('2024-11-30');
  expect(repeatEvents[6].date).toBe('2024-12-31');
  expect(repeatEvents[7].date).toBe('2025-01-31');
});
