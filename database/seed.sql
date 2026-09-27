-- The 10 Luxora rooms, for setting up a fresh database.
--
-- Run this once, AFTER starting the backend for the first time
-- (Spring creates the tables on startup).
-- Do not run it on a database that already has these rooms:
-- running it again adds every room a second time.

USE hotel_booking;

INSERT INTO rooms (room_number, room_type, price, capacity, available, description, image_url) VALUES
('101', 'Luxury Deluxe', 3000, 2, true,
 'Beautiful luxury room with a comfortable bed and city view',
 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'),

('102', 'Standard Room', 2000, 2, true,
 'Comfortable and elegant room with modern facilities for a relaxing stay.',
 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),

('103', 'Deluxe Room', 3000, 2, true,
 'Spacious deluxe room featuring a comfortable interior and beautiful city views.',
 'https://images.unsplash.com/photo-1611892440504-42a792e24d32'),

('104', 'Luxury Suite', 5000, 4, true,
 'Premium luxury suite with spacious interiors, elegant furnishings and a relaxing atmosphere.',
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'),

('105', 'Classic Room', 2500, 2, true,
 'A bright, comfortable room with a queen bed and a large window overlooking the city.',
 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),

('201', 'Executive Room', 4000, 2, true,
 'A modern king room with warm lighting, a work desk and premium bedding for business travellers.',
 'https://images.unsplash.com/photo-1618773928121-c32242e63f39'),

('202', 'Premium King Room', 3500, 2, true,
 'A stylish king room with artwork, a cosy seating bench and soft natural light.',
 'https://images.unsplash.com/photo-1540518614846-7eded433c457'),

('203', 'Family Room', 4500, 4, true,
 'Two double beds, extra space and a sitting area, ideal for families travelling together.',
 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061'),

('301', 'Grand Suite', 6500, 3, true,
 'A spacious suite with a king bed, a separate sitting area and garden views.',
 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8'),

('302', 'Presidential Suite', 9000, 4, true,
 'Our finest suite, with floor-to-ceiling glass, a private lounge and panoramic views.',
 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461');

-- Making an admin account
-- 1. Register the account normally in the app (passwords are hashed, so
--    they cannot be inserted here by hand).
-- 2. Find its id:     SELECT id, email, role FROM users;
-- 3. Make it admin:   UPDATE users SET role = 'ADMIN' WHERE id = <id>;
-- 4. Log out and log in again.
