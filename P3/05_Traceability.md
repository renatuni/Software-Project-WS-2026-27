# SportMate P3: Traceability von Anforderungen zum Entwurf

Stand: 27.10.2026 · Präsentation: 28.10.2026 · Status: Arbeitsentwurf zur Teamprüfung

## 1. Zweck und Leseregel

Diese Dokumentation verbindet die Anforderungen mit konkreten Komponenten, Operationen und Datenobjekten des P3-Entwurfs. Sie trennt den **geplanten Produktentwurf**, den **lokalen Klickprototyp** und einen späteren **Produktnachweis**. Ein SQL-Entwurf oder ein klickbarer Button belegt keine erfolgreiche Supabase-Integration. Es liegen weder ein bestehendes Anwendungsrepository noch ein CI-Bericht, API-Sicherheitstest oder Datenbank-Paralleltest in den Quellen vor.

Die vollständige maschinenlesbare Matrix steht in [traceability.csv](traceability.csv). Sie enthält **81 eindeutige Anforderungszeilen: 43 DR, 8 NFR und 30 SM-R**. Die Originalanforderungen bleiben unter ihren bisherigen IDs erhalten. Die Verwandtschaftsspalte bezeichnet thematische Beziehungen, keine bestätigte Gleichwertigkeit. Einzelne IDs aus beiden Katalogen widersprechen sich; das Konfliktregister in [06_Quellen_Scope_und_offene_Punkte.md](06_Quellen_Scope_und_offene_Punkte.md) hält die Unterschiede und P3-Arbeitsentscheidungen fest.

**Quellenbasis:** Der DR-/NFR-Katalog in `Dokumentationen/SportMate – Anforderungen.docx` passt mit 17 Stories, 43 funktionalen Detailanforderungen und 8 Qualitätsanforderungen zur final vorliegenden P2-PDF. `Interviews/02_Anforderungen.md` ist ein paralleler älterer Entwurf mit 30 SM-R und 60 Akzeptanzkriterien. Seine Story- und Epic-IDs sind ein eigener Namensraum: Beispielsweise bezeichnet E5 dort Qualität/Betrieb, im DR-Katalog dagegen Buchungsanfragen. IDs werden deshalb nur zusammen mit ihrem Katalog verwendet.

## 2. Verwendete Realisierungsanker

| Komponente | Verantwortung | Konkrete geplante Anker |
|---|---|---|
| C1 Browser/UI | Suchen, Details, Eingaben, verständliche Zustände | Lokale Demo `prototyp/index.html`, später Next.js-Ansichten und Formulare |
| C2 Next.js Server | Verifizierte Identität, validierte Befehle, fachliche Regeln | AuthService.getVerifiedUser, ProfileService.saveProfile, EventService.createEvent/updateEvent/cancelEvent/searchEvents, ParticipationService.joinEvent/leaveEvent/getParticipants |
| C3 Supabase Auth | Echte Konten, Passwortprüfung, verifizierbare Sitzung | Supabase Auth, Auth-Konfiguration; im Klickprototyp durch Demoidentität ersetzt |
| C4 PostgreSQL | Dauerhafte Konsistenz, Zugriffsschutz, atomare Operationen | profiles, profile_sports, sports, venues, events, participations, notifications; public.create_event/join_event/leave_event/update_event/cancel_event, RLS |
| C5 Kartenintegration | Geografische Karte, klickbare Sportmarker und Eventpunktwahl; GPS/Geocoding/Radius später | Leaflet 1.9.4 lokal in C1, OSM-Kachelservice online; schematische Offlinekarte und Liste als Fallback |

Die oben genannten TypeScript-Services sind Modulverantwortlichkeiten im Entwurf, keine bereits vorhandenen Quelldateien. Der SQL-Entwurf steht in [datenmodell/schema.sql](datenmodell/schema.sql). Konkrete Routen und Datentypen beschreibt [03_Detailentwurf_und_Schnittstellen.md](03_Detailentwurf_und_Schnittstellen.md), Entitäten und Integritätsregeln [04_Datenmodell.md](04_Datenmodell.md). Buchungsanfragen und Bewertungen besitzen **keine produktive SQL-/Serviceimplementierung** in diesem Paket.

### Kartenrealisierung seit 27.10.2026

Der Nutzer hat die visuelle Kartenwahl ausdrücklich beauftragt. DR-2.1.3 und SM-R03 besitzen nun einen lokalen Realisierungsanteil: `search()` liefert dieselben Events für Karte und Liste, `SportMateMap.render()` zeichnet Marker aus `latitude/longitude`, Auswahl öffnet `details()`. `SportMateMap.chooseLocation()` setzt beim Erstellen den Eventpunkt. Der geografische OSM-Hintergrund ist online verfügbar, die eigene schematische Offlinekarte benötigt keine Tiles. Dies ist ein Teil von T12, kein Nachweis für GPS, Geocoding, Radius, Serverpersistenz oder Lastziele. Am 27.10. wurden laut Prüfprotokoll 08 die geografischen Tiles und drei Sportmarker, Markerpopup/Details, Badmintonfilter mit einem Marker/einem Listeneintrag, Beitreten/Abmelden, Erstellung mit Kartenpunkt und Offlineumschaltung geprüft. Die zusätzliche P10/P11-Logikprüfung umfasst Beispielkoordinaten und `create()`-Validierung. Diese Teilnachweise ersetzen keine GPS-/Geocoding-/Radius-/Lasttests.

## 3. Durchgehendes Beispiel für die Präsentation

| Schritt | Nachvollziehbare Verbindung |
|---|---|
| Bedarf / Ursprung | U1–U3 berichten im vorhandenen Anforderungsdokument über fehlende Mitspieler. SIM-02-A1 ergänzt die hypothetische Kapazitätsregel; Simulation ist keine reale Validierung. |
| Anforderung | DR-4.1.3: „Ausgebucht“ verhindert weitere Teilnahme; NFR-5 und SM-R11 präzisieren den gleichzeitigen Zugriff. |
| Komponente und Schnittstelle | C1 sendet POST `/api/events/[id]/participation` an C2; C2 verwendet die verifizierte Nutzeridentität für C4. |
| Fachliche Operation | ParticipationService.joinEvent ruft public.join_event auf. Die DB sperrt die Eventzeile, prüft Status, Beginn und Kapazität und fügt höchstens eine Teilnahme ein. |
| Datenregel | PK(event_id,user_id) verhindert Doppelteilnahmen. Die Prüfung und Änderung erfolgen in derselben Transaktion unter konsistenter Sperrreihenfolge. |
| Lokale Demonstration | Ein ausgebuchtes Beispielevent zeigt „Ausgebucht“. Ein weiterer Klick erzeugt keine zusätzliche lokale Teilnahme. |
| Noch erforderlicher Produktnachweis | T06 sendet zwei gleichzeitige echte DB/API-Anmeldungen auf den letzten Platz. Erwartet: genau eine neue Teilnahme, Kapazität eingehalten. Dieser Test ist offen. |

## 4. Vollständige DR-Matrix

Die angegebene P3-Demoabdeckung ist eine Zuordnung von Demonstrationsmöglichkeiten. Ein bestandenes Testergebnis benötigt ein gesondertes Ausführungsprotokoll mit Datum, Build und tatsächlichem Ergebnis. „Lokal“ bezieht sich ausschließlich auf Browserdaten und kann keine Servergarantie belegen.

| ID | Gegenstand | Komponenten / Realisierungsanker | Verwandte IDs | Test / P3-Stand |
|---|---|---|---|---|
| DR-1.1.1 | Konto mit E-Mail/Passwort | C1 C2 C3 · AuthService / Supabase Auth | SM-R01 | T16 · Demoidentität ersetzt keine Registrierung |
| DR-1.1.2 | Passwort mindestens 8 Zeichen | C1 C2 C3 · AuthService / Auth-Konfiguration | SM-R01 | T16 · Offen; P3-Vorschlag 12 Zeichen, Konflikt F04 |
| DR-1.1.3 | Bereits registrierte E-Mail ablehnen | C2 C3 · Supabase Auth / allgemeine Fehlermeldung | SM-R01 | T16 · Offen; Wortlautkonflikt F04 |
| DR-1.1.4 | Anmeldung vor schreibender Aktion | C1 C2 C3 · AuthService.getVerifiedUser | SM-R01 SM-R21 | T03 T09 · Im Klickpfad demonstrierbar; echte Sitzung offen |
| DR-1.2.1 | Eine oder mehrere Profilsportarten | C1 C2 C4 · ProfileService.saveProfile / profile_sports | SM-R02 | T16 · Kein bearbeitbares Profil in der Demo |
| DR-1.2.2 | Niveau je Profilsportart | C1 C2 C4 · ProfileService.saveProfile / profile_sports.level | SM-R02 | T16 · Schemaentwurf; UI offen |
| DR-1.2.3 | Nur Altersgruppe öffentlich | C1 C2 C4 · profiles.age_group / begrenzte DTOs | SM-R02 SM-R22 | T10 T16 · Schemaentwurf; Veröffentlichung zu prüfen |
| DR-2.1.1 | Karte am freigegebenen Standort zentrieren | C1 C5 · Kartenadapter / freiwillige Browser-Geolocation | SM-R03 SM-R06 | T12 · Geografische Karte vorhanden; GPS-Zentrierung offen |
| DR-2.1.2 | Ortsname statt GPS möglich | C1 C2 C5 · Kartenadapter / Geocoding-Schnittstelle | SM-R06 SM-R22 | T12 · Manuelle Eventpunktwahl vorhanden; Ortsnamen-Geocoding/Suchzentrum offen |
| DR-2.1.3 | Zukünftige Treffen im Umkreis als Sportsymbole | C1 C2 C4 C5 · EventService.searchEvents / Kartenadapter | SM-R03 SM-R04 | T01 T12 · Klickbare Sportmarker und Liste synchron; echter Umkreisfilter offen |
| DR-2.1.4 | Treffen ab Endzeit von Karte entfernen | C1 C2 C4 C5 · EventService.searchEvents / Zeitfilter | SM-R03 | T01 T12 · Marker/Liste schließen begonnene Treffen aus; P3-Abweichung F03 |
| DR-2.2.1 | Mehrere Sportarten mit ODER filtern | C1 C2 C4 · EventService.searchEvents / sports | SM-R04 | T01 · Einzelne Sportart filtert Karte/Liste; Mehrfach-ODER offen |
| DR-2.2.2 | Heute/Morgen/Woche/freies Datum | C1 C2 C4 · Suchformular / EventService.searchEvents | SM-R04 | T01 · Vollständige Datumsvarianten noch zu prüfen |
| DR-2.2.3 | Keine Treffer und Erstelllink | C1 C2 · Suchansicht / Leerzustand | SM-R28 | T01 · Leerzustand für Liste und Marker; Erstellaktion vorhanden |
| DR-2.3.1 | Niveaufilter einschließlich Alle Niveaus | C1 C2 C4 · EventService.searchEvents / events.level | SM-R05 | T01 · Niveaufilter wirkt auf Karte und Liste |
| DR-2.3.2 | Altersgruppenfilter einschließlich ohne Angabe | C1 C2 C4 · EventService.searchEvents / events.age_group | SM-R05 | T01 · Entwurf; Demo-Abdeckung separat prüfen |
| DR-2.4.1 | Radius 2/5/10/20 km, Standard 5 | C1 C2 C5 · Suchformular / Radiusprüfung | SM-R04 SM-R06 | T12 · Offen; kein echter Umkreisfilter |
| DR-2.5.1 | Vollständige Treffendetails | C1 C2 C4 · Event-Detailansicht / events / participations | SM-R05 | T02 · Details mit Beispieldaten demonstrierbar |
| DR-2.5.2 | Navigation in externer Karten-App | C1 C5 · Kartenadapter / URL mit Eventkoordinaten | SM-R05 | T12 · Offen |
| DR-3.1.1 | Treffen anlegen, Kapazität 2–50 | C1 C2 C4 · EventService.createEvent / create_event / events | SM-R07 | T04 · Lokale Erstellung mit per Kartenklick gesetztem Eventpunkt; Serverentwurf |
| DR-3.1.2 | Optionale Altersgruppe/Niveau/Beschreibung ≤300 | C1 C2 C4 · EventService.createEvent / events | SM-R07 SM-R23 | T04 · Feldumfang der Demo getrennt prüfen |
| DR-3.1.3 | Fehlende Pflichtfelder verhindern Veröffentlichung | C1 C2 C4 · Formvalidierung / create_event / CHECK | SM-R07 SM-R23 | T04 · Lokale Validierung demonstrierbar; API offen |
| DR-3.1.4 | Vergangener Beginn abgewiesen | C1 C2 C4 · EventService.createEvent / create_event | SM-R07 SM-R23 | T04 · Lokal demonstrierbar; Serverentwurf |
| DR-3.1.5 | Ersteller automatisch erste Teilnahme | C2 C4 · create_event / participations | SM-R07 SM-R10 | T04 · P3 folgt DR; bewusste SM-Abweichung F02 |
| DR-3.2.1 | Sucht Mitspieler unter Mindestzahl | C1 C2 C4 · events.min_participants / abgeleiteter Status | SM-R05 | T13 · Entwurf; kein zusätzlicher gespeicherter Eventstatus |
| DR-3.2.2 | Findet statt ab Mindestzahl und Hinweis | C1 C2 C4 · join_event / notifications / abgeleiteter Status | SM-R14 | T13 · Status/Hinweis fachlich zu prüfen |
| DR-3.2.3 | Hinweis 2 Stunden vor Beginn bei Unterbelegung | C2 C4 · Geplanter Scheduler / notifications | SM-R14 | T13 · Nicht im Kernschema implementiert |
| DR-3.3.1 | Zeit-/Ortänderung informiert alle Teilnehmenden | C1 C2 C4 · EventService.updateEvent / update_event / notifications | SM-R08 SM-R14 | T08 T13 · Änderungshinweise als Serverentwurf |
| DR-3.3.2 | Absage entfernt Treffen und informiert Teilnehmer | C1 C2 C4 · EventService.cancelEvent / cancel_event / notifications | SM-R09 SM-R14 | T08 T13 · Lokale Absage; echte Hinweise offen |
| DR-4.1.1 | Beitreten bei freier Kapazität | C1 C2 C4 · ParticipationService.joinEvent / join_event | SM-R10 | T05 T06 · Lokal demonstrierbar; DB-Prüfung offen |
| DR-4.1.2 | Zahl erhöhen und Meine Treffen anzeigen | C1 C2 C4 · join_event / participations / Meine Treffen | SM-R10 | T05 · Lokaler Teilnahmestatus demonstrierbar |
| DR-4.1.3 | Ausgebucht verhindert Beitritt | C1 C2 C4 · join_event / Event-Zeilensperre | SM-R11 | T05 T06 · Lokaler Vollzustand; keine Parallelitätsgarantie |
| DR-4.1.4 | Keine Mehrfachteilnahme | C2 C4 · join_event / PK(event_id,user_id) | SM-R10 SM-R11 | T05 T06 · Lokale Wiederholung; DB-Constraint entworfen |
| DR-4.2.1 | Absage gibt Platz frei und informiert Ersteller | C1 C2 C4 · ParticipationService.leaveEvent / leave_event / notifications | SM-R12 | T07 T13 · Lokal Abmelden; Hinweis offen; Org-Sperre F02 |
| DR-4.3.1 | Organisator binnen 60s über Beitritt informieren | C2 C4 · join_event / notifications; Zustellkonzept offen | SM-R14 | T13 · Keine gemessene Zustellfrist |
| DR-5.1.1 | Nur vollständige Hallenanfrage absenden | C1 C2 C4 · Geplanter Buchungsmodul-Entwurf / booking_requests | SM-R16 | T14 · Optionaler Pilot; keine Implementierung |
| DR-5.1.2 | Anfrage-Ende nach Beginn | C1 C2 C4 · Geplanter Buchungsmodul-Entwurf / Intervallprüfung | SM-R16 SM-R23 | T14 · Optionaler Pilot; keine Implementierung |
| DR-5.1.3 | Betreiber erhält Anfrage-E-Mail | C2 · Geplanter E-Mail-Adapter | SM-R16 SM-R26 | T14 · Nicht im Kernschema; Kanalentscheidung F05/F06 |
| DR-5.2.1 | Angefragt ist keine verbindliche Buchung | C1 C2 C4 · Geplanter Buchungsstatus | SM-R16 | T14 · Optionaler Pilot; nur Zustandsentwurf |
| DR-5.2.2 | Nur Betreiber bestätigt | C2 C4 · Geplante Betreiberautorisierung | SM-R17 SM-R21 | T09 T14 · Optionaler Pilot; Rollenverfahren offen |
| DR-5.3.1 | Bestätigen/Ablehnen per E-Mail-Link ohne Konto | C2 · Geplanter kurzlebiger Aktionstoken | SM-R17 SM-R21 | T09 T14 · Could; Konflikt mit Betreiber-Konto, F06 |
| DR-5.4.1 | Richtpreis mit Angebotsvorbehalt | C1 C2 C4 · Geplante Konditionenansicht | SM-R15 | T14 · Could; Preislogik unterscheidet sich, F06 |
| DR-5.4.2 | Hallen-/Stornoregeln vor Absenden bestätigen | C1 C2 C4 · Geplante Konditionskopie / Zustimmung | SM-R15 SM-R16 | T14 · Optionaler Pilot; keine Implementierung |

## 5. Vollständige Qualitätsmatrix

| ID | Ziel laut Ausgangsquelle | Komponenten / Realisierungsanker | Verwandte IDs | Test / P3-Stand |
|---|---|---|---|---|
| NFR-1 | Neue Nutzer müssen ohne Hilfe in höchstens 2 Minuten ein passendes Treffen finden und beitreten können. | C1 · Kernablauf Suche/Details/Teilnahme | SM-R25 | T11 · Nutzertest mit mindestens 4 von 5 Personen; nicht ausgeführt |
| NFR-2 | Das Erstellen eines Treffens muss in höchstens 6 Eingabeschritten möglich sein. | C1 · Erstellformular | SM-R07 SM-R25 | T04 T11 · Klickpfaddefinition und Messung offen |
| NFR-3 | Alle Kernabläufe müssen ab 360 px Bildschirmbreite ohne horizontales Scrollen bedienbar sein. | C1 · Responsive Oberfläche | SM-R25 | T11 · 360px- und Tastaturprüfung offen |
| NFR-4 | Die Karte mit bis zu 100 Treffen muss über 4G in höchstens 3 Sekunden geladen sein. | C1 C2 C4 C5 · Kartenansicht einschließlich Daten/Tile-Laden | SM-R24 | T15 · Keine Messung; SM-R24 misst andere Systemgrenze |
| NFR-5 | Ein Platz in einem Treffen darf auch bei gleichzeitigem Beitritt nie doppelt vergeben werden. | C2 C4 · join_event / FOR UPDATE / Unique-Key | SM-R11 | T06 · Echter DB-Paralleltest offen |
| NFR-6 | Eine Hallenzeit darf nie zweimal den Status Bestätigt haben. | C2 C4 · Geplante Intervallkonfliktprüfung | SM-R18 | T14 · Optionaler Pilot; nicht implementiert |
| NFR-7 | An Betreiber dürfen nur Name und Kontakt der verantwortlichen Person gehen, keine Daten weiterer Teilnehmender. | C2 C4 · Geplantes Anfrage-DTO / E-Mail-Inhalt | SM-R13 SM-R22 | T10 T14 · Optionaler Pilot; Datenschutzprüfung offen |
| NFR-8 | Jede Must-Story muss durch mindestens einen automatisierten Test (Vitest oder Playwright) abgedeckt sein. | C1 C2 C4 · Geplante Vitest/Playwright-Tests und CI | SM-R30 | T17 · Lokale Demo-Checks ersetzen keine vollständige Story-/CI-Abdeckung |

## 6. Vollständige SM-R-Matrix

Jede Zeile verweist zusätzlich auf die bereits vorhandenen Kriterien `<ID>-AK1` und `<ID>-AK2` im ursprünglichen SM-Katalog. Die 60 Kriterien werden nicht umnummeriert. Wo der P3-Arbeitsentwurf bewusst abweicht, kann das ursprüngliche Kriterium erst nach fachlicher Aktualisierung als Abnahmekriterium verwendet werden.

| ID | Gegenstand | Komponenten / Realisierungsanker | Beziehung zum DR-/NFR-Katalog | Test / P3-Stand |
|---|---|---|---|---|
| SM-R01 | Konto und Anmeldung | C1 C2 C3 · AuthService / Supabase Auth | DR-1.1.1–4 | T03 T16 · Demoidentität, echte Authentifizierung offen |
| SM-R02 | Öffentliches Kurzprofil | C1 C2 C4 · ProfileService.saveProfile / profiles / profile_sports | DR-1.2.1–3 | T10 T16 · Modellentwurf; Profilumfang F07 |
| SM-R03 | Events auf Karte und Liste | C1 C2 C4 C5 · EventService.searchEvents / Kartenadapter | DR-2.1.1–4 | T01 T12 · Geografische Karte mit Sportmarkern und synchroner Liste; Radius/API offen |
| SM-R04 | Sportart und Zeitraum filtern | C1 C2 C4 · EventService.searchEvents | DR-2.2.1–2, DR-2.4.1 | T01 T12 · Sportart/Niveau/Text synchron in Karte/Liste; Zeit/Radius offen |
| SM-R05 | Eventdetails und Spielniveau | C1 C2 C4 · Event-Detailansicht / events | DR-2.3.1–2, DR-2.5.1 | T02 · Details per Marker oder Liste; abgesagt ohne Join; API offen |
| SM-R06 | Suche ohne Standortfreigabe | C1 C2 C5 · Kartenadapter / manuelle Ortssuche | DR-2.1.2 | T12 · Karte ohne GPS bedienbar; Eventpunktwahl vorhanden, Geocoding/Suchpunkt offen |
| SM-R07 | Event veröffentlichen | C1 C2 C4 · EventService.createEvent / create_event | DR-3.1.1–5 | T04 · Lokale Erstellung mit Kartenpunkt; Kapazität/Org abweichend F01/F02 |
| SM-R08 | Event bearbeiten | C1 C2 C4 · EventService.updateEvent / update_event | DR-3.3.1 | T08 T09 · Server-/Datenmodell-Entwurf |
| SM-R09 | Event absagen | C1 C2 C4 · EventService.cancelEvent / cancel_event | DR-3.3.2 | T08 · Lokale Absage; persistenter Hinweis offen |
| SM-R10 | Event beitreten | C1 C2 C4 · ParticipationService.joinEvent / join_event | DR-4.1.1–2, DR-4.1.4 | T05 T06 · Lokaler Status; API/DB offen |
| SM-R11 | Kapazität bei Parallelzugriff | C2 C4 · join_event / Event-Zeilensperre / Unique-Key | DR-4.1.3–4, NFR-5 | T06 · SQL-Entwurf; keine Parallelitätsmessung |
| SM-R12 | Teilnahme absagen | C1 C2 C4 · ParticipationService.leaveEvent / leave_event | DR-4.2.1 | T07 · Lokal abmelden; Org kann nur absagen F02 |
| SM-R13 | Teilnehmerliste | C1 C2 C4 · get_participants / get_participant_count | DR-2.5.1, NFR-7 | T09 T10 · RLS/DTO-Entwurf; kein Servernachweis |
| SM-R14 | Änderungshinweise | C2 C4 · update_event / cancel_event / notifications | DR-3.2.2–3, DR-3.3.1–2, DR-4.3.1 | T13 · In-App-Konzept; Zustellzeit/Kanal offen F05 |
| SM-R15 | Sportstätten und Konditionen | C1 C2 C4 · Geplanter Konditionen-/Sportstättenentwurf | DR-5.4.1–2 | T14 · Optionaler Pilot; Preisabweichung F06 |
| SM-R16 | Buchungsanfrage senden | C1 C2 C4 · Geplanter booking_requests-Entwurf | DR-5.1.1–3, DR-5.2.1 | T14 · Optionaler Pilot; keine Schemaimplementierung |
| SM-R17 | Betreiberentscheidung | C1 C2 C4 · Geplante Betreiberentscheidung | DR-5.2.2, DR-5.3.1 | T09 T14 · Optionaler Pilot; Rollenverfahren offen F06 |
| SM-R18 | Buchungskonflikte | C2 C4 · Geplante atomare Intervallkonfliktprüfung | NFR-6 | T14 · Optionaler Pilot; kein Kalenderabgleich |
| SM-R19 | Anfrage zurückziehen | C1 C2 C4 · Geplanter Status zurückgezogen | Keine direkte DR-Entsprechung | T14 · Zusatzverfeinerung für optionalen Pilot |
| SM-R20 | Event mit Buchung verknüpfen | C1 C2 C4 · Geplante Event-Anfrage-Verknüpfung | Keine direkte DR-Entsprechung | T14 · Zusatzverfeinerung für optionalen Pilot |
| SM-R21 | Serverseitige Berechtigungen | C2 C3 C4 · AuthService.getVerifiedUser / RLS / RPC | DR-1.1.4, DR-5.2.2 | T09 · Nur Server-/SQL-Entwurf, Demo nicht sicherheitswirksam |
| SM-R22 | Standortdatensparsamkeit | C1 C2 C4 · Temporärer Suchpunkt / begrenzte DTOs / Loggingregeln | DR-1.2.3, NFR-7 | T10 T12 · Kein GPS; Marker lokal, OSM sieht IP/Kachelausschnitt; Serverlogs ungeprüft |
| SM-R23 | Eingaben und sichere Ausgabe | C1 C2 C4 · Formvalidierung / RPC-Validierung / Textausgabe | DR-3.1.3–4, DR-5.1.2 | T04 T10 · Lokale Eingabeprüfungen; Server offen |
| SM-R24 | Antwortzeit der Suche | C2 C4 · EventService.searchEvents / Messprofil Q1 | NFR-4 (andere Messgrenze) | T15 · Nicht gemessen, kein Ersatz für NFR-4 |
| SM-R25 | Tastaturbedienung und Mobilansicht | C1 · Semantische HTML-Bedienung / Responsive CSS | NFR-1–3 | T11 · Interaktions-/Geräteprüfung separat dokumentieren |
| SM-R26 | Fehler und Wiederholung | C1 C2 C4 · Fehler-DTO / Statusnachfrage / Wiederholungsregeln | Keine direkte DR-Entsprechung | T05 T07 T09 · Entwurf; Netzfehlerpfad nicht durch lokale Demo nachgewiesen |
| SM-R27 | Eventlink teilen | C1 C2 · Stabiler Eventlink / Auth-Rücksprung | Keine direkte DR-Entsprechung | T02 T03 · Geplanter Direktlink, Demo-Abdeckung separat prüfen |
| SM-R28 | Keine Treffer | C1 C2 · Suchansicht / getrennte Leer-/Fehlerzustände | DR-2.2.3 | T01 · Lokaler Leerzustand; API-Ausfall offen |
| SM-R29 | Bestätigte Buchung stornieren | C1 C2 C4 · Geplanter Stornoablauf mit Betreiberabschluss | DR-5.4.2 (nur Konditionen) | T14 · Zusatzverfeinerung, optionaler Pilot |
| SM-R30 | Reproduzierbarer Start | C1 C2 C3 C4 · Startanleitung / Testdaten / geplanter CI-Workflow | NFR-8, C-2 | T17 · Lokaler Start; geografische Tiles per HTTP/Internet, Schemafallback offline |

## 7. Konkreter Prüfplan

Der folgende Katalog beschreibt die vollständigen Nachweise für die Produktanforderungen. **Diese vollständigen Produktprüfungen sind noch offen.** Für die lokale Demo wurden separat P01–P11 aus `prototyp/test.js` ausgeführt und als bestanden gemeldet. Deren Bezug ist in der CSV unter `demo_funktionen` und `lokaler_check` enthalten. Details und Browserprüfungen stehen in [08_Pruefprotokoll.md](08_Pruefprotokoll.md). Ein lokaler Check erfüllt nur den tatsächlich geprüften Teil eines Testziels, keine Server-, Datenbank- oder Nutzerprüfung.

| Ausgeführte lokale Prüfgruppe | Beitrag zum vollständigen Testziel | Verbleibende Grenze |
|---|---|---|
| P01 search | T01: Textsuche, einzelne Sportart, Niveau einschließlich Alle, leere Ergebnismenge | P01 allein prüft keine Kartenoberfläche; Kartenabgleich separat in 08. Mehrfachsportarten, Datum/Radius/API-Ausfall offen |
| P02 requireUser/create/join | T03: Gastmutationen in lokaler Logik abweisen | Keine echte Anmeldung oder Server-Sicherheitsgrenze |
| P03 join/search/status | T05: Beitritt, Meine Treffen, Doppelaufruf; T13: abgeleiteter Mindestzahlstatus | Keine Benachrichtigung oder DB-Transaktion |
| P04 join | T05: Vollzustand und sequenzielle Vergabe des letzten Platzes | T06 echte Parallelität bleibt vollständig offen |
| P05 leave | T07: Platz freigeben und Org-Austritt verhindern | Keine echte Eigentumsprüfung am Server; Wiederholungsaufruf separat prüfen |
| P06 create/status | T04: Erstellung mit Org-Teilnahme; T13: Sucht-Mitspieler-Status | Keine Speicherung in PostgreSQL |
| P07 create | T04: ausgewählte Pflichtfeld-, Längen-, Kapazitäts- und Zeitfehler | Keine vollständige API-/DB-Validierungsabdeckung |
| P08 cancel/search/join | T08: lokale Orgprüfung, Absage, Suchausschluss und Join-Sperre | Keine echte RLS-Prüfung, keine Änderungshinweise |
| P09 search/join | T01/T05: begonnene Treffen aus Suche und Join ausschließen | Keine Zeitzonen-/DST-Integration oder Kartenprüfung |
| P10 seed | T12: Drei unterschiedliche endliche Flensburger Beispielkoordinaten | Keine GPS- oder Kartenrendererprüfung |
| P11 create | T04/T12: gültige Koordinaten speichern, fehlende/ungültige Werte abweisen | Keine Geocoding-/Radius-/Serverprüfung |

Die bisherigen Fachlogikchecks verwenden den Testzeitpunkt 26.10.2026 und benötigen Node ohne zusätzliche Installation. Tatsächlicher Ausführungstermin und ergänzte Koordinaten-/Kartenprüfungen am 27.10.2026 stehen in 08. Sie sind in einem separaten Namensraum P01–P11 geführt; T01–T17 bleiben die umfassenderen Testziele.

| Test | Testdaten und Ablauf | Erwartetes Ergebnis | Ausführung / Grenze |
|---|---|---|---|
| T01 Suche/Filter/Leerzustand | Zukünftiges Basketball- und Fußballtreffen anlegen; Basketball wählen; anschließend Kombination ohne Treffer wählen; einen Zeitpunkt exakt an der Intervallgrenze prüfen. | Nur passende Ergebnisse; Grenzen gemäß bestätigter Suchregel; expliziter Leerzustand. Mehrfachsportarten und alle DR-Zeiträume getrennt prüfen. | Lokale Logik teilweise prüfbar; echte Such-API, Radius und alle Varianten offen. |
| T02 Details/Direktlink | Beispielevent mit Treffpunkt, Zeiten, Niveau, Altersgruppe und 7/10 Plätzen öffnen; abgesagtes und unbekanntes Event per Link aufrufen. | Vollständige Details; abgesagt ohne Join; unbekannte ID mit verständlicher Meldung. | Details lokal prüfbar; reale Links/Serverantworten gesondert offen. |
| T03 Anmeldung/Schreibsperre | Als Gast „Bin dabei“/„Treffen erstellen“ auslösen, dann Demoidentität wählen. Später ohne gültige Sitzung direkt POST an API senden. | UI fordert Anmeldung; danach ursprünglichen Vorgang fortsetzen. API verweigert Gastmutation unabhängig von UI. | Demoidentität ist nur Interaktion; API-/Sessionnachweis offen. |
| T04 Erstellen/Validierung | Gültiges Treffen morgen 18–20 Uhr mit Kapazität 10 und gültigem per Karte gewähltem latitude/longitude-Paar erstellen; Koordinate entfernen oder latitude=91 setzen; Pflichtfeld entfernen; Ende vor Beginn; vergangener Beginn; Kapazität 1 und 51; Beschreibung über 300 Zeichen. | Genau ein Event und automatische Org-Teilnahme bei gültigen Daten. Ungültige Daten erzeugen kein Event. Grenzwerte 2 und 50 zulässig. | Lokale Validierung prüfbar; DB-/API-Verhalten offen. |
| T05 Beitreten/Voll/Doppelaufruf | Beispiel mit 9/10 Plätzen als neues Konto beitreten; erneut senden; als weiteres Konto auf volles Event zugreifen. | Erst 10/10, dann unverändert; zweite Teilnahme desselben Kontos unmöglich; volles Event weist ab. | Lokaler Ablauf prüfbar; beweist keine Parallelitätsfestigkeit. |
| T06 Echter Parallel-/Integritätstest | Zwei verschiedene verifizierte Konten gleichzeitig per API/SQL-RPC auf 9/10 anmelden. Danach doppelte direkte INSERTs, ungültige user_id und Kapazitätsänderung gleichzeitig versuchen. | Genau eine neue Teilnahme. Kein Bypass von RPC/RLS/PK. Zählung überschreitet Kapazität nicht. | Geplant in isolierter Supabase-Testumgebung, nicht durch Klickdemo erfüllt. |
| T07 Eigene Absage | Eigene Teilnahme an 10/10 absagen, erneut absagen; fremde Teilnahme zu verändern versuchen; Organisator normal abmelden. | 9/10 bleibt stabil; nur eigener Platz betroffen; Org-Abmeldung abgewiesen und Eventabsage angeboten. | Eigene lokale Absage prüfbar; API/Eigentum offen. Org-Regel ist P3-Arbeitsentscheidung. |
| T08 Änderungen/Eventabsage | Als Org Kapazität bei 7 aktiven Teilnahmen auf 6 senken; Ort ändern; Event absagen; Absage wiederholen; als anderer Nutzer bearbeiten. | Unzulässige Senkung abgewiesen; erlaubte Änderung konsistent; abgesagtes Event fehlt in Suche und sperrt Join; keine doppelte Hinweisserie. | Lokale Absage prüfbar; Update-/Hinweis-/API-Nachweise offen. |
| T09 Identität/RLS/Fehlerpfad | Konto B ändert Event von A direkt per HTTP/RPC, vergibt sich Betreiberrolle, liest unberechtigte Teilnehmerliste. Nach erfolgreichem Join Antwort verlieren lassen, dann Status abfragen. | Jeder unberechtigte Zugriff abgewiesen; keine Zustandsänderung. Bei unklarem Ergebnis Statusnachfrage statt vorschneller Erfolgsanzeige. | Geplanter Integrationstest; UI-Ausblenden genügt nicht. |
| T10 Private Daten/sichere Ausgabe | Öffentliche Profil-/Teilnehmerantworten untersuchen; Suchpunkt setzen und Logs/Persistenz prüfen; Beschreibung mit `<script>alert(1)</script>` anzeigen. | Kein Geburtsdatum, private E-Mail, fremde Teilnehmernamen oder Suchverlauf öffentlich. Skript bleibt Text. Betreiber erhält nur zulässige Kontaktdaten. | Lokale Textausgabe prüfbar; Server-, Log-, E-Mail- und RLS-Prüfung offen. |
| T11 Bedienbarkeit/Responsivität | Kernablauf bei 360 CSS-px und langem Titel, per Tab/Shift-Tab/Enter/Leertaste. Später 5 neue Personen ohne Hilfe suchen/beitreten lassen und Zeiten messen. | Kein horizontales Seitenscrollen; Fokus sichtbar und sinnvolle Reihenfolge. Mindestens 4/5 schaffen ≤2min; Erstellen ≤6 definierte Schritte. | Technische UI-Prüfung und echter Nutzertest getrennt protokollieren; keine Personentests behauptet. |
| T12 Karte/GPS/Ortsfallback | Aktuell: geografische Karte, Sportmarker, Zoom/Verschieben, Trefferansicht, Filter-/Listenabgleich, Eventpunktwahl und Kachelausfall prüfen. Später: GPS, Ortsnamen, Suchpunkt sowie Events auf 4/5/6-km-Rand vergleichen. | Marker passen zur Liste, öffnen dasselbe Event, neue Punkte erscheinen korrekt. Schematische Offlinekarte bleibt nutzbar. GPS-/Geocoding-/Radiusregeln später wie spezifiziert. | Kartenanteil lokal umgesetzt, konkrete Teilnachweise siehe 08. GPS, Geocoding, Suchradius und echte Such-API offen. |
| T13 Mindestzahl/Hinweise | min=4, count 3→4→3; Ort-/Zeitänderung und Absage bei drei Angemeldeten; Replay derselben Operation; 2h-vor-Beginn-Job; 60s-Frist messen. | Fachlich bestätigter Status, genau ein Hinweis je Person und Änderung, keine Doppelerzeugung; Frist und Kanal gemäß Teamentscheidung. | SQL-/Fachentwurf; Scheduler, Zustellung und Zeitmessung offen. |
| T14 Buchungspilot | Vollständige Anfrage und unvollständige Daten; zwei überlappende sowie angrenzende Intervalle; falscher Betreiber; Rücknahme/Bestätigung gleichzeitig; bestätigte Buchung stornieren. | Anfrage bleibt unverbindlich; nur berechtigter Betreiber bestätigt; keine internen Überschneidungen; angrenzende Intervalle erlaubt; Storno gibt erst nach Abschluss frei. | Ausschließlich geplanter Test für späteren Pilot; keine Buchungsimplementierung. |
| T15 Performance | NFR-4 mit 100 Treffern/4G/Karte ≤3s separat von SM-R24: Q1, 1000 Events, 10 parallele Clients, 20 Warm-ups, 100 Messanfragen und p95 ≤2s messen. | Jeweils eigener Messbericht mit Umgebung und Build; eine absichtliche 3s-Verzögerung muss SM-Test fehlschlagen lassen. | Nicht gemessen; unterschiedliche Messgrenzen bleiben getrennt. |
| T16 Echte Auth/Profile | Neues Konto, Doppelregistrierung, schwaches Passwort, abgelaufene Sitzung, Profil mit mehreren Sportarten/Niveaus/Altersgruppe speichern und neu laden. | Gültiger Nutzerkontext, sichere Fehlermeldungen, persistentes Profil im bestätigten Umfang, keine privaten Daten in öffentlichen Antworten. | Geplant; Demoanmeldung ersetzt diesen Test nicht. |
| T17 Start/Automatisierung/CI | Andere Person folgt Startanleitung mit frischer Demo; Testdaten zurücksetzen und Kernablauf durchspielen. Später echte App ohne notwendige Konfiguration starten und Must-Story-Tests in CI ausführen. | Lokale Demo startet reproduzierbar. Echte App erklärt fehlende Konfiguration ohne Geheimnisse; CI ordnet jeder Must-Story mindestens einen Test zu. | Lokaler Start teilweise prüfbar; echte App-/CI-Abdeckung offen. |

### Protokollvorlage je Ausführung

```text
Test-ID / AK-ID:
Datum, prüfende Person:
Build oder Dateistand / Umgebung / Browser / Viewport:
Testdaten und Vorbereitung:
Tatsächliche Schritte:
Soll-Ergebnis:
Ist-Ergebnis und Beleg (Log/Screenshot/DB-Abfrage):
Ergebnis: bestanden / fehlgeschlagen / blockiert / nicht ausgeführt
Abgedeckte Schicht: lokale Demo / API / Datenbank / reales Nutzungsszenario
Abweichung / Defekt / nächster Schritt:
```

## 8. Regeln zur Fortschreibung

1. Vorhandene Anforderungs-IDs behalten. Fachliche Änderungen mit Datum, Grund und Teamentscheidung in der Quelle nachtragen.
2. Bei der Implementierung die Serviceverantwortung durch tatsächlichen Repositorypfad, Commit und Issue ergänzen. Hier genannte Service-/Routennamen sind Zielanker, keine Links auf vorhandenen Code.
3. Für jede umgesetzte Anforderung einen automatisierten oder manuellen Nachweis passend zum Risiko hinterlegen. Lokale UI-Checks nicht als Nachweis für RLS, Parallelität, E-Mail oder Performance verwenden.
4. Widersprüche zwischen den Katalogen auflösen, ursprüngliche Regel dokumentiert ersetzen und betroffene Akzeptanzkriterien anpassen. Insbesondere SM-R07 und T3 nicht unverändert für den DR-orientierten P3-Scope übernehmen.
5. Die CSV und diese Tabellen gemeinsam aktualisieren. Eine Story gilt erst nach Umsetzung, Review und bestandenem Abnahmenachweis als erledigt.
