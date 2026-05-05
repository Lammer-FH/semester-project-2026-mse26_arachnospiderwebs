# Paper Prototype – Hotel Technikum Booking App

> **Projekt:** Hotel Booking Interface
> **Version:** 1.0
> **Stand:** 04.05.2026

---

## U1: Hotel Website

> _Als Gast möchte ich das Hotel in Form einer Website präsentiert bekommen, um mehr darüber zu erfahren._

### Screen 1.1 – Landing Page

```
┌─────────────────────────────────┐
│  🏨 Hotel Technikum          ☰ │
├─────────────────────────────────┤
│                                 │
│   ┌───────────────────────┐     │
│   │                       │     │
│   │     Hero Image        │     │
│   │   (Hotelansicht)      │     │
│   │                       │     │
│   └───────────────────────┘     │
│                                 │
│   Willkommen im                 │
│   Hotel Technikum               │
│                                 │
│   Ihr urbanes Refugium im       │
│   Herzen Wiens.                 │
│                                 │
│   ┌───────────────────────┐     │
│   │  Zimmer entdecken  →  │     │
│   └───────────────────────┘     │
│                                 │
│   📍 Hotel Adresatz 6, 1200 W.  │
│   📞 +43 1 XXX XXXX             │
│   ✉️ info@hotel-technikum.at    │
│                                 │
├─────────────────────────────────┤
│ 🏠Home  🛏️Zimmer  ℹ️About📄Imp│
└─────────────────────────────────┘
```

### Screen 1.2 – Über uns

```
┌─────────────────────────────────┐
│  🏨 Hotel Technikum          ☰ │
├─────────────────────────────────┤
│                                 │
│   ┌───────────────────────┐     │
│   │   Foto: Hotel Innen   │     │
│   └───────────────────────┘     │
│                                 │
│   Über uns                      │
│   ─────────                     │
│   Das Boutique Hotel Technikum  │
│   verbindet modernes Design mit │
│   Wiener Gastfreundschaft.      │
│                                 │
│   Unsere Highlights             │
│   ✦ Zentrale Lage nahe U6      │
│   ✦ Regionales Frühstück       │
│   ✦ Kostenloses WiFi           │
│   ✦ Nachhaltig & klimaneutral  │
│                                 │
│   ┌───────────────────────┐     │
│   │  Foto: Team/Frühstück │     │
│   └───────────────────────┘     │
│                                 │
├─────────────────────────────────┤
│ 🏠Home  🛏️Zimmer  ℹ️About  📄Imp│
└─────────────────────────────────┘
```

### Screen 1.3 – Impressum

```
┌─────────────────────────────────┐
│  🏨 Hotel Technikum          ☰ │
├─────────────────────────────────┤
│                                 │
│   Impressum                     │
│   ─────────                     │
│                                 │
│   Hotel Technikum GmbH          │
│   Höchstädtplatz 6              │
│   1200 Wien, Österreich         │
│                                 │
│   Tel: +43 1 XXX XXXX           │
│   E-Mail: info@hotel-technikum  │
│                                 │
│   FN: XXXXXX                    │
│   UID: ATU XXXXXXXX             │
│   Gerichtsstand: Wien           │
│                                 │
│   Datenschutz                   │
│   ───────────                   │
│   Informationen zum Datenschutz │
│   finden Sie in unserer         │
│   Datenschutzerklärung.         │
│                                 │
├─────────────────────────────────┤
│ 🏠Home  🛏️Zimmer  ℹ️About  📄Imp│
└─────────────────────────────────┘
```

---

## U2: Hotel Room Selection

> _Als Gast möchte ich eine Übersicht der Hotelzimmer und deren Details sehen, um ein passendes Zimmer auszuwählen._

### Screen 2.1 – Zimmerübersicht (paginiert)

```
┌─────────────────────────────────┐
│  🏨 Hotel Technikum          ☰  │
├─────────────────────────────────┤
│                                 │
│   Unsere Zimmer                 │
│                                 │
│   ┌───────────────────────┐     │
│   │  🖼️ rooms/1.jpg       │     │
│   ├───────────────────────┤     │
│   │  Deluxe Suite    €149 │     │
│   │  Bergblick, geräumig  │     │
│   │  (📶)(☕)(🚪)        │     │
│   │  [Verfügbarkeit prüfen]│    │
│   └───────────────────────┘     │
│                                 │
│   ┌───────────────────────┐     │
│   │  🖼️ rooms/2.jpg       │     │
│   ├───────────────────────┤     │
│   │  Standard Doppel €89  │     │
│   │  Komfortabel für zwei │     │
│   │  (📶)(🔒)            │     │
│   │  [Verfügbarkeit prüfen]│    │
│   └───────────────────────┘     │
│                                 │
│   ... (max. 5 Zimmer/Seite)     │
│                                 │
│      [‹] [1] [2] [3] [›]        │
│                                 │
├─────────────────────────────────┤
│ 🏠Home  🛏️Zimmer  ℹ️About  📄Imp│
└─────────────────────────────────┘
```

### Screen 2.2 – Zimmer-Detail

```
┌─────────────────────────────────┐
│  ← Zurück          Zimmerdetail │
├─────────────────────────────────┤
│                                 │
│   ┌───────────────────────┐     │
│   │                       │     │
│   │   Großes Zimmer-Bild  │     │
│   │   (rooms/1.jpg)       │     │
│   │                       │     │
│   └───────────────────────┘     │
│                                 │
│   Deluxe Suite                  │
│   ─────────────                 │
│   Geräumige Suite mit Balkon    │
│   und Bergblick. Perfekt für    │
│   einen erholsamen Aufenthalt.  │
│                                 │
│   Extras:                       │
│   (📶)(☕)(🚪)(🔒)(❄️)          │
│   WiFi Minibar Balkon Safe AC   │
│                                 │
│   ─────────────────────────     │
│   € 149 / Nacht                │
│                                 │
│   ┌───────────────────────┐     │
│   │ Verfügbarkeit prüfen →│     │
│   └───────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

## U3: Check Availability

> _Als Gast möchte ich prüfen, ob ein bestimmtes Zimmer für meinen Wunschzeitraum verfügbar ist._

### Screen 3.1 – Verfügbar ✅

```
┌─────────────────────────────────┐
│  ← Deluxe Suite                 │
├─────────────────────────────────┤
│                                 │
│   Verfügbarkeit prüfen          │
│   Deluxe Suite · € 149 / Nacht  │
│   ─────────────────────────     │
│                                 │
│   Check-in Datum                │
│   ┌───────────────────────┐     │
│   │ 📅  01.07.2026        │     │
│   └───────────────────────┘     │
│                                 │
│   Check-out Datum               │
│   ┌───────────────────────┐     │
│   │ 📅  05.07.2026        │     │
│   └───────────────────────┘     │
│                                 │
│   = 4 Nächte · Gesamt: € 596    │
│                                 │
│   [  Verfügbarkeit prüfen  ]    │
│                                 │
│   ┌─────────────────────────┐   │
│   │ ✅ Zimmer ist verfügbar!│   │
│   │ 01.07.–05.07. (4 Nächte)│   │
│   │ Gesamt: € 596,00       │    │
│   └─────────────────────────┘   │
│                                 │
│   [    Jetzt buchen →     ]     │
│                                 │
└─────────────────────────────────┘
```

### Screen 3.2 – Nicht verfügbar ❌

```
┌─────────────────────────────────┐
│  ← Deluxe Suite                 │
├─────────────────────────────────┤
│                                 │
│   Verfügbarkeit prüfen          │
│   ─────────────────────────     │
│                                 │
│   Check-in:  📅  10.07.2026    │
│   Check-out: 📅  15.07.2026    │
│                                 │
│   [  Verfügbarkeit prüfen  ]   │
│                                 │
│   ┌─────────────────────────┐   │
│   │ ❌ Leider nicht verfüg- │   │
│   │ bar im Zeitraum         │   │
│   │ 10.07. – 15.07.2026    │   │
│   └─────────────────────────┘   │
│                                 │
│   [ ← Anderes Datum wählen ]   │
│   [ ← Zurück zu Zimmern    ]   │
│                                 │
└─────────────────────────────────┘
```

### Screen 3.3 – Validierungsfehler ⚠️

```
┌─────────────────────────────────┐
│  ← Deluxe Suite                 │
├─────────────────────────────────┤
│                                 │
│   Check-in Datum                │
│   ┌───────────────────────┐     │
│   │ 📅  05.07.2026    ⚠️  │     │
│   └───────────────────────┘     │
│   Check-out Datum               │
│   ┌───────────────────────┐     │
│   │ 📅  01.07.2026    ⚠️  │     │
│   └───────────────────────┘     │
│                                 │
│   ┌─────────────────────────┐   │
│   │ ⚠️ Check-out muss nach  │   │
│   │ Check-in liegen         │   │
│   └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

## U4: Book a Hotel Room

> _Als Gast möchte ich ein Zimmer für einen Zeitraum buchen, um eine Unterkunft zu haben._

### Screen 4.1 – Buchungsformular

```
┌─────────────────────────────────┐
│  ← Zurück              Buchung  │
├─────────────────────────────────┤
│                                 │
│   Buchung                       │
│   Deluxe Suite · 01.07.–05.07. │
│   4 Nächte                      │
│   ─────────────────────────     │
│                                 │
│   Vorname *                     │
│   ┌───────────────────────┐     │
│   │ Max                   │     │
│   └───────────────────────┘     │
│                                 │
│   Nachname *                    │
│   ┌───────────────────────┐     │
│   │ Mustermann            │     │
│   └───────────────────────┘     │
│                                 │
│   E-Mail *                      │
│   ┌───────────────────────┐     │
│   │ max@example.com       │     │
│   └───────────────────────┘     │
│                                 │
│   E-Mail bestätigen *           │
│   ┌───────────────────────┐     │
│   │ max@example.com       │     │
│   └───────────────────────┘     │
│                                 │
│   [●━━] Frühstück (+€15/Nacht)  │
│                                 │
│   ─────────────────────────     │
│            Gesamt: € 596,00     │
│                                 │
│   [ Weiter zur Überprüfung → ]  │
│                                 │
└─────────────────────────────────┘
```

### Screen 4.2 – Review vor Absenden

```
┌─────────────────────────────────┐
│  ← Bearbeiten       Überprüfung│
├─────────────────────────────────┤
│                                 │
│   Buchung überprüfen            │
│   ─────────────────────────     │
│                                 │
│   Zimmer                        │
│   ┌─────────────────────────┐   │
│   │ Zimmer:    Deluxe Suite │   │
│   │ Check-in:  01.07.2026   │   │
│   │ Check-out: 05.07.2026   │   │
│   │ Nächte:    4            │   │
│   └─────────────────────────┘   │
│                                 │
│   Persönliche Daten             │
│   ┌─────────────────────────┐   │
│   │ Name:   Max Mustermann  │   │
│   │ E-Mail: max@example.com │   │
│   │ Frühstück: Ja ☕        │   │
│   └─────────────────────────┘   │
│                                 │
│   ═════════════════════════     │
│       Gesamt: € 596,00          │
│   ═════════════════════════     │
│                                 │
│   [    ← Daten ändern     ]     │
│   [ Verbindlich buchen ✓  ]     │
│                                 │
└─────────────────────────────────┘
```

### Screen 4.3 – Validierungsfehler

```
┌─────────────────────────────────┐
│  ← Zurück              Buchung  │
├─────────────────────────────────┤
│                                 │
│   Vorname * ⚠️ Pflichtfeld!     │
│   ┌───────────────────────┐     │
│   │                   ⚠️  │     │
│   └───────────────────────┘     │
│                                 │
│   Nachname *                    │
│   ┌───────────────────────┐     │
│   │ Mustermann            │     │
│   └───────────────────────┘     │
│                                 │
│   E-Mail * ⚠️ Ungültiges Format │
│   ┌───────────────────────┐     │
│   │ max@@example      ⚠️  │    │
│   └───────────────────────┘     │
│                                 │
│   E-Mail best. * ⚠️ Stimmt      │
│   nicht überein!                │
│   ┌───────────────────────┐     │
│   │ max@example.com   ⚠️  │     │
│   └───────────────────────┘     │
│                                 │
│   ┌─────────────────────────┐   │
│   │ ⚠️ Bitte korrigieren    │   │
│   │ Sie die markierten Felder│  │
│   └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## U5: Booking Confirmation

> _Als Gast möchte ich nach der Buchung informiert werden, ob sie erfolgreich war oder fehlgeschlagen ist._

### Screen 5.1 – Erfolgreiche Buchung ✅

```
┌─────────────────────────────────┐
│  🏨 Hotel Technikum             │
├─────────────────────────────────┤
│                                 │
│   ┌─────────────────────────┐   │
│   │    ✅ Buchung bestätigt! │ │
│   └─────────────────────────┘   │
│                                 │
│   Buchungsdetails               │
│   ─────────────────────────     │
│   Buchungs-Nr:   #42            │
│   Check-in:      01.07.2026     │
│   Check-out:     05.07.2026     │
│   Nächte:        4              │
│   Frühstück:     Ja ☕          │
│   Gesamt:        € 596,00       │
│                                 │
│   Zimmer                        │
│   ─────────────────────────     │
│   ┌───────────────────────┐     │
│   │  🖼️ Deluxe Suite      │     │
│   └───────────────────────┘     │
│   Deluxe Suite                  │
│   📶 WiFi · ☕ Minibar · 🚪 Balk│
│                                 │
│   Ihre Daten                    │
│   ─────────────────────────     │
│   Max Mustermann                │
│   max@example.com               │
│                                 │
│   Anreise                       │
│   ─────────────────────────     │
│   ┌───────────────────────┐     │
│   │                       │     │
│   │   📍 Google Maps      │     │
│   │   Höchstädtplatz 6    │     │
│   │   1200 Wien           │     │
│   │                       │     │
│   └───────────────────────┘     │
│   🚇 U6 Dresdner Str. (2 Min.)  │
│   🚗 Parkplatz vorhanden        │
│                                 │
│   Kontakt                       │
│   ─────────────────────────     │
│   📞 +43 1 XXX XXXX             │
│   ✉️ info@hotel-technikum.at    │
│                                 │
│   [  🖨️ Bestätigung drucken  ] │
│   [  ← Zurück zur Startseite ]  │
│                                 │
└─────────────────────────────────┘
```

### Screen 5.2 – Buchung fehlgeschlagen ❌

```
┌─────────────────────────────────┐
│  🏨 Hotel Technikum             │
├─────────────────────────────────┤
│                                 │
│   ┌─────────────────────────┐   │
│   │ ❌ Buchung fehlgeschlagen│  │
│   └─────────────────────────┘   │
│                                 │
│   Das Zimmer ist leider im      │
│   gewählten Zeitraum nicht mehr │
│   verfügbar. Möglicherweise     │
│   wurde es soeben von einem     │
│   anderen Gast gebucht.         │
│                                 │
│   [ Anderen Zeitraum wählen ]   │
│   [ ← Zurück zu Zimmern    ]    │
│                                 │
└─────────────────────────────────┘
```
