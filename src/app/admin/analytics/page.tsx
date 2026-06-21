'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Globe, MousePointerClick, Clock, Download, Filter, ChevronDown } from 'lucide-react';

// 简单的CSS柱状图组件
function SimpleBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 w-16 text-right">{label}</span>
      <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }}>
          <span className="text-xs text-white font-medium px-2 leading-6">{value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// 简单折线图（CSS模拟）
function SimpleLineChart({ data, labels, height }: { data: number[]; labels: string[]; height: number }) {
  const max = Math.max(...data, 1);
  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 flex items-end gap-1 px-2">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
            <div
              className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t transition-all duration-500 hover:from-amber-400 hover:to-amber-300"
              style={{ height: `${(val / max) * 100}%`, minHeight: val > 0 ? 4 : 0 }}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs px-1.5 py-0.5 rounded whitespace-nowrap transition-opacity">
                {val.toLocaleString()}
              </div>
            </div>
            <span className="text-xs text-slate-500 mt-1">{labels[i]}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-600" />
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // 关键指标
  const kpis = [
    { label: '总访问量', value: '128,456', change: '+18.2%', icon: Globe, gradient: 'from-blue-500 to-cyan-500' },
    { label: '活跃用户', value: '3,842', change: '+12.5%', icon: Users, gradient: 'from-emerald-500 to-teal-500' },
    { label: '总营收', value: '¥286,420', change: '+24.8%', icon: DollarSign, gradient: 'from-violet-500 to-purple-500' },
    { label: '转化率', value: '4.8%', change: '+2.1%', icon: TrendingUp, gradient: 'from-amber-500 to-orange-500' },
  ];

  // 用户增长趋势
  const userGrowth = [320, 480, 520, 680, 820, 950, 1100, 1250, 1420, 1680, 1950, 2100, 2450, 2680, 2900, 3200, 3450, 3680, 3842];
  const userLabels = Array.from({ length: 19 }, (_, i) => `${i + 1}日`);

  // 营收趋势
  const revenueData = [18500, 22000, 19500, 28000, 25000, 32000, 29000, 35000, 38000, 42000, 39000, 45000, 48000, 52000, 49000, 55000, 58000, 62000, 68000];
  const revenueLabels = Array.from({ length: 19 }, (_, i) => `${i + 1}日`);

  // 功能使用排行
  const featureUsage = [
    { name: 'GEO诊断', count: 4520, max: 5000, color: 'bg-blue-500' },
    { name: 'AI内容生成', count: 3850, max: 5000, color: 'bg-emerald-500' },
    { name: '竞品分析', count: 3120, max: 5000, color: 'bg-violet-500' },
    { name: '排名监测', count: 2680, max: 5000, color: 'bg-amber-500' },
    { name: '一键发布', count: 1950, max: 5000, color: 'bg-rose-500' },
    { name: '结构化标签', count: 1420, max: 5000, color: 'bg-cyan-500' },
    { name: '行业模板', count: 980, max: 5000, color: 'bg-indigo-500' },
    { name: 'AI流量复刻', count: 520, max: 5000, color: 'bg-pink-500' },
  ];

  // 用户来源
  const userSources = [
    { name: '直接访问', value: 45, color: 'bg-blue-500' },
    { name: '搜索引擎', value: 28, color: 'bg-green-500' },
    { name: '社交媒体', value: 15, color: 'bg-purple-500' },
    { name: '外部链接', value: 8, color: 'bg-amber-500' },
    { name: '邮件营销', value: 4, color: 'bg-rose-500' },
  ];

  // 最近活动
  const recentActivities = [
    { user: '张科技有限公司', action: '完成GEO诊断', time: '2分钟前', type: 'diagnosis' },
    { user: '李开发工作室', action: '购买专业版套餐', time: '15分钟前', type: 'purchase' },
    { user: '王创业团队', action: '生成AI内容', time: '28分钟前', type: 'content' },
    { user: '赵互联网公司', action: '充值5000积分', time: '1小时前', type: 'recharge' },
    { user: '陈设计工作室', action: '发布内容到3个平台', time: '2小时前', type: 'publish' },
    { user: '杨科技公司', action: '完成竞品分析', time: '3小时前', type: 'analysis' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'diagnosis': return '🔍';
      case 'purchase': return '💳';
      case 'content': return '📝';
      case 'recharge': return '💰';
      case 'publish': return '📤';
      case 'analysis': return '📊';
      default: return '📌';
    }
  };

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" /> 数据统计
          </h1>
          <p className="text-slate-400 text-sm mt-1">系统运营数据分析与业务洞察</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-1">
            {[{ key: '7d' as const, label: '7天' }, { key: '30d' as const, label: '30天' }, { key: '90d' as const, label: '90天' }].map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p.key ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4" /> 导出报表
          </button>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-slate-800 rounded-2xl border border-slate-700 p-5 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{kpi.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            <div className="text-sm text-slate-400 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* 图表区 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 用户增长 */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> 用户增长趋势
          </h3>
          <SimpleLineChart data={userGrowth} labels={userLabels} height={180} />
        </div>

        {/* 营收趋势 */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> 营收趋势（近{period === '7d' ? '7' : period === '30d' ? '30' : '90'}天）
          </h3>
          <SimpleLineChart data={revenueData} labels={revenueLabels} height={180} />
        </div>
      </div>

      {/* 功能使用 + 用户来源 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 功能使用排行 */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> 功能使用排行
          </h3>
          <div className="space-y-3">
            {featureUsage.map(item => (
              <SimpleBar key={item.name} value={item.count} max={item.max} label={item.name} color={item.color} />
            ))}
          </div>
        </div>

        {/* 用户来源 + 最近活动 */}
        <div className="space-y-6">
          {/* 用户来源 */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-purple-400" /> 用户来源分布
            </h3>
            <div className="space-y-3">
              {userSources.map(source => (
                <div key={source.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-20">{source.name}</span>
                  <div className="flex-1 h-5 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${source.color} rounded-full transition-all`} style={{ width: `${source.value}%` }}>
                      <span className="text-xs text-white font-medium px-2 leading-5">{source.value}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 最近活动 */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" /> 实时动态
            </h3>
            <div className="space-y-2">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-200 font-medium truncate">{activity.user}</div>
                    <div className="text-xs text-slate-400">{activity.action}</div>
                  </div>
                  <span className="text-xs text-slate-500 flex-shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
