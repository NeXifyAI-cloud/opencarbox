# Anforderungsspezifikation: Wissensbasis- und Arbeitsablauf-Architektur (NeXify Knowledge)

## 1. Ziel und Nutzungskontext

### Zielsetzung
Das Ziel von **NeXify Knowledge** ist die Schaffung einer zentralen, sicheren und hochgradig nachvollziehbaren Wissensorganisation für die OpenCarBox-Plattform. Das System integriert automatisierte Workflows mit DeepSeek-basierter KI, um Wissen nicht nur zu speichern, sondern aktiv in Geschäftsprozesse (Werkstatt, Shop, Autohandel) einzubinden.

### Anwendungsfälle (Use Cases)
- **Dokumentation:** Zentrale Ablage von Best Practices, technischen Leitfäden und Prozessbeschreibungen.
- **Wissensmanagement:** Vernetzung von Wissensbausteinen mit realen Objekten (Fahrzeuge, Ersatzteile).
- **Automatisierung:** Trigger-basierte Ausführung von Workflows (z.B. automatische Angebotserstellung bei Werkstattanfrage).
- **Audit-Traffic-Analyse:** Lückenlose Protokollierung aller KI-Interaktionen und Datenänderungen zur Compliance-Sicherung.

### Stakeholder und Nutzerpfade
- **Technischer Administrator:** Konfiguriert Trigger und AI-Komponenten.
- **Wissens-Editor:** Erstellt und pflegt Wissensbausteine, verwaltet Versionen.
- **AI-Agent (DeepSeek):** Konsumiert Wissensbausteine zur Problemlösung und Workflow-Steuerung.
- **Auditor:** Prüft Audit-Logs und Versionierungshistorie auf Konformität.

## 2. Datenmodell

### Kernentitäten
1.  **Trigger:** Definiert Ereignisse (z.B. `ORDER_CREATED`, `APPOINTMENT_REQUESTED`), die einen Workflow starten.
2.  **Workflow:** Eine Sequenz von Schritten, die Logik, KI-Aufrufe und Datenoperationen kombiniert.
3.  **AI-Komponente:** Spezifische Konfiguration für DeepSeek (Prompts, Parameter, Context-Window).
4.  **Wissensbaustein (Knowledge Node):** Eine atomare Einheit von Wissen (Text, JSON, Datei-Referenz).
5.  **Version:** Jede Änderung an Entitäten erzeugt eine neue Version.
6.  **Quelle (Source):** Ursprung des Wissens (z.B. Werkstatthandbuch PDF, Manuelle Eingabe, Externer API-Feed).
7.  **Nutzungslog (Access Log):** Datensatz über den Zugriff oder die Ausführung.

### Beziehungen
- **Trigger [1..*] -> Workflow [1]:** Ein Trigger löst genau einen Workflow aus; ein Workflow kann mehrere Trigger haben.
- **Workflow [1] -> AI-Komponente [0..*]:** Workflows nutzen AI-Komponenten für Entscheidungen oder Generierung.
- **Wissensbaustein [1] -> Version [1..*]:** Ein Baustein hat eine Historie von Versionen.
- **Version [1] -> Quelle [1..*]:** Dokumentiert die Herkunft der spezifischen Information.

### Verpflichtende Metadaten
| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | UUID | Eindeutiger Identifikator (Primary Key) |
| `name` | String | Anzeigename der Entität |
| `version` | SemVer | Versionsnummer (z.B. 1.0.4) |
| `status` | Enum | DRAFT, PUBLISHED, ARCHIVED, DEPRECATED |
| `created_at` | ISO-8601 | Erstellungszeitpunkt mit Zeitzone |
| `updated_at` | ISO-8601 | Zeitpunkt der letzten Änderung |
| `author_id` | UUID | Referenz auf den Ersteller (User/Agent) |
| `signature` | String | SHA-256 Hash zur Integritätssicherung |
| `metadata` | JSONB | Flexible Zusatzdaten (Provider-Info, Performance-Metriken) |

### Validierungsregeln
- **Referentielle Integrität:** Löschvorgänge sind nur als "Soft Delete" (Status-Änderung) zulässig, wenn Abhängigkeiten bestehen.
- **Unveränderlichkeit:** Einmal signierte Versionen können nicht modifiziert werden; Änderungen erfordern eine neue Version.

## 3. Speicher-Architektur und Versionierung

### Persistenzstrategie
- **Relationale Persistenz (Supabase/PostgreSQL):** Speicherung aller Metadaten, Workflow-Definitionen und Audit-Logs. Nutzung von foreign keys zur Sicherung der Datenkonsistenz.
- **Vektordatenbank (pgvector in Supabase):** Wissensbausteine werden in hochdimensionale Vektoren (Embeddings) umgewandelt, um semantische Suchen zu ermöglichen.
- **Source-of-Truth:** Das System fungiert als deterministische Quelle für alle automatisierten Entscheidungen.

### Versionierung und Indexierung
- **Snapshot-Versionierung:** Jede Speicherung eines Wissensbausteins erzeugt einen neuen Zeileneintrag mit steigender Versionsnummer.
- **Indexierung:**
    - **B-Tree/Hash:** Für schnelle Metadaten-Abfragen (IDs, Status, Timestamps).
    - **GIN/IVFFlat (Vektor):** Für die Ähnlichkeitssuche in Wissensbausteinen.
    - **Full-Text Search (tsvector):** Für klassische Schlagwortsuche in Dokumentationen.

### Data Governance
- **Data Lineage:** Jede KI-Antwort muss die IDs der verwendeten Wissensbausteine im Metadaten-Feld enthalten (Provenance-Verfolgung).

## 4. Zeit-, Audit- und Compliance-Anforderungen

### Zeitstempel-Standards
- Alle Zeitstempel erfolgen im **ISO-8601 UTC** Format.
- **Autosave:** Benutzeroberflächen müssen Änderungen alle 30 Sekunden in einen Entwurfsstatus (`DRAFT`) sichern.

### Audit-Trails und Compliance
- **Tamper-Evident Logs:** Audit-Logs in der Tabelle `audit_logs` sind "Insert-Only". Jede Zeile enthält einen Hash der Vorgängerzeile (verkettetes Log), um Manipulationen erkennbar zu machen.
- **DSGVO-Konformität:**
    - Trennung von personenbezogenen Daten (PII) und Wissensdaten.
    - Implementierung eines Löschkonzepts für PII nach Ablauf der Aufbewahrungsfristen (Recht auf Vergessenwerden).
    - Hosting in **Vercel/Supabase Region Frankfurt (eu-central-1)**.

## 5. Sicherheits- und Datenschutz

### Zugriffskontrolle (Security)
- **RBAC (Role-Based Access Control):** Implementierung über Supabase Auth und RLS (Row Level Security).
    - `admin`: Vollzugriff.
    - `editor`: Erstellen/Bearbeiten von Wissen.
    - `agent`: Read-Only Zugriff auf Wissen + Schreibzugriff auf Audit-Logs.
- **Verschlüsselung:**
    - **At-Rest:** AES-256 (via Supabase/AWS).
    - **In-Transit:** TLS 1.3 für alle API-Aufrufe.

### DeepSeek Integration
- API-Keys werden serverseitig als Environment Variables verwaltet (Vercel Secrets).
- Keine Übertragung von PII an DeepSeek, sofern nicht explizit für den Workflow erforderlich (Anonymisierungsschicht).
- Monitoring der DeepSeek-Antworten auf Bias und Halluzinationen via Audit-Logs.

### Sicherheits-Testing-Ansatz
- **Threat Modeling:** Jährliche Überprüfung der Datenflüsse zwischen AI-Agenten und Core-Datenbank.
- **Automatisierte Audits:** Monatliche Prüfung der RLS-Policies auf Sicherheitslücken.
- **Vulnerability Scanning:** Einsatz von Tools zur Überprüfung der Abhängigkeiten (z.B. Snyk/npm audit).

## 6. Output-Formate und Schnittstellen

### Formate
- **Primär:** JSON für alle API-Kommunikationen.
- **Linked Data:** JSON-LD für Wissensbausteine zur besseren semantischen Vernetzung.
- **Konfiguration:** YAML für die Definition von Workflows und AI-Prompts.

### API-Struktur (RESTful)
- `GET /api/v1/knowledge`: Liste der Wissensbausteine (Filter nach Kategorie/Tags).
- `POST /api/v1/knowledge`: Erstellen eines neuen Bausteins (erzeugt Version 1.0.0).
- `GET /api/v1/knowledge/{id}/history`: Versionshistorie abrufen.
- `POST /api/v1/workflows/execute`: Manueller Trigger für einen Workflow.
- `GET /api/v1/audit/logs`: Abfrage der Audit-Trails (nur für Admins).

## 7. Umsetzungsphasen (Roadmap)

### Phase 1: MVP (Wochen 1-4)
- **Deliverables:**
    - Datenbank-Schema in Supabase (Tabellen: `knowledge`, `versions`, `workflows`, `audit_logs`).
    - Basis-API Routen in Next.js.
    - Integration des DeepSeek-Clients.
    - Einfaches UI-Dashboard zur Wissenspflege.
- **Metriken:** 100% Testabdeckung der Core-API, Erfolgreiche RLS-Verifikation.

### Phase 2: Erweiterung (Wochen 5-8)
- **Deliverables:**
    - Vektor-Suche (pgvector) für semantisches Retrieval.
    - Erweiterte Workflow-Engine mit bedingter Logik.
    - Automatisierte Reports über Wissensnutzung.
- **Metriken:** Suchlatenz < 200ms, Korrekte Zuordnung der Data Lineage in 99% der Fälle.

## 8. Beispiel-Output: Minimal funktionsfähige MVP-Spezifikation

### Datenmodell-Skizze (JSON-Schema)
```json
{
  "entity": "KnowledgeNode",
  "fields": {
    "id": "uuid",
    "title": "string",
    "content": "text",
    "version": "semver",
    "status": "enum(DRAFT, PUBLISHED)",
    "metadata": {
      "source": "string",
      "author": "uuid",
      "signature": "sha256"
    },
    "timestamps": {
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  }
}
```

### API-Beispiel (Payload POST /api/v1/knowledge)
```json
{
  "title": "Bremsbelagwechsel BMW G20",
  "content": "Schritt 1: Fahrzeug aufbocken...",
  "metadata": {
    "source": "Werkstatthandbuch-2023",
    "tags": ["bmw", "bremsen", "wartung"]
  }
}
```

### Dokumentations-Beispiel mit Timestamp
- **ID:** `kn-550e8400-e29b-41d4-a716-446655440000`
- **Titel:** Sicherheitsrichtlinie DeepSeek-API
- **Version:** 1.1.0
- **Autor:** Admin-User (System)
- **Zeitstempel:** 2024-05-20T14:30:00Z
- **Status:** PUBLISHED
- **Inhalt:** Alle API-Keys müssen über die `AIProviderFactory` bezogen werden...
