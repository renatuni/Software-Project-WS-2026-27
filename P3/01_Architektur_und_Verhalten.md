# SportMate – Architektur und Verhalten

Stand: 27.10.2026 · Präsentation 3: 28.10.2026 · Version 0.3 · Architekturentwurf zur Teamprüfung

## 1. Zweck und Leseführung

SportMate verbindet die Suche nach passenden Sporttreffen mit deren Organisation und einer verlässlichen Teilnehmerverwaltung. Die Architektur beschreibt deshalb nicht nur technische Kästen, sondern die Aufgaben der Anwendung, ihre Zusammenarbeit und die Stelle, an der eine Entscheidung verbindlich wird. Eine Person sucht zum Beispiel auf der Karte, öffnet ein Treffen und sagt zu. Die Oberfläche stellt den Ablauf dar; die geplante zentrale Verarbeitung prüft die Regeln; der gemeinsame Datenbestand hält die Zusage fest.

Die vier fachlichen Erklärbereiche heißen **Konto und Profil**, **Entdecken**, **Treffen organisieren** sowie **Teilnahme und Hinweise**. Es sind Bereiche derselben Anwendung. Sie bedeuten weder vier Server noch vier eigenständig betriebene Programme.

Dieses Dokument ergänzt den [bestehenden Architekturentwurf](../Dokumentationen/Architektur%20%26%20Entwurf.docx). Für den Einstieg eignen sich Abschnitt 2 und die Kontextgrafik. Abschnitt 4 zeigt die technischen Bausteine und Informationswege. Abschnitt 5 ordnet die vier Erklärbereiche den bereits entworfenen Fachmodulen zu. Abschnitt 6 führt typische Abläufe durch. Die [Detailentwurfsdokumentation](03_Detailentwurf_und_Schnittstellen.md) und das [Datenmodell](04_Datenmodell.md) konkretisieren Funktionen, Datenfelder und Rechte.

### Belastbarer Arbeitsstand

| Heute vorhanden | Geplante Zielanwendung | Noch kein Nachweis |
|---|---|---|
| Lokaler Browserdemonstrator mit Karte, Markern, Filtern, Details, Eventformularen und sequenzieller Teilnahmeverwaltung | Eine Next.js-Anwendung mit Fachlogik, Supabase Auth und dauerhafter PostgreSQL-Datenhaltung | Echte Anmeldung, gemeinsame Konten, dauerhafte Daten, geprüfte Datenbankrechte und Parallelzugriff |
| Leaflet 1.9.4 lokal, Online-Straßenkarte aus OpenStreetMap, eigener schematischer Offline-Fallback | Übernahme des Kartenadapters in die Webanwendung | GPS, Ortsnamensuche/Geocoding, echte Umkreisberechnung |
| Architektur-, Schnittstellen- und SQL-Entwurf | Implementierung und Abnahme dieser Verträge | Ausführung des SQL auf Supabase, produktiver Betrieb oder Teamfreigabe aller Arbeitsannahmen |

Die nachfolgend beschriebenen C2–C4-Abläufe sind **Zielentwurf**. Der Demonstrator simuliert ihre fachlich sichtbaren Ergebnisse im Browser. Seine kleine lokale Dateiauslieferung ist kein bereits vorhandenes Fachbackend.

<a id="systemkontext"></a>
## 2. Systemkontext und Systemgrenze

Ein Sporttreffen beschreibt Sportart, konkreten Treffpunkt, Beginn und Ende sowie die Zahl der verfügbaren Plätze. SportMate verwaltet dazu, wer organisiert und wer zugesagt hat. Der Kern endet bei der Unterstützung dieser Koordination. Er garantiert weder die tatsächliche Anwesenheit noch eine Reservierung einer Sportstätte.

Leicht lesbares Erklärmodell: [01a_Kontext.mmd](diagramme/01a_Kontext.mmd). Die Grafik zeigt Rollen, vier fachliche Aufgabenbereiche und die beiden externen Abhängigkeiten für Konten und Straßenkarten. Der technische Detailgrad folgt erst in der Bausteinsicht.

### 2.1 Rollen und erlaubte Handlungen

| Rolle | Typische Handlungen | Welche Beziehung verleiht Rechte? |
|---|---|---|
| Gast | Karte/Liste filtern, öffentliche Treffen und Belegung ansehen, Details öffnen | Öffentliche Lesesicht; noch keine persönliche Zusage oder Bearbeitung |
| Angemeldetes Mitglied | Eigenes Profil pflegen, Treffen erstellen, zu- und absagen, eigene Treffen und Hinweise lesen | Geprüfte Kontositzung und jeweils eigene Datensätze |
| Teilnehmer eines bestimmten Treffens | Eigene Zusage verwalten und berechtigte Teilnehmeransicht dieses Treffens lesen | Aktive Teilnahme an genau diesem Treffen |
| Organisator eines bestimmten Treffens | Eigenes Treffen ändern oder absagen, Teilnehmerübersicht erhalten | Gespeicherte Verantwortlichkeit am konkreten Event |
| Sportstättenbetreiber, späterer Pilot | Eigene Ressourcen und zugehörige Anfragen prüfen | Später administrativ vergebene Ressourcenzuordnung; im Kern noch nicht angebunden |
| Projektteam / technische Administration | Konfiguration, Datenbankänderungen, Fehleranalyse und Wiederherstellung verantworten | Separater technischer Arbeitsprozess, kein normales Veranstalterrecht |

„Teilnehmer“ und „Organisator“ sind Beziehungen zu einem Event. Ein Mitglied kann sein eigenes Treffen organisieren und an einem anderen teilnehmen. Eine gültige Anmeldung allein erlaubt nicht, alle Events oder fremde Teilnehmer zu verändern. Im P3-Arbeitsentwurf zählt der Organisator automatisch als erste aktive Teilnahme und kann sein Event absagen, jedoch nicht mit der gewöhnlichen eigenen Abmeldung die Verantwortung verlassen.

### 2.2 Eigene Anwendung und externe Leistungen

| Innerhalb der Verantwortung von SportMate | Von außen bereitgestellt | Nicht durch die externe Leistung erledigt |
|---|---|---|
| Oberfläche, Fachregeln, zulässige Antworten, Datenmodell, Rechtekonfiguration | Supabase Auth stellt Konten und Sitzungen bereit | Ob eine Person ein bestimmtes Event verändern darf |
| Events, Teilnahmen, Hinweise und deren Zugriffsregeln | PostgreSQL über Supabase hält Daten dauerhaft und bietet Datenbankmechanismen | Ob das entworfene Schema und seine Fachoperationen korrekt konfiguriert und getestet sind |
| Auswahl von Treffpunkten und Darstellung eigener Sportmarker | OSM-Kachelservice liefert geografische Kartenbilder | Suche nach SportMate-Events, Teilnehmerzahlen, Ortsnamensuche oder Verfügbarkeit von Sportstätten |
| Lokal eingebundene Kartenbibliothek und schematische Offlinekarte | Leaflet ist mitgelieferter Programmcode im Browser, kein eigener Netzwerkdienst | Konto-/Teilnahmeverwaltung oder dauerhafte Speicherung |

Eine Teilnahme bestätigt einen Eventplatz innerhalb SportMate. Eine eventuell spätere Hallenanfrage wird erst nach Betreiberentscheidung zur bestätigten Buchung. Bewertungen aus P2 bleiben ein gesonderter Vorschlag. Chat, Social Feed, Zahlung, automatische Direktbuchung und externe Kalenderintegration gehören nicht zum ausgearbeiteten Event-Kern.

## 3. Architekturansatz und Qualitätsziele

SportMate erhält **ein Next.js-Projekt mit getrennten Verantwortlichkeiten**. Die Präsentationsschicht stellt Inhalte im Browser dar. Die serverseitige Anwendungslogik bearbeitet Anfragen und prüft Fachregeln. Der gemeinsame Datenbestand sichert gültige Beziehungen und die zusammengehörigen Änderungen. Dieser Ansatz heißt modularer Monolith innerhalb einer Client-Server-Architektur.

Frontend und Fachlogik gehören zum selben Anwendungsprojekt. Die fachlichen Module werden dadurch nicht zu eigenständigen Diensten. Innerhalb des Servers sind einfache Funktionsaufrufe ausreichend. Nur die Übergänge zum Browser und zu den externen Supabase-Diensten benötigen Netzwerkkommunikation. Die Begründung einschließlich Alternativen steht in [den Architekturentscheidungen](02_Architekturentscheidungen.md).

| Ziel | Konkrete Entwurfsfolge | Sichtbarer Nutzen / spätere Prüfung |
|---|---|---|
| Verständliche Bedienung | Karte und Liste verwenden dieselben Treffer, Details erklären Belegung und eigenen Status | Nutzer erhalten keine widersprüchlichen Suchansichten |
| Verlässliche Zusagen | Platzprüfung und Eintrag werden gemeinsam in der Datenbank entschieden | Der letzte Platz darf auch bei Gleichzeitigkeit nur einmal vergeben werden |
| Geschützte Daten | Geprüfte Identität, Eigentumsregeln und begrenzte Datenansichten | Ein Mitglied kann kein fremdes Treffen ändern; private Kontaktdaten fehlen in öffentlichen Antworten |
| Änderbarkeit | Suchen und Organisieren sind benannte Verantwortlichkeiten, nutzen aber denselben Eventbestand | Ein zusätzliches Filterfeld braucht keinen zweiten Eventbestand oder Server |
| Überschaubarer Betrieb | Eine eigene Webanwendung, bestehende Dienste für Konten/Daten, lokal mitgelieferte Kartenbibliothek | Wenige zu betreibende Bestandteile für das Semesterteam |
| Nutzbarkeit bei Kartenausfall | Externer Straßenkartenlayer getrennt von Markern, Liste und Fachablauf | Schematische Offlinekarte und Liste bleiben bedienbar |
| Nachvollziehbarkeit | Anforderung, Baustein, Fachoperation und Prüffall bleiben verknüpft | Ein späterer Fehler lässt sich einem verantwortlichen Ablauf zuordnen |

Die Ziele beschreiben die Auswahl des Entwurfs, keine bereits gemessenen Qualitätswerte. Die Architektur benötigt dafür keine Microservices, keinen Eventbus und keine zusätzliche Nachrichtenplattform.

<a id="technische-bausteine"></a>
## 4. Technische Bausteine und Informationswege

### 4.1 Sichten auf dieselbe Anwendung

| Sicht | Frage | Bearbeitbares Modell |
|---|---|---|
| Kontext | Wer verwendet SportMate, was gehört dazu und was kommt von außen? | [01a_Kontext.mmd](diagramme/01a_Kontext.mmd) |
| Fachliche Zusammenarbeit | Welche Aufgaben erfüllen die vier Bereiche gemeinsam? | [01b_Fachmodule.mmd](diagramme/01b_Fachmodule.mmd) |
| Technische Bausteine | Welche C1–C5-Komponenten tragen welche Aufgabe und welche Informationen fließen? | [01_Komponenten.mmd](diagramme/01_Komponenten.mmd) |
| Ergänzende Betriebssicht | Was läuft heute lokal und was soll später gemeinsam betrieben werden? | [01c_Betrieb.mmd](diagramme/01c_Betrieb.mmd) |

Die einfache Kontextgrafik ist ein Erklärmodell. Das detaillierte Komponentenmodell enthält die feinere Aufteilung für Entwicklung und Fehlersuche. Beide zeigen dieselbe Architektur mit unterschiedlichem Ausschnitt; zusätzliche Kästen bedeuten keine zusätzlichen Server.

### 4.2 C1: Browseransichten und gemeinsame Bedienzustände

| Ansicht in C1 | Aufgabe | Wichtige Beziehungen |
|---|---|---|
| Karte und Ergebnisliste | Suchtreffer als Sportmarker und lesbare Liste anzeigen; ausgewähltes Event hervorheben | Gleiche Trefferquelle, gemeinsame Event-ID und Filter; Marker öffnet dieselben Details wie die Liste |
| Suchfilter | Sportarten, Niveau und weitere freigegebene Kriterien erfassen | Verändert Treffer in Karte und Liste gemeinsam; Anzeige „Keine Treffer“ nur nach erfolgreicher Suche |
| Eventdetails | Treffpunkt, Zeit, Niveau, Belegung, Mindestzahl und eigenen Teilnahmestatus erklären | Ausgangspunkt für Zusage/Rückzug, Teilen und berechtigte Bearbeitung |
| Konto-/Profilformulare | Anmeldung und eigene Profilangaben bearbeiten | Sitzung kommt vom Kontendienst; öffentliches Profil bleibt vom privaten Konto getrennt |
| Eventformulare | Vollständige Eventdaten erfassen, Pflichtfehler am passenden Feld zeigen | Kartenpunkt liefert öffentliche Eventkoordinaten; bestätigtes Speichern liefert Event-ID und aktuellen Stand |
| Meine Treffen | Eigene Zusagen und organisierte Events zusammenführen | Dieselben Events/Teilnahmen wie in Suche und Details, kein zweiter persönlicher Eventbestand |
| Persönliche Hinweise | Änderungen mit Eventbezug verständlich zeigen | Nur eigene Hinweise; Öffnen führt zum aktuellen Eventstand |

Eine Event-ID verbindet Marker, Liste, Details, Teilnahme und Hinweise. Wenn jemand ein Event auswählt, ändert dies die Darstellung und den Auswahlzustand. Es erzeugt noch keine Teilnahme. Ein Kartenklick im Erstellungsformular wählt dagegen einen neuen öffentlichen Treffpunkt. Diese beiden Bedienabsichten sind zu unterscheiden.

### 4.3 Stabile Komponenten C1–C5

| ID | Baustein | Entscheidung / Datenverantwortung | Grenze |
|---|---|---|---|
| C1 | Browseroberfläche | Erfasst Aktionen und erklärt bestätigte Ergebnisse; hält vorübergehende Filter-, Formular- und Auswahlzustände | Eine angezeigte freie Kapazität oder ein ausgeblendeter Knopf ist keine endgültige Fachentscheidung |
| C2 | Ein Next.js-Projekt mit serverseitigen Fachmodulen | Prüft Sitzung und Eingaben, führt den passenden Anwendungsfall aus, liefert die zulässige Sicht zurück | Keine privaten Kontodaten in öffentlichen Antworten; keine fremde Benutzer-ID als Vertrauensgrundlage |
| C3 | Supabase Auth | Maßgebliche Identität, Anmeldung und Sitzungen | Identität ist noch keine Eigentums-/Organisatorberechtigung |
| C4 | PostgreSQL über Supabase | Dauerhafte Fachdaten, Beziehungen, begrenzte Zugriffe und gemeinsam ausgeführte Fachänderungen | Kapazität benötigt eine gemeinsame Transaktion; eine reine Sichtbarkeitsrichtlinie reicht nicht |
| C5 lokal | Kartenadapter mit Leaflet in C1 und schematischem Fallback | Zeichnet öffentliche Eventmarker, synchronisiert Auswahl/Treffer und übernimmt Punktwahl | Keine eigene Eventsuche und keine Teilnahmeentscheidung |
| C5 extern | OSM-Standardkachelservice | Liefert geografische Bilder für den sichtbaren Ausschnitt | Kennt keinen SportMate-Fachbestand; GPS, Geocoding und Umkreis sind andere Funktionen |

C5 ist eine **logische Integrationsgrenze mit zwei Teilen**, kein weiterer SportMate-Server. Leaflet liegt im Browser; die geografischen Kacheln kommen bei Onlinebetrieb von außen. Der Komponentenname bleibt für die Traceability C5. Das detaillierte Modell platziert den lokalen Teil innerhalb C1 und den externen Teil außerhalb der eigenen Anwendung.

### 4.4 Konnektoren: Anfrage, Antwort und Wirkung

| ID | Verbindung | Was wird angefragt? | Was kommt zurück / wird geändert? | Fehlergrenze |
|---|---|---|---|---|
| K1-L | C1 ↔ C2, HTTPS lesend | Filter, Event-ID, eigene Übersichten oder Hinweise | Freigegebene Treffer/Details bzw. eigene Einträge; keine private Vollkopie aller Tabellen | Suche ohne Treffer ist ein Erfolg; nicht erreichbare Datenquelle ist ein Fehler |
| K1-S | C1 ↔ C2, HTTPS schreibend | Profilwerte, Eventdaten, Zusage, eigener Rückzug oder Eventabsage | Bestätigter gespeicherter Zustand oder verständlicher Fach-/Feldfehler | Erfolg erst nach verbindlicher Antwort; bei unbekanntem Ergebnis erneut eigenen Status lesen |
| K2 | C2 ↔ C3, HTTPS | Konto-/Anmeldeablauf oder Prüfung der aktuellen Sitzung | Geprüfte Identität bzw. ungültige/abgelaufene Sitzung | Erneute Anmeldung mit sicherem Rücksprung zum Event |
| K3-L | C2 ↔ C4, Supabase-Schnittstelle über HTTPS | Zulässige Profile/Eventdaten, Belegung, eigene Teilnahmen/Hinweise | Begrenzte Datenansicht im jeweiligen Nutzerkontext | Leserechte gelten auch außerhalb der vorgesehenen Oberfläche |
| K3-S | C2 ↔ C4, geprüfte Fachoperationen über HTTPS | Speichern/Ändern im verifizierten Nutzerkontext | Gemeinsamer Abschluss aller betroffenen Daten oder Abbruch ohne Teiländerung | Fremdes Eigentum, ausgebuchtes/abgesagtes/begonnenes Event und veraltete Formulare ablehnen |
| K4 | C5 lokal ↔ C5 extern, HTTPS | Kachelindizes des sichtbaren Ausschnitts | Geografische Kartenbilder | Bei Kachelfehlern gekennzeichneten Offline-Fallback verwenden; Liste/Marker bleiben unabhängig |
| K5, später | Ortsnamensuche, noch nicht verbunden | Geplanter Ortsname oder Suchpunkt | Geplante Auflösung/Umkreissuche | Anbieter und genauer Aufrufweg noch offen; der Kacheldienst ist kein Geocoding-Dienst |

K1-L/K1-S sowie K3-L/K3-S verfeinern die bisherigen Konnektoren K1 und K3 nach Lesen/Schreiben. Es entstehen dadurch keine zusätzlichen Dienste. Innerhalb C1 werden Karte und Liste lokal synchronisiert. Innerhalb C2 arbeiten Fachfunktionen im selben Projekt. Beide internen Verbindungen sind keine zusätzlichen Netzwerkschnittstellen.

Ein typischer Antwortweg lautet: Datenbank bestätigt den neuen Zustand an C2; C2 liefert den erlaubten eigenen Status und die aktuelle Belegung an C1; C1 aktualisiert Details und gegebenenfalls „Meine Treffen“. Andere Browser erhalten dadurch noch keine automatische Echtzeitnachricht. Ihre Aktualisierung benötigt das geplante Neuladen/Abrufen; eine Live-Synchronisierung aller offenen Browser ist nicht als umgesetzt behauptet.

### 4.5 Vertrauensgrenzen und datensparsame Antworten

- **Browser zu Fachverarbeitung:** Alle IDs, Felder und Rollenbehauptungen werden geprüft. Die Identität stammt aus der validierten Sitzung, nicht aus einem frei gewählten Formularfeld. Normale Nutzeränderungen verwenden keinen administrativen Dienstschlüssel.
- **Fachverarbeitung zu Datenbank:** Rechte begrenzen lesbare Daten. Kritische Änderungen laufen nur über die vorgesehenen Fachoperationen. Wenn eine Datenbankfunktion zusätzliche Rechte benötigt, prüft sie die aufrufende Identität und das Eigentum selbst und erhält nur begrenzte Ausführungsrechte.
- **Öffentliche Daten zu persönlichen Daten:** Öffentliche Eventkoordinaten sind bewusst sichtbare Treffpunkte. Ein persönlicher Suchstandort oder eine E-Mail-Adresse ist keine öffentliche Eventangabe. Teilnehmernamen sind nur für die nach Fachregel Berechtigten vorgesehen; öffentlich reicht die Belegungszahl.
- **Browser zu Kartendienst:** OSM erhält Kachelanfragen und damit IP-Adresse und Ausschnitt. Eventmarker, Teilnehmernamen und Eventbeschreibungen werden lokal gezeichnet und nicht als SportMate-Datensätze an den Kachelservice geschickt. Die Demo fragt keinen GPS-Standort ab. Der Quellenhinweis bleibt sichtbar.

Die Darstellung eines vorgesehenen Weges über C2 schützt nicht automatisch die Daten-API. Direkte Aufrufe müssen dieselben Rechte und Fachregeln respektieren. Genauere Rechte und Funktionsgrenzen stehen im [Datenmodell](04_Datenmodell.md).

<a id="fachliche-zusammenarbeit"></a>
## 5. Fachliche Zusammenarbeit und Verantwortung der Regeln

### 5.1 Vier Erklärbereiche und bestehende Fachmodule

| Erklärbereich für Vortrag / Produkt | Teilverantwortung in C2 | Bereits benannte Module im Detailentwurf | Eigene Daten / Ergebnisse |
|---|---|---|---|
| Konto und Profil | C2-A: Auth/Profile | `AuthService`, `ProfileService` | Geprüfte Identität, eigenes Fachprofil und Sportarten/Niveaus |
| Entdecken | C2-E: Suche/Eventdetails; Kartenadapter in C1/C5 | Lesende Funktionen des `EventService`, Kartenadapter | Gemeinsame Treffer, Eventdetails, sichtbare Belegung und Treffpunkt |
| Treffen organisieren | C2-O: Organisation | Schreibende Funktionen desselben `EventService` | Neues/geändertes/abgesagtes Event mit verantwortlichem Organisator |
| Teilnahme und Hinweise | C2-T: Teilnahme, C2-H: Hinweise | `ParticipationService`, `NotificationService` | Eigene Zusage/Rückzug, berechtigte Namenliste und persönliche Hinweise |

Das vereinfachte Viererbild fasst fünf serverseitige Verantwortungsbereiche zusammen. Es teilt den `EventService` für die Erklärung in lesendes Entdecken und schreibende Organisation. Es wird deshalb kein zusätzlicher `OrganisationService` vorausgesetzt. Die Modul- und Funktionsnamen des [Detailentwurfs](03_Detailentwurf_und_Schnittstellen.md) bleiben maßgeblich.

### 5.2 Wie die Bereiche zusammenarbeiten

- **Konto und Profil mit Organisation/Teilnahme:** Beide schreibenden Abläufe benötigen eine geprüfte Identität. Das Kontomodul bestätigt, wer handelt. Organisation und Teilnahme prüfen anschließend, ob diese Person genau diese Handlung ausführen darf.
- **Organisation mit Entdecken:** Ein veröffentlichtes Event gelangt in denselben Eventbestand, den die Suche liest. Änderungen überschreiben keine unabhängige Kopie in einer Karte. Nach erfolgreicher Änderung wird die aktuelle Eventansicht neu geladen.
- **Entdecken mit Teilnahme:** Die Suche liefert einen passenden Kandidaten. Details erklären Belegung und Status. Erst eine eigene Zusage reserviert einen Platz. Die nachfolgend aktualisierte Belegung wirkt wieder in Details, Liste und Markern.
- **Organisation/Teilnahme mit Hinweisen:** Eine Fachänderung und die dazugehörigen dauerhaften Hinweise werden gemeinsam gespeichert. Das Hinweismodul zeigt diese Einträge später an. Es ist kein externer Nachrichtenversand und keine zweite unabhängige Speicherrunde nach einer schon abgeschlossenen Eventänderung.
- **Meine Treffen mit dem gemeinsamen Bestand:** Die persönliche Übersicht ist eine gefilterte Sicht auf eigene Organisation und eigene Teilnahmen. Sie besitzt keine separat gepflegte Teilnehmerzahl und keinen losgelösten Eventstatus.

### 5.3 Welche Regeln gehören wohin?

| Regel / Entscheidung | C1 unterstützt | C2 verantwortet | C4 sichert endgültig |
|---|---|---|---|
| Pflichtangaben und erlaubte Werte | Fehlende Felder früh markieren | Eingaben erneut auf erlaubte Werte prüfen | Feste Datenbedingungen, z. B. Ende nach Beginn und Kapazität 2–50 |
| Wer darf ein Event ändern? | Bearbeiten nur an sinnvoller Stelle anbieten | Sitzung und konkrete Organisatorbeziehung prüfen | Eigentumsprüfung in den kontrollierten Schreibfunktionen und passende Zugriffsrechte |
| Ist der letzte Platz noch frei? | Momentaufnahme anzeigen | Zugehörigen Anwendungsfall aufrufen, Ergebnis erklären | Prüfen und Eintragen unter gemeinsamer Eventsperre abschließen |
| Kann jemand doppelt zusagen? | Doppelbedienung vermeiden | Wiederholung als denselben fachlichen Vorgang behandeln | Genau eine Beziehung aus Event und Konto; vorhandene Zusage wiedererkennen |
| Zählt der Organisator mit? | Eigene Teilnahme anzeigen | Erstellung als einen vollständigen Anwendungsfall behandeln | Event und erste Organisatorteilnahme gemeinsam anlegen |
| Was passiert bei Ort-/Zeitänderung? | Aktuellen Inhalt und späteren Hinweis anzeigen | Eigentum und neuen Inhalt prüfen | Änderung und Hinweise für aktuell Angemeldete gemeinsam speichern |
| Wann gilt ein Event als ausgebucht? | Anzeige aus aktueller Belegung und Kapazität ableiten | Zulässige aktuelle Ansicht liefern | Maßgebliche aktive Teilnahmen und Kapazität speichern |
| Woher kommt der Kartenmarker? | Gespeicherte Eventkoordinaten zeichnen | Dieselben Treffer/Koordinaten für Liste und Karte liefern | Öffentlichen Eventpunkt speichern; keine zusätzliche Kartentabelle erforderlich |

C3 ist für Identität und Sitzung zuständig. C5 ist für Kartenbedienung und Kartengrundlage zuständig. Beide entscheiden weder über Eventeigentum noch über freie Teilnehmerplätze. So bleiben fachliche Fehler einem klaren Verantwortungsbereich zuordenbar.

### 5.4 Gemeinsamer Datenbestand und sichere Lesesichten

`profiles`, `profile_sports` und `sports` beschreiben Profile und Sportauswahl. `events` enthält das Treffen einschließlich Organisator, Zeit, Kapazität, Mindestzahl und konkreter Ortskopie; `venues` ist eine optionale bekannte Sportstätte. `participations` hält genau eine Konto-/Eventbeziehung mit ihrem Status. `notifications` hält persönliche Änderungshinweise. Authentifizierungsdaten bleiben bei C3 außerhalb dieser öffentlichen Fachansichten.

Die aktive Teilnehmerzahl wird aus den passenden `joined`-Teilnahmen ermittelt. „Ausgebucht“ und „Findet statt“ sind daraus abgeleitete Anzeigen. Die Karte speichert keine zweite Teilnehmerzahl. Hinweise sind eigenständige persönliche Einträge, damit sie nach Schließen einer Eventseite wieder gelesen werden können. Eine vollständige unveränderliche Teilnahmehistorie ist dagegen noch nicht Teil des Kernmodells.

## 6. Typische Abläufe und Übergänge

Die folgenden Abläufe verbinden sichtbare Handlungen, fachliche Verarbeitung und Datenwirkung. Sie beschreiben die Zielanwendung. Die lokale Demo bildet einen Ausschnitt sequenziell nach.

### 6.1 Entdecken: Filter, Karte und Details

1. Eine Person öffnet SportMate und wählt etwa Badminton und ein passendes Niveau. Ein eigener GPS-Standort ist dafür nicht erforderlich.
2. C1 übermittelt die freigegebenen Suchkriterien an C2-E. Der geplante Server prüft Werte und liest aus C4 nur passende veröffentlichte, noch nicht begonnene Events. Die zukünftige Umkreisfunktion gehört zu demselben Suchvertrag, ist in der Demo aber noch offen.
3. C2 gibt dieselben Event-IDs, Ortskoordinaten und Kurzangaben für Karte und Liste zurück. C1 zeichnet die Treffer als Sportmarker und Listeneinträge. C5 lädt ausschließlich die geografische Kartengrundlage.
4. Ein Marker oder Listeneintrag wählt dasselbe Event. Die Details erklären Treffpunkt, Zeit, Niveau, Kapazität, Belegung und zulässige Aktionen.
5. Ohne Treffer erscheint ein verständlicher Leerzustand. Bei einer nicht erreichbaren Datenquelle erscheint ein Fehler mit Wiederholungsmöglichkeit. Bei fehlenden OSM-Kacheln bleiben die Treffer auf der schematischen Karte und in der Liste bedienbar.

**Ergebnis:** Eine informierte Auswahl, noch keine Zusage. Die technische Suche, Kartenbilder und Teilnahme sind unterschiedliche Aufgaben.

### 6.2 Organisieren: ein Treffen veröffentlichen

1. Ein angemeldetes Mitglied öffnet das Eventformular, nennt Sportart, Zeit, Kapazität und Mindestzahl und wählt einen Treffpunkt mit Beschreibung und Koordinaten.
2. C2-A bestätigt die Identität. C2-O prüft Pflichtfelder, Werte und zeitliche Regeln. Eine unvollständige Eingabe wird mit Feldhinweisen zurückgegeben.
3. `create_event` legt in C4 das veröffentlichte Event und die Teilnahme des Organisators gemeinsam an. Entweder existiert beides oder nichts davon.
4. Die bestätigte Event-ID führt zu den Details. Das Event erscheint in der Suche und unter eigener Organisation. Die automatische erste Teilnahme zählt zur Kapazität.

Bei späterer Bearbeitung prüft derselbe organisatorische Bereich das Eigentum und den bekannten Änderungsstand. Ein veraltetes Formular soll keine neuere Änderung überschreiben. Eine neue Kapazität unter der Zahl aktiver Zusagen wird abgewiesen.

### 6.3 Teilnehmen: eine Zusage verbindlich speichern

1. Details zeigen beispielsweise neun belegte Plätze bei Kapazität zehn. Dieser Stand ist eine Momentaufnahme.
2. „Bin dabei“ führt bei fehlender Sitzung zur Anmeldung mit Rücksprung zu genau diesem Event. Ein willkürlicher fremder Rücksprung ist nicht vorgesehen.
3. C2-T prüft die Anfrage und ruft die kontrollierte Teilnahmeoperation mit dem Nutzerkontext auf.
4. C4 sperrt das betroffene Event, prüft Status und Beginn, erkennt eine vorhandene eigene Zusage und zählt die aktive Belegung. Ist ein Platz frei, wird die eigene Teilnahme angelegt oder reaktiviert. Hinweise entstehen im selben Abschluss.
5. Erst nach erfolgreichem Abschluss zeigt C1 die Zusage. Die Details laden den maßgeblichen eigenen Status und die Belegung neu. „Meine Treffen“ verwendet dieselbe Beziehung.
6. Ist das Event inzwischen voll, erhält die Person „Ausgebucht“. Geht die Antwort verloren, fragt die Oberfläche den eigenen gespeicherten Status ab und rät keinen Erfolg.

**Konkurrenzfall:** Zwei Personen können denselben letzten freien Platz sehen. Die gemeinsame Entscheidung in C4 lässt nur eine weitere Zusage zu. Der zweite Vorgang liest nach dem Warten den aktualisierten Stand. Ein Browserknopf allein könnte dies nicht absichern.

### 6.4 Eigene Teilnahme zurückziehen und ganzes Event absagen

| Ablauf | Berechtigung | Gemeinsame Änderung | Rückmeldung |
|---|---|---|---|
| Eigene Teilnahme absagen | Aktives eigenes Konto, zukünftiges veröffentlichtes Event, nicht dessen Organisator | Eigene Beziehung auf `withdrawn`, neue Eventversion und Hinweis an den Organisator | „Du bist abgemeldet“, Platz wieder frei; fremde Zusagen bleiben bestehen |
| Ganzes Event absagen | Organisator dieses zukünftigen Events | Event auf `cancelled`, neue Eventversion, Hinweise an angemeldete Konten | Absage bleibt über Details und eigene Übersicht sichtbar; keine neuen Zusagen |
| Wiederholte Absage | Derselbe erlaubte Vorgang | Kein zweiter gleicher Zustandswechsel und keine zweite Hinweisrunde | Bereits vorhandenen Absagestand bestätigen |

Bei Eventabsage bleiben historische Teilnahmezeilen erhalten. Die angezeigte aktive Belegung ist null, weil das Treffen nicht stattfindet. Eine Eventabsage ist kein Hallenstorno. Umgekehrt sagt eine spätere stornierte Hallenbuchung nicht automatisch das Event ab.

### 6.5 Technischer Nachweis des letzten Platzes

Bearbeitbare Quelle: [02_Sequenz_Teilnahme.mmd](diagramme/02_Sequenz_Teilnahme.mmd). Die gemeinsame Invariante lautet `aktive Teilnahmen ≤ Kapazität`. Beitreten, eigener Rückzug, Eventänderung und Eventabsage müssen auf dieselbe Eventzeile zugreifen und ihre Änderung gemeinsam abschließen. Dadurch können eine Kapazitätssenkung und eine parallele Zusage die Regel nicht unabhängig voneinander umgehen.

Der eindeutige Schlüssel aus Event und Konto verhindert eine zweite Teilnahmezeile. Eine wiederholte Zusage liefert im weiterhin gültigen Eventfenster den bestehenden Zustand. Nach Beginn oder Absage wird der geschlossene Eventzustand zuerst geprüft. Die Einzelheiten sind im [Detailentwurf](03_Detailentwurf_und_Schnittstellen.md) und im [SQL-Entwurf](datenmodell/schema.sql) festgehalten. Ein echter Zwei-Client-Test bleibt erforderlich; die Demo weist nur die nacheinander bedienten Fälle nach.

### 6.6 Konsistenter Vertrag der vorhandenen SQL-Entwürfe

Diese Tabelle beschreibt die **tatsächlich im lokalen `schema.sql` entworfenen** Rückgaben. Es sind keine bereits auf Supabase ausgeführten Funktionen. Die Unterstrichnamen dienen hier der technischen Weiterarbeit; für den Vortrag genügen Zusagen, Rückzug, Änderung und Absage.

| Operation | Erfolgsrückgabe im SQL-Entwurf | Fachliche Abbrüche im SQL-Entwurf |
|---|---|---|
| `join_event(p_event_id)` | `joined` oder `already_joined` | `AUTH_REQUIRED`, `EVENT_NOT_FOUND`, `EVENT_CANCELLED`, `EVENT_STARTED`, `EVENT_FULL` |
| `leave_event(p_event_id)` | `withdrawn` oder `already_withdrawn` | `AUTH_REQUIRED`, `EVENT_NOT_FOUND`, `ORGANIZER_MUST_CANCEL_EVENT`, `EVENT_CANCELLED`, `EVENT_STARTED` |
| `update_event(...)` | Neue ganzzahlige Eventversion | `AUTH_REQUIRED`, `EVENT_NOT_FOUND`, `FORBIDDEN`, `EVENT_CANCELLED`, `EVENT_STARTED`, `VERSION_CONFLICT`, `CAPACITY_BELOW_ATTENDANCE` sowie Tabellenbedingungen für ungültige Daten |
| `cancel_event(p_event_id)` | `cancelled` oder `already_cancelled` | `AUTH_REQUIRED`, `EVENT_NOT_FOUND`, `FORBIDDEN`, `EVENT_STARTED` |

C2 übersetzt diese Rückgaben und Exceptions in die verständlichen Ergebnisse und HTTP-Antworten des Detailentwurfs. Ein Serverfehler oder eine verletzte Tabellenbedingung darf nicht als erfolgreiche Teilnahme ausgegeben werden.

## 7. Zustände und abgeleitete Anzeigen

Bearbeitbare Quelle: [03_Zustaende.mmd](diagramme/03_Zustaende.mmd).

### 7.1 Event und Teilnahme

Ein Event hat als gespeicherten Lebenszyklus mindestens `published` / `cancelled`. Ein noch nicht veröffentlichtes Formular ist ein lokaler Entwurf, solange kein serverseitiger Entwurfsmodus implementiert wird. Zeit- und Belegungsanzeigen werden aus Daten abgeleitet:

- „Ausgebucht“ bedeutet aktive Belegung gleich Kapazität. Eine Absage einer Teilnahme kann die Anzeige wieder öffnen.
- „Begonnen“/„Vergangen“ folgt aus Beginn/Ende. Die Information bleibt über den Direktlink nachvollziehbar.
- „Sucht Mitspieler“/„Findet statt“ aus DR-3.2 wird im P3-Arbeitsentwurf aus `min_participants` und der aktiven Belegung abgeleitet. Die Mindestzahl ist ein echtes Feld mit `2 ≤ min_participants ≤ capacity`; sie erzeugt keinen zusätzlichen gespeicherten Eventstatus. Teamfreigabe und zeitgesteuerter Hinweis bleiben offen.
- „Event abgesagt“ überlagert die eigene Teilnahmehistorie und sperrt neue Zusagen. Historische Teilnahmedaten müssen nicht gelöscht werden, um die aktive Platzbelegung aufzuheben.

Eine Teilnahme hat `joined` / `withdrawn`; eine erneute Zusage reaktiviert dieselbe Beziehung nur, solange die Eventregeln es erlauben. Das Datenmodell konkretisiert die Speicherung. Der vorhandene SQL-Entwurf ermittelt die aktive Zahl aus den Teilnahmen; ein zusätzlicher unabhängig gepflegter Belegungszähler ist nicht vorgesehen.

### 7.2 Buchungsanfragen, optionaler Pilot

Der Pilot benötigt einen getrennten Zustandsautomaten:

`angefragt` → `bestätigt` / `abgelehnt` / `zurückgezogen`

`bestätigt` → `Storno angefragt` → `storniert` oder bei begründeter Ablehnung zurück zu `bestätigt`

Bestätigte Buchungen und offene Stornoanfragen blockieren die Ressource weiterhin. Die Zeitintervalle sind halboffen `[Beginn, Ende)`, sodass 18–19 Uhr und 19–20 Uhr nebeneinander möglich sind. Eine Bestätigung muss interne Überschneidungen atomar abweisen. Ohne externe Kalenderintegration wird keine vollständige Verfügbarkeit zugesagt; der Betreiber bestätigt einen manuellen Kalenderabgleich.

Ein abgesagtes Event storniert nicht automatisch eine Hallenbuchung. Ein stornierter Hallentermin sagt nicht automatisch das Event ab. Beide Sachverhalte müssen sichtbar sein und bewusst behandelt werden.

## 8. Fehler- und Ausfallverhalten

| Fall | Erwartetes Verhalten | Architekturmaßnahme |
|---|---|---|
| Suche erfolgreich, kein Treffer | Leerzustand mit bearbeitbaren Filtern und Möglichkeit zum Erstellen | Erfolgreiche leere Ergebnismenge getrennt von Fehlern behandeln |
| Suchdienst nicht erreichbar | Fehler mit Wiederholungsmöglichkeit | Kein irreführendes „Keine Events gefunden“ |
| Supabase-Auth-Sitzung ungültig | Anmeldung und sicherer Rücksprung zum eigenen Ablauf | Sitzung serverseitig validieren, Rücksprung nur auf erlaubte interne Ziele |
| Antwort nach Beitritt verloren | „Status nicht bestätigt, erneut prüfen“ | Persistierten eigenen Status lesen; idempotenter Beitritt verhindert Doppelbelegung |
| Event inzwischen voll | „Ausgebucht“, aktualisierte Belegung | Atomare Fachoperation liefert Konflikt ohne Teiländerung |
| Nutzer versucht fremdes Event zu ändern | Zugriff verweigert, Zustand unverändert | Serverseitige Eigentumsprüfung und Datenbankrechte |
| Geografische Kacheln laden nicht | Gekennzeichnete schematische Offlinekarte mit Markern; Liste und Details bleiben nutzbar | Lokale Bibliothek/Marker vom externen Tilelayer trennen; keine Offline-Kachelarchive |
| Profil-/Eventtext enthält HTML | Darstellung als Text | Serverseitige Validierung und sichere Textausgabe |
| Änderungshinweis kann nicht gespeichert werden | Kein stillschweigend vollständiger Änderungserfolg | Eventänderung und dauerhafte Hinweise gemeinsam committen oder vollständig zurückrollen |

## 9. Hinweise und Ereignisse ohne zusätzliche Infrastruktur

Der kleinste konsistente Ansatz speichert dauerhafte In-App-Hinweise in derselben Datenbanktransaktion wie die Eventänderung. Ein Änderungsbezug und eine Empfänger-ID verhindern doppelte Hinweise bei technischer Wiederholung. Das benötigt zunächst keinen Eventbus und keinen separaten Nachrichtendienst.

Das erfüllt nur einen In-App-Vertrag. DR-4.3.1 fordert einen Hinweis innerhalb von 60 Sekunden, DR-5.1.3 eine Betreiber-E-Mail. Diese Zusagen brauchen einen festgelegten Kanal sowie einen überprüfbaren Zustellungs-/Abrufmechanismus. Regelmäßiges Nachladen einer geöffneten Hinweisansicht wäre ein möglicher Arbeitsvorschlag für In-App-Aktualisierung, beweist aber keine Benachrichtigung einer geschlossenen App. Für E-Mail wäre später ein Provider plus wiederholbarer Versand aus einer ausfallsicheren Auftragsliste erforderlich. Diese Erweiterung ist im vorliegenden Entwurf nicht als umgesetzt markiert.

<a id="betrieb"></a>
## 10. Verteilung und Betrieb

| Umgebung | Geplante Bestandteile | Zweck / Regeln |
|---|---|---|
| Heutige lokale Demo | Browser, mitgelieferte Dateien und optional `prototyp/start.py` zur lokalen Dateiauslieferung; Leaflet lokal, OSM online | Keine echte Authentifizierung und keine zentrale Fachdatenbank; Browserzustand bis Neuladen. Doppelklick verwendet ausschließlich die schematische Karte |
| Geplante lokale Entwicklung der Zielanwendung | Next.js-Prozess, Konfiguration, lokale oder separate Supabase-Testinstanz | Keine echten Nutzer- oder Produktivdaten; Startanleitung und Testkonten dokumentieren |
| Vorschau/Test | Ein Deploy der Next.js-Anwendung, getrennte Supabase-Umgebung | Akzeptanztests und Teamreview, reproduzierbare Migrationen und Testdaten |
| Späterer Pilot | Next.js-Hosting, Vercel bisher nur geplant; Supabase Auth/PostgreSQL; Kartenintegration mit vor Betrieb geprüfter Anbieterwahl | Anbieter-/Region-/Backup-/Monitoring-Entscheidung vor echtem Betrieb abschließen |

Bearbeitbare Verteilungssicht: [01c_Betrieb.mmd](diagramme/01c_Betrieb.mmd). Die obere Hälfte zeigt die vorhandene Demo, die untere den geplanten Betrieb. Die Demo-Anleitung steht in [07_Prototyp_und_Demo.md](07_Prototyp_und_Demo.md).

Statische Oberflächenbestandteile und serverseitige Funktionen gehören zum gleichen Anwendungsprojekt. Eine zusätzliche Microservice-Landschaft, Kubernetes oder eigene Authentifizierung ist für den beschriebenen Projektumfang nicht erforderlich.

Schlüssel liegen außerhalb des Quellcodes. Es wird zwischen veröffentlichbarer Projektkonfiguration und administrativen Geheimnissen unterschieden. Fehlende Pflichtkonfiguration muss beim Start verständlich benannt werden, ohne Werte auszugeben. Authentifizierte bzw. personalisierte Antworten dürfen nicht zwischen Konten über einen gemeinsamen Cache geteilt werden. Suchkoordinaten sollen nicht in dauerhafte Kontodaten oder Anwendungslogs gelangen.

### Betriebsablauf und Verantwortung

Beim Aufruf lädt der Browser die SportMate-Oberfläche und die lokale Kartenbibliothek. Im Zielbetrieb gehen Suchen und Änderungen an das eine Next.js-Projekt. Dieses nutzt die externe Konten-/Datenplattform. Nur die Kartenbilder lädt der Browser direkt vom OSM-Kachelservice. Die Sportmarker kommen weiterhin aus dem Fachbestand von SportMate.

Das Team verantwortet Konfiguration, Migrationen, freigegebene Testdaten, Datenbankrechte und nachvollziehbare Fehlerdiagnose. Ein ausgefallener Kontendienst sperrt neue Anmeldung und persönliche Änderungen. Eine ausgefallene Fachdatenbank verhindert bestätigte Zusagen; die Oberfläche darf dann keinen Erfolg behaupten. Ein ausgefallener Kacheldienst betrifft dagegen die Straßenkartengrundlage und soll den übrigen Eventablauf nicht blockieren.

Vorschau/Test und späterer Pilot benötigen getrennte Daten und Konfiguration. Änderungen am Schema gehören in eine überprüfbare Migration. Nach einer Änderung der Berechtigungen müssen erlaubte und unerlaubte Direktaufrufe geprüft werden. Ein Restore-Verfahren, ein Löschkonzept und Tests des Zugriffsschutzes gehören vor einen echten Pilotbetrieb. Dies sind Arbeitsaufträge, keine bereits erbrachten Betriebsnachweise.

## 11. Widersprüche und Entscheidungen vor Implementierung

| Punkt | Vorliegende Varianten | P3-Arbeitsstand |
|---|---|---|
| Kartenumfang | P2 und DR-2.1 nennen Karte im MVP; Architekturdokument nennt sie optional | Nutzer bestätigt am 27.10.2026 die Kartenwahl. P3 integriert Leaflet/OSM mit synchroner Liste und Eventpunktwahl. GPS, Geocoding, Radius und Such-API bleiben offen |
| Organisator zählt zur Kapazität | DR-3.1.5 automatisch erste Teilnahme; SM-R-Begriffe nur bei zusätzlicher Anmeldung | Arbeitsvorschlag gemäß DR/P2: Organisator wird automatisch als erste aktive Teilnahme eingetragen. Kein Sonderzähler; eigene Abmeldung des Organisators gesperrt, stattdessen Eventabsage |
| Kapazitätsgrenze | DR-3.1.1: 2–50; SM-R07: 2–100 | Einheitlicher P3-Arbeitsvorschlag: 2–50 in Schema, Validierung, Prototyp und Tests, Teamfreigabe offen |
| Ende der Auffindbarkeit | DR-2.1.4 ab Ende entfernen; SM-R03 bereits gestartete Events aus Suche entfernen | Für neue Teilnahme nur zukünftige Starts vorsehen, laufende Events nur nach ausdrücklicher Produktentscheidung zusätzlich auffindbar |
| Mindestteilnehmer | DR-3.2.1–3 mit Schwelle und Hinweis; SM-R-Katalog hat keine Mindestzahl | P3 übernimmt `min_participants` als Feld und leitet den Mindestzahlstatus ab. Automatischer Hinweis zwei Stunden vor Beginn benötigt einen geplanten Scheduler und ist noch nicht umgesetzt |
| Passwortlänge | DR-1.1.2 mindestens 8; SM-R01-AK1 verwendet 12 Zeichen | P3-Sicherheitsvorschlag mindestens 12 Zeichen, ausdrückliche Anforderungsänderung zur Teamprüfung; lokale Demo speichert keine Passwörter |
| Hinweise/E-Mail | DR mit 60-Sekunden-Hinweis und Betreiber-E-Mail; SM-R14 dauerhafte In-App-Hinweise | In-App-Nachweise getrennt von Versand-/Zustellungszusagen führen; Kanal und Pilotumfang offen |
| Altersgruppe/Niveaus | DR-1.2./2.3 mit Altersgruppen und Profilniveau; SM-R02 öffentlich nur Name/Sportarten | Profil-/Sichtbarkeitsregeln vor Implementierung abgleichen; private Kontaktdaten bleiben getrennt |
| Buchungsumfang | P2 geplanter Pilot, Architektur noch offen, SM-R ausführlicher Pilot | Optionales zusammenhängendes Paket; nicht durch bloße Anfrageoberfläche als fertig deklarieren |

Diese Punkte sind keine stillschweigenden Änderungen bestehender Anforderungen. Die Traceability-Dokumentation hält Quell-IDs und Lücken nachvollziehbar fest.

## 12. Weiterarbeit und Abnahme

Die nächste technische Arbeit sollte einen vollständigen schmalen Ablauf liefern: anmelden, ein Event erstellen, als zweites Konto finden und beitreten, eigene Teilnahme absagen. Danach folgen Negativfälle und Parallelzugriff. Für die Abnahme sind jeweils Build, Konfiguration, Testdaten, Ausführung und Ergebnis festzuhalten.

Besonders wichtig sind: zwei gleichzeitige Zusagen bei einem freien Platz; direkte unberechtigte API-Aufrufe; wiederholtes Beitreten nach verlorener Antwort; parallele Kapazitätsänderung; Eventabsage mit vorhandenen Teilnahmen. Die Oberfläche allein kann diese Architekturregeln nicht beweisen.

## Quellen, Modellstatus und Pflege

Die Erweiterung vom 27.10.2026 präzisiert die vorhandenen Aufgaben und Beziehungen. Sie fügt keine neuen empirischen Befunde und keine zusätzlichen Serverdienste hinzu. Die vier Erklärbereiche, ihre Modulzuordnung und die zusätzlichen Diagrammsichten sind Ausarbeitungen dieses Entwurfs. Der SQL-Vertrag wurde gegen die lokale Datei `datenmodell/schema.sql` abgeglichen.

Bei späteren Änderungen zuerst die Fachregel festlegen, dann betroffene Module, Daten und Abläufe aktualisieren. Komponentenkennungen C1–C5 erhalten; die Unterkennungen C2-A/E/O/T/H beschreiben nur feinere Verantwortlichkeiten. Neue echte Implementierungs- und Testnachweise gehören anschließend in die Traceability.

### Projektquellen und technische Referenzen

- [Letzte P2-Präsentation](../SportMate%20P2%20Pra%CC%88sentation.pdf), insbesondere MVP und nächste Schritte.
- [Bestehender Architekturentwurf](../Dokumentationen/Architektur%20%26%20Entwurf.docx), Kapitel 2.
- [DR-/NFR-Anforderungskatalog](../Dokumentationen/SportMate%20%E2%80%93%20Anforderungen.docx), Kapitel 4–6.
- [SM-R-Anforderungskatalog](../Interviews/02_Anforderungen.md), Begriffe und SM-R01–30. Die zugrunde liegenden Musterinterviews sind als KI-Simulationen gekennzeichnet.
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), technische Grundlage zu Datenbankrechten/RLS, abgerufen 26.10.2026.
- [Supabase: Database Functions](https://supabase.com/docs/guides/database/functions), technische Grundlage für RPC-Funktionen und Ausführungsrechte, abgerufen 26.10.2026.
- [Next.js: Data Security](https://nextjs.org/docs/app/guides/data-security), technische Grundlage für serverseitige Zugriffskontrolle und begrenzte Ergebnisobjekte, abgerufen 26.10.2026.

- [PostgreSQL: Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html), technische Grundlage zu Zeilensperren (`FOR UPDATE`) für konkurrierende Transaktionen, abgerufen 26.10.2026.
- [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers), technische Grundlage für HTTP-Eintrittspunkte in `app/**/route.ts`, abgerufen 26.10.2026.

### Kartenquellen, ergänzt am 27.10.2026

- [Leaflet Quick Start](https://leafletjs.com/examples/quick-start/): Bibliothek 1.9.4, Kartenlayer, Marker und Klickereignisse.
- [OSM Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/): Standardendpoint, Attribution, normaler Browsercache und Web-Referer. Keine Vorab-/Massendownloads oder Offline-Kachelarchive, keine Verfügbarkeitsgarantie.
- [OSMF Privacy Policy](https://osmfoundation.org/wiki/Privacy_Policy): automatisch anfallende Daten bei Nutzung der Dienste.
