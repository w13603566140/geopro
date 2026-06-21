'use client';

import { useState } from 'react';
import { 
  Search, Zap, TrendingUp, Target, FileText, 
  Copy, Download, RefreshCw, AlertCircle, CheckCircle,
  BarChart3, Globe, Tag
} from 'lucide-react';

interface TrafficKeyword {
  keyword: string;
  volume: number;
  difficulty: number;
  currentRank: number | null;
  competitorRank: number;
  opportunity: 'high' | 'medium' | 'low';
}

interface CompetitorAnalysis {
  url: string;
  domain: string;
  pageTitle?: string;
  metaDescription?: string;
  totalKeywords: number;
  totalTraffic: number;
  topKeywords: TrafficKeyword[];
  contentGaps: string[];
  headings?: { h1: string[]; h2: string[]; h3Count: number };
}

export default function TrafficClonePage() {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleAnalyze = async () => {
    if (!competitorUrl) {
      alert('请输入竞品网站URL');
      return;
    }

    setLoading(true);
    try {
      // 调用后端API分析竞品
      const response = await fetch('/api/traffic-clone/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: competitorUrl })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.data);
      } else {
        alert(data.error || '分析失败');
      }
    } catch (error) {
      console.error('分析失败:', error);
      alert('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    if (selectedKeywords.length === 0) {
      alert('请选择至少一个关键词');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/traffic-clone/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          competitorUrl,
          keywords: selectedKeywords 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.data.content);
      } else {
        alert(data.error || '生成失败');
      }
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请稍后重试');
    } finally {
      setGenerating(false);
    }
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getOpportunityText = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return '高机会';
      case 'medium': return '中等';
      case 'low': return '低机会';
      default: return '-';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Zap className="w-7 h-7 text-purple-600" />
          AI流量复刻
        </h1>
        <p className="text-gray-600">分析竞品流量关键词，生成对标内容，快速复制竞品流量</p>
      </div>

      {/* Cost Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <div className="text-sm text-purple-900">
          <span className="font-semibold">消耗说明：</span>
          每次分析消耗 25 积分，生成内容消耗 5 积分/关键词
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">分析竞品网站</h2>
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="输入竞品网站URL，例如：https://competitor.com"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !competitorUrl}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                开始分析
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Competitor Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm text-gray-600">竞品域名</div>
              </div>
              <div className="text-lg font-semibold text-gray-900 truncate">{analysis.domain}</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-sm text-gray-600">关键词数</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{analysis.totalKeywords.toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-sm text-gray-600">预估流量</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{analysis.totalTraffic.toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-sm text-gray-600">内容缺口</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{analysis.contentGaps.length}</div>
            </div>
          </div>

          {/* 页面信息卡片 */}
          {analysis.pageTitle && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> 竞品页面信息
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-400">页面标题</span>
                  <p className="text-sm text-gray-800 mt-0.5">{analysis.pageTitle}</p>
                </div>
                {analysis.metaDescription && (
                  <div>
                    <span className="text-xs text-gray-400">Meta 描述</span>
                    <p className="text-sm text-gray-600 mt-0.5">{analysis.metaDescription}</p>
                  </div>
                )}
                {analysis.headings && analysis.headings.h1.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-400">H1 标题 ({analysis.headings.h1.length}个)</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.headings.h1.map((h, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.headings && analysis.headings.h2.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-400">H2 副标题 ({analysis.headings.h2.length}个)</span>
                    <div className="flex flex-wrap gap-1 mt-1 max-h-20 overflow-y-auto">
                      {analysis.headings.h2.map((h, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 内容缺口 */}
          {analysis.contentGaps.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" /> 内容缺口与优化建议 ({analysis.contentGaps.length}条)
              </h3>
              <div className="space-y-2">
                {analysis.contentGaps.map((gap, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-orange-500 mt-0.5">⚠</span>
                    <span className="text-gray-700">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">高价值关键词</h2>
                  <p className="text-sm text-gray-600 mt-1">选择要生成对标内容的关键词</p>
                </div>
                <div className="text-sm text-gray-500">
                  已选择 <span className="font-semibold text-purple-600">{selectedKeywords.length}</span> 个
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedKeywords.length === analysis.topKeywords.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedKeywords(analysis.topKeywords.map(k => k.keyword));
                          } else {
                            setSelectedKeywords([]);
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      关键词
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      搜索量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      难度
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      竞品排名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      机会评级
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analysis.topKeywords.map((keyword, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedKeywords.includes(keyword.keyword)}
                          onChange={() => toggleKeyword(keyword.keyword)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{keyword.volume.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full"
                              style={{ width: `${keyword.difficulty}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{keyword.difficulty}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">#{keyword.competitorRank}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOpportunityColor(keyword.opportunity)}`}>
                          {getOpportunityText(keyword.opportunity)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Generate Content Button */}
          {selectedKeywords.length > 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-1">准备生成对标内容</h3>
                  <p className="text-purple-100">
                    已选择 {selectedKeywords.length} 个关键词，预计消耗 {selectedKeywords.length * 5} 积分
                  </p>
                </div>
                <button
                  onClick={handleGenerateContent}
                  disabled={generating}
                  className="px-8 py-3 bg-white text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      生成对标内容
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Generated Content */}
          {generatedContent && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  生成的对标内容
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                      alert('已复制到剪贴板');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    复制
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedContent], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `对标内容_${new Date().getTime()}.md`;
                      a.click();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    下载
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {generatedContent}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
