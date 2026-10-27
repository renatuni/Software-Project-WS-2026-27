'use client';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { LocateFixed, Map as MapIcon } from 'lucide-react';
import type { Point, SportEvent } from '@/features/events/model';
type Props = {
  events: SportEvent[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onPick?: (point: Point) => void;
  point?: Point;
};
const center: L.LatLngExpression = [54.783, 9.445];
export default function MapView({ events, selectedId, onSelect, onPick, point }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const tiles = useRef<L.TileLayer | null>(null);
  const sketch = useRef<L.ImageOverlay | null>(null);
  const callbacks = useRef({ onSelect, onPick });
  const [online, setOnline] = useState(true);
  const [message, setMessage] = useState('Straßenkarte wird geladen …');
  useEffect(() => {
    callbacks.current = { onSelect, onPick };
  }, [onSelect, onPick]);
  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, {
      scrollWheelZoom: false,
      minZoom: 10,
      maxZoom: 18,
    }).setView(center, 13);
    map.current = instance;
    sketch.current = L.imageOverlay('/flensburg-offline.svg', [
      [54.755, 9.395],
      [54.82, 9.49],
    ]).addTo(instance);
    layer.current = L.layerGroup().addTo(instance);
    tiles.current = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      keepBuffer: 0,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    tiles.current.on('tileload', () => {
      sketch.current?.setOpacity(0);
      setMessage('OpenStreetMap · Flensburg');
    });
    tiles.current.on('tileerror', () => {
      setOnline(false);
      setMessage('Straßenkarte nicht erreichbar. Schematische Ersatzkarte aktiv.');
    });
    instance.on('click', (event: L.LeafletMouseEvent) =>
      callbacks.current.onPick?.({ latitude: event.latlng.lat, longitude: event.latlng.lng }),
    );
    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      instance.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    if (!tiles.current || !map.current) return;
    if (online) tiles.current.addTo(map.current);
    else {
      map.current.removeLayer(tiles.current);
      sketch.current?.setOpacity(1);
    }
  }, [online]);
  useEffect(() => {
    if (!layer.current || !map.current) return;
    layer.current.clearLayers();
    events
      .filter((event) => event.status === 'published' && new Date(event.endsAt) > new Date())
      .forEach((event) => {
        const free = event.capacity - event.participants.length;
        const symbol =
          event.sport === 'Fußball'
            ? 'F'
            : event.sport === 'Volleyball'
              ? 'V'
              : event.sport === 'Basketball'
                ? 'B'
                : 'BM';
        const icon = L.divIcon({
          className: 'map-pin',
          html: `<span class="pin ${free ? '' : 'full'} ${event.id === selectedId ? 'selected' : ''}">${symbol}<small>${free}</small></span>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });
        const marker = L.marker([event.latitude, event.longitude], {
          icon,
          keyboard: true,
          title: `${event.title} · ${free} freie Plätze`,
        })
          .addTo(layer.current!)
          .on('click', () => callbacks.current.onSelect?.(event.id));
        marker.getElement()?.setAttribute('aria-label', `${event.title} · Details öffnen`);
      });
    if (point)
      L.circleMarker([point.latitude, point.longitude], {
        radius: 9,
        color: '#123b47',
        fillColor: '#58d7b2',
        fillOpacity: 1,
      }).addTo(layer.current);
  }, [events, selectedId, point]);
  const fit = () => {
    const points = events
      .filter((event) => event.status === 'published' && new Date(event.endsAt) > new Date())
      .map((event) => [event.latitude, event.longitude] as L.LatLngTuple);
    if (points.length) map.current?.fitBounds(points, { padding: [45, 45], maxZoom: 15 });
    else map.current?.setView(center, 13);
  };
  return (
    <section
      className={`map-panel ${onPick ? 'picker-map' : ''}`}
      aria-label={onPick ? 'Treffpunkt wählen' : 'Treffen auf der Karte'}
    >
      <div className="map-heading">
        <span>
          <MapIcon size={17} /> {onPick ? 'Dein Treffpunkt' : 'In deiner Nähe'}
        </span>
        <button type="button" className="text-button" onClick={fit}>
          <LocateFixed size={16} /> Überblick
        </button>
      </div>
      <div ref={container} className="leaflet-map" aria-label="Interaktive Karte von Flensburg" />
      <div className="map-caption">
        <span role="status">
          {online ? message : 'Schematische Ersatzkarte · keine Navigationskarte'}
        </span>
        <button type="button" className="text-button" onClick={() => setOnline(!online)}>
          {online ? 'Offlinekarte' : 'Straßenkarte'}
        </button>
      </div>
      {onPick && (
        <button
          type="button"
          className="secondary pick-center"
          onClick={() => {
            const p = map.current?.getCenter();
            if (p) onPick({ latitude: p.lat, longitude: p.lng });
          }}
        >
          Kartenmitte als Treffpunkt übernehmen
        </button>
      )}
      <p className="map-privacy">
        Fiktive Treffen. OSM erhält bei Kartenabrufen IP-Adresse und Kartenausschnitt.
      </p>
    </section>
  );
}
