import type { SportEvent } from './model';
import { placeSummary } from './presentation';

export type ListOrder = 'available-first' | 'chronological';

/** Nur bereits gefilterte Karten umordnen; innerhalb der Gruppen bleibt die Reihenfolge erhalten. */
export function orderEventCards(events: readonly SportEvent[], order: ListOrder): SportEvent[] {
  const result = [...events];
  if (order === 'available-first') {
    result.sort((a, b) => Number(placeSummary(a).full) - Number(placeSummary(b).full));
  }
  return result;
}
