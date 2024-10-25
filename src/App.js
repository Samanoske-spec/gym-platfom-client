import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TrainerDashboard from './pages/TrainerDashboard';
import UserEnrollments from './pages/UserEnrollments';
import CreateSite from './components/SiteBuilder/CreateSite';
import PreviewSite from './components/SiteBuilder/PreviewSite';
import Navbar from './components/Navbar/Navbar'; // Import the Navbar
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserProfile from './pages/userProfile';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import BookingCalendar from './pages/BookingCalendar';
import AdminBookingCalendar from './components/Dashboard/AdminBookingCalendar';
import SpaceManager from './components/Dashboard/SpaceManager';
function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar included above the Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trainer" element={<ProtectedRoute><TrainerDashboard /></ProtectedRoute>} />
        <Route path='/manage' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path='/booking-calendar' element={<ProtectedRoute><BookingCalendar /></ProtectedRoute>} />
        <Route path="/enrollments" element={<ProtectedRoute><UserEnrollments /></ProtectedRoute>} />
        <Route path="/create-site" element={<ProtectedRoute><CreateSite /></ProtectedRoute>} />
        <Route path="/preview-site" element={<ProtectedRoute><PreviewSite /></ProtectedRoute>} />
        <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/admin-booking-calendar" element={<ProtectedRoute><AdminBookingCalendar /></ProtectedRoute>} />
        <Route path="/manage-space" element={<ProtectedRoute><SpaceManager /></ProtectedRoute>} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
