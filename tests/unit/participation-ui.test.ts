import { describe, expect, it } from 'vitest';
import { seedEvents } from '../../src/features/events/demo';
import { unavailableParticipation } from '../../src/features/events/participation';

const now = new Date('2026-10-26T12:00:00+01:00');
describe('Kundenfeedback 1: keine vorgetäuschte Teilnahme', () => {
  it('lässt Gast und Demo-Person ohne Backend nicht teilnehmen und verändert keine Daten', () => {
    const event = seedEvents(now)[2];
    const before = structuredClone(event);
    for (const user of ['', 'lea']) {
      expect(unavailableParticipation(event, user, now)).toEqual({
        status: 'unavailable',
        message: 'Echte Anmeldung noch nicht verfügbar. Es wird kein Platz reserviert.',
      });
    }
    expect(event).toEqual(before);
  });
  it('erklärt volle, abgesagte, vergangene und bereits in der Demo gewählte Treffen', () => {
    const [event, full] = seedEvents(now);
    expect(unavailableParticipation(full, '', now)).toHaveProperty(
      'message',
      'Dieses Treffen ist ausgebucht.',
    );
    expect(unavailableParticipation({ ...event, status: 'cancelled' }, '', now)).toHaveProperty(
      'message',
      'Dieses Treffen wurde abgesagt.',
    );
    expect(
      unavailableParticipation({ ...event, startsAt: now.toISOString() }, '', now),
    ).toHaveProperty('message', 'Dieses Treffen hat bereits begonnen.');
    expect(unavailableParticipation(event, event.participants[0], now)).toHaveProperty(
      'message',
      'Du bist in dieser Demo bereits dabei. Keine echte Anmeldung.',
    );
    expect(unavailableParticipation({ ...event, startsAt: '' }, '', now)).toHaveProperty(
      'message',
      'Der Termin ist noch nicht bekannt.',
    );
    expect(unavailableParticipation({ ...event, capacity: NaN }, '', now)).toHaveProperty(
      'message',
      'Die verfügbaren Plätze sind noch nicht bekannt.',
    );
  });
});
