// App.js
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  // Ensure the path is correct
import { SidebarProvider, useSidebar } from './context/sidebarContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './styles/App.css';
import Login from './routes/Login';  // Ensure the path is correct
import Home from './routes/Home';  // Ensure the path is correct
import Users from './routes/Users';  // Ensure the path is correct
import Dashboard from './routes/Dashboard';  // Ensure the path is correct
import Departments from './routes/Departments';

const AppContent = () => {
  // const { user, authLoading } = useAuth();
  const { isSidebarOpen } = useSidebar();

  // if (authLoading) {
  //   return <div>Loading...</div>;  // Loading spinner or text
  // }

  return (
    <div className={`app-container content ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar />
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/" element={<Home />} />

      </Routes>
    </div>
  );
};


export default AppContent;
