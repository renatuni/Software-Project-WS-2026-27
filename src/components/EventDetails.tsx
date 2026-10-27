import { CalendarDays, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { people, type SportEvent } from '@/features/events/model';
import { eventStatus, formatDate, formatTime } from '@/features/events/service';
import { Modal } from './Modal';
import { SportIcon } from './SportIcon';
export function EventDetails({
  event,
  user,
  feedback,
  onClose,
  onAction,
  onLogin,
}: {
  event: SportEvent;
  user: string;
  feedback: string;
  onClose: () => void;
  onAction: (action: 'join' | 'leave' | 'cancel') => void;
  onLogin: () => void;
}) {
  const active = event.status === 'published' && new Date(event.startsAt) > new Date();
  const joined = event.participants.includes(user),
    organizer = event.organizerId === user;
  return (
    <Modal title={event.title} onClose={onClose}>
      <div className="detail-sport">
        <SportIcon sport={event.sport} />
        <span>
          {event.sport} · {event.level}
        </span>
        <span className="tag">{eventStatus(event)}</span>
      </div>
      <div className="detail-block">
        <CalendarDays />
        <div>
          <strong>{formatDate(event.startsAt)}</strong>
          <p>
            {formatTime(event.startsAt)}–{formatTime(event.endsAt)} Uhr · Europe/Berlin
          </p>
        </div>
      </div>
      <div className="detail-block">
        <MapPin />
        <div>
          <strong>{event.meetingPoint}</strong>
          <a
            className="external-link"
            href={`https://www.openstreetmap.org/directions?to=${event.latitude}%2C${event.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Route in OpenStreetMap öffnen <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="detail-block">
        <Users />
        <div>
          <strong>
            {event.status === 'cancelled' ? 0 : event.participants.length} von {event.capacity}{' '}
            dabei
          </strong>
          <p>
            Mindestens {event.minParticipants} · {event.ageGroup || 'Ohne Altersbeschränkung'}
          </p>
        </div>
      </div>
      <p className="description">{event.description || 'Keine zusätzliche Beschreibung.'}</p>
      <div className="host">
        <span className="avatar">{people[event.organizerId]?.[0]}</span>
        <div>
          <strong>{people[event.organizerId]}</strong>
          <p>Organisiert dieses Treffen · fiktive Person</p>
        </div>
      </div>
      <p className="muted">
        {joined || organizer
          ? `Dabei: ${event.participants.map((id) => people[id] || id).join(', ')}`
          : 'Teilnehmernamen sehen nur Teilnehmende und die organisierende Person.'}
      </p>
      {feedback && (
        <p role="status" className="feedback">
          {feedback}
        </p>
      )}
      <div className="modal-footer">
        {!user ? (
          <button className="primary" onClick={onLogin}>
            Demo-Person wählen und mitmachen
          </button>
        ) : organizer ? (
          <button className="danger" disabled={!active} onClick={() => onAction('cancel')}>
            Treffen absagen
          </button>
        ) : joined ? (
          <button className="secondary" disabled={!active} onClick={() => onAction('leave')}>
            Teilnahme absagen
          </button>
        ) : (
          <button
            className="primary"
            disabled={!active || event.participants.length >= event.capacity}
            onClick={() => onAction('join')}
          >
            {event.participants.length >= event.capacity ? 'Ausgebucht' : 'Bin dabei'}
          </button>
        )}
        <small>Lokale Demo · keine echte Anmeldung oder Reservierung</small>
      </div>
    </Modal>
  );
}
