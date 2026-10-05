import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveUser, getUsers, saveUser, setActiveUserStore, subscribeToEvents } from '../services/store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const active = getActiveUser();
    if (active && active.isLoggedIn) {
      return active;
    }
    return {
      name: 'Guest User',
      email: '',
      phone: '',
      address: 'Select Delivery Location',
      isLoggedIn: false,
    };
  });

  useEffect(() => {
    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'USER_MUTATION') {
        const active = getActiveUser();
        if (active) setUser(active);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const allUsers = getUsers();
    let existingUser = allUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);

    if (!existingUser) {
      try {
        const backendRes = await api.login(cleanEmail, password);
        if (backendRes && backendRes.success && backendRes.user) {
          existingUser = backendRes.user;
          saveUser(existingUser);
        }
      } catch (e) {}
    }

    if (!existingUser) {
      return { success: false, message: 'Account not found! Please Sign Up first.' };
    }

    if (existingUser.password && existingUser.password !== password) {
      return { success: false, message: 'Incorrect password! Please try again.' };
    }

    const updatedUser = {
      ...existingUser,
      isLoggedIn: true,
    };

    saveUser(updatedUser);
    setUser(updatedUser);
    return { success: true };
  };

  const signup = (name, email, phone, password) => {
    const allUsers = getUsers();
    const existingUser = allUsers.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return { success: false, message: 'Email already registered! Please Sign In.' };
    }

    const newUser = {
      name: name || email.split('@')[0],
      email: email,
      phone: phone || '+91 98765 43210',
      password: password,
      address: '123 Maple St, Tech Park, Suite 404',
      isLoggedIn: true,
    };

    saveUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  const updateAddress = (newAddress) => {
    const updated = { ...user, address: newAddress };
    saveUser(updated);
    setUser(updated);
    return updated;
  };

  const logout = () => {
    const guestUser = {
      name: 'Guest User',
      email: '',
      phone: '',
      address: 'Select Delivery Location',
      isLoggedIn: false,
    };
    setActiveUserStore(guestUser);
    setUser(guestUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
