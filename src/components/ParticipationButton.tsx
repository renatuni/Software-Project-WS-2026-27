import { useId } from 'react';
import type { ParticipationAction } from '@/features/events/participation';
import styles from './ParticipationButton.module.css';

/** Präsentationskomponente: Eine Bestätigung darf nur aus einer echten Serverantwort entstehen. */
export function ParticipationButton({ action }: { action: ParticipationAction }) {
  const descriptionId = useId();
  const message =
    action.status === 'unavailable' || action.status === 'error'
      ? action.message
      : action.status === 'pending'
        ? 'Deine Anmeldung wird geprüft.'
        : action.status === 'confirmed'
          ? 'Deine Teilnahme wurde bestätigt.'
          : '';
  return (
    <div className={styles.action}>
      <button
        type="button"
        className={`primary ${styles.button}`}
        disabled={action.status !== 'ready' && action.status !== 'error'}
        aria-describedby={message ? descriptionId : undefined}
        aria-busy={action.status === 'pending'}
        onClick={
          action.status === 'ready'
            ? action.onJoin
            : action.status === 'error'
              ? action.onRetry
              : undefined
        }
      >
        {action.status === 'pending'
          ? 'Anmeldung wird geprüft …'
          : action.status === 'confirmed'
            ? 'Teilnahme bestätigt'
            : action.status === 'error'
              ? 'Erneut versuchen'
              : 'Jetzt teilnehmen'}
      </button>
      <p
        id={descriptionId}
        className={styles.hint}
        role={action.status === 'error' ? 'alert' : 'status'}
      >
        {message}
      </p>
    </div>
  );
}
