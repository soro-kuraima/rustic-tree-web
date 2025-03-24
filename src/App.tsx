import { SignInButton, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
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

function App() {
  const { isAuthenticated } = useConvexAuth();
  
  // Sync Clerk user with our auth store
  useClerkUserSync();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Home Route - Landing for unauthenticated, redirect to bookings for authenticated */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/bookings" /> : <LandingPage />
        } />
        
        {/* Public Routes with conditional redirect for authenticated users */}
        <Route path="/rooms" element={
          isAuthenticated ? <RoomPage /> : <RoomPage />
        } />
        
        <Route path="/rooms/:id" element={
          isAuthenticated ? <RoomDetailPage /> : <RoomDetailPage />
        } />
        
        {/* Protected Routes */}
        <Route path="/booking/:roomId" element={
          <Authenticated fallback={<Navigate to="/" />}>
            <BookingPage />
          </Authenticated>
        } />
        
        <Route path="/bookings" element={
          <Authenticated fallback={<Navigate to="/" />}>
            <UserBookingsPage />
          </Authenticated>
        } />
        
        <Route path="/bookings/:id" element={
          <Authenticated fallback={<Navigate to="/" />}>
            <BookingDetailPage />
          </Authenticated>
        } />
        
        <Route path="/profile" element={
          <Authenticated fallback={<Navigate to="/" />}>
            <ProfilePage />
          </Authenticated>
        } />
        
        {/* Fallback route - default to home or bookings based on authentication */}
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/bookings" /> : <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
}

export default App;