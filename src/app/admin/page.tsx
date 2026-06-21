'use client';

import { Users, CreditCard, TrendingUp, Server, AlertTriangle, Zap, Activity, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminOverviewPage() {
  const stats = [
    { label: '注册用户', value: '1,286', icon: Users, gradient: 'from-blue-500 to-cyan-500', change: '+12%', up: true },
    { label: '付费用户', value: '342', icon: CreditCard, gradient: 'from-emerald-500 to-teal-500', change: '+5%', up: true },
    { label: '月营收', value: '¥86,420', icon: TrendingUp, gradient: 'from-violet-500 to-purple-500', change: '+18%', up: true },
    { label: '系统请求', value: '2.4M', icon: Server, gradient: 'from-amber-500 to-orange-500', change: '+22%', up: true },
  ];

  const secondaryStats = [
    { label: '今日新增', value: '24', icon: Zap, gradient: 'from-rose-500 to-pink-500', change: '+8' },
    { label: '积分消耗', value: '1,856', icon: Coins, gradient: 'from-amber-500 to-yellow-500', change: '+156' },
    { label: '活跃代理', value: '18', icon: Activity, gradient: 'from-green-500 to-emerald-500', change: '+3' },
    { label: '退款率', value: '2.1%', icon: ArrowDownRight, gradient: 'from-red-500 to-rose-500', change: '-0.3%', up: false },
  ];

  const alerts = [
    { type: 'error', message: '支付网关响应延迟超过3秒，请检查服务状态', time: '2 分钟前', icon: AlertTriangle },
    { type: 'warning', message: 'SSL证书将于30天后过期，请及时续期', time: '2 小时前', icon: AlertTriangle },
    { type: 'info', message: '系统自动备份完成 - 备份大小: 1.2GB', time: '6 小时前', icon: Server },
  ];

  const recentUsers = [
    { name: '张科技有限公司', email: 'admin@zhangtech.com', plan: 'ENTERPRISE', date: '2026-06-20', amount: '¥7,999' },
    { name: '李开发工作室', email: 'dev@liworks.com', plan: 'PROFESSIONAL', date: '2026-06-19', amount: '¥299' },
    { name: '王创业团队', email: 'wang@startup.cn', plan: 'FREE', date: '2026-06-18', amount: '—' },
    { name: '赵互联网公司', email: 'zhao@inet.com', plan: 'PROFESSIONAL', date: '2026-06-17', amount: '¥299' },
    { name: '刘测试科技', email: 'liu@test.cn', plan: 'FREE', date: '2026-06-16', amount: '—' },
  ];

  const getPlanBadge = (plan: string) => {
    const map: Record<string, string> = {
      ENTERPRISE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      PROFESSIONAL: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      FREE: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };
    const names: Record<string, string> = { ENTERPRISE: '企业版', PROFESSIONAL: '专业版', FREE: '免费版' };
    return <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${map[plan]}`}>{names[plan]}</span>;
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-500/30 bg-red-500/5';
      case 'warning': return 'border-amber-500/30 bg-amber-500/5';
      default: return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  const getAlertIconColor = (type: string) => {
    switch (type) { case 'error': return 'text-red-400'; case 'warning': return 'text-amber-400'; default: return 'text-blue-400'; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">管理概览</h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            系统运行中 · 独立后台模式
          </p>
        </div>
        <div className="hidden md:block text-xs text-slate-500">
          更新于 <span className="text-slate-300 font-mono">{new Date().toLocaleString('zh-CN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-slate-800 rounded-2xl border border-slate-700 p-5 hover:border-slate-600 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />{stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
            <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {secondaryStats.map(stat => (
          <div key={stat.label} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 hover:border-slate-600 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  {stat.label} <span className={stat.up === false ? 'text-emerald-400' : 'text-amber-400'}>{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> 系统告警
            <span className="ml-auto text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">{alerts.length} 条</span>
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${getAlertStyle(alert.type)}`}>
                <alert.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getAlertIconColor(alert.type)}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-300">{alert.message}</p>
                  <span className="text-xs text-slate-500 mt-1 block">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" /> 最近注册用户
            <span className="ml-auto text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">5 人</span>
          </h2>
          <div className="space-y-2">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-slate-200 font-medium text-sm">{user.name[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-slate-200 truncate">{user.name}</div>
                    <div className="text-xs text-slate-500 truncate">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getPlanBadge(user.plan)}
                  <span className="text-xs font-mono text-amber-400 w-14 text-right">{user.amount}</span>
                  <span className="text-xs text-slate-500 w-20 text-right">{user.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
