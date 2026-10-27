# SportMate P3: tatsächlicher Prüfstand

Prüfdatum: **27.10.2026**. Gegenstand: interaktiver Kartenprototyp und aktualisiertes P3-Paket. Dieser Stand ersetzt den Prüfstand der Listenansicht vom 26.10.2026. Er ist kein Prüfbericht einer produktiven Next.js-/Supabase-Anwendung.

## Wiederholbare lokale Fachlogik

Ausgeführt: `node P3/prototyp/test.js`, `node --check P3/prototyp/app.js` und `node --check P3/prototyp/map.js`. Umgebung: Linux, Node.js v20.20.2. Nach den abschließenden Codeänderungen erneut ausgeführt. Ergebnis: **11 von 11 Prüfgruppen bestanden**, beide Syntaxprüfungen ohne Fehler. Eine Prüfgruppe enthält teilweise mehrere Assertions.

| Gruppe | Geprüfte Situation | Ergebnis | Bezug |
|---|---|---|---|
| P01 | Textsuche ohne Groß-/Kleinschreibung, Sportart, Niveau einschließlich „Alle Niveaus“, keine Treffer | Bestanden | T01, DR-2.3.1, DR-2.2.3 |
| P02 | Gast versucht Beitritt und Erstellung | Beide lokalen Mutationen abgewiesen | T03, echte Auth weiterhin T16 |
| P03 | Beitritt und Wiederholung durch gleiche Identität, „Meine Treffen“, Erreichen der Mindestzahl | Genau eine neue Teilnahme, Zustand „Findet statt“ | T05, lokaler Anteil T13 |
| P04 | Volles Event und sequenzielle Versuche auf letzten Platz | Keine Überbelegung im lokalen Modell | T05; kein T06-Parallelitätsnachweis |
| P05 | Eigene Absage, erneute Belegung, Org-Abmeldung | Platz frei und wieder belegbar; Organisator muss Eventabsage nutzen | T07 |
| P06 | Gültige Eventerstellung mit Koordinaten | Ein Event und automatisch eine Organisatorteilnahme | T04, DR-3.1.5 |
| P07 | Leere Eingaben, unzulässige Kapazität/Mindestzahl, ungültige Zeiten, zu lange Beschreibung, unbekannte Sportart/Niveau | Ungültige Eingaben abgewiesen | T04, lokale Grenzen |
| P08 | Fremde Eventabsage und berechtigte Org-Absage | Fremde Absage gesperrt, eigenes Event abgesagt und aus Suche entfernt, Beitritt gesperrt | Lokaler Anteil T08/T09 |
| P09 | Nach Beginn suchen und beitreten | Aus Suche entfernt, Beitritt gesperrt | T01, dokumentierte P3-Regel F03 |
| P10 | Beispieltreffen besitzen unterschiedliche gültige Koordinaten im Flensburger Ausschnitt | Alle drei Punkte gültig | Teilnachweis für Kartendaten, keine Vermessung realer Treffpunkte |
| P11 | Erstellung übernimmt Latitude/Longitude; fehlende, leere, unlesbare und außerhalb gültiger Grenzen liegende Werte | Gültiger Punkt gespeichert, ungültige Punkte abgewiesen | T04, Karteneingabe |

## Tatsächliche Browserprüfung der Kartenfassung

Im In-App-Browser über einen ausschließlich auf `127.0.0.1` gebundenen HTTP-Dateiserver geprüft:

| Ablauf | Tatsächlich beobachtet |
|---|---|
| Onlinekarte starten | OpenStreetMap-Straßenkacheln geladen, drei unterschiedlich markierte Sporttreffen, sichtbare Attribution |
| Marker auswählen | Badminton-Marker öffnet Kurzinfos mit Sportart, Niveau, Belegung, Treffpunkt und „Details ansehen“ |
| Teilnahme aus der Karte | Marker, Details, Demo-Anmeldung als Lea, Beitreten: 1/2 wird 2/2 und „Ausgebucht“ |
| Abmelden | Wieder 1/2; Karte und Liste aktualisieren sich mit demselben lokalen Datenstand |
| Sportfilter | Badminton ergibt genau einen Marker und einen Listeneintrag |
| Treffpunkt wählen | Im Erstellformular Karte wählen, in die Karte klicken: Formular öffnet sich erneut mit Bestätigung des gewählten Orts |
| Event veröffentlichen | Neues Basketballtreffen mit gewähltem Kartenpunkt, automatische erste Teilnahme, ein Marker in „Meine Treffen“ |
| Event absagen | Nach Absage null Marker für das eigene abgesagte Event, Historie bleibt in „Meine Treffen“ |
| Offlinekarte umschalten | Schematische lokale Karte mit denselben drei interaktiven Sportmarkern sichtbar |
| Schmale Ansicht | Bei 360 CSS-px: drei Marker, keine überbreite Seite (`scrollWidth` 345 bei `innerWidth` 360), Karte vor Liste. Kein vollständiger mobiler Geräte-/Gestentest. |

Ein Screenshot der echten Straßenkarte dient als aktualisierter Präsentationsbeleg. Die Koordinaten sind bewusst ungefähre Beispielpunkte. Es wurde keine Reservierung oder reale Sportveranstaltung erzeugt.

Der direkte Browseraufruf von `file://` war in der Prüfoberfläche nicht zugelassen und wurde daher nicht getestet. Der Code wählt bei diesem Protokoll die lokale schematische Karte und sendet keine Tile-Anfragen. Die explizite Offlineumschaltung ist über HTTP geprüft. Ein erzwungener Netzwerkausfall und sämtliche Wiederverbindungsfälle wurden nicht separat simuliert. Tastatur- und Touchbedienung bleiben weiter zu prüfen.

Nach der Browserprüfung wurde die Entfernung des temporären Auswahlpunkts bei Erstellung, Formularschließen und Reset ergänzt. Die Node-/Syntaxchecks liefen anschließend erneut. Diese kleine Bereinigung wurde nicht noch einmal in einem vollständigen Browserdurchlauf geprüft.

## Paket- und Modellprüfung

- 43 eindeutige DR, 8 NFR und 30 SM-R bleiben erhalten. Die CSV enthält 81 eindeutige Anforderungszeilen. Kartenanforderungen werden nur im tatsächlich vorhandenen Umfang als lokal demonstrierbar markiert.
- Die geografischen Felder `events.latitude` und `events.longitude` waren im Datenmodell bereits vorgesehen. Die Browserdemo liefert sie jetzt aus der Kartenwahl. Das vorhandene SQL benötigt dafür keine neue Tabelle.
- Architektur, ADR-06, Diagramme, Schnittstellen, Demoanleitung und Präsentation beschreiben Leaflet und OpenStreetMap sowie den schematischen Fallback. Echte Konto-/Server-/DB-Integration bleibt offen.
- SQL weiterhin nur statisch gelesen: 7 Tabellen mit RLS, explizite Rechte und gemeinsame Eventsperre für join/leave/update/cancel. Keine PostgreSQL-Ausführung.
- Die PowerPoint enthält weiterhin acht Folien und wurde für die neue Kartenfassung inhaltlich und visuell geprüft. Technischer Paket-/Geometriecheck ergänzt die Sichtprüfung; kein Test in Microsoft PowerPoint behauptet.

## Offene Nachweise

| Bereich | Noch zu leisten |
|---|---|
| Schema / Parallelität | SQL in isolierter Supabase-Testdatenbank ausführen; T06 mit echten gleichzeitigen Anfragen |
| Sicherheit / Auth | T09/T16: echte Sitzungen, RPC-Direktzugriff, RLS, Grants und fremde Änderungen |
| Weiterer Kartenumfang | T12: GPS, Ortsnamensuche/Geocoding, Radiusgrenzen, voller Netzausfalltest, echte Standortgenauigkeit |
| Hinweise | T13: Persistenz, Wiederholung, Kanal, 60s-Ziel und 2h-Aufgabe |
| Qualität | Vollständige Tastatur-/Touch-/Gerätetests, reale Nutzertests, definierte Zeit- und Lastmessung |
| Prozess | Tatsächliche Aufgaben und Teamfortschritt im echten Projektboard / Repository nachführen |

Die vollständigen geplanten Abläufe und Soll-Ergebnisse stehen in [05_Traceability.md](05_Traceability.md), SQL-spezifische Fälle in [04_Datenmodell.md](04_Datenmodell.md).
