# Boutique Hotel Technikum – Hotel Booking Interface

Semester project for *Advanced Webtechnologies* (MSE 2026).

## Prerequisites

| Tool          | Version | Notes                              |
|---------------|---------|------------------------------------|
| Java JDK      | ≥26     | Backend (Spring Boot)              |
| Node.js       | ≥22     | Frontend (Vue + Ionic)             |
| MySQL Server  | ≥8.0    | Database (running on `localhost:3306`) |

Verify with:
```bash
java -version
node --version
mysql --version
```

## Quick Start

Install [MySQL Community Server 8](https://dev.mysql.com/downloads/mysql/) and make sure it is running. Then one command sets up everything — database + application user, frontend deps, backend build (uses the MySQL root password you chose during installation):

```bash
# One-time setup: DB + frontend deps + backend build
./gradlew setup "-ProotPassword=YOUR_ROOT_PASSWORD"

# Start backend (8080) + frontend (5173) concurrently
./gradlew start
```

The schema and seed data are created automatically by Flyway on first backend startup — no manual import needed. The connection defaults to `jdbc:mysql://localhost:3306/hotel_booking` with user/password `hotel`/`hotel` and can be overridden via environment variables: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.

Then open http://localhost:5173 in your browser.

## Available Commands

All commands run from the project root using `./gradlew <task>`.

| Command                    | Description                                  |
|----------------------------|----------------------------------------------|
| `./gradlew setup`          | Full one-shot setup: DB + deps + build (`-ProotPassword=...`) |
| `./gradlew dbSetup`        | DB only: create MySQL database + app user (`-ProotPassword=...`) |
| `./gradlew dbReset`        | Drop all tables in the MySQL database (Flyway re-migrates on next startup) |
| `./gradlew frontendInstall`| Install npm dependencies for the frontend     |
| `./gradlew start`          | Start backend + frontend concurrently         |
| `./gradlew startBackend`   | Start only the Spring Boot backend (blocking) |
| `./gradlew startFrontend`  | Start only the Vite frontend (blocking)       |
| `./gradlew :backend:test`    | Run backend tests                             |
| `./gradlew :backend:build`   | Build the backend (compile + test + jar)      |

## API

The backend automatically generates OpenAPI documentation via springdoc-openapi.

| Resource | URL |
|---|---|
| Swagger UI | http://localhost:8080/swagger-ui/index.html |
| OpenAPI JSON | http://localhost:8080/api-docs |

**Endpoints** (all prefixed with `/api`):

| Method | Path | Description |
|--------|------|-------------|
| GET | `/rooms` | Paginated room list (optional `checkIn`, `checkOut` for availability) |
| GET | `/rooms/{id}` | Room details |
| GET | `/rooms/{id}/availability` | Check availability for a date range |
| POST | `/bookings` | Create a booking |
| GET | `/bookings/{id}` | Get booking confirmation |
| PATCH | `/bookings/{id}` | Cancel a booking |

The frontend dev server proxies `/api` requests to `localhost:8080` (configured in `frontend/vite.config.ts`), so no CORS issues during development.

## Frontend Styling

The app uses two layers of CSS on top of Ionic's built-in design system.

| File | Role |
|---|---|
| `frontend/src/theme/variables.css` | Design tokens — colors, spacing, typography, radii, shadows. Overrides Ionic CSS variables (`--ion-color-primary`, etc.) so all Ionic components reflect our brand. |
| `frontend/src/theme/utilities.css` | Reusable utility classes (spacing, layout, text, card, form, wizard) that consume tokens from `variables.css`. Preferred over writing component-scoped CSS. |

**Rule of thumb**: Style via Ionic component props first (e.g. `color="primary"`, `fill="outline"`), reach for utility classes second, and only write scoped `<style>` when neither fits.

## Database

The schema is managed via [Flyway](https://flywaydb.org/) migrations in `backend/src/main/resources/db/migration/`. Production uses MySQL 8, tests run against H2 in-memory (MySQL compatibility mode) using the same migration.

```mermaid
erDiagram
    room {
        INTEGER id PK
        VARCHAR title
        TEXT description
        VARCHAR image_url
        DECIMAL price_per_night
    }
    extra {
        INTEGER id PK
        VARCHAR name
        VARCHAR icon
    }
    room_extra {
        INTEGER room_id FK
        INTEGER extra_id FK
    }
    booking {
        VARCHAR id PK
        INTEGER room_id FK
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR email
        BOOLEAN breakfast
        DATE check_in
        DATE check_out
        DECIMAL total_price
        VARCHAR status
        TIMESTAMP created_at
    }
    room ||--o{ room_extra : ""
    extra ||--o{ room_extra : ""
    room ||--o{ booking : ""
```

### Tables

| Table | Description |
|-------|-------------|
| `room` | Hotel rooms with title, description, image URL, price per night |
| `extra` | Bookable extras (WiFi, Minibar, etc.) with name and icon |
| `room_extra` | n:m join table linking rooms to extras |
| `booking` | Guest bookings with dates, guest info, breakfast, total price, and status (CONFIRMED / CANCELLED) |

### Availability query

A room is **not available** for `[checkIn, checkOut]` if an overlapping `CONFIRMED` booking exists:

```sql
SELECT COUNT(*) FROM booking
WHERE room_id = :roomId
  AND status = 'CONFIRMED'
  AND check_in  <= :checkOut
  AND check_out >= :checkIn;
```

Result > 0 → room is occupied. (The `<=` / `>=` comparison correctly handles same-day check-in/check-out for a single-night booking.)

### Build & rebuild

```bash
./gradlew dbReset       # drop all tables (Flyway re-migrates on next app startup)
./gradlew :backend:test # runs against H2 in-memory (MySQL mode), uses the same Flyway migration
```

