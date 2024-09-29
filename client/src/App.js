// App.js
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  // Ensure the path is correct
import { SidebarProvider, useSidebar } from './context/sidebarContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './styles/App.css';
import Login from './routes/Login';  // Ensure the path is correct
import Users from './routes/Users';  // Ensure the path is correct
import Dashboard from './routes/Dashboard';  // Ensure the path is correct

const AppContent = () => {
  const { user, authLoading } = useAuth();
  const { isSidebarOpen } = useSidebar();

  // If authentication is still loading, show a loading state
  if (authLoading) {
    return <div>Loading...</div>;  // Loading spinner or text
  }

  // Conditional rendering based on user state
  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {user ? (
        <>
          <Navbar />
          <Sidebar />
        </>
      ) : (<></>)}
      <Routes>
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />

            {/* <Route path="*" element={<Dashboard />} />   Fallback to dashboard if authenticated */}
          </>
        ) : (
          <>
            <Route path="/" element={<Login />} />

            {/* <Route path="*" element={<Login />} />  //Fallback to login if not authenticated */}
          </>
        )}
      </Routes>
    </div>
  );
};


export default AppContent;
