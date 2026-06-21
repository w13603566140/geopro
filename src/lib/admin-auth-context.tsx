'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface AdminUser {
  id: string;
  username: string;
  role: 'super_admin' | 'admin' | 'operator';
  lastLogin?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  adminLogin: (username: string, password: string) => Promise<void>;
  adminLogout: () => void;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const ADMIN_TOKEN_KEY = 'geo_admin_token';
const ADMIN_USER_KEY = 'geo_admin_user';

// 获取本地存储的admin token
function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredAdminUser(user: AdminUser | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(ADMIN_USER_KEY);
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 启动时检查已有token
  useEffect(() => {
    const token = getAdminToken();
    const stored = getStoredAdminUser();
    if (token && stored) {
      setAdminUser(stored);
    }
    setLoading(false);
  }, []);

  const adminLogin = useCallback(async (username: string, password: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const res = await fetch(`${API_BASE}/api/admin-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || '登录失败，请检查账号密码');
    }

    setAdminToken(data.data.token);
    setStoredAdminUser(data.data.user);
    setAdminUser(data.data.user);
  }, []);

  const adminLogout = useCallback(() => {
    setAdminToken(null);
    setStoredAdminUser(null);
    setAdminUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        loading,
        adminLogin,
        adminLogout,
        isAdmin: !!adminUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth 必须在 AdminAuthProvider 内使用');
  }
  return ctx;
}
