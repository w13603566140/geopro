'use client';

import { useState } from 'react';
import { Save, RotateCcw, CheckCircle, Globe, Mail, Bell, Shield, Database, Lock } from 'lucide-react';

export default function SystemConfigPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState('');

  const sections = [
    { key: 'general', label: '基本设置', icon: Globe },
    { key: 'email', label: '邮件服务', icon: Mail },
    { key: 'notification', label: '通知配置', icon: Bell },
    { key: 'security', label: '安全策略', icon: Shield },
    { key: 'storage', label: '存储配置', icon: Database },
  ];

  const handleSave = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 配置区域选择 */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1.5 overflow-x-auto">
        {sections.map(section => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeSection === section.key
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* ===== 基本设置 ===== */}
      {activeSection === 'general' && (
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-600" /> 站点基本设置
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">系统名称</label>
              <input type="text" className="input-field" defaultValue="GEO优化助手Pro" />
            </div>
            <div>
              <label className="label">系统域名</label>
              <input type="text" className="input-field" defaultValue="geo-optimizer.com" />
            </div>
            <div>
              <label className="label">前端地址</label>
              <input type="url" className="input-field" defaultValue="https://app.geo-optimizer.com" />
            </div>
            <div>
              <label className="label">API地址</label>
              <input type="url" className="input-field" defaultValue="https://api.geo-optimizer.com" />
            </div>
            <div className="md:col-span-2">
              <label className="label">系统描述（SEO用）</label>
              <textarea className="input-field" rows={2} defaultValue="GEO优化助手Pro - 面向企业的一站式AI搜索引擎优化SaaS平台" />
            </div>
            <div>
              <label className="label">系统语言</label>
              <select className="input-field" defaultValue="zh-CN">
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
                <option value="ja-JP">日本語</option>
              </select>
            </div>
            <div>
              <label className="label">时区</label>
              <select className="input-field" defaultValue="Asia/Shanghai">
                <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                <option value="America/New_York">America/New_York (UTC-5)</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm text-gray-700 mb-3">注册与访问控制</h3>
            <div className="space-y-3">
              {[
                { label: '开放用户注册', desc: '允许新用户自行注册账号', key: 'openReg' },
                { label: '注册需邮箱验证', desc: '新用户注册后需验证邮箱才能使用', key: 'emailVerify' },
                { label: '注册需管理员审核', desc: '新用户注册后需管理员手动审核通过', key: 'adminApprove' },
                { label: '启用邀请码注册', desc: '用户注册需要输入有效的邀请码', key: 'inviteOnly' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-700">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={item.key === 'openReg'} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('general')} className="btn-primary flex items-center gap-2">
              {saved === 'general' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'general' ? '已保存' : '保存设置'}
            </button>
            <button className="btn-secondary flex items-center gap-2"><RotateCcw className="w-4 h-4" />恢复默认</button>
          </div>
        </div>
      )}

      {/* ===== 邮件服务 ===== */}
      {activeSection === 'email' && (
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary-600" /> 邮件服务配置
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">SMTP服务器</label>
              <input type="text" className="input-field" defaultValue="smtp.example.com" />
            </div>
            <div>
              <label className="label">SMTP端口</label>
              <input type="number" className="input-field" defaultValue={587} />
            </div>
            <div>
              <label className="label">发件邮箱</label>
              <input type="email" className="input-field" defaultValue="noreply@geo-optimizer.com" />
            </div>
            <div>
              <label className="label">发件名称</label>
              <input type="text" className="input-field" defaultValue="GEO优化助手Pro" />
            </div>
            <div>
              <label className="label">SMTP用户名</label>
              <input type="text" className="input-field" defaultValue="noreply@geo-optimizer.com" />
            </div>
            <div>
              <label className="label">SMTP密码</label>
              <input type="password" className="input-field" defaultValue="••••••••••••" />
            </div>
            <div>
              <label className="label">加密方式</label>
              <select className="input-field" defaultValue="TLS">
                <option value="TLS">STARTTLS</option>
                <option value="SSL">SSL/TLS</option>
                <option value="NONE">无加密</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm text-gray-700 mb-3">邮件模板测试</h3>
            <div className="flex gap-3">
              <input type="email" className="input-field flex-1" placeholder="输入测试邮箱地址" />
              <button className="btn-secondary">发送测试邮件</button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('email')} className="btn-primary flex items-center gap-2">
              {saved === 'email' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'email' ? '已保存' : '保存设置'}
            </button>
          </div>
        </div>
      )}

      {/* ===== 通知配置 ===== */}
      {activeSection === 'notification' && (
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-600" /> 通知与告警配置
          </h2>
          <div className="space-y-3">
            {[
              { label: '企业微信通知', desc: '通过企业微信机器人发送系统告警', key: 'wechat' },
              { label: '钉钉通知', desc: '通过钉钉Webhook发送通知', key: 'dingtalk' },
              { label: '飞书通知', desc: '通过飞书机器人发送告警', key: 'feishu' },
              { label: 'Slack通知', desc: '集成Slack工作区通知', key: 'slack' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  {item.key !== 'wechat' && <input type="text" className="input-field !w-48 text-xs" placeholder="Webhook URL" />}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('notification')} className="btn-primary flex items-center gap-2">
              {saved === 'notification' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'notification' ? '已保存' : '保存设置'}
            </button>
          </div>
        </div>
      )}

      {/* ===== 安全策略 ===== */}
      {activeSection === 'security' && (
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" /> 安全策略配置
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">JWT密钥</label>
              <input type="password" className="input-field" defaultValue="••••••••••••••••••••" />
            </div>
            <div>
              <label className="label">Token过期时间</label>
              <select className="input-field" defaultValue="30d">
                <option value="1d">1天</option>
                <option value="7d">7天</option>
                <option value="30d">30天</option>
                <option value="90d">90天</option>
              </select>
            </div>
            <div>
              <label className="label">API限流 (次/分钟)</label>
              <input type="number" className="input-field" defaultValue={60} />
            </div>
            <div>
              <label className="label">登录失败锁定次数</label>
              <input type="number" className="input-field" defaultValue={5} />
            </div>
            <div>
              <label className="label">会话超时 (分钟)</label>
              <input type="number" className="input-field" defaultValue={30} />
            </div>
            <div>
              <label className="label">密码最小长度</label>
              <input type="number" className="input-field" defaultValue={8} />
            </div>
          </div>
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-medium text-sm text-gray-700">安全功能开关</h3>
            {[
              { label: '双因素认证 (2FA)', desc: '用户登录需二次验证' },
              { label: 'IP白名单', desc: '仅允许指定IP访问管理后台' },
              { label: '异地登录检测', desc: '检测并告警异地登录行为' },
              { label: '强制HTTPS', desc: '所有请求强制使用HTTPS' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={item.label === '强制HTTPS'} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                </label>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('security')} className="btn-primary flex items-center gap-2">
              {saved === 'security' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'security' ? '已保存' : '保存设置'}
            </button>
          </div>
        </div>
      )}

      {/* ===== 存储配置 ===== */}
      {activeSection === 'storage' && (
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-600" /> 存储与备份配置
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">对象存储类型</label>
              <select className="input-field" defaultValue="aliyun">
                <option value="aliyun">阿里云OSS</option>
                <option value="aws">AWS S3</option>
                <option value="local">本地存储</option>
              </select>
            </div>
            <div>
              <label className="label">存储区域</label>
              <input type="text" className="input-field" defaultValue="oss-cn-hangzhou" />
            </div>
            <div>
              <label className="label">Access Key</label>
              <input type="text" className="input-field" defaultValue="••••••••••••••••" />
            </div>
            <div>
              <label className="label">Secret Key</label>
              <input type="password" className="input-field" defaultValue="••••••••••••••••" />
            </div>
            <div>
              <label className="label">Bucket名称</label>
              <input type="text" className="input-field" defaultValue="geo-optimizer-files" />
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <h3 className="font-medium text-sm text-gray-700">自动备份策略</h3>
            {[
              { label: '数据库每日备份', desc: '每天凌晨3点自动备份数据库', checked: true },
              { label: '文件每周全量备份', desc: '每周日全量备份上传文件', checked: true },
              { label: '备份保留30天', desc: '超过30天的备份自动清理', checked: false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                </label>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('storage')} className="btn-primary flex items-center gap-2">
              {saved === 'storage' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'storage' ? '已保存' : '保存设置'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
