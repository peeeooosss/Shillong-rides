-- seed.sql — demo fleet + one launch coupon. Run AFTER migrations.
-- Usage: psql "$DATABASE_URL" -f db/seed.sql
-- Replace demo rows with client-approved data before launch (or DELETE WHERE is_demo).

INSERT INTO vehicles (name, category, type, price_per_day, seats, transmission, fuel, image_url, tag, rating, is_demo) VALUES
('Maruti Suzuki Swift', 'Car', 'Hatchback', 2200, 5, 'Manual', 'Petrol', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85', 'City favourite', 4.9, TRUE),
('Hyundai Creta', 'Car', 'SUV', 3800, 5, 'Automatic', 'Petrol', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85', 'Made for the hills', 4.8, TRUE),
('Royal Enfield Classic 350', 'Bike', 'Cruiser', 1400, 2, 'Manual', 'Petrol', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85', 'Rider''s pick', 4.9, TRUE),
('Honda Activa 6G', 'Scooty', 'Scooter', 750, 2, 'Automatic', 'Petrol', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85', 'Easy city rides', 4.7, TRUE),
('Mahindra Thar', 'Car', 'Adventure SUV', 5200, 4, 'Manual', 'Diesel', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85', 'Adventure ready', 4.9, TRUE),
('TVS Ntorq 125', 'Scooty', 'Sport scooter', 850, 2, 'Automatic', 'Petrol', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85', 'Quick & nimble', 4.7, TRUE)
ON CONFLICT DO NOTHING;

-- Launch offer: 10% off, capped at Rs 500, min 2-day rental. Manage in Admin portal afterwards.
INSERT INTO coupons (code, kind, value, max_discount, min_days, active) VALUES
('HILLS10', 'percent', 10, 500, 2, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Create the first admin AFTER you have a bcrypt hash. Generate one with:
--   node -e "console.log(require('bcryptjs').hashSync('YOUR_STRONG_PASSWORD', 10))"
-- then run:
--   INSERT INTO users (phone, password_hash, name, role)
--   VALUES ('9864854481', '<PASTE_HASH>', 'Admin', 'admin');
