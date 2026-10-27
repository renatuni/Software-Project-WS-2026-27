import { describe, expect, it } from 'vitest';
import { seedEvents } from '../../src/features/events/demo';
import { emptyFilters, type EventInput } from '../../src/features/events/model';
import {
  berlinDay,
  changeParticipation,
  createEvent,
  eventStatus,
  searchEvents,
} from '../../src/features/events/service';
const now = new Date('2026-10-26T12:00:00+01:00');
const input: EventInput = {
  title: 'Basketball am Campus',
  sport: 'Basketball',
  meetingPoint: 'Campus Sportplatz',
  latitude: 54.774,
  longitude: 9.452,
  startsAt: '2026-10-28T16:00:00+01:00',
  endsAt: '2026-10-28T18:00:00+01:00',
  capacity: 10,
  minParticipants: 4,
  level: 'Alle Niveaus',
  ageGroup: '',
  description: '',
};
describe('Teilnahme und Erstellung · DR-1.1.4, DR-3.1.*, DR-4.1.*, DR-4.2.1', () => {
  it('verweigert Gastmutationen in der Fachlogik', () => {
    for (const action of ['join', 'leave', 'cancel'] as const)
      expect(() => changeParticipation(seedEvents(now)[0], '', action, now)).toThrow('Demo-Person');
    expect(() => createEvent(input, '', now)).toThrow('Demo-Person');
    for (const user of ['unbekannt', '__proto__', 'constructor']) {
      expect(() => createEvent(input, user, now)).toThrow('Demo-Person');
      expect(() => changeParticipation(seedEvents(now)[0], user, 'join', now)).toThrow(
        'Demo-Person',
      );
    }
  });
  it('zählt die organisierende Person automatisch mit und normalisiert Zeit', () => {
    const event = createEvent(input, 'lea', now);
    expect(event.participants).toEqual(['lea']);
    expect(event.organizerId).toBe('lea');
    expect(event.startsAt).toBe('2026-10-28T15:00:00.000Z');
  });
  it.each([
    { title: ' ' },
    { sport: 'Hockey' },
    { meetingPoint: 'Ort' },
    { latitude: NaN },
    { longitude: 181 },
    { startsAt: 'ungültig' },
    { startsAt: '2026-10-25T10:00:00Z' },
    { endsAt: input.startsAt },
    { capacity: 51 },
    { capacity: 1 },
    { capacity: 2.5 },
    { minParticipants: 11 },
    { minParticipants: 1 },
    { description: 'x'.repeat(301) },
    { level: 'Profi' },
    { ageGroup: 'privat' },
  ])('weist ungültige Daten ab: %j', (bad) =>
    expect(() => createEvent({ ...input, ...bad } as EventInput, 'lea', now)).toThrow(),
  );
  it('verhindert Doppelteilnahme und Überbelegung im sequenziellen Demomodell', () => {
    const original = seedEvents(now)[2];
    const joined = changeParticipation(original, 'lea', 'join', now);
    expect(original.participants).toEqual(['alex']);
    expect(changeParticipation(joined, 'lea', 'join', now).participants).toEqual(['alex', 'lea']);
    expect(eventStatus(joined, now)).toBe('Ausgebucht');
    expect(() => changeParticipation(joined, 'tom', 'join', now)).toThrow('Ausgebucht');
    const left = changeParticipation(joined, 'lea', 'leave', now);
    expect(changeParticipation(left, 'tom', 'join', now).participants).toEqual(['alex', 'tom']);
  });
  it('prüft Organisatorrechte unabhängig von der Oberfläche', () => {
    const event = seedEvents(now)[0];
    expect(() => changeParticipation(event, 'lea', 'cancel', now)).toThrow('Nur');
    expect(() => changeParticipation(event, 'alex', 'leave', now)).toThrow('organisierende');
    const cancelled = changeParticipation(event, 'alex', 'cancel', now);
    expect(eventStatus(cancelled, now)).toBe('Abgesagt');
    expect(() => changeParticipation(cancelled, 'lea', 'join', now)).toThrow('abgesagt');
    expect(searchEvents([cancelled], emptyFilters, '', now)).toEqual([]);
    expect(searchEvents([cancelled], { ...emptyFilters, mine: true }, 'alex', now)).toHaveLength(1);
  });
  it('sperrt Aktionen ab Beginn entsprechend dem erhaltenen P3-Arbeitsstand', () => {
    const event = seedEvents(now)[0];
    expect(() => changeParticipation(event, 'lea', 'join', new Date(event.startsAt))).toThrow(
      'begonnen',
    );
  });
});
describe('Suche · DR-2.2.1–3, DR-2.3.1–2', () => {
  it('verknüpft Sportarten per ODER und Filtergruppen per UND', () => {
    const events = seedEvents(now);
    expect(
      searchEvents(events, { ...emptyFilters, sports: ['Fußball', 'Badminton'] }, '', now),
    ).toHaveLength(2);
    expect(
      searchEvents(
        events,
        {
          ...emptyFilters,
          sports: ['Fußball', 'Badminton'],
          query: 'CAMPUS',
          level: 'Erfahren',
          ageGroup: 'über 40',
        },
        '',
        now,
      ).map((e) => e.id),
    ).toEqual(['badminton']);
  });
  it('filtert heute, morgen, Woche und konkretes Datum', () => {
    const events = seedEvents(now);
    expect(searchEvents(events, { ...emptyFilters, period: 'today' }, '', now)).toHaveLength(0);
    expect(searchEvents(events, { ...emptyFilters, period: 'tomorrow' }, '', now)).toHaveLength(2);
    expect(searchEvents(events, { ...emptyFilters, period: 'week' }, '', now)).toHaveLength(3);
    expect(
      searchEvents(events, { ...emptyFilters, period: 'date', date: '2026-10-28' }, '', now).map(
        (e) => e.id,
      ),
    ).toEqual(['badminton']);
  });
  it('berechnet den Kalendertag in Europe/Berlin auch an UTC-Grenzen', () => {
    expect(berlinDay('2026-10-26T23:30:00Z')).toBe('2026-10-27');
    expect(berlinDay('2026-07-01T22:30:00Z')).toBe('2026-07-02');
  });
  it('gibt keine fremden Zusagen unter Meine Treffen aus', () => {
    expect(searchEvents(seedEvents(now), { ...emptyFilters, mine: true }, 'lea', now)).toHaveLength(
      0,
    );
  });
});
