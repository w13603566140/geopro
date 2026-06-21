'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle, Crown, Zap, Star, Shield, ArrowRight } from 'lucide-react';
import { PlanTier, PLAN_CONFIGS } from '@/types';

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<PlanTier>(PlanTier.FREE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">套餐计费</h1>
        <p className="text-gray-500 mt-1">选择适合你业务规模的套餐方案</p>
      </div>

      {/* 当前套餐 */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">当前套餐</div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary-700">
                {PLAN_CONFIGS.find(p => p.tier === currentPlan)?.name}
              </span>
              <span className="badge-info text-xs">积分余额: 100</span>
            </div>
          </div>
          <button className="btn-primary">升级套餐</button>
        </div>
      </div>

      {/* 套餐对比 */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLAN_CONFIGS.map(plan => (
          <div key={plan.tier} className={`card p-6 relative ${
            plan.highlighted ? 'ring-2 ring-primary-500 shadow-lg scale-105' : ''
          }`}>
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                最受欢迎 · 主力现金流
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="text-3xl font-extrabold text-primary-600">
                ¥{plan.price}
                <span className="text-sm font-normal text-gray-500">/{plan.priceUnit}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{f}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
              plan.highlighted
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : plan.price === 0
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'border-2 border-primary-200 text-primary-700 hover:bg-primary-50'
            }`}>
              {plan.price === 0 ? '当前套餐' : plan.highlighted ? '立即订阅 →' : '升级至此套餐 →'}
            </button>
          </div>
        ))}
      </div>

      {/* 积分计费说明 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">积分消耗规则</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { name: '全站体检', credits: 10, icon: '🔍' },
            { name: '结构化标签生成', credits: 5, icon: '🏷️' },
            { name: 'AI排名查询', credits: 2, icon: '📊' },
            { name: '内容生成', credits: 5, icon: '📝' },
            { name: '竞品扫描', credits: 15, icon: '🕵️' },
            { name: '批量监测(10问句)', credits: 20, icon: '📡' },
            { name: '报表导出', credits: 3, icon: '📄' },
            { name: 'MCP文件生成', credits: 5, icon: '🤖' },
          ].map(item => (
            <div key={item.name} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-sm font-medium text-gray-700">{item.name}</div>
              <div className="text-xs text-primary-600 font-bold">{item.credits} 积分/次</div>
            </div>
          ))}
        </div>
      </div>

      {/* 企业版专属 */}
      <div className="card p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold">企业版专属服务</h2>
            </div>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>✓ 不限站点数量 · 多子账号团队协作</li>
              <li>✓ 白标无Logo报表 · 可交付代理客户</li>
              <li>✓ 开放 HTTP API · 对接自有系统</li>
              <li>✓ 私有化独立部署 · OEM贴牌授权</li>
              <li>✓ 专属技术支持 · 代理分销后台</li>
            </ul>
          </div>
          <button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2">
            咨询企业方案 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
