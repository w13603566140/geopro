'use client';

import { useState } from 'react';
import {
  Briefcase, Plus, Save, CheckCircle, Edit3, Trash2,
  DollarSign, Users, Clock, TrendingUp, Search, Filter,
  Calendar, Phone, Mail, Globe, FileText,
  XCircle, Ban, Play,
} from 'lucide-react';

// 代运营套餐
interface ManagedPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  articlesPerMonth: number;
  platformsCount: number;
  monitoringLevel: string;
  reportFrequency: string;
  competitorCount: number;
  supportLevel: string;
  features: string[];
  active: boolean;
}

// 代运营订单
interface ManagedOrder {
  id: string;
  planName: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  productUrl: string;
  requirements: string;
  status: 'pending' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  amount: number;
  assignedTo: string;
  createdAt: string;
}

export default function AdminManagedPage() {
  const [tab, setTab] = useState<'plans' | 'orders'>('orders');
  const [saved, setSaved] = useState('');
  const [editingPlan, setEditingPlan] = useState<string | null>(null);

  // 套餐配置
  const [plans, setPlans] = useState<ManagedPlan[]>([
    {
      id: 'basic', name: '基础代运营', price: 2999, period: '月', articlesPerMonth: 4, platformsCount: 3,
      monitoringLevel: '基础', reportFrequency: '月度', competitorCount: 0, supportLevel: '邮件',
      features: ['每月4篇AI优化文章', '3个平台同步发布', '基础关键词排名监测', '月度诊断报告', '邮件支持（48小时内）'],
      active: true,
    },
    {
      id: 'standard', name: '标准代运营', price: 7999, period: '月', articlesPerMonth: 12, platformsCount: 6,
      monitoringLevel: '高级', reportFrequency: '周度', competitorCount: 2, supportLevel: '企业微信专属群',
      features: ['每月12篇AI优化文章', '6个平台同步发布', '高级关键词排名监测', '周度诊断报告+优化建议', '竞品分析（2个竞品）', '企业微信专属群支持', '一次免费策略咨询会'],
      active: true,
    },
    {
      id: 'enterprise', name: '企业代运营', price: 19999, period: '月', articlesPerMonth: 30, platformsCount: 8,
      monitoringLevel: '全维度', reportFrequency: '每日', competitorCount: 5, supportLevel: '7x24小时专属',
      features: ['每月30篇AI优化文章', '全平台（8个）同步发布', '全维度排名监测+实时告警', '每日诊断+即时优化', '竞品全量分析（5个竞品）', '7x24小时专属客服', '月度策略规划会', '应急处置方案', 'MCP/Agent生态维护'],
      active: true,
    },
  ]);

  // 订单管理
  const [orders] = useState<ManagedOrder[]>([
    { id: 'MO-20260620-001', planName: '标准代运营', companyName: '张科技有限公司', contactName: '张总', contactPhone: '138****8000', contactEmail: 'zhang@tech.com', productUrl: 'https://example.com', requirements: '重点优化AI推荐排名', status: 'active', startDate: '2026-06-20', endDate: '2026-07-20', amount: 7999, assignedTo: '运营专员小王', createdAt: '2026-06-18' },
    { id: 'MO-20260615-002', planName: '企业代运营', companyName: '李互联网集团', contactName: '李董', contactPhone: '139****9000', contactEmail: 'li@inet.com', productUrl: 'https://inet.com', requirements: '全平台覆盖+竞品打击', status: 'active', startDate: '2026-06-15', endDate: '2026-07-15', amount: 19999, assignedTo: '高级顾问老陈', createdAt: '2026-06-12' },
    { id: 'MO-20260610-003', planName: '基础代运营', companyName: '王创业工作室', contactName: '王创', contactPhone: '136****7000', contactEmail: 'wang@startup.cn', productUrl: 'https://startup.cn', requirements: '', status: 'pending', startDate: '', endDate: '', amount: 2999, assignedTo: '待分配', createdAt: '2026-06-10' },
    { id: 'MO-20260501-004', planName: '基础代运营', companyName: '刘测试科技', contactName: '刘工', contactPhone: '135****6000', contactEmail: 'liu@test.cn', productUrl: '', requirements: '', status: 'completed', startDate: '2026-05-01', endDate: '2026-06-01', amount: 2999, assignedTo: '运营专员小王', createdAt: '2026-04-28' },
    { id: 'MO-20260415-005', planName: '标准代运营', companyName: '赵网络科技', contactName: '赵总', contactPhone: '137****5000', contactEmail: 'zhao@net.cn', productUrl: 'https://net.cn', requirements: '技术文档优化', status: 'cancelled', startDate: '', endDate: '', amount: 7999, assignedTo: '未分配', createdAt: '2026-04-10' },
  ]);

  // 统计数据
  const stats = {
    totalOrders: 47,
    activeOrders: 12,
    monthlyRevenue: 186420,
    growth: '+23%',
  };

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    active: { label: '服务中', color: 'bg-green-100 text-green-700', icon: Play },
    paused: { label: '已暂停', color: 'bg-gray-100 text-gray-600', icon: Ban },
    completed: { label: '已完成', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
    cancelled: { label: '已取消', color: 'bg-red-100 text-red-700', icon: XCircle },
  };

  const handlePlanSave = (id: string) => {
    setEditingPlan(null);
    setSaved(id);
    setTimeout(() => setSaved(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary-600" /> 代运营管理
        </h2>
        <div className="flex items-center gap-2"></div>
      </div>

      {/* Tab切换 */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1.5 w-fit">
        {[
          { key: 'orders' as const, label: '订单管理', icon: FileText },
          { key: 'plans' as const, label: '套餐配置', icon: Briefcase },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '总订单', value: stats.totalOrders, unit: '单', icon: FileText, color: 'text-blue-600' },
          { label: '服务中', value: stats.activeOrders, unit: '单', icon: Play, color: 'text-green-600' },
          { label: '月营收', value: `¥${(stats.monthlyRevenue / 10000).toFixed(1)}`, unit: '万', icon: DollarSign, color: 'text-purple-600' },
          { label: '环比增长', value: stats.growth, unit: '', icon: TrendingUp, color: 'text-orange-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold text-gray-900">{stat.value}<span className="text-sm font-normal text-gray-400 ml-1">{stat.unit}</span></div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 订单管理 */}
      {tab === 'orders' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="搜索订单号/公司名..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 outline-none" />
            </div>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>全部状态</option>
              <option>待处理</option>
              <option>服务中</option>
              <option>已完成</option>
              <option>已取消</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">订单编号</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">公司</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">套餐</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">金额</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">状态</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">负责人</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">时间</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-xs text-gray-900">{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{order.companyName}</div>
                        <div className="text-xs text-gray-400">{order.contactName} · {order.contactPhone}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{order.planName}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">¥{order.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />{status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{order.assignedTo}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {order.startDate || '—'} ~ {order.endDate || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {order.status === 'pending' && (
                            <>
                              <button className="text-xs text-green-600 hover:text-green-700">接单</button>
                              <button className="text-xs text-red-500 hover:text-red-600">拒绝</button>
                            </>
                          )}
                          <button className="text-xs text-primary-600 hover:text-primary-700">详情</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 套餐配置 */}
      {tab === 'plans' && (
        <div className="space-y-4">
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />新建代运营套餐
          </button>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div key={plan.id} className={`bg-white rounded-xl border-2 p-6 ${
                plan.id === 'standard' ? 'border-primary-300 ring-1 ring-primary-200' : 'border-gray-200'
              }`}>
                {plan.id === 'standard' && (
                  <div className="text-xs font-medium text-primary-600 mb-2">🔥 主力套餐</div>
                )}

                {editingPlan === plan.id ? (
                  <div className="space-y-3">
                    <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm font-bold" defaultValue={plan.name} />
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">¥</span>
                      <input type="number" className="w-24 px-3 py-2 border rounded-lg text-sm" defaultValue={plan.price} />
                      <span className="text-gray-400 text-sm">/{plan.period}</span>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">月文章数</label>
                      <input type="number" className="w-full px-3 py-1.5 border rounded text-sm" defaultValue={plan.articlesPerMonth} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">平台数</label>
                      <input type="number" className="w-full px-3 py-1.5 border rounded text-sm" defaultValue={plan.platformsCount} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handlePlanSave(plan.id)} className="flex-1 px-3 py-1.5 bg-primary-600 text-white rounded text-xs">
                        {saved === plan.id ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <Save className="w-3 h-3 inline mr-1" />}
                        {saved === plan.id ? '已保存' : '保存'}
                      </button>
                      <button onClick={() => setEditingPlan(null)} className="px-3 py-1.5 border rounded text-xs">取消</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{plan.name}</h3>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                          ¥{plan.price.toLocaleString()}<span className="text-sm text-gray-400">/{plan.period}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingPlan(plan.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="space-y-1.5 mb-3 text-xs text-gray-600">
                      <div className="flex justify-between"><span>月文章数</span><span className="font-medium">{plan.articlesPerMonth} 篇</span></div>
                      <div className="flex justify-between"><span>发布平台</span><span className="font-medium">{plan.platformsCount} 个</span></div>
                      <div className="flex justify-between"><span>监测等级</span><span className="font-medium">{plan.monitoringLevel}</span></div>
                      <div className="flex justify-between"><span>报告频率</span><span className="font-medium">{plan.reportFrequency}</span></div>
                      <div className="flex justify-between"><span>竞品追踪</span><span className="font-medium">{plan.competitorCount} 个</span></div>
                      <div className="flex justify-between"><span>支持方式</span><span className="font-medium">{plan.supportLevel}</span></div>
                    </div>

                    <div className="space-y-1 mb-3">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, active: !p.active } : p))}
                        className={`text-xs px-2 py-1 rounded ${plan.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {plan.active ? '上架中' : '已下架'}
                      </button>
                      <button className="text-xs text-red-500 hover:text-red-600 ml-auto">
                        <Trash2 className="w-3 h-3 inline mr-0.5" />删除
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
