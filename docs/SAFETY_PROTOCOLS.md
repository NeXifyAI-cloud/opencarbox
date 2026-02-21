# Sicherheits-Protokolle und Eskalationspfade

Dieses Dokument definiert die Richtlinien für die Arbeit von AI-Agenten (Jules) an der OpenCarBox Platform.

## 1. Grundprinzipien
- **Eingeschränkte Autonomie:** Der Agent darf keine systemweiten autonomen Steuerungen übernehmen oder Sicherheitsprüfungen umgehen.
- **Transparenz:** Jede signifikante Aktion muss protokolliert werden.
- **Mensch-in-der-Schleife:** Kritische Entscheidungen erfordern eine explizite menschliche Freigabe.

## 2. Audit-Logging
Alle Aktionen werden im `AuditLog` (Tabelle `audit_logs`) erfasst. Ein Log-Eintrag enthält:
- Zeitstempel (automatisch)
- Benutzer/Agent (Feld `user`)
- Aktion (z.B. "schema_change")
- Ressource (z.B. "prisma/schema.prisma")
- Status (SUCCESS, FAILURE, WARNING)
- Details (JSON-Objekt mit Kontext)

## 3. Eskalationspfade
Kritische Aktionen müssen an einen menschlichen Supervisor eskaliert werden, wenn:
- Ein unvorhergesehener Fehler in einer Core-Komponente auftritt.
- Datenbank-Schemaänderungen vorgenommen werden müssen, die Datenverlust verursachen könnten.
- Secrets oder API-Keys geändert werden.
- Die Integrität des Sicherheits-Systems selbst betroffen ist.

### Vorgehen bei Eskalation:
1. **Identifikation:** Der Agent erkennt die kritische Situation.
2. **Stopp:** Die automatische Bearbeitung wird unterbrochen.
3. **Bericht:** Der Agent erstellt einen detaillierten Bericht mit Kontext, Risiken und vorgeschlagenen Schritten.
4. **Warten:** Der Agent wartet auf die explizite Freigabe durch den User.

## 4. Entscheidungskriterien
| Aktionstyp | Autonomie-Level | Eskalation erforderlich? |
|------------|-----------------|--------------------------|
| UI-Anpassungen | Hoch | Nein |
| Bugfixing (logisch) | Hoch | Nein (nach Tests) |
| DB-Schema (additiv) | Mittel | Empfohlen |
| DB-Schema (destruktiv) | Gering | **JA** |
| Deployment-Configs | Mittel | Ja |
| Security-Rules (RLS) | Gering | **JA** |

## 5. Traceability-Workflow
Vor jeder Änderung an kritischen Systemen muss der Agent den aktuellen Zustand in `_nexifyai_context/state/STATE.md` dokumentieren und nach der Änderung das Audit-Log aktualisieren.
