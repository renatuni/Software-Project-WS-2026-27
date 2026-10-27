import { describe, expect, it } from 'vitest';
import { seedEvents } from '../../src/features/events/demo';
import { orderEventCards } from '../../src/features/events/list-order';
import { emptyFilters } from '../../src/features/events/model';
import { searchEvents } from '../../src/features/events/service';

const now = new Date('2026-10-26T12:00:00+01:00');
describe('Kundenfeedback 1: Kartenreihenfolge nach der Filterung', () => {
  it('verschiebt nur volle Treffen und lässt Quelle und relative Reihenfolge unverändert', () => {
    const list = searchEvents(seedEvents(now), emptyFilters, '', now);
    const before = structuredClone(list);
    expect(orderEventCards(list, 'available-first').map((event) => event.id)).toEqual([
      list[0].id,
      list[2].id,
      list[1].id,
    ]);
    expect(list).toEqual(before);
    expect(orderEventCards(list, 'chronological')).toEqual(list);
  });
  it('erhält Suchtreffer, Sportfilter, leere Listen und vollständig volle Listen', () => {
    const events = seedEvents(now);
    for (const filters of [
      { ...emptyFilters, query: 'Campus' },
      { ...emptyFilters, sports: ['Volleyball'] as typeof emptyFilters.sports },
      { ...emptyFilters, query: 'nichtvorhanden' },
    ]) {
      const filtered = searchEvents(events, filters, '', now);
      expect(orderEventCards(filtered, 'available-first')).toEqual(filtered);
    }
    const full = [events[1], { ...events[1], id: 'zweites-volles-treffen' }];
    expect(orderEventCards(full, 'available-first')).toEqual(full);
  });
});
