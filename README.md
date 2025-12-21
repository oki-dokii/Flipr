# Smart Truck Loading Optimization System

AI-powered platform to optimize truck loads, reduce costs, and minimize carbon emissions. Connect warehouses with the right trucks for every shipment.

## 🎯 Project Overview

This system helps warehouses and truck dealers optimize logistics by:
- Matching shipments with the most suitable trucks
- Maximizing truck capacity utilization
- Reducing transportation costs
- Minimizing carbon footprint
- Streamlining booking and management workflows

---

## ✅ Implemented Features

### 🏢 Warehouse Features
- [x] **User Registration & Authentication** - Secure signup/login with JWT
- [x] **Shipment Management (CRUD)** - Create, view, edit, and delete shipments
- [x] **Auto State Selection** - City-to-state mapping for 100+ Indian cities
- [x] **Truck Recommendations** - AI-powered truck matching with scoring
- [x] **Booking Requests** - Request trucks for shipments
- [x] **Booking Management** - View and track booking status
- [x] **Real Dashboard Metrics** - Live optimization %, pending bookings, avg utilization
- [x] **Shipment Details** - Detailed view with status tracking

### 🚚 Dealer Features
- [x] **Truck Registration (CRUD)** - Add, edit, delete trucks with images
- [x] **Truck Analytics** - Track trips, distance, CO₂ savings per truck
- [x] **Booking Requests Management** - Approve/reject booking requests
- [x] **Booking History** - View past bookings
- [x] **Truck Status Management** - Available, Booked, Maintenance states
- [x] **Maintenance Scheduling** - Schedule and track truck maintenance
- [x] **Real Dashboard Metrics** - Live booking stats and truck utilization

### 🧮 Calculator Feature
- [x] **Box-Based Volume Calculator** - Calculate volume from multiple box types
- [x] **Truck Recommendations** - Get instant truck suggestions without signup
- [x] **Utilization & Cost Display** - See capacity usage and estimated costs
- [x] **CO₂ Savings Calculation** - Environmental impact estimation
- [x] **Usage Logging** - Track calculator usage for analytics

### 🤖 AI Optimization
- [x] **Multi-Factor Scoring** - Capacity, route, cost, and CO₂ optimization
- [x] **Google Maps Integration** - Real distance calculation
- [x] **Utilization Optimization** - Target 70-95% capacity usage
- [x] **Cost Estimation** - Accurate pricing based on distance and truck rates
- [x] **CO₂ Impact Calculation** - Environmental savings tracking

### 🎨 UI/UX
- [x] **Modern Dark Theme** - Glassmorphism design with gradients
- [x] **Responsive Design** - Works on desktop, tablet, and mobile
- [x] **Toast Notifications** - Real-time feedback with Sonner
- [x] **Loading States** - Smooth loading indicators
- [x] **Form Validation** - Client and server-side validation
- [x] **Auto-Complete** - City-to-state auto-selection

---

## 📊 Feature Completion Status

| Category | Completion | Status |
|----------|-----------|--------|
| **Warehouse Management** | 100% | ✅ Complete |
| **Dealer Management** | 100% | ✅ Complete |
| **Shipment CRUD** | 100% | ✅ Complete |
| **Truck CRUD** | 100% | ✅ Complete |
| **Booking System** | 100% | ✅ Complete |
| **Maintenance** | 100% | ✅ Complete |
| **Analytics** | 100% | ✅ Complete |
| **Calculator** | 100% | ✅ Complete |
| **AI Optimization** | 100% | ✅ Complete |
| **Dashboard Metrics** | 100% | ✅ Complete |

**Overall Completion: 100%** 🎉

---

## 🚧 Optional Enhancements (Future Scope)

### Advanced Features
- [ ] **Real-Time Tracking** - GPS tracking for trucks in transit
- [ ] **Route Visualization** - Map view of truck routes
- [ ] **Multi-Language Support** - Internationalization
- [ ] **Mobile App** - Native iOS/Android apps
- [ ] **Push Notifications** - Real-time alerts for bookings

### Analytics & Reporting
- [ ] **Advanced Analytics Dashboard** - Charts and graphs
- [ ] **Export Functionality** - CSV/Excel/PDF reports
- [ ] **Historical Trends** - Performance over time
- [ ] **Cost Savings Calculator** - ROI tracking
- [ ] **Predictive Analytics** - ML-based demand forecasting

### Business Features
- [ ] **Multi-Warehouse Support** - Manage multiple locations
- [ ] **Fleet Management** - Advanced truck fleet tools
- [ ] **Driver Management** - Assign drivers to trucks
- [ ] **Invoice Generation** - Automated billing
- [ ] **Payment Integration** - Online payment processing

### Technical Improvements
- [ ] **API Rate Limiting** - Prevent abuse
- [ ] **Caching Layer** - Redis for performance
- [ ] **Database Optimization** - Indexing and query optimization
- [ ] **Automated Testing** - Unit and integration tests
- [ ] **CI/CD Pipeline** - Automated deployment
- [ ] **Docker Containerization** - Easy deployment
- [ ] **Load Balancing** - Horizontal scaling

---

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Node.js** with Express
- **SQLite** (sql.js) - Database
- **JWT** - Authentication
- **Google Maps API** - Distance calculation
- **Multer** - File uploads

### Services
- **Optimizer Service** - AI-powered truck matching
- **Maps Service** - Google Maps integration
- **Volume Calculator** - Box-based calculations
- **Email Service** - Notifications (configured)

---

## 📁 Project Structure

```
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Auth & validation
│   └── database.js      # Database setup
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── lib/             # Utilities
│   └── hooks/           # Custom hooks
└── public/              # Static assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/oki-dokii/Flipr.git
cd Flipr
git checkout advanced-with-navigation
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Configure environment variables**
```bash
cd backend
cp .env.example .env
# Edit .env with your Google Maps API key
```

5. **Start the backend server**
```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

6. **Start the frontend dev server**
```bash
npm run dev
# Frontend runs on http://localhost:8080
```

7. **Access the application**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001
- Calculator: http://localhost:8080/calculator

---

## 📖 User Guide

### For Warehouses
1. Register as a warehouse user
2. Create shipments with details (weight, volume, destination)
3. Get AI-powered truck recommendations
4. Request bookings for suitable trucks
5. Track shipment status and booking history
6. View real-time dashboard metrics

### For Dealers
1. Register as a dealer user
2. Add trucks to your fleet with specifications
3. Receive and manage booking requests
4. Approve/reject bookings
5. Schedule maintenance for trucks
6. Track truck analytics (trips, distance, CO₂)
7. Monitor fleet performance

### Quick Calculator (No Signup Required)
1. Visit http://localhost:8080/calculator
2. Enter box dimensions (L×W×H) and count
3. Enter destination city and state
4. Get instant truck recommendations
5. See utilization, cost, and CO₂ estimates

---

## 🔑 Key Features Explained

### AI Optimization Algorithm
The system uses a multi-factor scoring algorithm:
- **Capacity Score (40%)** - Optimal utilization 70-95%
- **Route Score (30%)** - Service region matching
- **Cost Score (20%)** - Competitive pricing
- **CO₂ Score (10%)** - Environmental impact

### Truck Analytics
Automatically tracks for each truck:
- **Total Trips** - Number of completed deliveries
- **Total Distance** - Cumulative kilometers traveled
- **CO₂ Saved** - Environmental impact (kg)
- **Last Trip Date** - Most recent delivery

Formula: `CO₂ Saved = utilization% × distance × 0.5 kg/km`

### Real Dashboard Metrics
- **Optimization Rate** - % of shipments optimally assigned
- **Pending Bookings** - Active booking requests
- **Average Utilization** - Fleet capacity usage

---

## 🧪 Testing

### Test Accounts
Create test accounts for both roles:
- **Warehouse:** Register with role "warehouse"
- **Dealer:** Register with role "dealer"

### Sample Data
1. Add trucks as a dealer
2. Create shipments as a warehouse
3. Test the optimization flow
4. Try the calculator without login

---

## 🐛 Known Issues

None currently! All features tested and working. 🎉

---

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Shipments (Warehouse)
- `GET /api/shipments` - List shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `PUT /api/shipments/:id/deliver` - Mark as delivered

### Trucks (Dealer)
- `GET /api/trucks` - List trucks
- `POST /api/trucks` - Add truck
- `GET /api/trucks/:id` - Get truck details
- `PUT /api/trucks/:id` - Update truck
- `DELETE /api/trucks/:id` - Delete truck

### Optimization
- `POST /api/optimize/:shipmentId` - Get truck recommendations

### Bookings
- `POST /api/bookings/request` - Request booking
- `GET /api/bookings/warehouse` - Warehouse bookings
- `GET /api/bookings/dealer` - Dealer bookings
- `PUT /api/bookings/:id` - Update booking status

### Calculator
- `POST /api/calculator/estimate` - Calculate and get recommendations
- `GET /api/calculator/history` - Get calculator history

### Stats
- `GET /api/stats/warehouse` - Warehouse dashboard metrics
- `GET /api/stats/dealer` - Dealer dashboard metrics

---

## 🤝 Contributing

This is a hackathon project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 👥 Team

Built with ❤️ for the Flipr Hackathon

---

## 🔗 Links

- **Repository:** https://github.com/oki-dokii/Flipr
- **Branch:** advanced-with-navigation
- **Demo:** (Add deployment link here)

---

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Last Updated:** December 20, 2024  
**Version:** 2.0.0  
**Status:** Production Ready ✅
