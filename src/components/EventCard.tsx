import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react';
import type { SportEvent } from '@/features/events/model';
import { eventStatus, formatDate, formatTime } from '@/features/events/service';
import { SportIcon } from './SportIcon';
import { ageLabel, placeSummary } from '@/features/events/presentation';
import { unavailableParticipation } from '@/features/events/participation';
import { ParticipationButton } from './ParticipationButton';
export function EventCard({
  event,
  user,
  onSelect,
}: {
  event: SportEvent;
  user: string;
  onSelect: () => void;
}) {
  const places = placeSummary(event);
  return (
    <article className="event-card">
      <div className="card-top">
        <span className={`sport-badge sport-${event.sport}`}>
          <SportIcon sport={event.sport} />
        </span>
        <span className="eyebrow">{event.sport}</span>
        <span className={`availability ${places.full || places.free === null ? 'quiet' : ''}`}>
          {places.label}
        </span>
      </div>
      <button className="event-title" onClick={onSelect}>
        {event.title}
        <ArrowUpRight size={20} />
      </button>
      <p className="card-line">
        <CalendarDays size={16} />
        {formatDate(event.startsAt)} · {formatTime(event.startsAt)}–{formatTime(event.endsAt)}
      </p>
      <p className="card-line">
        <MapPin size={16} />
        <span>{event.meetingPoint}</span>
      </p>
      <div className="card-tags">
        <span>{event.level}</span>
        <span>{ageLabel(event.ageGroup)}</span>
      </div>
      <div className="card-bottom">
        <span>
          <Users size={16} />
          {event.status === 'cancelled'
            ? 'Abgesagt'
            : places.free === null
              ? 'Teilnehmerzahl nicht verfügbar'
              : `${event.participants.length} ${event.participants.length === 1 ? 'Person' : 'Personen'} dabei`}
        </span>
        <span className="small-status">
          {event.participants?.includes(user)
            ? 'Du bist dabei'
            : places.free !== null
              ? eventStatus(event)
              : ''}
        </span>
      </div>
      <ParticipationButton action={unavailableParticipation(event, user)} />
    </article>
  );
}
