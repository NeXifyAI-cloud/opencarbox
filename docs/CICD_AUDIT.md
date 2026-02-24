# CI/CD Audit - OpenCarBox

Dieses Dokument fasst den aktuellen Zustand der CI/CD-Pipeline zusammen und identifiziert Optimierungspotenziale.

## Aktueller Status (Stand: 2026-02-17)

### GitHub Actions (CI/CD)
- **ci.yml**: Läuft sequentiell (Lint & Type Check -> Test & Build). Das verzögert das Feedback für Entwickler.
- **deploy-prod.yml**: Redundant. Führt Lint, Typecheck und Tests erneut aus, obwohl diese bereits in der CI gelaufen sein sollten. Dies verschwendet Zeit und Ressourcen.
- **Fehlende Health-Checks**: Nach dem Deployment findet keine automatisierte Prüfung statt, ob die Applikation tatsächlich erreichbar ist.
- **Kein automatischer Rollback**: Bei Fehlern nach dem Deployment muss manuell eingegriffen werden.

### GitLab CI
- **Technologie-Mismatch**: Nutzt `npm` statt `npm`. Da das Projekt `npm-lock.yaml` verwendet, kann dies zu inkonsistenten Abhängigkeiten und Build-Fehlern in der GitLab-Umgebung führen.
- **Redundanz**: Spiegelt viele Funktionen von GitHub wider, ohne klare Abgrenzung.

### Security
- **Abhängigkeits-Audits**: Vorhanden, aber npm-Caching wird nicht optimal genutzt.

## Identifizierte Probleme & Bottlenecks
1. **Pipeline-Laufzeit**: Die sequentielle Natur der `ci.yml` ist der größte Zeitfresser.
2. **Kosten/Ressourcen**: Redundante Builds in der Produktions-Pipeline erhöhen die Kosten für CI-Runner.
3. **Risiko**: Fehlende automatisierte Verifikation nach dem Deploy erhöht das Risiko von Downtimes bei unentdeckten Fehlern.

## Empfohlene Maßnahmen
1. **Parallelisierung**: Umstellung der `ci.yml` auf parallele Jobs.
2. **Effizienz**: Bereinigung der Deployment-Workflows.
3. **Automatisierung**: Einführung von Post-Deploy Health-Checks und Rollback-Logik.
4. **Konsistenz**: Umstellung der GitLab CI auf `npm`.
