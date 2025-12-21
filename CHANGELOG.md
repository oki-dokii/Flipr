# Project Changelog
**Date:** December 21, 2025
**Summary:** Full implementation of Analytics, Reporting, and Admin features.

## 🚀 New Features

### 1. Visual Analytics Dashboard
-   **Warehouse Analytics**:
    -   **Shipments Over Time**: Bar chart showing shipment creation history (Last 7 Days).
    -   **Shipment Status**: Pie chart showing distribution of shipment statuses (Pending, In Transit, Delivered).
-   **Dealer Analytics**:
    -   **Booking Trends**: Line chart showing booking requests over time.
    -   **Truck Availability**: Pie chart showing truck status (Available, Busy, Maintenance).
-   **Enhancements**:
    -   Integrated `recharts` for responsive, interactive visualizations.
    -   Added empty state handling (custom icons and messages when no data exists).
    -   Implemented tooltips with specific data labels.

### 2. Admin Console & Reporting
-   **Admin Dashboard**:
    -   New `/admin` route protected by Role-Based Access Control (RBAC).
    -   **System Overview**: Global stats for Total Users, Shipments, and Trucks.
    -   **Detailed Views**: Clickable cards open detailed data tables for Users, Shipments, and Trucks.
    -   **User Distribution**: Bar chart comparing Warehouse vs. Dealer user counts.
    -   **Recent Activity**: Combined timeline of latest shipments and bookings.
-   **Data Export**:
    -   **CSV Export**: Added "Export Data" button for Warehouses and Dealers to download their request/shipment history as CSV files.

### 3. Backend & Security
-   **Role Management**:
    -   Added `admin` role to `users` table via migration.
    -   Updated registration API to support admin creation (internal use).
-   **Logging**:
    -   Implemented file-based `error.log` system for backend error tracking.
-   **API Endpoints**:
    -   `GET /api/stats/warehouse` & `/dealer`: Enhanced with historical data for charts.
    -   `GET /api/reports/shipments/csv`: CSV generation for warehouse.
    -   `GET /api/reports/bookings/csv`: CSV generation for dealer.
    -   `GET /api/admin/stats`: Aggregated system metrics.
    -   `GET /api/admin/users`, `/shipments`, `/trucks`: Detailed lists for admin views.

## 🐛 Bug Fixes & Refinements

-   **Admin Redirect**: Fixed issue where Admin login incorrectly redirected to Dealer view. Now automatically redirects to `/admin`.
-   **Dashboard Crashes**: 
    -   Fixed `ReferenceError: stats is not defined` in Admin Dashboard.
    -   Fixed `SyntaxError: JSON.parse` crash when rendering Shipment items.
    -   Fixed "Total Trucks" crash by safely handling null values in `type` and `status` fields.
-   **UI Polish**:
    -   Removed "weird dotted lines" from chart tooltips.
    -   Fixed typo in "Logout" button.
    -   Added clear axis labels to all charts.

## 🛠 Technical Details
-   **Frontend**: React, Recharts, TailwindCSS, Lucide Icons.
-   **Backend**: Node.js, Express, SQLite (better-sqlite3/sql.js).
-   **Auth**: JWT-based authentication with role monitoring.
