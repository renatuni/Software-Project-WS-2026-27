# Vorgeschlagene Entwicklungs- und Reviewregeln

Arbeitsvorschlag vom 27.10.2026, keine behauptete Teamfreigabe. Grundlage: P3 ADR-01–04 und NFR-8.

- Ein Next.js-Projekt mit TypeScript strict. React-Komponenten stellen dar; Fachmodule prüfen Regeln; Datenzugriff bleibt serverseitig getrennt. Keine Secrets in Clientmodulen.
- Komponenten PascalCase, Funktionen/Variablen camelCase, eindeutige fachliche Namen. Kleine Module statt eines globalen UI-/Regelblocks.
- Eingaben an Servergrenzen validieren. Identität aus verifizierter Sitzung; Eigentumsrechte zusätzlich prüfen. Kapazität atomar in PostgreSQL absichern. Kein administrativer Schlüssel für normale Nutzeraktionen.
- Deutsche Fehlermeldungen am betroffenen Feld, Fehlerstatus mit zugänglicher Rückmeldung. Leere Suche und fehlgeschlagene Suche unterscheiden. Demoidentitäten und flüchtige Daten ausdrücklich kennzeichnen.
- ESLint, TypeScript-Prüfung und einheitliche Formatierung bei Anlage der Anwendung konfigurieren. CI erst mit wirklich ausführbaren Befehlen ergänzen; kein grüner Platzhalterjob.
- Featurebranches mit `feature/`, Fehlerkorrekturen mit `fix/`, Dokumentation mit `docs/`. Kleine zusammenhängende Commits mit Issuebezug. Nur eigene Änderungen gezielt stagen.
- PR: Problem, Anforderungs-ID, Issue, Umsetzung, tatsächlich ausgeführte Tests, Grenzen und bei UI-Änderungen echte Screenshots angeben.

## Menschliches Review

Vor Merge prüft ein reales Teammitglied Fachregeln, Schichtengrenzen, Datenschutz, Fehlerfälle, Tastatur-/Mobilbedienung und Testergebnisse. Reviewer und Entscheidung werden erst nach tatsächlichem Review eingetragen. Automatische Checks sind kein menschliches Review.

Vorlage: Datum | PR/Commit | tatsächlicher Reviewer | geprüfte DR/NFR | Befund | erforderliche Änderung | Nachprüfung | Entscheidung.

## Testprotokoll

Je ausgeführtem Test: Datum, Commit, Umgebung, Test-ID und DR/NFR, Ebene (Unit/Integration/Akzeptanz), Eingabe, erwartetes Ergebnis, tatsächliches Ergebnis, bestanden/fehlgeschlagen/blockiert, Defekt-Issue. Keine erwarteten Ergebnisse als tatsächliche protokollieren.

Priorität: Suche/Leerzustand (DR-2.2.3), Formulargrenzen (DR-3.1.1–5), Teilnahme/Vollstand/Doppelteilnahme (DR-4.1.1–4), Absage (DR-4.2.1), echte Rechte und Parallelität (NFR-5), mobile Kernabläufe (NFR-3). Die CI soll zusätzlich alle Must-Stories gemäß NFR-8 abdecken.
