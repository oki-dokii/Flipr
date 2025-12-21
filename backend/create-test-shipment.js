/**
 * Create test shipment with in_transit status for tracking demo
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'database.db'));

console.log('Creating test shipment with in_transit status...\n');

// Get warehouse user (assuming ID 1 exists)
const warehouse = db.prepare('SELECT id, name FROM users WHERE role = "warehouse" LIMIT 1').get();

if (!warehouse) {
    console.error('❌ No warehouse user found. Please register a warehouse user first.');
    process.exit(1);
}

console.log(`✅ Found warehouse: ${warehouse.name} (ID: ${warehouse.id})`);

// Create test shipment
const shipmentData = {
    warehouse_id: warehouse.id,
    shipment_name: 'Electronics Shipment - TEST',
    weight_kg: 500,
    volume_m3: 2.5,
    destination_city: 'Delhi',
    destination_state: 'Delhi',
    destination_latitude: 28.6139,
    destination_longitude: 77.2090,
    estimated_distance_km: 350,
    delivery_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    priority: 'high',
    status: 'in_transit'
};

const insertShipment = db.prepare(`
    INSERT INTO shipments (
        warehouse_id, shipment_name, weight_kg, volume_m3,
        destination_city, destination_state, destination_latitude, destination_longitude,
        estimated_distance_km, delivery_deadline, priority, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const result = insertShipment.run(
    shipmentData.warehouse_id,
    shipmentData.shipment_name,
    shipmentData.weight_kg,
    shipmentData.volume_m3,
    shipmentData.destination_city,
    shipmentData.destination_state,
    shipmentData.destination_latitude,
    shipmentData.destination_longitude,
    shipmentData.estimated_distance_km,
    shipmentData.delivery_deadline,
    shipmentData.priority,
    shipmentData.status
);

const shipmentId = result.lastInsertRowid;

console.log(`✅ Created shipment ID: ${shipmentId}`);
console.log(`   Name: ${shipmentData.shipment_name}`);
console.log(`   Status: ${shipmentData.status}`);
console.log(`   Destination: ${shipmentData.destination_city}, ${shipmentData.destination_state}`);
console.log(`   Weight: ${shipmentData.weight_kg} kg`);
console.log(`   Volume: ${shipmentData.volume_m3} m³`);

// Get a truck to create a booking
const truck = db.prepare('SELECT id, truck_name FROM trucks LIMIT 1').get();

if (truck) {
    console.log(`\n✅ Found truck: ${truck.truck_name} (ID: ${truck.id})`);

    // Create approved booking
    const dealer = db.prepare('SELECT id FROM users WHERE role = "dealer" LIMIT 1').get();

    if (dealer) {
        const insertBooking = db.prepare(`
            INSERT INTO booking_requests (
                shipment_id, truck_id, warehouse_id, dealer_id, status,
                start_date, end_date
            ) VALUES (?, ?, ?, ?, 'approved', ?, ?)
        `);

        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const bookingResult = insertBooking.run(
            shipmentId,
            truck.id,
            warehouse.id,
            dealer.id,
            startDate,
            endDate
        );

        console.log(`✅ Created approved booking ID: ${bookingResult.lastInsertRowid}`);
    }
}

console.log('\n🎉 Test shipment created successfully!');
console.log('\n📍 How to view tracking:');
console.log(`   1. Go to: http://localhost:8080/shipments`);
console.log(`   2. Find shipment: "${shipmentData.shipment_name}"`);
console.log(`   3. Click the "Track" button (cyan-blue gradient)`);
console.log(`   4. Or go directly to: http://localhost:8080/shipments/${shipmentId}/track`);

db.close();
