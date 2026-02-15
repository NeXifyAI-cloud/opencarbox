# GitLab MR settings: fast-forward + require squash + strict merge checks (schuldenfrei, autonomous-ready)

## Änderungsziel
Diese Änderung setzt die empfohlenen GitLab Merge-Request-Einstellungen für unseren „autonom, zuverlässig, schuldenfrei“-Workflow. Fokus: lineare Historie, deterministische Merges, keine „skipped pipeline“-Schlupflöcher, saubere Aufräumlogik für `repair/*` und `autofix/*`.

## Warum
- Verhindert Drift: Merges nur, wenn ein Branch sauber in den Target-Stand integriert werden kann.
- Erhöht Zuverlässigkeit: Nur grüne Pipelines dürfen mergen (kein „skipped = success“).
- Reduziert technische Schulden: Squash als Pflicht → pro MR genau ein sauberer Commit.
- Unterstützt Autonomie: Repair-/Autofix-Branches werden standardmäßig gelöscht → Repo bleibt clean.

## Scope
- Nur GitLab Projekt-Einstellungen (keine Codeänderungen).

## Konfiguration

### Merge method
- **Fast-forward merge**

### Merge options
- **Automatically resolve merge request diff threads when they become outdated:** ON
- **Show link to create or view a merge request when pushing from the command line:** ON (optional, empfohlen)
- **Enable “Delete source branch” option by default:** ON

### Squash commits when merging
- **Require**

### Merge checks
- **Pipelines must succeed:** ON
- **Skipped pipelines are considered successful:** OFF
- **All threads must be resolved:** ON

### Commit message templates
- **Merge suggestions message:** Default oder belassen wie aktuell
- **Merge commit message template:** irrelevant bei Fast-forward, kann Default bleiben
- **Squash commit message template:**

```text
%{title}
```

Optional (falls mehr Kontext gewünscht):

```text
%{title}
See merge request %{reference}
```

## Hinweise zur Autonomie (wichtig für Bots)
- Bot-MRs (`autofix/*`, `maintenance/*`) müssen Änderungen vollständig über Pipelines nachweisen, da „skipped“ nicht zählt.
- „All threads resolved“ bleibt aktiv: Bot muss ggf. gezielt kommentieren statt offene Threads zu hinterlassen.
- „Delete source branch“ räumt `repair/*` und `autofix/*` nach Merge automatisch auf.

## Akzeptanzkriterien
1. **GitLab Projekt → Settings → Merge requests** entspricht exakt der Konfiguration oben.
2. Eine Probe-MR kann erst gemerged werden, wenn Pipeline grün ist und alle Threads resolved sind.
3. Nach Merge ist „Delete source branch“ standardmäßig aktiviert und löscht den Source-Branch.

## Rollout
1. Änderung in GitLab UI vornehmen (Projekt-Einstellungen).
2. Optional: Merge Trains aktivieren (falls verfügbar) als nächste MR/Change-Note.
