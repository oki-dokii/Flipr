# Flipr - Smart Truck Loading Optimization

## Overview

Flipr is an AI-powered logistics platform that optimizes truck loading, reduces transportation costs, and minimizes carbon emissions. The application connects warehouses with truck dealers, enabling smart shipment-to-truck matching using multi-criteria optimization algorithms.

Key capabilities:
- Warehouse shipment management and tracking
- Dealer truck fleet registration and maintenance scheduling
- AI-powered truck recommendations based on capacity, route, cost, and CO2 metrics
- Real-time shipment tracking with GPS simulation
- Booking workflow between warehouses and dealers
- Volume calculator for cargo estimation
- Admin dashboard with system analytics

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui built on Radix UI primitives
- **State Management**: TanStack React Query for server state
- **Routing**: React Router DOM
- **3D Visualization**: React Three Fiber with Drei for truck loading visualization
- **Maps Integration**: @react-google-maps/api for location features

### Backend Architecture
- **Dual Server Setup**: Express frontend server (port 8080) proxies API requests to backend server (port 3002)
- **Backend Framework**: Express.js with ES modules
- **Database**: SQLite via sql.js (in-memory with file persistence)
- **Authentication**: JWT tokens with bcryptjs password hashing
- **File Uploads**: Multer for truck image uploads
- **Email**: Nodemailer with Ethereal for development

### Database Design
SQLite database with tables for:
- `users` - Warehouses, dealers, and admins with role-based access
- `trucks` - Fleet inventory with capacity, dimensions, service regions
- `shipments` - Cargo details with origin/destination coordinates
- `booking_requests` - Workflow between warehouses and dealers
- `maintenance_schedule` - Truck maintenance tracking
- `calculator_logs` - Volume estimation history

### API Structure
RESTful endpoints under `/api/`:
- `/auth` - Registration, login, profile
- `/trucks` - CRUD operations for fleet management
- `/shipments` - Shipment lifecycle management
- `/bookings` - Booking request workflow
- `/optimize` - AI truck recommendations
- `/maintenance` - Maintenance scheduling
- `/maps` - Google Maps distance/route calculations
- `/stats` - Dashboard analytics
- `/admin` - System administration

### Optimization Engine
Multi-criteria scoring for truck-shipment matching:
- Capacity utilization (35% weight)
- Route efficiency (25% weight)
- Cost optimization (25% weight)
- CO2 emissions (15% weight)

Includes overload protection with 95% safety margin and shipment consolidation for efficiency.

## External Dependencies

### Third-Party Services
- **Google Maps Platform**: Distance Matrix API, Directions API, and Geocoding for route calculations and location services
- **Ethereal Email**: Development SMTP service for testing email notifications

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection (for Drizzle schema, though SQLite is currently used in backend)
- `JWT_SECRET` - Token signing secret
- `GOOGLE_MAPS_API_KEY` - Google Maps API access
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` - SMTP configuration

### Key NPM Dependencies
- Frontend: React, Vite, Tailwind, shadcn/ui, TanStack Query, React Router, Three.js
- Backend: Express, sql.js, jsonwebtoken, bcryptjs, nodemailer, @googlemaps/google-maps-services-js