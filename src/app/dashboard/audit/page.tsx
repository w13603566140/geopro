'use client';

import { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Download, RefreshCw, ChevronDown, ChevronUp, Zap, Target } from 'lucide-react';
import { diagnosisApi } from '@/lib/api-client';

interface DiagnosisReport {
  id: string; brandName: string; industryWords: string[];
  siteUrl: string; platforms: string[];
  results: { modelKey: string; modelName: string; modelIcon: string; visible: boolean; rank: number | null; responseSnippet: string; confidence: number; topCompetitors: string[]; suggestions: string[]; }[];
  summary: { totalPlatforms: number; visiblePlatforms: number; firstPlacePlatforms: number; averageRank: number; visibilityRate: number; overallScore: number; };
  optimizationPlan: { urgentActions: any[]; shortTermActions: any[]; longTermActions: any[]; };
}

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
    } catch (err: any) { setError(err.message); }
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

      {report && (<ResultsBlock report={report} expandedSection={expandedSection} setExpandedSection={setExpandedSection} />)}

      {!report && !loading && (
        <div className="card p-12 text-center"><div className="text-6xl mb-4">🤖</div><h3 className="text-lg font-medium text-gray-700 mb-2">AI可见度诊断</h3><p className="text-gray-500">填写品牌和行业词，自动查询8大AI模型的品牌可见度</p></div>
      )}
    </div>
  );
}

function ResultsBlock({ report, expandedSection, setExpandedSection }: any) {
  return (
    <div className="space-y-6">
      <div className={"card p-8 border-2 text-center " + (report.summary.overallScore >= 70 ? 'bg-green-50 border-green-200' : report.summary.overallScore >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200')}>
        <div className={"text-6xl font-extrabold mb-2 " + (report.summary.overallScore >= 70 ? 'text-green-600' : report.summary.overallScore >= 40 ? 'text-yellow-600' : 'text-red-600')}>{report.summary.overallScore}</div>
        <div className="text-gray-600 font-medium">AI可见度综合评分 / 100</div>
        <div className="text-sm text-gray-400 mt-1">{report.summary.visiblePlatforms}/{report.summary.totalPlatforms} 平台可见 · {report.summary.firstPlacePlatforms} 个首位</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{label:'可见平台',value:`${report.summary.visiblePlatforms}/${report.summary.totalPlatforms}`,icon:'👁️',color:'text-blue-600'},{label:'首位占位',value:report.summary.firstPlacePlatforms,icon:'🥇',color:'text-amber-600'},{label:'可见率',value:`${report.summary.visibilityRate}%`,icon:'📊',color:'text-green-600'},{label:'平均排名',value:report.summary.averageRank||'-',icon:'📈',color:'text-purple-600'}].map(s=>(<div key={s.label} className="card p-4 text-center"><div className="text-2xl mb-1">{s.icon}</div><div className={`text-xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>))}
      </div>
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
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> 品牌优化方案</h2>
        {[{title:'紧急行动 (1-3天)',color:'red',items:report.optimizationPlan.urgentActions},{title:'短期计划 (1-2周)',color:'amber',items:report.optimizationPlan.shortTermActions},{title:'长期战略 (1-3个月)',color:'blue',items:report.optimizationPlan.longTermActions}].map((s:any)=>(<div key={s.title} className="mb-4 last:mb-0"><h3 className={`text-sm font-medium text-${s.color}-600 mb-3 flex items-center gap-2`}><AlertCircle className="w-4 h-4"/>{s.title}</h3><div className="space-y-2">{s.items.map((a:any,i:number)=>(<div key={i} className={`flex items-start gap-3 p-3 bg-${s.color}-50 border border-${s.color}-100 rounded-lg`}><span className={`text-xs px-2 py-0.5 rounded font-bold ${s.color==='red'?'bg-red-500 text-white':s.color==='amber'?'bg-amber-500 text-white':'bg-blue-500 text-white'}`}>{a.priority==='high'?'高优':a.priority==='medium'?'中优':'低优'}</span><div className="flex-1"><p className={`text-sm text-${s.color}-700`}>{a.action}</p><p className={`text-xs text-${s.color}-400 mt-1`}>预期: {a.estimatedImpact}</p></div></div>))}</div></div>))}
      </div>
      <div className="flex gap-3"><button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4"/>导出诊断报告PDF</button></div>
    </div>
  );
}
