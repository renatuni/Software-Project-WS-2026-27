# Landingpage – Oberflächenentwurf nach Tims Feedback

## Verantwortung und Abgrenzung

Architektur und Entwurf: Einstieg, Navigation, Komponenten, Gestaltung und zugehörige Tests.
Grundlage ist Tims Feedback (24 Jahre) aus dem lokal vorliegenden Feedbackdokument.
Kundenfeedback 1 bleibt erhalten. Keine Änderung an den Anforderungen von Sarah oder Max,
keine neue Erstellungsgeschäftslogik, Teilnehmerverwaltung, Kommunikation oder Backend-Aufgabe.
Keine Datenmodell- oder Datenbankänderungen.

## Navigation zur bestehenden Anwendung

Die bestehende `SportMate`-Komponente ist zusätzlich unter `/treffen` erreichbar.
Die neue Server-Page liest die in dieser Next.js-Version asynchronen `searchParams`.
`sport` akzeptiert ausschließlich eine der vorhandenen Sportarten aus dem gemeinsamen Modell;
unbekannte oder mehrfache Werte werden ignoriert. `aktion=erstellen` öffnet die bestehende
Demo-Person-Auswahl und anschließend das bestehende Erstellformular. Keine automatische
Veröffentlichung, Teilnahme oder Anmeldung. Ein anderer Aktionswert öffnet keinen Dialog.

Die serialisierbaren Eingangsparameter initialisieren die bereits vorhandenen Filter und
den bestehenden Erstellen-Ablauf. Ein React-Key trennt verschiedene Einstiege bei Navigation
zur gleichen Route. Spätere Filteränderungen innerhalb der Anwendung funktionieren unverändert.
Der Link im Anwendungslogo führt zu `/` zurück.

Die bisherige Anwendung kannte keine unterstützten Event-/Filter-Deep-Links; ihr Einstieg
war `/`. Die neue explizite Treffenadresse ist dauerhaft direkt aufrufbar und neu ladbar.
Die Landingpage wird in einem darauf aufbauenden PR zum Einstieg unter `/`.

## Prüfung der Navigation

Playwright prüft alle vier Sportarten einschließlich des vorhandenen leeren Basketballfilters,
unbekannte und mehrfache Parameter sowie den bestehenden Erstellen-Dialog auf Desktop/360 px.
Die unveränderten Kern- und Kundenfeedback-1-Tests sichern die bestehenden Abläufe ab.
