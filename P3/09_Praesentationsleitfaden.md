# SportMate: Leitfaden für Präsentation 3

Stand: 27.10.2026. Termin: 28.10.2026. Ziel: etwa 8 Minuten einschließlich kurzer Live-Demo. Die Aufteilung ist ein Vorschlag, keine Änderung eurer Projektrollen.

| Folie | Zeit | Person, Vorschlag | Kernaussage |
|---|---|---|---|
| 1 Architektur & Prototyp | 20s | Julien | SportMate findet und organisiert gemeinsame Sporttreffen. Heute zeigen wir den Architekturentwurf und einen lokalen Ablaufprototyp. |
| 2 High-Level-Struktur | 65s | Julien | Der Browser spricht mit einem Next.js-Server. Supabase übernimmt Authentifizierung und PostgreSQL. Leaflet läuft lokal im Browser, OSM liefert geografische Kacheln. Die Serveranbindung ist noch Zielarchitektur. |
| 3 Architekturentscheidung | 55s | Renat | Ein modularer Monolith hält Umsetzung und Betrieb im Semester überschaubar. Fachliche Verantwortlichkeiten bleiben getrennt. Anbieterabhängigkeit und sichere Rechtekonfiguration sind die Abwägung. |
| 4 Verhalten | 65s | Renat | Beim letzten Platz zählen Prüfung und Speicherung als eine Datenbanktransaktion. Die Eventzeile wird gesperrt. Ein PK verhindert die Doppelteilnahme. |
| 5 Detailentwurf | 55s | Paulo | EventService verwaltet Treffen, ParticipationService die Teilnahme. UML zeigt Datenobjekte und Modulverantwortung, keine Pflicht zu einer Klassenhierarchie. |
| 6 Datenmodell | 60s | Paulo | Profile, Sportarten, Events und Teilnahmen sind relational verbunden. Teilnahme hat einen zusammengesetzten Schlüssel. Das vollständige Modell enthält auch Hinweise und optionale Sportstätten. |
| 7 Prototyp | 90s | Niklas | Auf der Karte Badminton wählen, Marker und synchronisierte Liste zeigen, Demo-Anmeldung, Beitreten/Absagen. Fiktive Punkte und lokale Daten; geografische Tiles online. Next.js/Supabase bleiben weitere Arbeit. |
| 8 Traceability / Umsetzung | 60s | Niklas | Beispiele führen von DR-ID über konkrete Funktion bis zum Nachweis. Vollständige Matrix enthält beide Anforderungskataloge. Lokale Prüfergebnisse und Kartenanteil von T12 zeigen; Integrationstests, GPS/Radius/Geocoding und reales Feedback folgen. |

Summe: ungefähr 7:50 Minuten. Details gehören in Rückfragen, die umfangreiche Dokumentation dient als Nachschlagewerk. In den PPTX-Notizen stehen Quellen und ergänzende Erklärungen pro Folie.

## Vier geforderte Punkte und zusätzlicher Kursnachweis

| Kriterium | Im Vortrag | Dauerhafte Dokumentation |
|---|---|---|
| Komponenten, Konnektoren und Verhalten | Folien 2 und 4 | 01, Diagramme 01–03 |
| Detailentwurf und Datenmodell | Folien 5 und 6 | 03 und 04, UML/ER und SQL |
| Begründete Architekturentscheidung | Folie 3 | 02 mit neun ADRs und Alternativen |
| Anforderung bis Realisierung | Folie 8 | 05 und vollständige CSV mit 81 IDs |
| Lauffähigen Prototyp demonstrieren, zusätzlich in Kurs-PDF §6.4 | Folie 7 plus Browser | 07, Prototypquellen und 08 |

## Vor dem Termin

1. Die in 06 aufgeführten Arbeitsentscheidungen gemeinsam durchgehen. Automatische Organisatorteilnahme, Kapazität, Passwortgrenze und Startzeitregel müssen fachlich zusammenpassen. Das Kartenproduktziel ist seit dem Nutzerauftrag vom 27.10. bestätigt, die spätere Produktintegration bleibt offen.
2. PPTX und Demo auf dem Präsentationsrechner öffnen: `python3 P3/prototyp/start.py`. Straßenkarte mit Internet prüfen, anschließend schematische Offlinekarte ausprobieren; den Ablauf aus 07 üben.
3. Falls bereits ein echtes Repository oder Board existiert, dessen tatsächlichen Stand ergänzen. In diesem Paket wurden keine externen Tickets, Commits oder Teamstunden erfunden.
4. Bereits verfügbares echtes Feedback seit P2 mit Rolle, Methode, Beobachtung und Folge ergänzen. Neue reale Interviews/Nutzertests liegen diesem Paket nicht zugrunde.

## Kurze Antworten auf erwartbare Rückfragen

**Warum keine Microservices?** Der dokumentierte Umfang braucht noch keine unabhängig deploybaren Dienste. Ein gemeinsames Projekt reduziert Abstimmungs- und Betriebsaufwand; fachliche Module erlauben spätere Änderungen.

**Warum PostgreSQL?** Events und Teilnahmen besitzen klare Beziehungen und Integritätsregeln. Schlüssel, Constraints und Transaktionen passen zu diesen Regeln.

**Warum prüft ihr freie Plätze in der Datenbank?** Zwei Clients können gleichzeitig denselben freien Platz sehen. Nur das atomare Prüfen und Ändern unter einer gemeinsamen Sperre verhindert im Entwurf die Überbelegung.

**Ist der Prototyp schon die Zielanwendung?** Er demonstriert Interaktion und lokale Fachregeln. Die verteilte Next.js-/Supabase-Umsetzung ist der nächste Schritt. Der SQL-Entwurf wurde noch nicht ausgeführt.

**Wie funktioniert die Karte?** Leaflet 1.9.4 liegt lokal bei, OSM liefert online die geografischen Kacheln. Sportmarker und Liste verwenden dieselben Filter. Marker bieten die Detailsaktion im Popup an, bei Erstellung wählt man den Eventpunkt per Kartenklick. Ohne Internet bleibt eine deutlich schematische Offlinekarte. GPS, Ortsnamen-Geocoding und Radiusfilter sind noch offen.

**Was ist tatsächlich geprüft?** Elf lokale Fachlogik-/Koordinatenprüfgruppen und die in 08 konkret protokollierten Browserabläufe. T12 ist nur im Karten-/Markeranteil lokal realisiert. Echte Parallelität, RLS, GPS/Radius/Geocoding, Performance und neue Nutzerakzeptanz bleiben offen.

**Welche Daten gehen an den Kartendienst?** Online-Kachelabrufe zeigen OSM die IP-Adresse und den Kartenausschnitt. Markertexte und Teilnehmerdaten bleiben lokal. Die Demo löst keine GPS-Anfrage aus und bündelt keine OSM-Kacheln zur Offlinenutzung.
