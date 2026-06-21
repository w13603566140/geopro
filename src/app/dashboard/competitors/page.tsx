'use client';

import { useState } from 'react';
import { Search, Target, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { scanCompetitor, CompetitorScanResult, generateCatchUpPlan } from '@/lib/competitor/analyzer';

export default function CompetitorsPage() {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorName, setCompetitorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompetitorScanResult | null>(null);

  const handleScan = async () => {
    if (!competitorUrl || !competitorName) return;
    setLoading(true);
    try {
      const res = await scanCompetitor(competitorUrl, competitorName);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">竞品GEO情报分析</h1>
        <p className="text-gray-500 mt-1">扫描竞品站点GEO策略，发现流量缺口，生成赶超方案</p>
      </div>

      {/* 输入面板 */}
      <div className="card p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">竞品名称 *</label>
            <input type="text" className="input-field" placeholder="如：OpenAI"
              value={competitorName} onChange={e => setCompetitorName(e.target.value)} />
          </div>
          <div>
            <label className="label">竞品网址 *</label>
            <input type="url" className="input-field" placeholder="https://competitor.com"
              value={competitorUrl} onChange={e => setCompetitorUrl(e.target.value)} />
          </div>
        </div>
        <button onClick={handleScan} className="btn-primary flex items-center gap-2"
          disabled={loading || !competitorUrl || !competitorName}>
          {loading ? '扫描中...' : <><Search className="w-4 h-4" /> 扫描竞品</>}
        </button>
      </div>

      {/* 扫描结果 */}
      {result && (
        <div className="space-y-6">
          {/* 概览 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card">
              <span className="stat-label">结构化标签</span>
              <span className="stat-value text-blue-600">{result.structuredDataSummary.totalCount}</span>
              <span className="text-xs text-gray-400">{result.structuredDataSummary.types.length} 种类型</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">高排名问句</span>
              <span className="stat-value text-green-600">{result.highRankQuestions.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">内容缺口</span>
              <span className="stat-value text-orange-600">{result.contentGaps.missingTypes.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">曝光趋势</span>
              <span className="stat-value text-purple-600">
                {result.exposureTrend.trend === 'rising' ? '📈' : result.exposureTrend.trend === 'declining' ? '📉' : '📊'}
              </span>
              <span className="text-xs text-gray-400">{result.exposureTrend.trend === 'rising' ? '上升' : '平稳'}</span>
            </div>
          </div>

          {/* llms.txt */}
          <div className="card p-6">
            <h2 className="font-semibold mb-3">竞品 llms.txt 内容</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-48">
              <code>{result.llmsTxtContent || '未找到 llms.txt 文件'}</code>
            </pre>
          </div>

          {/* 高排名问句 */}
          <div className="card p-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-red-500" /> 竞品高排名问句库
            </h2>
            <div className="space-y-2">
              {result.highRankQuestions.map((q, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-400 w-6">#{i + 1}</span>
                  <span className="text-sm text-gray-700 flex-1">{q}</span>
                  <span className="badge-warning text-xs">竞品占位</span>
                </div>
              ))}
            </div>
          </div>

          {/* 内容缺口 */}
          <div className="card p-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" /> 你的内容缺口
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">缺失的内容类型</h3>
                <ul className="space-y-1">
                  {result.contentGaps.missingTypes.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-red-600">
                      <span className="w-2 h-2 bg-red-400 rounded-full" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">缺失的话题</h3>
                <ul className="space-y-1">
                  {result.contentGaps.missingTopics.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-orange-600">
                      <span className="w-2 h-2 bg-orange-400 rounded-full" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 赶超方案 */}
          <div className="card p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" /> 赶超优化清单
            </h2>
            <div className="space-y-3">
              {result.catchUpPlan.map((action, i) => (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-lg ${
                  action.priority === 'high' ? 'bg-red-50 border border-red-200' :
                  action.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className={`mt-0.5 px-2 py-0.5 rounded text-xs font-bold ${
                    action.priority === 'high' ? 'bg-red-500 text-white' :
                    action.priority === 'medium' ? 'bg-yellow-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {action.priority === 'high' ? '高优' : action.priority === 'medium' ? '中优' : '低优'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{action.action}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      预期效果: {action.estimatedImpact} · 难度: {
                        action.difficulty === 'easy' ? '⭐ 简单' :
                        action.difficulty === 'medium' ? '⭐⭐ 中等' : '⭐⭐⭐ 较难'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
