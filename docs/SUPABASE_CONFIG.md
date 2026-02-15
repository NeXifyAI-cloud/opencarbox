# Supabase Konfiguration - OpenCarBox & Carvantooo

> **WICHTIGE DOKUMENTATION**
> Konfigurationshinweise für Supabase. **KEINE SECRETS HIER!**

**Projekt:** OpenCarBox & Carvantooo
**Supabase Projekt-ID:** `acclrhzzwdutbigxsxyq`
**Region:** EU Central (Frankfurt)
**Dashboard:** https://supabase.com/dashboard/project/acclrhzzwdutbigxsxyq
**Aktualisiert:** 2024-12-30

---

## 🔑 Credentials

### Public Keys (Browser-sicher)

Diese Keys sind sicher für den Browser und können in `.env.local` verwendet werden:

```env
NEXT_PUBLIC_SUPABASE_URL=https://acclrhzzwdutbigxsxyq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjY2xyaHp6d2R1dGJpZ3hzeHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NzA0MTgsImV4cCI6MjA4MjA0NjQxOH0.EipGXl9SLxMcsMnnmvnN8dBqiM3j3CoIen1GrXas_NE
```

### Private Keys (NUR Server-side!)

⚠️ **NIEMALS im Browser, Frontend-Code oder Dokumentation committen!**

```env
SUPABASE_SERVICE_ROLE_KEY=<Hole aus Supabase Dashboard → Settings → API>
```

### Access Token (für MCP Server & CLI)

Für die Supabase CLI und MCP-Integration:

> 🔐 Falls jemals ein Token im Repository auftaucht: im Supabase Dashboard sofort **rotieren/revoken** und lokal neu setzen.

```env
SUPABASE_ACCESS_TOKEN=<set-in-local-env>
MCP_SERVER_URL=https://mcp.supabase.com/mcp?project_ref=acclrhzzwdutbigxsxyq&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cbranching%2Cfunctions%2Cstorage
```

---

## 🗄️ Datenbank-URLs

### Pooled Connection (Standard)

Für normale Queries mit Connection Pooling (PgBouncer):

```env
POSTGRES_URL=postgres://postgres.<PROJECT_REF>:<PASSWORD>@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

### Prisma-spezifisch

Für Prisma ORM mit PgBouncer:

```env
POSTGRES_PRISMA_URL=postgres://postgres.<PROJECT_REF>:<PASSWORD>@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

### Direct Connection (Non-Pooling)

Für Migrationen und Admin-Aufgaben:

```env
POSTGRES_URL_NON_POOLING=postgres://postgres.<PROJECT_REF>:<PASSWORD>@aws-1-eu-central-2.pooler.supabase.com:5432/postgres?sslmode=require
```

**Hinweis:** Projekt-Ref ist `acclrhzzwdutbigxsxyq`. Passwort aus Supabase Dashboard → Settings → Database.

---

## 📊 Datenbank-Schema

### Vorhandene Tabellen

Nach Anwendung der Migrationen sollten folgende Tabellen existieren:

1. **profiles** - Benutzerprofile
2. **vehicles** - Meine Garage (HSN/TSN)
3. **categories** - Produktkategorien
4. **products** - Produkte
5. **product_vehicle_compatibility** - HSN/TSN-Kompatibilität
6. **orders** - Bestellungen
7. **order_items** - Bestellpositionen
8. **services** - Werkstatt-Services
9. **appointments** - Termine
10. **vehicles_for_sale** - Autohandel
11. **chat_conversations** - Chat
12. **chat_messages** - Chat-Nachrichten

### Storage Buckets

1. **product-images** (öffentlich, 5MB)
2. **vehicle-images** (öffentlich, 10MB)
3. **category-images** (öffentlich, 2MB)
4. **service-images** (öffentlich, 5MB)
5. **avatars** (öffentlich, 2MB)
6. **chat-attachments** (privat, 10MB)

---

## 🔐 Row Level Security (RLS)

RLS ist für alle Tabellen aktiviert. Policies:

### Profiles
- Jeder kann sein eigenes Profil lesen/updaten
- Nur Service Role kann Profile erstellen/löschen

### Products
- Öffentlich lesbar
- Nur Admin kann erstellen/updaten/löschen

### Orders
- User kann nur eigene Bestellungen sehen
- Admin kann alle Bestellungen sehen

### Appointments
- User kann nur eigene Termine sehen
- Admin kann alle Termine sehen

---

## 🛠️ Verwendung im Code

### Browser-Side (Client Components)

```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data, error } = await supabase
  .from('products')
  .select('*')
  .limit(10);
```

### Server-Side (Server Components)

```typescript
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

const supabase = createClient(cookies());
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', userId);
```

### Server Actions

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function createOrder(orderData: OrderInput) {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  return { data, error };
}
```

---

## 📝 Migrationen anwenden

### Über Supabase MCP (empfohlen)

Migrationen werden automatisch über MCP angewendet, wenn der MCP-Server korrekt konfiguriert ist.

### Über SQL Editor (manuell)

1. Öffne Supabase Dashboard
2. Navigiere zu SQL Editor
3. Führe Migration-Files aus `/supabase/migrations/` aus

---

## 🔗 Links

- **Dashboard:** https://supabase.com/dashboard/project/acclrhzzwdutbigxsxyq
- **API Docs:** https://supabase.com/dashboard/project/acclrhzzwdutbigxsxyq/api
- **Table Editor:** https://supabase.com/dashboard/project/acclrhzzwdutbigxsxyq/editor
- **Storage:** https://supabase.com/dashboard/project/acclrhzzwdutbigxsxyq/storage/buckets

---

## ⚠️ Sicherheit

### DO's

- Verwende ANON_KEY im Browser
- Verwende SERVICE_ROLE nur in Server-Code
- Halte RLS aktiviert
- Teste Policies regelmäßig
- Verwende Platzhalter in Dokumentation
- Kopiere echte Keys nur in `.env.local` (nicht in Git!)

### DON'Ts

- NIE SERVICE_ROLE im Frontend
- NIE Secrets in Git committen (auch nicht in Docs!)
- NIE RLS deaktivieren ohne Grund
- NIE Direct Connection für normale Queries
- NIE Passwörter in Dokumentation schreiben

---

**Letzte Aktualisierung:** 2024-12-05
