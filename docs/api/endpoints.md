# API-Endpunkte - OpenCarBox & Carvantooo

> **API-Dokumentation**
> Alle verfügbaren API-Endpunkte der Plattform.

**Version:** 1.1.0  
**Basis-URL:** `/api`  
**Aktualisiert:** 2026-02-16

---

## System- und AI-Endpunkte

### `GET /api/health`

Liefert den technischen Gesundheitsstatus für API + Abhängigkeiten in einer festen Struktur.

**Response (200 / 503):**

```json
{
  "status": "ok",
  "timestamp": "2026-02-16T11:20:00.000Z",
  "dependencies": {
    "database": {
      "status": "up",
      "latencyMs": 34,
      "details": "Supabase auth health reachable."
    },
    "aiService": {
      "status": "up",
      "latencyMs": 0,
      "details": "AI provider configuration is present."
    }
  }
}
```

**Status-Codes:**
- `200` = alle Dependencies `up`
- `503` = mindestens eine Dependency `degraded` oder `down`

---

### `POST /api/ai/chat`

Proxied AI Chat Completion gegen den konfigurierten DeepSeek Provider.

**Request-Body (Zod-validiert):**

```json
{
  "model": "deepseek-chat",
  "temperature": 0.7,
  "max_tokens": 512,
  "messages": [
    { "role": "user", "content": "Wie wechsle ich Bremsbeläge?" }
  ]
}
```

**Regeln:**
- `messages`: 1..50 Einträge
- `role`: `system | user | assistant`
- `content`: nicht leer, max. 8000 Zeichen
- `max_tokens`: positive Ganzzahl, max. 4096
- `temperature`: 0..2

**Rate Limit:**
- pro Client (`x-forwarded-for` / `x-real-ip`)
- Standard: `20` Requests / 60 Sekunden
- konfigurierbar via `AI_CHAT_RATE_LIMIT_PER_MINUTE`

**Success Response (200):**

```json
{
  "provider": "deepseek",
  "id": "cmpl-123",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "..."
      }
    }
  ]
}
```

**Fehler-Response (Beispiel):**

```json
{
  "error": "Validation failed.",
  "code": "VALIDATION_ERROR",
  "details": {
    "fieldErrors": {
      "messages": ["Array must contain at least 1 element(s)"]
    }
  }
}
```

**Status-Codes:**
- `400` `INVALID_JSON` / `VALIDATION_ERROR`
- `429` `RATE_LIMIT_EXCEEDED` (inkl. `Retry-After` Header)
- `502` `AI_UPSTREAM_ERROR`
- `503` `FEATURE_DISABLED`

---

## Authentifizierung

Alle geschützten Endpunkte erfordern einen gültigen Supabase JWT-Token im Authorization-Header:

```
Authorization: Bearer <supabase-jwt-token>
```

---

## Shop-API

### Produkte

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/products` | Alle Produkte abrufen | Nein |
| GET | `/api/products/[id]` | Einzelnes Produkt | Nein |
| GET | `/api/products/category/[slug]` | Produkte nach Kategorie | Nein |
| GET | `/api/products/search` | Produktsuche | Nein |
| POST | `/api/products` | Produkt erstellen | Admin |
| PUT | `/api/products/[id]` | Produkt aktualisieren | Admin |
| DELETE | `/api/products/[id]` | Produkt löschen | Admin |

### Kategorien

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/categories` | Alle Kategorien | Nein |
| GET | `/api/categories/[slug]` | Einzelne Kategorie | Nein |

### Warenkorb

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/cart` | Warenkorb abrufen | Ja |
| POST | `/api/cart/items` | Artikel hinzufügen | Ja |
| PUT | `/api/cart/items/[id]` | Menge ändern | Ja |
| DELETE | `/api/cart/items/[id]` | Artikel entfernen | Ja |

### Bestellungen

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/orders` | Eigene Bestellungen | Ja |
| GET | `/api/orders/[id]` | Einzelne Bestellung | Ja |
| POST | `/api/orders` | Bestellung erstellen | Ja |

---

## Fahrzeug-API

### HSN/TSN Suche

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/vehicles/search` | Fahrzeug suchen | Nein |
| GET | `/api/vehicles/hsn-tsn/[hsn]/[tsn]` | Fahrzeug per HSN/TSN | Nein |
| GET | `/api/vehicles/compatible-parts/[vehicleId]` | Passende Teile | Nein |

### Meine Garage

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/garage` | Eigene Fahrzeuge | Ja |
| POST | `/api/garage` | Fahrzeug hinzufügen | Ja |
| DELETE | `/api/garage/[id]` | Fahrzeug entfernen | Ja |

---

## Werkstatt-API

### Services

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/services` | Alle Services | Nein |
| GET | `/api/services/[slug]` | Einzelner Service | Nein |

### Termine

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/appointments` | Eigene Termine | Ja |
| GET | `/api/appointments/slots` | Verfügbare Slots | Nein |
| POST | `/api/appointments` | Termin buchen | Ja |
| PUT | `/api/appointments/[id]` | Termin ändern | Ja |
| DELETE | `/api/appointments/[id]` | Termin stornieren | Ja |

---

## Autohandel-API

### Fahrzeuge

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| GET | `/api/vehicles-for-sale` | Alle Fahrzeuge | Nein |
| GET | `/api/vehicles-for-sale/[id]` | Einzelnes Fahrzeug | Nein |
| POST | `/api/vehicles-for-sale/inquiry` | Anfrage senden | Nein |
| POST | `/api/vehicles-for-sale/test-drive` | Probefahrt anfragen | Ja |

---

## Webhook-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| POST | `/api/webhooks/stripe` | Stripe Payment Events |
| POST | `/api/webhooks/whatsapp` | WhatsApp Messages |

---

**Letzte Aktualisierung:** 2026-02-16
