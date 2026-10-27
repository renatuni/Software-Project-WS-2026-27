# Tatsächlich ausgeführte Prüfungen

Datum: 27.10.2026. Windows, Node 24.15.0, npm 11.12.1. Next.js 16.4.3, React 19.3.1, TypeScript 6.0.3, Leaflet 1.9.4, Vitest 5.0.5, Playwright 1.64.1 mit Chromium 156. Tests durch den Entwicklungsassistenten, kein menschliches Review.

| Prüfung | Eingabe / Erwartung | Tatsächliches Ergebnis |
|---|---|---|
| Original P01–P11 | `npm run test:legacy`, vorhandene Such-/Teilnahme-/Koordinatenregeln | 11/11 Prüfgruppen bestanden |
| Neue Unit-Tests | `npm test`, [25 Fälle](../../tests/unit/events.test.ts): Gast, Pflichtfelder/Grenzen, Zeit, Rechte, Doppelteilnahme, sequenzieller letzter Platz, Filter | 25/25 bestanden |
| Browser / Komponentenintegration | `npm run test:e2e`, [vier Abläufe](../../tests/e2e/core.spec.ts) jeweils Desktop 1280×720 und mobil 360×800 | 8/8 bestanden |
| E2E Suche | Mehrfachsportwahl ergibt zwei Kartenmarker/Events; unbekannter Text ergibt null und Erstellaktion | Erwartung erfüllt |
| E2E Teilnahme | Gast → Demoauswahl → letzter Platz → 2/2 → Rückzug → 1/2 | Erwartung erfüllt |
| E2E Erstellung/Absage | Fehlender Kartenpunkt wird gemeldet; Kartenmitte übernehmen; Organisator automatisch dabei; Eventabsage entfernt Marker | Erwartung erfüllt |
| E2E Mobil/Tastatur | Kein horizontaler Dokumentüberlauf, Suche per Tastatur, Details per Enter, Escape und Fokusrückkehr | Erwartung erfüllt |
| Kachelausfall | Alle E2E-Tests brechen OSM-Kachelzugriff kontrolliert ab | Lokale Ersatzkarte und Abläufe bleiben funktionsfähig |
| ESLint / TypeScript | `npm run lint`, `npm run typecheck` | Ohne Fehler |
| Formatierung | `npm run format:check` | Alle neuen Quell- und Testdateien entsprechen Prettier |
| Produktionsbuild | `npm run build` | Erfolgreich; dynamische Startseite |
| Manuelle Browserprüfung | Next.js-Startseite, reale OSM-Straßenkacheln, Details, Demoauswahl; Original auf Port 3011 öffnen | Oberflächen startbar; Straßenkarte geladen |

## Während der Entwicklung gefundene und behobene Probleme

- TypeScript meldete einen in der installierten Iconversion nicht vorhandenen Export; durch vorhandenes Icon ersetzt, Typprüfung anschließend bestanden.
- Lint meldete unnötige Stateinitialisierung im Effect und normalen Link zur Startseite; SSR-Demodaten als Props und Next-Link verwendet.
- Visuelle Prüfung zeigte die schematische Karte über den Onlinekacheln. Ersatzlayer wird nun nach erfolgreichem Tileload ausgeblendet und offline wieder eingeblendet.
- Erste E2E-Runde: vier von acht fehlgeschlagen. Dekorative Initialen verfälschten den zugänglichen Namen der Demo-Personen; jetzt aria-hidden. Der Fehlermeldungsselektor erfasste auch Nexts Route-Announcer; auf den Dialog begrenzt. Nach Korrektur acht von acht bestanden.

Diese lokalen Befunde wurden im Arbeitspaket #2 behoben; kein zusätzliches Bugticket pro Kleinigkeit. Keine Behauptung eines menschlichen Reviews.

## Bilder und Grenzen

[Desktopansicht](screenshots/desktop.png) · [360-px-Ansicht](screenshots/mobil.png). Aufnahme über [capture-preview.mjs](../../scripts/capture-preview.mjs), absichtlich reproduzierbare Offlinekartenvariante. Die Anwendung kennzeichnet sie als schematisch.

Nicht ausgeführt: Supabase Auth/RLS, PostgreSQL-Migrationen, DB-01–DB-15, echte Parallelität, E-Mail/Hinweise, 4G-Lastmessung, reale Nutzertests oder vollständige WCAG-/Geräteprüfung. NFR-1/2/4/5/6/7/8 sind nicht durch die obigen Checks erfüllt. Fehlende Infrastruktur ist kein bestandener Test. Den GitHub-Actions-Lauf erst nach einem tatsächlich erfolgreichen Run als grün melden.
