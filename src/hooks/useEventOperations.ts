import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Event, EventForm } from '../types';
import { formatDate } from '../utils/dateUtils';

export const useEventOperations = (editing: boolean, onSave?: () => void) => {
  const [events, setEvents] = useState<Event[]>([]);
  const toast = useToast();

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const { events } = await response.json();
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: '이벤트 로딩 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const saveEvent = async (eventData: Event | EventForm) => {
    try {
      // 새 이벤트 저장 시
      if (!editing) {
        if (eventData.repeat && eventData.repeat.type !== 'none') {
          // 반복 이벤트인 경우 단일 이벤트 저장을 건너뛰고,
          // 반복 이벤트 저장 엔드포인트에 바로 저장한다.
          const { type, interval } = eventData.repeat;
          const baseDate = new Date(eventData.date);

          const repeatEvents: Omit<Event, 'id'>[] = [];
          // 원래 일정 포함 + 추가 반복: 예를 들어 interval이 1이면 두 개의 이벤트(원래 일정 + 1회 반복)를 생성
          for (let i = 0; i <= interval; i++) {
            const nextDate = new Date(baseDate);

            if (type === 'daily') {
              nextDate.setDate(nextDate.getDate() + i);
            } else if (type === 'weekly') {
              nextDate.setDate(nextDate.getDate() + i * 7);
            } else if (type === 'monthly') {
              nextDate.setMonth(nextDate.getMonth() + i);
            } else if (type === 'yearly') {
              nextDate.setFullYear(nextDate.getFullYear() + i);
            }

            repeatEvents.push({
              ...eventData,
              date: formatDate(nextDate),
            });
          }

          await fetch('/api/events-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: repeatEvents }),
          });
        } else {
          await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
          });
        }
      } else {
        // 편집 모드인 경우 PUT 방식으로 업데이트
        await fetch(`/api/events/${(eventData as Event).id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
      }

      await fetchEvents();

      onSave?.();
      toast({
        title: editing ? '일정이 수정되었습니다.' : '일정이 추가되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: '일정 저장 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await fetchEvents();
      toast({
        title: '일정이 삭제되었습니다.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: '일정 삭제 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  async function init() {
    await fetchEvents();
    toast({
      title: '일정 로딩 완료!',
      status: 'info',
      duration: 1000,
    });
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { events, fetchEvents, saveEvent, deleteEvent };
};
