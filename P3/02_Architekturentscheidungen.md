# SportMate – Architekturentscheidungen

Stand: 27.10.2026 · Version 0.2 · Entscheidungsprotokoll für P3

## Verwendung und Status

Dieses Protokoll dokumentiert den P3-Arbeitsentwurf mit Anlass, Alternativen, Entscheidung, Konsequenzen und späterem Überprüfungsgrund. Es führt vorhandene Festlegungen aus [Architektur & Entwurf](../Dokumentationen/Architektur%20%26%20Entwurf.docx) weiter. „Übernommen“ bedeutet aus der Projektquelle übernommen. „Vorgeschlagen“ bedeutet für P3 neu konkretisiert und zur Teamprüfung vorgesehen. Beides behauptet keine Implementierung, keinen Betrieb und keine bereits erfolgte Teamfreigabe. ADR-06 wurde am 27.10.2026 durch den ausdrücklichen Nutzerauftrag zur interaktiven Karte konkretisiert: Das Produktziel ist bestätigt, die technische Wahl gilt für den P3-Prototyp.

Anforderungsbezüge verbinden die beiden vorhandenen ID-Systeme: DR/NFR aus [SportMate – Anforderungen](../Dokumentationen/SportMate%20%E2%80%93%20Anforderungen.docx) und SM-R aus dem [Interviewpaket](../Interviews/02_Anforderungen.md). Die IDs werden nicht umnummeriert; Unterschiede bleiben sichtbar.

| ADR | Entscheidung | Status |
|---|---|---|
| ADR-01 | Eine Next.js-Anwendung mit logisch getrennten Schichten und fachlichen Modulen | Aus bestehendem Architekturentwurf übernommen und präzisiert |
| ADR-02 | Supabase Auth und PostgreSQL statt eigener Authentifizierung/Datenbankbetrieb | Aus bestehendem Architekturentwurf übernommen |
| ADR-03 | Kapazitätskritische Zustandsänderungen als atomare DB-Fachoperationen | Für P3 vorgeschlagen |
| ADR-04 | Nutzerkontext, serverseitige Prüfungen, RLS und begrenzte Funktionsrechte gemeinsam verwenden | Bestehende RLS-Absicht für P3 konkretisiert |
| ADR-05 | Dauerhafte In-App-Hinweise zusammen mit der Fachänderung speichern | Für P3 vorgeschlagen; Versandkanäle offen |
| ADR-06 | Leaflet 1.9.4 mit OSM-Kacheln und schematischer Offlinekarte | Produktziel am 27.10.2026 durch Nutzer bestätigt, im Prototyp konkretisiert |
| ADR-07 | Fachliche Zustände getrennt halten, abgeleitete Anzeigen nicht doppelt speichern | Für P3 vorgeschlagen |
| ADR-08 | Einen konsistenten Event-Kern liefern, Pilotfunktionen als getrennte Erweiterung behandeln | P2-Priorisierung übernommen |
| ADR-09 | Abweichende Anforderungsstände durch explizite Arbeitsannahmen vereinheitlichen | Für P3 vorgeschlagen, Teamprüfung offen |

## ADR-01: Next.js als modularer Monolith

**Kontext:** SportMate braucht eine browserbasierte Oberfläche sowie serverseitige Verarbeitung für Events und Teilnahmen. Das Projekt wird von einem kleinen Hochschulteam entwickelt. Die bestehende Architekturdokumentation nennt Next.js und TypeScript.

**Erwogene Alternativen:**

| Alternative | Vorteil | Nachteil im Projekt |
|---|---|---|
| Reine Browser-App mit überwiegend direkten Datenbankaufrufen | Wenig eigener Servercode | Fachregeln und sichere Ergebnisansichten würden leichter über Oberfläche und Datenzugriff verstreut |
| Next.js mit serverseitigen Fachfunktionen | Ein Projekt und ein Anwendungsdeployment, kurze Wege zwischen UI und Anwendungsfällen | Schichtengrenzen müssen im Code diszipliniert eingehalten werden |
| Getrennte React-App und eigenes REST-Backend | Unabhängige Deployments und Technologiewahl | Zusätzliche API-/Deploymentpflege ohne nachgewiesenen Nutzen für diesen Umfang |
| Microservices pro Fachbereich | Unabhängige Skalierung einzelner Prozesse | Verteilte Transaktionen, mehr Betrieb und Fehlerfälle für eng gekoppelte Eventabläufe |

**Entscheidung:** Eine Next.js-Anwendung. Präsentation, serverseitige Anwendungsfälle und Datenzugriff haben getrennte Verantwortlichkeiten. Die Anwendung gliedert sich fachlich in Auth/Profile, Events/Suche, Teilnahme und Hinweise. Buchungsanfragen sind ein späteres Modul, kein eigener Dienst. TypeScript wird für UI und Anwendungslogik genutzt.

**Begründung:** Die Kernabläufe sind eng gekoppelt, insbesondere Erstellung, Teilnahme und Hinweise. Ein gemeinsames Projekt ermöglicht eine überschaubare Implementierung und gemeinsame Änderungen. Eine separate Backend-Anwendung oder zusätzliche Prozesslandschaft löst derzeit kein belegtes Problem.

**Folgen:** Fachregeln gehören nicht in React-Komponenten. Serverseitige Fachfunktionen sollen sich ohne Klickpfad prüfen lassen. Eine Schicht ist eine Zuständigkeit, keine Aufforderung zu vielen abstrakten Interfaces. Vercel bleibt eine Hostingoption aus den Vorarbeiten, keine bereits vorhandene Bereitstellung.

**Überprüfen, wenn:** ein weiterer unabhängiger Client eine dauerhafte HTTP-API braucht oder getrennte Teams/Funktionsbereiche tatsächlich eigenständig ausliefern müssen.

**Bezüge:** DR-2.*, DR-3.*, DR-4.*; SM-R07–14, SM-R21, SM-R30; C1/C2.

## ADR-02: Supabase Auth und relationales Datenmodell

**Kontext:** Identitäten, Events und Teilnahmen haben feste Beziehungen. Ein Konto kann mehrere Events organisieren und an vielen Events teilnehmen. Doppelte Teilnahme und verwaiste Verknüpfungen sind fachliche Fehler. Die bisherige Architektur nennt Supabase Auth und PostgreSQL.

**Alternativen:** Eigene Passwort-/Sitzungsverwaltung würde sicherheitskritische Arbeit ergänzen. Eine dokumentenorientierte Datenbank wäre möglich, passt aber weniger unmittelbar zu den Beziehungen, eindeutigen Schlüsseln und Transaktionen. Ein selbst betriebener PostgreSQL-Server reduziert Anbieterbindung, vergrößert aber den Betriebsumfang.

**Entscheidung:** Supabase Auth verwaltet Konten und Sitzungen. PostgreSQL speichert Fachdaten mit Primär-/Fremdschlüsseln, Checks und eindeutigen Beziehungen. Private Authentifizierungsdaten bleiben getrennt von öffentlichen Profilen. Das relationale Modell enthält insbesondere Events, Profile, Sportarten, Teilnahmen und Hinweise.

**Begründung:** Datenbankintegrität unterstützt die fachlichen Invarianten unmittelbar. Das Team kann sich auf SportMate-Funktionen konzentrieren und muss kein eigenes Authentifizierungssystem entwickeln.

**Folgen:** Das Team bleibt für Rechte, Datenmodell, Migrationen und Wiederherstellung zuständig. Der Einsatz eines Dienstes macht diese Aufgaben nicht automatisch fertig. Anbieterbindung und Dienstlimits bleiben Risiken. Es werden keine aktuellen Preise oder garantierten kostenlosen Leistungsgrenzen angenommen.

**Überprüfen, wenn:** Dienstgrenzen oder Anforderungen an Betrieb/Region/Wiederherstellung nicht mehr zum Pilot passen. Versionierte SQL-Migrationen und dokumentierte Datentypen erleichtern spätere Anpassungen.

**Bezüge:** DR-1.1.*, DR-1.2.*, DR-3.1.*, DR-4.1.4; NFR-5/6/7; SM-R01/02/10/11/21; C3/C4.

## ADR-03: Atomare Teilnahme statt Prüfung im Browser

**Kontext:** Bei neun von zehn belegten Plätzen können zwei Personen denselben freien Platz sehen. Eine Browserprüfung oder ein getrenntes „Anzahl lesen, dann speichern“ verhindert keine Überbuchung.

**Alternativen:**

| Alternative | Bewertung |
|---|---|
| Schaltfläche bei angezeigtem Vollstand deaktivieren | Gute Bedienhilfe, kein Schutz bei veraltetem Stand oder direktem API-Aufruf |
| In Next.js zählen und danach separat schreiben | Zwischen den Aufrufen bleibt ein Konkurrenzfenster |
| Globaler Lock im Anwendungsprozess | Unnötig grob und bei mehreren Serverinstanzen unzureichend |
| DB-Transaktion mit Eventsperre und eindeutiger Teilnahme | Ein gemeinsamer, dauerhafter Koordinationspunkt pro Event |

**Entscheidung:** `create_event`, `join_event`, `leave_event`, `update_event` und `cancel_event` führen die zusammengehörigen Prüfungen und Änderungen atomar in PostgreSQL aus. Mutationen an einem bestehenden Event sperren dieselbe Eventzeile. Die Identität stammt aus dem validierten Nutzerkontext. Das Paar Event/Konto bleibt eindeutig.

**Fachlicher Ablauf:** Unter Sperre Eventstatus und Zeit prüfen, Berechtigung prüfen, vorhandene eigene Teilnahme berücksichtigen, aktive Belegung ermitteln, erlaubte Änderung durchführen und committen. Bei Beitritt zum letzten Platz gewinnt genau eine Transaktion. Eine andere liest nach dem Warten den neuen Zustand und erhält „Ausgebucht“. Kapazitätssenkung, Abmeldung und Absage koordinieren über dieselbe Sperre.

**Folgen:** Die DB-Funktionen sind Teil der Fachlogik und müssen gemeinsam mit den Anforderungen versioniert werden. Direkte Inserts/Updates dürfen den kontrollierten Weg nicht umgehen. Ein Datenbank-Paralleltest ist erforderlich; eine Klickdemo zeigt lediglich die gewünschte Rückmeldung. Wiederholte Aufrufe sollen innerhalb des zulässigen Eventfensters denselben Zustand liefern, ohne eine zweite Teilnahme anzulegen.

**Überprüfen, wenn:** Messungen tatsächlich Engpässe bei einzelnen stark frequentierten Events zeigen. Vorher kein zusätzlicher Lockdienst, keine Queue für einfache Beitritte.

**Bezüge:** DR-3.1.5, DR-4.1.1–4, DR-4.2.1; NFR-5; SM-R08/10/11/12/26; C2/C4.

## ADR-04: Berechtigungen an jeder relevanten Grenze

**Kontext:** Ein ausgeblendeter Bearbeiten-Button schützt kein fremdes Event. Eine öffentlich erreichbare Daten-API kann außerhalb der vorgesehenen Oberfläche angesprochen werden.

**Entscheidung:** C2 validiert die Sitzung, leitet Identität daraus ab und prüft Eingaben/Eigentum. C4 begrenzt Tabellenzugriffe durch Grants und RLS. Fachkritische Mutationen erhalten nur kontrollierte Ausführungsrechte; direkte Tabellenschreibwege werden entsprechend gesperrt. Eine gegebenenfalls privilegierte DB-Funktion prüft die aufrufende Identität und fachlichen Rechte ausdrücklich, verwendet einen festen sicheren `search_path` und nur notwendige Objektberechtigungen. Normale Appaktionen nutzen keinen administrativen Dienstschlüssel.

Öffentliche Ergebnisobjekte enthalten die benötigten Event-/Profilfelder, keine E-Mail-Adressen, Sitzungsdaten oder vollständigen Kontodatensätze. Die Teilnahmezahl ist öffentlich lesbar. Teilnehmer-Anzeigenamen erhalten nur die laut Fachregel Berechtigten. Suchkoordinaten werden nicht dauerhaft im Profil oder in Anwendungslogs gespeichert.

**Alternativen:** Nur Serverprüfungen lassen eine falsch konfigurierte direkte Daten-API ungeschützt. Nur RLS deckt nicht automatisch atomare Fachregeln und sichere Ergebnisgestaltung ab. Ein administrativer Schlüssel für alle Appaktionen würde die Rechtekontrolle unnötig zentralisieren und die Datenbankgrenze schwächen.

**Folgen:** Berechtigungstests müssen direkte API-/RPC-Aufrufe einschließen. RLS ist tabellen- und operationsbezogen zu dokumentieren. Die Funktionsrechte sind separat zu prüfen. Datenbankfehler werden in verständliche Fachfehler übersetzt.

**Überprüfen, wenn:** neue öffentliche Ansichten oder Rollen hinzukommen. Neue Tabellen erhalten keinen pauschalen öffentlichen Zugriff.

**Bezüge:** DR-1.1.4, DR-1.2.3; NFR-7; SM-R02/13/21/22/23; C1–C4.

## ADR-05: Dauerhafte Hinweise in der Fachtransaktion

**Kontext:** Ein Event kann Zeit oder Ort ändern oder abgesagt werden. Der alte Informationsstand darf nicht nur im Browser ersetzt werden, während angemeldete Personen die Änderung übersehen. Wiederholte technische Verarbeitung darf keine Hinweisflut erzeugen.

**Entscheidung:** Grundlegende In-App-Hinweise werden zusammen mit der Fachänderung in C4 gespeichert. Ein Änderungsbezug und der Empfänger bilden eine eindeutige Zuordnung. Eine technische Wiederholung erzeugt keine doppelten Hinweise. Der eigene Hinweisbereich liest nur Hinweise des jeweiligen Kontos.

**Alternativen:** Flüchtige Browsermeldungen gehen nach Schließen verloren. Ein eigener Eventbus wäre zusätzlicher Betriebsumfang. Sofortiger E-Mail-Versand mitten in der Datenbankänderung koppelt den Erfolg an einen externen Dienst und benötigt eine gesonderte Wiederholungsstrategie.

**Folgen:** Die In-App-Liste kann einen dauerhaften Hinweis nachweisen, aber keine Pushzustellung und kein tatsächliches Lesen. Die DR-Forderung „innerhalb 60 Sekunden“ benötigt einen konkreten Aktualisierungsvertrag. Die Betreiber-E-Mail aus DR-5.1.3 benötigt einen späteren Versandprovider und wiederholbare Aufträge. Ein Hinweis zwei Stunden vor Beginn aus DR-3.2.3 benötigt zusätzlich einen Scheduler. Diese Punkte bleiben offen und werden nicht als umgesetzt ausgewiesen.

**Überprüfen, wenn:** E-Mail-/Push- oder zeitgesteuerte Hinweise zum freigegebenen Umfang gehören. Dann zunächst eine persistente Versandauftragsliste mit eindeutigen IDs ergänzen, bevor separate Nachrichteninfrastruktur erwogen wird.

**Bezüge:** DR-3.2.2/3, DR-3.3.1/2, DR-4.2.1, DR-4.3.1, DR-5.1.3; SM-R09/14/17/26; C2/C4.

## ADR-06: Interaktive Kartenwahl mit Leaflet und OpenStreetMap

**Kontext:** P2 und DR-2.1 führen die Karte im MVP, der ältere Architekturtext nennt sie optional. Der Nutzer fordert am 27.10.2026 ausdrücklich eine interaktive Karte zur visuellen Auswahl von Treffen und die Aktualisierung der P3-Artefakte. Damit ist das Kartenproduktziel bestätigt.

**Entscheidung:** Leaflet **1.9.4** wird als JavaScript/CSS lokal mitgeliefert und läuft in C1. Den geografischen Hintergrund liefert der OSM-Standardkachelservice über HTTPS. C5 bezeichnet diese Integration, keinen zusätzlichen SportMate-Server. Sportmarker verwenden `latitude/longitude` und dieselbe Ergebnismenge wie die Liste. Marker öffnen ein Popup mit einer Aktion für die Eventdetails. Zoom, Verschieben, Anzeige aller Treffer sowie Punktwahl beim Erstellen sind Teil der Kartenbedienung. Die Demo fragt keinen Gerätestandort ab.

**Alternativen:** Eine reine Liste erfüllt die verlangte visuelle Auswahl nicht. Eine ausschließlich schematische Ansicht zeigt keine geografische Basiskarte. Ein weiterer Anbieter oder eigener Tile-Server würde zusätzliche Zugangsdaten oder Betriebsarbeit bringen. Ein generischer Rahmen für viele Anbieter ist nicht nötig; die Grenze zwischen lokalen Eventmarkern und austauschbarem Tilelayer reicht.

**Folgen:** Bibliothek und Marker sind lokal verfügbar, nur die Straßenkartenkacheln benötigen Internet. `start.py` liefert die Demo über HTTP aus. Beim Doppelklick (`file://`) bleibt sie ohne externe Tileabrufe auf der eigenen schematischen Offlinekarte. Ein Umschalter erlaubt die Wahl zwischen Offline- und Straßenkarte; Kachelfehler lösen einen sichtbaren Fallback aus. Das ist keine Offlinekopie von OSM. Keine Kacheln werden vorab geladen oder zu Offlinearchiven gebündelt. Die Onlinekarte verwendet den Standardendpoint mit sichtbarer Attribution und normalem Browsercache/Referer.

Online-Kachelabrufe übertragen die IP-Adresse und Kachelindizes, aus denen der angeforderte Ausschnitt hervorgeht. Markertexte, Identitäten und Teilnehmerlisten bleiben lokal. Die [OSM-Tileregeln](https://operations.osmfoundation.org/policies/tiles/) und [OSMF-Datenschutzinformationen](https://osmfoundation.org/wiki/Privacy_Policy) beschreiben die externe Grenze. Der öffentliche Dienst garantiert keine Verfügbarkeit.

GPS-Zentrierung, Ortsnamen-Geocoding, Radius, Datums-/Altersgruppenfilter, spätere Server-Such-API und Performanceziele sind noch offen. Die vorhandene Karte realisiert einen lokalen Teil von T12; konkrete Ergebnisse stehen in [08_Pruefprotokoll.md](08_Pruefprotokoll.md). Vor öffentlichem Produktbetrieb Anbieter, Datenfluss und Nutzung erneut bewerten.

**Überprüfen, wenn:** die App veröffentlicht wird, mehr Last entsteht oder GPS/Geocoding/Radius hinzukommen. Das bestätigte Produktziel bleibt erhalten.

**Bezüge:** DR-2.1.1–4, DR-2.4.1, DR-2.5.2, DR-3.1.1; NFR-4; SM-R03/04/06/07/22/24; C1/C5. Technische Grundlage: [Leaflet Quick Start](https://leafletjs.com/examples/quick-start/), eingesehen am 27.10.2026.

## ADR-07: Getrennte Zustände und eine Quelle für die Belegung

**Kontext:** „Veröffentlicht“, „Ausgebucht“, „Findet statt“ und „Vergangen“ beschreiben unterschiedliche Dinge. Würden sie als gegenseitig ausschließende gespeicherte Zustände modelliert, könnte ein ausgebuchtes Event nach einer Abmeldung falsch bleiben oder eine Mindestzahlanzeige einer Absage widersprechen.

**Entscheidung:** Der gespeicherte Event-Lebenszyklus ist `published` oder `cancelled`. Ein Formularentwurf bleibt zunächst lokal. Die Zeitlage folgt aus Start/Ende, die Belegung aus aktiven Teilnahmen und die Mindestzahlanzeige aus `min_participants`. Eine Teilnahme ist `joined` oder `withdrawn`; Eventabsage erscheint als überlagerter fachlicher Zustand in der Historie. Die aktive Teilnehmerzahl wird konsistent aus derselben Datenbasis ermittelt.

Für den Buchungspilot gilt ein eigener Zustandsautomat mit angefragt, bestätigt, abgelehnt, zurückgezogen, Storno angefragt und storniert. Eine Hallenbuchung und eine Eventteilnahme sind getrennte Zusagen. Ihre Verknüpfung löst keine stillschweigende gegenseitige Stornierung aus.

**Folgen:** Anzeigen benötigen klar benannte Ableitungsregeln. „Ausgebucht“ kann wieder verschwinden. „Abgesagt“ bleibt endgültig. Mindestzahl und Kapazität sind unterschiedliche Felder. Ein eventuell später ergänzter Belegungszähler muss in derselben Transaktion konsistent gepflegt werden; zunächst ist eine zusätzliche gespeicherte Zahl unnötig.

**Überprüfen, wenn:** Wartelisten, Evententwürfe auf dem Server oder nachträgliche Anwesenheitserfassung freigegeben werden.

**Bezüge:** DR-3.2.*, DR-3.3.2, DR-4.1.*; SM-R05/08–12/16–20/29; C2/C4.

## ADR-08: Event-Kern vor Betreiberpilot und Bewertungen

**Kontext:** P2 priorisiert Registrierung, Suche, Erstellung und Teilnahme. Der Hallenbuchungspilot und Bewertungen sind geplante Erweiterungen. Die Musterinterviews sind ausdrücklich KI-Simulationen und ersetzen keine reale Pilotpartnerklärung.

**Entscheidung:** Die technische Umsetzung beginnt mit einem vollständigen Eventablauf einschließlich Fehler- und Sicherheitsfällen. Ein Buchungspilot wird nur als konsistentes Paket umgesetzt: Konditionen anzeigen und speichern, Anfrage als unverbindlich markieren, zuständige Betreiberentscheidung, interne Konfliktprüfung, Rücknahme/Storno und klare Verknüpfung zum Event. Bewertungen erhalten erst nach geklärten Regeln ein verbindliches Datenmodell.

**Alternativen:** Viele unvollständige Oberflächen würden den Fortschritt sichtbar machen, aber keine belastbare Realisierung der Kernanforderungen liefern. Eine einzelne „Jetzt buchen“-Schaltfläche ohne Betreiberentscheidung wäre fachlich irreführend.

**Folgen:** P3 dokumentiert den Pilotentwurf und seine Grenzen. Es behauptet keine vorhandene Betreiberintegration, garantierte externe Verfügbarkeit, Zahlungsabwicklung oder empirisch bestätigte Bewertungsregeln.

**Überprüfen, wenn:** ein realer Betreiberpartner und überprüfbare Pilotregeln feststehen bzw. Kernabläufe abgenommen sind.

**Bezüge:** P2 MVP-Folie; DR-5.*; SM-R15–20/29; Bewertungen in P2 ohne vollständige neue Anforderungs-ID.

## ADR-09: Einheitlicher P3-Arbeitsentwurf bei abweichenden Quellen

**Kontext:** Es liegen zwei unterschiedliche Anforderungskataloge und mehrere Präsentationsfassungen vor. P3 muss ein konsistentes Modell zeigen, ohne eine nicht erfolgte Teamfreigabe zu erfinden.

**Entscheidung:** Als Arbeitsbasis gelten die zuletzt vorgelegte P2-PDF und der DR-/NFR-Katalog. Der SM-R-Katalog ergänzt insbesondere Sicherheits-, Konkurrenz- und Fehlerfälle. Abweichungen werden in den Quell- und Traceability-Tabellen erhalten.

| Regel | P3-Arbeitsvorschlag | Abweichung / offene Abnahme |
|---|---|---|
| Kapazität | 2–50, inklusive Organisator | SM-R07 nennt 2–100 |
| Organisator | Bei Erstellung automatisch erste aktive Teilnahme | SM-R-Begriffe sehen gesonderte Anmeldung vor; Organisator kann im Entwurf nur das ganze Event absagen |
| Mindestteilnehmer | `min_participants` als Feld, Status abgeleitet | SM-R-Katalog enthält diese Schwelle nicht; automatische Zeit-/Hinweisauslösung noch offen |
| Auffindbarkeit/Teilnahme | Neue Teilnahme und normale Suche nur vor Beginn | DR-2.1.4 entfernt erst ab Ende; P3 schlägt klare Trennung laufender Events vor |
| Passwort | Mindestens 12 Zeichen als Sicherheitsvorschlag | DR-1.1.2 nennt mindestens 8; keine Passwortsimulation im lokalen Demonstrator |
| Karte | MVP-Ziel bestätigt, Leaflet/OSM im Prototyp integriert | Nutzerauftrag vom 27.10.2026; GPS/Geocoding/Radius und Produkt-API offen |
| Hinweise | Dauerhafte In-App-Hinweise als Grundlage | E-Mail, 60-Sekunden-Vertrag und Zwei-Stunden-Timer getrennt offen |

**Folgen:** Dieses Protokoll ändert die ursprünglichen Dateien nicht. Das Team kann jede Arbeitsannahme prüfen und die freigegebene Variante anschließend in Katalog, Datenmodell, Prototyp und Tests einheitlich übernehmen. Grenzwerte sind technische/fachliche Vorschläge, keine wörtlichen Nutzerwünsche.

**Überprüfen, wenn:** das Team den P3-Entwurf bespricht. Jede Änderung erhält Datum, Grund und betroffene IDs.

## Änderungsverlauf und Fortführung

| Version | Datum | Inhalt |
|---|---|---|
| 0.1 | 26.10.2026 | Bestehende Architektur konkretisiert, Alternativen bewertet, atomare Fachoperationen und Zustände entworfen, Quellkonflikte offengelegt |
| 0.2 | 27.10.2026 | Nutzerauftrag Kartenwahl: Leaflet/OSM, synchrone Marker/Liste, Eventpunktwahl, Offlinefallback und aktualisierte Traceability |

Für spätere Entscheidungen diese Struktur weiterverwenden: Kontext, Alternativen, Entscheidung, Begründung, Konsequenzen, Überprüfungsgrund und Anforderungsbezüge. Bei einer verworfenen Entscheidung den Eintrag erhalten und mit dem Nachfolger verknüpfen.

## Technische Referenzen

Die folgenden Primärquellen stützen die technischen Mechanismen. Die projektspezifische Auswahl und Bewertung ist der P3-Entwurf:

- [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security), serverseitige Zugriffskontrolle und begrenzte Datenobjekte, abgerufen 26.10.2026.
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), Datenbankrechte und Richtlinien, abgerufen 26.10.2026.
- [Supabase: Database Functions](https://supabase.com/docs/guides/database/functions), Ausführungsrechte und Aufruf von Datenbankfunktionen, abgerufen 26.10.2026.

- [PostgreSQL: Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html), technische Grundlage zu Zeilensperren (`FOR UPDATE`) für konkurrierende Transaktionen, abgerufen 26.10.2026.
- [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers), technische Grundlage für HTTP-Eintrittspunkte in `app/**/route.ts`, abgerufen 26.10.2026.
