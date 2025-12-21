# 🚛 Where Truck Data Comes From

## Data Source Overview

The trucks you see in the recommendations come from a **SQLite database** that stores all truck information registered by truck dealers.

---

## Current Trucks in Database

Here are the 4 trucks currently available:

| ID | Truck Name | Type | Capacity | Volume | Service Regions | Cost/km | Base Cost | Owner |
|----|------------|------|----------|--------|-----------------|---------|-----------|-------|
| 1 | TRK-001 | Box Truck | 10,000 kg | 50 m³ | North India, West India | ₹25 | ₹5,000 | Dealer 3 |
| 2 | yo | Flatbed | 90 kg | 11 m³ | North India | ₹25 | ₹5,000 | Dealer 5 |
| 3 | **Flatbed Pro** | Flatbed | 8,000 kg | 40 m³ | Maharashtra, Gujarat | ₹12 | ₹4,000 | Dealer 2 |
| 4 | **Container Express** | Container Truck | 15,000 kg | 70 m³ | Pan India | ₹20 | ₹7,000 | Dealer 2 |

> **Note**: Trucks 3 & 4 (highlighted) are the ones showing in your scorecard because they match the shipment requirements!

---

## How Trucks Get Into the System

### 1. **Truck Dealers Register Trucks**

Truck dealers (users with role `dealer`) can register their trucks through the application:

**Registration Flow:**
1. Dealer logs in to the application
2. Goes to **"Register Truck"** page
3. Fills in truck details:
   - Truck name
   - Truck type (Box Truck, Flatbed, Container, etc.)
   - Maximum weight capacity (kg)
   - Maximum volume capacity (m³)
   - Dimensions (length, width, height in meters)
   - Service regions (which areas they operate in)
   - Cost per kilometer
   - Base cost
4. Submits the form
5. Truck is saved to the database

**Database Location**: `backend/database.sqlite` → `trucks` table

---

## Database Schema

### Trucks Table Structure

```sql
CREATE TABLE trucks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dealer_id INTEGER NOT NULL,              -- Who owns this truck
  truck_name TEXT NOT NULL,                -- e.g., "Flatbed Pro"
  truck_type TEXT NOT NULL,                -- e.g., "Flatbed"
  max_weight_kg REAL NOT NULL,             -- e.g., 8000
  max_volume_m3 REAL NOT NULL,             -- e.g., 40
  length_m REAL NOT NULL,                  -- e.g., 6.0
  width_m REAL NOT NULL,                   -- e.g., 2.4
  height_m REAL NOT NULL,                  -- e.g., 2.4
  service_regions TEXT NOT NULL,           -- JSON: ["Maharashtra", "Gujarat"]
  cost_per_km REAL NOT NULL,               -- e.g., 12
  base_cost REAL NOT NULL,                 -- e.g., 4000
  availability_status TEXT DEFAULT 'available',  -- available/booked/maintenance
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dealer_id) REFERENCES users(id)
);
```

---

## How the Optimization Algorithm Uses This Data

### Step-by-Step Process:

#### 1. **Warehouse Manager Creates Shipment**
- Shipment details: 5000kg, 25m³, destination "Mumbai"
- Stored in `shipments` table

#### 2. **Manager Clicks "Optimize"**
- Frontend sends request: `POST /api/optimize/1`
- Backend receives the shipment ID

#### 3. **Backend Fetches Available Trucks**

**Code**: [`backend/models/Truck.js`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/backend/models/Truck.js#L118-L146)

```javascript
export const getAvailableTrucks = (filters = {}) => {
    let query = 'SELECT t.*, u.name as dealer_name, u.company as dealer_company 
                 FROM trucks t 
                 JOIN users u ON t.dealer_id = u.id 
                 WHERE t.availability_status = ?';
    const params = ['available'];
    
    // ... filters ...
    
    const trucks = stmt.all(...params);
    return trucks.map(truck => ({
        ...truck,
        service_regions: JSON.parse(truck.service_regions)
    }));
};
```

**What it does:**
- Queries the `trucks` table
- Filters for `availability_status = 'available'`
- Joins with `users` table to get dealer info
- Returns all available trucks

#### 4. **Optimization Algorithm Filters & Scores**

**Code**: [`backend/services/optimizer.js`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/backend/services/optimizer.js#L142-L215)

**Filtering:**
```javascript
const feasibleTrucks = trucks.filter(truck => {
    // Must be available
    if (truck.availability_status !== 'available') return false;
    
    // Must have capacity
    const weightUtilization = shipment.weight_kg / truck.max_weight_kg;
    const volumeUtilization = shipment.volume_m3 / truck.max_volume_m3;
    if (weightUtilization > 1.0 || volumeUtilization > 1.0) return false;
    
    // Must service the route
    const routeScore = calculateRouteScore(shipment, truck);
    if (routeScore === 0) return false;
    
    return true;
});
```

**Why only 2 trucks showed up:**
- ❌ **Truck 1 (TRK-001)**: Doesn't service Mumbai (only North/West India)
- ❌ **Truck 2 (yo)**: Too small (only 90kg capacity for 5000kg shipment)
- ✅ **Truck 3 (Flatbed Pro)**: Services Maharashtra ✓, Has capacity ✓
- ✅ **Truck 4 (Container Express)**: Services Pan India ✓, Has capacity ✓

**Scoring:**
```javascript
const scoredTrucks = feasibleTrucks.map(truck => {
    const scores = {
        capacity: calculateCapacityScore(shipment, truck),
        route: calculateRouteScore(shipment, truck),
        cost: calculateCostScore(truck, feasibleTrucks),
        co2: calculateCO2Score(shipment, truck)
    };
    
    const totalScore = calculateWeightedScore(scores);
    return { truck, totalScore, scores, details };
});
```

#### 5. **Return Top 3 Recommendations**
```javascript
return scoredTrucks
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 3);
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  Truck Dealers  │
│  (Register)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   SQLite Database                   │
│   ┌─────────────────────────────┐   │
│   │  trucks table               │   │
│   │  - id, truck_name           │   │
│   │  - max_weight_kg            │   │
│   │  - max_volume_m3            │   │
│   │  - service_regions          │   │
│   │  - cost_per_km, base_cost   │   │
│   │  - availability_status      │   │
│   └─────────────────────────────┘   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  getAvailableTrucks()               │
│  - Queries all available trucks     │
│  - Returns truck data               │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  optimizeTruckForShipment()         │
│  1. Filter by feasibility           │
│  2. Score each truck (4 criteria)   │
│  3. Sort by total score             │
│  4. Return top 3                    │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  API Response                       │
│  {                                  │
│    recommendations: [               │
│      { truck, totalScore, scores }  │
│    ]                                │
│  }                                  │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Frontend Display                   │
│  - Shows scorecard                  │
│  - Color-coded progress bars        │
│  - Performance details              │
└─────────────────────────────────────┘
```

---

## Key Files

| File | Purpose |
|------|---------|
| [`backend/database.js`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/backend/database.js) | Database schema & initialization |
| [`backend/models/Truck.js`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/backend/models/Truck.js) | Truck CRUD operations & queries |
| [`backend/services/optimizer.js`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/backend/services/optimizer.js) | Optimization algorithm |
| [`backend/routes/optimize.js`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/backend/routes/optimize.js) | API endpoint for optimization |
| [`src/pages/TruckRecommendations.tsx`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/src/pages/TruckRecommendations.tsx) | Frontend scorecard display |

---

## Adding More Trucks

### Option 1: Through the UI
1. Login as a **Truck Dealer**
2. Go to **"Register Truck"** page
3. Fill in truck details
4. Submit

### Option 2: Directly in Database
```sql
INSERT INTO trucks (
  dealer_id, truck_name, truck_type, max_weight_kg, max_volume_m3,
  length_m, width_m, height_m, service_regions, cost_per_km, base_cost
) VALUES (
  2, 'My Truck', 'Box Truck', 10000, 50,
  8.0, 2.5, 2.5, '["Pan India"]', 15, 5000
);
```

---

## Summary

**Where trucks come from:**
1. 🚛 Truck dealers register their trucks through the UI
2. 💾 Data is stored in SQLite database (`trucks` table)
3. 🔍 Algorithm queries all available trucks
4. ⚖️ Filters by feasibility (capacity, route, availability)
5. 📊 Scores remaining trucks across 4 criteria
6. 🏆 Returns top 3 recommendations
7. 🎯 Frontend displays the scorecard

**Current situation:**
- 4 trucks total in database
- 2 trucks match your shipment (Flatbed Pro, Container Express)
- Flatbed Pro scored 90.4/100 (best choice!)
- Container Express scored 36.2/100 (too large, expensive)

The system is **fully dynamic** - as dealers add more trucks, they automatically become available for optimization! 🚀
