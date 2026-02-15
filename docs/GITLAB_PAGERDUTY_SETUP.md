# GitLab ↔ PagerDuty (ohne Secrets im Repo)

Diese Integration ist **projekt-/gruppenweit** wirksam und benötigt **keine branch-spezifischen Hardcodings**.

## 1) Sofortmaßnahme bei geleakter Webhook-URL

Wenn eine URL mit `token=...` offengelegt wurde, den Token als kompromittiert behandeln:

1. In GitLab: **Settings → Monitor → Incidents → PagerDuty integration**.
2. Integration auf **Active** setzen und **Save integration** ausführen (regeneriert die Webhook-URL).
3. Neue Webhook-URL in PagerDuty als Webhook eintragen.
4. Alte/leakte URL in PagerDuty entfernen.

> Die Webhook-URL gehört in GitLab/PagerDuty-Settings, nicht ins Repository.

## 2) CI-basierte Alerts für alle Branches/MRs

Die Pipeline enthält den Job `notify_pagerduty_on_failure`, der bei fehlgeschlagenen Pipelines ein PagerDuty Event API v2 `trigger` sendet.

### Erforderliche GitLab Variable

- `PAGERDUTY_ROUTING_KEY` (**masked**, idealerweise auf Group-Level verwaltet)

### Optionale GitLab Variablen

- `PAGERDUTY_SEVERITY` (Default: `error`)
- `PAGERDUTY_SOURCE` (Default: `gitlab-ci`)

Damit gilt die Benachrichtigung automatisch für alle Branches und MRs, ohne Secrets im Code.
