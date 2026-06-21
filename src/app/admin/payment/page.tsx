'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle, Save, RotateCcw, AlertCircle, Wallet } from 'lucide-react';

export default function PaymentConfigPage() {
  const [saved, setSaved] = useState('');
  const [activePayment, setActivePayment] = useState('alipay');

  const handleSave = (key: string) => {
    setSaved(key);
    setTimeout(() => setSaved(''), 2000);
  };

  const payments = [
    { key: 'alipay', name: '支付宝', icon: '💙', color: 'border-blue-200' },
    { key: 'wechat', name: '微信支付', icon: '💚', color: 'border-green-200' },
    { key: 'epay', name: '易支付', icon: '🧡', color: 'border-orange-200' },
    { key: 'stripe', name: 'Stripe', icon: '💜', color: 'border-purple-200' },
    { key: 'bank', name: '银行转账', icon: '🏦', color: 'border-gray-300' },
  ];

  return (
    <div className="space-y-6">
      {/* 支付方式选择 */}
      <div className="flex items-center gap-3">
        {payments.map(p => (
          <button
            key={p.key}
            onClick={() => setActivePayment(p.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              activePayment === p.key
                ? `${p.color} bg-white shadow-sm`
                : 'border-transparent bg-white text-gray-500 hover:border-gray-200'
            }`}
          >
            <span className="text-lg">{p.icon}</span> {p.name}
          </button>
        ))}
      </div>

      {/* 支付宝配置 */}
      {activePayment === 'alipay' && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>💙</span> 支付宝支付配置
            </h2>
            <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" />已启用</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">应用ID (App ID)</label>
              <input type="text" className="input-field font-mono" defaultValue="2021••••••••••••" />
              <p className="text-xs text-gray-400 mt-1">支付宝开放平台应用ID</p>
            </div>
            <div>
              <label className="label">商户PID</label>
              <input type="text" className="input-field font-mono" defaultValue="2088••••••••••••" />
            </div>
            <div className="md:col-span-2">
              <label className="label">应用私钥 (RSA2)</label>
              <textarea className="input-field font-mono text-xs" rows={4}
                defaultValue="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA••••••••••••••••••••••••••••
-----END RSA PRIVATE KEY-----" />
            </div>
            <div className="md:col-span-2">
              <label className="label">支付宝公钥</label>
              <textarea className="input-field font-mono text-xs" rows={4}
                defaultValue="-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A•••••••••
-----END PUBLIC KEY-----" />
            </div>
            <div>
              <label className="label">支付回调地址</label>
              <input type="url" className="input-field font-mono text-xs"
                defaultValue="https://api.geo-optimizer.com/api/payment/alipay/callback" />
            </div>
            <div>
              <label className="label">签名方式</label>
              <select className="input-field" defaultValue="RSA2">
                <option value="RSA2">RSA2</option>
                <option value="RSA">RSA</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('alipay')} className="btn-primary flex items-center gap-2">
              {saved === 'alipay' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'alipay' ? '已保存' : '保存配置'}
            </button>
            <button className="btn-secondary">测试支付</button>
          </div>
        </div>
      )}

      {/* 微信支付配置 */}
      {activePayment === 'wechat' && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>💚</span> 微信支付配置
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">商户号 (Mch ID)</label>
              <input type="text" className="input-field font-mono" defaultValue="16••••••••" />
            </div>
            <div>
              <label className="label">App ID</label>
              <input type="text" className="input-field font-mono" defaultValue="wx••••••••••••••••" />
            </div>
            <div>
              <label className="label">API v3密钥</label>
              <input type="password" className="input-field font-mono" defaultValue="••••••••••••••••••••••••••••••••" />
            </div>
            <div>
              <label className="label">支付回调地址</label>
              <input type="url" className="input-field font-mono text-xs"
                defaultValue="https://api.geo-optimizer.com/api/payment/wechat/callback" />
            </div>
            <div className="md:col-span-2">
              <label className="label">商户API证书序列号</label>
              <input type="text" className="input-field font-mono text-xs" defaultValue="••••••••••••••••••••••••••••••••" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('wechat')} className="btn-primary flex items-center gap-2">
              {saved === 'wechat' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'wechat' ? '已保存' : '保存配置'}
            </button>
          </div>
        </div>
      )}

      {/* Stripe配置 */}
      {activePayment === 'stripe' && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>💜</span> Stripe (国际支付) 配置
            </h2>
            <span className="badge-info">海外用户专属</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Publishable Key</label>
              <input type="text" className="input-field font-mono" defaultValue="pk_live_••••••••••••••••••••" />
            </div>
            <div>
              <label className="label">Secret Key</label>
              <input type="password" className="input-field font-mono" defaultValue="sk_live_••••••••••••••••••••" />
            </div>
            <div>
              <label className="label">Webhook Secret</label>
              <input type="text" className="input-field font-mono" defaultValue="whsec_••••••••••••••••••••" />
            </div>
            <div>
              <label className="label">默认币种</label>
              <select className="input-field" defaultValue="USD">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('stripe')} className="btn-primary flex items-center gap-2">
              {saved === 'stripe' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'stripe' ? '已保存' : '保存配置'}
            </button>
          </div>
        </div>
      )}

      {/* 易支付配置 */}
      {activePayment === 'epay' && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>🧡</span> 易支付配置
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">易支付接口地址</label>
              <input type="url" className="input-field font-mono text-xs" defaultValue="https://pay.example.com/submit.php" />
              <p className="text-xs text-gray-400 mt-1">易支付网关提交地址，通常为 {`https://your-domain.com/submit.php`}</p>
            </div>
            <div>
              <label className="label">商户ID (PID)</label>
              <input type="text" className="input-field font-mono" defaultValue="1001" />
              <p className="text-xs text-gray-400 mt-1">易支付平台分配的唯一商户编号</p>
            </div>
            <div>
              <label className="label">商户密钥 (Key)</label>
              <input type="password" className="input-field font-mono" defaultValue="••••••••••••••••••••••••" />
              <p className="text-xs text-gray-400 mt-1">用于签名校验的通信密钥</p>
            </div>
            <div>
              <label className="label">支付回调地址</label>
              <input type="url" className="input-field font-mono text-xs" defaultValue="https://api.geo-optimizer.com/api/payment/epay/notify" />
              <p className="text-xs text-gray-400 mt-1">支付异步通知回调URL</p>
            </div>
            <div>
              <label className="label">同步跳转地址</label>
              <input type="url" className="input-field font-mono text-xs" defaultValue="https://app.geo-optimizer.com/payment/return" />
              <p className="text-xs text-gray-400 mt-1">支付完成后页面跳转地址</p>
            </div>
            <div>
              <label className="label">默认支付方式</label>
              <select className="input-field" defaultValue="alipay">
                <option value="alipay">支付宝</option>
                <option value="wxpay">微信支付</option>
                <option value="qqpay">QQ钱包</option>
                <option value="bank">网银支付</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <h3 className="font-medium text-sm text-gray-700">支付通道开关</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: '支付宝', key: 'alipay', checked: true },
                { label: '微信支付', key: 'wxpay', checked: true },
                { label: 'QQ钱包', key: 'qqpay', checked: false },
                { label: '银联支付', key: 'unionpay', checked: false },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">易支付对接说明</p>
              <ul className="space-y-0.5 text-blue-600">
                <li>• 签名算法：MD5，参数按 key 升序排列后拼接商户密钥</li>
                <li>• 支付流程：创建订单 → 跳转支付页 → 异步通知 → 验签 → 更新状态</li>
                <li>• 回调 IP 白名单建议在易支付后台配置</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('epay')} className="btn-primary flex items-center gap-2">
              {saved === 'epay' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'epay' ? '已保存' : '保存配置'}
            </button>
            <button className="btn-secondary text-sm">测试连接</button>
          </div>
        </div>
      )}

      {/* 银行转账 */}
      {activePayment === 'bank' && (
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>🏦</span> 银行转账配置
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">开户银行</label>
              <input type="text" className="input-field" defaultValue="中国工商银行" />
            </div>
            <div>
              <label className="label">开户支行</label>
              <input type="text" className="input-field" defaultValue="北京海淀支行" />
            </div>
            <div>
              <label className="label">公司名称</label>
              <input type="text" className="input-field" defaultValue="XX科技有限公司" />
            </div>
            <div>
              <label className="label">银行账号</label>
              <input type="text" className="input-field font-mono" defaultValue="6222•••••••••••••••" />
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">银行转账方式需要人工确认到账，建议同时开启支付宝或微信支付作为主要支付渠道。</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave('bank')} className="btn-primary flex items-center gap-2">
              {saved === 'bank' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'bank' ? '已保存' : '保存配置'}
            </button>
          </div>
        </div>
      )}

      {/* 支付汇总 */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: '本月收款', value: '¥86,420', change: '+18%' },
          { label: '交易笔数', value: '1,286', change: '+12%' },
          { label: '退款金额', value: '¥2,340', change: '-5%' },
          { label: '手续费', value: '¥518', change: '' },
        ].map(stat => (
          <div key={stat.label} className="card p-4">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
            {stat.change && <div className="text-xs text-green-600 mt-0.5">{stat.change} 较上月</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
