# AI_USAGE.md

---

## Session 1 – 05.05.2026

**Tool:** Claude Sonnet 4.6 (claude.ai)

### 1 · OpenAPI Spec generieren
**Task:** `openapi.json` aus bestehender Markdown-Spec erstellen  
**Result:** ✅ Vollständig akzeptiert

### 2 · API-Design kritisieren (Advocatus Diaboli)
**Task:** Schwachstellen der API identifizieren  
**Result:** Teilweise akzeptiert  
- ❌ Auth & Rate Limiting → außerhalb Projektscope  
- 🔄 `emailConfirm` → nach eigener Analyse als UI-only erkannt, aus Backend entfernt  
- 🔄 Frühstück → zunächst als fehlend markiert, nach Klärung korrekt wieder aufgenommen

### 3 · OpenAPI v2 umsetzen
**Task:** Kritikpunkte in `openapi.json` einarbeiten  
**Result:** ✅ Vollständig akzeptiert (UUID, N+1-Fix, Stornierung, Paginierung, imageUrl, UTC)

### 4 · Use Case Dokumentation
**Task:** `api-usecases.md` mit E2E-Flows und API-Calls erstellen  
**Result:** ✅ Vollständig akzeptiert

### 5 · Edge Cases analysieren & umsetzen
**Task:** Fehlende Edge Cases identifizieren, API-Fähigkeit prüfen, dokumentieren  
**Result:** Teilweise akzeptiert  
- 🔄 `checkIn === checkOut` → AI markierte als Lücke, Regel selbst entschieden (= 1 Nacht)  
- ❌ Timeout-Handling → kein API-Thema, nicht dokumentiert

### 6 · Commit Messages
**Task:** Conventional Commit Messages für beide Änderungsrunden  
**Result:** ✅ Vollständig akzeptiert

---

> **Legende:** ✅ akzeptiert · 🔄 modifiziert · ❌ abgelehnt

### 7 · DB-Design bewerten & SQLite File generieren
**Task:** Bestehendes DB-Design gegen API v2.0.0 prüfen, SQLite File + ERD erstellen  
**Result:** Teilweise akzeptiert  
- ✅ Diskrepanzen identifiziert: `booking.id` → UUID, `room.image` → `image_url`, fehlendes `status`-Feld, fehlerhafte Availability-Query bei `checkIn === checkOut`
- ✅ SQLite Schema + Testdaten generiert
- ✅ ERD via mermaid.js mit Legende und Beispielbuchung
- ❌ Frühstück als eigene `booking_option`-Tabelle → MVP-Entscheidung, bleibt als `BOOLEAN`

### 8 · AI_USAGE.md dokumentieren
**Task:** AI Usage für DB-Session nachführen  
**Result:** ✅ Vollständig akzeptiert

### 9 · DB_Design.md erstellen
**Task:** Aktualisierte `DB_Design.md` basierend auf API v2 und SQLite-Schema erstellen  
**Result:** ✅ Vollständig akzeptiert

### 10 · MySQL 8 als Datenbank einrichten
**Task:** Backend-Setup auf MySQL aufsetzen  
**Result:** ✅ Vollständig akzeptiert  
- ✅ `build.gradle.kts` (backend): `mysql-connector-j` als JDBC-Treiber + `flyway-mysql` für die Migrationen
- ✅ Flyway-Migration MySQL-kompatibel aufgesetzt: `AUTO_INCREMENT` für Primärschlüssel, explizite `FOREIGN KEY` Constraints, `CREATE INDEX` ohne `IF NOT EXISTS` (von MySQL nicht unterstützt)
- ✅ Indizes auf `booking` (Datum, E-Mail, Status); FK-Spalten indiziert InnoDB automatisch
- ✅ Gradle-Task `dbReset` (`flywayClean`) zum Zurücksetzen aller Tabellen
- ✅ Gradle-Task `dbSetup` (`-ProotPassword=…`): legt Datenbank `hotel_booking` + User `hotel` idempotent per JDBC an (Ein-Befehl-Setup statt manuellem `CREATE DATABASE`/`CREATE USER`)
- ✅ README: MySQL-Setup, Env-Variablen `DB_URL`/`DB_USERNAME`/`DB_PASSWORD` dokumentiert
