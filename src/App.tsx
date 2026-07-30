
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext"; // Added
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TruckRegistration from "./pages/TruckRegistration";
import TruckList from "./pages/TruckList";
import TruckEdit from "./pages/TruckEdit";
import ShipmentUpload from "./pages/ShipmentUpload";
import ShipmentList from "./pages/ShipmentList";
import ShipmentDetail from "./pages/ShipmentDetail";
import ShipmentEdit from "./pages/ShipmentEdit";
import TruckRecommendations from "./pages/TruckRecommendations";
import BookingRequests from "./pages/BookingRequests";
import MyBookings from "./pages/MyBookings";
import BookingHistory from "./pages/BookingHistory";
import MaintenanceSchedule from "./pages/MaintenanceSchedule";
import Calculator from "./pages/Calculator";
import TrackShipment from "./pages/TrackShipment";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Optimization from "./pages/Optimization";
import SystemLogs from "./pages/SystemLogs";
import Pricing from "./pages/Pricing";
import Integrations from "./pages/Integrations";
import ApiDocs from "./pages/ApiDocs";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Inject Google Translate Script
    if (!document.getElementById('google-translate-script')) {
      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = () => {
        // @ts-ignore
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          autoDisplay: false,
        }, 'google_translate_element');
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/api-docs" element={<ApiDocs />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/security" element={<Security />} />
                <Route
                  path="/optimization"
                  element={
                    <ProtectedRoute allowedRoles={['warehouse']}>
                      <Optimization />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
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
                  path="/trucks"
                  element={
                    <ProtectedRoute allowedRoles={['warehouse', 'dealer']}>
                      <TruckList />
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
                  path="/shipments/upload"
                  element={
                    <ProtectedRoute allowedRoles={['warehouse']}>
                      <ShipmentUpload />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shipments"
                  element={
                    <ProtectedRoute>
                      <ShipmentList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shipments/:id"
                  element={
                    <ProtectedRoute>
                      <ShipmentDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shipments/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={['warehouse']}>
                      <ShipmentEdit />
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
                  path="/bookings"
                  element={
                    <ProtectedRoute allowedRoles={['dealer']}>
                      <BookingRequests />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute allowedRoles={['warehouse']}>
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking-history"
                  element={
                    <ProtectedRoute allowedRoles={['warehouse']}>
                      <BookingHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/maintenance"
                  element={
                    <ProtectedRoute allowedRoles={['dealer']}>
                      <MaintenanceSchedule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tracking/:id"
                  element={
                    <ProtectedRoute>
                      <TrackShipment />
                    </ProtectedRoute>
                  }
                />


                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/logs"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SystemLogs />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <div id="google_translate_element" className="hidden"></div>
              <style>{`
                .goog-te-banner-frame { display: none !important; }
                body { top: 0px !important; }
                .goog-tooltip { display: none !important; }
                .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
            `}</style>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
