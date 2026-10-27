# SportMate: Fortschreibung nach Lieferung des Prototyps

Stand: 27.10.2026. Ergänzt den [früheren Status](STATUS-2026-10-27.md); dessen damaliger Blocker ist historisch, kein aktueller Entwicklungsstopp.

## Geplant und erreicht

Der Nutzer lieferte den zuvor nicht versionierten Ordner [Prototyp](../../Prototyp/) mit HTML, app.js, map.js, elf Prüfgruppen, lokalem Leaflet, Offline-SVG und Vorschau-JPG. Der bestehende Dokumentationscommit `ca2ab52` war vorhanden. Entwicklung auf `feature/sportmate-modern-app`, ausgehend von diesem Stand. Die vorbestehende lokale Änderung an P3/README.md bleibt unangetastet und wird nicht mitcommitted.

Erreicht: eigenständige Next.js-/React-/TypeScript-Demo, unveränderter Originalprototyp, helle Oberfläche mit Dunkelblau/Grün, Eventkarten, mobile Navigation, gekapselte Fachregeln, gemeinsamer Suchzustand für Karte/Liste, Mehrfachsport-/Datums-/Altersfilter, Details, Kartenpunktwahl, Erstellung, Teilnahme/Rückzug und Organisatorabsage. Einheitliche Formatierung, Lint-/Typ-/Build-/Unit-/E2E-Prüfungen und CI-Konfiguration ergänzt.

Ausgewertet wurden die P3-Architektur/ADRs, Detail-/Datenmodell, Traceability, Quellkonflikte, Demo-/Prüfbericht, Präsentationsleitfaden, vorhandene README- und Managementdateien sowie der Text der sieben DOCX-Dateien. Originalcode und Tests gelesen und ausgeführt, Leaflet als Drittbibliothek erhalten. Eingebettete DOCX-Grafiken nicht visuell validiert; keine PDF-, SQL- oder Diagrammquellen vorhanden. Vorschau-JPG ist ein mitgeliefertes Artefakt, kein aktueller Testergebnisnachweis.

## Verbleibende Arbeit

- Supabase-Testumgebung und ursprünglichen SQL-Entwurf bereitstellen, F01–F13 fachlich abgleichen. Danach Auth/Profile, serverseitige Mutationen, RLS und atomare PostgreSQL-Operationen implementieren und mit echten Rollen testen. Keine Sicherheitsbehauptung aus Demo-Personen ableiten.
- GPS/Geocoding/Radius, allgemeine Eventbearbeitung, persistente Hinweise und Erinnerungen vervollständigen.
- Original-Kursbeschreibung, SQL- und Diagrammquellen nachreichen. Die alten P3-Pfade nennen `prototyp/`; tatsächlich geliefert wurde der Ordner im Repository-Wurzelverzeichnis. Die neue README enthält die gültigen Startpfade.
- Teamreview, reale Nutzerbeobachtungen, NFR-1/2/4-Abnahme und Zeiterfassung durchführen. Keine fiktiven Beiträge/Feedbackdaten erzeugt.
- Groß-/Kleinschreibkollision P3/README.md und P3/readme.md bleibt außerhalb dieser Änderung offen.

## Planung und Evidenz

Issue #2 bleibt bis zum echten Teamreview offen und wurde auf Review gesetzt. Issue #3 wurde nach bestätigtem Originalstart/Originaltests geschlossen und auf Done gesetzt: Die fehlenden übrigen Quellen sind ausdrücklich dokumentiert, wie seine Akzeptanzkriterien erlauben. Der vorherige pauschale Entwicklungsblocker ist damit behoben. [Issue #4](https://github.com/renatuni/Software-Project-WS-2026-27/issues/4) bündelt die notwendige Supabase-Kernintegration und liegt im Backlog. Issue #1 wurde nicht verändert.

Pushes auf den eigenen Featurebranch sind durch den neuen Nutzerauftrag erlaubt. Ein Pull Request benötigt weiterhin die zuvor verlangte Freigabe. Kein Merge, kein Force-Push, keine Änderung historischer Zeitstempel. Die historischen 13 main-Commits werden nicht als neu erbrachte Arbeit gezählt. Keine belegten Teamstunden und keine neuen menschlichen Reviews vorhanden.

[Aktuelle Anforderungszuordnung](../requirements/UMSETZUNG.md) · [Prüfbericht](../testing/ENTWICKLUNGSSTAND.md) · [Startanleitung](../../README.md). Neue technische Umsetzung orientiert sich an den [offiziellen Next.js-Installationshinweisen](https://nextjs.org/docs/app/getting-started/installation) und der [Leaflet-Referenz](https://leafletjs.com/reference.html), zusätzlich an den mit der installierten Next.js-Version gelieferten Hinweisen zu Server-/Clientkomponenten.
