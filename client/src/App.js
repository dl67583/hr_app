// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  // Ensure the path is correct
import Login from './routes/Login';  // Ensure the path is correct
import Dashboard from './routes/Dashboard';  // Ensure the path is correct

const AppContent = () => {
  const { user, authLoading } = useAuth();

  // If authentication is still loading, show a loading state
  if (authLoading) {
    return <div>Loading...</div>;  // Loading spinner or text
  }

  // Conditional rendering based on user state
  return (
    <Routes>
      {user ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />  {/* Fallback to dashboard if authenticated */}
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />  {/* Fallback to login if not authenticated */}
        </>
      )}
    </Routes>
  );
};

export default AppContent;
