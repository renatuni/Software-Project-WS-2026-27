/* Kleine Leaflet-Anbindung: dieselben Suchergebnisse für Karte und Liste. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const icons = { Fußball: '⚽', Volleyball: '🏐', Badminton: '🏸', Basketball: '🏀' };
  if (typeof L === 'undefined') {
    $('map-status').textContent = 'Die lokale Kartenbibliothek fehlt. Treffen bleiben in der Liste erreichbar.';
    return;
  }
  const map = L.map('map', { zoomControl: true, scrollWheelZoom: false, minZoom: 11, maxZoom: 18 }).setView([54.783, 9.445], 13);
  const sketch = L.imageOverlay('flensburg-offline.svg', [[54.755, 9.395], [54.82, 9.49]], { interactive: false }).addTo(map);
  const markers = L.layerGroup().addTo(map);
  L.control.scale({ imperial: false }).addTo(map);
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    // Nur sichtbare Kacheln, kein Prefetch/Offline-Download.
    keepBuffer: 0
  });
  let current = [], onDetails, onSelect, selectedMarker, pointPicker, pickMarker, online = false;
  function mode(useOnline) {
    if (useOnline && !/^https?:$/.test(location.protocol)) {
      $('map-status').textContent = 'Straßenkarte: bitte über start.py öffnen. Offlinekarte bleibt nutzbar.';
      return;
    }
    online = useOnline;
    if (useOnline) {
      $('map-status').textContent = 'OpenStreetMap-Straßenkarte lädt …';
      tiles.addTo(map);
    } else {
      map.removeLayer(tiles);
      sketch.setOpacity(1);
      $('map-status').textContent = 'Schematische Offlinekarte · keine Navigationskarte';
    }
    $('map-online').setAttribute('aria-pressed', String(useOnline));
    $('map-offline').setAttribute('aria-pressed', String(!useOnline));
    $('map-online').classList.toggle('active-mode', useOnline);
    $('map-offline').classList.toggle('active-mode', !useOnline);
  }
  tiles.on('tileload', () => { if (online) { sketch.setOpacity(0); $('map-status').textContent = 'OpenStreetMap · Marker wählen, Karte verschieben und zoomen'; } });
  tiles.on('tileerror', () => { if (online) { mode(false); $('map-status').textContent = 'Straßenkarte nicht erreichbar · schematische Offlinekarte aktiv'; } });
  function popup(event) {
    const element = document.createElement('div');
    const title = document.createElement('h3'); title.textContent = event.title;
    const sport = document.createElement('p'); sport.textContent = `${event.sport} · ${event.level}`;
    const count = document.createElement('p'); count.textContent = `${event.participants.length} von ${event.capacity} dabei`;
    const place = document.createElement('p'); place.textContent = event.meeting_point;
    const button = document.createElement('button'); button.textContent = 'Details ansehen'; button.addEventListener('click', () => onDetails(event.id));
    element.append(title, sport, count, place, button); return element;
  }
  function fitEvents() {
    const points = current.filter(event => event.status === 'published' && Number.isFinite(event.latitude) && Number.isFinite(event.longitude)).map(event => [event.latitude, event.longitude]);
    if (points.length) map.fitBounds(L.latLngBounds(points).pad(0.3), { maxZoom: 15, padding: [42, 42] });
    else map.setView([54.783, 9.445], 13);
  }
  function selectEvent(id) {
    const event = current.find(item => item.id === id);
    if (!event || !event.marker) return;
    if (selectedMarker) selectedMarker.setZIndexOffset(0);
    selectedMarker = event.marker; selectedMarker.setZIndexOffset(1000);
    map.panTo([event.latitude, event.longitude], { animate: false });
    selectedMarker.openPopup();
    if (onSelect) onSelect(id);
  }
  function render(events, user, details, select) {
    const oldIds = current.map(event => event.id).join(',');
    markers.clearLayers(); current = events.map(event => ({ ...event })); onDetails = details; onSelect = select;
    for (const event of current) {
      if (!Number.isFinite(event.latitude) || !Number.isFinite(event.longitude)) continue;
      // Abgesagte eigene Events bleiben in der Liste, nicht als aktive Marker.
      if (event.status !== 'published') continue;
      const free = Math.max(0, event.capacity - event.participants.length);
      const label = `${event.sport}: ${event.title}, ${free} freie Plätze`;
      const icon = L.divIcon({ className: 'sport-pin', html: `<span class="sport-pin-inner${free ? '' : ' full'}${event.participants.includes(user) ? ' mine' : ''}"><span class="sport-icon">${icons[event.sport] || '●'}</span><span class="pin-count">${free}</span></span>`, iconSize: [48, 56], iconAnchor: [24, 50], popupAnchor: [0, -46] });
      event.marker = L.marker([event.latitude, event.longitude], { icon, title: label, alt: label, keyboard: true }).addTo(markers).bindPopup(popup(event));
      event.marker.on('click', () => selectEvent(event.id));
      const node = event.marker.getElement(); if (node) node.setAttribute('aria-label', label);
    }
    if (oldIds !== current.map(event => event.id).join(',')) fitEvents();
  }
  function finishPick(point) {
    const callback = pointPicker; pointPicker = null; $('picker-banner').hidden = true;
    $('map').classList.remove('map-picking');
    if (pickMarker) map.removeLayer(pickMarker);
    if (point) pickMarker = L.circleMarker(point, { color: '#176b9b', fillColor: '#8fe5ff', fillOpacity: 0.8, radius: 10 }).addTo(map);
    if (callback) callback(point ? { latitude: point.lat, longitude: point.lng } : null);
  }
  function chooseLocation(callback) {
    pointPicker = callback; map.closePopup(); $('picker-banner').hidden = false; $('map').classList.add('map-picking');
    $('map').scrollIntoView({ behavior: 'auto', block: 'center' }); map.invalidateSize(); $('map').focus();
  }
  map.on('click', event => { if (pointPicker) finishPick(event.latlng); });
  $('fit-map').addEventListener('click', fitEvents);
  $('map-online').addEventListener('click', () => mode(true));
  $('map-offline').addEventListener('click', () => mode(false));
  $('pick-center').addEventListener('click', () => finishPick(map.getCenter()));
  $('cancel-pick').addEventListener('click', () => finishPick(null));
  function clearLocation() { if (pickMarker) map.removeLayer(pickMarker); pickMarker = null; }
  window.SportMateMap = { render, fitEvents, selectEvent, chooseLocation, clearLocation };
  mode(/^https?:$/.test(location.protocol));
})();
