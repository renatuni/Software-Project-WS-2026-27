# SportMate: Datenmodell und Integrität

Stand: 27.10.2026. **Neuer technischer Entwurf**, auf Grundlage der Projektunterlagen. Das [SQL-Schema](datenmodell/schema.sql) richtet sich an eine neue, leere Supabase-Testdatenbank. Es wurde in dieser Arbeitsumgebung nicht gegen PostgreSQL oder Supabase ausgeführt. Ein syntaktischer Check ersetzt weder die Funktionsprüfung noch den Test von Rollen, Transaktionen oder Hosting-Konfiguration.

## 1. Umfang und Modell

Das Kernmodell deckt Profile, Sportarten, öffentliche Eventorte, Events, Teilnahmen und In-App-Hinweise ab. Supabase Auth verwaltet Identität, E-Mail, Passwörter und Sitzungen außerhalb der fachlichen Tabellen. Der Entwurf enthält keinen eigenen Passwortspeicher.

Die bearbeitbare ER-Quelle ist [05_ER_Datenmodell.mmd](diagramme/05_ER_Datenmodell.mmd). Eine grafische Kurzfassung in der Präsentation zeigt nur den zentralen Ausschnitt. Dieses Dokument und das SQL definieren die vollständigere Fassung.

| Beziehung | Kardinalität | Bedeutung |
|---|---|---|
| `auth.users` zu `profiles` | 1 zu 0..1 | Neues Auth-Konto kann vor Abschluss des Profils existieren. Profil-ID ist zugleich Fremdschlüssel. |
| `profiles` zu `profile_sports` | 1 zu 0..n | Profil nennt Sportarten und das jeweilige Niveau. Die Profilfunktion verlangt mindestens eine Auswahl. |
| `sports` zu `profile_sports` | 1 zu 0..n | Jede ausgewählte Sportart hat genau ein Profilniveau. |
| `profiles` zu `events` | 1 zu 0..n | Ein Event besitzt genau einen Organisator. |
| `sports` zu `events` | 1 zu 0..n | Ein Event besitzt genau eine Sportart. |
| `venues` zu `events` | 0..1 zu 0..n | Bekannte Sportstätte ist optional. Outdoor-Events benötigen keinen Sportstättendatensatz. |
| `events` zu `participations` | 1 zu 1..n im regulären Ablauf | `create_event` legt sofort die Organisatorteilnahme an. Ein FK allein erzwingt die untere Grenze nicht. |
| `profiles` zu `participations` | 1 zu 0..n | Ein Konto kann an mehreren Events teilnehmen. |
| `profiles`/`events` zu `notifications` | je 1 zu 0..n | Jeder Hinweis besitzt genau einen Empfänger und ein betroffenes Event. |

`participations` löst die n:m-Beziehung zwischen Profil und Event auf. Der zusammengesetzte Primärschlüssel `(event_id,user_id)` verhindert doppelte Teilnahmezeilen. `status` erlaubt Rückzug und erneuten Beitritt ohne mehrere gleichzeitige Datensätze. Eine vollständige unveränderliche Änderungshistorie pro Beitritt ist damit noch nicht vorhanden.

## 2. Datenwörterbuch

### Identität und Profile

| Tabelle/Feld | Typ und Regel | Zweck |
|---|---|---|
| `auth.users.id` | UUID, Supabase-verwaltet | Maßgebliche Identität. Nicht über eigene öffentliche Tabellen kopieren. |
| `profiles.id` | UUID PK und FK, Löschung eingeschränkt | Verknüpft Fachprofil und Auth-Konto. |
| `profiles.display_name` | Text, 2–40 Zeichen nach Trimmen | Öffentlicher Anzeigename. Grenze als Entwurfsvorschlag aus SM-R02. |
| `profiles.age_group` | nullable Text aus fünf festen Gruppen | Öffentliche Altersgruppe nach DR-1.2.3. Kein Geburtsdatum im Fachmodell. |
| `profiles.created_at` | `timestamptz` | Anlagezeitpunkt. |
| `sports.id`, `sports.name` | kleine numerische ID, Name eindeutig | Administrativer Sportartenkatalog. Beispieldaten stehen im SQL. |
| `profile_sports.profile_id/sport_id` | zusammengesetzter PK, beide FK | Eine Zeile je Sportart pro Profil. |
| `profile_sports.level` | `beginner`, `intermediate`, `experienced` | Niveau gehört zur jeweiligen Sportart, nicht pauschal zum Nutzer. |

Das öffentliche Profil enthält derzeit Altersgruppe und Sportniveau gemäß DR-1.2. Der ältere SM-R02-Katalog beschränkt öffentliche Daten auf Anzeigenamen und Sportarten. Diese Abweichung ist fachlich zu bestätigen. E-Mail und private Kontaktdaten gehören in keinem Fall in öffentliche Profilantworten.

### Orte und Events

| Tabelle/Feld | Typ und Regel | Zweck |
|---|---|---|
| `venues.id` | UUID PK | Bekannte Sportstätte, vorerst nur administrativ gepflegt. |
| `venues.name/address` | nicht leere Fachangaben bei Administration | Beschreibt die Sportstätte. Das Kern-SQL enthält hierfür nur NOT NULL, Detailvalidierung ist noch zu ergänzen. |
| `venues.latitude/longitude` | Double, gültiger WGS84-Bereich | Öffentliche Sportstättenlage. |
| `events.id` | UUID PK | Stabile URL und Zuordnung aller Teilnahmen. |
| `events.organizer_id` | UUID FK, nicht aus Clientidentität übernehmen | Verantwortliches Profil. |
| `events.sport_id` | FK zu `sports` | Sportart des Treffens. |
| `events.venue_id` | nullable FK zu `venues` | Optionaler Bezug auf bekannte Sportstätte. Keine Buchungsbestätigung. |
| `events.title` | 3–80 Zeichen | Lesbarer Name, aus SM-R07 als ergänzender Vorschlag. |
| `events.description` | Text bis 300 Zeichen, Standard leer | Freitext nach DR-3.1.2. Bei Ausgabe als Text behandeln. |
| `events.meeting_point` | 5–200 Zeichen | Konkreter Treffpunkt, unabhängig von der Sportstättenadresse. |
| `events.latitude/longitude` | Double, WGS84-Grenzen | Öffentliche Eventposition. Keine persönlichen Suchstandorte. |
| `events.starts_at/ends_at` | `timestamptz`, Ende nach Beginn | Speicherung als Zeitpunkt. Anzeige in Europe/Berlin. |
| `events.capacity` | Smallint 2–50 | Gesamtkapazität einschließlich Organisator. |
| `events.min_participants` | Smallint 2..Kapazität | Mindestzahl für die abgeleitete Anzeige „Findet statt“. |
| `events.level` | Anfänger/Fortgeschritten/Erfahren/Alle als stabile Codes | „Alle“ erfüllt einen ausgewählten Niveaufilter. |
| `events.age_group` | nullable Altersgruppe | NULL bedeutet keine Einschränkung. |
| `events.status` | `published` oder `cancelled` | Absage bleibt gespeichert und ist endgültig. |
| `events.version` | positiver Integer, bei Mutation erhöht | Schutz vor veralteten Bearbeitungsformularen, Hinweiszuordnung. |
| `events.created_at` | `timestamptz` | Anlagezeitpunkt. |

**Kartenabgleich vom 27.10.2026:** Die bestehenden Felder `events.latitude/longitude` tragen bereits den öffentlichen Eventpunkt. Der lokale Prototyp setzt entsprechende Zahlenfelder per Kartenklick. Dafür ist keine zusätzliche Tabelle und keine Änderung des SQL-Entwurfs nötig. Beispielpunkte sind fiktiv. OSM erhält Kachelanfragen für den Ausschnitt, keine Eventdatensätze oder Teilnehmerlisten. GPS, Geocoding, persönliche Suchzentren und Radius bleiben spätere Suchfunktionen.

Ort und Zeit im Event sind bewusst eigene Werte. Eine Änderung am Sportstättenverzeichnis darf einen veröffentlichten Treffpunkt nicht stillschweigend verändern. Bei späterer Verknüpfung mit einer Hallenanfrage müssen Zeitraum und Ressource geprüft werden; `venue_id` allein ist dafür kein Nachweis.

Die Datenbank prüft feste Wertebereiche per CHECK/FK/NOT NULL. „Beginn liegt in der Zukunft“ ist eine zustandsabhängige Regel und wird in den RPCs mit Datenbankzeit geprüft. Ein CHECK mit `now()` würde einen Datensatz nach Zeitablauf nicht selbstständig neu validieren und wäre dafür ungeeignet.

### Teilnahme und Hinweise

| Tabelle/Feld | Typ und Regel | Zweck |
|---|---|---|
| `participations.event_id/user_id` | gemeinsamer PK, FK | Eindeutige Zuordnung. |
| `participations.status` | `joined` oder `withdrawn` | Aktiv oder selbst zurückgezogen. |
| `participations.joined_at` | `timestamptz` | Letzter Beitritt, bei Reaktivierung erneuert. |
| `participations.changed_at` | `timestamptz` | Letzte Teilnahmeänderung. |
| `notifications.id` | Bigint Identity PK | Stabile Hinweiskennung. |
| `notifications.recipient_id/event_id` | FK | Private Empfängerzuordnung, Eventlink. |
| `notifications.event_version` | Integer | Kennzeichnet den verursachenden Änderungsstand. |
| `notifications.kind` | `event_changed`, `event_cancelled`, `participation_changed`, `minimum_reached` | Fachliche Hinweisart. |
| `notifications.message` | Text | Verständlicher Hinweis ohne private Kontaktdaten. |
| `notifications.created_at/read_at` | `timestamptz`, gelesen nullable | Technische Erzeugung und freiwilliger Lesestatus. |
| eindeutige Hinweiskombination | Empfänger, Event, Version, Art | Keine doppelten Hinweise desselben Zustandswechsels. |

`participantCount` ist keine zusätzliche Tabellenspalte. Für veröffentlichte Events zählt sie `joined`-Zeilen. Nach Eventabsage zeigt die API null aktive Plätze und „Event abgesagt“; historische Zeilen bleiben bestehen. Die Auswertung von historischen Teilnahmen und eine spätere Bewertung dürfen eine Absage deshalb nicht als tatsächliche Sportteilnahme interpretieren.

## 3. Invarianten und zuständige Durchsetzung

| Invariante | Durchsetzung im Entwurf |
|---|---|
| Konto höchstens einmal pro Event | PK `(event_id,user_id)` |
| Kein Beitritt nach Beginn/Absage | Prüfung in `join_event` nach Eventzeilensperre |
| Aktive Anzahl überschreitet Kapazität nicht | Gemeinsame `FOR UPDATE`-Sperre und Zählung in `join_event`, Kapazitätsprüfung in `update_event` |
| Organisator zählt mit | Event und erste Teilnahme in `create_event` gemeinsam angelegt |
| Organisator kann nicht über normale Absage verschwinden | `leave_event` lehnt eigene Organisatorrolle ab |
| Fremdes Event bleibt unverändert | `update_event`/`cancel_event` vergleichen `auth.uid()` mit `organizer_id` |
| Kapazitätssenkung löscht keine Zusagen | Änderung unter aktive Anzahl bricht ab |
| Ende liegt nach Beginn | Tabellen-CHECK |
| Abgesagtes Event wird nicht reaktiviert | Keine dafür vorgesehene RPC, Update prüft `published` |
| Wiederholte Absage erzeugt keine weiteren Hinweise | Frühe Rückgabe `already_cancelled` |
| Profil enthält kein Passwort | Ausschließlich C3 verwaltet Credentials |
| Suchstandort bleibt flüchtig | Kein Datenbankfeld vorgesehen, Logging zusätzlich sperren |
| Öffentlich nur Zahl, Namen nur für Berechtigte | `get_participant_count` separat von `get_participants`; kein allgemeines Lesen der Teilnahmezeilen |

Die Invarianten gelten nur, wenn alle produktiven Schreibwege die vorgesehenen RPCs verwenden. Administrationsskripte, spätere Migrationen und zusätzliche Funktionen dürfen sie nicht umgehen. RLS allein kann eine Kapazität über mehrere Zeilen nicht atomar garantieren.

## 4. Rollen und Zugriffe

| Objekt/Operation | Gast | Angemeldet | Organisator des Events | Technische Administration |
|---|---|---|---|---|
| Sportarten, öffentliche Profile und Events lesen | ja | ja | ja | ja |
| Profil ändern | nein | nur eigenes über RPC | nur eigenes | nach separatem Prozess |
| Event erstellen | nein | ja, mit vorhandenem Profil | ja | kein besonderer Produktablauf |
| Event ändern/absagen | nein | nein bei fremdem Event | ja vor Beginn | privilegierter Notfall-/Wartungsprozess |
| Eigene Teilnahme lesen | nein | eigene Zeilen per RLS | eigene Zeilen | privilegiert |
| Alle Teilnehmernamen lesen | nein | nur bei aktiver eigener Zusage | ja | privilegiert |
| Anzahl Teilnehmer lesen | ja | ja | ja | ja |
| Teilnahme ändern | nein | nur eigene über RPC | normale eigene Absage gesperrt | keine normalen Clientrechte |
| Hinweise lesen/als gelesen markieren | nein | nur eigene | nur eigene | privilegiert |
| Sportstätten pflegen/Betreiberrechte vergeben | nein | nein | nein | ja, Pilot separat |

Tabellen erhalten RLS; Direktmutation wird für `anon` und `authenticated` entzogen. `SECURITY DEFINER`-Funktionen erhalten gezielte EXECUTE-Grants. Sie prüfen Identität und Eigentum selbst, weil ihr Besitzer RLS technisch umgehen kann. Jede Objektbezeichnung im Funktionskörper ist schemaqualifiziert und der `search_path` leer. Diese begrenzte Privilegierung ist eine konkrete Sicherheitsentscheidung und erfordert Review. Neue SECURITY-DEFINER-Funktionen dürfen nicht automatisch öffentlich ausführbar bleiben.

Die Anwendung benötigt für diese Fachaufrufe keinen Supabase-Service-Role-Schlüssel. Ein öffentlicher Supabase-Projektschlüssel ist kein Ersatz für die Nutzeridentität. Die RLS-Policies setzen voraus, dass `auth.uid()` aus einem gültig verifizierten JWT stammt. Projektweite Default-Grants und eventuell vorhandene weitere RPCs müssen beim späteren Einspielen ebenfalls untersucht werden.

## 5. Indizes und Abfragegrenzen

- `events_search_idx(status,starts_at,sport_id)` unterstützt die erste Eingrenzung auf veröffentlichte zukünftige Events. Bei größerer Datenmenge muss die tatsächliche Selektivität mit EXPLAIN geprüft werden.
- `participations_active_idx(event_id) WHERE status='joined'` beschleunigt die Belegungszählung.
- `participations_user_idx(user_id,status)` dient „Meine Treffen“.
- `notifications_recipient_idx(recipient_id,created_at DESC)` dient eigenen neuesten Hinweisen.

Die erste Fassung verwendet keine gesonderte Suchmaschine. Umkreissuche darf nach zeitlich/fachlicher Eingrenzung im Server berechnet werden, solange das dokumentierte Testprofil passt. Das Distanzfilter muss vor einem Ergebnislimit liegen. Größere Datenbestände können eine SQL-/PostGIS-Abfrage nötig machen. Ein 2-Sekunden- oder 3-Sekunden-Ziel ist im aktuellen Paket kein gemessenes Ergebnis.

## 6. Optionaler Buchungspilot als Erweiterungsentwurf

Die folgenden Objekte sind **nicht im Kern-SQL enthalten**. Sie beschreiben einen künftigen zusammenhängenden Pilot, dessen Umfang, Partner und Kanal noch zu bestätigen sind. Eine sichtbare Statusskizze allein erfüllt keine funktionierende Buchung.

| Vorgesehenes Objekt | Wesentliche Felder/Regeln |
|---|---|
| `venue_resources` | Sportstätte, eindeutige Ressource, verantwortlicher Betreiber; Betreiberzuordnung nur administrativ |
| `booking_requests` | Antragsteller, Ressource, Start/Ende, Sportart, Personenzahl, Verantwortlichenkontakt, Preis-/Regelkopie, akzeptiert_am, Zustand, Begründung, externe_prüfung_am, optional event_id |
| Buchungsintervall | halboffen `[Beginn,Ende)`; direkt angrenzende Termine sind erlaubt |
| Bestätigungsschutz | Transaktion plus Sperre je Ressource oder PostgreSQL-Exclusion-Constraint für überlappende blockierende Intervalle |
| Status | angefragt, bestätigt, abgelehnt, zurückgezogen, Storno angefragt, storniert |
| Externer Kalender | manueller Abgleich vor Bestätigung, solange keine echte Integration existiert |
| E-Mail/Bestätigungslink | separater sicherer Zustellprozess; Tokens befristet, einmalig, zweckgebunden und ohne bloßen GET-Seiteneffekt |

„Angefragt“ blockiert noch keine verbindliche Hallenzeit. „Bestätigt“ und „Storno angefragt“ blockieren intern. Der Betreiber schließt ein Storno ab. Eine Eventteilnahme und eine Hallenbuchung bleiben verschiedene Beziehungen. Bei Verknüpfung sind Eigentum, Ressource und Zeitraum zu prüfen. Änderungen an verknüpfter Eventzeit oder am Ort verlangen einen bewussten neuen Abgleich. Keine Zahlung und keine garantierte externe Verfügbarkeit werden daraus abgeleitet.

Bewertungen sind ebenfalls eine spätere Erweiterung. Vor einer Tabelle `reviews` müssen berechtigte Bewerter, tatsächliche Teilnahme, Sichtbarkeit, Missbrauch und Korrekturregeln geklärt werden. P2 bezeichnet sie als neue Teamidee. Ein Bewertungsmodell im Kern würde derzeit unbestätigte Produktregeln vorwegnehmen.

## 7. Löschung und Aufbewahrung

Der aktuelle Entwurf verwendet bei Event-/Teilnahmebezügen `ON DELETE RESTRICT`, damit versehentliches Löschen keine referenzierten Daten entfernt. Das ist **noch kein fertiges Kontolösch- oder Datenschutzkonzept**. Die spätere Kontolöschung muss organisierte zukünftige Events behandeln, persönliche Daten löschen oder zulässig anonymisieren, Auth-Konto und Fachprofil konsistent entfernen und Aufbewahrungspflichten begründen. Bis dieser Ablauf implementiert und geprüft ist, darf C-1 nicht als erfüllt gelten. Private Kontaktdaten des Buchungspiloten benötigen eigene Löschfristen. Persönliche Suchverläufe entstehen im Entwurf gar nicht.

## 8. Einspielen und spätere Migration

1. Team entscheidet die in P3 dokumentierten Regelkonflikte.
2. Neue Supabase-Testdatenbank mit den Standardrollen `anon`, `authenticated`, dem Schema `auth` und `auth.uid()` bereitstellen. Dies ist kein allgemeines PostgreSQL-Skript ohne Supabase.
3. `schema.sql` im Migrationstool prüfen und einmalig auf die leere Testdatenbank anwenden. Es nutzt absichtlich keine `IF NOT EXISTS`-Klauseln, die abweichende vorhandene Strukturen verschleiern könnten.
4. Testkonten über Supabase Auth registrieren. E-Mail-/Passwortdaten nicht als SQL-Testseeds in das Projekt eintragen.
5. Profile über `save_profile` mit Sportart/Niveau anlegen, danach Events über `create_event`.
6. Sämtliche folgenden Prüfungen ausführen und Ergebnisse mit Datenbankversion, Migration/Commit, Rollen, Datum und Testdaten protokollieren.
7. Erst danach eine Migration für die eigentliche Projektumgebung ableiten. Kein produktives Schema während der P3-Vorführung anlegen oder ändern.

Ein Fehler vor dem abschließenden COMMIT rollt die Migration zurück. Ein bereits vorhandenes Schema benötigt einen eigenen inkrementellen Migrationsplan. Für echte Daten sind Backup und Rückfallweg erforderlich. Die Fachapp muss DB-Fehler übersetzen und darf SQL-Ausgaben nicht ungefiltert anzeigen.

## 9. Erforderliche Datenbank- und Integrationstests

**Ausführungsstatus dieser fachlichen Tests: noch nicht ausgeführt.** Ein Browser-Klickprototyp kann die nachfolgenden Eigenschaften nicht nachweisen.

| Test-ID | Vorbereitung und Aktion | Erwartung | Anforderungsbezug |
|---|---|---|---|
| DB-01 | Nutzer A erstellt zukünftiges Event mit Kapazität 3, Mindestzahl 2 | Event und A-Teilnahme gemeinsam gespeichert, Zähler 1 | DR-3.1.1/5 |
| DB-02 | Zwei weitere Nutzer B und C treten demselben Event mit genau einem freien Platz parallel aus getrennten Transaktionen bei | genau ein Commit mit Zusage, anderer Aufruf EVENT_FULL, Zähler nie über Kapazität | DR-4.1.3, NFR-5, SM-R11 |
| DB-03 | B sendet dieselbe Zusage zweimal, anschließend mit Timeout-Wiederholung | genau eine aktive Zeile, keine doppelte Erhöhung/Benachrichtigung | DR-4.1.4, SM-R10/26 |
| DB-04 | B zieht eigene Zusage zweimal zurück | genau ein Platz frei, zweite Operation ohne weitere Änderung | DR-4.2.1, SM-R12 |
| DB-05 | B versucht A-Event zu bearbeiten/abzusagen | FORBIDDEN, identischer Datenstand | SM-R21 |
| DB-06 | A senkt Kapazität unter aktive Zahl, während C beitritt | gemeinsame Sperre, zulässige Reihenfolge, keine Überbelegung oder gelöschten Teilnahmen | SM-R08/11 |
| DB-07 | A sagt Event ab, während B beitritt | entweder Zusage vor anschließender Absage oder verweigerter Beitritt, danach keine aktive Teilnahmeanzeige | DR-3.3.2, SM-R09 |
| DB-08 | Gast, unbeteiligter B, Teilnehmer C und Organisator A fragen Namen ab | nur A/C erhalten Teilnehmernamen, alle dürfen Zahl sehen | SM-R13 |
| DB-09 | B ruft Tabellen-INSERT/UPDATE auf participations direkt auf statt RPC | fehlende Berechtigung, keine Änderung | SM-R21, NFR-5 |
| DB-10 | A ist Organisator und ruft leave_event auf | ORGANIZER_MUST_CANCEL_EVENT, seine Teilnahme bleibt | P3-Entwurfsvorschlag |
| DB-11 | Eventbeginn überschritten oder Event abgesagt | join/leave/update entsprechend gesperrt, direkte Detailansicht bleibt möglich | SM-R05/09/10/12 |
| DB-12 | Alte expectedVersion nach zwischenzeitlicher Änderung senden | VERSION_CONFLICT, keine überschriebene Änderung und kein Doppelhinweis | SM-R14/26 |
| DB-13 | Falsche Datentypen, Kapazität 1/51, Ende vor Beginn, fehlender Ort, SQL-/HTML-Freitext | feste Grenzen verhindern Speicherung, Freitext wird nie ausgeführt | DR-3.1.1–4, SM-R23 |
| DB-14 | Als B A-Hinweis lesen bzw. markieren | keine fremden Daten, Update abgewiesen | SM-R21 |
| DB-15 | Mindestsaldo steigt durch Zusage von unter Mindestzahl auf Mindestzahl | Status abgeleitet „Findet statt“, genau ein Hinweis je aktuell Angemeldetem | DR-3.2.1/2 |

Für DB-02 reichen zwei nacheinander abgesetzte Requests nicht aus. Test muss zwei getrennte Verbindungen synchron starten, auf beide Ergebnisse warten und danach die Tabellenanzahl mit einer dritten Abfrage prüfen. RLS-Tests müssen als reale `anon`-/`authenticated`-Rollen mit passenden Claims laufen, nicht als Datenbankbesitzer. Die Wirkung von SECURITY DEFINER ist explizit mitzutesten.

Außerhalb des Schemas liegen Auth-Fehler, CSRF, Karten-/Netzausfall, persönliche Suchdaten in Logs, E-Mail-Zustellung, zeitgesteuerte Mindestzahl-Erinnerung, Konto-Löschung, mobile Darstellung und echte Nutzertests. Lokale Kartenprüfungen vom 27.10.2026 stehen getrennt in [08_Pruefprotokoll.md](08_Pruefprotokoll.md) und ersetzen keine Prüfung der späteren Such-API oder DB. Diese Lücken sind dokumentiert und keine bestandenen Abnahmekriterien.


## Technische Primärquellen

Die technischen Mechanismen wurden anhand der offiziellen Dokumentation geprüft, abgerufen am 26.10.2026. Das ist ein Dokumentationsabgleich, kein Datenbanktest:

- [PostgreSQL: Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html): Zeilensperren koordinieren konkurrierende Mutationen, Sperren gelten bis zum Transaktionsende.
- [PostgreSQL: CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html): SECURITY DEFINER, sicherer Suchpfad und gezielte EXECUTE-Rechte.
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): Nutzerkontext über auth.uid(), RLS und privilegierte Rollen.
