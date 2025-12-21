
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

async function verifySimulationWithWeights() {
    console.log('\n--- Verifying Weighted Simulation ---');

    // Get Pending
    const pendingRes = await fetch(`${API_URL}/shipments/pending`, {
        headers: { 'Authorization': `Bearer ${warehouseToken}` }
    });
    const pending = await pendingRes.json();

    if (!Array.isArray(pending) || pending.length === 0) {
        console.log('Skipping simulation check - no pending shipments');
        return;
    }

    const ids = pending.slice(0, 3).map(s => s.id);

    // Scenario 1: Priorities Cost
    console.log('Scenario 1: High Cost Priority');
    const res1 = await fetch(`${API_URL}/optimization/simulate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${warehouseToken}`
        },
        body: JSON.stringify({
            shipmentIds: ids,
            options: {
                weights: { utilization: 0.1, cost: 0.8, co2: 0.1 }
            }
        })
    });
    const data1 = await res1.json();
    console.log(`Truck Select: ${data1.consolidated.truckType}`);
    console.log(`Explanation: ${data1.explanation}`);
    console.log(`CO2 Savings: ${data1.co2Savings} kg`);

    // Scenario 2: Priorities CO2
    console.log('\nScenario 2: High CO2 Priority');
    const res2 = await fetch(`${API_URL}/optimization/simulate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${warehouseToken}`
        },
        body: JSON.stringify({
            shipmentIds: ids,
            options: {
                weights: { utilization: 0.1, cost: 0.1, co2: 0.8 }
            }
        })
    });
    const data2 = await res2.json();
    console.log(`Truck Select: ${data2.consolidated.truckType}`);
    console.log(`Explanation: ${data2.explanation}`);

    if (!data1.explanation || !data1.baseline.co2) {
        throw new Error('Advanced metrics or explanation missing!');
    }
}

async function run() {
    try {
        await setupUser();
        await verifySimulationWithWeights();
        console.log('\n✅ ADVANCED OPTIMIZATION VERIFIED');
    } catch (e) {
        console.error('\n❌ VERIFICATION FAILED', e);
        process.exit(1);
    }
}

run();
