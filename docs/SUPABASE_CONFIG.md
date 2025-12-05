# Supabase Konfiguration - OpenCarBox & Carvantooo

> **WICHTIGE DOKUMENTATION**
> Alle Supabase-Credentials und Konfigurationen.

**Projekt:** OpenCarBox & Carvantooo  
**Supabase Projekt-ID:** `twkdrljfjkbypyhdnhyw`  
**Region:** EU Central (Frankfurt)  
**Aktualisiert:** 2024-12-05

---

## 🔑 Credentials

### Public Keys (Browser-sicher)

```env
NEXT_PUBLIC_SUPABASE_URL=https://twkdrljfjkbypyhdnhyw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_-_TYsWD7ArLjLSqbMhCf3g_dp0YM8gr
```

### Private Keys (NUR Server-side!)

⚠️ **NIEMALS im Browser oder Frontend-Code verwenden!**

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SECRET_KEY=sb_secret_dDQeQ6c7gCMPs8JD8KZx0g_VUGy9wdX
```

---

## 🗄️ Datenbank-URLs

### Pooled Connection (Standard)

Für normale Queries mit Connection Pooling (PgBouncer):

```env
POSTGRES_URL=postgres://postgres.twkdrljfjkbypyhdnhyw:fHYfEWKt04N02gZD@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
```

### Prisma-spezifisch

Für Prisma ORM mit PgBouncer:

```env
POSTGRES_PRISMA_URL=postgres://postgres.twkdrljfjkbypyhdnhyw:fHYfEWKt04N02gZD@aws-1-eu-central-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

### Direct Connection (Non-Pooling)

Für Migrationen und Admin-Aufgaben:

```env
POSTGRES_URL_NON_POOLING=postgres://postgres.twkdrljfjkbypyhdnhyw:fHYfEWKt04N02gZD@aws-1-eu-central-2.pooler.supabase.com:5432/postgres?sslmode=require
```

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

```typescript
// Migrationen werden automatisch über MCP angewendet
```

### Über SQL Editor (manuell)

1. Öffne Supabase Dashboard
2. Navigiere zu SQL Editor
3. Führe Migration-Files aus `/supabase/migrations/` aus

---

## 🔗 Links

- **Dashboard:** https://supabase.com/dashboard/project/twkdrljfjkbypyhdnhyw
- **API Docs:** https://supabase.com/dashboard/project/twkdrljfjkbypyhdnhyw/api
- **Table Editor:** https://supabase.com/dashboard/project/twkdrljfjkbypyhdnhyw/editor
- **Storage:** https://supabase.com/dashboard/project/twkdrljfjkbypyhdnhyw/storage/buckets

---

## ⚠️ Sicherheit

### DO's ✅

- Verwende ANON_KEY im Browser
- Verwende SERVICE_ROLE nur in Server-Code
- Halte RLS aktiviert
- Teste Policies regelmäßig

### DON'Ts ❌

- NIE SERVICE_ROLE im Frontend
- NIE Secrets in Git committen
- NIE RLS deaktivieren ohne Grund
- NIE Direct Connection für normale Queries

---

**Letzte Aktualisierung:** 2024-12-05
