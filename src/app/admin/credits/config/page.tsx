'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface CreditCost {
  key: string;
  label: string;
  credits: number;
  category: string;
  description: string;
}

export default function CreditConfigPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [creditCosts, setCreditCosts] = useState<CreditCost[]>([
    {
      key: 'geo_audit',
      label: 'GEO诊断',
      credits: 10,
      category: '优化功能',
      description: '全面检测网站AI搜索优化情况，生成详细报告'
    },
    {
      key: 'ai_content',
      label: 'AI内容生成',
      credits: 5,
      category: '内容生产',
      description: '使用AI生成高质量优化内容'
    },
    {
      key: 'competitor_analysis',
      label: '竞品分析',
      credits: 8,
      category: '数据分析',
      description: '分析竞品网站优化策略和关键词'
    },
    {
      key: 'rank_monitor',
      label: '排名监测',
      credits: 3,
      category: '数据监测',
      description: '监测关键词在AI搜索引擎中的排名'
    },
    {
      key: 'structured_data',
      label: '结构化标签生成',
      credits: 2,
      category: '优化功能',
      description: '自动生成结构化数据标签代码'
    },
    {
      key: 'batch_publish',
      label: '一键发布',
      credits: 15,
      category: '发布功能',
      description: '一键发布到多个平台'
    },
    {
      key: 'industry_template',
      label: '行业模板',
      credits: 20,
      category: '模板功能',
      description: '使用行业专属优化模板'
    },
    {
      key: 'traffic_clone',
      label: 'AI流量复刻',
      credits: 25,
      category: '高级功能',
      description: '抓取竞品流量词并生成对标内容'
    },
  ]);

  const [stats, setStats] = useState({
    totalConsumed: 0,
    todayConsumed: 0,
    averagePerUser: 0,
    topFeature: ''
  });

  useEffect(() => {
    fetchConfig();
    fetchStats();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/credits/costs');
      const data = await response.json();
      if (data.success && data.data) {
        setCreditCosts(data.data);
      }
    } catch (error) {
      console.error('获取积分配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/credits/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('获取积分统计失败:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/credits/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditCosts })
      });
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleCreditChange = (key: string, value: number) => {
    setCreditCosts(prev => 
      prev.map(item => 
        item.key === key ? { ...item, credits: Math.max(0, value) } : item
      )
    );
  };

  const handleReset = () => {
    if (confirm('确定要恢复默认配置吗？')) {
      setCreditCosts([
        { key: 'geo_audit', label: 'GEO诊断', credits: 10, category: '优化功能', description: '全面检测网站AI搜索优化情况，生成详细报告' },
        { key: 'ai_content', label: 'AI内容生成', credits: 5, category: '内容生产', description: '使用AI生成高质量优化内容' },
        { key: 'competitor_analysis', label: '竞品分析', credits: 8, category: '数据分析', description: '分析竞品网站优化策略和关键词' },
        { key: 'rank_monitor', label: '排名监测', credits: 3, category: '数据监测', description: '监测关键词在AI搜索引擎中的排名' },
        { key: 'structured_data', label: '结构化标签生成', credits: 2, category: '优化功能', description: '自动生成结构化数据标签代码' },
        { key: 'batch_publish', label: '一键发布', credits: 15, category: '发布功能', description: '一键发布到多个平台' },
        { key: 'industry_template', label: '行业模板', credits: 20, category: '模板功能', description: '使用行业专属优化模板' },
        { key: 'traffic_clone', label: 'AI流量复刻', credits: 25, category: '高级功能', description: '抓取竞品流量词并生成对标内容' },
      ]);
    }
  };

  const categories = [...new Set(creditCosts.map(item => item.category))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">积分消耗配置</h1>
          <p className="text-gray-600 mt-1">设置各功能的积分消耗数量</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            恢复默认
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                保存中...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存配置
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">总消耗积分</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalConsumed.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">今日消耗</div>
          <div className="text-3xl font-bold text-primary-600">{stats.todayConsumed.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">人均消耗</div>
          <div className="text-3xl font-bold text-green-600">{stats.averagePerUser.toFixed(1)}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">最热门功能</div>
          <div className="text-2xl font-bold text-purple-600">{stats.topFeature || '-'}</div>
        </div>
      </div>

      {/* Credit Config */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">功能积分配置</h2>
          <p className="text-sm text-gray-600 mt-1">设置每个功能消耗的积分数量</p>
        </div>

        <div className="p-6 space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary-600 rounded"></div>
                {category}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creditCosts
                  .filter(item => item.category === category)
                  .map(item => (
                    <div key={item.key} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={item.credits}
                            onChange={(e) => handleCreditChange(item.key, parseInt(e.target.value) || 0)}
                            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-right font-semibold text-primary-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <span className="text-sm text-gray-600">积分</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <AlertCircle className="w-3 h-3" />
                        <span>每次使用消耗 {item.credits} 积分</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <div className="font-semibold mb-2">配置说明</div>
            <ul className="space-y-1 text-blue-800">
              <li>• 积分消耗数量设置后立即生效，影响所有用户</li>
              <li>• 设置为 0 表示该功能免费使用</li>
              <li>• 建议根据功能复杂度和服务器成本合理定价</li>
              <li>• 高级功能（如AI流量复刻）可设置较高积分消耗</li>
              <li>• 修改配置后，已生成的内容不受影响</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
