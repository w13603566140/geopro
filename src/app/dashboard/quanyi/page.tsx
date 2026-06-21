'use client';

import { Crown, Shield, Zap, CheckCircle, Clock, Star } from 'lucide-react';

export default function QuanyiPage() {
  const currentPlan = '企业版';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">账号权益</h1>
        <p className="text-gray-500 mt-1">查看当前套餐权益与用量</p>
      </div>

      {/* 套餐信息卡片 */}
      <div className="card p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{currentPlan}</span>
                <span className="badge-success">使用中</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>有效期至 2027-12-31（剩余547天）</span>
              </div>
            </div>
          </div>
          <button className="btn-primary">续费/升级</button>
        </div>
      </div>

      {/* 权益列表 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-primary-600" /> AI诊断权益
          </h3>
          <div className="space-y-3">
            {[
              { label: 'AI可见度诊断', value: '不限次数', icon: '✅' },
              { label: '诊断AI平台数', value: '8个平台', icon: '🤖' },
              { label: '优化建议报告', value: '包含', icon: '📋' },
              { label: '品牌数量上限', value: '10个品牌', icon: '🏷️' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{item.icon} {item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-600" /> AI创作权益
          </h3>
          <div className="space-y-3">
            {[
              { label: 'AI文章写作', value: '100篇/月', icon: '📝' },
              { label: 'AI素材生成', value: '500次/月', icon: '🎨' },
              { label: 'AI流量复刻', value: '50次/月', icon: '📊' },
              { label: '文章字数上限', value: '5000字/篇', icon: '📏' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{item.icon} {item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-green-600" /> 发布权益
          </h3>
          <div className="space-y-3">
            {[
              { label: 'B2B平台发布', value: '200篇/月', icon: '🏢' },
              { label: '网站媒体发布', value: '100篇/月', icon: '🌐' },
              { label: '自媒体发布', value: '50篇/月', icon: '📱' },
              { label: 'SEO优化', value: '30个关键词', icon: '🔍' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{item.icon} {item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-purple-600" /> 专属服务
          </h3>
          <div className="space-y-3">
            {[
              { label: '专属客户经理', value: '1对1服务', icon: '👤' },
              { label: '技术支持', value: '7x24小时', icon: '🔧' },
              { label: 'API接口', value: '5000次/天', icon: '🔌' },
              { label: '数据导出', value: '不限次数', icon: '📥' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{item.icon} {item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
