'use client';

import { useState } from 'react';
import {
  Send, Globe, Key, Shield, AlertTriangle, Save, CheckCircle,
  Plus, Trash2, Settings, Clock, BarChart3, Eye, EyeOff,
  Sliders, Lock, Unlock,
} from 'lucide-react';

// 发布平台配置
interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  apiKey: string;
  apiSecret: string;
  dailyLimit: number;
  cooldownMinutes: number;
  needReview: boolean;
  supportedFormats: string[];
}

export default function AdminPublishPage() {
  const [saved, setSaved] = useState('');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // 平台配置
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([
    { id: 'wechat', name: '微信公众号', icon: '💬', enabled: true, apiKey: 'wx_appid_xxx', apiSecret: 'wx_secret_xxx', dailyLimit: 10, cooldownMinutes: 5, needReview: true, supportedFormats: ['markdown', 'html', 'rich-text'] },
    { id: 'zhihu', name: '知乎', icon: '📘', enabled: true, apiKey: 'zh_token_xxx', apiSecret: '', dailyLimit: 20, cooldownMinutes: 3, needReview: false, supportedFormats: ['markdown', 'rich-text'] },
    { id: 'csdn', name: 'CSDN', icon: '💻', enabled: true, apiKey: 'csdn_key_xxx', apiSecret: '', dailyLimit: 30, cooldownMinutes: 2, needReview: false, supportedFormats: ['markdown', 'html'] },
    { id: 'juejin', name: '掘金', icon: '⛏️', enabled: true, apiKey: 'jj_cookie_xxx', apiSecret: '', dailyLimit: 15, cooldownMinutes: 5, needReview: true, supportedFormats: ['markdown'] },
    { id: 'jianshu', name: '简书', icon: '📝', enabled: false, apiKey: '', apiSecret: '', dailyLimit: 10, cooldownMinutes: 5, needReview: false, supportedFormats: ['markdown', 'rich-text'] },
    { id: 'toutiao', name: '今日头条', icon: '📰', enabled: false, apiKey: '', apiSecret: '', dailyLimit: 5, cooldownMinutes: 10, needReview: true, supportedFormats: ['html', 'rich-text'] },
    { id: 'b2b', name: 'B2B平台矩阵', icon: '🏢', enabled: false, apiKey: '', apiSecret: '', dailyLimit: 20, cooldownMinutes: 5, needReview: false, supportedFormats: ['html', 'rich-text'] },
    { id: 'media', name: '自媒体矩阵', icon: '📡', enabled: false, apiKey: '', apiSecret: '', dailyLimit: 30, cooldownMinutes: 3, needReview: true, supportedFormats: ['markdown', 'html', 'rich-text'] },
  ]);

  // 套餐发布限制（商业化核心）
  const [planLimits, setPlanLimits] = useState([
    { planId: 'FREE', planName: '免费版', dailyPublish: 0, monthlyPublish: 0, platforms: ['wechat'], allowScheduled: false, allowBulk: false },
    { planId: 'PROFESSIONAL', planName: '专业版', dailyPublish: 10, monthlyPublish: 100, platforms: ['wechat', 'zhihu', 'csdn', 'juejin'], allowScheduled: true, allowBulk: false },
    { planId: 'ENTERPRISE', planName: '企业版', dailyPublish: 50, monthlyPublish: 999, platforms: ['wechat', 'zhihu', 'csdn', 'juejin', 'jianshu', 'toutiao', 'b2b', 'media'], allowScheduled: true, allowBulk: true },
  ]);

  // 发布队列模拟
  const [queueStats] = useState({
    pending: 12,
    processing: 3,
    completed: 1286,
    failed: 47,
  });

  const toggleSecret = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    setSaved('platforms');
    setTimeout(() => setSaved(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Send className="w-5 h-5 text-primary-600" /> 发布管理配置
        </h2>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved === 'platforms' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved === 'platforms' ? '已保存' : '保存全部配置'}
        </button>
      </div>

      {/* 发布队列概览 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '待处理', value: queueStats.pending, color: 'text-yellow-600 bg-yellow-50', icon: Clock },
          { label: '处理中', value: queueStats.processing, color: 'text-blue-600 bg-blue-50', icon: Sliders },
          { label: '已完成', value: queueStats.completed, color: 'text-green-600 bg-green-50', icon: CheckCircle },
          { label: '失败', value: queueStats.failed, color: 'text-red-600 bg-red-50', icon: AlertTriangle },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <stat.icon className={`w-5 h-5 ${stat.color.split(' ')[0]} mb-2`} />
            <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 平台API配置 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4" /> 平台接入配置
          </h3>
          <span className="text-xs text-gray-400">配置各平台API密钥和发布限制</span>
        </div>
        <div className="divide-y divide-gray-100">
          {platforms.map(platform => (
            <div key={platform.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* 启用开关 */}
                <button
                  onClick={() => {
                    setPlatforms(prev => prev.map(p =>
                      p.id === platform.id ? { ...p, enabled: !p.enabled } : p
                    ));
                  }}
                  className={`mt-1 w-10 h-6 rounded-full relative transition-colors ${
                    platform.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    platform.enabled ? 'left-5' : 'left-1'
                  }`} />
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{platform.icon}</span>
                    <span className="font-medium text-gray-900">{platform.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      platform.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {platform.enabled ? '已启用' : '已禁用'}
                    </span>
                  </div>

                  {platform.enabled && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                      <div>
                        <label className="text-xs text-gray-500">API Key</label>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type={showSecrets[platform.id] ? 'text' : 'password'}
                            value={platform.apiKey}
                            onChange={e => setPlatforms(prev => prev.map(p =>
                              p.id === platform.id ? { ...p, apiKey: e.target.value } : p
                            ))}
                            className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs font-mono focus:ring-1 focus:ring-primary-500 outline-none"
                          />
                          <button onClick={() => toggleSecret(platform.id)} className="p-1 hover:bg-gray-100 rounded">
                            {showSecrets[platform.id] ? <EyeOff className="w-3.5 h-3.5 text-gray-400" /> : <Eye className="w-3.5 h-3.5 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">日限额(篇)</label>
                        <input
                          type="number"
                          value={platform.dailyLimit}
                          onChange={e => setPlatforms(prev => prev.map(p =>
                            p.id === platform.id ? { ...p, dailyLimit: parseInt(e.target.value) || 0 } : p
                          ))}
                          className="w-full mt-0.5 px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">冷却时间(分钟)</label>
                        <input
                          type="number"
                          value={platform.cooldownMinutes}
                          onChange={e => setPlatforms(prev => prev.map(p =>
                            p.id === platform.id ? { ...p, cooldownMinutes: parseInt(e.target.value) || 1 } : p
                          ))}
                          className="w-full mt-0.5 px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">需人工审核</label>
                        <select
                          value={platform.needReview ? 'yes' : 'no'}
                          onChange={e => setPlatforms(prev => prev.map(p =>
                            p.id === platform.id ? { ...p, needReview: e.target.value === 'yes' } : p
                          ))}
                          className="w-full mt-0.5 px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-primary-500 outline-none"
                        >
                          <option value="no">否 - 直接发布</option>
                          <option value="yes">是 - 需审核</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 套餐发布权限 - 商业化核心 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-4 h-4" /> 套餐发布权限
          </h3>
          <p className="text-xs text-gray-400 mt-1">控制不同套餐的发布能力，驱动付费转化</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">套餐</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">日发布量</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">月发布量</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">可用平台</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">定时发布</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">批量发布</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {planLimits.map(plan => (
                <tr key={plan.planId} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      plan.planId === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                      plan.planId === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{plan.planName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" value={plan.dailyPublish}
                      onChange={e => setPlanLimits(prev => prev.map(p =>
                        p.planId === plan.planId ? { ...p, dailyPublish: parseInt(e.target.value) || 0 } : p
                      ))}
                      className="w-20 px-2 py-1 border border-gray-200 rounded text-xs" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" value={plan.monthlyPublish}
                      onChange={e => setPlanLimits(prev => prev.map(p =>
                        p.planId === plan.planId ? { ...p, monthlyPublish: parseInt(e.target.value) || 0 } : p
                      ))}
                      className="w-20 px-2 py-1 border border-gray-200 rounded text-xs" />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {plan.platforms.length} 个平台
                  </td>
                  <td className="px-4 py-3">
                    <span className={plan.allowScheduled ? 'text-green-600' : 'text-gray-400'}>
                      {plan.allowScheduled ? <CheckCircle className="w-4 h-4" /> : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={plan.allowBulk ? 'text-green-600' : 'text-gray-400'}>
                      {plan.allowBulk ? <CheckCircle className="w-4 h-4" /> : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-primary-600 hover:text-primary-700">编辑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 发布日志流 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> 近期发布日志
          </h3>
          <button className="text-xs text-primary-600 hover:text-primary-700">查看全部 →</button>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { user: '张科技有限公司', platform: '微信公众号', title: 'AI网关Pro v3.0发布公告', status: 'success', time: '2分钟前' },
            { user: '李开发工作室', platform: '知乎', title: '2026年企业级API网关选型指南', status: 'success', time: '15分钟前' },
            { user: '王创业团队', platform: 'CSDN', title: '微服务架构下的网关最佳实践', status: 'failed', error: 'API限流', time: '1小时前' },
            { user: '赵互联网公司', platform: '掘金', title: '从0到1搭建AI推荐优化体系', status: 'success', time: '2小时前' },
          ].map((log, i) => (
            <div key={i} className="px-6 py-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-gray-900 font-medium">{log.user}</span>
                <span className="text-gray-400">→</span>
                <span className="text-gray-600">{log.platform}</span>
                <span className="text-gray-500 truncate max-w-xs">{log.title}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {log.error && <span className="text-red-500">{log.error}</span>}
                <span className="text-gray-400">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
