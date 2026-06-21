'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DEFAULT_PRIVACY = `## 引言
GEO优化助手Pro（以下简称"我们"）深知个人信息对您的重要性。我们严格遵守《中华人民共和国个人信息保护法》《中华人民共和国网络安全法》《中华人民共和国数据安全法》及相关法律法规。本隐私政策旨在向您说明我们如何收集、使用、存储、共享和保护您的个人信息。

## 一、我们收集的信息

### 1.1 您主动提供的信息
- 账号信息：姓名、电子邮箱、手机号码、公司名称、密码（加密存储）
- 业务信息：网站URL、品牌名称、行业关键词、竞品信息
- 支付信息：支付方式、账单地址（完整银行卡号由第三方支付平台处理）
- 沟通信息：您通过客服渠道与我们沟通时提供的信息

### 1.2 自动收集的信息
- 日志信息：IP地址、浏览器类型、操作系统、访问时间、访问页面
- 设备信息：设备型号、设备标识符、网络类型
- 使用数据：功能使用频率、操作行为、页面停留时间
- Cookie及类似技术：用于会话管理、偏好记忆和数据分析

### 1.3 第三方AI平台数据
当您使用AI可见度诊断服务时，我们会将品牌名称和行业关键词发送至第三方AI大模型平台（如DeepSeek、豆包、通义千问、Kimi等）进行查询。这些查询仅包含关键词信息，不包含任何个人身份信息。

## 二、我们如何使用信息
- 提供和维护服务：处理GEO诊断请求、生成优化报告、监测排名变化
- 身份验证与安全：验证用户身份、检测和防止欺诈或滥用行为
- 客户支持：响应您的咨询、投诉和技术支持请求
- 产品改进：分析使用趋势、优化AI模型效果、改进用户体验
- 个性化推荐：根据行业和使用习惯推荐合适的优化方案和模板
- 计费与结算：处理套餐订阅、积分消耗、模板购买等付费交易

## 三、信息的存储与保护
- 存储地点：中华人民共和国境内服务器，不会转移至境外
- 存储期限：账号注销后30天内删除或匿名化处理
- 安全措施：TLS/SSL加密传输、敏感数据bcrypt加密存储、访问控制、定期安全审计

## 四、信息的共享与披露
我们不会向第三方出售您的个人信息。仅在以下情况共享：
- 服务提供商（技术基础设施、支付处理、邮件发送等）
- AI大模型平台（诊断查询时仅传输品牌名称和行业关键词）
- 法律要求（法院命令、政府请求）
- 业务转移（合并、收购等）
- 经您明确同意的其他情况

## 五、您的权利
根据《个人信息保护法》，您享有查阅权、更正权、删除权、限制处理权、数据可携权、撤回同意权和注销账号权。您可通过"系统设置"页面自行管理，或通过下方联系方式提出请求，我们将在15个工作日内处理。

## 六、Cookie及类似技术
我们使用必要Cookie（会话管理）、偏好Cookie（语言/界面设置）和分析Cookie（使用情况分析）。您可通过浏览器设置管理Cookie，但禁用必要Cookie可能影响功能使用。

## 七、未成年人保护
本服务面向企业用户和专业人士，不面向未满18周岁的未成年人。我们不会故意收集未成年人信息。

## 八、AI生成内容说明
本服务核心功能依赖第三方AI大模型技术。AI生成内容可能存在不准确或不完整的情况。我们不控制AI平台如何使用查询关键词，建议同时参阅相关AI平台的隐私政策。

## 九、隐私政策的更新
我们可能会不时更新本隐私政策。重大变更将通过服务内通知、邮件通知或登录弹窗等方式告知。

## 十、联系我们
- 隐私保护邮箱：privacy@geo-optimizer.com
- 客服电话：400-XXX-XXXX（工作日 9:00-18:00）
- 公司地址：[公司注册地址]
- 个人信息保护负责人：[姓名]

我们将在收到请求后15个工作日内回复。如对处理结果不满意，您有权向监管机构投诉。

## 附录：第三方SDK及数据共享清单
| 第三方 | 用途 | 共享信息 |
|--------|------|---------|
| 支付宝 | 支付处理 | 订单金额、商品描述 |
| 微信支付 | 支付处理 | 订单金额、商品描述 |
| DeepSeek | AI诊断查询 | 品牌名称、行业关键词 |
| 通义千问 | AI诊断查询 | 品牌名称、行业关键词 |
| 豆包 | AI诊断查询 | 品牌名称、行业关键词 |
| Kimi | AI诊断查询 | 品牌名称、行业关键词 |`;

export default function PrivacyPage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('geo_legal_privacy');
    setContent(saved || DEFAULT_PRIVACY);
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
        if (line.startsWith('| ')) return `<p class="text-gray-600 mb-1 font-mono text-xs">${line}</p>`;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
          <p className="text-sm text-gray-500 mb-8">最后更新日期：2026年6月21日 · 版本：V2.0</p>
          <div className="prose prose-gray max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        </div>
        <div className="text-center mt-8 text-sm text-gray-400">
          <Link href="/terms" className="hover:text-gray-600 underline">服务条款</Link>
          <span className="mx-3">·</span>
          <Link href="/" className="hover:text-gray-600 underline">返回首页</Link>
        </div>
      </main>
    </div>
  );
}
