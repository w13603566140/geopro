'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, setAuthToken, getAuthToken } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  planTier: string;
  credits: number;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; company?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 启动时检查已有token
    const token = getAuthToken();
    if (token) {
      authApi.getMe()
        .then(res => {
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            setAuthToken(null);
          }
        })
        .catch(() => setAuthToken(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (res.success && res.data) {
      setAuthToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (data: { name: string; email: string; password: string; company?: string }) => {
    const res = await authApi.register(data);
    if (res.success && res.data) {
      setAuthToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
