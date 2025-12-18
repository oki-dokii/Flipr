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

  CREATE TABLE IF NOT EXISTS shipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id INTEGER NOT NULL,
    shipment_name TEXT NOT NULL,
    weight_kg REAL NOT NULL,
    volume_m3 REAL NOT NULL,
    destination TEXT NOT NULL,
    delivery_deadline DATETIME NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'assigned', 'in_transit', 'delivered')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_shipments_warehouse ON shipments(warehouse_id);
  CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);

  CREATE TABLE IF NOT EXISTS booking_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id INTEGER NOT NULL,
    truck_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    dealer_id INTEGER NOT NULL,
    status TEXT DEFAULT 'requested' CHECK(status IN ('requested', 'approved', 'rejected')),
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME,
    notes TEXT,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
    FOREIGN KEY (truck_id) REFERENCES trucks(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dealer_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_booking_warehouse ON booking_requests(warehouse_id);
  CREATE INDEX IF NOT EXISTS idx_booking_dealer ON booking_requests(dealer_id);
  CREATE INDEX IF NOT EXISTS idx_booking_status ON booking_requests(status);
  CREATE INDEX IF NOT EXISTS idx_booking_shipment ON booking_requests(shipment_id);
`);

export default db;
