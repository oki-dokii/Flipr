import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TruckRegistration from "./pages/TruckRegistration";
import TruckList from "./pages/TruckList";
import TruckEdit from "./pages/TruckEdit";
import ShipmentUpload from "./pages/ShipmentUpload";
import ShipmentList from "./pages/ShipmentList";
import TruckRecommendations from "./pages/TruckRecommendations";
import BookingRequests from "./pages/BookingRequests";
import MyBookings from "./pages/MyBookings";
import BookingHistory from "./pages/BookingHistory";
import MaintenanceSchedule from "./pages/MaintenanceSchedule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trucks"
              element={
                <ProtectedRoute allowedRoles={['dealer']}>
                  <TruckList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trucks/register"
              element={
                <ProtectedRoute allowedRoles={['dealer']}>
                  <TruckRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trucks/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['dealer']}>
                  <TruckEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments"
              element={
                <ProtectedRoute allowedRoles={['warehouse']}>
                  <ShipmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/upload"
              element={
                <ProtectedRoute allowedRoles={['warehouse']}>
                  <ShipmentUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations/:shipmentId"
              element={
                <ProtectedRoute allowedRoles={['warehouse']}>
                  <TruckRecommendations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/requests"
              element={
                <ProtectedRoute allowedRoles={['dealer']}>
                  <BookingRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/my-bookings"
              element={
                <ProtectedRoute allowedRoles={['warehouse']}>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/history"
              element={
                <ProtectedRoute>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <MaintenanceSchedule />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
