import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  
  // Consider both 'staff' and 'admin' as admin users
  const isAdmin = userType === 'staff' || userType === 'admin';

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
