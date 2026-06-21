'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import OnboardingWizard from '@/components/onboarding/onboarding-wizard';
import { Compass } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 首次登录自动弹出引导
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('geo_onboarded');
    if (!hasOnboarded) {
      const timer = setTimeout(() => setShowOnboarding(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('geo_onboarded', 'true');
    setShowOnboarding(false);
  };

  // 模拟统计数据
  const stats = [
    { label: '管理站点', value: 3, icon: '🌐', change: '+1' },
    { label: '体检次数', value: 12, icon: '🔍', change: '+3' },
    { label: '监测查询', value: 45, icon: '📊', change: '+8' },
    { label: '剩余积分', value: 286, icon: '💰', change: '' },
  ];

  const recentAudits = [
    { id: '1', totalScore: 85, createdAt: new Date(), site: { name: 'AI网关Pro官网', url: 'https://example.com' } },
    { id: '2', totalScore: 72, createdAt: new Date(Date.now() - 86400000), site: { name: '开发文档站', url: 'https://docs.example.com' } },
    { id: '3', totalScore: 58, createdAt: new Date(Date.now() - 172800000), site: { name: '开源项目页', url: 'https://github.com/example/project' } },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">控制台概览</h1>
        <p className="text-gray-500 mt-1">欢迎回来，{user?.name || '用户'} · {user?.planTier === 'ENTERPRISE' ? '企业版' : user?.planTier === 'PROFESSIONAL' ? '专业版' : '免费版'}</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="stat-label">{stat.label}</span>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            {stat.change && <span className="text-xs text-green-600">{stat.change} 较上周</span>}
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '添加站点', href: '/dashboard/sites', color: 'bg-blue-50 text-blue-700' },
          { label: '全站体检', href: '/dashboard/audit', color: 'bg-green-50 text-green-700' },
          { label: '生成标签', href: '/dashboard/structured-data', color: 'bg-purple-50 text-purple-700' },
          { label: '排名查询', href: '/dashboard/monitoring', color: 'bg-orange-50 text-orange-700' },
        ].map(action => (
          <a key={action.label} href={action.href}
            className={`${action.color} rounded-xl p-4 text-center font-medium hover:opacity-80 transition-opacity cursor-pointer`}>
            {action.label} →
          </a>
        ))}
      </div>

      {/* 最近体检 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">最近体检记录</h2>
        {recentAudits.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>暂无体检记录</p>
            <a href="/dashboard/audit" className="text-primary-600 text-sm mt-2 inline-block">
              立即开始首次体检 →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAudits.map(audit => (
              <div key={audit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{audit.site.name}</div>
                  <div className="text-xs text-gray-500">{audit.site.url}</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    audit.totalScore >= 80 ? 'text-green-600' :
                    audit.totalScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {audit.totalScore}分
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(audit.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 新手引导入口 */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">新手引导</div>
            <div className="text-xs text-gray-500">5分钟完成配置，开启AI优化之旅</div>
          </div>
        </div>
        <button
          onClick={() => setShowOnboarding(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          开始引导
        </button>
      </div>

      <OnboardingWizard
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}
