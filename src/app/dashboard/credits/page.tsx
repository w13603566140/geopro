'use client';

import { useState } from 'react';
import { Wallet, CreditCard, Gift, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function CreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('alipay');
  const [loading, setLoading] = useState(false);

  // 积分套餐
  const creditPackages = [
    {
      id: 1,
      name: '体验包',
      credits: 100,
      price: 10,
      originalPrice: 15,
      description: '适合个人体验',
      popular: false,
      bonus: null,
    },
    {
      id: 2,
      name: '入门包',
      credits: 500,
      price: 45,
      originalPrice: 75,
      description: '适合小型项目',
      popular: false,
      bonus: '赠50积分',
    },
    {
      id: 3,
      name: '标准包',
      credits: 2000,
      price: 160,
      originalPrice: 300,
      description: '最受欢迎',
      popular: true,
      bonus: '赠300积分',
    },
    {
      id: 4,
      name: '专业包',
      credits: 5000,
      price: 375,
      originalPrice: 750,
      description: '适合中型企业',
      popular: false,
      bonus: '赠1000积分',
    },
    {
      id: 5,
      name: '企业包',
      credits: 10000,
      price: 700,
      originalPrice: 1500,
      description: '大型企业首选',
      popular: false,
      bonus: '赠2500积分',
    },
  ];

  // 积分使用记录
  const usageHistory = [
    { id: 1, type: 'GEO诊断', credits: 10, date: '2026-06-21 10:30', site: 'example.com' },
    { id: 2, type: 'AI内容生成', credits: 5, date: '2026-06-21 09:15', site: 'example.com' },
    { id: 3, type: '竞品分析', credits: 8, date: '2026-06-20 16:45', site: 'competitor.com' },
    { id: 4, type: '排名监测', credits: 3, date: '2026-06-20 14:20', site: 'example.com' },
    { id: 5, type: '充值', credits: 500, date: '2026-06-19 11:00', site: '-' },
  ];

  const handleRecharge = async () => {
    if (selectedPackage === null) {
      alert('请选择积分套餐');
      return;
    }

    setLoading(true);
    try {
      // TODO: 调用后端API创建订单并跳转支付
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('正在跳转到支付页面...');
      // 实际应用中这里会跳转到支付宝/微信支付页面
    } catch (error) {
      alert('充值失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">积分中心</h1>
        <p className="text-gray-600">充值积分，使用更多高级功能</p>
      </div>

      {/* Current Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-100 text-sm mb-1">当前积分余额</p>
            <p className="text-5xl font-bold">286</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8" />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>本月消耗: 156 积分</span>
          </div>
          <div className="flex items-center gap-1">
            <Gift className="w-4 h-4" />
            <span>累计充值: 500 积分</span>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">选择积分套餐</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative bg-white rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedPackage === pkg.id
                  ? 'border-primary-500 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  最受欢迎
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{pkg.name}</h3>
                <p className="text-sm text-gray-500">{pkg.description}</p>
              </div>

              <div className="text-center mb-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-primary-600">{pkg.credits.toLocaleString()}</span>
                  <span className="text-gray-600">积分</span>
                </div>
                {pkg.bonus && (
                  <div className="mt-2 inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded">
                    🎁 {pkg.bonus}
                  </div>
                )}
              </div>

              <div className="text-center border-t pt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">¥{pkg.price}</span>
                  <span className="text-sm text-gray-500 line-through">¥{pkg.originalPrice}</span>
                </div>
                <div className="text-xs text-orange-600 font-medium">
                  省 ¥{pkg.originalPrice - pkg.price}
                </div>
              </div>

              {selectedPackage === pkg.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 text-primary-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      {selectedPackage !== null && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">选择支付方式</h3>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="alipay"
                checked={paymentMethod === 'alipay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className={`border-2 rounded-lg p-4 text-center transition-all ${
                paymentMethod === 'alipay' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="text-3xl mb-2">💙</div>
                <div className="font-medium text-gray-900">支付宝</div>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="wechat"
                checked={paymentMethod === 'wechat'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className={`border-2 rounded-lg p-4 text-center transition-all ${
                paymentMethod === 'wechat' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="text-3xl mb-2">💚</div>
                <div className="font-medium text-gray-900">微信支付</div>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className={`border-2 rounded-lg p-4 text-center transition-all ${
                paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="text-3xl mb-2">💳</div>
                <div className="font-medium text-gray-900">银行卡</div>
              </div>
            </label>
          </div>

          {/* Order Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">选择套餐:</span>
              <span className="font-medium text-gray-900">
                {creditPackages.find(p => p.id === selectedPackage)?.name}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">积分数量:</span>
              <span className="font-medium text-gray-900">
                {creditPackages.find(p => p.id === selectedPackage)?.credits.toLocaleString()} 积分
              </span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <span className="text-gray-600">应付金额:</span>
              <span className="text-2xl font-bold text-primary-600">
                ¥{creditPackages.find(p => p.id === selectedPackage)?.price}
              </span>
            </div>
            <button
              onClick={handleRecharge}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : '立即充值'}
            </button>
          </div>
        </div>
      )}

      {/* Usage History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">积分使用记录</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  积分变动
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用站点
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usageHistory.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {record.type === '充值' ? (
                        <Gift className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-primary-500" />
                      )}
                      <span className="text-sm font-medium text-gray-900">{record.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${
                      record.type === '充值' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.type === '充值' ? '+' : '-'}{record.credits}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.site}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credits Usage Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">积分使用说明</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• GEO诊断：消耗 10 积分/次</li>
              <li>• AI内容生成：消耗 5 积分/次</li>
              <li>• 竞品分析：消耗 8 积分/次</li>
              <li>• 排名监测：消耗 3 积分/次</li>
              <li>• 结构化标签生成：消耗 2 积分/次</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
