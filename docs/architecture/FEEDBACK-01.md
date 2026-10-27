# Kundenfeedback 1 – Lukas, 22 Jahre

## Umfang und Verantwortung

Architektur und Entwurf: Systemstruktur, Datenmodell und Oberflächenentwurf einschließlich
Frontend-Integration und Tests. Quelle: Abschnitt Kundenfeedback 1 in
[Reales Feedback.docx](../Reales%20Feedback.docx). Sarah, Max und Tims Landingpage sind nicht
Gegenstand dieser Änderung. Keine Erweiterung von Erstellung, eigenen Treffen,
Teilnehmerverwaltung oder Kommunikation.

Die echte Next.js-Anwendung startet über `npm run dev -- --port 3010`.
[page.tsx](../../src/app/page.tsx) lädt weiterhin fiktive Treffen aus
[demo.ts](../../src/features/events/demo.ts). Der historische Klickprototyp bleibt unverändert.
Next.js-Frontend bedeutet hier noch keine produktive Teilnahmeplattform.

## Datenmodell und Darstellung (B/C)

[SportEvent](../../src/features/events/model.ts) bleibt kompatibel. Keine Migration,
keine Datenbankänderung und keine Änderung an den bestehenden Geschäftsregeln.

| Feld | Bedeutung und Darstellung |
|---|---|
| `ageGroup` | Vom Ersteller gewählte Altersgruppe des Treffens, keine Auswertung tatsächlicher Teilnehmeralter und keine serverseitig erzwungene Zugangsbeschränkung. `''` bedeutet alle Altersgruppen; fehlender/unbekannter Wert bedeutet „Nicht angegeben“. |
| `capacity` | Gesamtzahl der Plätze einschließlich organisierender Person im bestehenden Demomodell. |
| `participants` | Liste der in der Demo teilnehmenden Personen-IDs; keine produktiven Buchungsbelege. |
| freie Plätze | `capacity - participants.length`, ausschließlich bei gültiger Kapazität und vollständiger, eindeutiger Teilnehmerliste. |
| ungültige Belegung | Fehlende Liste, doppelte IDs, Überbelegung oder ungültige Kapazität ergeben „Platzangabe nicht verfügbar“ statt erfundener Verfügbarkeit. |
| abgesagt | „Abgesagt“, keine freien buchbaren Plätze suggerieren. |

[presentation.ts](../../src/features/events/presentation.ts) berechnet ausschließlich
Darstellungswerte. [EventCard.tsx](../../src/components/EventCard.tsx) zeigt Altersgruppe
und freie Plätze. Die Daten werden weder korrigiert noch mutiert.

Für eine spätere produktive Liste muss der Backend-Adapter einen autoritativen
Belegungsstand liefern. Eine aus Datenschutzgründen ausgeblendete Teilnehmerliste darf
niemals als leere Liste beziehungsweise null Belegungen interpretiert werden. Ein separates
Zählfeld in einem späteren API-Lesemodell ist mit Issue #4 abzustimmen; die UI erfindet es nicht.

## Prüfung

Unit-Tests prüfen Altersgruppen, freie/volle/abgesagte Treffen und unvollständige oder
widersprüchliche Belegung. Playwright prüft die echte Next.js-Seite auf Desktop und 360 px.
Die bestehenden Kernabläufe werden als Regressionstests beibehalten.
