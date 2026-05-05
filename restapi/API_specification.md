# Hotel Technikum – API Use Cases & UI Integration

> **API Version:** 2.0.0  
> **Base URL:** `http://localhost:8080/api/v1`

---

## Übersicht

Dieses Dokument beschreibt die End-to-End Use Cases der Booking API aus Sicht der UI. Für jeden Use Case wird erklärt welche API Calls in welcher Reihenfolge getätigt werden müssen, welche Daten übergeben werden und wie die UI mit den Responses umgeht.

---

## Use Case 1 – Zimmerübersicht ohne Datumsfilter

**Szenario:** Der User öffnet die App und sieht alle verfügbaren Zimmer, ohne ein Datum gewählt zu haben.

### Ablauf

```
UI lädt  →  GET /rooms  →  Zimmer anzeigen
```

### API Call

```http
GET /api/v1/rooms?page=0&size=5
```

### Response (relevant)

```json
{
  "content": [
    {
      "id": 1,
      "title": "Deluxe Suite",
      "imageUrl": "https://hotel-technikum.at/images/rooms/1.jpg",
      "pricePerNight": 149.0,
      "extras": [...],
      "availability": null
    }
  ],
  "totalElements": 12,
  "totalPages": 3,
  "currentPage": 0,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

### UI-Verhalten

- Zimmer werden als Karten angezeigt mit Bild, Titel, Preis pro Nacht und Extras
- `availability` ist `null` → kein Verfügbarkeitsstatus anzeigen
- Pagination: „Weiter"-Button nur anzeigen wenn `hasNextPage: true`
- Nächste Seite: `GET /rooms?page=1&size=5`

---

## Use Case 2 – Zimmerübersicht mit Datumsfilter

**Szenario:** Der User wählt ein Check-in und Check-out Datum. Die UI zeigt sofort welche Zimmer in diesem Zeitraum verfügbar sind – ohne separate Availability-Requests pro Zimmer.

### Ablauf

```
User wählt Datum  →  GET /rooms?checkIn=...&checkOut=...  →  Zimmer mit Verfügbarkeit anzeigen
```

### API Call

```http
GET /api/v1/rooms?page=0&size=5&checkIn=2026-07-01&checkOut=2026-07-05
```

### Response (relevant)

```json
{
  "content": [
    {
      "id": 1,
      "title": "Deluxe Suite",
      "pricePerNight": 149.0,
      "availability": {
        "available": true,
        "nights": 4,
        "totalPrice": 596.0
      }
    },
    {
      "id": 2,
      "title": "Standard Zimmer",
      "pricePerNight": 89.0,
      "availability": {
        "available": false,
        "nights": 4,
        "totalPrice": null
      }
    }
  ],
  ...
}
```

### UI-Verhalten

| `available` | UI                                              |
|-------------|-------------------------------------------------|
| `true`      | „Jetzt buchen"-Button anzeigen, `totalPrice` anzeigen |
| `false`     | Zimmer ausgegraut, „Nicht verfügbar" anzeigen   |

> **Hinweis:** Durch den kombinierten Endpoint wird das N+1-Problem vermieden. Ein einziger Request liefert alle Zimmer inklusive Verfügbarkeit.

---

## Use Case 3 – Zimmerdetail aufrufen

**Szenario:** Der User klickt auf ein Zimmer und sieht die Detailansicht mit vollständiger Beschreibung und allen Extras.

### Ablauf

```
User klickt Zimmer  →  GET /rooms/{id}  →  Detailseite anzeigen
```

### API Call

```http
GET /api/v1/rooms/1
```

### Response (relevant)

```json
{
  "id": 1,
  "title": "Deluxe Suite",
  "description": "Geräumige Suite mit Balkon und Bergblick.",
  "imageUrl": "https://hotel-technikum.at/images/rooms/1.jpg",
  "pricePerNight": 149.0,
  "extras": [
    { "id": 1, "name": "WiFi", "icon": "wifi" },
    { "id": 2, "name": "Minibar", "icon": "cup-hot" },
    { "id": 3, "name": "Balkon", "icon": "door-open" }
  ],
  "availability": null
}
```

### UI-Verhalten

- Vollständige Beschreibung, alle Extras mit Icons anzeigen
- `imageUrl` ist eine absolute URL → direkt als `src` verwendbar
- Falls der User ein Datum gewählt hat: zusätzlich `GET /rooms/1/availability` aufrufen (siehe Use Case 4)

---

## Use Case 4 – Verfügbarkeit eines einzelnen Zimmers prüfen

**Szenario:** Der User ist auf der Detailseite eines Zimmers und wählt dort erst ein Datum – oder die UI muss die Verfügbarkeit eines einzelnen Zimmers gezielt prüfen.

### Ablauf

```
User wählt Datum auf Detailseite  →  GET /rooms/{id}/availability  →  Preis & Verfügbarkeit anzeigen
```

### API Call

```http
GET /api/v1/rooms/1/availability?checkIn=2026-07-01&checkOut=2026-07-05
```

### Response – Zimmer verfügbar

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

### Response – Zimmer nicht verfügbar

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

### Fehlerfall – ungültiger Zeitraum (400)

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "checkOut must be after checkIn"
}
```

### UI-Verhalten

- `available: true` → Gesamtpreis anzeigen, „Jetzt buchen"-Button aktivieren
- `available: false` → Hinweis anzeigen, Button deaktivieren
- `400` → Validierungsfehler direkt im Datumsfeld anzeigen (z.B. „Abreise muss nach Anreise liegen")
- Maximaler Zeitraum: 30 Nächte → UI sollte dies vorab prüfen um unnötige Requests zu vermeiden

---

## Use Case 5 – Buchung erstellen

**Szenario:** Der User hat ein verfügbares Zimmer gewählt und füllt das Buchungsformular aus.

### Ablauf

```
User füllt Formular aus
  →  UI validiert (Email-Format, Pflichtfelder, Datum)
  →  POST /bookings
  →  Weiterleitung zur Bestätigungsseite
```

### UI-Validierung (vor dem Request)

| Feld        | Regel                              |
|-------------|------------------------------------|
| `firstName` | Nicht leer, max. 100 Zeichen       |
| `lastName`  | Nicht leer, max. 100 Zeichen       |
| `email`     | Gültiges E-Mail-Format             |
| `checkIn`   | Nicht in der Vergangenheit         |
| `checkOut`  | Nach `checkIn`, max. 30 Nächte     |
| `breakfast` | Muss ausgewählt sein (Ja / Nein)   |

### API Call

```http
POST /api/v1/bookings
Content-Type: application/json

{
  "roomId": 1,
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05",
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.com",
  "breakfast": true
}
```

### Response – Erfolg (201)

```json
{
  "id": "a3f1c2d4-e5b6-7890-abcd-ef1234567890",
  "room": { ... },
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05",
  "nights": 4,
  "breakfast": true,
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.com",
  "totalPrice": 626.0,
  "status": "CONFIRMED",
  "createdAt": "2026-05-04T14:30:00Z"
}
```

### Fehlerfall – Validierungsfehler (400)

```json
{
  "status": 400,
  "message": "Validation failed",
  "fieldErrors": [
    { "field": "email", "message": "must be a valid email address" }
  ]
}
```

### Fehlerfall – Zimmer nicht mehr verfügbar (409)

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Room is no longer available for the selected dates"
}
```

### UI-Verhalten

| Status | UI-Aktion                                                                 |
|--------|---------------------------------------------------------------------------|
| `201`  | Booking-ID aus Response speichern, weiterleiten zu `/confirmation/{id}`   |
| `400`  | `fieldErrors` auslesen, Fehlermeldungen bei den jeweiligen Feldern anzeigen |
| `409`  | Hinweis „Zimmer wurde zwischenzeitlich gebucht", zurück zur Zimmerauswahl |
| `500`  | Generische Fehlermeldung anzeigen                                         |

> **Wichtig:** Die `id` aus der Response ist eine UUID (z.B. `a3f1c2d4-...`). Diese muss die UI speichern um anschließend die Bestätigungsseite aufzurufen.

---

## Use Case 6 – Buchungsbestätigung anzeigen

**Szenario:** Nach erfolgreicher Buchung wird der User zur Bestätigungsseite weitergeleitet. Diese zeigt alle Buchungsdetails und Hotelinformationen.

### Ablauf

```
Weiterleitung nach POST /bookings
  →  GET /bookings/{id}
  →  Bestätigungsseite anzeigen
```

### API Call

```http
GET /api/v1/bookings/a3f1c2d4-e5b6-7890-abcd-ef1234567890
```

### Response (relevant)

```json
{
  "id": "a3f1c2d4-e5b6-7890-abcd-ef1234567890",
  "room": {
    "title": "Deluxe Suite",
    "imageUrl": "https://hotel-technikum.at/images/rooms/1.jpg"
  },
  "checkIn": "2026-07-01",
  "checkOut": "2026-07-05",
  "nights": 4,
  "breakfast": true,
  "totalPrice": 626.0,
  "status": "CONFIRMED",
  "createdAt": "2026-05-04T14:30:00Z",
  "hotel": {
    "name": "Boutique Hotel Technikum",
    "address": "Höchstädtplatz 6, 1200 Wien",
    "phone": "+43 1 XXXXXXX",
    "email": "info@hotel-technikum.at",
    "directions": "U6 Station Dresdner Straße, 2 Minuten Fußweg",
    "coordinates": { "lat": 48.2392, "lng": 16.378 }
  }
}
```

### UI-Verhalten

- Buchungsdetails anzeigen: Zimmer, Zeitraum, Nächte, Frühstück, Gesamtpreis
- Hotelinformationen anzeigen: Adresse, Telefon, Anfahrt
- `coordinates` können für eine eingebettete Karte verwendet werden
- `createdAt` ist immer UTC → UI muss in lokale Zeitzone konvertieren (Wien = UTC+1 / UTC+2)
- `status: CONFIRMED` → grüne Bestätigungsanzeige
- `status: CANCELLED` → Hinweis dass Buchung storniert wurde

---

## Use Case 7 – Buchung stornieren

**Szenario:** Der User möchte eine bestehende Buchung stornieren. Die UI kennt die Booking-UUID (z.B. aus der Bestätigungsseite oder einem gespeicherten Link).

### Ablauf

```
User klickt „Stornieren"
  →  Bestätigungsdialog anzeigen
  →  DELETE /bookings/{id}
  →  Stornierungsbestätigung anzeigen
```

### API Call

```http
DELETE /api/v1/bookings/a3f1c2d4-e5b6-7890-abcd-ef1234567890
```

### Response – Erfolg (200)

```json
{
  "id": "a3f1c2d4-e5b6-7890-abcd-ef1234567890",
  "status": "CANCELLED",
  ...
}
```

### Fehlerfall – bereits storniert (409)

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Booking is already cancelled"
}
```

### UI-Verhalten

| Status | UI-Aktion                                              |
|--------|--------------------------------------------------------|
| `200`  | `status: CANCELLED` anzeigen, „Stornieren"-Button entfernen |
| `409`  | Hinweis „Buchung wurde bereits storniert"              |
| `404`  | Hinweis „Buchung nicht gefunden"                       |

> **Empfehlung:** Vor dem DELETE-Call immer einen Bestätigungsdialog anzeigen („Möchten Sie die Buchung wirklich stornieren?").

---

## Gesamtüberblick – UI Call-Sequenzen

```
Startseite
└── GET /rooms                                    (Use Case 1)

Startseite mit Datum
└── GET /rooms?checkIn=...&checkOut=...           (Use Case 2)

Zimmerdetail
└── GET /rooms/{id}                               (Use Case 3)
    └── GET /rooms/{id}/availability              (Use Case 4, falls Datum gewählt)

Buchungsformular
└── POST /bookings                                (Use Case 5)
    └── GET /bookings/{id}                        (Use Case 6)
        └── DELETE /bookings/{id}                 (Use Case 7)
```
