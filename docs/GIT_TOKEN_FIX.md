# Git Token Berechtigungs-Fix

## Problem

Push zu beiden Remotes wird blockiert:

### Remote `origin` (u4231458123-droid/OpenCarBox_NEW)
```
Permission to u4231458123-droid/OpenCarBox_NEW.git denied to NeXifiyAI (403)
```

### Remote `NeXify-Chat-it-Automate-it-opencarboxnew`
```
Organization forbids PAT with lifetime > 366 days
```

---

## Lösung 1: Token-Lebensdauer anpassen

1. Gehe zu: https://github.com/settings/tokens
2. Finde den Token `NeXifiyAI` (ID: 3118258152)
3. Bearbeite den Token
4. Setze "Expiration" auf **max. 366 Tage** (oder kürzer)
5. Speichern

---

## Lösung 2: Neuen Token erstellen

1. Gehe zu: https://github.com/settings/tokens/new
2. Name: `OpenCarBox-Push`
3. Expiration: **90 Tage** (empfohlen)
4. Scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Generate Token
6. Kopiere den Token

### Token in Git konfigurieren:

```powershell
# Credential Manager aktualisieren
cmdkey /delete:git:https://github.com

# Beim nächsten Push Username/Token eingeben
git push origin main
# Username: NeXifiyAI (oder dein Username)
# Password: [NEUER_TOKEN]
```

---

## Lösung 3: SSH statt HTTPS

```powershell
# SSH Key generieren (falls nicht vorhanden)
ssh-keygen -t ed25519 -C "u6288408171@gmail.com"

# Public Key anzeigen
Get-Content ~/.ssh/id_ed25519.pub

# Key zu GitHub hinzufügen:
# https://github.com/settings/keys → "New SSH key"

# Remote auf SSH umstellen
git remote set-url origin git@github.com:u4231458123-droid/OpenCarBox_NEW.git
```

---

## Aktueller Status

**Commits bereit zum Push:**
- `e373202` - feat: Complete Oracle-First Protocol with mandatory enforcement
- `0fef9da` - feat: Complete CLINE Oracle-First Architecture with DeepSeek

**Betroffene Dateien:**
- `.clinerules` - Oracle-First Enforcement
- `scripts/core/oracle-first.ts` - Oracle-First Protocol
- `package.json` - Oracle Scripts
- `.gitignore` - Exclusions
- Alle .cline/ state files

---

## Automatischer Token-Fallback (neu)

Die Setup-Skripte akzeptieren jetzt zusätzlich zu `GH_TOKEN` auch:

- `CLASSIC_TOKEN_GITHUB_NEU`
- `GITHUB_TOKEN`

Wenn `GH_TOKEN` leer ist, wird automatisch einer der beiden Fallbacks verwendet.
Dadurch kann die Repository-/Secrets-Konfiguration ohne manuelles Umbenennen der Secret-Namen durchlaufen.

## Nach dem Fix

```powershell
cd c:\Users\pcour\OpenCarBox_NEW
git push origin main
```

Falls Force-Push nötig:
```powershell
git push origin main --force
```
