'use client';

import { useState } from 'react';
import {
  Briefcase, CheckCircle, Clock, Shield, Zap, Star,
  ChevronRight, Send, FileText, TrendingUp, Users,
  AlertCircle, Loader2, Calendar, CreditCard,
} from 'lucide-react';

// 代运营套餐
const MANAGED_PLANS = [
  {
    id: 'basic',
    name: '基础代运营',
    price: 2999,
    period: '月',
    icon: Briefcase,
    color: 'border-blue-200 hover:border-blue-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    features: [
      '每月4篇AI优化文章',
      '3个平台同步发布',
      '基础关键词排名监测',
      '月度诊断报告',
      '邮件支持（48小时内）',
    ],
    recommended: false,
  },
  {
    id: 'standard',
    name: '标准代运营',
    price: 7999,
    period: '月',
    icon: Zap,
    color: 'border-primary-300 hover:border-primary-500',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    features: [
      '每月12篇AI优化文章',
      '6个平台同步发布',
      '高级关键词排名监测',
      '周度诊断报告 + 优化建议',
      '竞品分析（2个竞品）',
      '企业微信专属群支持',
      '一次免费策略咨询会',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: '企业代运营',
    price: 19999,
    period: '月',
    icon: Briefcase,
    color: 'border-purple-200 hover:border-purple-400',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    features: [
      '每月30篇AI优化文章',
      '全平台（8个）同步发布',
      '全维度排名监测 + 实时告警',
      '每日诊断 + 即时优化',
      '竞品全量分析（5个竞品）',
      '7x24小时专属客服',
      '月度策略规划会',
      '应急处置方案',
      'MCP/Agent生态维护',
    ],
    recommended: false,
  },
];

interface OrderForm {
  planId: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  productUrl: string;
  requirements: string;
  startDate: string;
}

// 模拟已有订单
const MOCK_ORDERS = [
  {
    id: 'MO-20240601-001',
    planName: '标准代运营',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-07-01',
    amount: 7999,
  },
  {
    id: 'MO-20240501-001',
    planName: '基础代运营',
    status: 'completed',
    startDate: '2024-05-01',
    endDate: '2024-06-01',
    amount: 2999,
  },
];

export default function ManagedPage() {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<OrderForm>({
    planId: 'standard',
    companyName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    productUrl: '',
    requirements: '',
    startDate: '',
  });

  const updateForm = (partial: Partial<OrderForm>) => {
    setForm(prev => ({ ...prev, ...partial }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitting(false);
    setSubmitted(true);
    setShowOrderForm(false);
  };

  const plan = MANAGED_PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* 页头 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">代运营服务</h1>
        <p className="mt-1 text-gray-500">专业团队帮你打理AI搜索引擎优化，让AI优先推荐你的产品</p>
      </div>

      {/* 服务保障 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Shield, label: '效果保障', desc: '排名不达标退款' },
          { icon: Clock, label: '7x24小时', desc: '专属客服支持' },
          { icon: Star, label: '专家团队', desc: '5年GEO经验' },
          { icon: TrendingUp, label: '数据驱动', desc: '周报月报透明' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <item.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">{item.label}</div>
            <div className="text-xs text-gray-500">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* 套餐选择 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MANAGED_PLANS.map(planItem => (
          <div
            key={planItem.id}
            onClick={() => { setSelectedPlan(planItem.id); updateForm({ planId: planItem.id }); }}
            className={`relative bg-white rounded-xl border-2 p-6 cursor-pointer transition-all
              ${planItem.color}
              ${selectedPlan === planItem.id ? 'ring-2 ring-primary-500 shadow-lg scale-[1.02]' : 'shadow-sm'}
            `}
          >
            {/* 推荐标签 */}
            {planItem.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                🔥 最受欢迎
              </div>
            )}

            <div className={`w-12 h-12 ${planItem.bgColor} rounded-xl flex items-center justify-center mb-4`}>
              <planItem.icon className={`w-6 h-6 ${planItem.textColor}`} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{planItem.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-gray-900">¥{planItem.price.toLocaleString()}</span>
              <span className="text-sm text-gray-500">/{planItem.period}</span>
            </div>

            <ul className="space-y-2 mb-4">
              {planItem.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={(e) => { e.stopPropagation(); setSelectedPlan(planItem.id); updateForm({ planId: planItem.id }); setShowOrderForm(true); }}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors
                ${selectedPlan === planItem.id
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {selectedPlan === planItem.id ? '已选择' : '选择此套餐'}
            </button>
          </div>
        ))}
      </div>

      {/* 下单按钮 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">已选套餐</div>
          <div className="text-lg font-bold text-gray-900">
            {plan?.name} — ¥{plan?.price.toLocaleString()}/{plan?.period}
          </div>
        </div>
        <button
          onClick={() => setShowOrderForm(true)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          立即下单
        </button>
      </div>

      {/* 订单表单弹层 */}
      {showOrderForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowOrderForm(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">下单信息</h3>
              <p className="text-sm text-gray-500 mt-1">填写信息后客服将与你联系确认</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司/品牌名称 *</label>
                <input type="text" value={form.companyName} onChange={e => updateForm({ companyName: e.target.value })}
                  placeholder="输入公司或品牌名称"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系人 *</label>
                  <input type="text" value={form.contactName} onChange={e => updateForm({ contactName: e.target.value })}
                    placeholder="姓名"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 *</label>
                  <input type="text" value={form.contactPhone} onChange={e => updateForm({ contactPhone: e.target.value })}
                    placeholder="手机号"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
                <input type="email" value={form.contactEmail} onChange={e => updateForm({ contactEmail: e.target.value })}
                  placeholder="用于接收报告"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产品网址</label>
                <input type="url" value={form.productUrl} onChange={e => updateForm({ productUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">期望开始日期</label>
                <input type="date" value={form.startDate} onChange={e => updateForm({ startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">特殊需求</label>
                <textarea value={form.requirements} onChange={e => updateForm({ requirements: e.target.value })}
                  placeholder="请描述你的特殊需求和期望目标..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-between">
              <button onClick={() => setShowOrderForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                取消
              </button>
              <button onClick={handleSubmit} disabled={submitting || !form.companyName || !form.contactName || !form.contactPhone}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700
                  disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />提交中...</>
                ) : (
                  <><Send className="w-4 h-4" />提交订单</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 提交成功提示 */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-sm font-semibold text-green-800">订单提交成功！</div>
            <div className="text-xs text-green-600">客服将在24小时内与你联系确认，请保持手机畅通</div>
          </div>
        </div>
      )}

      {/* 历史订单 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          我的订单
        </h3>
        {MOCK_ORDERS.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 font-medium text-gray-500">订单编号</th>
                  <th className="pb-3 font-medium text-gray-500">套餐</th>
                  <th className="pb-3 font-medium text-gray-500">金额</th>
                  <th className="pb-3 font-medium text-gray-500">周期</th>
                  <th className="pb-3 font-medium text-gray-500">状态</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.map(order => (
                  <tr key={order.id} className="border-b border-gray-50">
                    <td className="py-3 text-gray-900 font-mono text-xs">{order.id}</td>
                    <td className="py-3 text-gray-700">{order.planName}</td>
                    <td className="py-3 text-gray-900 font-medium">¥{order.amount.toLocaleString()}</td>
                    <td className="py-3 text-gray-500 text-xs">{order.startDate} ~ {order.endDate}</td>
                    <td className="py-3">
                      {order.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />服务中
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <Clock className="w-3 h-3" />已结束
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无订单</p>
          </div>
        )}
      </div>
    </div>
  );
}
