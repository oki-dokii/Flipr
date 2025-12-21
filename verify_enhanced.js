

const API_URL = 'http://localhost:3001/api';
let warehouseToken = '';
let dealerToken = '';
let warehouseId = 0;
let dealerId = 0;
let truckId = 0;
let shipmentId = 0;
let bookingId = 0;

// Register/Login Users
async function setupUsers() {
    console.log('\n--- Setting up Users ---');
    // Warehouse
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'wh_enhanced@test.com',
                password: 'password123',
                name: 'Test Warehouse',
                company: 'WH Co',
                role: 'warehouse',
                city: 'Test City',
                state: 'Test State'
            })
        });
        const data = await res.json();
        if (data.token) {
            warehouseToken = data.token;
            warehouseId = data.user.id;
        } else {
            // Login if exists
            const login = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'wh_enhanced@test.com', password: 'password123' })
            });
            const loginData = await login.json();
            warehouseToken = loginData.token;
            warehouseId = loginData.user.id;
        }
        console.log('Warehouse token obtained');
    } catch (e) { console.error('Warehouse setup failed', e); }

    // Dealer
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'dlr_enhanced@test.com',
                password: 'password123',
                name: 'Test Dealer',
                company: 'DLR Co',
                role: 'dealer',
                city: 'Test City',
                state: 'Test State'
            })
        });
        const data = await res.json();
        if (data.token) {
            dealerToken = data.token;
            dealerId = data.user.id;
        } else {
            // Login if exists
            const login = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'dlr_enhanced@test.com', password: 'password123' })
            });
            const loginData = await login.json();
            dealerToken = loginData.token;
            dealerId = loginData.user.id;
        }
        console.log('Dealer token obtained');
    } catch (e) { console.error('Dealer setup failed', e); }
}

async function setupResources() {
    console.log('\n--- Setting up Resources ---');
    // Create Truck
    // Create Truck
    const truckRes = await fetch(`${API_URL}/trucks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${dealerToken}`
        },
        body: JSON.stringify({
            truck_name: 'Overload Tester 3000',
            truck_type: 'Heavy Duty',
            max_weight_kg: 10000,
            max_volume_m3: 100,
            length_m: 10, width_m: 2.5, height_m: 3,
            cost_per_km: 2, base_cost: 100,
            service_regions: ['Test City']
        })
    });

    let truckData;
    if (!truckRes.ok) {
        console.error('Truck Register Failed:', truckRes.status, truckRes.statusText);
        const text = await truckRes.text();
        console.error('Response:', text);
        throw new Error('Truck registration failed');
    } else {
        truckData = await truckRes.json();
    }

    truckId = truckData.truckId;

    if (!truckId) {
        // Try to fetch existing
        const list = await fetch(`${API_URL}/trucks`, {
            headers: { 'Authorization': `Bearer ${dealerToken}` }
        });
        const listData = await list.json();
        if (listData.trucks && listData.trucks.length > 0) truckId = listData.trucks[0].id;
    }
    console.log('Truck ID:', truckId);

    // Create Overloaded Shipment (12000kg > 10000kg)
    const shipRes = await fetch(`${API_URL}/shipments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${warehouseToken}`
        },
        body: JSON.stringify({
            shipment_name: 'Overload Cargo',
            weight_kg: 12000, // 120% capacity
            volume_m3: 50,
            origin_city: 'City A', origin_state: 'State A',
            destination_city: 'City B', destination_state: 'State B',
            delivery_deadline: '2026-06-01'
        })
    });
    const shipData = await shipRes.json();
    shipmentId = shipData.shipmentId;
    console.log('Shipment ID:', shipmentId);
}

async function testOverloadFlow() {
    console.log('\n--- Testing Overload Flow ---');
    // 1. Create Booking
    const bookRes = await fetch(`${API_URL}/bookings/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${warehouseToken}`
        },
        body: JSON.stringify({
            shipment_id: shipmentId,
            truck_id: truckId,
            start_date: '2026-07-01',
            end_date: '2026-07-03',
            notes: 'Test Booking'
        })
    });
    const bookData = await bookRes.json();
    bookingId = bookData.bookingId;
    console.log('Booking Created ID:', bookingId);

    // 2. Verify Status is on_hold and Notes have Guidance
    const getRes = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${warehouseToken}` }
    });
    const booking = (await getRes.json()).booking;

    console.log('Status:', booking.status);
    console.log('Notes contain "Resolution":', booking.notes.includes('[GUIDANCE] Resolution'));

    if (booking.status !== 'on_hold') throw new Error('Booking should be on_hold');
    if (!booking.notes.includes('Reduce weight by at least')) throw new Error('Missing weight reduction guidance');
}

async function testOverride() {
    console.log('\n--- Testing Override ---');
    const res = await fetch(`${API_URL}/bookings/${bookingId}/override`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${dealerToken}`
        },
        body: JSON.stringify({ justification: 'I have a stronger chassis installed' })
    });
    const data = await res.json();
    console.log('Override Result:', data);

    const check = await fetch(`${API_URL}/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${dealerToken}` }
    });
    const booking = (await check.json()).booking;
    console.log('New Status:', booking.status);
    console.log('Notes contain Override Log:', booking.notes.includes('[OVERRIDE] Approved'));

    if (booking.status !== 'approved') throw new Error('Booking should be approved');
}

async function testMetrics() {
    console.log('\n--- Testing Safety Metrics ---');
    const res = await fetch(`${API_URL}/analytics/safety`, {
        headers: { 'Authorization': `Bearer ${dealerToken}` }
    });
    const metrics = await res.json();
    console.log('Metrics:', metrics);

    if (metrics.totalRisks < 1) throw new Error('Total risks should be > 0');
    // Prevented might be 0 if the only one is now approved? 
    // Logic: prevented = (status IN on_hold, rejected) AND warning.
    // If we overrode it, status is approved. So prevented count decreases for that specific booking.
    // But totalRisks counts all ever flagged.
    // Overrides count approved + override note.

    if (metrics.overrides < 1) throw new Error('Overrides should be > 0');
}

async function run() {
    try {
        await setupUsers();
        await setupResources();
        await testOverloadFlow();
        await testOverride();
        await testMetrics();
        console.log('\n✅ ALL TESTS PASSED');
    } catch (e) {
        console.error('\n❌ TEST FAILED:', e);
        process.exit(1);
    }
}

run();
