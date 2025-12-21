# Where to See Optimization Scores

## Quick Answer

The optimization scores are displayed on the **Truck Recommendations Page** at:
```
http://localhost:8080/truck-recommendations/:shipmentId
```

---

## How to Access the Scores

### Step-by-Step:

1. **Login** to the application at `http://localhost:8080`
2. **Navigate to Dashboard** or **Shipments** page
3. **Create a shipment** or select an existing one
4. **Click the "Optimize" button** next to the shipment
5. **View the recommendations** with detailed scores

---

## What You'll See

### Visual Example

![Score Display Mockup](/Users/sohambanerjee/.gemini/antigravity/brain/7b4d4512-5df4-4f07-86e8-7b9d8a42a94f/score_display_mockup_1766064659516.png)

---

## Score Display Breakdown

For each recommended truck, you'll see:

### 1. **Overall Score** (Top Right)
- Large number (e.g., **90.4**)
- Color-coded:
  - 🟢 **Green** (80-100): Excellent match
  - 🟡 **Yellow** (60-79): Good match
  - 🔴 **Red** (0-59): Poor match

**Location in code**: Lines 162-166 in [`TruckRecommendations.tsx`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/src/pages/TruckRecommendations.tsx#L162-L166)

---

### 2. **Score Breakdown** (4 Progress Bars)

Each score is displayed with:
- **Label** (Capacity, Route, Cost, CO₂)
- **Numeric value** (e.g., 89/100)
- **Progress bar** showing percentage visually

#### Capacity Score
- Shows how well the truck's capacity matches the shipment
- Optimal range: 70-95% utilization
- **Location**: Lines 171-184

#### Route Score
- Shows if the truck services the destination
- Binary: 100 (yes) or 0 (no)
- **Location**: Lines 186-199

#### Cost Score
- Shows cost efficiency compared to other trucks
- Lower cost = Higher score
- **Location**: Lines 201-214

#### CO₂ Score
- Shows environmental impact
- Better utilization = Lower emissions
- **Location**: Lines 216-229

---

### 3. **Additional Details** (Bottom Section)

Four detail cards showing:

| Icon | Metric | Description |
|------|--------|-------------|
| 📈 | **Utilization** | Percentage of truck capacity used (e.g., 63%) |
| 💰 | **Est. Cost** | Estimated total cost for the trip (e.g., ₹10,000) |
| 🌿 | **CO₂ Savings** | Environmental impact metric (e.g., 63kg) |
| 🚚 | **Distance** | Estimated distance (e.g., 500km) |

**Location**: Lines 233-262

---

## Code Reference

The scores are rendered in the `TruckRecommendations` component:

### Key Code Sections:

**Overall Score Display:**
```tsx
<div className={`text-3xl font-bold ${getScoreColor(rec.totalScore)}`}>
    {rec.totalScore}
</div>
<div className="text-xs text-muted-foreground">Overall Score</div>
```

**Individual Score with Progress Bar:**
```tsx
<div className="flex items-center justify-between mb-1">
    <span className="text-sm text-muted-foreground">Capacity</span>
    <span className={`text-sm font-medium ${getScoreColor(rec.scores.capacity)}`}>
        {rec.scores.capacity}
    </span>
</div>
<div className="h-2 bg-background/50 rounded-full overflow-hidden">
    <div
        className={`h-full ${getScoreBarColor(rec.scores.capacity)}`}
        style={{ width: `${rec.scores.capacity}%` }}
    />
</div>
```

---

## API Response Format

The scores come from the backend API endpoint:
```
POST /api/optimize/:shipmentId
```

**Response structure:**
```json
{
  "shipment": { ... },
  "recommendations": [
    {
      "truck": { ... },
      "totalScore": 90.4,
      "scores": {
        "capacity": 89,
        "route": 100,
        "cost": 100,
        "co2": 63
      },
      "details": {
        "utilization": "63%",
        "estimatedCost": "₹10,000",
        "co2Savings": "63kg",
        "distance": "500km"
      }
    }
  ]
}
```

---

## Testing the Display

### Option 1: Through the UI
1. Navigate to `http://localhost:8080`
2. Login as a Warehouse Manager
3. Create a shipment (e.g., 5000kg, 25m³ to Mumbai)
4. Click "Optimize"
5. View the scores on the recommendations page

### Option 2: Direct URL
If you know the shipment ID, navigate directly:
```
http://localhost:8080/truck-recommendations/1
```

### Option 3: API Testing
Test the API directly with curl:
```bash
curl -X POST http://localhost:3001/api/optimize/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Color Coding System

The UI uses color coding to make scores easy to understand at a glance:

| Score Range | Color | Meaning |
|-------------|-------|---------|
| 80-100 | 🟢 Green | Excellent - Highly recommended |
| 60-79 | 🟡 Yellow | Good - Acceptable option |
| 0-59 | 🔴 Red | Poor - Not recommended |

**Implementation:**
```tsx
const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green';
    if (score >= 60) return 'text-yellow';
    return 'text-red';
};
```

---

## Summary

**Where to see scores:**
- 📍 **Page**: Truck Recommendations (`/truck-recommendations/:shipmentId`)
- 📊 **What's shown**: Overall score + 4 breakdown scores (Capacity, Route, Cost, CO₂)
- 📈 **Format**: Numbers + color-coded progress bars
- 💡 **Details**: Utilization, cost, CO₂ savings, distance

**File locations:**
- Frontend: [`src/pages/TruckRecommendations.tsx`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/src/pages/TruckRecommendations.tsx)
- Backend: [`backend/services/optimizer.js`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/backend/services/optimizer.js)
- API Route: [`backend/routes/optimize.js`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/backend/routes/optimize.js)

The scores are automatically calculated by the optimization algorithm and displayed in an easy-to-understand visual format! 🚀
