-- ============================================================
-- Boutique Hotel Technikum – SQLite Schema v2.0
-- Angepasst an API v2.0.0
-- ============================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ------------------------------------------------------------
-- extra
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS extra (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100) NOT NULL
);

-- ------------------------------------------------------------
-- room
-- imageUrl: absolute URL statt relativem Pfad (API v2)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS room (
    id               INTEGER        PRIMARY KEY AUTOINCREMENT,
    title            VARCHAR(255)   NOT NULL,
    description      TEXT           NOT NULL,
    image_url        VARCHAR(512)   NOT NULL,   -- absolute URL, war: image VARCHAR(255)
    price_per_night  DECIMAL(10,2)  NOT NULL
);

-- ------------------------------------------------------------
-- room_extra (n:m)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS room_extra (
    room_id  INTEGER NOT NULL REFERENCES room(id)  ON DELETE CASCADE,
    extra_id INTEGER NOT NULL REFERENCES extra(id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, extra_id)
);

-- ------------------------------------------------------------
-- booking
-- id:        TEXT/UUID statt BIGINT (API v2)
-- status:    CONFIRMED | CANCELLED   (API v2, war: nicht vorhanden)
-- check_in == check_out: erlaubt (= 1 Nacht), CHECK verhindert check_out < check_in
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS booking (
    id          TEXT           PRIMARY KEY,                          -- UUID
    room_id     INTEGER        NOT NULL REFERENCES room(id),
    first_name  VARCHAR(100)   NOT NULL,
    last_name   VARCHAR(100)   NOT NULL,
    email       VARCHAR(255)   NOT NULL,
    breakfast   BOOLEAN        NOT NULL DEFAULT 0,
    check_in    DATE           NOT NULL,
    check_out   DATE           NOT NULL,
    total_price DECIMAL(10,2)  NOT NULL,
    status      VARCHAR(20)    NOT NULL DEFAULT 'CONFIRMED'
                               CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    created_at  TIMESTAMP      NOT NULL DEFAULT (datetime('now')),
    CHECK (check_out >= check_in)                                    -- check_out == check_in erlaubt (1 Nacht)
);

-- ------------------------------------------------------------
-- Indexe
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_booking_room_id         ON booking(room_id);
CREATE INDEX IF NOT EXISTS idx_booking_dates           ON booking(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_booking_email           ON booking(email);
CREATE INDEX IF NOT EXISTS idx_booking_status         ON booking(status);

-- ============================================================
-- Testdaten
-- ============================================================

-- Extras
INSERT INTO extra (name, icon) VALUES ('WiFi',         'wifi');
INSERT INTO extra (name, icon) VALUES ('Minibar',      'cup-hot');
INSERT INTO extra (name, icon) VALUES ('Balkon',       'door-open');
INSERT INTO extra (name, icon) VALUES ('Safe',         'lock');
INSERT INTO extra (name, icon) VALUES ('Klimaanlage',  'thermometer-snow');
INSERT INTO extra (name, icon) VALUES ('Parkplatz',    'car-front');

-- Zimmer (absolute image_url)
INSERT INTO room (title, description, image_url, price_per_night)
VALUES ('Deluxe Suite',
        'Geräumige Suite mit Balkon und Bergblick.',
        'https://hotel-technikum.at/images/rooms/1.jpg',
        149.00);

INSERT INTO room (title, description, image_url, price_per_night)
VALUES ('Standard Doppelzimmer',
        'Komfortables Zimmer für zwei Personen.',
        'https://hotel-technikum.at/images/rooms/2.jpg',
        89.00);

INSERT INTO room (title, description, image_url, price_per_night)
VALUES ('Einzelzimmer Komfort',
        'Ruhiges Zimmer mit Stadtblick, ideal für Geschäftsreisende.',
        'https://hotel-technikum.at/images/rooms/3.jpg',
        79.00);

INSERT INTO room (title, description, image_url, price_per_night)
VALUES ('Junior Suite',
        'Großzügige Suite mit getrenntem Wohnbereich.',
        'https://hotel-technikum.at/images/rooms/4.jpg',
        129.00);

INSERT INTO room (title, description, image_url, price_per_night)
VALUES ('Dachterrassenzimmer',
        'Exklusives Zimmer mit privatem Zugang zur Dachterrasse.',
        'https://hotel-technikum.at/images/rooms/5.jpg',
        189.00);

-- Zimmer-Extras
INSERT INTO room_extra (room_id, extra_id) VALUES (1, 1); -- Deluxe: WiFi
INSERT INTO room_extra (room_id, extra_id) VALUES (1, 2); -- Deluxe: Minibar
INSERT INTO room_extra (room_id, extra_id) VALUES (1, 3); -- Deluxe: Balkon
INSERT INTO room_extra (room_id, extra_id) VALUES (1, 5); -- Deluxe: Klimaanlage

INSERT INTO room_extra (room_id, extra_id) VALUES (2, 1); -- Standard: WiFi
INSERT INTO room_extra (room_id, extra_id) VALUES (2, 4); -- Standard: Safe

INSERT INTO room_extra (room_id, extra_id) VALUES (3, 1); -- Einzelzimmer: WiFi
INSERT INTO room_extra (room_id, extra_id) VALUES (3, 4); -- Einzelzimmer: Safe
INSERT INTO room_extra (room_id, extra_id) VALUES (3, 6); -- Einzelzimmer: Parkplatz

INSERT INTO room_extra (room_id, extra_id) VALUES (4, 1); -- Junior: WiFi
INSERT INTO room_extra (room_id, extra_id) VALUES (4, 2); -- Junior: Minibar
INSERT INTO room_extra (room_id, extra_id) VALUES (4, 5); -- Junior: Klimaanlage

INSERT INTO room_extra (room_id, extra_id) VALUES (5, 1); -- Dachterrasse: WiFi
INSERT INTO room_extra (room_id, extra_id) VALUES (5, 2); -- Dachterrasse: Minibar
INSERT INTO room_extra (room_id, extra_id) VALUES (5, 3); -- Dachterrasse: Balkon
INSERT INTO room_extra (room_id, extra_id) VALUES (5, 5); -- Dachterrasse: Klimaanlage
INSERT INTO room_extra (room_id, extra_id) VALUES (5, 6); -- Dachterrasse: Parkplatz

-- Beispiel-Buchungen (UUID als TEXT)
INSERT INTO booking (id, room_id, first_name, last_name, email, breakfast, check_in, check_out, total_price, status)
VALUES ('a3f1c2d4-e5b6-7890-abcd-ef1234567890', 1, 'Max',  'Mustermann', 'max@example.com',  1, '2026-07-01', '2026-07-05', 626.00, 'CONFIRMED');

INSERT INTO booking (id, room_id, first_name, last_name, email, breakfast, check_in, check_out, total_price, status)
VALUES ('b7e2d3c5-f6a7-8901-bcde-fg2345678901', 2, 'Anna', 'Musterfrau', 'anna@example.com', 0, '2026-07-10', '2026-07-10', 89.00,  'CONFIRMED'); -- same-day = 1 Nacht

INSERT INTO booking (id, room_id, first_name, last_name, email, breakfast, check_in, check_out, total_price, status)
VALUES ('c8f3e4d6-g7b8-9012-cdef-gh3456789012', 3, 'Hans', 'Huber',      'hans@example.com', 0, '2026-06-01', '2026-06-03', 158.00, 'CANCELLED');
