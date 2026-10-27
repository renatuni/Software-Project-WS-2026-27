# SportMate: Präsentation 3 – Architektur & Prototyp

Stand: 27.10.2026 · Präsentation am 28.10.2026

## Direkt öffnen

- [Kurze PowerPoint mit acht Folien](praesentation/SportMate_P3_Architektur_und_Prototyp.pptx)
- [Lokaler Prototyp mit interaktiver Karte](prototyp/index.html)
- [Vortragsleitfaden und Aufteilung](09_Praesentationsleitfaden.md)
- [Prototyp starten und demonstrieren](07_Prototyp_und_Demo.md)

## Dokumentation für die Weiterarbeit

| Datei | Inhalt |
|---|---|
| [01 Architektur und Verhalten](01_Architektur_und_Verhalten.md) | Komponenten C1–C5, Konnektoren, Vertrauensgrenzen, Abläufe, Zustände, Fehlerfälle und Betrieb |
| [02 Architekturentscheidungen](02_Architekturentscheidungen.md) | Neun ADRs mit Problem, Entscheidung, Alternativen und Folgen |
| [03 Detailentwurf und Schnittstellen](03_Detailentwurf_und_Schnittstellen.md) | Fachmodule, konzeptuelles UML, TypeScript-Datenverträge, HTTP-Routen und Fehlerverträge |
| [04 Datenmodell](04_Datenmodell.md) | ER-Modell, Datenwörterbuch, Schlüssel, Constraints, Rechte und DB-Testfälle |
| [05 Traceability](05_Traceability.md) | Vollständige Zuordnung von 43 DR, 8 NFR und 30 ergänzenden SM-R sowie konkrete Prüfpläne |
| [06 Quellen, Scope und offene Punkte](06_Quellen_Scope_und_offene_Punkte.md) | Quellenregister, 13 Konflikte, Arbeitsentscheidungen und verbleibende Nachweise |
| [07 Prototyp und Demo](07_Prototyp_und_Demo.md) | Start ohne Installation, Vorführablauf, Codezuordnung und Grenzen |
| [08 Prüfprotokoll](08_Pruefprotokoll.md) | Tatsächlich ausgeführte lokale Prüfungen, Browserbeobachtungen und offene Integrationstests |
| [09 Präsentationsleitfaden](09_Praesentationsleitfaden.md) | Etwa acht Minuten Vortrag, Vorschlag für vier Personen und Antworten auf Rückfragen |
| [Traceability als CSV](traceability.csv) | 81 eindeutige Zeilen mit Herkunft, Originalanforderung, Zielanker und Nachweisstatus |
| [SQL-Entwurf](datenmodell/schema.sql) | Sieben Tabellen und neun Funktionen für eine neue Supabase-Testdatenbank; noch nicht ausgeführt |
| [Diagrammquellen](diagramme/README.md) | Bearbeitbare Komponenten-, Sequenz-, Zustands-, UML- und ER-Modelle |

Für die geografische Onlinekarte: `python3 P3/prototyp/start.py` vom Projektordner aus starten. Beim direkten Öffnen per Doppelklick bleibt die Demo auf der schematischen Offlinekarte. Online-Kachelabrufe übertragen IP-Adresse und den angeforderten Kartenausschnitt an OSM, die Demo fragt keinen Gerätestandort ab.

## Was dieses Paket belegt

Die Architektur und der Detailentwurf sind ausgearbeitet. Der lokale Browserprototyp zeigt Sporttreffen als anklickbare Marker auf einer interaktiven geografischen Karte und in einer synchronisierten Liste. Leaflet 1.9.4 liegt lokal bei, die geografische Straßenkarte lädt OpenStreetMap-Kacheln über das Internet. Eine ausdrücklich schematische Offlinekarte mit Markern und Liste bleibt ohne Internet nutzbar. Die Flensburger Treffen und Koordinaten sind fiktive Beispieldaten. Elf lokale Fachlogik-/Koordinatenprüfgruppen bestehen. Der tatsächliche Browser-/Kartenprüfstand steht in [08](08_Pruefprotokoll.md). Die PowerPoint behandelt die vier genannten Kriterien und enthält einen Ablauf für die zusätzliche Prototypdemo aus der Kursbeschreibung.

Die Zielanwendung mit Next.js und Supabase ist noch ein Entwurf. SQL-Ausführung, echte Authentifizierung, Anbindung der Karte an die spätere Such-API, GPS, Geocoding, Umkreisfilter, Datenbank-Parallelität und Serverzugriffsrechte sind offene Umsetzungsschritte. Die Präsentation kennzeichnet diese Grenze. Quellenkonflikte werden mit P3-Arbeitsvorschlägen aufgelöst, ohne eine bereits erfolgte Teamfreigabe zu behaupten.

## Arbeitsweise und Pflege

Drei Agenten haben parallel Architektur/Entscheidungen, Detail-/Datenentwurf und Traceability ausgearbeitet. Die Ergebnisse wurden auf gemeinsame Begriffe und Regeln abgeglichen, mit Prototyp und Präsentation zusammengeführt. Die ursprünglichen Dateien und P2 wurden nicht geändert. Am 27.10.2026 wurde auf ausdrücklichen Nutzerwunsch die visuelle Auswahl über eine interaktive Karte ergänzt; Dokumentation und Präsentation führen diesen Stand weiter.

Bei Änderungen zuerst die fachliche Anforderung und ihre ID prüfen, dann ADR und Modell anpassen, anschließend API/Schema und Prüfplan nachführen. Bestehende IDs beibehalten. Einen lokalen Demonstrationsnachweis erst dann als Produktnachweis markieren, wenn die echte Schicht getestet wurde. Vorhandene Teamrollen, Boardstände und neue reale Rückmeldungen führt ihr mit ihrem tatsächlichen Stand weiter.
