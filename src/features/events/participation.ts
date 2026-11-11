import type { SportEvent } from './model';
import { placeSummary } from './presentation';

/** Vertrag für Issue #4; keine Implementierung und kein Demo-Fallback.
 * Der Adapter ermittelt die Identität aus einer serverseitig verifizierten Sitzung.
 * Erfolg erst nach persistierter, atomarer Teilnahme; event ist der neue Serverstand.
 */
export interface ParticipationGateway {
  join(
    eventId: string,
  ): Promise<
    | { status: 'confirmed'; event: SportEvent }
    | { status: 'rejected'; reason: 'unauthenticated' | 'full' | 'inactive' | 'unavailable' }
  >;
}

export type ParticipationAction =
  | { status: 'unavailable'; message: string }
  | { status: 'ready'; onJoin: () => void }
  | { status: 'pending' }
  | { status: 'confirmed' }
  | { status: 'error'; message: string; onRetry: () => void };

export function unavailableParticipation(
  event: SportEvent,
  user: string,
  now = new Date(),
): ParticipationAction {
  let message = 'Echte Anmeldung noch nicht verfügbar. Es wird kein Platz reserviert.';
  if (event.status === 'cancelled') message = 'Dieses Treffen wurde abgesagt.';
  else if (!Number.isFinite(Date.parse(event.startsAt)))
    message = 'Der Termin ist noch nicht bekannt.';
  else if (new Date(event.startsAt) <= now) message = 'Dieses Treffen hat bereits begonnen.';
  else if (event.participants?.includes(user))
    message = 'Du bist in dieser Demo bereits dabei. Keine echte Anmeldung.';
  else if (placeSummary(event).full) message = 'Dieses Treffen ist ausgebucht.';
  else if (placeSummary(event).free === null)
    message = 'Die verfügbaren Plätze sind noch nicht bekannt.';
  return { status: 'unavailable', message };
}
