import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react';
import type { SportEvent } from '@/features/events/model';
import { eventStatus, formatDate, formatTime } from '@/features/events/service';
import { SportIcon } from './SportIcon';
export function EventCard({
  event,
  user,
  onSelect,
}: {
  event: SportEvent;
  user: string;
  onSelect: () => void;
}) {
  const count = event.status === 'cancelled' ? 0 : event.participants.length;
  const full = count >= event.capacity;
  return (
    <article className="event-card">
      <div className="card-top">
        <span className={`sport-badge sport-${event.sport}`}>
          <SportIcon sport={event.sport} />
        </span>
        <span className="eyebrow">{event.sport}</span>
        <span className={`availability ${full || event.status === 'cancelled' ? 'quiet' : ''}`}>
          {event.status === 'cancelled'
            ? 'Abgesagt'
            : full
              ? 'Ausgebucht'
              : event.capacity - count === 1
                ? '1 Platz frei'
                : `${event.capacity - count} Plätze frei`}
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
        <span>{event.ageGroup || 'Jedes Alter'}</span>
      </div>
      <div className="card-bottom">
        <span>
          <Users size={16} /> {count} von {event.capacity} dabei
        </span>
        <span className="small-status">
          {event.participants.includes(user) ? 'Du bist dabei' : eventStatus(event)}
        </span>
      </div>
    </article>
  );
}
