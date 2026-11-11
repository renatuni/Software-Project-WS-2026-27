import { ages } from './model';

// Darstellung vorhandener Daten; keine Buchungsentscheidung oder Datenreparatur.
export function ageLabel(age: unknown): string {
  if (age === '') return 'Altersgruppe: Alle Altersgruppen';
  if (typeof age !== 'string' || !ages.some((value) => value === age))
    return 'Altersgruppe: Nicht angegeben';
  return `Altersgruppe: ${age} Jahre`;
}

export function placeSummary(event: {
  capacity?: unknown;
  participants?: unknown;
  status?: unknown;
}) {
  if (event.status === 'cancelled') return { label: 'Abgesagt', free: null, full: false };
  const { capacity, participants } = event;
  if (
    typeof capacity !== 'number' ||
    !Number.isInteger(capacity) ||
    capacity <= 0 ||
    !Array.isArray(participants) ||
    !participants.every((id) => typeof id === 'string' && id.trim().length > 0) ||
    new Set(participants).size !== participants.length ||
    participants.length > capacity
  )
    return { label: 'Platzangabe nicht verfügbar', free: null, full: false };
  const free = capacity - participants.length;
  return {
    label: free === 0 ? 'Ausgebucht · 0 Plätze frei' : `${free} von ${capacity} Plätzen frei`,
    free,
    full: free === 0,
  };
}
