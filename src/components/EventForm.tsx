'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, MapPin } from 'lucide-react';
import {
  ages,
  levels,
  sports,
  type Age,
  type EventInput,
  type Level,
  type Point,
  type Sport,
} from '@/features/events/model';
import { EventError } from '@/features/events/service';
import { Modal } from './Modal';
const MapView = dynamic(() => import('@/features/map/MapView'), {
  ssr: false,
  loading: () => <p>Karte wird geladen …</p>,
});
const noEvents: [] = [];
function tomorrow(hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hour, 0, 0, 0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
export function EventForm({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: EventInput) => void;
}) {
  const [point, setPoint] = useState<Point>();
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<EventError>();
  const [start] = useState(() => tomorrow(18));
  const [end] = useState(() => tomorrow(20));
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      onCreate({
        title: String(data.get('title')),
        sport: String(data.get('sport')) as Sport,
        meetingPoint: String(data.get('meetingPoint')),
        latitude: point?.latitude ?? NaN,
        longitude: point?.longitude ?? NaN,
        startsAt: String(data.get('startsAt')),
        endsAt: String(data.get('endsAt')),
        capacity: Number(data.get('capacity')),
        minParticipants: Number(data.get('minParticipants')),
        level: String(data.get('level')) as Level,
        ageGroup: String(data.get('ageGroup')) as Age,
        description: String(data.get('description')),
      });
    } catch (caught) {
      const issue =
        caught instanceof EventError
          ? caught
          : new EventError('Das Treffen konnte nicht erstellt werden.');
      setError(issue);
      if (issue.field === 'latitude') setPicking(true);
      const element = issue.field && form.elements.namedItem(issue.field);
      if (element instanceof HTMLElement) element.focus();
    }
  }
  const invalid = (name: keyof EventInput) => ({
    'aria-invalid': error?.field === name || undefined,
    'aria-describedby': error?.field === name ? 'form-error' : undefined,
  });
  return (
    <Modal title="Bring Leute in Bewegung." onClose={onClose}>
      <p className="muted">Dein Sport, dein Treffpunkt. Du bist automatisch dabei.</p>
      <form onSubmit={submit} className="event-form">
        <fieldset>
          <legend>
            <span>1</span> Was habt ihr vor?
          </legend>
          <div className="form-grid">
            <label>
              Titel
              <input
                name="title"
                required
                minLength={3}
                maxLength={80}
                placeholder="Zum Beispiel: Basketball am Campus"
                {...invalid('title')}
              />
            </label>
            <label>
              Sportart
              <select name="sport" {...invalid('sport')}>
                {sports.map((sport) => (
                  <option key={sport}>{sport}</option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <span>2</span> Wo trefft ihr euch?
          </legend>
          <label>
            Genauer Treffpunkt
            <input
              name="meetingPoint"
              required
              minLength={5}
              maxLength={200}
              placeholder="Sportplatz am Campus, Eingang Ost"
              {...invalid('meetingPoint')}
            />
          </label>
          <button type="button" className="location-button" onClick={() => setPicking(!picking)}>
            {point ? <Check size={18} /> : <MapPin size={18} />}
            {point ? 'Kartenpunkt gewählt · ändern' : 'Treffpunkt auf der Karte wählen'}
          </button>
          {picking && (
            <>
              <p className="hint">
                Karte anklicken oder mit den Pfeiltasten verschieben und die Mitte übernehmen.
              </p>
              <MapView
                events={noEvents}
                point={point}
                onPick={(value) => {
                  setPoint(value);
                  setPicking(false);
                  if (error?.field === 'latitude') setError(undefined);
                }}
              />
            </>
          )}
        </fieldset>
        <fieldset>
          <legend>
            <span>3</span> Wann geht es los?
          </legend>
          <div className="form-grid">
            <label>
              Beginn
              <input
                name="startsAt"
                type="datetime-local"
                required
                defaultValue={start}
                {...invalid('startsAt')}
              />
            </label>
            <label>
              Ende
              <input
                name="endsAt"
                type="datetime-local"
                required
                defaultValue={end}
                {...invalid('endsAt')}
              />
            </label>
          </div>
          <p className="hint">
            Eingabe in deiner Gerätezeitzone ({Intl.DateTimeFormat().resolvedOptions().timeZone}).
          </p>
        </fieldset>
        <fieldset>
          <legend>
            <span>4</span> Wie viele seid ihr?
          </legend>
          <div className="form-grid">
            <label>
              Maximale Teilnehmerzahl
              <input
                name="capacity"
                type="number"
                min={2}
                max={50}
                defaultValue={10}
                required
                {...invalid('capacity')}
              />
            </label>
            <label>
              Mindestteilnehmerzahl
              <input
                name="minParticipants"
                type="number"
                min={2}
                max={50}
                defaultValue={2}
                required
                {...invalid('minParticipants')}
              />
            </label>
          </div>
          <p className="hint">Du zählst mit. Insgesamt sind 2–50 Personen möglich.</p>
        </fieldset>
        <fieldset>
          <legend>
            <span>5</span> Was sollten andere wissen?
          </legend>
          <div className="form-grid">
            <label>
              Niveau
              <select name="level">
                {levels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>
            <label>
              Altersgruppe
              <select name="ageGroup">
                <option value="">Ohne Einschränkung</option>
                {ages.map((age) => (
                  <option key={age}>{age}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Beschreibung · optional
            <textarea
              name="description"
              maxLength={300}
              rows={3}
              placeholder="Ausrüstung, genauer Zugang oder was euch wichtig ist …"
            />
          </label>
          <p className="hint">Höchstens 300 Zeichen.</p>
        </fieldset>
        {error && (
          <p id="form-error" role="alert" className="form-error">
            {error.message}
          </p>
        )}
        <div className="modal-footer">
          <button className="primary" type="submit">
            Treffen veröffentlichen
          </button>
          <small>Nur in dieser Demo gespeichert · nach Neuladen zurückgesetzt</small>
        </div>
      </form>
    </Modal>
  );
}
