'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowUpRight, Compass, MapPin, Plus, Users, Zap } from 'lucide-react';
import {
  emptyFilters,
  type EventInput,
  type Filters as FilterState,
  type SportEvent,
} from '@/features/events/model';
import { seedEvents } from '@/features/events/demo';
import { changeParticipation, createEvent, searchEvents } from '@/features/events/service';
import { EventCard } from './EventCard';
import { EventDetails } from './EventDetails';
import { EventForm } from './EventForm';
import { Filters } from './Filters';
import { Modal } from './Modal';
const MapView = dynamic(() => import('@/features/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="map-loading" role="status">
      Karte wird geladen …
    </div>
  ),
});
export function SportMate({ initialEvents }: { initialEvents: SportEvent[] }) {
  const [events, setEvents] = useState(initialEvents);
  const loaded = true;
  const [user, setUser] = useState('');
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [selectedId, setSelectedId] = useState<string>();
  const [creating, setCreating] = useState(false);
  const [loginIntent, setLoginIntent] = useState<'create' | 'join'>();
  const [feedback, setFeedback] = useState('');
  const [notice, setNotice] = useState('');
  const list = searchEvents(events, filters, user);
  const selected = events.find((event) => event.id === selectedId);
  const select = (id: string) => {
    setSelectedId(id);
    setFeedback('');
  };
  const openCreate = () => {
    if (!user) setLoginIntent('create');
    else setCreating(true);
  };
  function publish(input: EventInput) {
    const event = createEvent(input, user);
    setEvents((previous) => [...previous, event]);
    setCreating(false);
    setFilters({ ...emptyFilters, mine: true });
    select(event.id);
    setNotice('Dein Treffen ist veröffentlicht. Du bist automatisch dabei.');
  }
  function action(operation: 'join' | 'leave' | 'cancel') {
    if (!selected) return;
    try {
      const changed = changeParticipation(selected, user, operation);
      setEvents((previous) => previous.map((event) => (event.id === changed.id ? changed : event)));
      setFeedback(
        operation === 'join'
          ? 'Du bist dabei! Dein Platz ist in dieser Demo vorgemerkt.'
          : operation === 'leave'
            ? 'Du hast abgesagt. Dein Platz ist wieder frei.'
            : 'Das Treffen wurde abgesagt.',
      );
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Die Aktion ist fehlgeschlagen.');
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Zum Inhalt
      </a>
      <div className="demo-banner">
        <span className="demo-dot" />
        Demo entdecken
        <span className="banner-detail">
          {' '}
          · Fiktive Treffen, keine echten Konten. Änderungen gelten bis zum Neuladen.
        </span>
      </div>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="SportMate Startseite">
          <span className="brand-icon">
            <Zap size={24} fill="currentColor" />
          </span>
          sport<span>mate</span>
          <span className="brand-period">.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          <button
            aria-current={!filters.mine ? 'page' : undefined}
            onClick={() => setFilters({ ...emptyFilters })}
          >
            Entdecken
          </button>
          <button
            aria-current={filters.mine ? 'page' : undefined}
            onClick={() => setFilters({ ...emptyFilters, mine: true })}
          >
            Meine Treffen
          </button>
        </nav>
        <label className="identity">
          <span>Demo-Person</span>
          <select
            aria-label="Demo-Person"
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              setFeedback('');
            }}
          >
            <option value="">Gast</option>
            <option value="lea">Lea</option>
            <option value="tom">Tom</option>
            <option value="alex">Alex</option>
          </select>
        </label>
      </header>
      <main id="main" className="app-main">
        <section className="hero">
          <div>
            <p className="eyebrow location">
              <MapPin size={15} /> FLENSBURG & UMGEBUNG
            </p>
            <h1>
              {filters.mine ? (
                <>
                  Dein Sport.
                  <br />
                  <em>Deine Treffen.</em>
                </>
              ) : (
                <>
                  Weniger planen.
                  <br />
                  <em>Mehr zusammen spielen.</em>
                </>
              )}
            </h1>
            <p className="hero-copy">
              {filters.mine
                ? 'Hier findest du deine Zusagen und selbst organisierten Treffen.'
                : 'Finde dein nächstes Sporttreffen. Neue Leute, dein Tempo, direkt um die Ecke.'}
            </p>
          </div>
          <div className="hero-action">
            <p>Du hast schon eine Idee?</p>
            <button className="primary" onClick={openCreate}>
              <Plus size={19} /> Treffen erstellen <ArrowUpRight size={18} />
            </button>
            <span>Zusammen geht mehr.</span>
          </div>
        </section>
        <Filters value={filters} onChange={setFilters} />
        {notice && (
          <div className="notice" role="status">
            {notice}
            <button onClick={() => setNotice('')} aria-label="Hinweis schließen">
              ×
            </button>
          </div>
        )}
        <div className="results-heading">
          <h2>{filters.mine ? 'Meine Treffen' : 'Dein nächstes Match'}</h2>
          <span aria-live="polite">
            {loaded ? `${list.length} Treffen` : 'Treffen werden geladen …'}
          </span>
        </div>
        <div className="explore-grid">
          <section className="event-list" aria-label="Sporttreffen">
            {!loaded ? (
              <div className="empty-state" role="status">
                Deine Sporttreffen werden geladen …
              </div>
            ) : list.length ? (
              list.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  user={user}
                  onSelect={() => select(event.id)}
                />
              ))
            ) : (
              <div className="empty-state">
                <Compass size={36} />
                <h3>
                  {filters.mine && !user ? 'Welche Treffen sind deine?' : 'Keine Treffen gefunden'}
                </h3>
                <p>
                  {filters.mine && !user
                    ? 'Wähle oben eine Demo-Person, um ihre Zusagen zu sehen.'
                    : 'Probier andere Filter aus oder bring selbst ein Treffen ins Rollen.'}
                </p>
                <button
                  className="secondary"
                  onClick={() => setFilters({ ...emptyFilters, mine: filters.mine })}
                >
                  Filter zurücksetzen
                </button>
                <button className="text-button" onClick={openCreate}>
                  Selbst ein Treffen erstellen <ArrowUpRight size={16} />
                </button>
              </div>
            )}
          </section>
          <aside className="map-aside">
            <MapView events={list} selectedId={selectedId} onSelect={select} />
            <div className="map-help">
              <span className="help-mark">
                <Users size={20} />
              </span>
              <div>
                <strong>Ein Ort. Ein Sport. Gute Gesellschaft.</strong>
                <p>
                  Wähle einen Marker oder ein Treffen, um alle Details und freien Plätze zu sehen.
                </p>
              </div>
            </div>
          </aside>
        </div>
        <footer className="site-footer">
          <span>
            sportmate. <span>Gemeinsam in Bewegung.</span>
          </span>
          <button
            className="text-button"
            onClick={() => {
              setEvents(seedEvents());
              setUser('');
              setFilters(emptyFilters);
              setNotice('Demo zurückgesetzt.');
            }}
          >
            Demo zurücksetzen
          </button>
          <p>
            Lokale Demo ohne Supabase-Anbindung. Keine Hallenreservierung. Personen und Treffpunkte
            sind fiktiv.
          </p>
        </footer>
      </main>
      <nav className="mobile-nav" aria-label="Mobile Navigation">
        <button
          aria-current={!filters.mine ? 'page' : undefined}
          onClick={() => setFilters(emptyFilters)}
        >
          <Compass size={21} />
          Entdecken
        </button>
        <button onClick={openCreate}>
          <Plus size={23} />
          Erstellen
        </button>
        <button
          aria-current={filters.mine ? 'page' : undefined}
          onClick={() => setFilters({ ...emptyFilters, mine: true })}
        >
          <Users size={21} />
          Meine Treffen
        </button>
      </nav>
      {selected && !loginIntent && (
        <EventDetails
          event={selected}
          user={user}
          feedback={feedback}
          onClose={() => setSelectedId(undefined)}
          onAction={action}
          onLogin={() => setLoginIntent('join')}
        />
      )}
      {creating && <EventForm onClose={() => setCreating(false)} onCreate={publish} />}
      {loginIntent && (
        <Modal title="Mit wem möchtest du testen?" onClose={() => setLoginIntent(undefined)}>
          <p className="muted">
            Wähle eine fiktive Demo-Person. Es wird kein Konto angelegt und keine echte Anmeldung
            durchgeführt.
          </p>
          <div className="demo-people">
            {[
              ['lea', 'Lea'],
              ['tom', 'Tom'],
              ['alex', 'Alex'],
            ].map(([id, name]) => (
              <button
                className="secondary"
                key={id}
                onClick={() => {
                  setUser(id);
                  if (loginIntent === 'create') setCreating(true);
                  setLoginIntent(undefined);
                }}
              >
                <span className="avatar" aria-hidden="true">
                  {name[0]}
                </span>
                {name}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
