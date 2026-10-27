# Traceability der Next.js-Demo

Stand: 27.10.2026. Die ursprünglichen 43 DR, acht NFR und 30 ergänzenden SM-R bleiben in [P3/traceability.csv](../../P3/traceability.csv) unverändert. Diese Fortschreibung überschreibt weder fachliche Vorgaben noch historische Nachweise. Alle nachfolgenden Implementierungsnachweise betreffen ausschließlich die lokale Demo in [Issue #2](https://github.com/renatuni/Software-Project-WS-2026-27/issues/2).

## Realisierte Anteile

| Anforderung | Baustein / Code | Tatsächlicher Nachweis | Grenze |
|---|---|---|---|
| DR-1.1.4 | C1, [SportMate](../../src/components/SportMate.tsx), [Fachregeln](../../src/features/events/service.ts) | Unit: Gastmutationen verweigert; E2E: Demoauswahl vor Teilnahme | Keine echte Anmeldung; Anforderung nicht produktiv erfüllt |
| DR-2.1.3/4 | C1/C5, [MapView](../../src/features/map/MapView.tsx) | E2E: gleiche Trefferzahl für Karte/Liste; Absage entfernt Marker | Kein Umkreis; P3-Regel blendet bereits begonnene Treffen aus öffentlicher Suche aus, F03 bleibt offen |
| DR-2.2.1–3 | C1, [Filters](../../src/components/Filters.tsx), searchEvents im Fachmodul | Unit: Sportarten ODER, Zeiträume; E2E: Mehrfachfilter/Leerzustand | Demodaten, keine Such-API |
| DR-2.3.1/2 | C1, Filters/searchEvents | Unit: Niveau einschließlich Alle; Alter einschließlich ohne Einschränkung | Kein gespeichertes Nutzerprofil |
| DR-2.5.1/2 | C1, [EventDetails](../../src/components/EventDetails.tsx) | E2E: Details und Belegung; externer OSM-Routenlink implementiert | Externe Navigation nicht als End-to-End-Ziel getestet |
| DR-3.1.1–5 | C1/Fachmodul, [EventForm](../../src/components/EventForm.tsx), createEvent/validateEvent | Unit: Pflichtfelder, Zeit, 2–50, Beschreibung, Koordinaten; E2E: Erstellung/erste Teilnahme | Nur flüchtige Speicherung; Kartenpunktfehler am Formular, native Pflichtfeldprüfung |
| DR-3.2.1 | C1/Fachmodul, eventStatus | Unit/Detailanzeige: abgeleiteter Mindeststatus | Kein Erinnerungs-/Versanddienst |
| DR-3.2.2 | eventStatus | Mindeststatus berechnet | Benachrichtigungsanteil fehlt |
| DR-3.3.2 | changeParticipation/MapView | Unit/E2E: eigene Absage, Marker entfernt, fremde Absage abgewiesen | Keine Benachrichtigungen; keine serverseitige Sicherheitsgrenze |
| DR-4.1.1–4 | changeParticipation, EventDetails | Unit: sequenzieller letzter Platz/Doppelteilnahme; E2E: Beitritt/Vollstand | Kein Nachweis für konkurrierende DB-Transaktionen |
| DR-4.2.1 | changeParticipation | Unit/E2E: Rückzug gibt Platz frei | Organisatorbenachrichtigung fehlt |

## Alle übrigen DR im Blick

- DR-1.1.1–3: echte Registrierung/Passwort-/E-Mail-Verarbeitung offen; F04 (acht Zeichen versus vorgeschlagene zwölf) nicht eigenmächtig entschieden.
- DR-1.2.1–3: Profilbearbeitung und öffentliche Profilansicht offen. Demo zeigt keine Geburtsdaten.
- DR-2.1.1/2 und DR-2.4.1: GPS, Ortsnamensuche und Radius offen. Ein Kartenpunkt zur Erstellung ist keine Ortssuche.
- DR-3.2.3, DR-3.3.1 und DR-4.3.1: zeitgesteuerte Erinnerung, allgemeine Eventänderung und dauerhafte Hinweise einschließlich 60-Sekunden-Ziel offen.
- DR-5.1.1–3, DR-5.2.1/2, DR-5.3.1, DR-5.4.1/2: vorläufiger Buchungspilot nicht umgesetzt. Teilnahme reserviert keine Sportstätte.

## Qualitätsziele

| ID | Bewertung |
|---|---|
| NFR-1 | Kein realer Fünf-Personen-Test; 4/5 innerhalb zwei Minuten nicht nachgewiesen |
| NFR-2 | Ein Formular mit fünf Feldgruppen; keine Gleichsetzung von Gruppen mit höchstens sechs Eingabeschritten. Messdefinition/Klickpfadabnahme offen |
| NFR-3 | Automatischer 360-px-Überlaufcheck und Kernabläufe bei 360 px bestanden. Kein vollständiger Geräte-/Browsernachweis |
| NFR-4 | 100 Events/4G/≤3s nicht gemessen |
| NFR-5 | Keine echte DB-Parallelitätsprüfung; nicht erfüllt |
| NFR-6/7 | Buchungspilot/Betreiber-E-Mail fehlen; nicht geprüft |
| NFR-8 | Tests für implementierte Abläufe; nicht alle Must-Stories, insbesondere Konto/Profil/GPS. Daher noch nicht erfüllt |

SM-R01–30 bleiben ergänzende, in P3 dokumentierte Verfeinerungen mit fehlender Originalquelle. Die Demo verbessert überlappende Event-/Suchabläufe, liefert jedoch keinen pauschalen Erfüllungsnachweis für diese IDs. Insbesondere echte Auth/RLS, DB-Konkurrenz, zeitliche Garantien, 1000-Event-Last, Hinweise und Buchungsabläufe bleiben offen. Alle F01–F13 bleiben im [Konfliktregister](../../P3/06_Quellen_Scope_und_offene_Punkte.md) nachvollziehbar. Die Regelentscheidungen aus dem gelieferten Prototyp wurden erhalten; die lokale Zeit-Eingabe behält die bekannte Sommerzeit-Mehrdeutigkeit F13.
