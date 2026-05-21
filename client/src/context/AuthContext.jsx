import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import db from '../db';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [shopId, setShopId] = useState(localStorage.getItem('shopId'));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token));

  useEffect(() => {
    // If the token changes, update axios headers instantly!
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }

    if (shopId) {
      localStorage.setItem('shopId', shopId);
    } else {
      localStorage.removeItem('shopId');
    }
  }, [token, shopId]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setToken(response.data.token);
    setShopId(response.data.shop_id);
  };

  const register = async (email, password, shopName) => {
    const response = await api.post('/auth/register', { email, password, shopName });
    setToken(response.data.token);
    setShopId(response.data.shop_id);
  };

  const logout = async () => {
    setToken(null);
    setShopId(null);
    localStorage.removeItem('lastSyncTime'); // CRITICAL: Reset sync clock!
    // CRITICAL: Wipe the old shop's offline data entirely so the next login doesn't see it!
    await db.delete();
    
    toast.success("Successfully logged out!");

    setTimeout(() => {
      window.location.reload(); // Reload to recreate the Dexie db instance cleanly after showing toast
    }, 800);
  };

  return (
    <AuthContext.Provider value={{ token, shopId, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
