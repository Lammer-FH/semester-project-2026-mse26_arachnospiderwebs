# API Specification – Boutique Hotel Technikum

> **Projekt:** Hotel Booking Interface
> **Version:** 1.0
> **Stand:** 04.05.2026

---

## Überblick

REST API für die Buchungs-App des Hotel Technikum. Gäste können Hotelzimmer durchsuchen, Verfügbarkeit prüfen und Zimmer buchen.

**Base-URL:** `http://localhost:8080/api/v1`

**Content-Type:** `application/json`

---

## Endpoint-Übersicht

| Methode | Endpoint                   | Beschreibung                | User Story |
| ------- | -------------------------- | --------------------------- | ---------- |
| GET     | `/rooms`                   | Paginierte Zimmerliste      | U2         |
| GET     | `/rooms/{id}`              | Zimmerdetails               | U2         |
| GET     | `/rooms/{id}/availability` | Verfügbarkeit prüfen        | U3         |
| POST    | `/bookings`                | Buchung erstellen           | U4         |
| GET     | `/bookings/{id}`           | Buchungsbestätigung abrufen | U5         |

---

---

## Ressourcen

---

### 1. Rooms (Hotelzimmer) – U2

#### GET `/rooms`

Gibt eine paginierte Liste aller Hotelzimmer zurück. Standardmäßig 5 Zimmer pro Seite.

**Query-Parameter:**

| Parameter | Typ     | Default | Beschreibung             |
| --------- | ------- | ------- | ------------------------ |
| page      | Integer | 0       | Seitennummer (0-basiert) |
| size      | Integer | 5       | Anzahl Zimmer pro Seite  |

**Response: `200 OK`**

```json
{
  "content": [
    {
      "id": 1,
      "title": "Deluxe Suite",
      "description": "Geräumige Suite mit Balkon und Bergblick.",
      "image": "/images/rooms/1.jpg",
      "pricePerNight": 149.0,
      "extras": [
        { "id": 1, "name": "WiFi", "icon": "wifi" },
        { "id": 2, "name": "Minibar", "icon": "cup-hot" },
        { "id": 3, "name": "Balkon", "icon": "door-open" }
      ]
    }
  ],
  "totalElements": 12,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 5
}
```

**Statuscodes:** 200, 500

---

#### GET `/rooms/{id}`

Gibt die Details eines einzelnen Zimmers zurück.

**Path-Parameter:**

| Parameter | Typ  | Beschreibung        |
| --------- | ---- | ------------------- |
| id        | Long | ID des Hotelzimmers |

**Response: `200 OK`**

```json
{
  "id": 1,
  "title": "Deluxe Suite",
  "description": "Geräumige Suite mit Balkon und Bergblick.",
  "image": "/images/rooms/1.jpg",
  "pricePerNight": 149.0,
  "extras": [
    { "id": 1, "name": "WiFi", "icon": "wifi" },
    { "id": 2, "name": "Minibar", "icon": "cup-hot" },
    { "id": 3, "name": "Balkon", "icon": "door-open" }
  ]
}
```

**Statuscodes:** 200, 404, 500

---

### 2. Availability (Verfügbarkeit) – U3

#### GET `/rooms/{id}/availability`

Prüft, ob ein bestimmtes Zimmer im gewünschten Zeitraum verfügbar ist.

**Path-Parameter:**

| Parameter | Typ  | Beschreibung        |
| --------- | ---- | ------------------- |
| id        | Long | ID des Hotelzimmers |

**Query-Parameter:**

| Parameter | Typ       | Pflicht | Beschreibung                        |
| --------- | --------- | ------- | ----------------------------------- |
| checkIn   | LocalDate | Ja      | Anreisedatum (Format: `YYYY-MM-DD`) |
| checkOut  | LocalDate | Ja      | Abreisedatum (Format: `YYYY-MM-DD`) |

**Response: `200 OK`**

```json
{
  "roomId": 1,
  "roomTitle": "Deluxe Suite",
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05",
  "available": true,
  "nights": 4,
  "totalPrice": 596.0
}
```

**Fehlerfall – Zimmer nicht verfügbar:**

```json
{
  "roomId": 1,
  "roomTitle": "Deluxe Suite",
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05",
  "available": false,
  "nights": 4,
  "totalPrice": null
}
```

**Validierungsregeln:**

- `checkIn` darf nicht in der Vergangenheit liegen
- `checkOut` muss nach `checkIn` liegen
- Maximaler Buchungszeitraum: 30 Nächte

**Statuscodes:** 200, 400 (ungültiger Zeitraum), 404 (Zimmer nicht gefunden), 500

---

### 3. Bookings (Buchungen) – U4 & U5

#### POST `/bookings`

Erstellt eine neue Buchung für ein verfügbares Zimmer.

**Request Body:**

```json
{
  "roomId": 1,
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05",
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.com",
  "emailConfirm": "max@example.com",
  "breakfast": true
}
```

**Validierungsregeln:**

- `firstName`: nicht leer, max. 100 Zeichen
- `lastName`: nicht leer, max. 100 Zeichen
- `email`: gültiges E-Mail-Format
- `emailConfirm`: muss mit `email` übereinstimmen
- `breakfast`: boolean, Pflichtfeld
- `roomId`: muss existierendes Zimmer referenzieren
- `checkIn` / `checkOut`: gültig, Zimmer muss im Zeitraum verfügbar sein

**Response: `201 Created`**

```json
{
  "id": 42,
  "room": {
    "id": 1,
    "title": "Deluxe Suite",
    "description": "Geräumige Suite mit Balkon und Bergblick.",
    "image": "/images/rooms/1.jpg",
    "pricePerNight": 149.0,
    "extras": [{ "id": 1, "name": "WiFi", "icon": "wifi" }]
  },
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05",
  "nights": 4,
  "breakfast": true,
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.com",
  "totalPrice": 596.0,
  "createdAt": "2026-05-04T14:30:00Z"
}
```

**Statuscodes:** 201, 400 (Validierungsfehler), 404 (Zimmer nicht gefunden), 409 (Zimmer nicht mehr verfügbar), 500

---

#### GET `/bookings/{id}`

Gibt die vollständige Buchungsbestätigung zurück inkl. Hotelinformationen (für U5).

**Path-Parameter:**

| Parameter | Typ  | Beschreibung   |
| --------- | ---- | -------------- |
| id        | Long | ID der Buchung |

**Response: `200 OK`**

```json
{
  "id": 42,
  "room": {
    "id": 1,
    "title": "Deluxe Suite",
    "description": "Geräumige Suite mit Balkon und Bergblick.",
    "image": "/images/rooms/1.jpg",
    "pricePerNight": 149.0,
    "extras": [{ "id": 1, "name": "WiFi", "icon": "wifi" }]
  },
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05",
  "nights": 4,
  "breakfast": true,
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.com",
  "totalPrice": 596.0,
  "createdAt": "2026-05-04T14:30:00Z",
  "hotel": {
    "name": "Boutique Hotel Technikum",
    "address": "Höchstädtplatz 6, 1200 Wien",
    "phone": "+43 1 XXXXXXX",
    "email": "info@hotel-technikum.at",
    "directions": "U6 Station Dresdner Straße, 2 Minuten Fußweg",
    "coordinates": {
      "lat": 48.2392,
      "lng": 16.378
    }
  }
}
```

**Statuscodes:** 200, 404, 500

---

## Fehlerbehandlung

Alle Fehler folgen einem einheitlichen Format:

```json
{
  "timestamp": "2026-05-04T14:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "checkOut must be after checkIn",
  "path": "/api/v1/rooms/1/availability"
}
```

**Validierungsfehler (400) bei mehreren Feldern:**

```json
{
  "timestamp": "2026-05-04T14:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "fieldErrors": [
    { "field": "email", "message": "must be a valid email address" },
    { "field": "emailConfirm", "message": "email addresses do not match" }
  ],
  "path": "/api/v1/bookings"
}
```

### Statuscodes Übersicht

| Code | Bedeutung                                     |
| ---- | --------------------------------------------- |
| 200  | Erfolgreiche Anfrage                          |
| 201  | Buchung erfolgreich erstellt                  |
| 400  | Ungültige Anfrage (Validierungsfehler)        |
| 404  | Ressource nicht gefunden (Zimmer / Buchung)   |
| 409  | Konflikt (Zimmer im Zeitraum bereits gebucht) |
| 500  | Interner Serverfehler                         |
