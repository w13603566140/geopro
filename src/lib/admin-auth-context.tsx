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
    // 管理员账号（客户端验证，无需后端）
    const VALID_ACCOUNTS = [
      { id: 'super-admin-001', username: 'admin', password: 'admin888', role: 'super_admin' as const },
      { id: 'admin-002', username: 'operator', password: 'operator666', role: 'operator' as const },
    ];

    const admin = VALID_ACCOUNTS.find(a => a.username === username && a.password === password);

    if (!admin) {
      throw new Error('账号或密码错误');
    }

    // 生成简易token（生产环境使用后端JWT）
    const token = btoa(`admin:${admin.username}:${Date.now()}`);
    const user: AdminUser = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      lastLogin: new Date().toISOString(),
    };

    setAdminToken(token);
    setStoredAdminUser(user);
    setAdminUser(user);

    // 同时尝试调用后端API（非阻塞，若后端可用则同步）
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${API_BASE}/api/admin-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
    } catch {
      // 后端不可用时静默忽略，客户端已验证成功
    }
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
