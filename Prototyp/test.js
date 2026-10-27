// Wiederholbare Fachlogikprüfungen. Aufruf: node test.js (keine Installation nötig).
const assert = require('node:assert/strict');
const demo = require('./app.js');
const now = new Date('2026-10-26T12:00:00+01:00');
let passed = 0;
function check(name, fn) { fn(); passed++; console.log('OK ' + name); }
check('P01 Suche, Sportart und Niveau', () => {
  const events = demo.seed(now);
  assert.equal(demo.search(events, { query: 'CAMPUS', sport: 'Fußball', level: 'Anfänger' }, '', now).length, 1);
  assert.equal(demo.search(events, { sport: 'Badminton', level: 'Erfahren' }, '', now).length, 1);
  assert.equal(demo.search(events, { query: 'unbekannter Ort' }, '', now).length, 0);
});
check('P02 Gast darf nicht beitreten oder erstellen', () => {
  assert.throws(() => demo.join(demo.seed(now), 'fussball', '', now), /Demo-Identität/);
  assert.throws(() => demo.create(demo.seed(now), {}, '', now), /Demo-Identität/);
});
check('P03 Beitritt, Meine Treffen und Doppelteilnahme', () => {
  const events = demo.seed(now), event = events[0];
  demo.join(events, event.id, 'lea', now); demo.join(events, event.id, 'lea', now);
  assert.equal(event.participants.length, 6);
  assert.equal(demo.status(event, now), 'Findet statt');
  assert.equal(demo.search(events, { mine: true }, 'lea', now).length, 1);
});
check('P04 Ausgebucht und letzter Platz (sequenziell, kein DB-Konkurrenztest)', () => {
  const events = demo.seed(now);
  assert.throws(() => demo.join(events, 'volleyball', 'lea', now), /Ausgebucht/);
  demo.join(events, 'badminton', 'lea', now);
  assert.throws(() => demo.join(events, 'badminton', 'tom', now), /Ausgebucht/);
  assert.equal(events[2].participants.length, 2);
});
check('P05 Abmelden gibt Platz frei, Organisator bleibt', () => {
  const events = demo.seed(now); demo.join(events, 'badminton', 'lea', now);
  demo.leave(events, 'badminton', 'lea', now); demo.join(events, 'badminton', 'tom', now);
  assert.deepEqual(events[2].participants, ['alex', 'tom']);
  assert.throws(() => demo.leave(events, 'badminton', 'alex', now), /Organisator/);
});
const input = { title: 'Basketball', sport: 'Basketball', meeting_point: 'Campus', latitude: 54.774, longitude: 9.452, starts_at: '2026-10-28T16:00:00+01:00', ends_at: '2026-10-28T18:00:00+01:00', capacity: 10, min_participants: 4, level: 'Alle Niveaus', description: '' };
check('P06 Erstellung trägt Organisator automatisch ein', () => {
  const events = demo.seed(now), event = demo.create(events, input, 'lea', now);
  assert.deepEqual(event.participants, ['lea']); assert.equal(event.organizer_id, 'lea');
  assert.equal(demo.status(event, now), 'Sucht Mitspieler'); assert.equal(events.length, 4);
});
check('P07 Erstellung validiert Pflichtfelder, Grenzen und Zeiten', () => {
  for (const bad of [{ title: '  ' }, { capacity: 51 }, { capacity: 1 }, { capacity: 2.5 }, { min_participants: 11 }, { starts_at: '2026-10-25T10:00:00Z' }, { ends_at: '2026-10-28T12:00:00Z' }, { starts_at: 'kaputt' }, { description: 'x'.repeat(301) }, { sport: 'Unbekannt' }, { level: 'Unbekannt' }]) {
    assert.throws(() => demo.create(demo.seed(now), { ...input, ...bad }, 'lea', now));
  }
});
check('P08 Nur Organisator sagt ab; Absage verhindert Teilnahme', () => {
  const events = demo.seed(now);
  assert.throws(() => demo.cancel(events, 'fussball', 'lea', now), /Organisator/);
  demo.cancel(events, 'fussball', 'alex', now);
  assert.equal(demo.status(events[0], now), 'Abgesagt');
  assert.equal(demo.search(events, {}, '', now).length, 2);
  assert.throws(() => demo.join(events, 'fussball', 'lea', now), /abgesagt/);
});
check('P09 Beginn verhindert Teilnahme und blendet aus Suche aus', () => {
  const events = demo.seed(now), later = new Date('2026-10-29T12:00:00Z');
  assert.equal(demo.search(events, {}, '', later).length, 0);
  assert.throws(() => demo.join(events, 'fussball', 'lea', later), /begonnen/);
});
check('P10 Alle Beispieldaten haben gültige, unterscheidbare Kartenpunkte', () => {
  const events = demo.seed(now);
  assert.equal(new Set(events.map(e => e.latitude + ',' + e.longitude)).size, events.length);
  assert.ok(events.every(e => Number.isFinite(e.latitude) && e.latitude > 54.75 && e.latitude < 54.82 && e.longitude > 9.39 && e.longitude < 9.49));
});
check('P11 Erstellung speichert Kartenpunkt und verweigert ungültige Koordinaten', () => {
  const event = demo.create([], input, 'lea', now);
  assert.equal(event.latitude, input.latitude); assert.equal(event.longitude, input.longitude);
  for (const bad of [{ latitude: '' }, { longitude: null }, { latitude: undefined }, { latitude: 91 }, { longitude: -181 }, { latitude: 'kaputt' }]) {
    assert.throws(() => demo.create([], { ...input, ...bad }, 'lea', now), /Karte/);
  }
});
console.log(`${passed} Prüfgruppen bestanden. Keine Aussage über Supabase, RLS oder Parallelität.`);
