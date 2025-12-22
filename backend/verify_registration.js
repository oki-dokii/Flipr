import db, { dbPromise } from './database.js';

async function verifyRegistration() {
    await dbPromise;
    console.log("Starting registration verification...");

    const email = `dealer_test_${Date.now()}@example.com`;
    const password = "password123";
    const name = "Test Dealer";
    const company = "Test Logistics";
    const role = "dealer";
    const city = "Test City";
    const state = "Test State";

    // Simulate API call logic by calling createUser directly (since we can't easily fetch localhost without running server context)
    // Wait, I can use fetch if node version supports it, or just test the model logic which is the core change.
    // Testing model logic is safer/faster for this environment.

    try {
        const { createUser } = await import('./models/User.js');
        const userId = await createUser(email, password, name, company, role, city, state);
        console.log(`Created user with ID: ${userId}`);

        // Verify DB
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        console.log("Retrieved User:", {
            id: user.id,
            email: user.email,
            role: user.role,
            city: user.city,
            state: user.state
        });

        if (user.city === city && user.state === state) {
            console.log("SUCCESS: City and State saved correctly.");
        } else {
            console.error("FAILURE: City/State mismatch.");
            console.error(`Expected: ${city}, ${state}`);
            console.error(`Actual: ${user.city}, ${user.state}`);
        }

    } catch (e) {
        console.error("Verification failed:", e);
    }
}

verifyRegistration();
