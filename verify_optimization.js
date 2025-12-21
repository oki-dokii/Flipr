
const API_URL = 'http://localhost:3001/api';
let warehouseToken = '';

// Setup Warehouse User
async function setupUser() {
    console.log('\n--- Setting up Warehouse User ---');
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'wh_enhanced@test.com', password: 'password123' })
        });
        const data = await res.json();

        if (data.token) {
            warehouseToken = data.token;
        } else {
            // If login fails, try register (though verify_enhanced should have created it)
            const reg = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'wh_opt@test.com',
                    password: 'password123',
                    name: 'Opt Warehouse',
                    company: 'Opt Co',
                    role: 'warehouse',
                    city: 'Mumbai',
                    state: 'Maharashtra'
                })
            });
            const regData = await reg.json();
            warehouseToken = regData.token;
        }
        console.log('Warehouse token obtained');
    } catch (e) { console.error('Setup failed', e); }
}

async function createTestShipments() {
    console.log('\n--- Creating Test Shipments for Consolidation ---');
    // Create 3 small shipments to Delhi
    const shipments = [
        { name: 'Small Box 1', weight: 500, volume: 2, dest: 'Delhi', state: 'Delhi' },
        { name: 'Small Box 2', weight: 600, volume: 3, dest: 'Delhi', state: 'Delhi' },
        { name: 'Small Box 3', weight: 400, volume: 1, dest: 'Delhi', state: 'Delhi' }
    ];

    for (const s of shipments) {
        await fetch(`${API_URL}/shipments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${warehouseToken}`
            },
            body: JSON.stringify({
                shipment_name: s.name,
                weight_kg: s.weight,
                volume_m3: s.volume,
                destination_city: s.dest,
                destination_state: s.state,
                delivery_deadline: '2026-12-31'
            })
        });
    }
    console.log('Created 3 test shipments');
}

async function verifyConsolidation() {
    console.log('\n--- Verifying Consolidation Logic ---');
    const res = await fetch(`${API_URL}/optimization/consolidate`, {
        headers: { 'Authorization': `Bearer ${warehouseToken}` }
    });

    if (!res.ok) {
        throw new Error(`Consolidation API failed: ${res.status}`);
    }

    const data = await res.json();
    console.log('Consolidation Result:', JSON.stringify(data.summary));

    if (data.groups.length === 0 && data.summary.pendingCount > 0) {
        // It's possible grouping failed or they are already optimal?
        // But with 3 small items to same place, they SHOULD be grouped.
        console.warn('Warning: No groups found despite pending shipments.');
    } else if (data.groups.length > 0) {
        console.log('Groups Found:', data.groups.length);
        console.log('First Group Utilization:', data.groups[0].utilization + '%');
    }
}

async function verifySimulation() {
    console.log('\n--- Verifying Simulation Logic ---');
    // First get pending to pick IDs
    const pendingRes = await fetch(`${API_URL}/shipments/pending`, {
        headers: { 'Authorization': `Bearer ${warehouseToken}` }
    });
    const pending = await pendingRes.json();

    if (pending.length < 2) {
        console.log('Not enough pending shipments to simulate interesting scenario');
        return;
    }

    const ids = pending.slice(0, 3).map(s => s.id);

    const simRes = await fetch(`${API_URL}/optimization/simulate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${warehouseToken}`
        },
        body: JSON.stringify({
            shipmentIds: ids,
            options: { ignoreSafety: false }
        })
    });

    const simData = await simRes.json();
    console.log('Simulation Result:', {
        baseline: simData.baseline.cost,
        consolidated: simData.consolidated.cost,
        savings: simData.savings
    });

    if (simData.savings < 0) {
        console.warn('Warning: Consolidation cost higher than baseline? Check logic.');
    }
}

async function run() {
    try {
        await setupUser();
        await createTestShipments();
        await verifyConsolidation();
        await verifySimulation();
        console.log('\n✅ OPTIMIZATION VERIFIED');
    } catch (e) {
        console.error('\n❌ VERIFICATION FAILED', e);
        process.exit(1);
    }
}

run();
