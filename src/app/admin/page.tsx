'use client';

import { Users, CreditCard, TrendingUp, Server, AlertTriangle } from 'lucide-react';

export default function AdminOverviewPage() {
  const stats = [
    { label: '注册用户', value: '1,286', icon: Users, color: 'text-blue-600 bg-blue-50', change: '+12%' },
    { label: '付费用户', value: '342', icon: CreditCard, color: 'text-green-600 bg-green-50', change: '+5%' },
    { label: '月营收', value: '¥86,420', icon: TrendingUp, color: 'text-purple-600 bg-purple-50', change: '+18%' },
    { label: '系统请求', value: '2.4M', icon: Server, color: 'text-orange-600 bg-orange-50', change: '+22%' },
  ];

  const alerts = [
    { type: 'warning', message: 'SSL证书将于30天后过期，请及时续期', time: '2小时前' },
    { type: 'info', message: '系统自动备份完成 - 备份大小: 1.2GB', time: '6小时前' },
    { type: 'error', message: '支付网关响应延迟超过3秒，请检查服务状态', time: '1天前' },
  ];

  const recentUsers = [
    { name: '张科技有限公司', email: 'admin@zhangtech.com', plan: 'ENTERPRISE', date: '2026-06-20' },
    { name: '李开发工作室', email: 'dev@liworks.com', plan: 'PROFESSIONAL', date: '2026-06-19' },
    { name: '王创业团队', email: 'wang@startup.cn', plan: 'FREE', date: '2026-06-18' },
    { name: '赵互联网公司', email: 'zhao@inet.com', plan: 'PROFESSIONAL', date: '2026-06-17' },
  ];

  const getPlanBadge = (plan: string) => {
    const map: Record<string, string> = { ENTERPRISE: 'bg-purple-100 text-purple-700', PROFESSIONAL: 'bg-blue-100 text-blue-700', FREE: 'bg-gray-100 text-gray-600' };
    const names: Record<string, string> = { ENTERPRISE: '企业版', PROFESSIONAL: '专业版', FREE: '免费版' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[plan]}`}>{names[plan]}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">管理概览</h1>
        <p className="text-slate-400 text-sm mt-1">系统运行状态 · 独立后台模式</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-green-600">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> 系统告警
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                alert.type === 'error' ? 'bg-red-50' : alert.type === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
              }`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  alert.type === 'error' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <span className="text-xs text-gray-400">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-600" /> 最近注册用户
          </h2>
          <div className="space-y-3">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  {getPlanBadge(user.plan)}
                  <span className="text-xs text-gray-400">{user.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
