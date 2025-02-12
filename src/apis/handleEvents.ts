import { Event, EventForm } from '../types';
import { createRepeatEvents } from '../utils/createRepeatEvents';
import { isRepeating, type SaveEventData } from '../utils/eventValidation';

export const createEvent = async (eventData: Event | EventForm) => {
  if (isRepeating(eventData)) {
    const repeatEvents = createRepeatEvents(eventData as Event);
    await fetch('/api/events-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: repeatEvents }),
    });
    return;
  }

  await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
};

export const updateEvent = async (eventData: SaveEventData) => {
  const response = await (Array.isArray(eventData)
    ? fetch('/api/events-list', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: eventData.map((event) => ({
            ...event,
            repeat: { type: 'none', interval: 0 },
          })),
        }),
      })
    : fetch(`/api/events/${(eventData as Event).id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      }));
  if (!response.ok) {
    throw new Error('Failed to update event');
  }
};
