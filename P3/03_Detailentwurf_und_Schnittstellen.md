# SportMate: Detailentwurf und Schnittstellen

Stand: 27.10.2026. **Technischer Entwurf für P3, noch keine implementierte Next.js-Anwendung.** Die Schnittstellen und Dateipfade dieses Dokuments sind Vorschläge für die spätere Umsetzung. Das zugehörige SQL ist ein neuer Datenbankentwurf und wurde hier nicht auf Supabase ausgeführt.

## 1. Bezug und verbindliche Begriffe für diesen Entwurf

Ausgangspunkt sind `Dokumentationen/Architektur & Entwurf.docx`, die P2-Präsentation vom 14.10.2026 und der DR-/NFR-Katalog in `Dokumentationen/SportMate – Anforderungen.docx`. Der ältere SM-R-Katalog in `Interviews/02_Anforderungen.md` liefert ergänzende Akzeptanzszenarien, widerspricht aber einzelnen späteren Regeln. Die Konflikte gehören vor Umsetzung in ein Teamreview.

Für die Konsistenz aller P3-Modelle gelten folgende **Arbeitsvorschläge**:

- Das Veröffentlichen erzeugt in derselben Transaktion die Teilnahme des Organisators. Sie zählt zur Kapazität 2–50. Das folgt DR-3.1.1/5 und weicht vom älteren SM-R-Katalog ab.
- `min_participants` ist ein gespeichertes Feld. „Sucht Mitspieler“, „Findet statt“ und „Ausgebucht“ berechnen sich aus Mindestzahl, aktiven Teilnahmen und Kapazität. Sie sind keine zusätzlichen, unabhängig veränderbaren Eventzustände.
- Ein Organisator kann seine eigene Teilnahme nicht über den normalen Absageknopf entfernen. Er kann das Event absagen. Das ist ein neuer Entwurfsvorschlag zur Vermeidung eines Events ohne organisatorische Verantwortung.
- Nach Beginn sind Beitreten, eigene Absage und Eventbearbeitung gesperrt. Die Suche bietet nur noch nicht begonnene Events an. Das schränkt DR-2.1.4 („ab Endzeit entfernen“) ein und muss bestätigt werden.
- Kartenwahl ist seit dem Nutzerauftrag vom 27.10.2026 bestätigtes MVP-Ziel. Die lokale Demo verwendet Leaflet 1.9.4 mit geografischen OSM-Kacheln, klickbaren Sportmarkern und synchroner Liste. Neue Eventpunkte werden per Kartenklick gewählt. Schematische Offlinekarte und Liste bleiben bei Kachelausfall nutzbar.
- Mindestens zwölf Passwortzeichen sind ein neuer Sicherheitsvorschlag und weichen von DR-1.1.2 mit acht Zeichen ab. Die spätere Auth-Konfiguration und Anforderung müssen dieselbe Grenze verwenden. Das SQL speichert keine Passwörter.

Komponenten: **C1** Browseroberfläche, **C2** Next.js-Server mit Fachmodulen, **C3** Supabase Auth, **C4** PostgreSQL, **C5** Kartenintegration mit lokalem Leaflet in C1 und externem OSM-Kachelservice.

## 2. Modulstruktur und Verantwortlichkeiten

Die Anwendung besitzt ein Next.js-Projekt. Eine Trennung in mehrere Backenddienste ist für den dokumentierten Umfang nicht nötig. Ein Fachmodul besteht aus TypeScript-Funktionen und zugehörigen Datenobjekten. Das UML-Diagramm [04_Klassendiagramm.mmd](diagramme/04_Klassendiagramm.mmd) stellt diese Datenobjekte und Module konzeptuell dar. `«module»` bedeutet ausdrücklich keinen Zwang, TypeScript-Klassen mit Instanzen zu programmieren.

| Modul in C2 | Verantwortung und Operationen | Geplanter Dateipfad | Abhängigkeit |
|---|---|---|---|
| AuthService | `getVerifiedUser()`: Sitzung serverseitig prüfen, authentifizierte ID liefern | `src/server/auth.ts` | C3, serverseitiger Supabase-Client |
| ProfileService | `saveProfile()`, öffentliches Profil laden | `src/features/profiles/service.ts` | RPC `save_profile`, Tabellen `profiles`, `profile_sports` |
| EventService | `searchEvents()`, `getEvent()`, `createEvent()`, `updateEvent()`, `cancelEvent()` | `src/features/events/service.ts` | Eventabfragen, C4-RPCs |
| ParticipationService | `joinEvent()`, `leaveEvent()`, `getParticipants()` | `src/features/participation/service.ts` | `join_event`, `leave_event`, `get_participants` |
| NotificationService | `listMyNotifications()`, `markRead()` | `src/features/notifications/service.ts` | RLS-geschützte Abfrage, `mark_notification_read` |
| Kartenadapter in C1/C5 | Geografische Basiskarte, Marker, Punktwahl und Listenabgleich | Ziel: `src/features/map/MapView.tsx`; lokal: `prototyp/app.js` | Leaflet 1.9.4 lokal, OSM-Standardtiles HTTPS; GPS/Geocoding/Radius offen |

Es gibt zunächst keine generische Repository-Hierarchie und keinen Eventbus. Fachmodule verwenden den vorhandenen Supabase-Client. Der Client trägt den JWT des jeweiligen Nutzers. Ein Service-Role-Schlüssel in der Browseranwendung oder ein pauschaler RLS-Bypass sind nicht Teil des Entwurfs.

Die SQL-Funktionen sind die maßgebliche Stelle für kapazitätsrelevante Mutationen. Die TypeScript-Module validieren die Anfrage, prüfen die Sitzung, rufen die passende Funktion auf und übersetzen fachliche Ergebnisse in API-Antworten. Eine zusätzliche Prüfung im UI verbessert die Bedienung, ersetzt diese Regeln aber nicht.

## 3. Zentrale Datenobjekte

```ts
// Entwurf von Datenverträgen, keine vorhandenen Projektdateien.
type EventStatus = 'published' | 'cancelled';
type ParticipationStatus = 'joined' | 'withdrawn';
type SkillLevel = 'beginner' | 'intermediate' | 'experienced' | 'all';

type EventInput = {
  title: string;
  sportId: number;
  meetingPoint: string;
  latitude: number;
  longitude: number;
  startsAt: string; // ISO 8601 mit explizitem Offset, serverseitig validieren
  endsAt: string;
  capacity: number;
  minParticipants: number;
  level: SkillLevel;
  ageGroup?: 'under20' | '20to25' | '26to30' | '31to40' | 'over40';
  description?: string;
  venueId?: string;
};

type EventSummary = {
  id: string;
  title: string;
  sportId: number;
  startsAt: string;
  endsAt: string;
  meetingPoint: string;
  latitude: number;
  longitude: number;
  participantCount: number;
  capacity: number;
  minParticipants: number;
  status: EventStatus;
  version: number;
};
```

`organizerId`, Teilnehmer-ID und Eventstatus kommen bei schreibenden Aufrufen nicht ungeprüft aus einem Browserformular. Die Identität kommt aus der verifizierten Sitzung und in C4 aus `auth.uid()`. Das Erstellen setzt den Status selbst auf `published`. Oben genannte Typen sind keine Laufzeitvalidierung; der Server muss trotzdem Typen, Grenzen und zulässige Werte prüfen.

### Konkreter lokaler Kartenvertrag

Die lokalen Eventobjekte besitzen `latitude` und `longitude` als Zahlen in Dezimalgrad. Die Starttreffen liegen an ausdrücklich fiktiven Flensburger Beispielpunkten. Ein Kartenklick zur Erstellung setzt beide Felder gemeinsam; `create()` prüft die gültigen Koordinatenbereiche. `SportMateMap.render()` zeichnet dieselbe `search()`-Ergebnismenge wie die Liste, `SportMateMap.fitEvents()` passt den Ausschnitt an Treffer an, `SportMateMap.chooseLocation()` übernimmt den gewählten Eventpunkt. Der Kartenadapter verändert keine Teilnahme-/Kapazitätsregel.

Die oben genannten Modell-/API-Felder bleiben der Zielvertrag für Next.js. Die lokale Karte benötigt heute keinen Fachserver. Leaflet liegt lokal bei, nur der Straßenkartenlayer ruft OSM-Kacheln ab. Dabei sieht der Dienst IP-Adresse und Ausschnitt. Ein öffentlicher Eventpunkt ist kein persönlicher Suchstandort. Die Demo enthält kein GPS, Geocoding oder Radiusfilter. `start.py` ist nur ein Dateiserver mit Browseröffnung.

## 4. HTTP-Verträge

HTTP Route Handler bilden einen konsistenten Zugang für UI und spätere Integrationstests. Supabase Auth stellt Registrierung und Anmeldung bereit. Die konkrete sichere Cookie-/Sitzungsintegration wird bei Projektinitialisierung anhand der dann festgelegten Next.js-/Supabase-Versionen umgesetzt.

| Methode und Route | Eingabe | Erfolg | Hauptfehler |
|---|---|---|---|
| `GET /api/events` | Sportarten, Datumsintervall, Niveau, Altersgruppe, Seite | `200 {items, nextCursor}` ohne personenbezogenes Suchzentrum | `400` ungültige Filter, `503` Datenquelle gestört |
| `POST /api/events/search` | Suchzentrum, Radius und Filter im JSON-Body | `200 {items, nextCursor}` | `400`, `503` |
| `GET /api/events/[id]` | Event-ID | `200` Details einschließlich eigener Teilnahme und aktueller Version | `404` unbekannt |
| `POST /api/events` | `EventInput`, verifizierte Sitzung | `201 {id, version:1}`, Organisator nimmt teil | `401`, `422` ungültige Daten |
| `PATCH /api/events/[id]` | neue editierbare Werte, `expectedVersion` | `200 {version}` | `403` fremdes Event, `409` veraltete Version/Kapazität/Beginn, `422` |
| `POST /api/events/[id]/cancel` | verifizierte Sitzung | `200 {status:"cancelled"}` auch bei Wiederholung | `401`, `403`, `404`, `409` nach Beginn |
| `POST /api/events/[id]/participation` | keine fremde Nutzer-ID | `200 {status:"joined"}` auch bei bestehender eigener Zusage | `401`, `404`, `409` voll/abgesagt/begonnen |
| `DELETE /api/events/[id]/participation` | keine fremde Nutzer-ID | `200 {status:"withdrawn"}` auch bei Wiederholung | `401`, `404`, `409` Organisator/abgesagt/begonnen |
| `GET /api/events/[id]/participants` | verifizierte Sitzung | `200 {items:[{id,displayName}]}` nur für Organisator/Angemeldete | `401`, `403` |
| `PUT /api/profile` | Anzeigename, Altersgruppe, Sportart/Niveau-Paare | `200` | `401`, `422` |
| `GET /api/notifications` | verifizierte Sitzung | `200` nur eigene Einträge | `401`, `503` |
| `POST /api/notifications/[id]/read` | verifizierte Sitzung | `200` | `401`, `404` |

Ortskoordinaten im Such-Body verhindern, dass sie automatisch Teil einer URL oder Referer-Angabe werden. Zusätzlich müssen Proxy-, Hosting-, Fehler- und Anwendungslogs Such-Bodies und Auth-Daten auslassen. Ein POST allein garantiert diese Eigenschaft nicht. Öffentliche Eventkoordinaten sind von einem persönlichen Suchzentrum zu unterscheiden.

Die Suche wendet Sportarten untereinander per ODER und verschiedene Filtergruppen per UND an. Für das Niveau gilt „ausgewähltes Niveau oder Alle“, für Altersgruppen „ausgewählte Gruppe oder ohne Einschränkung“. Die Voreinstellungen 2/5/10/20 km und 5 km Standard folgen DR-2.4.1. Der Server berechnet Luftlinienentfernung mit derselben Haversine-Definition für Liste und Karte. **Erst alle Filter einschließlich Distanz auswerten, dann begrenzen/paginieren.** Ein vorzeitiges Limit könnte passende Events fälschlich verwerfen. Für große Datenmengen ist später eine räumlich indizierte Datenbankabfrage zu prüfen. Für das Semesterprojekt sind PostGIS und ein eigener Suchdienst keine Vorbedingung.

Fachliche Fehler haben ein stabiles Feld, z. B. `{error:{code:"EVENT_FULL",message:"Ausgebucht"}}`. Interne SQL-Texte, Stacktraces und Schlüssel gelangen nicht in API-Antworten. SQL-Fehler wie `EVENT_FULL` werden explizit zugeordnet. Nicht zugeordnete Fehler liefern eine allgemeine Fehlermeldung und eine technisch protokollierte, nicht personenbezogene Vorgangs-ID. `422` kennzeichnet Feldfehler, `409` eine fachliche Zustandsänderung seit der letzten Anzeige.

Schreibende Cookie-basierte Routen prüfen außerdem Ursprung/CSRF-Schutz. Eingaben werden als Text ausgegeben, Redirect-Ziele nur innerhalb der eigenen Anwendung akzeptiert, und sensible Seiten dürfen nicht als gemeinsam nutzbarer Cacheeintrag ausgeliefert werden. Diese Integrationsmaßnahmen stehen noch aus.

## 5. Präziser Teilnahmeablauf

1. C1 zeigt Details mit Belegung und eigenem Status. Diese Anzeige ist eine Momentaufnahme.
2. C2 prüft Sitzung und Event-ID. Der Nutzer-JWT wird an C4 weitergegeben.
3. `join_event` liest das Event mit `SELECT ... FOR UPDATE`. Alle kapazitätsrelevanten Schreibwege sperren dieselbe Eventzeile.
4. Die Funktion prüft veröffentlichten Status und zukünftigen Beginn. Bei vorhandener aktiver eigener Teilnahme liefert sie ohne neue Zeile `already_joined`.
5. Sie zählt aktive Teilnahmen. Bei voller Kapazität bricht sie vor jeder Änderung mit `EVENT_FULL` ab.
6. Sie legt die Teilnahme an bzw. reaktiviert den eigenen zurückgezogenen Datensatz, erhöht die Eventversion und erzeugt Hinweise. Erst der gemeinsame Commit macht die Änderung sichtbar.
7. C2 lädt den maßgeblichen aktuellen Status. C1 zeigt erst dann eine Zusage.

Bei zwei Aufrufen für den letzten Platz wartet einer auf die Eventzeile. Nach dem ersten Commit zählt er erneut und erkennt „voll“. Die Kombination aus derselben Zeilensperre, Prüfung und Schreiben in einer Transaktion verhindert Überbelegung. Der zusammengesetzte Primärschlüssel verhindert eine zweite Zeile desselben Nutzers. Diese Aussage beschreibt den Entwurf; ein echter Zwei-Client-Integrationstest ist noch erforderlich.

`leave_event`, `update_event` und `cancel_event` nutzen dieselbe Sperre. Dadurch können z. B. Kapazitätssenkung und Beitritt nicht unabhängig voneinander entscheiden. Bei mehreren Events darf ein späterer Batchbetrieb Sperren nur in fester ID-Reihenfolge nehmen, um Deadlocks zu vermeiden. Ein Event mit 50 Plätzen braucht zunächst keine komplexere Sperrstrategie.

## 6. Wiederholung, Fehler und Zustände

| Situation | Erwartetes Verhalten |
|---|---|
| Doppelklick Beitreten | Ein Datensatz und eine Belegungsänderung. Zweiter Aufruf bestätigt bestehenden Status. |
| Antwort nach erfolgreichem Commit verloren | Keine neue Erfolgsmeldung raten. Eventdetails und eigenen Status neu laden, dann anzeigen. |
| Timeout mit unbekanntem Ergebnis | „Status noch nicht bestätigt“ mit erneutem Prüfen. |
| Fremde Event-ID im PATCH | C4 prüft `organizer_id = auth.uid()`, keine Mutation. |
| Event voll zwischen Anzeige und Klick | `409 EVENT_FULL`, Details aktualisieren. |
| Abgesagtes Event über Link | Details und Absage bleiben sichtbar, Teilnahmeaktion ist gesperrt. |
| Zweites Eventupdate aus altem Formular | `expectedVersion` passt nicht, `409 VERSION_CONFLICT`, neu laden statt überschreiben. |
| Wiederholte Absage | Keine zweite Absagebenachrichtigung. |
| Kapazität kleiner als aktive Zusagen | Transaktion abbrechen, bisherige Kapazität bleibt. |
| Beginnt während Anfrage | Maßgeblich ist die Prüfung mit Datenbankzeit unter der Sperre. |

`version` steigt auch bei Teilnahmeänderungen. Ein währenddessen offenes Bearbeitungsformular muss deshalb gegebenenfalls neu laden. Das ist bewusst einfach und konservativ. Eine spätere Aufteilung von Inhalts- und Teilnahmeversionen wäre erst bei häufigen störenden Konflikten nötig.

Die SQL-Tabellen speichern `published`/`cancelled` und `joined`/`withdrawn`. Bei abgesagtem Event zeigt die API „Event abgesagt“ anstelle einer aktiven Zusage. Historische Teilnahmezeilen werden nicht gelöscht. Die angezeigte aktive Belegung eines abgesagten Events ist null. Zeitstatus und Mindeststatus bleiben abgeleitet.

## 7. Hinweise und zurückgestellte Abläufe

`notifications` speichert kontoabhängige In-App-Hinweise. Sie entstehen synchron in derselben Transaktion wie Änderung, Zusage oder Absage. Die Kombination aus Empfänger, Event, Version und Art verhindert Doppelhinweise für denselben Zustandswechsel. Die Oberfläche lädt sie beim Öffnen und kann anschließend kurz pollend aktualisieren. Eine Zustellgarantie für E-Mail oder Push entsteht dadurch nicht.

DR-3.2.3 (Hinweis zwei Stunden vor Beginn bei zu geringer Mindestzahl) benötigt einen zeitgesteuerten Job mit eindeutiger Ausführungskennung. Dieser Job ist **noch nicht im SQL enthalten**. Ein künftiger Job muss Wiederholungen ohne doppelte Hinweise ermöglichen und Serverzeit/Zeitzone berücksichtigen. DR-4.3.1 verlangt einen Hinweis innerhalb 60 Sekunden. Der Entwurf persistiert den Eintrag sofort beim Commit; Browserabruf und tatsächliche Wahrnehmung sind gesondert zu testen.

Buchungsanfragen bleiben ein gesonderter Pilot. Ein `BookingService` und verlässliche externe E-Mails sind noch nicht implementiert oder durch das Kernschema abgedeckt. Ebenso gibt es keinen vorhandenen Bewertungsdienst. Die geplante Erweiterung darf die Teilnahme nicht als Hallenbestätigung ausgeben. Details stehen in [04_Datenmodell.md](04_Datenmodell.md).

## 8. Übernahme in die Implementierung

1. Next.js-/Supabase-Versionen festlegen und in Lockfile/Startanleitung festhalten. Keine Versionsnummer im Entwurf erfinden.
2. Neue Supabase-Testumgebung einrichten, SQL durch Datenbankreview und Migration prüfen, mindestens zwei Testkonten anlegen. Projektweite Default-Grants und bestehende Funktionen ebenfalls prüfen.
3. Sitzungsintegration und verifizierten Serverclient herstellen. Auth-Passwortgrenze gemäß Teamentscheidung konfigurieren.
4. Route Handler und Fachmodule implementieren. Kein Service-Key an C1 ausliefern, Koordinaten und Tokens aus Logs ausschließen.
5. Kritische Integrationstests aus dem folgenden Datenmodelldokument ausführen, danach UI-End-to-End-Tests und mobile/tastaturbasierte Bedienung prüfen.
6. Reale Sourcepfade, Commit/Build, Testdatum und Ergebnis in die Traceability-Matrix übernehmen. Die vorgeschlagenen Pfade dieses Dokuments gelten bis dahin nur als Plan.
