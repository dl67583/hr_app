// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permissions, setPermissions] = useState([]); // Track user permissions
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('/api/verify-token', {}, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          if (response.status === 200) {
            setIsAuthenticated(true);
            setPermissions(response.data.permissions); // Set user permissions
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userPermissions) => {
    localStorage.setItem('token', token);
    setPermissions(userPermissions); // Set user permissions on login
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setPermissions([]);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, permissions, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
