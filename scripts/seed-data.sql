-- Insert categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Sports', 'Sports equipment and accessories'),
('Home', 'Home appliances and furniture'),
('Accessories', 'Various accessories and add-ons')
ON CONFLICT DO NOTHING;

-- Insert admin user
INSERT INTO users (email, name, password_hash, role) VALUES
('admin@store.com', 'Admin User', '$2b$10$example_hash_for_admin123', 'admin'),
('user@store.com', 'Regular User', '$2b$10$example_hash_for_user123', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert products
INSERT INTO products (name, description, price, image_url, category_id, stock, rating, review_count) VALUES
('Wireless Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life.', 299.99, '/wireless-headphones.png', 1, 25, 4.5, 128),
('Smart Watch', 'Advanced fitness tracking smartwatch with heart rate monitor.', 199.99, '/smartwatch-lifestyle.png', 1, 15, 4.3, 89),
('Running Shoes', 'Lightweight running shoes with advanced cushioning technology.', 129.99, '/running-shoes-on-track.png', 2, 30, 4.7, 203),
('Coffee Maker', 'Programmable coffee maker with built-in grinder and thermal carafe.', 149.99, '/modern-coffee-maker.png', 3, 12, 4.4, 67),
('Laptop Backpack', 'Water-resistant laptop backpack with multiple compartments.', 79.99, '/laptop-backpack.png', 4, 40, 4.6, 156),
('Bluetooth Speaker', 'Portable Bluetooth speaker with 360-degree sound and waterproof design.', 89.99, '/bluetooth-speaker.png', 1, 22, 4.2, 94)
ON CONFLICT DO NOTHING;

-- Insert sample orders
INSERT INTO orders (user_id, total, status, shipping_address) VALUES
(2, 429.98, 'processing', '{"street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA"}'),
(2, 399.98, 'shipped', '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zipCode": "90210", "country": "USA"}'),
(2, 229.98, 'delivered', '{"street": "789 Pine St", "city": "Chicago", "state": "IL", "zipCode": "60601", "country": "USA"}')
ON CONFLICT DO NOTHING;

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 299.99),
(1, 3, 1, 129.99),
(2, 2, 2, 199.99),
(3, 4, 1, 149.99),
(3, 5, 1, 79.99)
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Amazing sound quality and battery life!'),
(2, 2, 4, 'Great fitness tracking features, very accurate.'),
(2, 3, 5, 'Most comfortable running shoes I have ever owned.'),
(2, 4, 4, 'Makes excellent coffee, easy to use.'),
(2, 5, 5, 'Perfect size for my laptop and very durable.')
ON CONFLICT DO NOTHING;
