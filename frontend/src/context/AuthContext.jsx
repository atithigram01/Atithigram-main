import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/api';
import { supabase } from '../services/supabase';

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
    const { email, password } = credentials;

    // 1. Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    const supabaseUser = authData.user;
    if (!supabaseUser) throw new Error('Failed to retrieve user session from Supabase.');

    // 2. Fetch our MongoDB profile from Express backend
    const { data: dbData } = await api.login({
      email,
      supabaseId: supabaseUser.id
    });

    // 3. Construct combined session for the app (token will be the Supabase access JWT)
    const userData = {
      _id: dbData._id,
      name: dbData.name,
      email: dbData.email,
      role: dbData.role,
      ecoPoints: dbData.ecoPoints ?? 0,
      token: authData.session?.access_token || ''
    };

    _persist(userData);
    setUser(userData);
    setEcoPoints(userData.ecoPoints ?? 0);
    return userData;
  };

  const registerUser = async (formData) => {
    const { name, email, password, role } = formData;

    // 1. Sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (authError) throw authError;

    const supabaseUser = authData.user;
    if (!supabaseUser) throw new Error('Failed to retrieve user session from Supabase.');

    // 2. Synchronize profile details with MongoDB backend
    const { data: dbData } = await api.register({
      name,
      email,
      supabaseId: supabaseUser.id,
      role
    });

    if (!authData.session) {
      // Supabase email confirmation is enabled. User is registered but must verify email to log in
      return { confirmationRequired: true };
    }

    // 3. Construct combined session for the app (token will be the Supabase access JWT)
    const userData = {
      _id: dbData._id,
      name: dbData.name,
      email: dbData.email,
      role: dbData.role,
      ecoPoints: dbData.ecoPoints ?? 0,
      token: authData.session?.access_token || ''
    };

    _persist(userData);
    setUser(userData);
    setEcoPoints(userData.ecoPoints ?? 0);
    return userData;
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
