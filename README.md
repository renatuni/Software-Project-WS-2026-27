# SportMate · Gemeinsam in Bewegung

Hochschulprojekt Software-Projekt WS 2026/27. Sporttreffen in Flensburg finden, erstellen und gemeinsam daran teilnehmen.

## Lokal starten

Voraussetzungen: Node.js 22 oder neuer, npm, moderner Browser. Geprüft unter Windows mit Node 24.15.0 und npm 11.12.1. Die aufgelösten Paketversionen stehen im Lockfile.

```sh
npm ci
npm run dev -- --port 3010
```

Danach [SportMate öffnen](http://127.0.0.1:3010). Unter Windows PowerShell bei gesperrten npm-Skripten `npm.cmd` statt `npm` verwenden; keine Änderung der Execution Policy nötig.

Produktionsbuild lokal: `npm run build`, anschließend `npm start -- --port 3010` (vorher den Entwicklungsserver auf diesem Port beenden).

## Tatsächlich verfügbar

- Next.js-/React-/TypeScript-Demo mit neuem hellen Design, mobilen Navigationsaktionen und deutschen Texten.
- Gemeinsame Suche für Karte und Liste: mehrere Sportarten per ODER, Text, Niveau, Altersgruppe, Heute/Morgen/Diese Woche/freies Datum.
- Leaflet-/OpenStreetMap-Karte, Marker öffnen Eventdetails, Zoom/Übersicht und deutlich bezeichnete schematische Offlinekarte.
- Eventdetails, eigene Treffen, Erstellung mit Kartenpunkt und Validierung, automatische erste Teilnahme, Beitritt, Rückzug und Absage durch die organisierende Demo-Person.
- Originalprototyp bleibt unverändert unter [Prototyp](Prototyp/). Start ohne Python: `npm run prototype`, dann [Port 3011](http://127.0.0.1:3011). Direktes Öffnen von [index.html](Prototyp/index.html) verwendet laut Originalcode die Offlinekarte; dieser Dateiaufruf wurde nicht separat getestet.

**Demo, keine produktive Anwendung:** Personen und Treffen sind fiktiv. Identitätsauswahl ist keine Anmeldung. Änderungen liegen nur im Browserzustand und gehen beim Neuladen verloren. Keine Supabase-Anbindung, dauerhafte Daten, RLS oder sichere gleichzeitige Platzvergabe. Keine Hallenreservierung. Onlinekarten übertragen IP-Adresse und Kartenausschnitt an OSM.

## Qualität prüfen

```sh
npm run lint
npm run format:check
npm run typecheck
npm test
npm run test:legacy
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright startet die lokale Vorschau bei Bedarf selbst. Die Tests verwenden kontrolliert die Offlinekarte; dadurch benötigen sie keine externen OSM-Kacheln. `npm run format` formatiert ausschließlich neuen Code und Tests. [GitHub Actions](.github/workflows/quality.yml) führt dieselben Prüfungen aus.

Screenshots reproduzieren: Vorschau auf Port 3010 starten, dann `node scripts/capture-preview.mjs`. [Prüfbericht und Bilder](docs/testing/ENTWICKLUNGSSTAND.md).

## Architektur und Dokumentation

- [Originalanforderungen](docs/SportMate%20–%20Anforderungen.docx), [Architektur](P3/01_Architektur_und_Verhalten.md), [ADRs](P3/02_Architekturentscheidungen.md), [Datenmodellentwurf](P3/04_Datenmodell.md).
- [Aktueller Fortschritt](docs/management/ENTWICKLUNGSSTAND.md), [aktuelle Traceability und offene Anforderungen](docs/requirements/UMSETZUNG.md), [Coding-/Reviewregeln](docs/management/ENGINEERING.md).
- [Feedbackvorlage](docs/feedback/VORLAGE.md), [Zeiterfassung](docs/management/ZEITERFASSUNG.md).

Die Next.js-App ist ein modularer Monolith. [UI-Komponenten](src/components/) verwenden [Fachmodelle und Regeln](src/features/events/) und den [Kartenadapter](src/features/map/MapView.tsx). Die serverseitige Startseite liefert nur fiktive Demodaten; Mutationen bleiben ausdrücklich lokal. Die vereinbarte nächste Stufe benötigt Supabase Auth, PostgreSQL, serverseitig verifizierte Sitzungen, RLS und atomare DB-Fachoperationen. Demoidentitäten dürfen niemals als Serveridentitäten übernommen werden.

GPS, Geocoding, Umkreisfilter, echte Konten/Profile, allgemeine Eventbearbeitung, persistente Hinweise und Erinnerungen bleiben offen. Der Buchungspilot ist vorläufig; Bewertungen und Social Feed sind kein implementierter Kernumfang. Die ursprünglichen SQL-/Diagrammquellen und das Original-Kurs-PDF fehlen weiterhin. P3-Berichte sind historische Artefakte und werden durch den aktuellen Prüfbericht ergänzt.

## Zusammenarbeit

[GitHub-Board](https://github.com/users/renatuni/projects/2) · [UI/UX-Arbeitspaket #2](https://github.com/renatuni/Software-Project-WS-2026-27/issues/2). Teamnamen laut Anforderungsdokument: Julien, Renat, Paulo, Niklas; diese Nennung belegt keine individuellen Implementierungsbeiträge. Menschliches Review und reale Nutzertests stehen aus. Kein eigenmächtiger Merge in main.
