import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'database.sqlite'));

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    role TEXT NOT NULL CHECK(role IN ('warehouse', 'dealer')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

  CREATE TABLE IF NOT EXISTS trucks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dealer_id INTEGER NOT NULL,
    truck_name TEXT NOT NULL,
    truck_type TEXT NOT NULL,
    max_weight_kg REAL NOT NULL,
    max_volume_m3 REAL NOT NULL,
    length_m REAL NOT NULL,
    width_m REAL NOT NULL,
    height_m REAL NOT NULL,
    service_regions TEXT NOT NULL,
    cost_per_km REAL NOT NULL,
    base_cost REAL NOT NULL,
    availability_status TEXT DEFAULT 'available' CHECK(availability_status IN ('available', 'booked', 'maintenance')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dealer_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_trucks_dealer ON trucks(dealer_id);
  CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(availability_status);
`);

export default db;
