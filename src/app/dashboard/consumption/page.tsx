'use client';

import { useState } from 'react';
import { ScrollText, Search, Download, Filter } from 'lucide-react';

export default function ConsumptionPage() {
  const [filter, setFilter] = useState('all');

  const records = [
    { id: '1', type: 'AI可见度诊断', detail: '品牌: 小米科技 | 行业词: 智能家居', amount: '-15.00', balance: 985.00, time: '2026-06-21 14:32' },
    { id: '2', type: 'AI文章写作', detail: '生成文章: 智能家居选购指南', amount: '-5.00', balance: 970.00, time: '2026-06-21 11:20' },
    { id: '3', type: 'AI素材生成', detail: '生成品牌素材包 x3', amount: '-10.00', balance: 960.00, time: '2026-06-20 16:45' },
    { id: '4', type: 'B2B文章发布', detail: '发布至: 1688.com, hc360.com', amount: '-8.00', balance: 952.00, time: '2026-06-20 10:15' },
    { id: '5', type: 'AI流量复刻', detail: '复刻竞品流量词: 智能锁推荐', amount: '-20.00', balance: 932.00, time: '2026-06-19 15:30' },
    { id: '6', type: '账户充值', detail: '在线充值', amount: '+500.00', balance: 1432.00, time: '2026-06-18 09:00' },
    { id: '7', type: 'AI可见度诊断', detail: '品牌: 华为 | 行业词: 5G通信', amount: '-15.00', balance: 917.00, time: '2026-06-17 14:20' },
    { id: '8', type: '自媒体发布', detail: '发布至: 头条号, 百家号', amount: '-6.00', balance: 911.00, time: '2026-06-16 11:00' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">消耗明细</h1>
        <p className="text-gray-500 mt-1">查看账户消费记录与余额变动</p>
      </div>

      {/* 余额卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '账户余额', value: '¥911.00', color: 'text-green-600' },
          { label: '累计充值', value: '¥2,500.00', color: 'text-blue-600' },
          { label: '累计消费', value: '¥1,589.00', color: 'text-orange-600' },
          { label: '本月消费', value: '¥158.00', color: 'text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className="card p-4">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 筛选 + 导出 */}
      <div className="card p-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" className="input-field !pl-10" placeholder="搜索消费记录..." />
        </div>
        <select className="input-field !w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">全部类型</option>
          <option value="diagnosis">AI诊断</option>
          <option value="writing">文章写作</option>
          <option value="publish">文章发布</option>
          <option value="recharge">充值</option>
        </select>
        <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />导出</button>
      </div>

      {/* 记录表格 */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['类型', '详情', '金额', '余额', '时间'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.type.includes('充值') ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>{r.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.detail}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono font-medium ${r.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                      {r.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">¥{r.balance.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
