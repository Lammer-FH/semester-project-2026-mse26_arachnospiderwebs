-- ============================================================
-- V1: Initial schema - rooms, extras, bookings
-- Cross-database compatible (SQLite + H2)
-- ============================================================

CREATE TABLE IF NOT EXISTS extra (
    id   INTEGER       PRIMARY KEY,
    name VARCHAR(100)  NOT NULL UNIQUE,
    icon VARCHAR(100)  NOT NULL
);

CREATE TABLE IF NOT EXISTS room (
    id               INTEGER        PRIMARY KEY,
    title            VARCHAR(255)   NOT NULL,
    description      VARCHAR(4000)  NOT NULL,
    image_url        VARCHAR(512)   NOT NULL,
    price_per_night  DECIMAL(10,2)  NOT NULL
);

CREATE TABLE IF NOT EXISTS room_extra (
    room_id  INTEGER NOT NULL REFERENCES room(id)  ON DELETE CASCADE,
    extra_id INTEGER NOT NULL REFERENCES extra(id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, extra_id)
);

CREATE TABLE IF NOT EXISTS booking (
    id          VARCHAR(36)   PRIMARY KEY,
    room_id     INTEGER       NOT NULL REFERENCES room(id),
    first_name  VARCHAR(100)  NOT NULL,
    last_name   VARCHAR(100)  NOT NULL,
    email       VARCHAR(255)  NOT NULL,
    breakfast   BOOLEAN       NOT NULL DEFAULT FALSE,
    check_in    DATE          NOT NULL,
    check_out   DATE          NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status      VARCHAR(20)   NOT NULL DEFAULT 'CONFIRMED'
                              CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (check_out >= check_in)
);

CREATE INDEX IF NOT EXISTS idx_booking_room_id  ON booking(room_id);
CREATE INDEX IF NOT EXISTS idx_booking_dates    ON booking(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_booking_email    ON booking(email);
CREATE INDEX IF NOT EXISTS idx_booking_status   ON booking(status);

-- Seed extras
INSERT INTO extra (id, name, icon) VALUES (1, 'WiFi',         'wifi');
INSERT INTO extra (id, name, icon) VALUES (2, 'Minibar',      'cup-hot');
INSERT INTO extra (id, name, icon) VALUES (3, 'Balkon',       'door-open');
INSERT INTO extra (id, name, icon) VALUES (4, 'Safe',         'lock');
INSERT INTO extra (id, name, icon) VALUES (5, 'Klimaanlage',  'thermometer-snow');
INSERT INTO extra (id, name, icon) VALUES (6, 'Parkplatz',    'car-front');

-- Seed rooms
INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (1, 'Deluxe Suite',
        'Geräumige Suite mit Balkon und Bergblick.',
        '/images/rooms/1.jpg',
        149.00);

INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (2, 'Standard Doppelzimmer',
        'Komfortables Zimmer für zwei Personen.',
        '/images/rooms/2.jpg',
        89.00);

INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (3, 'Einzelzimmer Komfort',
        'Ruhiges Zimmer mit Stadtblick, ideal für Geschäftsreisende.',
        '/images/rooms/3.jpg',
        79.00);

INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (4, 'Junior Suite',
        'Großzügige Suite mit getrenntem Wohnbereich.',
        '/images/rooms/4.jpg',
        129.00);

INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (5, 'Dachterrassenzimmer',
        'Exklusives Zimmer mit privatem Zugang zur Dachterrasse.',
        '/images/rooms/5.jpg',
        189.00);

-- Seed room-extra mappings
INSERT INTO room_extra (room_id, extra_id) VALUES (1, 1);
INSERT INTO room_extra (room_id, extra_id) VALUES (1, 2);
INSERT INTO room_extra (room_id, extra_id) VALUES (1, 3);
INSERT INTO room_extra (room_id, extra_id) VALUES (1, 5);

INSERT INTO room_extra (room_id, extra_id) VALUES (2, 1);
INSERT INTO room_extra (room_id, extra_id) VALUES (2, 4);

INSERT INTO room_extra (room_id, extra_id) VALUES (3, 1);
INSERT INTO room_extra (room_id, extra_id) VALUES (3, 4);
INSERT INTO room_extra (room_id, extra_id) VALUES (3, 6);

INSERT INTO room_extra (room_id, extra_id) VALUES (4, 1);
INSERT INTO room_extra (room_id, extra_id) VALUES (4, 2);
INSERT INTO room_extra (room_id, extra_id) VALUES (4, 5);

INSERT INTO room_extra (room_id, extra_id) VALUES (5, 1);
INSERT INTO room_extra (room_id, extra_id) VALUES (5, 2);
INSERT INTO room_extra (room_id, extra_id) VALUES (5, 3);
INSERT INTO room_extra (room_id, extra_id) VALUES (5, 5);
INSERT INTO room_extra (room_id, extra_id) VALUES (5, 6);
