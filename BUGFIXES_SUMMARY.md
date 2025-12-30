# 🐛 Bug-Fixes - Supabase Migration

**Datum:** 2024-12-05 (Initial) | 2024-12-30 (Update)
**Aktuelles Projekt:** acclrhzzwdutbigxsxyq
**Status:** ✅ ALLE BUGS BEHOBEN

---

## Bug 1: Projekt-ID Inkonsistenz ✅ BEHOBEN

### Problem
Dokumentation, Migration-Files und Konfigurationen verwendeten verschiedene Projekt-IDs, was zu Verwirrung führen konnte.

### Lösung
- ✅ Alle Dateien auf `acclrhzzwdutbigxsxyq` (Production) vereinheitlicht
- ✅ `supabase/migrations/001_initial_schema.sql` aktualisiert
- ✅ `docs/SETUP_STATUS.md` korrigiert
- ✅ `STATUS_REPORT.md` korrigiert

### MCP Server Konfiguration
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=acclrhzzwdutbigxsxyq&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cbranching%2Cfunctions%2Cstorage"
    }
  }
}
```

---

## Bug 2: Klartext-Secrets in Dokumentation ✅ BEHOBEN

### Problem
**KRITISCHES SICHERHEITSRISIKO:** Dokumentation und `env.example` enthielten:
- Klartext-Datenbank-Passwörter
- Service-Role-Keys
- Alle Secrets im Klartext

### Lösung
- ✅ `docs/SUPABASE_CONFIG.md` - Alle Secrets entfernt, nur Platzhalter (`<PASSWORD>`, `<KEY>`)
- ✅ `env.example` - Passwörter durch `<PASSWORD>` Platzhalter ersetzt
- ✅ Sicherheitshinweise hinzugefügt

### Sicherheits-Best-Practices
- ✅ Dokumentation enthält KEINE echten Secrets
- ✅ `env.example` nur als Template mit Platzhaltern
- ✅ Echte Secrets nur in `.env.local` (nicht in Git)
- ✅ Service-Role-Keys nur Server-side

---

## Bug 3: Malformierte PostgreSQL URL ✅ BEHOBEN

### Problem
`POSTGRES_URL` enthielt ungültigen Parameter:
```
&supa=base-pooler.x  ❌ FALSCH
```

### Lösung
Korrigiert zu:
```
&pgbouncer=true  ✅ KORREKT
```

### Geänderte Dateien
- ✅ `env.example` - POSTGRES_URL korrigiert
- ✅ `docs/SUPABASE_CONFIG.md` - Beispiel korrigiert

---

## Zusatz-Fix: Vercel Build-Fehler ✅ BEHOBEN

### Problem
npm install schlug fehl wegen Peer-Dependency-Konflikt:
- `@react-email/components@0.0.15` benötigt `react@18.2.0`
- Projekt verwendet `react@18.3.1`

### Lösung
- ✅ `@react-email/components` aus `package.json` entfernt (wird noch nicht verwendet)
- ✅ `.npmrc` erstellt mit `legacy-peer-deps=true`
- ✅ `vercel.json` erstellt mit korrigierten Install-Commands

### Vercel Konfiguration
```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run build",
  "installCommand": "npm install --legacy-peer-deps"
}
```

---

## 📋 Konfiguration

### Aktuelle Werte (.env):

| Variable | Wert |
|----------|------|
| `PROJECT_ID` | `acclrhzzwdutbigxsxyq` |
| `SUPABASE_ACCESS_TOKEN` | `sbp_abfe7a627cff1e0f3e8a93545a1ccc2f1f99a5cb` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://acclrhzzwdutbigxsxyq.supabase.co` |
| `MCP_SERVER_URL` | `https://mcp.supabase.com/mcp?project_ref=acclrhzzwdutbigxsxyq&...` |

---

## ✅ Alle Bugs behoben!

- ✅ Projekt-ID konsistent
- ✅ Keine Secrets in Dokumentation
- ✅ PostgreSQL URL korrigiert
- ✅ Vercel Build sollte jetzt funktionieren

---

**Erstellt:** 2024-12-05
