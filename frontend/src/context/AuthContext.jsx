import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const stored = JSON.parse(localStorage.getItem('atithigram_user') || 'null');
  const [user, setUser] = useState(stored);
  const [ecoPoints, setEcoPoints] = useState(
    stored?.ecoPoints ?? 0
  );

  const _persist = (userData) => {
    localStorage.setItem('atithigram_user', JSON.stringify(userData));
  };

  const loginUser = async (credentials) => {
    const { data } = await api.login(credentials);
    _persist(data);
    setUser(data);
    setEcoPoints(data.ecoPoints ?? 0);
    return data;
  };

  const registerUser = async (formData) => {
    const { data } = await api.register(formData);
    _persist(data);
    setUser(data);
    setEcoPoints(data.ecoPoints ?? 0);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('atithigram_user');
    setUser(null);
    setEcoPoints(0);
  };

  /**
   * Add eco-points to the current user's balance.
   * Persists to localStorage so points survive a refresh.
   */
  const addEcoPoints = async (n) => {
    try {
      if (user) {
        const { data } = await api.updateEcoPoints(n);
        _persist(data);
        setUser(data);
        setEcoPoints(data.ecoPoints);
      } else {
        setEcoPoints((prev) => prev + n);
      }
    } catch (err) {
      console.error('Failed to sync eco-points with backend:', err);
      // Fallback for offline/demo: just update local state
      setEcoPoints((prev) => {
        const next = prev + n;
        if (user) {
          const updated = { ...user, ecoPoints: next };
          _persist(updated);
          setUser(updated);
        }
        return next;
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, ecoPoints, loginUser, registerUser, logout, addEcoPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
