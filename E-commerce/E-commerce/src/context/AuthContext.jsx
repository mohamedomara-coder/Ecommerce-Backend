import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage('auth_user', null);
  const [token, setToken] = useLocalStorage('auth_token', null);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setCurrentUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Invalid email or password.' };
    } catch (err) {
      return { success: false, error: 'Network error.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setCurrentUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Email already registered.' };
    } catch (err) {
      return { success: false, error: 'Network error.' };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')?.replace(/"/g, '')}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
      } else {
        setCurrentUser((prev) => ({ ...prev, ...updates }));
      }
    } catch (err) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const allUsers = []; // Fallback for any components that still try to read allUsers

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, updateProfile, isAdmin, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
