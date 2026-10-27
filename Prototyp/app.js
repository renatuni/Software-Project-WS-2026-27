/* Lokaler UI-/Fachablauf-Prototyp. Keine Authentifizierung oder Server-Sicherheitsgrenze. */
(function () {
  'use strict';
  const people = { lea: 'Lea', tom: 'Tom', alex: 'Alex', kim: 'Kim', sam: 'Sam', nora: 'Nora', emi: 'Emi' };
  const sports = ['Fußball', 'Volleyball', 'Badminton', 'Basketball'];
  const levels = ['Alle Niveaus', 'Anfänger', 'Fortgeschritten', 'Erfahren'];
  function seed(now = new Date()) {
    const date = (days, hour) => { const d = new Date(now); d.setDate(d.getDate() + days); d.setHours(hour, 0, 0, 0); return d.toISOString(); };
    return [
      { id: 'fussball', title: 'Fußball am Campus', sport: 'Fußball', meeting_point: 'Campus Flensburg, Sportplatz (Beispiel)', latitude: 54.7753, longitude: 9.4479, starts_at: date(1, 17), ends_at: date(1, 19), capacity: 10, min_participants: 6, level: 'Anfänger', age_group: '20–25', description: 'Entspannt zusammen kicken. Bitte eigene Sportschuhe mitbringen.', organizer_id: 'alex', status: 'published', participants: ['alex', 'kim', 'sam', 'nora', 'emi'] },
      { id: 'volleyball', title: 'Volleyball am Hafen', sport: 'Volleyball', meeting_point: 'Flensburg, Hafenspitze (Beispiel)', latitude: 54.7923, longitude: 9.4347, starts_at: date(1, 18), ends_at: date(1, 20), capacity: 4, min_participants: 4, level: 'Fortgeschritten', age_group: '', description: 'Fiktives Treffen für den Testfall Ausgebucht.', organizer_id: 'alex', status: 'published', participants: ['alex', 'kim', 'sam', 'nora'] },
      { id: 'badminton', title: 'Badminton zu zweit', sport: 'Badminton', meeting_point: 'Campus Flensburg, Sporthalle (Beispiel)', latitude: 54.7707, longitude: 9.4559, starts_at: date(2, 16), ends_at: date(2, 17), capacity: 2, min_participants: 2, level: 'Alle Niveaus', age_group: '', description: 'Fiktive Beispieldaten. Die Halle ist nicht reserviert. Genau ein Platz ist frei.', organizer_id: 'alex', status: 'published', participants: ['alex'] }
    ];
  }
  function fail(message) { throw new Error(message); }
  function requireUser(user) { if (!user || !people[user]) fail('Bitte zuerst eine Demo-Identität wählen.'); }
  function getEvent(events, id) { return events.find(event => event.id === id) || fail('Treffen nicht gefunden.'); }
  function status(event, now = new Date()) {
    if (event.status === 'cancelled') return 'Abgesagt';
    if (new Date(event.ends_at) <= now) return 'Beendet';
    if (new Date(event.starts_at) <= now) return 'Läuft bereits';
    if (event.participants.length >= event.capacity) return 'Ausgebucht';
    return event.participants.length >= event.min_participants ? 'Findet statt' : 'Sucht Mitspieler';
  }
  function join(events, id, user, now = new Date()) {
    requireUser(user); const event = getEvent(events, id);
    if (event.status !== 'published') fail('Das Treffen ist abgesagt.');
    if (new Date(event.starts_at) <= now) fail('Das Treffen hat bereits begonnen.');
    if (event.participants.includes(user)) return 'Du bist bereits dabei.';
    if (event.participants.length >= event.capacity) fail('Ausgebucht');
    event.participants.push(user); return 'Du bist dabei!';
  }
  function leave(events, id, user, now = new Date()) {
    requireUser(user); const event = getEvent(events, id);
    if (event.organizer_id === user) fail('Als Organisator kannst du das Treffen absagen.');
    if (event.status !== 'published') fail('Das Treffen ist abgesagt.');
    if (new Date(event.starts_at) <= now) fail('Das Treffen hat bereits begonnen.');
    event.participants = event.participants.filter(id => id !== user);
    return 'Du hast abgesagt. Dein Platz ist wieder frei.';
  }
  function cancel(events, id, user, now = new Date()) {
    requireUser(user); const event = getEvent(events, id);
    if (event.organizer_id !== user) fail('Nur der Organisator darf das Treffen absagen.');
    if (new Date(event.starts_at) <= now) fail('Das Treffen hat bereits begonnen.');
    event.status = 'cancelled'; return 'Das Treffen wurde abgesagt.';
  }
  function create(events, input, user, now = new Date()) {
    requireUser(user);
    const capacity = Number(input.capacity), min = Number(input.min_participants);
    const start = new Date(input.starts_at), end = new Date(input.ends_at);
    const latitude = Number(input.latitude), longitude = Number(input.longitude);
    if (input.latitude == null || input.longitude == null || String(input.latitude).trim() === '' || String(input.longitude).trim() === '' || !Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) fail('Bitte einen gültigen Treffpunkt auf der Karte auswählen.');
    const title = String(input.title || '').trim(), point = String(input.meeting_point || '').trim();
    if (!title || !point || !sports.includes(input.sport)) fail('Bitte alle Pflichtfelder ausfüllen.');
    if (title.length < 3 || title.length > 80 || point.length < 5 || point.length > 200 || String(input.description || '').length > 300) fail('Titel: 3–80 Zeichen, Treffpunkt: 5–200 Zeichen, Beschreibung: höchstens 300 Zeichen.');
    if (!levels.includes(input.level)) fail('Bitte ein gültiges Niveau wählen.');
    if (!Number.isFinite(start.getTime()) || start <= now) fail('Der Termin muss in der Zukunft liegen');
    if (!Number.isFinite(end.getTime()) || end <= start) fail('Das Ende muss nach dem Beginn liegen.');
    if (!Number.isInteger(capacity) || capacity < 2 || capacity > 50) fail('Die maximale Teilnehmerzahl muss zwischen 2 und 50 liegen.');
    if (!Number.isInteger(min) || min < 2 || min > capacity) fail('Die Mindestteilnehmerzahl muss zwischen 2 und der maximalen Teilnehmerzahl liegen.');
    const event = { id: 'event-' + (events.length + 1), title, meeting_point: point, latitude, longitude, sport: input.sport, starts_at: start.toISOString(), ends_at: end.toISOString(), capacity, min_participants: min, level: input.level, age_group: input.age_group || '', description: String(input.description || ''), organizer_id: user, status: 'published', participants: [user] };
    events.push(event); return event;
  }
  function search(events, filter = {}, user, now = new Date()) {
    const query = String(filter.query || '').trim().toLocaleLowerCase('de');
    return events.filter(event => (filter.mine ? event.participants.includes(user) : event.status === 'published' && new Date(event.starts_at) > now)
      && (!filter.sport || event.sport === filter.sport)
      && (!filter.level || event.level === filter.level || event.level === 'Alle Niveaus')
      && (!query || (event.title + ' ' + event.meeting_point).toLocaleLowerCase('de').includes(query)))
      .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
  }
  const api = { seed, status, join, leave, cancel, create, search };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof document === 'undefined') return;

  let events = seed(), user = '', selectedId = null, timer;
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const date = iso => new Date(iso).toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  function toast(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(timer); timer = setTimeout(() => $('toast').hidden = true, 5000); }
  function login() { user = 'lea'; $('identity').value = user; toast('Demo-Anmeldung als Lea. Es wurde kein echtes Konto angelegt.'); render(); }
  function highlightEvent(id) {
    document.querySelectorAll('.event').forEach(element => element.classList.toggle('selected', element.dataset.event === id));
  }
  function render() {
    const list = search(events, { query: $('search').value, sport: $('sport').value, level: $('level').value, mine: $('view').value === 'mine' }, user);
    $('result-count').textContent = list.length + (list.length === 1 ? ' Treffen gefunden' : ' Treffen gefunden');
    $('events').innerHTML = list.length ? list.map(event => `<article class="event" data-event="${event.id}"><div><div class="event-meta">${escape(event.sport)} · ${escape(event.level)}</div><h3>${escape(event.title)}</h3><p>${date(event.starts_at)} · ${escape(event.meeting_point)}</p><p><strong>${event.status === 'cancelled' ? 0 : event.participants.length} von ${event.capacity}</strong> dabei · <span class="${event.status === 'cancelled' ? 'cancelled' : 'status'}">${status(event)}</span></p></div><div class="actions"><button class="secondary" data-map="${event.id}" ${event.status === 'cancelled' ? 'disabled' : ''}>Auf Karte</button><button class="secondary" data-detail="${event.id}">Details</button></div></article>`).join('') : '<div class="empty"><h2>Keine Treffen gefunden</h2><p class="muted">Ändere deine Filter oder erstelle ein eigenes Treffen.</p><button data-create>Selbst ein Treffen erstellen</button></div>';
    if (window.SportMateMap) window.SportMateMap.render(list, user, details, highlightEvent);
  }
  function details(id) {
    selectedId = id; const event = getEvent(events, id), joined = event.participants.includes(user), organizer = user === event.organizer_id;
    const active = event.status === 'published' && new Date(event.starts_at) > new Date();
    $('detail-content').innerHTML = `<div class="dialog-header"><h2 id="detail-title">${escape(event.title)}</h2><button class="close" data-close="details" aria-label="Details schließen">×</button></div><p class="status">${status(event)}</p><dl><dt>Sportart / Niveau</dt><dd>${escape(event.sport)} / ${escape(event.level)}</dd><dt>Treffpunkt</dt><dd>${escape(event.meeting_point)}</dd><dt>Beginn</dt><dd>${date(event.starts_at)}</dd><dt>Ende</dt><dd>${date(event.ends_at)}</dd><dt>Teilnehmer</dt><dd>${event.status === 'cancelled' ? 0 : event.participants.length} von ${event.capacity} (mindestens ${event.min_participants})</dd><dt>Altersgruppe</dt><dd>${escape(event.age_group || 'Ohne Einschränkung')}</dd><dt>Organisation</dt><dd>${escape(people[event.organizer_id])}</dd><dt>Dabei</dt><dd>${joined || organizer ? event.participants.map(id => escape(people[id] || id)).join(', ') : 'Namen sehen nur Teilnehmende und Organisator.'}</dd></dl><p>${escape(event.description)}</p><p id="detail-feedback" class="feedback" role="status"></p><div class="actions">${!user ? '<button data-login>Demo-Anmeldung als Lea</button>' : organizer ? '<span class="muted">Du organisierst dieses Treffen.</span>' + (active ? '<button class="danger" data-cancel>Treffen absagen</button>' : '') : joined ? `<button data-leave ${active ? '' : 'disabled'}>Teilnahme absagen</button>` : `<button data-join ${active && event.participants.length < event.capacity ? '' : 'disabled'}>${event.participants.length >= event.capacity ? 'Ausgebucht' : 'Bin dabei'}</button>`}</div>`;
    if (!$('details').open) $('details').showModal();
  }
  function openCreate() {
    if (!user) login();
    $('form-error').textContent = '';
    $('create-form').elements.latitude.value = ''; $('create-form').elements.longitude.value = '';
    $('picked-location').textContent = 'Bitte einen Treffpunkt auf der Karte auswählen.';
    const next = new Date(); next.setDate(next.getDate() + 1); next.setHours(18, 0, 0, 0);
    const localInput = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    $('create-form').elements.starts_at.value = localInput(next);
    next.setHours(20); $('create-form').elements.ends_at.value = localInput(next);
    $('create').showModal();
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.dataset.close) { $(button.dataset.close).close(); if (button.dataset.close === 'create' && window.SportMateMap) window.SportMateMap.clearLocation(); }
    if (button.dataset.detail) details(button.dataset.detail);
    if (button.dataset.map && window.SportMateMap) { window.SportMateMap.selectEvent(button.dataset.map); $('map').scrollIntoView({ block: 'center' }); }
    if (button.hasAttribute('data-create')) openCreate();
    if (button.hasAttribute('data-login')) { login(); details(selectedId); }
    for (const [attribute, operation] of [['data-join', join], ['data-leave', leave], ['data-cancel', cancel]]) {
      if (button.hasAttribute(attribute)) {
        try { const message = operation(events, selectedId, user); render(); details(selectedId); $('detail-feedback').textContent = message; }
        catch (error) { $('detail-feedback').textContent = error.message; }
      }
    }
  });
  $('identity').addEventListener('change', () => { user = $('identity').value; render(); if ($('details').open) details(selectedId); });
  for (const id of ['search', 'sport', 'level', 'view']) $(id).addEventListener('input', render);
  $('open-create').addEventListener('click', openCreate);
  $('pick-location').addEventListener('click', () => {
    if (!window.SportMateMap) { $('form-error').textContent = 'Die Kartenbibliothek fehlt. Bitte den vollständigen Prototypordner verwenden.'; return; }
    $('create').close();
    window.SportMateMap.chooseLocation(point => {
      if (point) {
        $('create-form').elements.latitude.value = String(point.latitude);
        $('create-form').elements.longitude.value = String(point.longitude);
        $('picked-location').textContent = 'Treffpunkt auf der Karte ausgewählt. Bitte den Ort oben beschreiben.';
      }
      $('create').showModal();
    });
  });
  $('reset').addEventListener('click', () => { events = seed(); user = ''; if (window.SportMateMap) window.SportMateMap.clearLocation(); $('identity').value = ''; $('search').value = ''; $('sport').value = ''; $('level').value = ''; $('view').value = 'all'; render(); toast('Die Demo ist zurückgesetzt.'); });
  $('create-form').addEventListener('submit', event => {
    event.preventDefault();
    try { const created = create(events, Object.fromEntries(new FormData(event.target)), user); $('create').close(); event.target.reset(); $('search').value = ''; $('sport').value = ''; $('level').value = ''; $('view').value = 'mine'; render(); if (window.SportMateMap) { window.SportMateMap.clearLocation(); window.SportMateMap.fitEvents(); } details(created.id); toast('Treffen veröffentlicht. Du bist als erste Person dabei.'); }
    catch (error) { $('form-error').textContent = error.message; }
  });
  render();
})();
