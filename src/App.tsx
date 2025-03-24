import { useClerkUserSync } from "./hooks/useClerkUserSync";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import UserBookingsPage from "./pages/UserBookingsPage";
import ProfilePage from "./pages/ProfilePage";
import BookingPage from "./pages/BookingPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import { Toaster } from "./components/ui/sonner";
import { RequireAuth } from "./components/home/RequireAuth";

function App() {
  // Sync Clerk user with our auth store
  useClerkUserSync();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Home Route - Landing for unauthenticated, redirect to bookings for authenticated */}
        <Route path="/" element={
          <LandingPage />
        } />
        
        {/* Public Routes with conditional redirect for authenticated users */}
        <Route path="/rooms" element={
          <RoomPage />
        } />
        
        <Route path="/rooms/:id" element={
          <RoomDetailPage />
        } />
        
        {/* Protected Routes */}
        <Route path="/booking/:roomId" element={
          <RequireAuth>
            <BookingPage />
          </RequireAuth>
        } />
        
        <Route path="/bookings" element={
          <RequireAuth>
            <UserBookingsPage />
          </RequireAuth>
        } />
        
        <Route path="/bookings/:id" element={
          <RequireAuth>
            <BookingDetailPage />
          </RequireAuth>
        } />
        
        <Route path="/profile" element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        } />
        
        {/* Fallback route - default to home or bookings based on authentication */}
        <Route path="*" element={
          <Navigate to={'/'} />
        } />
      </Routes>
    </Router>
  );
}

export default App;