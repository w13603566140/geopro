'use client';

import { useState } from 'react';
import { Settings, User, Bell, Shield, Globe, Key, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { key: 'profile', label: '个人资料', icon: User },
    { key: 'notification', label: '通知告警', icon: Bell },
    { key: 'security', label: '安全设置', icon: Shield },
    { key: 'api', label: 'API密钥', icon: Key },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-500 mt-1">管理账号、通知和API配置</p>
      </div>

      <div className="flex gap-6">
        {/* 侧边标签 */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {tabs.map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-lg mb-4">个人资料</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">姓名</label>
                  <input type="text" className="input-field" defaultValue="用户名称" />
                </div>
                <div>
                  <label className="label">邮箱</label>
                  <input type="email" className="input-field" defaultValue="user@example.com" disabled />
                </div>
                <div>
                  <label className="label">手机号</label>
                  <input type="tel" className="input-field" placeholder="选填" />
                </div>
                <div>
                  <label className="label">公司/团队</label>
                  <input type="text" className="input-field" placeholder="公司名称" />
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                {saved ? '已保存 ✓' : <><Save className="w-4 h-4" /> 保存修改</>}
              </button>
            </div>
          )}

          {activeTab === 'notification' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-lg mb-4">通知告警设置</h2>
              <div className="space-y-3">
                {[
                  { label: '排名下跌告警', desc: '当品牌在AI回答中排名下降时发送通知' },
                  { label: '竞品抢占首位告警', desc: '当竞品抢占你的关键词首位时通知' },
                  { label: '负面提及告警', desc: '当AI回答中出现品牌负面信息时通知' },
                  { label: '体检分数下跌告警', desc: '当站点GEO评分下降超过10分时通知' },
                  { label: '周度数据报告', desc: '每周自动发送优化数据汇总报告' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <label className="label">通知方式</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked /> 邮箱通知
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" /> 企业微信通知
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-lg mb-4">安全设置</h2>
              <div className="space-y-3">
                <div>
                  <label className="label">修改密码</label>
                  <div className="space-y-2">
                    <input type="password" className="input-field" placeholder="当前密码" />
                    <input type="password" className="input-field" placeholder="新密码（至少8位）" />
                    <input type="password" className="input-field" placeholder="确认新密码" />
                  </div>
                </div>
                <button className="btn-primary">更新密码</button>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium text-red-600 mb-2">危险操作</h3>
                <p className="text-sm text-gray-500 mb-3">删除账号后将永久清除所有数据，无法恢复</p>
                <button className="btn-danger text-sm">删除账号</button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Key className="w-5 h-5" /> API密钥管理
              </h2>
              <p className="text-sm text-gray-500">
                使用API密钥可以对接自有系统，实现自动化GEO优化和数据拉取。
                企业版用户专属功能。
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <code>sk-geo-••••••••••••••••••••••••</code>
              </div>
              <div className="flex gap-3">
                <button className="btn-secondary text-sm">重新生成密钥</button>
                <button className="btn-secondary text-sm">查看API文档</button>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">API接口列表</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { method: 'POST', path: '/api/v1/audit', desc: '站点GEO体检诊断' },
                    { method: 'POST', path: '/api/v1/structured-data', desc: '结构化标签生成' },
                    { method: 'POST', path: '/api/v1/monitoring/check', desc: 'AI排名查询' },
                    { method: 'POST', path: '/api/v1/content/generate', desc: 'AI内容生成' },
                    { method: 'GET', path: '/api/v1/report/export', desc: '数据报表导出' },
                  ].map(api => (
                    <div key={api.path} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-bold">
                        {api.method}
                      </span>
                      <code className="text-xs text-gray-600">{api.path}</code>
                      <span className="text-xs text-gray-400">- {api.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
