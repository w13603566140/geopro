'use client';

import { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle, RotateCcw, Eye, Edit3 } from 'lucide-react';

// 默认内容（兜底）
const DEFAULT_TERMS = `# 服务条款

## 一、接受条款
欢迎使用 GEO优化助手Pro（以下简称"本平台"）。通过访问或使用本平台的服务，即表示您同意接受本服务条款的约束。

## 二、服务说明
本平台提供生成式AI搜索引擎优化（GEO）相关服务，包括AI可见度诊断、结构化数据标签生成、AI内容生产、排名监测、竞品分析等。

## 三、账号注册与安全
您需注册账号方可使用全部功能。您对账号安全承担全部责任。

## 四、用户行为规范
您同意遵守所有适用的法律法规，不上传违法内容，不干扰服务运行。

## 五、知识产权
本平台及原始内容的知识产权归本平台所有。AI生成内容用户拥有使用权。

## 六、付费服务与退款
不同套餐功能和价格以购买时页面为准。退款政策详见条款原文。

## 七、免责声明
本服务按"现状"提供。AI分析结果不保证100%准确。

## 八、联系我们
如有疑问请联系：legal@geo-optimizer.com`;

const DEFAULT_PRIVACY = `# 隐私政策

## 引言
GEO优化助手Pro（以下简称"我们"）深知个人信息对您的重要性。我们严格遵守《中华人民共和国个人信息保护法》及相关法律法规。

## 一、我们收集的信息
### 1.1 您主动提供的信息
账号信息（姓名、邮箱、手机号）、业务信息（网站URL、品牌名称）、支付信息。

### 1.2 自动收集的信息
日志信息、设备信息、使用数据、Cookie及类似技术。

### 1.3 第三方AI平台数据
AI可见度诊断时会将品牌名称和关键词发送至第三方AI平台。

## 二、我们如何使用信息
提供和维护服务、身份验证与安全、客户支持、产品改进、计费与结算。

## 三、信息的存储与保护
数据存储于中华人民共和国境内服务器，采取TLS/SSL加密传输，敏感数据加密存储。

## 四、信息的共享与披露
我们不会向第三方出售您的个人信息。共享仅限于服务提供商、AI平台查询、法律要求等场景。

## 五、您的权利
查阅权、更正权、删除权、限制处理权、数据可携权、撤回同意权、注销账号权。

## 六、联系我们
隐私保护邮箱：privacy@geo-optimizer.com`;

export default function AdminLegalPage() {
  const [activeDoc, setActiveDoc] = useState<'terms' | 'privacy'>('terms');
  const [termsContent, setTermsContent] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');
  const [saved, setSaved] = useState('');
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  // 加载已保存的内容
  useEffect(() => {
    const savedTerms = localStorage.getItem('geo_legal_terms');
    const savedPrivacy = localStorage.getItem('geo_legal_privacy');
    setTermsContent(savedTerms || DEFAULT_TERMS);
    setPrivacyContent(savedPrivacy || DEFAULT_PRIVACY);
    setLoading(false);
  }, []);

  const handleSave = () => {
    if (activeDoc === 'terms') {
      localStorage.setItem('geo_legal_terms', termsContent);
    } else {
      localStorage.setItem('geo_legal_privacy', privacyContent);
    }
    setSaved(activeDoc);
    setTimeout(() => setSaved(''), 2000);
  };

  const handleReset = () => {
    if (activeDoc === 'terms') {
      setTermsContent(DEFAULT_TERMS);
    } else {
      setPrivacyContent(DEFAULT_PRIVACY);
    }
  };

  const currentContent = activeDoc === 'terms' ? termsContent : privacyContent;
  const docTitle = activeDoc === 'terms' ? '服务条款' : '隐私政策';

  // 简易Markdown渲染
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map(line => {
        if (line.startsWith('## ')) return `<h2 class="text-lg font-semibold text-gray-800 mt-6 mb-3">${line.slice(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3 class="text-base font-medium text-gray-700 mt-4 mb-2">${line.slice(4)}</h3>`;
        if (line.startsWith('# ')) return `<h1 class="text-2xl font-bold text-gray-900 mb-4">${line.slice(2)}</h1>`;
        if (line.startsWith('- ')) return `<li class="ml-4 text-gray-600">${line.slice(2)}</li>`;
        if (line.trim() === '') return '<br/>';
        return `<p class="text-gray-600 mb-2">${line}</p>`;
      })
      .join('\n');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-slate-600 border-t-amber-500 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" /> 法律文档管理
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg text-sm hover:bg-slate-600 transition-colors"
          >
            {preview ? <><Edit3 className="w-4 h-4" />编辑</> : <><Eye className="w-4 h-4" />预览</>}
          </button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            {saved === activeDoc ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved === activeDoc ? '已保存' : '保存'}
          </button>
        </div>
      </div>

      {/* 文档切换 */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1.5 w-fit">
        {[
          { key: 'terms' as const, label: '📜 服务条款' },
          { key: 'privacy' as const, label: '🔒 隐私政策' },
        ].map(doc => (
          <button
            key={doc.key}
            onClick={() => { setActiveDoc(doc.key); setPreview(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeDoc === doc.key ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {doc.label}
          </button>
        ))}
      </div>

      {/* 编辑/预览区 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{docTitle}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{currentContent.length} 字符</span>
            <button onClick={handleReset} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />恢复默认
            </button>
          </div>
        </div>

        {preview ? (
          <div className="p-8 prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(currentContent) }} />
          </div>
        ) : (
          <textarea
            value={currentContent}
            onChange={e => activeDoc === 'terms' ? setTermsContent(e.target.value) : setPrivacyContent(e.target.value)}
            className="w-full min-h-[500px] p-6 text-sm font-mono text-gray-700 border-0 outline-none resize-y focus:ring-0"
            placeholder="输入Markdown格式的法律文档内容..."
          />
        )}
      </div>

      {/* 发布状态提示 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <FileText className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-amber-800">文档管理说明</div>
          <ul className="text-xs text-amber-600 mt-1 space-y-1">
            <li>• 支持Markdown格式编辑，保存后自动发布到前台页面</li>
            <li>• 用户注册和登录时默认勾选"同意服务条款和隐私政策"</li>
            <li>• 修改后立即生效，无需重启服务</li>
            <li>• 点击"恢复默认"可还原为系统初始版本</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
