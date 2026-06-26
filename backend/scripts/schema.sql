-- Schema for Silent Focus Marketplace

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', -- user, host, admin
    profile_picture TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Host Profiles
CREATE TABLE IF NOT EXISTS host_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    bio TEXT,
    verification_status TEXT DEFAULT 'pending', -- pending, approved, rejected
    stripe_account_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Categories for listings
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL, -- retreat, meditation, walk, biking, workshop, quiet_location
    description TEXT
);

-- Listings (unified for retreats and experiences)
CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    host_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location_address TEXT NOT NULL,
    location_latitude REAL,
    location_longitude REAL,
    price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    duration_minutes INTEGER, -- for short experiences
    start_date DATETIME, -- for retreats
    end_date DATETIME, -- for retreats
    capacity INTEGER NOT NULL,
    status TEXT DEFAULT 'draft', -- draft, published, cancelled, archived
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES host_profiles(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    listing_id TEXT NOT NULL,
    booking_date DATETIME NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed, refunded
    stripe_payment_intent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES listings(id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    booking_id TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    listing_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES listings(id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    listing_id TEXT, -- context of the message
    content TEXT NOT NULL,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES listings(id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL, -- booking_update, message, payment_success, etc.
    data TEXT, -- JSON payload
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    booking_id TEXT,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    type TEXT NOT NULL, -- payment, refund, payout
    status TEXT NOT NULL, -- succeeded, pending, failed
    stripe_transaction_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed Categories
INSERT OR IGNORE INTO categories (id, name, description) VALUES 
('cat_retreat', 'retreat', 'Multi-day silent retreats'),
('cat_meditation', 'meditation', 'Guided or silent meditation sessions'),
('cat_walk', 'walk', 'Silent mindfulness walks'),
('cat_biking', 'biking', 'Mindful biking experiences'),
('cat_workshop', 'workshop', 'Mindfulness and silence workshops'),
('cat_quiet_location', 'quiet_location', 'Access to quiet spaces for individual practice');
