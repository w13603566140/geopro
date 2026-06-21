'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, AlertTriangle, CheckCircle, AlertCircle, Info, Download, RefreshCw, FileCode, ChevronDown, ChevronUp } from 'lucide-react';
import { AuditReportData, AuditDefect, DefectSeverity } from '@/types';
import { runFullAudit } from '@/lib/geo/audit-engine';

export default function AuditPage() {
  const searchParams = useSearchParams();
  const [siteUrl, setSiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReportData | null>(null);
  const [error, setError] = useState('');
  const [expandedDefects, setExpandedDefects] = useState<Set<string>>(new Set());

  const preselectedSiteId = searchParams.get('siteId');

  const runAudit = async () => {
    if (!siteUrl) return;
    setLoading(true);
    setError('');
    try {
      // 演示模式：使用本地引擎模拟爬取
      await new Promise(r => setTimeout(r, 1500));
      const baseUrl = siteUrl.replace(/\/$/, '');
      const pages = [
        { url: baseUrl, title: '首页', content: '产品官网首页内容...', statusCode: 200, headers: {}, hasCanonical: true, hasJsonLd: true, hasFaq: false, hasTutorial: false, hasComparison: false, hasCodeExamples: false, loadTime: 800 },
        { url: `${baseUrl}/products`, title: '产品中心', content: '产品介绍...', statusCode: 200, headers: {}, hasCanonical: true, hasJsonLd: true, hasFaq: false, hasTutorial: false, hasComparison: true, hasCodeExamples: false, loadTime: 1200 },
        { url: `${baseUrl}/docs`, title: '文档中心', content: '技术文档...', statusCode: 200, headers: {}, hasCanonical: false, hasJsonLd: false, hasFaq: false, hasTutorial: true, hasComparison: false, hasCodeExamples: true, loadTime: 900 },
        { url: `${baseUrl}/docs/getting-started`, title: '快速开始', content: '快速上手指南...', statusCode: 200, headers: {}, hasCanonical: true, hasJsonLd: false, hasFaq: false, hasTutorial: true, hasComparison: false, hasCodeExamples: true, loadTime: 1500 },
        { url: `${baseUrl}/faq`, title: '常见问题', content: 'FAQ内容...', statusCode: 200, headers: {}, hasCanonical: true, hasJsonLd: false, hasFaq: true, hasTutorial: false, hasComparison: false, hasCodeExamples: false, loadTime: 600 },
        { url: `${baseUrl}/pricing`, title: '定价方案', content: '价格对比...', statusCode: 200, headers: {}, hasCanonical: true, hasJsonLd: false, hasFaq: false, hasTutorial: false, hasComparison: true, hasCodeExamples: false, loadTime: 1100 },
        { url: `${baseUrl}/blog`, title: '技术博客', content: '博客文章...', statusCode: 200, headers: {}, hasCanonical: true, hasJsonLd: false, hasFaq: false, hasTutorial: false, hasComparison: false, hasCodeExamples: false, loadTime: 700 },
        { url: `${baseUrl}/about`, title: '关于我们', content: '品牌介绍...', statusCode: 200, headers: {}, hasCanonical: true, hasJsonLd: false, hasFaq: false, hasTutorial: false, hasComparison: false, hasCodeExamples: false, loadTime: 500 },
      ];
      const result = await runFullAudit(siteUrl, pages);
      setReport(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getSeverityIcon = (severity: DefectSeverity) => {
    switch (severity) {
      case DefectSeverity.CRITICAL: return <AlertCircle className="w-5 h-5 text-red-500" />;
      case DefectSeverity.HIGH: return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case DefectSeverity.MEDIUM: return <Info className="w-5 h-5 text-yellow-500" />;
      case DefectSeverity.LOW: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityLabel = (severity: DefectSeverity) => {
    const labels = { CRITICAL: '严重', HIGH: '高', MEDIUM: '中', LOW: '低' };
    const colors = { CRITICAL: 'badge-danger', HIGH: 'badge-warning', MEDIUM: 'badge-info', LOW: 'bg-gray-100 text-gray-600' };
    return <span className={colors[severity]}>{labels[severity]}</span>;
  };

  const toggleDefect = (type: string) => {
    const newSet = new Set(expandedDefects);
    if (newSet.has(type)) newSet.delete(type);
    else newSet.add(type);
    setExpandedDefects(newSet);
  };

  // 默认示例URL
  useEffect(() => {
    if (!siteUrl && !preselectedSiteId) {
      setSiteUrl('https://example.com');
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">GEO体检诊断</h1>
        <p className="text-gray-500 mt-1">智能扫描12大AI收录扣分缺陷，输出全面优化报告</p>
      </div>

      {/* 输入URL */}
      <div className="card p-6">
        <label className="label">输入站点URL进行体检</label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              className="input-field !pl-10"
              placeholder="https://your-site.com"
              value={siteUrl}
              onChange={e => setSiteUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runAudit()}
            />
          </div>
          <button onClick={runAudit} className="btn-primary flex items-center gap-2" disabled={loading || !siteUrl}>
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> 扫描中...</>
            ) : (
              <><Search className="w-4 h-4" /> 开始体检</>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          扫描范围：llms.txt、JSON-LD、robots.txt、FAQ、教程、测评、代码示例等12项指标
        </p>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">{error}</div>
      )}

      {/* 体检报告 */}
      {report && (
        <div className="space-y-6">
          {/* 总分卡片 */}
          <div className={`card p-8 border-2 ${getScoreBg(report.totalScore)} text-center`}>
            <div className={`text-6xl font-extrabold mb-2 ${getScoreColor(report.totalScore)}`}>
              {report.totalScore}
            </div>
            <div className="text-gray-600 font-medium">GEO优化总分 / 100</div>
            <div className="text-sm text-gray-400 mt-1">
              扫描 {report.scannedPages} 个页面 · 发现 {report.totalIssues} 个优化项
            </div>
          </div>

          {/* 各维度得分 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: '索引完整度', score: report.indexScore, icon: '📑' },
              { label: '结构化标签', score: report.structureScore, icon: '🏷️' },
              { label: '内容质量', score: report.contentScore, icon: '📝' },
              { label: '权威度', score: report.authorityScore, icon: '⭐' },
              { label: '技术健康', score: report.technicalScore, icon: '⚙️' },
            ].map(dim => (
              <div key={dim.label} className="card p-4 text-center">
                <div className="text-2xl mb-1">{dim.icon}</div>
                <div className={`text-xl font-bold ${getScoreColor(dim.score)}`}>{dim.score}</div>
                <div className="text-xs text-gray-500">{dim.label}</div>
              </div>
            ))}
          </div>

          {/* 缺陷列表 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">优化缺陷清单</h2>
            <div className="space-y-3">
              {report.defects.map((defect, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleDefect(defect.defectType)}
                  >
                    {getSeverityIcon(defect.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{defect.title}</span>
                        {getSeverityLabel(defect.severity)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">扣 {defect.scoreDeduction} 分</div>
                    </div>
                    {expandedDefects.has(defect.defectType) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {expandedDefects.has(defect.defectType) && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
                      <p className="text-sm text-gray-600">{defect.description}</p>

                      {defect.affectedPages.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">受影响页面：</div>
                          <ul className="text-xs text-gray-600 space-y-0.5">
                            {defect.affectedPages.map((page, j) => (
                              <li key={j} className="font-mono">{page}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {defect.fixSnippet && (
                        <div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
                            <FileCode className="w-3.5 h-3.5" /> 修复代码片段
                          </div>
                          <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto max-h-48">
                            <code>{defect.fixSnippet}</code>
                          </pre>
                          <button
                            onClick={() => navigator.clipboard.writeText(defect.fixSnippet)}
                            className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                          >
                            复制代码
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 导出按钮 */}
          <div className="flex gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" /> 导出PDF报告
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" /> 导出缺陷清单CSV
            </button>
          </div>
        </div>
      )}

      {/* 空状态提示 */}
      {!report && !loading && (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">开始你的首次GEO体检</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            输入你的网站URL，我们将自动扫描12项AI收录关键指标，生成详细优化报告
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-left">
            {['检查llms.txt/robots.txt', '验证JSON-LD结构化标签', '评估E-E-A-T权威度',
              '检测FAQ和教程内容', '分析页面加载性能', '生成修复代码片段'].map(hint => (
              <div key={hint} className="flex items-start gap-2 text-xs text-gray-500">
                <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                {hint}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
