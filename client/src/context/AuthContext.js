import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for auth token and fetch user data on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You can decode the token here if it includes user information (roles, username, etc.)
      const decoded = jwtDecode(token);  // Assuming you're using jwt-decode or similar package
      setUser(decoded);  // Set the user directly from the token
      setAuthLoading(false);  // Stop loading
    } else {
      setAuthLoading(false);  // Stop loading if no token
    }
  }, []);
  
  const login = async (username, password) => {
    try {
      const { data } = await axios.post('http://localhost:3001/api/auth/login', { username, password });
      localStorage.setItem('authToken', data.accessToken);
      setUser(data.user);  // Store user data in state
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error;  // Optionally re-throw the error to handle it higher up
    }
  };
  

  const logout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];  // Remove the Authorization header
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
