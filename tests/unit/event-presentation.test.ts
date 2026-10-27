import { describe, expect, it } from 'vitest';
import { ageLabel, placeSummary } from '../../src/features/events/presentation';

describe('Kundenfeedback 1: Alters- und Platzangaben', () => {
  it('unterscheidet Altersgruppe, offene Gruppe und fehlende Daten', () => {
    expect(ageLabel('20–25')).toBe('Altersgruppe: 20–25 Jahre');
    expect(ageLabel('unter 20')).toBe('Altersgruppe: unter 20 Jahre');
    expect(ageLabel('über 40')).toBe('Altersgruppe: über 40 Jahre');
    expect(ageLabel('')).toBe('Altersgruppe: Alle Altersgruppen');
    for (const age of [undefined, null, 'unbekannt', 22])
      expect(ageLabel(age)).toBe('Altersgruppe: Nicht angegeben');
  });
  it('berechnet freie Plätze einschließlich leerer und voller Treffen', () => {
    expect(placeSummary({ capacity: 10, participants: ['a', 'b', 'c', 'd', 'e'] }).label).toBe(
      '5 von 10 Plätzen frei',
    );
    expect(placeSummary({ capacity: 2, participants: ['a'] }).free).toBe(1);
    expect(placeSummary({ capacity: 2, participants: [] }).free).toBe(2);
    expect(placeSummary({ capacity: 2, participants: ['a', 'b'] }).full).toBe(true);
    expect(placeSummary({ status: 'cancelled', capacity: 2, participants: [] }).label).toBe(
      'Abgesagt',
    );
  });
  it.each([
    {},
    { capacity: 10 },
    { capacity: null, participants: [] },
    { capacity: -1, participants: [] },
    { capacity: 2.5, participants: [] },
    { capacity: NaN, participants: [] },
    { capacity: 0, participants: [] },
    { capacity: 2, participants: ['a', 'a'] },
    { capacity: 2, participants: [null] },
    { capacity: 2, participants: [''] },
    { capacity: 1, participants: ['a', 'b'] },
  ])('erfindet keine Verfügbarkeit für unvollständige Daten: %j', (event) => {
    expect(placeSummary(event).free).toBeNull();
    expect(placeSummary(event).label).toBe('Platzangabe nicht verfügbar');
  });
});
