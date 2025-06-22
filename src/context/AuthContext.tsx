import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import * as jwtDecode from 'jwt-decode';

interface AuthContextType {
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string, signupCode?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      try {
        const decoded: { email: string; role: string; id?: string } = jwtDecode.jwtDecode(token);
        setUser({ email: decoded.email, role: decoded.role });
      } catch (error) {
        console.error('Token decoding failed:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, role } = response.data; // 確保後端返回 role
    localStorage.setItem('token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser({ email, role }); // 更新 user 狀態
  } catch (err) {
    throw new Error('登錄失敗');
  }
};

  const register = async (email: string, password: string, role: string, signupCode?: string) => {
    try {
      const response = await api.post('/auth/register', { email, password, role, signupCode });
      console.log('Register response:', response.data); // 調試日志
      await login(email, password); // 假設註冊後立即登錄
    } catch (err: any) {
      console.error('註冊錯誤:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      throw new Error(err.response?.data?.message || '註冊失敗');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};