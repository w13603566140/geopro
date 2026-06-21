'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Settings, Users, CreditCard,
  Receipt, ScrollText, Shield, Server, ArrowLeft, Cog,
  Send, Briefcase, Package, Compass,
} from 'lucide-react';

const adminNavItems = [
  { href: '/dashboard/admin', label: '管理概览', icon: LayoutDashboard },
  { href: '/dashboard/admin/system', label: '系统配置', icon: Settings },
  { href: '/dashboard/admin/users', label: '用户管理', icon: Users },
  { href: '/dashboard/admin/payment', label: '支付配置', icon: CreditCard },
  { href: '/dashboard/admin/plans', label: '套餐管理', icon: Receipt },
  { href: '/dashboard/admin/publish', label: '发布管理', icon: Send },
  { href: '/dashboard/admin/templates', label: '模板管理', icon: Package },
  { href: '/dashboard/admin/managed', label: '代运营管理', icon: Briefcase },
  { href: '/dashboard/admin/onboarding', label: '引导配置', icon: Compass },
  { href: '/dashboard/admin/logs', label: '操作日志', icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="返回控制台">
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
            <p className="text-sm text-gray-500">系统配置 · 用户权限 · 支付设置</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
          <Shield className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-medium text-amber-700">超级管理员模式</span>
        </div>
      </div>

      {/* 标签导航 */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1.5 overflow-x-auto">
        {adminNavItems.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* 内容区 */}
      <div>
        {children}
      </div>
    </div>
  );
}
