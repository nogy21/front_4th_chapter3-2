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
