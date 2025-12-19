# Smart Load Optimize

**AI-Powered Truck-Shipment Matching Platform**

A comprehensive logistics optimization platform that uses AI to match shipments with the most suitable trucks, reducing costs and improving efficiency for warehouses and truck dealers.

---

## 🚀 Features Overview

### Core Features (Phase 1)

#### For Warehouses
- **Shipment Management**
  - Upload shipments with weight, volume, dimensions
  - Set delivery deadlines and priority levels
  - Track shipment status (pending, assigned, in_transit, delivered)
  - View shipment history

- **AI-Powered Truck Recommendations**
  - Get optimized truck recommendations based on:
    - Weight and volume capacity
    - Dimensions compatibility
    - Cost efficiency
    - Delivery deadline feasibility
  - **Optimization Score (0-100)** showing match quality
  - Detailed breakdown of scoring factors
  - Request bookings for recommended trucks

- **Booking Management**
  - Request truck bookings
  - View booking status (requested, approved, rejected)
  - Track active bookings
  - View booking history

#### For Dealers
- **Truck Fleet Management**
  - Register trucks with specifications
  - Track truck availability (available, booked, maintenance)
  - Update truck details
  - Manage service regions
  - Upload truck images

- **Booking Request Management**
  - View incoming booking requests
  - Approve or reject bookings
  - **Bulk approve/reject multiple bookings** ⭐ NEW
  - Email notifications for all booking actions
  - Filter by status (pending, approved, rejected)

- **Maintenance Scheduling** ⭐ NEW
  - Schedule maintenance for trucks
  - Track maintenance types (Oil Change, Tire Replacement, Brake Service, etc.)
  - Set scheduled dates and estimated costs
  - Mark maintenance as completed
  - View maintenance history per truck
  - Filter by status (scheduled, completed)

#### Authentication & Authorization
- Role-based access control (Warehouse, Dealer)
- JWT token authentication
- Protected routes
- Secure password handling

---

## 🎯 Phase 2 Features (Recently Implemented)

### 1. Bulk Approve/Reject Operations
**For Dealers managing multiple booking requests**

- ✅ Checkbox selection for each booking
- ✅ "Select All" / "Deselect All" functionality
- ✅ Bulk action toolbar with selection counter
- ✅ "Approve Selected" and "Reject Selected" buttons
- ✅ Confirmation dialogs with booking counts
- ✅ Email notifications sent for each booking
- ✅ Toast notifications with success/failure results
- ✅ Auto-clears selection after operations

**API Endpoints:**
- `POST /api/bookings/bulk-approve`
- `POST /api/bookings/bulk-reject`

### 2. Maintenance Scheduling System
**Complete fleet maintenance management**

- ✅ Schedule maintenance for any truck
- ✅ Maintenance types: Oil Change, Tire Replacement, Brake Service, Engine Repair, General Inspection, Custom
- ✅ Track scheduled dates and completion dates
- ✅ Cost tracking and notes
- ✅ Mark maintenance as completed
- ✅ Edit scheduled maintenance
- ✅ Delete maintenance records
- ✅ Filter by status (all, scheduled, completed)
- ✅ View maintenance history per truck
- ✅ Upcoming maintenance view (next 30 days)

**API Endpoints:**
- `GET /api/maintenance` - Get all maintenance
- `GET /api/maintenance/upcoming` - Get upcoming (30 days)
- `GET /api/maintenance/truck/:truckId` - Truck history
- `POST /api/maintenance` - Create maintenance
- `PUT /api/maintenance/:id` - Update maintenance
- `PUT /api/maintenance/:id/complete` - Mark complete
- `DELETE /api/maintenance/:id` - Delete maintenance

### 3. Email Notifications
**Automated email notifications for booking actions**

- ✅ Professional HTML email templates
- ✅ Booking approved notifications
- ✅ Booking rejected notifications
- ✅ Includes booking details (shipment, truck, warehouse info)
- ✅ Development mode (logs to console)
- ✅ Production-ready (SMTP configuration)

### 4. Booking History/Archive
**Archive and manage completed bookings**

- ✅ Archive bookings
- ✅ View archived bookings separately
- ✅ Unarchive functionality
- ✅ Filter archived bookings
- ✅ Separate routes for active and archived bookings

---

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database
- **JWT** authentication
- **Nodemailer** for email notifications
- **Multer** for file uploads
- **Better-SQLite3** for database operations

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Lucide React** icons

### AI/Optimization
- Custom optimization algorithm
- Multi-factor scoring system
- Weight, volume, cost, and deadline analysis

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:8080`

### Environment Variables

Create `.env` file in backend directory:

```env
PORT=3001
JWT_SECRET=your-secret-key-here

# Email Configuration (Optional - for production)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 🎮 Usage Guide

### Demo Accounts

**Warehouse Account:**
- Email: `warehouse@example.com`
- Password: `warehouse123`

**Dealer Account:**
- Email: `test1@example.com`
- Password: `dealer123`

### Warehouse Workflow

1. **Upload Shipment**
   - Navigate to `/shipments/upload`
   - Enter shipment details (weight, volume, dimensions, destination, deadline)
   - Set priority (low, medium, high)
   - Submit

2. **Get Truck Recommendations**
   - Go to `/shipments`
   - Click "Get Recommendations" on a shipment
   - View optimization scores and truck details
   - Request booking for preferred truck

3. **Track Bookings**
   - View active bookings at `/bookings/my`
   - Check booking status (requested, approved, rejected)
   - View booking history at `/bookings/history`

### Dealer Workflow

1. **Register Trucks**
   - Navigate to `/trucks/register`
   - Enter truck specifications
   - Set service regions and pricing
   - Upload truck image (optional)

2. **Manage Booking Requests**
   - Go to `/bookings/requests`
   - View pending booking requests
   - **Single Actions:**
     - Click "Approve" or "Reject" on individual bookings
   - **Bulk Actions:** ⭐ NEW
     - Select multiple bookings using checkboxes
     - Click "Select All" to select all pending
     - Click "Approve Selected" or "Reject Selected"
     - Confirm in dialog
   - Email notifications sent automatically

3. **Schedule Maintenance** ⭐ NEW
   - Navigate to `/maintenance`
   - Click "Schedule Maintenance"
   - Select truck and maintenance type
   - Set scheduled date and cost
   - Add notes
   - Submit
   - **Mark Complete:** Click "Mark Complete" when done
   - **Edit:** Modify scheduled maintenance
   - **Delete:** Remove maintenance records

---

## 📊 Database Schema

### Core Tables
- `users` - User accounts (warehouse, dealer)
- `trucks` - Truck fleet information
- `shipments` - Shipment details
- `booking_requests` - Booking requests and status
- `maintenance_schedule` - Maintenance records ⭐ NEW

### Key Relationships
- Trucks belong to Dealers (users)
- Shipments belong to Warehouses (users)
- Booking Requests link Shipments, Trucks, Warehouses, and Dealers
- Maintenance records link to Trucks

---

## 🎨 UI/UX Features

- **Modern Glass-morphism Design**
- **Gradient Backgrounds**
- **Responsive Layout** (mobile, tablet, desktop)
- **Dark Theme** with teal/cyan accents
- **Smooth Animations** and transitions
- **Toast Notifications** for user feedback
- **Confirmation Dialogs** for destructive actions
- **Loading States** with spinners
- **Status Badges** with color coding
- **Icon-based Navigation**

---

## 🔐 Security Features

- JWT token authentication
- Role-based access control
- Protected API routes
- Ownership verification (dealers can only modify their trucks)
- Secure password handling
- CORS configuration
- Input validation

---

## 📈 Optimization Algorithm

The AI recommendation system scores trucks based on:

1. **Weight Capacity (25%)** - Can truck handle shipment weight?
2. **Volume Capacity (25%)** - Sufficient cargo space?
3. **Dimensions (20%)** - Will shipment fit?
4. **Cost Efficiency (20%)** - Best price for distance?
5. **Deadline Feasibility (10%)** - Can deliver on time?

**Score Interpretation:**
- 90-100: Excellent match
- 80-89: Very good match
- 70-79: Good match
- 60-69: Acceptable match
- Below 60: Poor match

---

## 🚧 Known Issues

1. **Truck Image Upload**
   - Backend implementation complete
   - Database update requires backend restart to reflect changes
   - Frontend displays images correctly after restart

2. **Archive Buttons**
   - Archive functionality complete
   - Archive buttons not yet added to BookingRequests/MyBookings pages
   - Can archive/unarchive via BookingHistory page

---

## 🔮 Future Enhancements

### Phase 2 (Remaining)
- [ ] Availability Calendar - Visual truck availability planning
- [ ] Truck Performance Analytics - Utilization, revenue, trips tracking

### Phase 3 (Planned)
- [ ] Real-time tracking integration
- [ ] Route optimization
- [ ] Multi-stop deliveries
- [ ] Driver management
- [ ] Invoice generation
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Export reports (PDF, Excel)

---

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Trucks
- `GET /api/trucks` - Get all trucks (filtered by role)
- `GET /api/trucks/:id` - Get single truck
- `POST /api/trucks` - Register new truck
- `PUT /api/trucks/:id` - Update truck
- `DELETE /api/trucks/:id` - Delete truck
- `POST /api/trucks/:id/upload-image` - Upload truck image

### Shipments
- `GET /api/shipments` - Get all shipments
- `GET /api/shipments/:id` - Get single shipment
- `POST /api/shipments` - Create shipment
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

### Optimization
- `POST /api/optimize/recommend` - Get truck recommendations

### Bookings
- `GET /api/bookings/warehouse` - Get warehouse bookings
- `GET /api/bookings/dealer` - Get dealer bookings
- `POST /api/bookings` - Create booking request
- `PUT /api/bookings/:id/approve` - Approve booking
- `PUT /api/bookings/:id/reject` - Reject booking
- `POST /api/bookings/bulk-approve` - Bulk approve ⭐ NEW
- `POST /api/bookings/bulk-reject` - Bulk reject ⭐ NEW
- `PUT /api/bookings/:id/archive` - Archive booking
- `PUT /api/bookings/:id/unarchive` - Unarchive booking
- `GET /api/bookings/warehouse/archived` - Get archived (warehouse)
- `GET /api/bookings/dealer/archived` - Get archived (dealer)

### Maintenance ⭐ NEW
- `GET /api/maintenance` - Get all maintenance
- `GET /api/maintenance/upcoming` - Get upcoming maintenance
- `GET /api/maintenance/truck/:truckId` - Get truck maintenance
- `GET /api/maintenance/:id` - Get single maintenance
- `POST /api/maintenance` - Create maintenance
- `PUT /api/maintenance/:id` - Update maintenance
- `PUT /api/maintenance/:id/complete` - Mark complete
- `DELETE /api/maintenance/:id` - Delete maintenance

---

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

## 📄 License

Proprietary - All rights reserved

---

## 👥 Team

Developed by the Smart Load Optimize team

---

## 📞 Support

For support, email support@smartloadoptimize.com

---

## 🎉 Recent Updates

### v2.0.0 - Phase 2 Features (December 2025)
- ✅ Bulk approve/reject operations
- ✅ Maintenance scheduling system
- ✅ Email notifications
- ✅ Booking history/archive
- ✅ Truck image upload
- ✅ UI/UX improvements

### v1.0.0 - Initial Release
- ✅ Core shipment management
- ✅ Truck fleet management
- ✅ AI-powered recommendations
- ✅ Booking system
- ✅ Authentication & authorization

---

**Built with ❤️ using React, Node.js, and AI**
