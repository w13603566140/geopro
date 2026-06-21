'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard, Globe, FileSearch, Tags, FileText,
  BarChart3, Users, CreditCard, Settings, LogOut, ScrollText, TrendingUp,
  ChevronLeft, Menu, Sparkles, Shield, Zap, Cog,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: '控制台概览', icon: LayoutDashboard },
  { href: '/dashboard/sites', label: '站点管理', icon: Globe },
  { href: '/dashboard/audit', label: 'GEO体检', icon: FileSearch },
  { href: '/dashboard/structured-data', label: '结构化标签', icon: Tags },
  { href: '/dashboard/content', label: '内容生产', icon: FileText },
  { href: '/dashboard/monitoring', label: '排名监测', icon: BarChart3 },
  { href: '/dashboard/datacenter', label: 'AI数据中心', icon: TrendingUp },
  { href: '/dashboard/competitors', label: '竞品分析', icon: Users },
  { href: '/dashboard/mcp', label: 'Agent/MCP', icon: Zap },
  { href: '/dashboard/billing', label: '套餐计费', icon: CreditCard },
  { href: '/dashboard/consumption', label: '消耗明细', icon: ScrollText },
  { href: '/dashboard/quanyi', label: '账号权益', icon: Shield },
  { href: '/dashboard/settings', label: '系统设置', icon: Settings },
  { href: '/dashboard/admin', label: '管理后台', icon: Cog, adminOnly: true },
];

const planNames: Record<string, string> = { FREE: '免费版', PROFESSIONAL: '专业版', ENTERPRISE: '企业版' };

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="text-center"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-500">加载中...</p></div></div>;
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 移动端遮罩 */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* 侧边栏 */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white border-r border-gray-200 flex flex-col
        transition-all duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center px-4 gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-gray-900">GEO优化助手</span>}
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && item.label}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 底部 */}
        <div className="border-t border-gray-200 p-3 space-y-2">
          {!collapsed && (
            <div className="px-3 py-2">
              <div className="text-xs text-gray-400 mb-1">当前套餐</div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.planTier === 'ENTERPRISE' ? '企业版' :
                   user?.planTier === 'PROFESSIONAL' ? '专业版' : '免费版'}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && '退出登录'}
          </button>
        </div>

        {/* 折叠按钮 */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50"
        >
          <ChevronLeft className={`w-3 h-3 text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 flex items-center gap-4 ml-4">
            {/* 会员信息条 */}
            <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-amber-700">
                有效期至 2027-12-31 · {planNames[user.planTier] || '免费版'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-medium text-sm">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
