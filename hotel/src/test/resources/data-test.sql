INSERT INTO extra (id, name, icon) VALUES (1, 'WiFi',        'wifi');
INSERT INTO extra (id, name, icon) VALUES (2, 'Minibar',     'cup-hot');
INSERT INTO extra (id, name, icon) VALUES (3, 'Balkon',      'door-open');
INSERT INTO extra (id, name, icon) VALUES (4, 'Safe',        'lock');
INSERT INTO extra (id, name, icon) VALUES (5, 'Klimaanlage', 'thermometer-snow');
INSERT INTO extra (id, name, icon) VALUES (6, 'Parkplatz',   'car-front');

INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (1, 'Deluxe Suite', 'Geraeumige Suite mit Balkon und Bergblick.',
        'https://hotel-technikum.at/images/rooms/1.jpg', 149.00);

INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (2, 'Standard Doppelzimmer', 'Komfortables Zimmer fuer zwei Personen.',
        'https://hotel-technikum.at/images/rooms/2.jpg', 89.00);

INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (3, 'Einzelzimmer Komfort', 'Ruhiges Zimmer mit Stadtblick.',
        'https://hotel-technikum.at/images/rooms/3.jpg', 79.00);

INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (4, 'Junior Suite', 'Grosszuegige Suite mit getrenntem Wohnbereich.',
        'https://hotel-technikum.at/images/rooms/4.jpg', 129.00);

INSERT INTO room (id, title, description, image_url, price_per_night)
VALUES (5, 'Dachterrassenzimmer', 'Exklusives Zimmer mit privatem Zugang.',
        'https://hotel-technikum.at/images/rooms/5.jpg', 189.00);

INSERT INTO room_extra (room_id, extra_id) VALUES (1,1),(1,2),(1,3),(1,5);
INSERT INTO room_extra (room_id, extra_id) VALUES (2,1),(2,4);
INSERT INTO room_extra (room_id, extra_id) VALUES (3,1),(3,4),(3,6);
INSERT INTO room_extra (room_id, extra_id) VALUES (4,1),(4,2),(4,5);
INSERT INTO room_extra (room_id, extra_id) VALUES (5,1),(5,2),(5,3),(5,5),(5,6);
