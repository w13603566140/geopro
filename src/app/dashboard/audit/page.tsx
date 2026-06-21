'use client';

import { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Download, RefreshCw, ChevronDown, ChevronUp, Zap, Target } from 'lucide-react';
import { diagnosisApi } from '@/lib/api-client';
import type { DiagnosisReport, AIVisibilityResult, OptimizationAction } from '@/lib/types';

export default function AuditPage() {
  const [siteUrl, setSiteUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [industryWords, setIndustryWords] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DiagnosisReport | null>(null);
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState('');

  const aiPlatforms = [
    { key: 'deepseek', name: 'DeepSeek', icon: '🔍', checked: true },
    { key: 'doubao', name: '豆包', icon: '🫘', checked: true },
    { key: 'yuanbao', name: '元宝', icon: '💎', checked: true },
    { key: 'tongyi', name: '通义千问', icon: '☁️', checked: true },
    { key: 'wenxin', name: '文心一言', icon: '📝', checked: true },
    { key: 'kimi', name: 'Kimi', icon: '🌙', checked: true },
    { key: 'nano', name: '纳米AI', icon: '🤖', checked: false },
    { key: 'zhipu', name: '智谱清言', icon: '🧠', checked: false },
  ];
  const [platforms, setPlatforms] = useState(aiPlatforms);

  const runDiagnosis = async () => {
    if (!brandName || !industryWords) return;
    setLoading(true); setError('');
    try {
      const sel = platforms.filter(p => p.checked).map(p => p.key);
      const words = industryWords.split(/[,，]/).map(w => w.trim()).filter(Boolean);
      const res = await diagnosisApi.runDiagnosis(brandName, words, siteUrl, sel);
      if (res.success && res.data) setReport(res.data as DiagnosisReport);
    } catch (err) { setError(err instanceof Error ? err.message : '诊断失败'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">AI可见度诊断</h1><p className="text-gray-500 mt-1">查询8大AI模型中品牌的可见度与推荐排名</p></div>

      <div className="card p-6">
        <label className="label">诊断AI大模型平台</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {platforms.map(p => (
            <button key={p.key} onClick={() => setPlatforms(platforms.map(pl => pl.key === p.key ? {...pl, checked: !pl.checked} : pl))}
              className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all " +
                (p.checked ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-gray-50 border-gray-200 text-gray-400')}>
              <span>{p.icon}</span> {p.name}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div><label className="label">一、品牌名称 *</label><input type="text" className="input-field" placeholder="如: 小米科技, 小米" value={brandName} onChange={e => setBrandName(e.target.value)} /></div>
          <div><label className="label">二、行业词 *</label><input type="text" className="input-field" placeholder="如：智能家居，AI诊断软件" value={industryWords} onChange={e => setIndustryWords(e.target.value)} /></div>
        </div>
        <label className="label">三、站点URL（选填）</label>
        <div className="flex gap-3">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="url" className="input-field !pl-10" placeholder="https://your-site.com" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} /></div>
          <button onClick={runDiagnosis} className="btn-primary flex items-center gap-2" disabled={loading || !brandName}>
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> 诊断中...</> : <><Zap className="w-4 h-4" /> 创建诊断任务（10积分）</>}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">{error}</div>}

      {report && (<ResultsBlock report={report} expandedSection={expandedSection} setExpandedSection={setExpandedSection} brandName={brandName} siteUrl={siteUrl} />)}

      {!report && !loading && (
        <div className="card p-12 text-center"><div className="text-6xl mb-4">🤖</div><h3 className="text-lg font-medium text-gray-700 mb-2">AI可见度诊断</h3><p className="text-gray-500">填写品牌和行业词，自动查询8大AI模型的品牌可见度</p></div>
      )}
    </div>
  );
}

function ResultsBlock({ report, expandedSection, setExpandedSection }: {
  report: DiagnosisReport;
  expandedSection: string;
  setExpandedSection: (s: string) => void;
  brandName: string;
  siteUrl: string;
}) {
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState<Set<string>>(new Set());

  // Flatten all actions with unique IDs
  const allSections = [
    { title: '紧急行动 (1-3天)', color: 'red', items: report.optimizationPlan.urgentActions, prefix: 'urgent' },
    { title: '短期计划 (1-2周)', color: 'amber', items: report.optimizationPlan.shortTermActions, prefix: 'short' },
    { title: '长期战略 (1-3个月)', color: 'blue', items: report.optimizationPlan.longTermActions, prefix: 'long' },
  ];

  const allActions = allSections.flatMap(s => s.items.map((a: OptimizationAction, i: number) => ({
    ...a, id: `${s.prefix}-${i}`, sectionColor: s.color, sectionTitle: s.title
  })));

  const selectedCount = selectedActions.size;

  const toggleAction = (id: string) => {
    const next = new Set(selectedActions);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedActions(next);
  };

  const toggleAll = (sectionPrefix: string) => {
    const sectionIds = allActions.filter(a => a.id.startsWith(sectionPrefix)).map(a => a.id);
    const allSelected = sectionIds.every(id => selectedActions.has(id));
    const next = new Set(selectedActions);
    sectionIds.forEach(id => allSelected ? next.delete(id) : next.add(id));
    setSelectedActions(next);
  };

  const executeSelected = async () => {
    setExecuting(true);
    // 模拟执行优化
    await new Promise(r => setTimeout(r, 2000));
    const done = new Set(selectedActions);
    setExecuted(new Set([...executed, ...done]));
    setSelectedActions(new Set());
    setExecuting(false);
  };

  return (
    <div className="space-y-6">
      {/* 评分卡 */}
      <div className={"card p-8 border-2 text-center " + (report.summary.overallScore >= 70 ? 'bg-green-50 border-green-200' : report.summary.overallScore >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200')}>
        <div className={"text-6xl font-extrabold mb-2 " + (report.summary.overallScore >= 70 ? 'text-green-600' : report.summary.overallScore >= 40 ? 'text-yellow-600' : 'text-red-600')}>{report.summary.overallScore}</div>
        <div className="text-gray-600 font-medium">AI可见度综合评分 / 100</div>
        <div className="text-sm text-gray-400 mt-1">{report.summary.visiblePlatforms}/{report.summary.totalPlatforms} 平台可见 · {report.summary.firstPlacePlatforms} 个首位</div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{label:'可见平台',value:`${report.summary.visiblePlatforms}/${report.summary.totalPlatforms}`,icon:'👁️',color:'text-blue-600'},{label:'首位占位',value:report.summary.firstPlacePlatforms,icon:'🥇',color:'text-amber-600'},{label:'可见率',value:`${report.summary.visibilityRate}%`,icon:'📊',color:'text-green-600'},{label:'平均排名',value:report.summary.averageRank||'-',icon:'📈',color:'text-purple-600'}].map(s=>(<div key={s.label} className="card p-4 text-center"><div className="text-2xl mb-1">{s.icon}</div><div className={`text-xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>))}
      </div>

      {/* 模型详情 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary-600" /> AI模型可见度详情</h2>
        <div className="space-y-3">
          {report.results.map((r:any,i:number)=>(<div key={i} className={'border-2 rounded-xl overflow-hidden '+(r.visible?r.rank===1?'border-green-200 bg-green-50/30':'border-blue-100 bg-blue-50/20':'border-red-100 bg-red-50/20')}>
            <div className="flex items-center gap-4 p-4">
              <div className="text-2xl">{r.modelIcon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><span className="font-semibold text-sm">{r.modelName}</span>{r.visible?(r.rank===1?<span className="badge-success">🥇 首位</span>:r.rank===2?<span className="badge-info">🥈 第2位</span>:<span className="badge-warning">第{r.rank}位</span>):<span className="badge-danger">未收录</span>}<span className="text-xs text-gray-400">可信度{r.confidence}%</span></div>
                <p className="text-xs text-gray-600 line-clamp-2">{r.responseSnippet}</p>
                {r.topCompetitors.length>0&&<div className="flex items-center gap-1 mt-1"><span className="text-xs text-gray-400">竞品:</span>{r.topCompetitors.map((c:string,j:number)=><span key={j} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{c}</span>)}</div>}
              </div>
              <button onClick={()=>setExpandedSection(expandedSection===r.modelKey?'':r.modelKey)} className="text-gray-400">{expandedSection===r.modelKey?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}</button>
            </div>
            {expandedSection===r.modelKey&&(<div className="border-t p-4 bg-white space-y-2"><div className="text-xs font-medium text-gray-500">优化建议：</div>{r.suggestions.map((s:string,j:number)=>(<div key={j} className={'text-xs p-2 rounded-lg '+(s.startsWith('✅')?'bg-green-50 text-green-700':s.startsWith('⚠️')?'bg-yellow-50 text-yellow-700':s.startsWith('🔴')||s.startsWith('🚨')?'bg-red-50 text-red-700':'bg-blue-50 text-blue-700')}>{s}</div>))}</div>)}
          </div>))}
        </div>
      </div>

      {/* 可选择的优化方案 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> 品牌优化方案</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>已选 <b className="text-primary-600">{selectedCount}</b> / {allActions.length} 项</span>
          </div>
        </div>

        {allSections.map(section => {
          const sectionIds = allActions.filter(a => a.id.startsWith(section.prefix)).map(a => a.id);
          const sectionSelected = sectionIds.filter(id => selectedActions.has(id)).length;
          const sectionDone = sectionIds.filter(id => executed.has(id)).length;
          const sectionTotal = sectionIds.length;
          const allSelected = sectionIds.every(id => selectedActions.has(id));

          return (
            <div key={section.title} className="mb-6 last:mb-0">
              {/* 段落标题 + 全选 */}
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold text-${section.color}-600 flex items-center gap-2`}>
                  <AlertCircle className="w-4 h-4" />
                  {section.title}
                  {sectionDone > 0 && <span className="badge-success text-xs">{sectionDone} 已完成</span>}
                </h3>
                <button onClick={() => toggleAll(section.prefix)}
                  className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                    allSelected ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}>
                  {allSelected ? '✓ 取消全选' : '全选'}
                </button>
              </div>

              <div className="space-y-2">
                {section.items.map((a: OptimizationAction, i: number) => {
                  const id = `${section.prefix}-${i}`;
                  const isSelected = selectedActions.has(id);
                  const isDone = executed.has(id);
                  return (
                    <div key={i}
                      onClick={() => !isDone && toggleAction(id)}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isDone
                          ? 'bg-green-50 border-green-300 opacity-80 cursor-default'
                          : isSelected
                            ? `bg-${section.color}-100 border-${section.color}-400 shadow-sm`
                            : `bg-${section.color}-50 border-${section.color}-100 hover:shadow-sm`
                      }`}>
                      <div className="mt-0.5 flex-shrink-0">
                        {isDone ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                            section.color==='red'?'bg-red-500 text-white':section.color==='amber'?'bg-amber-500 text-white':'bg-blue-500 text-white'
                          }`}>{a.priority==='high'?'高优':a.priority==='medium'?'中优':'低优'}</span>
                          <span className={`text-sm font-medium ${isDone ? 'text-green-700' : `text-${section.color}-700`}`}>
                            {isDone && '✅ '}{a.action}
                          </span>
                        </div>
                        <p className={`text-xs ml-0 ${isDone ? 'text-green-500' : `text-${section.color}-400`}`}>
                          预期效果: {a.estimatedImpact} · 难度: {a.difficulty==='easy'?'⭐简单':a.difficulty==='medium'?'⭐⭐中等':'⭐⭐⭐较难'}
                          {a.targetPlatforms && <span className="ml-2">· 适用平台: {a.targetPlatforms.join(', ')}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 底部执行栏 */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedActions(new Set(allActions.map(a => a.id)))} className="text-sm text-gray-500 hover:text-primary-600">
              一键全选全部方案
            </button>
            <button onClick={() => setSelectedActions(new Set())} className="text-sm text-gray-400 hover:text-gray-600">
              清空选择
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4"/>导出方案</button>
            <button
              onClick={executeSelected}
              disabled={selectedCount === 0 || executing}
              className="btn-primary flex items-center gap-2"
            >
              {executing ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> 执行中...</>
              ) : (
                <><Zap className="w-4 h-4" /> 执行选中优化 ({selectedCount}项)
                {executed.size > 0 && <span className="text-xs opacity-75">· 已完成{executed.size}项</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3"><button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4"/>导出诊断报告PDF</button></div>
    </div>
  );
}
