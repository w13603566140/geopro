'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Eye, Target, Zap, Globe, Users, Calendar } from 'lucide-react';

export default function DataCenterPage() {
  const [period, setPeriod] = useState('30d');

  const stats = [
    { label: 'AI诊断次数', value: '1,286', change: '+18%', icon: Eye, color: 'text-blue-600 bg-blue-50' },
    { label: '品牌可见率', value: '87.5%', change: '+12%', icon: Target, color: 'text-green-600 bg-green-50' },
    { label: '内容发布量', value: '3,420', change: '+25%', icon: Zap, color: 'text-purple-600 bg-purple-50' },
    { label: 'AI推荐流量', value: '12.8万', change: '+32%', icon: TrendingUp, color: 'text-orange-600 bg-orange-50' },
  ];

  const trends = [
    { date: '6/01', score: 45, visible: 3 },
    { date: '6/05', score: 52, visible: 4 },
    { date: '6/10', score: 58, visible: 4 },
    { date: '6/15', score: 67, visible: 5 },
    { date: '6/20', score: 75, visible: 6 },
    { date: '6/25', score: 82, visible: 7 },
    { date: '6/30', score: 88, visible: 8 },
  ];

  const platformData = [
    { name: 'DeepSeek', score: 92, visible: true, rank: 1 },
    { name: '豆包', score: 88, visible: true, rank: 1 },
    { name: 'Kimi', score: 85, visible: true, rank: 2 },
    { name: '通义千问', score: 78, visible: true, rank: 2 },
    { name: '文心一言', score: 72, visible: true, rank: 3 },
    { name: '元宝', score: 65, visible: true, rank: 5 },
    { name: '智谱清言', score: 55, visible: false, rank: null },
    { name: '纳米AI', score: 40, visible: false, rank: null },
  ];

  const hotQuestions = [
    { question: '国内AI网关哪个好用？', traffic: 3280, change: '+15%' },
    { question: '多模型API代理服务推荐', traffic: 2560, change: '+22%' },
    { question: '企业级AI网关选型指南', traffic: 1890, change: '+8%' },
    { question: 'AI Token用量监控方案', traffic: 1450, change: '+31%' },
    { question: 'AI服务私有化部署推荐', traffic: 1120, change: '+12%' },
  ];

  const maxScore = Math.max(...trends.map(t => t.score));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI数据中心</h1>
          <p className="text-gray-500 mt-1">可视化监测品牌在AI生态中的表现趋势</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
          {['7d', '30d', '90d'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${period === p ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              {p.replace('d', '天')}
            </button>
          ))}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <span className="text-xs font-medium text-green-600">{s.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 趋势图 */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary-600" />GEO评分趋势</h2>
          <div className="h-48 flex items-end gap-2">
            {trends.map(t => (
              <div key={t.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end items-center" style={{ height: '160px' }}>
                  <div className="w-full bg-primary-500 rounded-t" style={{ height: `${(t.score / maxScore) * 140}px`, opacity: 0.7 + (t.score / maxScore) * 0.3 }} />
                </div>
                <span className="text-xs text-gray-400">{t.date}</span>
                <span className="text-xs font-bold text-primary-600">{t.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 平台排名 */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-primary-600" />各AI平台评分</h2>
          <div className="space-y-3">
            {platformData.map(p => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-sm font-medium w-20 truncate">{p.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${p.visible ? (p.rank === 1 ? 'bg-green-500' : p.rank && p.rank <= 3 ? 'bg-blue-500' : 'bg-yellow-500') : 'bg-red-400'}`}
                    style={{ width: `${p.score}%` }} />
                </div>
                <span className="text-sm font-mono w-10 text-right">{p.score}</span>
                <span className={`text-xs w-12 ${p.visible ? (p.rank === 1 ? 'badge-success' : 'badge-info') : 'badge-danger'}`}>
                  {p.visible ? (p.rank === 1 ? '🥇首位' : `#${p.rank}`) : '未收录'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 热门问句 */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" />高价值商业问句 Top5</h2>
        <div className="space-y-2">
          {hotQuestions.map((q, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-6">#{i + 1}</span>
                <span className="text-sm text-gray-700">{q.question}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-gray-500">{q.traffic.toLocaleString()}</span>
                <span className="text-xs text-green-600">{q.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
