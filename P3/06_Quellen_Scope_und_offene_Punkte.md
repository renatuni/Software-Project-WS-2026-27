# SportMate P3: Quellen, Umfang und offene Entscheidungen

Stand: 27.10.2026 · Präsentation: 28.10.2026 · Version 1.1 als Arbeitsentwurf

## 1. Einordnung des Pakets

P3 führt die vorhandenen Anforderungen und den bisherigen Architekturansatz zu einem konkreten Entwurf zusammen. Das Paket ergänzt Komponenten- und Verhaltensmodelle, einen Detailentwurf, ein relationales Datenmodell, einen SQL-Entwurf, eine Traceability-Matrix und einen lokal ausführbaren Klickprototyp. Die neue Ausarbeitung ist ein Vorschlag für die gemeinsame Umsetzung. Ihre Erstellung ersetzt weder eine fachliche Teamfreigabe noch einen Nachweis einer fertigen Next.js-/Supabase-Anwendung.

Die vier im Arbeitsauftrag aufgeführten P3-Kriterien stammen aus der Lehrveranstaltung. Die lokale Kursbeschreibung `Software_Project_WS_2026_27.pdf`, §6.4, enthält zusätzlich den Punkt **„Ein lauffähiger Prototyp wird demonstriert.“** Deshalb gehört eine kurze Live-Demonstration des lokalen Prototyps in den Vortrag. Der Prototyp zeigt einen Browserablauf mit Beispieldaten. Er belegt die Interaktion, lokale Regeln und die Browseranbindung des externen Kachelservices, jedoch keine Next.js-/Supabase- oder Datenbankintegration. Ob der Lehrende dafür bereits eine integrierte Zwischenversion erwartet, muss das Team vor dem Termin klären. Die Grenzen im Vortrag sichtbar benennen.

## 2. Quellenregister und Verwendungszweck

| ID | Vorliegende Quelle | Verwendeter Inhalt | Einordnung und Grenze |
|---|---|---|---|
| Q01 | `Software_Project_WS_2026_27.pdf`, besonders §§5, 6.1 und 6.4 | P3-Kriterien, Prototypdemo, Fortschritt/Tracking, Beteiligung des Teams | Lokale Kursvorgabe; Nutzer nennt Termin 28.10.2026. |
| Q02 | `SportMate P2 Präsentation.pdf` | Abschließender vorliegender P2-Erzählstand: 5 Epics, 17 Stories, 43 DR, 8 NFR; Karte als MVP-Ziel; Bewertungen und Buchungspilot als geplante Erweiterung | Ausgangsstand für P3. Die PDF enthält auch eine bildbasierte Architekturfolie; die technische Konkretisierung stammt aus Q04. |
| Q03 | `Dokumentationen/SportMate – Anforderungen.docx`, Stand 11.10.2026 | Ziele Z0–Z4, SH1–SH5, 17 Stories, DR-IDs, NFR-IDs, Randbedingungen C-1–4, Annahmen A-1–2 | Passt in Zählung und Kernumfang zu Q02. Einzelne Regeln sind Teamannahmen oder nur simuliert begründet. |
| Q04 | `Dokumentationen/Architektur & Entwurf.docx` und `Architektur.jpg` | Next.js/TypeScript, Supabase Auth/PostgreSQL, logische Schichten, serverseitige Regeln und RLS, Vercel geplant | Technischer Ausgangsentwurf. Detail-/Datenmodellkapitel waren noch leer; Karte dort optional, abweichend von Q02/Q03. |
| Q05 | `Interviews/02_Anforderungen.md`, Stand 10.10.2026 | 30 SM-R mit 60 Akzeptanzkriterien, technische Randfälle, optionaler Buchungsablauf | Paralleler Entwurf mit eigener Epic-/Storystruktur, ausdrücklich unfreigegeben/unvalidiert. Kein Ersatz für die 43 DR. |
| Q06 | `Interviews/03_Stakeholder_Rationale_Traceability.md` und `04_Interviewauswertung_und_Einfluss.md` | SIM-Aussagen, vorläufige Begründungen, T1–T7, D01–D09 | Herkunft von Hypothesen und Entwurfsregeln, kein empirischer Wirksamkeitsnachweis. |
| Q07 | `Interviews/interviews/SIM-01_Studentin.md`, `SIM-02_Organisator.md`, `SIM-03_Betreiberin.md` | Simulierte Anforderungen zu Niveau, Treffpunkt, Kapazität, Änderungen und Anfrageprozess | Vollständig KI-simuliert. Rollen sind fiktiv. |
| Q08 | `Interviews/interviews/Studentin Interview.docx` (SIM-04) und `Hallenbetreiberinterview.docx` (SIM-05) | Ergänzende Nutzer-/Betreiberhypothesen, E-Mail-Verfahren | Ebenfalls ausdrücklich simuliert, trotz Form eines Transkripts. Keine realen Gesprächspartner belegt. |
| Q09 | `Dokumentationen/SportMate – Umfrage- Gemeinsam Sport machen.csv` | 22 Fragen und 4 vorhandene Antwortzeilen, Grundlage U1–U4 | Reale Umfrage laut Q03. Sehr kleine Datenbasis; keine repräsentative Aussage oder Validierung von Bewertungen. Personenbezogene Antwortinhalte nicht in die Präsentation kopieren. |
| Q10 | `Dokumentationen/Anforderungen (Requirements Engineering).docx` | Methodik, neun Kandidaten K-01–K-09, Hinweise auf Simulation und offenen Abgleich | Teilweise älterer Zwischenstand: behauptet, der vollständige SM-Katalog liege nicht vor; dieser liegt inzwischen unter Q05 vor. Kandidaten lassen sich nun abgleichen. |
| Q11 | Vorliegende weitere P2-PPTX-Varianten im Wurzel-/Dokumentationen-Ordner | Ergänzender Kontext und frühere Präsentationsstände | Mehrere Dateien mit unterschiedlichen Zählungen/Schwerpunkten. Dateinamen allein beweisen keine inhaltliche Autorität. Q02/Q03 bilden gemeinsam die P3-Basis. |
| Q12 | `Dokumentationen/Implementierung.docx`, `Software Testing.docx`, `Projektmanagement.docx`, `Kundenfeedback.docx` | Vorgesehene Dokumentationsbereiche | Die knappen Vorlagen sind kein Nachweis vorhandenen Anwendungscodes, bestandener Tests, einer Commit-Historie oder eines realen Boards. |
| Q13 | Neu erstellte Dateien unter `P3/` | Konkrete Architektur-/Daten-/Schnittstellenentwürfe, lokaler Prototyp und Prüfprotokoll | Architekturstand vom 26.10., Kartenfortschreibung vom 27.10.2026. Die Realisierung einer Produktfunktion muss zusätzlich im Anwendungsrepository und mit passenden Tests nachgewiesen werden. |

**Q14, neuer Auftrag am 27.10.2026:** Der Nutzer verlangt die visuelle Treffenwahl über eine interaktive Karte. Dieses Produktziel ist bestätigt, ohne damit alle übrigen Fachvorschläge freizugeben. **Q15:** Leaflet Quick Start, OSM Tile Usage Policy und OSMF Privacy Policy ergänzen die technischen Primärquellen zur Browser-/Tilegrenze, siehe ADR-06.

Die Moodle-URL aus dem Arbeitsauftrag wurde nicht als zusätzlicher Inhaltsnachweis verwendet, da sie im verfügbaren Zugriff nicht lesbar war. Der lokale Kurs-PDF und die vom Nutzer zitierten Kriterien reichen als dokumentierte Arbeitsgrundlage aus.

## 3. Zählung und ID-Namensräume

Die funktionalen Detailanforderungen wurden anhand ihrer tatsächlichen ID-Zeilen in Q03 gezählt, nicht aus einer Präsentationszahl übernommen:

| Katalog | Umfang | Bedeutung für P3 |
|---|---|---|
| Q03 / DR | 5 Epics E1–E5, 17 User Stories US-1.1–US-5.4, 43 IDs DR-1.1.1–DR-5.4.2, 8 IDs NFR-1–NFR-8 | Fachlicher Ausgangsstand entsprechend finaler P2-PDF. Die ID-Bereiche sind lückenfrei gemäß den Unterkapiteln, keine fortlaufende 1–43-Nummerierung. |
| Q05 / SM-R | 3 Produktziele G1–G3, 5 anders geschnittene Epics E1–E5, 6 Stories US-01–US-06, 30 SM-R, 60 AK | Ergänzende Verfeinerung mit Sicherheits-/Konkurrenz-/Buchungsregeln. IDs behalten, Anforderungen bei Konflikt nicht stillschweigend gleichsetzen. |
| Q10 / Kandidaten | K-01–K-09 | Entstehungsspur der Simulationseinflüsse; durch den vollständigen SM-Katalog bereits thematisch abgedeckt, keine neun zusätzlich freigegebenen Produktanforderungen. |
| Q03 / Randbedingungen | C-1–C-4, A-1–A-2 | Gesondert in Abschnitt 6 zugeordnet. `C-1` mit Bindestrich ist eine Randbedingung; `C1` ohne Bindestrich bezeichnet die Browserkomponente. |

Die Traceability-Datei enthält **81 Zeilen** für die drei eigentlichen Anforderungskataloge DR/NFR/SM-R. Es wäre irreführend, daraus „81 unabhängige neue Anforderungen“ zu machen: Ein großer Teil beschreibt dieselbe Fachfunktion auf anderem Detailniveau.

### Abgleich der neun früheren Kandidaten

| Kandidat | Vorhandener konkreter Anker | Einordnung |
|---|---|---|
| K-01 Niveau | DR-2.3.1, DR-2.5.1, SM-R05 | Eventniveau und Filter im Entwurf. |
| K-02 Treffpunkt | DR-2.5.1, DR-3.1.1, SM-R05/07 | Strukturierter Ort und Treffpunkttext. |
| K-03 Suche ohne Standort | DR-2.1.2, SM-R06/22 | Manuelle Ortssuche; echte Integration offen. |
| K-04 Kapazität | DR-4.1.3/4, NFR-5, SM-R10/11 | Atomare Teilnahme in der DB erforderlich. |
| K-05 Änderungshinweise | DR-3.3.1/2, DR-4.3.1, SM-R14 | Hinweise im Datenentwurf, Zustellung/Frist offen. |
| K-06 Eventlink | SM-R27 | Ergänzende technische Anforderung, keine direkte DR-Entsprechung. |
| K-07 Anfrage statt Zusage | DR-5.2.1/2, SM-R16/17 | Optionaler Buchungspilot. |
| K-08 Verfügbarkeit | NFR-6, SM-R18 | Interne Konfliktprüfung getrennt von externem Kalender. |
| K-09 Konditionen | DR-5.4.1/2, SM-R15 | Unterschiedliche Preissemantik, siehe F06. |

## 4. Konfliktregister und P3-Arbeitsentscheidungen

**Die fachlichen Auflösungen bleiben Arbeitsvorschläge ohne behauptete Teamfreigabe. Ausnahme: Der Nutzer hat die interaktive Kartenwahl am 27.10.2026 ausdrücklich bestätigt.** Vor Beginn der Produktimplementierung müssen sie in den verbindlichen Anforderungskatalog übernommen und die betroffenen AK aktualisiert werden.

| ID | Unterschied der Quellen | Arbeitsentscheidung für P3 | Konsequenz / noch zu entscheiden |
|---|---|---|---|
| F01 Kapazität | DR-3.1.1: 2–50. SM-R07/T3: 2–100. | P3 folgt DR/P2: 2–50 einschließlich der automatisch teilnehmenden Organisatorperson. | UI, API, SQL und Tests verwenden denselben Grenzwert. Ursprüngliche SM-Kriterien mit Kapazität >50 nicht unverändert übernehmen. |
| F02 Organisator | DR-3.1.5: automatisch erste Teilnahme. SM-Begriffe/T3: nur bei zusätzlicher eigener Anmeldung. | P3 erzeugt Event und Organisator-Teilnahme gemeinsam; kein normaler Austritt des Organisators, stattdessen Eventabsage. | Automatische Teilnahme folgt DR. Die Austrittssperre ist eine neue konkrete P3-Regel, fachlich zu bestätigen; späteren Eigentümerwechsel separat entwerfen. |
| F03 Suche/Beginn/Ende | DR-2.1.3 verlangt zukünftigen Beginn; DR-2.1.4 nennt Entfernung erst ab Endzeit. SM-R03 schließt gestartete Events aus. | P3 bietet nur noch nicht begonnene Events als öffentliche Suchtreffer und sperrt An-/Abmeldung ab Beginn. Historische eigene Events bleiben nachvollziehbar. | Sichtbarkeit laufender Events widerspruchsfrei entscheiden. Die P3-Regel ist enger als eine Karte, die laufende Treffen bis Ende zeigt. |
| F04 Auth/Passwort/Fehler | DR-1.1.2 fordert ≥8 Zeichen. SM-R01 verwendet 12 Zeichen im Positivbeispiel, definiert damit allein noch kein Mindestmaß. DR-1.1.3 nennt explizit eine bereits vorhandene E-Mail. | P3 empfiehlt für die spätere Auth-Konfiguration mindestens 12 Zeichen und eine allgemeine Registrierungsfehlermeldung. Die Demo enthält keine Passwortregistrierung. | Sicherheits-/Bedienentscheidung mit Team bestätigen und DR/Kriterien ändern. Auth-Providerverhalten und E-Mail-Bestätigung praktisch prüfen. Keine Behauptung, ≥12 sei bereits Quelle oder implementiert. |
| F05 Hinweise/Mindestzahl | DR enthält „Findet statt“, Mindestzahl, 2h-Erinnerung und Organisatorhinweis binnen 60s. SM-R14 spezifiziert dauerhafte In-App-Hinweise bei Änderungen, ohne dieselbe Frist/Zustellung. | `events.min_participants` und abgeleiteter Belegungsstatus; `notifications` als In-App-Basis. Keine Aussage über rechtzeitiges Lesen. | 2h-Job, Empfängerkreis bei Rückfall unter Mindestzahl und ein für kurzfristige Absagen geeigneter Kanal fehlen als geprüfte Implementierung. 60s-Ziel nicht als bestanden markieren. |
| F06 Buchungspilot | DR: Anfrage-E-Mail, optionales Bestätigen ohne Konto per Link, Richtpreis mit Angebotsvorbehalt. SM: zugeordneter Betreiber, Gesamtpreis/Konditionskopie, Rücknahme, Storno und atomare Überschneidungskontrolle. | P3 dokumentiert einen zusammenhängenden optionalen Pilot mit unverbindlicher Anfrage und berechtigter Betreiberentscheidung. Keine Buchungsimplementierung im Kernschema. | Partner, verbindlicher Preistyp, Kontomodell oder sichere Aktionstoken, E-Mail-Dienst, externe Kalenderprüfung und vollständige Stornoregel gemeinsam entscheiden. Teilimplementierung darf keine sichere Reservierung suggerieren. |
| F07 Profil | DR-1.2.1–3: mehrere Sportarten mit je Niveau und öffentlicher Altersgruppe. SM-R02: Anzeigename bis 5 Sportarten, öffentlich nur Name und Sportarten. | P3-Modell berücksichtigt Sportarten/Niveau/Altersgruppe; öffentliche DTOs geben nur tatsächlich benötigte Felder frei, niemals das Geburtsdatum. | Altersgruppe/Niveau als bewusst freizugebende Daten bestätigen. SM-R02-AK2 bleibt hinsichtlich privater Kontakte sinnvoll, der engere öffentliche Feldumfang ist zu aktualisieren. Maximal 5 Sportarten ist noch separate Entwurfsannahme. |
| F08 Karte | Q02/Q03: MVP/Must. Q04/Teile Q10: optional. | Nutzerauftrag vom 27.10.2026 bestätigt Kartenwahl. P3 verwendet Leaflet 1.9.4, geografische OSM-Kacheln, klickbare Sportmarker, synchrone Liste und Eventpunktwahl. | Schematische Offlinekarte bei Kachelausfall. GPS/Geocoding/Radius/Such-API und Anbieterbetrieb offen; Online-Tiles übertragen IP/Ausschnitt. |
| F09 Bewertungen | Q03: Won’t in Version 1, 0/4 Nennungen. Q02: neue geplante Erweiterung. | Bewertungen bleiben gekennzeichnete Erweiterung nach dem Kernablauf. | Kein empirisch bestätigter Bedarf. Bewertbarkeit, Missbrauch, Moderation und Datenbedarf vor Schema-/UI-Implementierung klären. |
| F10 Messgrenzen | NFR-4: komplette Karte mit bis 100 Events über 4G ≤3s. SM-R24: Such-API p95≤2s im Profil Q1, ohne Kartentiles. | Beide Ziele getrennt erhalten. | Zwei unterschiedliche Tests, keine gegenseitige Erfüllungsbehauptung. Tarif-/Latenz-/Lastgrenzen nicht ungeprüft übernehmen. |
| F11 Umfang/Versionsstände | Q02/Q03 nennen 43 DR/8 NFR; Q05 nennt 30 SM-R/60 AK. Q10 erklärt noch, der vollständige SM-Katalog fehle. | Beide Kataloge mit Herkunft behalten, Q02/Q03 als fachlichen Bezug verwenden. | Kein Löschen oder Umnummerieren ohne Teamentscheidung. Q10 später auf aktuellen Quellenstand bringen. |
| F12 Evidenz | Einige Zwischenstände sprechen allgemein von „Interviews“. SIM-01–05 sind fiktiv. Nur vier Umfrageantworten sind als reale Datenspur dokumentiert. | P3 kennzeichnet Quelle und Evidenzklasse einzeln. | Vortragsaussagen „Betreiber bestätigen“/„Nutzer wollen Bewertungen“ sind ohne neue reale Erhebung nicht gedeckt. |
| F13 Zeitdarstellung | SM-Zeitregel fordert eindeutigen UTC-Offset bei mehrdeutiger Uhrzeit. Die lokale Demo verwendet einfache lokale Browser-Datumsfelder. | Datenmodell verwendet timestamptz; UI-Anzeige soll Europe/Berlin eindeutig behandeln. | Sommer-/Winterzeit und mehrdeutige lokale Eingaben bleiben ein Testfall für die echte Anwendung, kein bewiesenes Demo-Verhalten. |

## 5. Umfang und Lieferstand

### Event-Kern im P3-Entwurf

Der Entwurf umfasst echte Authentifizierung, Profil mit Sportarten, Eventsuche samt Kartenadapter, Details, Erstellen und Ändern/Absagen eigener Events, Teilnahmeverwaltung und Zugriffsschutz. Er berücksichtigt Mindestteilnehmerzahl, transaktionale Kapazitätsprüfung und In-App-Hinweise. Diese Punkte haben unterschiedliche Realisierungsstände: Die Modellierung kann vorhanden sein, während die zugehörige Integration noch aussteht.

### Was die lokale Demo tatsächlich zeigt

`prototyp/index.html` mit `app.js` zeigt fiktive künftige Sporttreffen auf einer interaktiven Leaflet-Karte und in einer synchronen Liste. Online liefert OSM den geografischen Hintergrund. Klickbare Sportmarker öffnen ein Popup mit Detailsaktion. Text-, Einzel-Sportart- und Niveaufilter gelten für beide Ansichten. Dazu kommen Demoidentitäten, Beitreten/Abmelden, Vollzustand, Erstellung mit per Kartenklick gesetztem Punkt und automatischer Organisator-Teilnahme sowie Eventabsage. Koordinaten und Personen sind fiktive Flensburger Beispiele. Die Fachfunktionen heißen `seed`, `status`, `search`, `join`, `leave`, `cancel`, `create`; `SportMateMap.render()`, `SportMateMap.fitEvents()` und `SportMateMap.chooseLocation()` steuern die Kartendarstellung. `test.js` prüft lokale Logik, tatsächliche Ergebnisse stehen in 08.

Die Daten liegen nur im Arbeitsspeicher des geöffneten Browsers. Neuladen oder Zurücksetzen verwirft Änderungen. Es gibt keine echte E-Mail-/Passwortregistrierung, keine verifizierte Sitzung, keinen Server, keine RLS-Grenze, keine Supabase-Persistenz und keine nebenläufige Kapazitätskontrolle. Offen bleiben GPS/Geocoding, Radiusfilter, Zeitfilter, Altersgruppenfilter, bearbeitbare Profile, externe Benachrichtigungen, Buchungspilot und Bewertungen. Leaflet ist lokal eingebunden, nur der geografische Hintergrund benötigt Internet. Online-Tileabrufe übertragen IP-Adresse und Kachelausschnitt an OSM; kein GPS wird angefordert. Offline bleibt eine ausdrücklich schematische Ersatzdarstellung mit Markern/Liste nutzbar. Eventänderung als allgemeiner Bearbeitungsablauf ist ebenfalls noch kein Demo-Funktionsumfang.

Der Prüfnachweis steht in [08_Pruefprotokoll.md](08_Pruefprotokoll.md). Ausgeführte lokale Checks dürfen nur die dort genannte lokale Schicht belegen. Die Server-/Datenbanktests aus [05_Traceability.md](05_Traceability.md) bleiben offen, bis sie in einer echten Testumgebung durchgeführt werden.

### Geplante Erweiterungen

Buchungsanfragen werden als optionaler zusammenhängender Pilot beschrieben. Ein bestätigter Status verlangt eine berechtigte Betreiberentscheidung und interne Konfliktkontrolle. Eine Sportevent-Teilnahme reserviert keine Halle. Bewertungen sind eine neue Produktidee ohne Anforderungs-ID oder validierten Ablauf im vorliegenden DR-Katalog. Zahlung, automatische Direktbuchung, eigener Chat und Social Feed bleiben zurückgestellt.

## 6. Randbedingungen und Annahmen aus Q03

| ID | Ausgangsaussage | Einfluss auf den Entwurf | Offener Nachweis |
|---|---|---|---|
| C-1 | Personenbezogene Daten sollen laut Quelle DSGVO-konform gespeichert werden, mit Einwilligung und Löschmöglichkeit. | Datensparsame Felder, keine Speicherung des Suchverlaufs, getrennte Identität, begrenzte Ausgaben, geplanter Löschprozess. | Kein Nachweis rechtlicher Konformität. Löschregeln, Verantwortlichkeiten, Einwilligung/Informationspflichten und Dienstekonfiguration konkret prüfen. |
| C-2 | Mobile Web-App mit TypeScript, React und Supabase, vorbehaltlich Teamabgleich. | Next.js als gemeinsames TypeScript-/React-Projekt, Supabase Auth/PostgreSQL; HTML/JS-Demo nur als Interaktionsprototyp. | Reproduzierbares Next.js-Projekt mit fixierten Versionen und erfolgreicher Integration noch offen. |
| C-3 | Zweiwöchige Iterationen und feste Präsentationstermine. | Kleine umsetzbare Schritte, P3-Stand vom 27.10. für Termin 28.10.2026. | Tatsächlichen Sprintplan und Aufgabenstatus im realen Board zeigen. |
| C-4 | Vier Teammitglieder, kein Budget für kostenpflichtige Dienste. | Einfacher gemeinsamer App-Stack, keine Microservices; Tarif-/Dienstentscheidung vor Betrieb prüfen. | Aktuelle Limits/Kosten nicht aus früheren Freitarifannahmen ableiten; kein Preis-/Kostenversprechen. |
| A-1 | Die meisten Nutzer erlauben Standortfreigabe. | Standort bleibt freiwillig; manueller Ort/Suchpunkt und Liste als Fallback. | Annahme mit realen Personen validieren; Demo hat kein GPS. |
| A-2 | Betreiber akzeptieren E-Mail-Anfragen. | Optionaler Pilot lässt E-Mail-Kanal als Möglichkeit offen. | Nur SIM-05-basiert; tatsächlichen Partnerprozess vor Pilot festlegen. |

## 7. Entscheidungen vor der Produktimplementierung

| Priorität | Entscheidung / Arbeit | Benötigtes Ergebnis |
|---|---|---|
| Hoch | Offene F01–F08-Regeln als Team bestätigen | Konsistente Grenzwerte, Org-Regel, Sichtbarkeit und Auth-/Profil-/Hinweisregeln. Kartenproduktziel ist durch Nutzer bestätigt, Produktintegration bleibt Teamarbeit. |
| Hoch | Supabase-Projekt und Repository einrichten oder vorhandenen echten Stand bereitstellen | Versionierter App-Code, dokumentierte Umgebungsvariablen ohne Geheimnisse und nachvollziehbarer Start. |
| Hoch | SQL-Entwurf in isolierter Testumgebung prüfen | Migration, RLS-/Eigentumstests, atomarer Lastplatztest, Kapazitätsänderung und Berechtigungsbypass geprüft. |
| Hoch | UI mit echten Route Handlers/RPC verbinden | Kein Erfolg im UI vor bestätigter Serverantwort; wiederholbare Befehle und Statusabfrage bei unklarem Ergebnis. |
| Mittel | Prototypkarte an spätere Such-API anbinden, Radius/GPS/Geocoding ergänzen | Bestehenden Leaflet/OSM-Prototyp fortführen, Restnachweise T12 prüfen und Anbieterbetrieb vor Veröffentlichung entscheiden. |
| Mittel | Hinweise vervollständigen | Empfänger, Deduplizierung, Zustellung, 60s-Messung und 2h-Reminder fachlich/technisch entscheiden. |
| Mittel | Mindestens fünf neue Personen testen lassen | Nutzbarkeit/NFR-1 messen; Ergebnisse mit Datum und konkreten Konsequenzen dokumentieren. |
| Später | Buchungspartner und Bewertungsumfang validieren | Reale Ansprechpartner und freigegebener Pilotumfang, bevor Buchung/Reviews als fertig geplant werden. |

## 8. Vor dem Vortrag am 28.10.2026

Die Lehrveranstaltung verlangt über die Architekturfolien hinaus sichtbaren Projektfortschritt und Tracking. In den gelieferten Quellen liegt kein echtes Board und keine Commit-Historie vor. Deshalb dafür einen realen aktuellen Nachweis ergänzen. Lokale Dateierstellung ist ein dokumentierter Arbeitsfortschritt, ersetzt aber keine historische Teamaktivität.

1. Kurze Demo auf dem tatsächlichen Vortragsrechner öffnen und den Ablauf aus dem Leitfaden einmal durchspielen. Für die geografische OSM-Straßenkarte den HTTP-Start und Internet verwenden. Ohne Internet die ausdrücklich schematische Offlinekarte vorführen.
2. Einmal knapp sagen: „Die lokale Demo zeigt geografische Kartenwahl und den Kernablauf mit fiktiven Daten. Next.js-/Supabase-Anbindung und DB-Parallelität sind unser nächster Umsetzungsschritt.“
3. Ein reales Board oder die tatsächlichen Tickets/Commits öffnen und erledigte/offene Aufgaben zeigen. Keine erfundenen Screenshots, Issue-Nummern oder Zeitreihen verwenden.
4. Vorhandene vier Umfrageantworten als kleine reale Datenbasis benennen. Neue Rückmeldungen nur dann ergänzen, wenn sie tatsächlich erhoben und dokumentiert wurden.
5. Alle vier Personen beteiligen. Die Folien-/Vortragsaufteilung im P3-Leitfaden ist ein Vorschlag, kein Beleg bereits geleisteter Arbeit.
6. Architekturentscheidungen und offene Scopefragen vorab gemeinsam lesen, damit Demo, Datenmodell und Vortrag dieselben Regeln verwenden.

## 9. Pflege des Quellenstands

Neue Informationen erhalten ein Datum und eine eigene Quelle. Ein echtes Interview wird beispielsweise INT-01 genannt; es ersetzt keine SIM-Aussage rückwirkend. Technische Entscheidungen werden in [02_Architekturentscheidungen.md](02_Architekturentscheidungen.md) fortgeschrieben. Umgesetzte Anforderungen erhalten in der Traceability konkrete Repositorypfade, Commits und Testergebnisse. So bleibt später nachvollziehbar, welche Annahme wann bestätigt, geändert oder verworfen wurde.
