# Architektur-Spezifikation: Sicheres Wissensmanagement & Workflow-System

**Version:** 1.0.0
**Status:** Entwurf (MVP-Definition)
**Lead Architect:** Jules (Nexify AI Architect)
**KI-Leitsystem:** DeepSeek (Primary)

---

## 1. Ziel & Nutzungskontext

### 1.1 Zweck des Systems
Das System dient der zentralen, sicheren und nachvollziehbaren Organisation von Wissen sowie der Automatisierung von Arbeitsabläufen (Workflows) durch KI-Integration. Es stellt sicher, dass jede Information, jede Entscheidung der KI und jeder ausgelöste Prozess auditierbar und versioniert ist.

### 1.2 Anwendungsfälle (Use Cases)
*   **Dokumentation:** Erfassung und Versionierung von technischem und prozessualem Wissen.
*   **Wissensmanagement:** Strukturierung von Informationen in Bausteine mit klarer Quellenangabe.
*   **Automatisierung:** Auslösen von Workflows durch definierte Ereignisse (Trigger).
*   **Audit-Traffic-Analyse:** Überwachung und Protokollierung aller KI-Interaktionen zur Einhaltung von Compliance-Vorgaben.

### 1.3 Stakeholderrollen & Nutzerpfade
| Rolle | Beschreibung | Primärer Pfad |
| :--- | :--- | :--- |
| **Admin** | Systemkonfiguration | Verwaltet Trigger-Definitionen und Workflow-Berechtigungen. |
| **Agent (KI)** | Automatisierte Ausführung | Führt Workflow-Steps aus, liest Wissensbausteine und nutzt DeepSeek. |
| **Auditor** | Compliance-Überwachung | Prüft Audit-Logs, Versionen und Signaturen auf Manipulationssicherheit. |
| **Nutzer** | Wissenskonsument | Sucht Informationen und stößt manuelle Workflows an. |

### 1.4 Nicht-funktionale Anforderungen (NFR)
*   **Sicherheit:** Ende-zu-Ende Verschlüsselung, RBAC/ABAC, DSGVO-Konformität (Hosting in Region Frankfurt/fra1).
*   **Skalierbarkeit:** Unterstützung von Vektor-Indizierung für große Wissensmengen.
*   **Auditierbarkeit:** Unveränderliche (immutable) Protokollierung aller Änderungen und KI-Aufrufe.
*   **Interoperabilität:** Bereitstellung von Schnittstellen in maschinenlesbaren Formaten (JSON-LD).


---

## 2. Datenmodell

### 2.1 Kernentitäten & Beziehungen
Das System basiert auf einer graph-orientierten relationalen Struktur, um Abhängigkeiten zwischen Auslösern, Logik und Wissen abzubilden.

```yaml
Entitäten:
  Trigger:
    Beschreibung: Ereignis, das einen Workflow startet.
    Beziehung: 1:N zu Workflows.
    Typen: [Webhook, Schedule, Manual, Event]

  Workflow:
    Beschreibung: Definierte Abfolge von Schritten (Steps).
    Beziehung: N:M zu AI-Komponenten, 1:N zu Steps.
    Metadaten: Status, Version, Ersteller.

  AI-Komponente:
    Beschreibung: Spezifische KI-Konfiguration (Prompts, Modelle).
    Anbindung: DeepSeek-V3 / DeepSeek-Coder.
    Input: Kontext aus Wissensbausteinen.

  Wissensbaustein (KnowledgeChunk):
    Beschreibung: Kleinste Einheit an Information.
    Beziehung: 1:N zu Versionen, N:M zu Quellen.
    Eigenschaften: Vektor-Embeddings (für Suche).

  AuditLog:
    Beschreibung: Unveränderliches Protokoll aller Aktionen.
    Inhalt: Request/Response, Timestamp, Signatur, UserID.
```

### 2.2 Metadaten (Pflichtfelder)
Jede Entität muss folgende Metadaten führen, um die Auditierbarkeit zu gewährleisten:

| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | UUID | Eindeutiger Identifikator. |
| `name` | String | Lesbare Bezeichnung. |
| `version` | SemVer | Versionsnummer (z.B. 1.0.2). |
| `created_at` | ISO8601 | Erstellungszeitpunkt mit Zeitzone. |
| `author_id` | UUID | Verweis auf den Ersteller (User/Agent). |
| `source_ref` | URI/Hash | Verweis auf die Ursprungsquelle (z.B. Git-SHA, URL). |
| `status` | Enum | [DRAFT, ACTIVE, DEPRECATED, ARCHIVED] |
| `signature` | Hash | HMAC oder digitale Signatur des Inhalts. |

### 2.3 Validierungsregeln
1.  **Immutability von Logs:** Audit-Logs dürfen niemals gelöscht oder geändert werden (Append-only).
2.  **Referentielle Integrität:** Ein Workflow kann nicht gelöscht werden, wenn aktive Trigger darauf verweisen.
3.  **Versionspflicht:** Jede Änderung an einem Wissensbaustein erzeugt zwingend eine neue Version mit neuem Zeitstempel.


---

## 3. Speicher-Architektur & Versionierung

### 3.1 Hybrid-Persistenz-Strategie
Das System nutzt eine duale Speicherstrategie, um sowohl strukturierte Abfragen als auch semantische Suchen zu ermöglichen.

*   **Relationale Ebene (PostgreSQL/Supabase):** Speicherung aller Metadaten, Workflow-Definitionen, Trigger und Audit-Logs. Gewährleistet ACID-Konformität und referentielle Integrität.
*   **Vektor-Ebene (pgvector):** Speicherung von Embeddings für Wissensbausteine. Ermöglicht semantische Ähnlichkeitssuche (RAG - Retrieval Augmented Generation).
*   **Source-of-Truth:** Dokumente werden als Markdown-Fragmente in der Datenbank gespeichert, wobei jede Änderung einen neuen Datenbank-Eintrag (Snapshot) erzeugt.

### 3.2 Indexierung
| Index-Typ | Technologie | Zweck |
| :--- | :--- | :--- |
| **Volltext** | GIN (PostgreSQL) | Suche nach exakten Begriffen in Dokumenten. |
| **Vektor** | HNSW / IVFFlat | Semantische Suche (DeepSeek Context-Retrieval). |
| **Metadaten** | B-Tree | Filterung nach Zeitstempeln, Autoren und Status. |

### 3.3 Data Governance (Lineage & Provenance)
Zur Nachverfolgung der Herkunft von Wissen wird JSON-LD zur Annotation genutzt.

```json
{
  "@context": "https://schema.org/",
  "@type": "Message",
  "identifier": "kb-chunk-9921",
  "name": "Sicherheitsrichtlinie DeepSeek-API",
  "version": "1.1.0",
  "author": {
    "@type": "Organization",
    "name": "OpenCarBox Security Team"
  },
  "sdPublisher": {
    "@type": "SoftwareApplication",
    "name": "Nexify-Workflow-Engine"
  },
  "datePublished": "2024-12-05T14:30:00Z",
  "isPartOf": {
    "@type": "CreativeWork",
    "name": "Wissensbasis Compliance"
  }
}
```

### 3.4 Snapshots & Change-Logs
Jede Änderung an einer Kernentität führt zu:
1.  Einem **Snapshot** der neuen Version.
2.  Einem Eintrag im **Change-Log** (Differenz zur Vorversion).
3.  Einem **Audit-Event**, das den Zugriff und die Änderung signiert protokolliert.


---

## 4. Zeit-, Audit- & Compliance-Anforderungen

### 4.1 Zeitstempel-Standards
Sämtliche Ereignisse werden nach **ISO 8601** mit Millisekunden-Präzision und UTC-Offset gespeichert (z.B. `2024-12-05T14:30:00.123Z`). Dies stellt die Chronologie in verteilten Systemen sicher.

### 4.2 Audit-Trail & Manipulationssicherheit
*   **Tamper-evident Logging:** Jeder Audit-Log-Eintrag enthält einen Hash des vorhergehenden Eintrags (Chaining), um nachträgliche Änderungen am Protokoll erkennbar zu machen.
*   **Zugriffshistorie:** Jeder Lese- und Schreibzugriff auf sensible Wissensbausteine wird protokolliert.
*   **Signaturen:** Kritische Workflow-Entscheidungen der KI werden mit einer digitalen Signatur des ausführenden Agenten versehen.

### 4.3 DSGVO & Compliance-Konzepte
*   **Hosting:** Ausschließlich in der Region Frankfurt (Vercel fra1 / Supabase AWS eu-central-1).
*   **Löschkonzept:**
    *   Personenbezogene Daten können nach Ablauf der gesetzlichen Aufbewahrungsfristen gelöscht werden.
    *   Wissenseinheiten unterstützen "Soft-Delete" (Status ARCHIVED), bevor sie physisch entfernt werden.
*   **Recht auf Auskunft:** Das System stellt Exporte aller nutzerbezogenen Daten in maschinenlesbarem JSON-Format bereit.
*   **Privacy by Design:** KI-Prompts werden vor der Übermittlung an DeepSeek auf PII (Personally Identifiable Information) geprüft und ggf. anonymisiert.


---

## 5. Sicherheit & Datenschutz

### 5.1 Zugriffskontrolle (RBAC/ABAC)
Das System implementiert ein feingranulares Berechtigungsmodell:
*   **RBAC (Role-Based Access Control):** Basierend auf vordefinierten Rollen (Admin, Agent, User).
*   **ABAC (Attribute-Based Access Control):** Zugriffsberechtigungen basierend auf Attributen der Wissensbausteine (z.B. `security_level = HIGH`).
*   **Supabase RLS:** Row-Level Security auf Datenbankebene stellt sicher, dass Nutzer nur Daten sehen, für die sie explizit autorisiert sind.

### 5.2 Verschlüsselung
*   **Transit:** Alle API-Aufrufe (inkl. DeepSeek) erfolgen über TLS 1.3.
*   **At Rest:** Datenbank-Volumes und Backups sind AES-256 verschlüsselt.
*   **Secret Management:** API-Keys (DeepSeek, Supabase) werden sicher in Umgebungsvariablen (Vercel Secrets) verwaltet und niemals im Quellcode oder Logs gespeichert.

### 5.3 Sichere DeepSeek-Integration
Die Anbindung an DeepSeek erfolgt über einen sicheren Proxy-Service innerhalb der Infrastruktur:
1.  **Request-Validierung:** Prüfung des Inputs auf Injection-Versuche.
2.  **Prompt-Hardening:** System-Prompts sind schreibgeschützt und können nur von Admins geändert werden.
3.  **Output-Filter:** KI-Antworten werden auf Plausibilität und Sicherheit (z.B. Ausschluss schädlicher Code-Muster) geprüft.
4.  **Logging:** Jeder API-Call wird mit Metadaten (Tokens, Latenz, Kosten) im Audit-Log erfasst.

### 5.4 Security Testing
*   **Threat Modeling:** Regelmäßige Analyse von Angriffsvektoren (z.B. Prompt Injection).
*   **Automatisierte Scans:** Nutzung von Tools zur Erkennung von Sicherheitslücken im Code und in Abhängigkeiten.


---

## 6. Output-Formate & Schnittstellen

### 6.1 API-Design (REST)
Die Kommunikation erfolgt über eine standardisierte REST-API. Alle Endpunkte erfordern eine Authentifizierung via JWT.

#### Endpunkte-Übersicht:
| Pfad | Methode | Beschreibung |
| :--- | :--- | :--- |
| `/api/v1/knowledge` | GET/POST | Listet/Erstellt Wissensbausteine. |
| `/api/v1/knowledge/:id/versions` | GET | Ruft die Versionshistorie ab. |
| `/api/v1/workflows/trigger` | POST | Löst einen Workflow manuell aus. |
| `/api/v1/audit/logs` | GET | Abfrage der Audit-Protokolle (nur Admin/Auditor). |
| `/api/v1/search/semantic` | POST | Vektorbasierte Suche im Wissen. |

### 6.2 Strukturierte Datenbeispiele

#### Wissensbaustein (YAML)
```yaml
knowledge_chunk:
  id: "kb-001"
  name: "DeepSeek Setup"
  content: "Die DeepSeek-API erfordert einen Bearer-Token..."
  metadata:
    version: "1.0.1"
    author: "jules"
    tags: ["ai", "setup", "deepseek"]
    security_level: "INTERNAL"
  signature: "sha256:7f83b165..."
```

#### Workflow-Trigger (JSON)
```json
{
  "trigger_id": "trg-hourly-sync",
  "type": "SCHEDULE",
  "payload": {
    "action": "sync_knowledge",
    "target": "external_documentation"
  },
  "timestamp": "2024-12-05T15:00:00Z"
}
```

### 6.3 Exportformate
*   **JSON-LD:** Standard für Wissensgraphen und semantische Vernetzung.
*   **Markdown:** Für die Anzeige im Frontend und Dokumentationszwecke.
*   **PDF:** Signierte Audit-Berichte für externe Prüfungen.


---

## 7. Umsetzungsphasen (Roadmap)

### 7.1 Phase 1: MVP (Minimum Viable Product)
**Fokus:** Aufbau des stabilen Fundaments für Wissensspeicherung und Auditierbarkeit.

*   **Deliverables:**
    *   Implementierung des Kerndatenmodells in Prisma/Supabase.
    *   Basis-APIs für Wissensbausteine (CRUD) und Versionierung.
    *   Integration des DeepSeek-Providers für einfache Textgenerierung.
    *   Unveränderliches Audit-Logging (Basis-Version).
    *   RBAC-Integration (Admin/User).
*   **Metriken:**
    *   API-Antwortzeit < 200ms (ohne KI).
    *   100% Testabdeckung der Audit-Log-Logik.
*   **Abnahmekriterien:**
    *   Wissensbausteine können erstellt, versioniert und signiert werden.
    *   Jeder Zugriff wird im Audit-Log erfasst.

### 7.2 Phase 2: Erweiterungen (Scale & Intelligence)
**Fokus:** Automatisierung und semantische Tiefe.

*   **Deliverables:**
    *   Vektorbasiertes Retrieval (pgvector) für DeepSeek-Kontext (RAG).
    *   Workflow-Engine für komplexe Trigger-Abfolgen.
    *   Erweiterte Sicherheitsfeatures (ABAC, PII-Scanner).
    *   Automatisierte Compliance-Reports (PDF-Export).
    *   Offline-Datenspeicherung für kritische Wissensbausteine.
*   **Metriken:**
    *   Relevanz der Suchergebnisse (Precision @ 5) > 80%.
    *   Automatisierungsrate häufiger Anfragen > 50%.

### 7.3 Abhängigkeiten & Annahmen
*   **Abhängigkeiten:** Verfügbarkeit der DeepSeek API, Supabase pgvector Extension.
*   **Annahmen:** Nutzer sind authentifiziert; Hosting erfolgt in Frankfurt.
*   **Ausschlüsse:** Echtzeit-Kollaboration (Editing) ist nicht Bestandteil des MVP.


---

## 8. Minimal funktionsfähige MVP-Spezifikation

### 8.1 Datenmodell-Definition (Prisma)
Für das Entwicklungsteam ist folgendes Schema als Basis für den MVP verbindlich:

```prisma
model KnowledgeChunk {
  id          String    @id @default(uuid())
  name        String
  content     String    @db.Text
  version     String    @default("1.0.0")
  status      String    @default("ACTIVE")
  metadata    Json?
  signature   String?
  authorId    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  versions    KnowledgeVersion[]
}

model KnowledgeVersion {
  id          String    @id @default(uuid())
  chunkId     String
  content     String    @db.Text
  version     String
  changeLog   String?
  createdAt   DateTime  @default(now())
  authorId    String

  chunk       KnowledgeChunk @relation(fields: [chunkId], references: [id])
}

model WorkflowTrigger {
  id          String    @id @default(uuid())
  type        String    // WEBHOOK, SCHEDULE, MANUAL
  name        String
  config      Json
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
}
```

### 8.2 API Endpunkte & Payloads

#### POST /api/v1/knowledge
**Payload:**
```json
{
  "name": "Datenschutzrichtlinie V1",
  "content": "Inhalt der Richtlinie...",
  "metadata": {
    "tags": ["legal", "gdpr"],
    "security_level": "INTERNAL"
  }
}
```

#### GET /api/v1/knowledge/:id/versions
**Response:**
```json
[
  {
    "version": "1.0.1",
    "createdAt": "2024-12-05T16:00:00Z",
    "authorId": "user-123",
    "changeLog": "Korrektur Tippfehler"
  },
  {
    "version": "1.0.0",
    "createdAt": "2024-12-05T14:00:00Z",
    "authorId": "user-123",
    "changeLog": "Initialer Entwurf"
  }
]
```

### 8.3 Beispiel-Dokumentation (Audit-Snapshot)
```json
{
  "audit_event_id": "aud-9982",
  "action": "KNOWLEDGE_UPDATE",
  "resource_id": "kb-001",
  "actor": {
    "id": "agent-deepseek-v3",
    "type": "AI_AGENT"
  },
  "timestamp": "2024-12-05T16:05:00.456Z",
  "details": {
    "previous_version": "1.0.0",
    "new_version": "1.0.1",
    "diff_hash": "sha256:e3b0c442..."
  },
  "integrity_signature": "HMAC-SHA256:88af32..."
}
```

---
*Ende der Spezifikation*
