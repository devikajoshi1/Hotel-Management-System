-- Sample rooms for a fresh Luxora database.
--
-- Run this once, AFTER starting the backend for the first time
-- (Spring creates the tables on startup).
-- Running it again adds the same rooms a second time.

USE hotel_booking;

INSERT INTO rooms (room_number, room_type, price, capacity, available, description, image_url) VALUES
('101', 'Standard Room', 3000, 2, true,
 'A cosy room with a queen bed, work desk and city view. Ideal for short stays.',
 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'),

('102', 'Deluxe Room', 4500, 2, true,
 'Spacious room with a king bed, sitting area and a large rain shower.',
 'https://images.unsplash.com/photo-1611892440504-42a792e24d32'),

('201', 'Executive Room', 6000, 3, true,
 'Premium room with a lounge chair, work area and complimentary breakfast.',
 'https://images.unsplash.com/photo-1590490360182-c33d57733427'),

('202', 'Family Room', 6500, 4, true,
 'Two queen beds and extra space for families travelling together.',
 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'),

('301', 'Luxury Suite', 7500, 2, true,
 'Separate living room, bathtub and panoramic views over the city.',
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'),

('302', 'Presidential Suite', 12000, 4, true,
 'Our finest suite with a dining area, private balcony and butler service.',
 'https://images.unsplash.com/photo-1618773928121-c32242e63f39');

-- Making an admin account
-- 1. Register the account normally in the app (passwords are hashed, so
--    they cannot be inserted here by hand).
-- 2. Find its id:     SELECT id, email, role FROM users;
-- 3. Make it admin:   UPDATE users SET role = 'ADMIN' WHERE id = <id>;
-- 4. Log out and log in again.
