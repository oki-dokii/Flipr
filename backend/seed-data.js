import bcrypt from 'bcryptjs';
import { dbPromise, saveDatabase } from './database.js';

async function seedData() {
    await dbPromise;
    
    const db = (await import('./database.js')).default;
    
    // Check if demo dealer exists
    const demoDealer = db.prepare("SELECT id FROM users WHERE email = ?").get('demo@example.com');
    
    let dealerId;
    
    if (!demoDealer) {
        // Create demo dealer
        const hashedPassword = await bcrypt.hash('demo123', 10);
        const result = db.prepare(`
            INSERT INTO users (email, password, name, company, role, city, state, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            'demo@example.com',
            hashedPassword,
            'Demo Dealer',
            'Flipr Logistics',
            'dealer',
            'Mumbai',
            'Maharashtra',
            19.0760,
            72.8777
        );
        dealerId = result.lastInsertRowid;
        console.log('Created demo dealer with ID:', dealerId);
    } else {
        dealerId = demoDealer.id;
        console.log('Demo dealer already exists with ID:', dealerId);
    }
    
    // Check if demo warehouse exists
    const demoWarehouse = db.prepare("SELECT id FROM users WHERE email = ?").get('warehouse@example.com');
    
    if (!demoWarehouse) {
        const hashedPassword = await bcrypt.hash('warehouse123', 10);
        db.prepare(`
            INSERT INTO users (email, password, name, company, role, city, state, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            'warehouse@example.com',
            hashedPassword,
            'Demo Warehouse',
            'Flipr Warehouse Co',
            'warehouse',
            'Hyderabad',
            'Telangana',
            17.3850,
            78.4867
        );
        console.log('Created demo warehouse');
    }
    
    // Check existing trucks
    const existingTrucks = db.prepare("SELECT COUNT(*) as count FROM trucks WHERE dealer_id = ?").get(dealerId);
    
    if (existingTrucks.count === 0) {
        // Add sample trucks
        const trucks = [
            {
                truck_name: 'Tata Ace Gold',
                truck_type: 'Mini Truck',
                max_weight_kg: 750,
                max_volume_m3: 2.5,
                length_m: 2.1,
                width_m: 1.5,
                height_m: 1.2,
                service_regions: 'West India',
                cost_per_km: 12,
                base_cost: 500
            },
            {
                truck_name: 'Ashok Leyland Dost',
                truck_type: 'Light Commercial',
                max_weight_kg: 1500,
                max_volume_m3: 5.0,
                length_m: 2.8,
                width_m: 1.7,
                height_m: 1.5,
                service_regions: 'South India',
                cost_per_km: 15,
                base_cost: 800
            },
            {
                truck_name: 'Mahindra Bolero Pickup',
                truck_type: 'Pickup Truck',
                max_weight_kg: 1000,
                max_volume_m3: 3.5,
                length_m: 2.4,
                width_m: 1.6,
                height_m: 1.3,
                service_regions: 'Pan India',
                cost_per_km: 14,
                base_cost: 600
            },
            {
                truck_name: 'Eicher Pro 2049',
                truck_type: 'Medium Truck',
                max_weight_kg: 5000,
                max_volume_m3: 20.0,
                length_m: 5.5,
                width_m: 2.4,
                height_m: 2.2,
                service_regions: 'Pan India',
                cost_per_km: 22,
                base_cost: 1500
            },
            {
                truck_name: 'BharatBenz 1617',
                truck_type: 'Heavy Truck',
                max_weight_kg: 10000,
                max_volume_m3: 40.0,
                length_m: 7.2,
                width_m: 2.5,
                height_m: 2.5,
                service_regions: 'North India',
                cost_per_km: 30,
                base_cost: 2500
            },
            {
                truck_name: 'Tata 407',
                truck_type: 'Light Commercial',
                max_weight_kg: 2500,
                max_volume_m3: 8.0,
                length_m: 3.2,
                width_m: 1.8,
                height_m: 1.8,
                service_regions: 'West India',
                cost_per_km: 16,
                base_cost: 900
            }
        ];
        
        for (const truck of trucks) {
            db.prepare(`
                INSERT INTO trucks (dealer_id, truck_name, truck_type, max_weight_kg, max_volume_m3, 
                    length_m, width_m, height_m, service_regions, cost_per_km, base_cost, availability_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
            `).run(
                dealerId,
                truck.truck_name,
                truck.truck_type,
                truck.max_weight_kg,
                truck.max_volume_m3,
                truck.length_m,
                truck.width_m,
                truck.height_m,
                truck.service_regions,
                truck.cost_per_km,
                truck.base_cost
            );
            console.log('Added truck:', truck.truck_name);
        }
        
        console.log('Added', trucks.length, 'sample trucks');
    } else {
        console.log('Trucks already exist:', existingTrucks.count);
    }
    
    saveDatabase();
    console.log('Seed data completed!');
}

seedData().catch(console.error);
