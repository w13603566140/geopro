'use client';

import { useState } from 'react';
import { Search, BarChart3, TrendingUp, TrendingDown, Globe, ExternalLink, Zap, Shield, RefreshCw } from 'lucide-react';
import { AIEngine, MonitoringResultData, MonitoringDashboard } from '@/types';
import { AI_ENGINE_CONFIG } from '@/lib/monitoring';
import { checkRanking, generateDashboard } from '@/lib/monitoring/engine';

export default function MonitoringPage() {
  const [question, setQuestion] = useState('');
  const [selectedEngines, setSelectedEngines] = useState<AIEngine[]>([AIEngine.KIMI, AIEngine.DOUBAO, AIEngine.GPT_SEARCH]);
  const [brandName, setBrandName] = useState('我的产品');
  const [productName, setProductName] = useState('AI网关Pro');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MonitoringResultData[]>([]);
  const [dashboard, setDashboard] = useState<MonitoringDashboard | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<MonitoringResultData | null>(null);

  const handleCheck = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const queries = selectedEngines.map(engine => ({
        aiEngine: engine,
        question,
      }));
      // 模拟批量查询
      const newResults: MonitoringResultData[] = [];
      for (const q of queries) {
        const result = await checkRanking(q.aiEngine, q.question, brandName, productName);
        newResults.push(result);
      }
      setResults(newResults);
      setDashboard(generateDashboard(newResults));
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number | null) => {
    if (rank === 1) return <span className="badge-success">🥇 首位</span>;
    if (rank === 2) return <span className="badge-info">🥈 第2位</span>;
    if (rank && rank <= 5) return <span className="badge-warning">第{rank}位</span>;
    if (rank) return <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">第{rank}位</span>;
    return <span className="badge-danger">未展示</span>;
  };

  const getEngineIcon = (engine: AIEngine) => {
    const icons: Record<string, string> = {
      DOUBAO: '🫘', KIMI: '🌙', WENXIN: '📝', DEEPSEEK: '🔍',
      BYTEDANCE_AI: '📱', GPT_SEARCH: '🤖', GEMINI: '💎',
      PERPLEXITY: '🔮', CLAUDE_SEARCH: '🧠', MISTRAL: '💨',
    };
    return icons[engine] || '🔍';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI排名监测</h1>
        <p className="text-gray-500 mt-1">全平台AI搜索引擎排名追踪，直观展示品牌曝光效果</p>
      </div>

      {/* 查询面板 */}
      <div className="card p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">品牌名称</label>
            <input type="text" className="input-field" value={brandName}
              onChange={e => setBrandName(e.target.value)} />
          </div>
          <div>
            <label className="label">产品名称</label>
            <input type="text" className="input-field" value={productName}
              onChange={e => setProductName(e.target.value)} />
          </div>
        </div>
        <label className="label">输入业务问句进行监测</label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" className="input-field !pl-10" placeholder="如：国内多模型中转网关推荐"
              value={question} onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCheck()} />
          </div>
          <button onClick={handleCheck} className="btn-primary flex items-center gap-2" disabled={loading}>
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> 查询中</> : <><Search className="w-4 h-4" /> 查询排名</>}
          </button>
        </div>

        {/* AI引擎选择 */}
        <div className="mt-3">
          <label className="text-xs text-gray-500 mb-1 block">监测引擎（可多选）</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AI_ENGINE_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  const engine = key as AIEngine;
                  if (selectedEngines.includes(engine)) {
                    setSelectedEngines(selectedEngines.filter(e => e !== engine));
                  } else {
                    setSelectedEngines([...selectedEngines, engine]);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedEngines.includes(key as AIEngine)
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {getEngineIcon(key as AIEngine)} {config.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 数据看板 */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <span className="stat-label">监测问句数</span>
            <span className="stat-value">{dashboard.totalQueries}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">首位占位率</span>
            <span className="stat-value text-green-600">{dashboard.firstPlaceRate.toFixed(1)}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">品牌曝光次数</span>
            <span className="stat-value text-blue-600">{dashboard.brandMentions}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">竞品提及数</span>
            <span className="stat-value text-orange-600">{dashboard.topCompetitors.length}</span>
          </div>
        </div>
      )}

      {/* 排名结果 */}
      {results.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">排名结果</h2>
          <div className="space-y-3">
            {results.map((result, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">{getEngineIcon(result.aiEngine)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {AI_ENGINE_CONFIG[result.aiEngine]?.name}
                    </span>
                    {getRankBadge(result.rank)}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{result.responseSnippet}</p>
                  {result.referredPage && (
                    <button
                      onClick={() => setSelectedQuote(result)}
                      className="text-xs text-primary-600 flex items-center gap-1 mt-1 hover:underline cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" /> AI引用页面
                    </button>
                  )}
                </div>
                <div className="text-right text-xs text-gray-400">
                  <div>{new Date(result.checkedAt).toLocaleTimeString('zh-CN')}</div>
                  {result.competitors.length > 0 && (
                    <div className="mt-1">竞品: {result.competitors.join(', ')}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 竞品同框对比 */}
      {dashboard && dashboard.topCompetitors.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">竞品同框对比</h2>
          <div className="space-y-2">
            {dashboard.topCompetitors.map(comp => (
              <div key={comp.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{comp.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (comp.count / dashboard.totalQueries) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{comp.count}次</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 趋势图占位 */}
      {dashboard && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">7/30/90天排名趋势</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">趋势图表加载中（实际接入后显示完整图表）</p>
              <p className="text-xs mt-1">数据点: {dashboard.trendData.length} 个时间节点</p>
            </div>
          </div>
        </div>
      )}

      {/* AI引用详情弹窗 */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedQuote(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-2xl">{getEngineIcon(selectedQuote.aiEngine)}</span>
                {AI_ENGINE_CONFIG[selectedQuote.aiEngine]?.name} · AI引用详情
              </h3>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-gray-400 uppercase">查询问句</span>
                <p className="text-sm text-gray-800 mt-1">{selectedQuote.question}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase">品牌排名</span>
                <div className="mt-1">{getRankBadge(selectedQuote.rank)}</div>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase">AI 回答片段</span>
                <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedQuote.responseSnippet}</p>
                </div>
              </div>
              {selectedQuote.competitors.length > 0 && (
                <div>
                  <span className="text-xs text-gray-400 uppercase">同框竞品</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedQuote.competitors.map((c, i) => (
                      <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <span className="text-xs text-gray-400 uppercase">监测时间</span>
                <p className="text-sm text-gray-600 mt-1">{new Date(selectedQuote.checkedAt).toLocaleString('zh-CN')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
