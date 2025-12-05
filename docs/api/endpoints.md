# API-Endpunkte - OpenCarBox & Carvantooo

> **API-Dokumentation**
> Alle verfügbaren API-Endpunkte der Plattform.

**Version:** 1.0.0  
**Basis-URL:** `/api`  
**Aktualisiert:** 2024-12-05

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

## Response-Format

### Erfolg

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### Fehler

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Beschreibung des Fehlers",
    "details": { ... }
  }
}
```

---

## Fehler-Codes

| Code | HTTP | Beschreibung |
|------|------|--------------|
| `VALIDATION_ERROR` | 400 | Ungültige Eingabedaten |
| `UNAUTHORIZED` | 401 | Nicht authentifiziert |
| `FORBIDDEN` | 403 | Keine Berechtigung |
| `NOT_FOUND` | 404 | Ressource nicht gefunden |
| `CONFLICT` | 409 | Konflikt (z.B. Duplikat) |
| `INTERNAL_ERROR` | 500 | Server-Fehler |

---

**Letzte Aktualisierung:** 2024-12-05

