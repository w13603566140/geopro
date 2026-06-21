'use client';

import { useState } from 'react';
import { Receipt, Plus, Save, CheckCircle, Edit3, Trash2, DollarSign } from 'lucide-react';

export default function PlansPage() {
  const [editing, setEditing] = useState<string | null>(null);
  const [saved, setSaved] = useState('');

  const [plans, setPlans] = useState([
    { id: 'free', name: '免费引流版', price: 0, period: '永久免费', maxSites: 1, maxQueries: 3, maxContent: 5, features: '单站点管理|基础GEO体检|手动llms.txt|每日3次查询', color: 'bg-gray-100' },
    { id: 'pro', name: '专业订阅版', price: 299, period: '元/月', maxSites: 20, maxQueries: 50, maxContent: 50, features: '20站点|全类型标签|全平台监测|竞品分析|PDF报表|每日50篇内容', color: 'bg-primary-50' },
    { id: 'enterprise', name: '企业年费版', price: 2999, period: '元/年', maxSites: 999, maxQueries: 999, maxContent: 999, features: '不限站点|多子账号|白标报表|开放API|私有化部署|OEM贴牌|代理分销', color: 'bg-purple-50' },
  ]);

  const handleSave = (id: string) => {
    setEditing(null);
    setSaved(id);
    setTimeout(() => setSaved(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary-600" /> 套餐方案管理
        </h2>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />新建套餐</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`card p-6 relative ${plan.color} border-2 ${
            plan.id === 'pro' ? 'ring-2 ring-primary-300' : 'border-gray-200'
          }`}>
            {plan.id === 'pro' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                主力套餐
              </div>
            )}

            {editing === plan.id ? (
              <div className="space-y-3">
                <input type="text" className="input-field font-bold" defaultValue={plan.name} />
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <input type="number" className="input-field" defaultValue={plan.price} />
                </div>
                <input type="text" className="input-field" defaultValue={plan.period} />
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs text-gray-500">站点数</label>
                    <input type="number" className="input-field" defaultValue={plan.maxSites} /></div>
                  <div><label className="text-xs text-gray-500">日查询</label>
                    <input type="number" className="input-field" defaultValue={plan.maxQueries} /></div>
                </div>
                <textarea className="input-field" rows={3} defaultValue={plan.features} />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(plan.id)} className="btn-primary text-xs flex-1">
                    {saved === plan.id ? <CheckCircle className="w-3.5 h-3.5 inline mr-1" /> : <Save className="w-3.5 h-3.5 inline mr-1" />}
                    {saved === plan.id ? '已保存' : '保存'}
                  </button>
                  <button onClick={() => setEditing(null)} className="btn-secondary text-xs">取消</button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold">¥{plan.price}</span>
                  <span className="text-sm text-gray-500">/{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-4 text-sm">
                  {plan.features.split('|').map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(plan.id)}
                    className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-1">
                    <Edit3 className="w-3.5 h-3.5" />编辑
                  </button>
                  <button className="py-2 px-3 text-sm border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 积分定价 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-600" /> 积分定价配置
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: '全站体检', credits: 10, icon: '🔍' },
            { name: '结构化标签', credits: 5, icon: '🏷️' },
            { name: 'AI排名查询', credits: 2, icon: '📊' },
            { name: '内容生成', credits: 5, icon: '📝' },
            { name: '竞品扫描', credits: 15, icon: '🕵️' },
            { name: '批量监测', credits: 20, icon: '📡' },
            { name: '报表导出', credits: 3, icon: '📄' },
            { name: 'MCP文件', credits: 5, icon: '🤖' },
          ].map(item => (
            <div key={item.name} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-700">{item.name}</div>
                  <input type="number" className="w-16 text-xs border border-gray-300 rounded px-1.5 py-0.5 mt-0.5" defaultValue={item.credits} />
                </div>
              </div>
              <span className="text-xs text-gray-400">积分/次</span>
            </div>
          ))}
        </div>
        <button className="btn-primary mt-4 text-sm">保存积分定价</button>
      </div>
    </div>
  );
}
