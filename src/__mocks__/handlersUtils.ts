import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard 여기 제공 안함
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  let mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => HttpResponse.json({ events: mockEvents })),

    // 단일 이벤트 저장 핸들러 (반복 이벤트가 아닌 경우)
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1);
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    }),

    // 반복 이벤트 저장 핸들러: 전달받은 이벤트 배열(전체 반복 이벤트)을 모의 저장
    http.post('/api/events-list', async ({ request }) => {
      const { events: eventsToAdd } = (await request.json()) as { events: Event[] };
      const repeatId = `repeat-${mockEvents.length + 1}`;
      const newEvents = eventsToAdd.map((event, index) => ({
        ...event,
        id: String(mockEvents.length + index + 1),
        repeat: {
          ...event.repeat,
          // 반복 이벤트 저장 시 같은 반복 아이디를 부여합니다.
          id: repeatId,
        },
      }));
      // 기존 이벤트는 반복 이벤트로 대체하여 저장 (중복 발생하지 않음)
      mockEvents = [...newEvents];
      return HttpResponse.json(newEvents, { status: 201 });
    })
  );
};

export const setupMockHandlerUpdating = () => {
  let mockEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2024-10-15',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅 2',
      location: '회의실 C',
      category: '업무 회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 5,
    },
    {
      id: '3',
      title: '반복 회의',
      date: '2024-10-16',
      startTime: '13:00',
      endTime: '14:00',
      description: '반복 회의',
      location: '회의실 D',
      category: '업무 회의',
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: '2024-10-20',
        id: 'repeat-1',
      },
      notificationTime: 10,
    },
    {
      id: '4',
      title: '반복 회의',
      date: '2024-10-17',
      startTime: '13:00',
      endTime: '14:00',
      description: '반복 회의',
      location: '회의실 E',
      category: '업무 회의',
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: '2024-10-20',
        id: 'repeat-2',
      },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => HttpResponse.json({ events: mockEvents })),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);
      if (index === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    }),
    http.put('/api/events-list', async ({ request }) => {
      const { events } = (await request.json()) as { events: Event[] };

      const newEvents = [...mockEvents];
      let isUpdated = false;
      events.forEach((event) => {
        const eventIndex = mockEvents.findIndex((e) => e.id === event.id);
        if (eventIndex > -1) {
          isUpdated = true;
          newEvents[eventIndex] = { ...mockEvents[eventIndex], ...event };
        }
      });

      if (!isUpdated) {
        return new HttpResponse('Event not found', { status: 404 });
      }

      mockEvents = [...newEvents];
      return HttpResponse.json(events);
    })
  );
};

export const setupMockHandlerDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 이벤트',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '반복 이벤트',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '반복 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '반복 이벤트',
      date: '2024-10-16',
      startTime: '09:00',
      endTime: '10:00',
      description: '반복 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => HttpResponse.json({ events: mockEvents })),
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    })
  );
};
