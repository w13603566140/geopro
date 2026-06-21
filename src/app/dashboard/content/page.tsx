'use client';

import { useState } from 'react';
import { FileText, Sparkles, Download, Copy, CheckCircle, Search, Filter } from 'lucide-react';
import { IntentType, ContentLanguage, GeneratedContentData } from '@/types';
import { generateGeoContent, mineHighValueQuestions } from '@/lib/ai/content-generator';

const CONTENT_TYPES = [
  { value: 'TUTORIAL', label: '分步教程', icon: '📖', desc: 'AI最爱引用的部署配置教程' },
  { value: 'REVIEW', label: '产品测评', icon: '⭐', desc: '深度评测文章，AI优先用于推荐' },
  { value: 'COMPARISON', label: '对比选型', icon: '⚖️', desc: '多产品维度对比，抢占选型流量' },
  { value: 'FAQ', label: 'FAQ问答库', icon: '❓', desc: '权重最高，AI直接摘抄回答用户' },
  { value: 'GUIDE', label: '行业选型指南', icon: '🧭', desc: '"XX行业用什么好"类问句专用' },
  { value: 'NEWS', label: '产品新闻稿', icon: '📰', desc: '新品发布/版本更新类公告文章' },
];

export default function ContentPage() {
  const [contentType, setContentType] = useState('TUTORIAL');
  const [title, setTitle] = useState('');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [industry, setIndustry] = useState('AI工具');
  const [language, setLanguage] = useState<ContentLanguage>(ContentLanguage.ZH_CN);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContentData | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = async () => {
    if (!title || !productName) return;
    setLoading(true);
    try {
      const result = await generateGeoContent({
        contentType,
        title,
        productName,
        productDescription: productDesc,
        targetKeywords: [productName, '推荐', '哪个好'],
        language,
        includeEeat: true,
      });
      setGenerated(result);
    } finally {
      setLoading(false);
    }
  };

  const handleMineQuestions = async () => {
    const results = await mineHighValueQuestions(industry);
    setQuestions(results.map(r => r.question));
  };

  const handleCopyContent = () => {
    if (generated) {
      navigator.clipboard.writeText(generated.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleExportMD = () => {
    if (!generated) return;
    const blob = new Blob([generated.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generated.title.replace(/[\/\\]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI内容生产</h1>
        <p className="text-gray-500 mt-1">挖掘高转化商业问句，生成AI优先推荐的结构化内容</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左侧：配置面板 */}
        <div className="space-y-4">
          {/* 内容类型 */}
          <div className="card p-4">
            <label className="label">选择内容类型</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map(ct => (
                <button key={ct.value}
                  onClick={() => setContentType(ct.value)}
                  className={`p-3 rounded-lg text-left text-sm transition-colors ${
                    contentType === ct.value
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}>
                  <span className="text-lg">{ct.icon}</span>
                  <div className="font-medium mt-1">{ct.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 内容配置 */}
          <div className="card p-4 space-y-3">
            <div>
              <label className="label">文章标题 *</label>
              <input type="text" className="input-field" placeholder="如：AI网关Pro完整部署教程"
                value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">产品名称 *</label>
              <input type="text" className="input-field" placeholder="你的产品名称"
                value={productName} onChange={e => setProductName(e.target.value)} />
            </div>
            <div>
              <label className="label">产品描述</label>
              <textarea className="input-field" rows={2} placeholder="简要描述产品功能与优势"
                value={productDesc} onChange={e => setProductDesc(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">目标行业</label>
                <select className="input-field" value={industry}
                  onChange={e => setIndustry(e.target.value)}>
                  <option value="AI工具">AI工具</option>
                  <option value="软件开发">软件开发</option>
                  <option value="云服务">云服务</option>
                  <option value="知识产权">知识产权</option>
                </select>
              </div>
              <div>
                <label className="label">语言</label>
                <select className="input-field" value={language}
                  onChange={e => setLanguage(e.target.value as ContentLanguage)}>
                  <option value="ZH_CN">简体中文</option>
                  <option value="EN_US">English</option>
                  <option value="BILINGUAL">中英双语</option>
                </select>
              </div>
            </div>
            <button onClick={handleGenerate} className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={loading || !title || !productName}>
              <Sparkles className="w-4 h-4" />
              {loading ? 'AI生成中...' : 'AI生成内容'}
            </button>
          </div>

          {/* 问句挖掘 */}
          <div className="card p-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary-600" /> 高转化问句挖掘
            </h3>
            <button onClick={handleMineQuestions} className="btn-secondary w-full text-sm">
              <Filter className="w-3.5 h-3.5 inline mr-1" /> 挖掘{industry}行业问句
            </button>
            {questions.length > 0 && (
              <div className="mt-3 max-h-48 overflow-y-auto space-y-1">
                {questions.slice(0, 10).map((q, i) => (
                  <div key={i} className="text-xs text-gray-600 p-2 bg-gray-50 rounded cursor-pointer hover:bg-primary-50"
                    onClick={() => setTitle(q.replace(/[？?]/g, ''))}>
                    {i + 1}. {q}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右侧：生成预览 */}
        <div>
          {generated ? (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{generated.title}</h2>
                <div className="flex gap-2">
                  <button onClick={handleCopyContent} className="btn-secondary text-xs flex items-center gap-1 !py-1.5 !px-3">
                    {copySuccess ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copySuccess ? '已复制' : '复制'}
                  </button>
                  <button onClick={handleExportMD} className="btn-primary text-xs flex items-center gap-1 !py-1.5 !px-3">
                    <Download className="w-3.5 h-3.5" /> 导出MD
                  </button>
                </div>
              </div>

              {/* 内容元信息 */}
              <div className="flex gap-3 mb-4 text-xs text-gray-500">
                <span className="badge-info">E-E-A-T评分: {generated.eeatScore}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {generated.wordCount} 字
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {generated.language === 'ZH_CN' ? '中文' : generated.language === 'EN_US' ? 'English' : '双语'}
                </span>
                {generated.isCompliant && (
                  <span className="badge-success">合规检测通过</span>
                )}
              </div>

              {/* 内容预览 */}
              <div className="prose prose-sm max-w-none max-h-[600px] overflow-y-auto bg-gray-50 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {generated.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center text-gray-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">AI生成内容将在此显示</p>
              <p className="text-sm mt-1">在左侧填写标题和产品名称后点击生成</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-left max-w-md mx-auto">
                {['高权重标题→摘要→教程→对比→FAQ结构', '自然品牌种草，非生硬广告',
                  '内置代码示例、客户案例', '合规过滤敏感表述'].map(tip => (
                  <div key={tip} className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
