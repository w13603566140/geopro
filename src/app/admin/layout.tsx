'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/lib/admin-auth-context';
import {
  LayoutDashboard, Settings, Users, CreditCard,
  Receipt, ScrollText, Shield, LogOut, Menu, ChevronLeft,
  Send, Briefcase, Package, Compass, Server, TrendingUp,
  AlertTriangle, Activity, Home, FileText,
} from 'lucide-react';

const adminNavItems = [
  { href: '/admin', label: '管理概览', icon: LayoutDashboard },
  { href: '/admin/system', label: '系统配置', icon: Settings },
  { href: '/admin/users', label: '用户管理', icon: Users },
  { href: '/admin/payment', label: '支付配置', icon: CreditCard },
  { href: '/admin/plans', label: '套餐管理', icon: Receipt },
  { href: '/admin/publish', label: '发布管理', icon: Send },
  { href: '/admin/templates', label: '模板管理', icon: Package },
  { href: '/admin/managed', label: '代运营管理', icon: Briefcase },
  { href: '/admin/onboarding', label: '引导配置', icon: Compass },
  { href: '/admin/legal', label: '法律文档', icon: FileText },
  { href: '/admin/logs', label: '操作日志', icon: ScrollText },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, loading, adminLogout, isAdmin } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 排除登录页
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !isAdmin && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [loading, isAdmin, isLoginPage, router]);

  // 登录页裸渲染
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-600 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">验证管理员身份...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-slate-900">
      {/* 移动端遮罩 */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* 侧边栏 - 深色主题 */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-slate-800 border-r border-slate-700 flex flex-col
        transition-all duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Logo */}
        <div className="h-16 border-b border-slate-700 flex items-center px-4 gap-3">
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-white text-sm">GEO 管理后台</span>
              <p className="text-xs text-slate-500">超级管理员</p>
            </div>
          )}
        </div>

        {/* 导航 */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {adminNavItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-amber-600/20 text-amber-400'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && item.label}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 bg-amber-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 底部 */}
        <div className="border-t border-slate-700 p-3 space-y-2">
          {!collapsed && adminUser && (
            <div className="px-3 py-2">
              <div className="text-xs text-slate-500 mb-1">当前管理员</div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-slate-300">{adminUser.username}</span>
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {adminUser.role === 'super_admin' ? '超级管理员' : adminUser.role === 'admin' ? '管理员' : '运营'}
              </div>
            </div>
          )}
          <button
            onClick={() => { adminLogout(); router.replace('/admin/login'); }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-slate-400 hover:bg-slate-700/50 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && '退出后台'}
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-slate-500 hover:bg-slate-700/50 hover:text-slate-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            {!collapsed && '返回前台'}
          </Link>
        </div>

        {/* 折叠按钮 */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full items-center justify-center hover:bg-slate-600"
        >
          <ChevronLeft className={`w-3 h-3 text-slate-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="h-16 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-6">
          <button className="lg:hidden p-2 hover:bg-slate-700 rounded-lg"
            onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex-1 ml-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-xs text-slate-500">系统运行中 · 管理后台独立模式</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              前台首页
            </Link>
            <div className="w-8 h-8 bg-amber-600/20 rounded-full flex items-center justify-center ring-1 ring-amber-500/30">
              <span className="text-amber-400 font-medium text-sm">
                {adminUser?.username?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
