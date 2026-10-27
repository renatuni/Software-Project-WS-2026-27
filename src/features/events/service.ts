import {
  ages,
  levels,
  people,
  sports,
  type EventInput,
  type Filters,
  type SportEvent,
} from './model';

// Fachregeln der lokalen Demo. Keine Authentifizierung oder Datenbanksperre.
export class EventError extends Error {
  constructor(
    message: string,
    public field?: keyof EventInput,
  ) {
    super(message);
  }
}
function requireUser(user: string) {
  if (!Object.hasOwn(people, user))
    throw new EventError('Bitte zuerst eine Demo-Person auswählen.');
}
export function eventStatus(event: SportEvent, now = new Date()) {
  if (event.status === 'cancelled') return 'Abgesagt';
  if (new Date(event.endsAt) <= now) return 'Beendet';
  if (new Date(event.startsAt) <= now) return 'Läuft bereits';
  if (event.participants.length >= event.capacity) return 'Ausgebucht';
  return event.participants.length >= event.minParticipants ? 'Findet statt' : 'Sucht Mitspieler';
}
export function validateEvent(input: EventInput, now = new Date()) {
  if (input.title.trim().length < 3 || input.title.trim().length > 80)
    throw new EventError('Bitte einen Titel mit 3–80 Zeichen eingeben.', 'title');
  if (!sports.includes(input.sport))
    throw new EventError('Bitte eine gültige Sportart wählen.', 'sport');
  if (input.meetingPoint.trim().length < 5 || input.meetingPoint.trim().length > 200)
    throw new EventError('Bitte den Treffpunkt mit 5–200 Zeichen beschreiben.', 'meetingPoint');
  if (
    !Number.isFinite(input.latitude) ||
    !Number.isFinite(input.longitude) ||
    Math.abs(input.latitude) > 90 ||
    Math.abs(input.longitude) > 180
  )
    throw new EventError('Bitte einen Treffpunkt auf der Karte auswählen.', 'latitude');
  if (!Number.isFinite(Date.parse(input.startsAt)) || new Date(input.startsAt) <= now)
    throw new EventError('Der Termin muss in der Zukunft liegen', 'startsAt');
  if (
    !Number.isFinite(Date.parse(input.endsAt)) ||
    new Date(input.endsAt) <= new Date(input.startsAt)
  )
    throw new EventError('Das Ende muss nach dem Beginn liegen.', 'endsAt');
  if (!Number.isInteger(input.capacity) || input.capacity < 2 || input.capacity > 50)
    throw new EventError('Die maximale Teilnehmerzahl muss zwischen 2 und 50 liegen.', 'capacity');
  if (
    !Number.isInteger(input.minParticipants) ||
    input.minParticipants < 2 ||
    input.minParticipants > input.capacity
  )
    throw new EventError(
      'Die Mindestzahl muss zwischen 2 und der maximalen Teilnehmerzahl liegen.',
      'minParticipants',
    );
  if (!levels.includes(input.level))
    throw new EventError('Bitte ein gültiges Niveau wählen.', 'level');
  if (input.ageGroup && !ages.includes(input.ageGroup))
    throw new EventError('Bitte eine gültige Altersgruppe wählen.', 'ageGroup');
  if (input.description.length > 300)
    throw new EventError('Die Beschreibung darf höchstens 300 Zeichen enthalten.', 'description');
}
export function createEvent(input: EventInput, user: string, now = new Date()): SportEvent {
  requireUser(user);
  validateEvent(input, now);
  return {
    ...input,
    title: input.title.trim(),
    meetingPoint: input.meetingPoint.trim(),
    startsAt: new Date(input.startsAt).toISOString(),
    endsAt: new Date(input.endsAt).toISOString(),
    id: crypto.randomUUID(),
    organizerId: user,
    participants: [user],
    status: 'published',
  };
}
export function changeParticipation(
  event: SportEvent,
  user: string,
  action: 'join' | 'leave' | 'cancel',
  now = new Date(),
): SportEvent {
  requireUser(user);
  if (action === 'cancel' && event.organizerId !== user)
    throw new EventError('Nur die organisierende Person darf das Treffen absagen.');
  if (action === 'cancel' && event.status === 'cancelled') return event;
  if (event.status === 'cancelled') throw new EventError('Das Treffen ist abgesagt.');
  if (new Date(event.startsAt) <= now) throw new EventError('Das Treffen hat bereits begonnen.');
  if (action === 'cancel') return { ...event, status: 'cancelled' };
  if (action === 'leave') {
    if (event.organizerId === user)
      throw new EventError('Als organisierende Person kannst du das gesamte Treffen absagen.');
    return { ...event, participants: event.participants.filter((id) => id !== user) };
  }
  if (event.participants.includes(user)) return event;
  if (event.participants.length >= event.capacity) throw new EventError('Ausgebucht');
  return { ...event, participants: [...event.participants, user] };
}
export function berlinDay(iso: string | Date) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));
}
export function searchEvents(
  events: SportEvent[],
  filter: Filters,
  user: string,
  now = new Date(),
) {
  const today = berlinDay(now);
  const day = new Date(today + 'T12:00:00Z');
  const tomorrow = new Date(day);
  tomorrow.setUTCDate(day.getUTCDate() + 1);
  const weekEnd = new Date(day);
  weekEnd.setUTCDate(day.getUTCDate() + (7 - (day.getUTCDay() || 7)));
  const query = filter.query.trim().toLocaleLowerCase('de');
  return events
    .filter((event) => {
      const date = berlinDay(event.startsAt);
      return (
        (filter.mine
          ? event.participants.includes(user)
          : event.status === 'published' && new Date(event.startsAt) > now) &&
        (!filter.sports.length || filter.sports.includes(event.sport)) &&
        (!filter.level || event.level === filter.level || event.level === 'Alle Niveaus') &&
        (!filter.ageGroup || !event.ageGroup || event.ageGroup === filter.ageGroup) &&
        (!query ||
          `${event.title} ${event.meetingPoint} ${event.sport}`
            .toLocaleLowerCase('de')
            .includes(query)) &&
        (!filter.period ||
          (filter.period === 'today' && date === today) ||
          (filter.period === 'tomorrow' && date === berlinDay(tomorrow)) ||
          (filter.period === 'week' && date >= today && date <= berlinDay(weekEnd)) ||
          (filter.period === 'date' && date === filter.date))
      );
    })
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso));
export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
