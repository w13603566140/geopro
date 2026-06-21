'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DEFAULT_TERMS = `## 一、接受条款
欢迎使用 GEO优化助手Pro（以下简称"本平台"）。通过访问或使用本平台的服务，即表示您同意接受本服务条款的约束。

## 二、服务说明
本平台提供生成式AI搜索引擎优化（GEO）相关服务，包括AI可见度诊断、结构化数据标签生成、AI内容生产、排名监测、竞品分析、多平台内容发布等。

## 三、账号注册与安全
您需注册账号方可使用全部功能。您对维护账号和密码的机密性承担全部责任。

## 四、用户行为规范
您同意遵守所有适用的法律法规，不上传违法或不当内容，不干扰或破坏本服务，不进行逆向工程或大规模数据抓取。

## 五、知识产权
本平台及原始内容的知识产权归本平台所有。AI生成内容用户拥有使用权，可在自身业务范围内使用、修改和发布。未经书面许可不得复制或传播本平台内容。

## 六、付费服务与退款
本平台提供免费版、专业版和企业版多层级的付费套餐。月度订阅7天内可申请全额退款，年度订阅14天内可申请按比例退款。一次性购买服务交付后不支持退款。

## 七、免责声明
本服务按"现状"提供，不作任何明示或默示的保证。AI分析结果不保证100%准确。优化后不必然提升AI搜索引擎排名。本平台不对因使用或无法使用本服务而导致的任何损害承担责任。

## 八、责任限制
在法律允许的最大范围内，本平台对任何索赔的总责任金额不超过您过去12个月内支付的费用总额。不可抗力导致的服务中断本平台不承担责任。

## 九、第三方服务
本服务可能集成第三方AI大模型API和支付服务。本平台不对任何第三方服务的输出、内容或行为负责。

## 十、终止
本平台保留因违反条款而暂停或终止账号的权利。终止后将依法保留数据并提供合理期限的数据导出服务。

## 十一、管辖法律与争议解决
本条款受中华人民共和国法律管辖。争议首选友好协商，协商不成时提交本平台所在地有管辖权的人民法院诉讼解决。

## 十二、联系我们
如有任何疑问，请通过以下方式联系我们：
- 邮箱：legal@geo-optimizer.com
- 电话：400-XXX-XXXX（工作日 9:00-18:00）`;

export default function TermsPage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('geo_legal_terms');
    setContent(saved || DEFAULT_TERMS);
  }, []);

  const renderMarkdown = (text: string) => {
    if (!text) return '';
    return text
      .split('\n')
      .map(line => {
        if (line.startsWith('## ')) return `<h2 class="text-lg font-semibold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-100">${line.slice(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3 class="text-base font-medium text-gray-800 mt-4 mb-2">${line.slice(4)}</h3>`;
        if (line.startsWith('# ')) return `<h1 class="text-xl font-bold text-gray-900 mb-4">${line.slice(2)}</h1>`;
        if (line.startsWith('- ')) return `<li class="ml-4 mb-1 text-gray-600">${line.slice(2)}</li>`;
        if (line.trim() === '') return '<div class="h-2"></div>';
        return `<p class="text-gray-600 mb-2 leading-relaxed">${line}</p>`;
      })
      .join('\n');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-gray-900">GEO优化助手Pro</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← 返回首页</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">服务条款</h1>
          <p className="text-sm text-gray-500 mb-8">最后更新日期：2026年6月21日</p>
          <div className="prose prose-gray max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        </div>
        <div className="text-center mt-8 text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-gray-600 underline">隐私政策</Link>
          <span className="mx-3">·</span>
          <Link href="/" className="hover:text-gray-600 underline">返回首页</Link>
        </div>
      </main>
    </div>
  );
}
