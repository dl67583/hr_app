import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);  // To handle loading state

  useEffect(() => {
   const token = localStorage.getItem('authToken');  // Check for token in localStorage
   if (token) {
     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Set token in axios headers
     axios.get('http://localhost:3001/api/users')  // API endpoint to validate token and get user profile
       .then(response => {
         setUser(response.data);  // Set user state with the profile data
         console.log("User authenticated:", response.data);  // Check if user is being authenticated
       })
       .catch(error => {
         console.error("Authentication failed:", error);
       })
       .finally(() => {
         setAuthLoading(false);  // End loading state
       });
   } else {
     setAuthLoading(false);  // No token found, end loading state
   }
 }, []);
 const login = async (username, password) => {
   try {
     const response = await axios.post('http://localhost:3001/api/auth/login', { username, password });
     
     // Destructure token and user from the response
     const { token, user } = response.data;
 
     // Store token in localStorage and set user state
     localStorage.setItem('authToken', token);
     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
 
     // Set the user state with user data from login response
     setUser(user);  
     console.log("User set after login:", user);  // Check if the user state is being set correctly
   } catch (error) {
     console.error("Login error:", error);
     throw error;
   }
 };
 
 

  const logout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
