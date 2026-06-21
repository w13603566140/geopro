'use client';

import { useState } from 'react';
import { Save, Coins, TrendingUp, Gift, Percent, Plus, Trash2, CheckCircle, RefreshCw } from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonusCredits: number;
  popular: boolean;
}

interface CreditRate {
  ratio: number;       // 1元=多少积分
  minRecharge: number; // 最低充值金额
  bonusRate: number;   // 赠送比例(0-1)
}

export default function CreditRatePage() {
  const [saved, setSaved] = useState<'packages' | 'rate' | ''>('');

  // 积分汇率
  const [rate, setRate] = useState<CreditRate>({
    ratio: 100,        // 1元 = 100积分
    minRecharge: 10,   // 最低充值10元
    bonusRate: 0.1,    // 赠送10%积分
  });

  // 积分套餐
  const [packages, setPackages] = useState<CreditPackage[]>([
    { id: '1', name: '体验包', credits: 100, price: 10, bonusCredits: 0, popular: false },
    { id: '2', name: '入门包', credits: 500, price: 45, bonusCredits: 50, popular: false },
    { id: '3', name: '标准包', credits: 2000, price: 160, bonusCredits: 300, popular: true },
    { id: '4', name: '专业包', credits: 5000, price: 375, bonusCredits: 1000, popular: false },
    { id: '5', name: '企业包', credits: 10000, price: 700, bonusCredits: 2500, popular: false },
  ]);

  const [newPackage, setNewPackage] = useState<Partial<CreditPackage>>({
    name: '', credits: 0, price: 0, bonusCredits: 0, popular: false,
  });
  const [showNewForm, setShowNewForm] = useState(false);

  const handleSave = (type: 'packages' | 'rate') => {
    setSaved(type);
    setTimeout(() => setSaved(''), 2000);
    localStorage.setItem('credit_packages', JSON.stringify(packages));
    localStorage.setItem('credit_rate', JSON.stringify(rate));
  };

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.credits || !newPackage.price) return;
    setPackages(prev => [...prev, {
      ...newPackage,
      id: Date.now().toString(),
      credits: newPackage.credits || 0,
      price: newPackage.price || 0,
      bonusCredits: newPackage.bonusCredits || 0,
      popular: newPackage.popular || false,
    } as CreditPackage]);
    setNewPackage({ name: '', credits: 0, price: 0, bonusCredits: 0, popular: false });
    setShowNewForm(false);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const togglePopular = (id: string) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, popular: !p.popular } : p));
  };

  return (
    <div className="space-y-6">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Percent className="w-5 h-5 text-amber-400" /> 积分比例设置
          </h2>
          <p className="text-slate-400 text-sm mt-1">配置积分汇率、套餐定价和赠送比例</p>
        </div>
      </div>

      {/* 积分汇率卡片 */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" /> 积分汇率设置
          </h3>
          <p className="text-slate-400 text-xs mt-1">设置人民币与积分兑换比例</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
              <label className="text-xs text-slate-400 mb-2 block">兑换比例</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">1 元 =</span>
                <input
                  type="number"
                  value={rate.ratio}
                  onChange={e => setRate(prev => ({ ...prev, ratio: parseInt(e.target.value) || 0 }))}
                  className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center text-lg font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-slate-400 text-sm">积分</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                建议: 100积分 = 1元（大多数平台标准）
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
              <label className="text-xs text-slate-400 mb-2 block">最低充值金额</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">最低</span>
                <input
                  type="number"
                  value={rate.minRecharge}
                  onChange={e => setRate(prev => ({ ...prev, minRecharge: parseInt(e.target.value) || 0 }))}
                  className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center text-lg font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-slate-400 text-sm">元</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                用户单次充值最低金额
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700">
              <label className="text-xs text-slate-400 mb-2 block">充值赠送比例</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">赠送</span>
                <input
                  type="number"
                  value={Math.round(rate.bonusRate * 100)}
                  onChange={e => setRate(prev => ({ ...prev, bonusRate: (parseInt(e.target.value) || 0) / 100 }))}
                  className="w-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-center text-lg font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-slate-400 text-sm">%</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                充值额外赠送积分百分比
              </div>
            </div>
          </div>

          {/* 汇率预览 */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">实时汇率预览</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-900/50 rounded-lg p-3 text-center border border-slate-700">
                <div className="text-slate-400 text-xs mb-1">充值 10 元</div>
                <div className="text-amber-400 font-bold text-lg">
                  {10 * rate.ratio + Math.round(10 * rate.ratio * rate.bonusRate)} 积分
                </div>
                <div className="text-green-400 text-xs mt-1">含赠送 {Math.round(10 * rate.ratio * rate.bonusRate)} 积分</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 text-center border border-slate-700">
                <div className="text-slate-400 text-xs mb-1">充值 100 元</div>
                <div className="text-amber-400 font-bold text-lg">
                  {100 * rate.ratio + Math.round(100 * rate.ratio * rate.bonusRate)} 积分
                </div>
                <div className="text-green-400 text-xs mt-1">含赠送 {Math.round(100 * rate.ratio * rate.bonusRate)} 积分</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 text-center border border-slate-700">
                <div className="text-slate-400 text-xs mb-1">充值 1000 元</div>
                <div className="text-amber-400 font-bold text-lg">
                  {1000 * rate.ratio + Math.round(1000 * rate.ratio * rate.bonusRate)} 积分
                </div>
                <div className="text-green-400 text-xs mt-1">含赠送 {Math.round(1000 * rate.ratio * rate.bonusRate)} 积分</div>
              </div>
            </div>
          </div>

          <button onClick={() => handleSave('rate')} className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-amber-600/20">
            {saved === 'rate' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved === 'rate' ? '已保存' : '保存汇率'}
          </button>
        </div>
      </div>

      {/* 套餐定价 */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" /> 积分套餐定价
            </h3>
            <p className="text-slate-400 text-xs mt-1">配置积分套餐价格、数量和赠送积分</p>
          </div>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" /> 新增套餐
          </button>
        </div>

        <div className="p-6">
          {/* 新增套餐表单 */}
          {showNewForm && (
            <div className="mb-6 p-5 bg-slate-900/50 border border-amber-500/20 rounded-xl grid grid-cols-2 md:grid-cols-5 gap-3">
              <input placeholder="套餐名称" value={newPackage.name} onChange={e => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
              <input type="number" placeholder="积分数量" value={newPackage.credits || ''} onChange={e => setNewPackage(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
              <input type="number" placeholder="价格(¥)" value={newPackage.price || ''} onChange={e => setNewPackage(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
              <input type="number" placeholder="赠送积分" value={newPackage.bonusCredits || ''} onChange={e => setNewPackage(prev => ({ ...prev, bonusCredits: parseInt(e.target.value) }))}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500" />
              <button onClick={handleAddPackage}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
                添加
              </button>
            </div>
          )}

          {/* 套餐列表 */}
          <div className="space-y-3">
            {packages.map(pkg => (
              <div key={pkg.id} className={`bg-slate-900/50 rounded-xl p-5 border transition-all ${pkg.popular ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-700 hover:border-slate-600'}`}>
                <div className="flex items-center gap-4">
                  {/* 热门标记 */}
                  <button
                    onClick={() => togglePopular(pkg.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${pkg.popular ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'bg-slate-700 text-slate-400'}`}
                    title={pkg.popular ? '取消热门' : '设为热门'}
                  >
                    🔥
                  </button>

                  {/* 名称 */}
                  <div className="w-32">
                    <input
                      value={pkg.name}
                      onChange={e => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, name: e.target.value } : p))}
                      className="w-full px-2 py-1.5 bg-transparent border-b border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* 积分 */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-xs">积分:</span>
                    <input
                      type="number"
                      value={pkg.credits}
                      onChange={e => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, credits: parseInt(e.target.value) || 0 } : p))}
                      className="w-20 px-2 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm text-center focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* 价格 */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-xs">价格:</span>
                    <div className="flex items-center">
                      <span className="text-slate-400 text-xs">¥</span>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={e => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, price: parseInt(e.target.value) || 0 } : p))}
                        className="w-20 px-2 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm text-center focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* 赠送 */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-xs">赠送:</span>
                    <input
                      type="number"
                      value={pkg.bonusCredits}
                      onChange={e => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, bonusCredits: parseInt(e.target.value) || 0 } : p))}
                      className="w-20 px-2 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm text-center focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* 单价展示 */}
                  <div className="ml-auto text-right">
                    <div className="text-xs text-slate-500">单价</div>
                    <div className="text-sm text-amber-400 font-mono">
                      ¥{(pkg.price / pkg.credits).toFixed(3)}/积分
                    </div>
                    {pkg.bonusCredits > 0 && (
                      <div className="text-xs text-green-400">
                        含赠 ¥{(pkg.price / (pkg.credits + pkg.bonusCredits)).toFixed(3)}/积分
                      </div>
                    )}
                  </div>

                  {/* 删除 */}
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => handleSave('packages')} className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-amber-600/20">
            {saved === 'packages' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved === 'packages' ? '已保存' : '保存套餐'}
          </button>
        </div>
      </div>
    </div>
  );
}
