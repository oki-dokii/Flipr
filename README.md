# LoadOptimize
## Smart Truck Loading Optimization System

**Submitted for Flipr Hackathon 30.1 (Fullstack Web Development)**

### Introduction
The Smart Truck Loading Optimization System (LoadOptimize) is an intelligent logistics platform designed to eliminate inefficient shipping practices caused by partially filled trucks and poor coordination between warehouses and truck dealers. The system allows warehouses to upload shipment details and automatically matches them with the most suitable trucks using smart optimization algorithms. Truck dealers can register their available fleet and accept shipment requests, ensuring better truck utilization, reduced empty runs, and lower carbon emissions.

The platform improves logistics efficiency through real-time tracking, capacity planning, automated matching, and data-driven decision-making.

---

### Core Architecture and Technology Stack
We engineered LoadOptimize using a modern, type-safe stack to ensure scalability, reliability, and sub-second response times for complex calculations.

#### Backend Infrastructure
*   **Runtime Environment**: Node.js with Express.js framework.
*   **Database**: SQLite (via independent sql.js for portability) and extensible to PostgreSQL.
*   **Authentication**: Stateless JWT implementation with role-based access control (RBAC).
*   **Algorithm**: Custom heuristic algorithms for multi-parameter truck matching.

#### Frontend Interface
*   **Framework**: React 18 built with Vite for optimized production bundles.
*   **Language**: TypeScript for strict type safety and reduced runtime errors.
*   **State Management**: TanStack Query (React Query) for server-state synchronization.
*   **Maps Service**: Google Maps JavaScript API for dynamic route visualization.
*   **Visualization**: Recharts for analytics and plotting trends.

---

### System Workflows

#### 1. User Onboarding
The system enforces a strict separation of concerns through role-based onboarding.
*   **Warehouse User**: Registers with facility details and shipment capabilities.
*   **Truck Dealer**: Registers with fleet details, service routes, and base operational capacity.
*   **Security**: All endpoints are secured using JWT-based checking, ensuring data isolation between tenants.

#### 2. Warehouse Workflow
The warehouse interface focuses on efficiency and automated decision support.
*   **Upload Shipment Details**: Users input granular data including weight, volume (L x W x H), number of boxes, destination coordinates, and delivery deadlines.
*   **Run Optimization**: Upon submission, the backend triggers the Optimization Engine.
*   **View Best Truck Options**: The system presents a sorted list of trucks derived from the multi-parameter scoring algorithm.
*   **Book a Truck**: A direct request is dispatched to the chosen Truck Dealer.
*   **Track Shipment**: Once accepted, the warehouse can monitor status changes (Assigned, Picked, In Transit, Delivered) in real time.
*   **Impact Analysis**: Post-trip calculation of CO2 saved and cost efficiency compared to baseline estimates.

#### 3. Truck Dealer Workflow
Dealers are provided with tools to maximize fleet uptime and revenue.
*   **Add Trucks**: Registration of multiple vehicles with specific attributes (capacity, type, service routes).
*   **Receive Booking Requests**: Instant notifications when a warehouse selects their vehicle via the optimization process.
*   **Approve and Assign**: One-click confirmation to lock in the shipment and assign the specific vehicle.
*   **Manage Efficiency**: Access to performance metrics illustrating fleet utilization and environmental impact.

---

### The Optimization Engine (Core Logic)
At the heart of LoadOptimize lies a sophisticated evaluation engine that processes each shipment request against the pool of available trucks. This is not a simple filter but a multi-parameter weighted scoring system.

**1. Volume and Weight Calculation**
The system first calculates the total volumetric weight of the shipment to establish a baseline requirement.

**2. Hard Filtering**
Trucks that do not meet the minimum physical capacity or weight limits are immediately discarded to ensure compliance.

**3. Weighted Scoring Algorithm**
Qualified trucks are ranked based on a composite score derived from four key metrics:
*   **Utilization Percentage**: Calculated as (Shipment Volume / Truck Volume) * 100. Higher utilization yields a higher score.
*   **Distance Efficiency**: Analysis of the dealer's existing route coverage versus the shipment destination to minimize deviation.
*   **Cost Efficiency**: Comparison of the estimated transportation cost against industry baselines.
*   **CO2 Impact**: A quantified score representing the emissions saved by choosing an optimized load over a partial truckload.

**4. Result Generation**
The engine returns the top 3 to 10 matches, sorted by the highest overall score, presenting the user with the most logical and sustainable options first.

---

### Additional Features

**Truck Fit Calculator**
A standalone utility allowing users to estimate the optimal truck type for a theoretical load before committing to a booking.

**CO2 Savings Report**
An auto-generated report created after every completed trip, providing auditable proof of the environmental benefits achieved through the platform.

**Analytics Dashboard**
A comprehensive visual interface displaying long-term utilization trends, helping managers identify periods of inefficiency.

**Admin Controls**
A super-user interface for system oversight, user management, and global configuration of optimization parameters.

---

### Installation and Setup Guide

**Prerequisites**
*   Node.js (v18+)
*   npm (v9+)

**Step 1: Clone Repository**
```bash
git clone https://github.com/your-repo/load-optimize.git
cd load-optimize
```

**Step 2: Install Dependencies**
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

**Step 3: Execution**
We recommend running the services in separate terminals for easier log monitoring.

**Terminal 1 (Backend)**
```bash
cd backend
npm start
# Server initializes on http://localhost:3001
```

**Terminal 2 (Frontend)**
```bash
npm run dev
# Application accessible at http://localhost:8080
```

---

### API Specifications
The backend exposes a RESTful API structure designed for resource-oriented interaction.

*   `POST /api/auth/login`: Authenticate users and issue JWTs.
*   `POST /api/optimize`: Trigger the scoring algorithm for a shipment payload.
*   `GET /api/trucks`: Retrieve fleet data with optional filtering parameters.
*   `POST /api/bookings`: Initiate a new transaction between Warehouse and Dealer.
*   `GET /api/stats`: Fetch aggregated metrics for the analytics dashboard.

---

**Developed for Flipr Hackathon 30.1**
*Platform: Fullstack Web Development*
