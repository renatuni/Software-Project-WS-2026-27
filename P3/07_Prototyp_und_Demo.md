# SportMate P3: Prototyp und Live-Demonstration

Stand: 27.10.2026. Termin: 28.10.2026.

## Start der geografischen Onlinekarte

Im Projektordner ein Terminal öffnen und starten:

```bash
python3 P3/prototyp/start.py
```

Das Skript liefert ausschließlich den Ordner `P3/prototyp` auf dem eigenen Rechner aus und öffnet die Demo im Browser. Standardadresse: [http://127.0.0.1:8765/index.html](http://127.0.0.1:8765/index.html). Ist der Port bereits belegt, wählt das Skript einen freien Port und zeigt die tatsächlich verwendete Adresse im Terminal an. Mit `Strg+C` im Terminal beenden. Python 3 genügt, es gibt keine Paketinstallation und keine Zugangsdaten. Der Server ist eine lokale Dateiauslieferung, kein SportMate-Backend. Für die geografische Straßenkarte braucht der Browser Internetzugang zu OpenStreetMap.

Alternativ im Ordner `P3` ausführen:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Dann [http://127.0.0.1:8765/prototyp/index.html](http://127.0.0.1:8765/prototyp/index.html) öffnen. Für die manuelle Startart muss Port 8765 frei sein. `start.py` kann bei Bedarf automatisch einen anderen Port verwenden.

## Offline starten und Kartenmodi

[prototyp/index.html](prototyp/index.html) lässt sich auch direkt per Doppelklick öffnen. Beim Start mit `file://` verwendet die Demo ihre **schematische Offlinekarte ohne externe Tileabrufe**. Die Marker, Liste und Eventabläufe benötigen keinen Internetzugang. Das ist eine eigene Ersatzdarstellung, keine gespeicherte OSM-Karte und kein maßstabsgetreuer Straßenplan.

Beim HTTP-Start zeigt die Demo die geografische Straßenkarte. Der sichtbare Umschalter wechselt zwischen „Straßenkarte“ und „Offlinekarte“. Bei fehlenden/fehlerhaften Kacheln erfolgt ein gekennzeichneter Fallback. Karte und Liste bleiben benutzbar. Vor der Präsentation beide Modi einmal auf dem tatsächlichen Vortragsrechner öffnen. Die Dateien `index.html`, `app.js`, `map.js`, `flensburg-offline.svg` und der mitgelieferte Leaflet-Ordner müssen zusammenbleiben.

## Demonstration in etwa 90 Sekunden

| Schritt | Aktion | Sichtbares Ergebnis / Aussage |
|---|---|---|
| 1 | Demo zurücksetzen und Karte kurz verschieben/zoomen | Sporttreffen liegen als auswählbare Sportmarker im Raum Flensburg. Basiskarte geografisch, Eventpunkte und Treffen fiktiv. |
| 2 | Sportart „Badminton“ filtern oder entsprechenden Marker wählen | Karte und Liste zeigen denselben Treffer. Marker öffnet ein Popup. Dessen Detailsaktion zeigt das Event mit genau einem freien Platz. |
| 3 | Als Gast „Demo-Anmeldung als Lea“, anschließend „Bin dabei“ wählen | Lea ist eine fiktive Demoidentität. 1/2 wird 2/2, „Ausgebucht“, eigene Teilnahme sichtbar. |
| 4 | „Teilnahme absagen“ wählen | Wieder 1/2, Platz frei. Detailanzeige und Listeneintrag verwenden denselben Zustand. |
| 5 | Details schließen, Filter zurücksetzen und alle Treffer einpassen | Gemeinsamer Überblick über alle passenden Marker und Listeneinträge. |
| Optional | Neues Treffen anlegen und dessen Ort per Kartenklick wählen | Ausgewählter Punkt setzt latitude/longitude. Nach Veröffentlichung erscheint das Treffen als Marker und unter „Meine Treffen“, Organisator automatisch erste Teilnahme. |
| Optional | Auf „Offlinekarte“ wechseln | Schematischer Fallback mit Markern bleibt bedienbar. Keine geografische Offlinekarte behaupten. |

Für die Vorführung sind keine echten Konten oder Hallenbuchungen nötig. Kein GPS-Prompt wird ausgelöst. Die Beispieltermine rücken bei jedem Start relativ zum aktuellen Tag nach vorn. Ein zweites Demoidentitätskonto kann nach einer Absage denselben Platz belegen; diese Folge bleibt sequenziell und ist kein Parallelitätstest.

## Was funktioniert

- Interaktive Leaflet-Karte mit geografischen OSM-Straßenkacheln, auswählbaren Sportmarkern, Zoom, Verschieben und passender Trefferansicht.
- Synchronisierte Marker und Liste mit Textsuche sowie Einzel-Sportart- und Niveaufilter. „Alle Niveaus“ passt zu jedem gewählten Niveau.
- Eventdetails per Marker oder Liste mit Treffpunkt, Koordinatenbezug, Teilnehmerzahl, Mindestzahl, Altersgruppe und Beschreibung.
- Punktwahl für neue Treffen per Kartenklick und lokale Prüfung der Koordinatenbereiche.
- Demoidentitäten Gast, Lea, Tom und Alex. Gastmutationen sind in der lokalen Logik gesperrt.
- Beitreten, doppelte Teilnahme verhindern, ausgebuchtes Treffen sperren und eigene Teilnahme zurücknehmen.
- „Meine Treffen“, Erstellung mit automatischer erster Teilnahme und Absage durch die Organisatoridentität.
- Abgeleitete Mindestzahl-/Belegungsanzeige sowie Absagezustand.
- Teilnehmernamen nur für Teilnehmende und Organisator in der Oberfläche. Nutzertexte werden als Text ausgegeben.
- Eigene schematische Offlinekarte und Liste bei fehlenden Straßenkartenkacheln.

## Externe Datenübertragung und Quellen

Leaflet **1.9.4** liegt lokal bei. Für die Straßenkarte fordert der Browser normale HTTPS-Kacheln von `tile.openstreetmap.org` an. Dabei erhält der Dienst die IP-Adresse und Kachelindizes des angezeigten Ausschnitts. Die Marker werden aus lokalen Eventdaten gezeichnet; Teilnehmernamen, Beschreibungen und Kontaktdaten werden nicht als Markerinhalt an OSM gesendet. Die Demo fragt keinen Gerätestandort ab.

Die Onlinekarte zeigt die OpenStreetMap-Quellenangabe sichtbar an. Der lokale HTTP-Start ermöglicht reguläre Browseranfragen mit Referer und Cache. Es gibt keine Funktion zum Vorladen oder Herunterladen von Kachelarchiven. Die schematische Offlinekarte besteht aus eigenen lokalen Elementen. Der öffentliche OSM-Kachelservice garantiert keine Verfügbarkeit. Quellen: [Leaflet Quick Start](https://leafletjs.com/examples/quick-start/), [OSM Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) und [OSMF Privacy Policy](https://osmfoundation.org/wiki/Privacy_Policy), eingesehen am 27.10.2026.

## Grenzen und Bedeutung für die Zielarchitektur

Der Prototyp ist HTML/CSS/JavaScript mit Daten im Arbeitsspeicher eines Browserfensters. Neuladen oder „Demo zurücksetzen“ verwirft Änderungen. Jedes Browserfenster hat eigene Daten. Die Identitätsauswahl ist **keine Authentifizierung** und kann keine Zugriffsrechte auf einem Server sichern. Daten und Personen sind fiktiv. Ein Beitritt reserviert keine Sporthalle.

Die geplante Next.js-/Supabase-Architektur wird weiterhin nicht ausgeführt. Echte Konten/Profile, Such-API, Persistenz, Umkreisfilter, GPS, Geocoding, Zeitraum-/Altersgruppenfilter, allgemeine Eventbearbeitung, dauerhafte Hinweise, E-Mail, Buchungspilot und Bewertungen sind offen. Eine Eventpunktwahl bei der Erstellung ist keine Ortsnamen-Suche und kein persönliches Suchzentrum. Die zugehörigen Anforderungen bleiben in [05_Traceability.md](05_Traceability.md) entsprechend markiert.

Die Prüfung „noch Platz?“ läuft sequenziell im Browser. Die Zielanwendung muss sie durch die in [04_Datenmodell.md](04_Datenmodell.md) entworfene Transaktion absichern. Erst ein echter Test mit parallelen Anfragen belegt diesen Schutz. Die geografische Basiskarte weist außerdem weder 4G-Ladeziel noch Lastverhalten mit 100/1000 Events nach.

## Code für die Weiterarbeit

| Datei / Funktion | Zweck |
|---|---|
| `start.py` | Lokaler stdlib-Dateiserver und Browseröffnung, kein Fachbackend |
| `index.html` | Oberfläche, Kartengruppen, responsive Gestaltung, Dialoge und Formular |
| `map.js` / `flensburg-offline.svg` | Leaflet-Integration, Marker-/Auswahlsteuerung und eigene schematische Offlinekarte |
| Lokal mitgeliefertes Leaflet 1.9.4 | Kartenbibliothek und Styles ohne Laufzeit-CDN-Abhängigkeit |
| `app.js`: `seed()` | Wiederherstellbare Treffen mit künftigen Terminen und fiktiven Flensburger Beispielkoordinaten |
| `search()` / `status()` | Gemeinsame Filterung und abgeleitete Statusanzeigen |
| `SportMateMap.render()` / `SportMateMap.fitEvents()` | Gefilterte Marker zeichnen und Kartenausschnitt an Treffer anpassen |
| `SportMateMap.chooseLocation()` | Per Kartenklick gewählten Eventpunkt in das Erstellformular übernehmen |
| `create()` | Koordinaten-/Eingabeprüfung und automatische Organisatorteilnahme |
| `join()` / `leave()` / `cancel()` | Demonstrierte Zustandswechsel |
| `details()` / `render()` | Sichtbare Projektion derselben Daten, sichere Textausgabe durch `escape()` |
| `test.js` | Elf wiederholbare Fachlogik-/Koordinatenprüfgruppen P01–P11 ohne Testframework |

Fachprüfungen vom Projektordner aus starten:

```bash
node P3/prototyp/test.js
```

Eine Node.js-Laufzeit genügt. P01–P09 prüfen den bisherigen Eventablauf, P10 die Beispielkoordinaten und P11 die Koordinatenvalidierung/-speicherung. Die tatsächlich ausgeführten Prüfungen und Browserbeobachtungen stehen in [08_Pruefprotokoll.md](08_Pruefprotokoll.md). Funktionsumfang und Prüfstatus sind unterschiedliche Angaben.

Für die Zielanwendung die fachlichen Regeln und Koordinatenfelder übernehmen, Identitätsumschalter und lokale Arrays durch verifizierte Sitzung und API-Aufrufe ersetzen. Die Demo verwendet deutsche Niveau-/Altersgruppenwerte, SQL interne Codes. Die Übersetzung gehört in den UI-/API-Vertrag. UTC-Offsets und Sommerzeitwechsel dort ausdrücklich prüfen. Der Tilelayer bleibt von der fachlichen Eventsuche getrennt, sodass ein späterer Anbieterwechsel die Teilnahme nicht verändert.
