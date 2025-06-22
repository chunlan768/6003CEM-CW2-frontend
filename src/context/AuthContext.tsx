import React, { createContext, useContext, useState, ReactNode } from 'react';
import api, { setAuthToken } from '../services/api';

interface AuthContextType {
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string, signupCode: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    setAuthToken(response.data.token);
    setUser({ email, role: response.data.role || 'user' });
  };

  const register = async (email: string, password: string, role: string, signupCode: string) => {
    const response = await api.post('/auth/register', { email, password, role, signupCode });
    setAuthToken(response.data.token);
    setUser({ email, role });
  };

  const logout = () => {
    setAuthToken('');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};