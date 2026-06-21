/**
 * GEO体检诊断引擎 - 核心算法
 * 对站点进行12大AI收录扣分缺陷扫描，输出0-100分优化报告
 */
import { AuditDefect, AuditReportData, DefectType, DefectSeverity } from '@/types';

// 爬虫User-Agent定义
const AI_CRAWLERS = [
  'GPTBot', 'ChatGPT-User', 'Google-Extended', 'OAI-SearchBot',
  'Bytespider', 'Baiduspider', 'Baiduspider-render',
  'KimiBot', 'MoonshotBot', 'DeepSeekBot',
  'Claude-Web', 'anthropic-ai', 'PerplexityBot',
  'MistralAI', 'cohere-ai', 'Amazonbot',
];

interface CrawlResult {
  url: string;
  title: string;
  content: string;
  statusCode: number;
  headers: Record<string, string>;
  hasCanonical: boolean;
  hasJsonLd: boolean;
  hasFaq: boolean;
  hasTutorial: boolean;
  hasComparison: boolean;
  hasCodeExamples: boolean;
  loadTime: number;
}

/**
 * 执行全站GEO体检
 */
export async function runFullAudit(
  siteUrl: string,
  pages: CrawlResult[]
): Promise<AuditReportData> {
  const defects: AuditDefect[] = [];

  // 检测1: llms.txt 缺失
  const hasLlmsTxt = pages.some(p => p.url.endsWith('/llms.txt'));
  if (!hasLlmsTxt) {
    defects.push(createDefect(DefectType.MISSING_LLMS_TXT, 10));
  }

  // 检测2: llms-full.txt 缺失
  const hasLlmsFull = pages.some(p => p.url.endsWith('/llms-full.txt'));
  if (!hasLlmsFull) {
    defects.push(createDefect(DefectType.MISSING_LLMS_FULL_TXT, 10));
  }

  // 检测3: JSON-LD 结构化数据缺失
  const pagesWithJsonLd = pages.filter(p => p.hasJsonLd).length;
  const jsonLdRate = pages.length > 0 ? pagesWithJsonLd / pages.length : 0;
  if (jsonLdRate < 0.5) {
    defects.push({
      ...createDefect(DefectType.MISSING_JSON_LD, 8),
      severity: jsonLdRate === 0 ? DefectSeverity.CRITICAL : DefectSeverity.HIGH,
      description: `${pagesWithJsonLd}/${pages.length} 页面包含JSON-LD结构化数据，不足50%`,
    });
  }

  // 检测4: robots.txt 屏蔽AI爬虫
  if (hasRobotsBlockingAI(pages)) {
    defects.push(createDefect(DefectType.ROBOTS_BLOCK_AI, 15));
  }

  // 检测5: FAQ内容缺失
  const pagesWithFaq = pages.filter(p => p.hasFaq).length;
  if (pagesWithFaq === 0) {
    defects.push(createDefect(DefectType.NO_FAQ_CONTENT, 6));
  }

  // 检测6: 教程内容缺失
  const pagesWithTutorial = pages.filter(p => p.hasTutorial).length;
  if (pagesWithTutorial === 0) {
    defects.push(createDefect(DefectType.NO_TUTORIAL, 5));
  }

  // 检测7: 对比测评内容缺失
  const pagesWithComparison = pages.filter(p => p.hasComparison).length;
  if (pagesWithComparison === 0) {
    defects.push(createDefect(DefectType.NO_COMPARISON, 5));
  }

  // 检测8: 代码实操案例缺失
  const pagesWithCode = pages.filter(p => p.hasCodeExamples).length;
  if (pagesWithCode < 2) {
    defects.push(createDefect(DefectType.NO_CODE_EXAMPLES, 4));
  }

  // 检测9: 重复页面检测 (简化版)
  if (hasDuplicatePages(pages)) {
    defects.push(createDefect(DefectType.DUPLICATE_PAGES, 3));
  }

  // 检测10: canonical标签缺失
  const pagesWithoutCanonical = pages.filter(p => !p.hasCanonical).length;
  if (pagesWithoutCanonical > pages.length * 0.3) {
    defects.push({
      ...createDefect(DefectType.MISSING_CANONICAL, 4),
      description: `${pagesWithoutCanonical}个页面缺少canonical标签`,
    });
  }

  // 检测11: 页面加载阻碍AI抓取
  const slowPages = pages.filter(p => p.loadTime > 3000).length;
  if (slowPages > 0) {
    defects.push({
      ...createDefect(DefectType.LOAD_BLOCKING, 5),
      description: `${slowPages}个页面加载时间超过3秒`,
    });
  }

  // 检测12: 品牌实体信息缺失
  const hasBrandEntity = pages.some(p =>
    p.content?.includes('Organization') || p.content?.includes('brand')
  );
  if (!hasBrandEntity) {
    defects.push(createDefect(DefectType.NO_BRAND_ENTITY, 6));
  }

  // 计算总分
  const totalDeduction = defects.reduce((sum, d) => sum + d.scoreDeduction, 0);
  const totalScore = Math.max(0, 100 - totalDeduction);

  // 各维度得分
  const indexScore = Math.max(0, 100 - defects.filter(d =>
    [DefectType.MISSING_LLMS_TXT, DefectType.MISSING_LLMS_FULL_TXT, DefectType.ROBOTS_BLOCK_AI]
      .includes(d.defectType)
  ).reduce((s, d) => s + d.scoreDeduction, 0));

  const structureScore = Math.max(0, 100 - defects.filter(d =>
    [DefectType.MISSING_JSON_LD, DefectType.MISSING_CANONICAL]
      .includes(d.defectType)
  ).reduce((s, d) => s + (d.scoreDeduction * 3), 0));

  const contentScore = Math.max(0, 100 - defects.filter(d =>
    [DefectType.NO_FAQ_CONTENT, DefectType.NO_TUTORIAL, DefectType.NO_COMPARISON, DefectType.NO_CODE_EXAMPLES]
      .includes(d.defectType)
  ).reduce((s, d) => s + (d.scoreDeduction * 2), 0));

  const authorityScore = Math.max(0, 100 - defects.filter(d =>
    [DefectType.NO_BRAND_ENTITY]
      .includes(d.defectType)
  ).reduce((s, d) => s + (d.scoreDeduction * 4), 0));

  const technicalScore = Math.max(0, 100 - defects.filter(d =>
    [DefectType.LOAD_BLOCKING, DefectType.DUPLICATE_PAGES]
      .includes(d.defectType)
  ).reduce((s, d) => s + (d.scoreDeduction * 2), 0));

  return {
    totalScore,
    scannedPages: pages.length,
    totalIssues: defects.length,
    indexScore,
    structureScore,
    contentScore,
    authorityScore,
    technicalScore,
    defects,
  };
}

/**
 * 生成修复代码片段
 */
export function generateFixSnippets(defects: AuditDefect[]): Record<string, string> {
  const snippets: Record<string, string> = {};

  for (const defect of defects) {
    switch (defect.defectType) {
      case DefectType.MISSING_LLMS_TXT:
        snippets['llms.txt'] = generateLlmsTxt();
        break;
      case DefectType.MISSING_LLMS_FULL_TXT:
        snippets['llms-full.txt'] = generateLlmsFullTxt();
        break;
      case DefectType.MISSING_JSON_LD:
        snippets['json-ld'] = generateJsonLdExample();
        break;
      case DefectType.ROBOTS_BLOCK_AI:
        snippets['robots.txt'] = generateRobotsTxt();
        break;
      default:
        break;
    }
  }

  return snippets;
}

// ========== 辅助函数 ==========

function createDefect(type: DefectType, deduction: number): AuditDefect {
  const titleMap: Record<DefectType, string> = {
    [DefectType.MISSING_LLMS_TXT]: '缺少 llms.txt 核心AI索引文件',
    [DefectType.MISSING_LLMS_FULL_TXT]: '缺少 llms-full.txt 完整AI索引文件',
    [DefectType.MISSING_JSON_LD]: '缺少商品/软件/服务专用 JSON-LD 结构化标签',
    [DefectType.ROBOTS_BLOCK_AI]: 'robots.txt 屏蔽了AI搜索引擎爬虫',
    [DefectType.NO_FAQ_CONTENT]: '页面无分层教程、无问答FAQ',
    [DefectType.NO_TUTORIAL]: '缺少分步部署教程内容',
    [DefectType.NO_COMPARISON]: '缺少竞品对比测评内容',
    [DefectType.NO_CODE_EXAMPLES]: '缺少代码实操案例',
    [DefectType.DUPLICATE_PAGES]: '存在重复页面内容',
    [DefectType.MISSING_CANONICAL]: '缺少标准化 canonical 标签',
    [DefectType.LOAD_BLOCKING]: '页面加载速度过慢，阻碍AI抓取',
    [DefectType.NO_BRAND_ENTITY]: '无品牌实体信息，AI无法建立品牌知识库',
  };

  const severityMap: Record<DefectType, DefectSeverity> = {
    [DefectType.MISSING_LLMS_TXT]: DefectSeverity.CRITICAL,
    [DefectType.MISSING_LLMS_FULL_TXT]: DefectSeverity.HIGH,
    [DefectType.MISSING_JSON_LD]: DefectSeverity.CRITICAL,
    [DefectType.ROBOTS_BLOCK_AI]: DefectSeverity.CRITICAL,
    [DefectType.NO_FAQ_CONTENT]: DefectSeverity.MEDIUM,
    [DefectType.NO_TUTORIAL]: DefectSeverity.MEDIUM,
    [DefectType.NO_COMPARISON]: DefectSeverity.LOW,
    [DefectType.NO_CODE_EXAMPLES]: DefectSeverity.LOW,
    [DefectType.DUPLICATE_PAGES]: DefectSeverity.LOW,
    [DefectType.MISSING_CANONICAL]: DefectSeverity.MEDIUM,
    [DefectType.LOAD_BLOCKING]: DefectSeverity.MEDIUM,
    [DefectType.NO_BRAND_ENTITY]: DefectSeverity.HIGH,
  };

  const fixMap: Record<DefectType, string> = {
    [DefectType.MISSING_LLMS_TXT]: generateLlmsTxt(),
    [DefectType.MISSING_LLMS_FULL_TXT]: generateLlmsFullTxt(),
    [DefectType.MISSING_JSON_LD]: generateJsonLdExample(),
    [DefectType.ROBOTS_BLOCK_AI]: generateRobotsTxt(),
    [DefectType.NO_FAQ_CONTENT]: '建议添加FAQ结构化页面，使用FAQPage JSON-LD标签',
    [DefectType.NO_TUTORIAL]: '建议添加分步部署教程，使用HowTo JSON-LD标签',
    [DefectType.NO_COMPARISON]: '建议添加竞品对比测评内容',
    [DefectType.NO_CODE_EXAMPLES]: '建议在教程中添加代码示例',
    [DefectType.DUPLICATE_PAGES]: '建议合并重复页面或使用canonical标签',
    [DefectType.MISSING_CANONICAL]: '为每个页面添加正确的canonical标签',
    [DefectType.LOAD_BLOCKING]: '优化页面加载速度，减少渲染阻塞资源',
    [DefectType.NO_BRAND_ENTITY]: '添加Organization类型的JSON-LD结构化数据',
  };

  return {
    defectType: type,
    severity: severityMap[type],
    title: titleMap[type],
    description: titleMap[type],
    affectedPages: [],
    fixSnippet: fixMap[type],
    scoreDeduction: deduction * (severityMap[type] === DefectSeverity.CRITICAL ? 2 : 1),
  };
}

function hasRobotsBlockingAI(pages: CrawlResult[]): boolean {
  // 简化检测逻辑 - 检查robots.txt内容
  const robotsPage = pages.find(p => p.url.endsWith('/robots.txt'));
  if (!robotsPage) return false;

  const content = robotsPage.content.toLowerCase();
  return AI_CRAWLERS.some(crawler =>
    content.includes(`disallow`) && content.includes(crawler.toLowerCase())
  );
}

function hasDuplicatePages(pages: CrawlResult[]): boolean {
  const titles = pages.map(p => p.title?.toLowerCase().trim());
  return new Set(titles).size < titles.length;
}

// ========== 代码片段生成 ==========

function generateLlmsTxt(): string {
  return `# LLMs.txt for {站点名称}
# 此文件帮助AI搜索引擎理解网站结构和关键内容

## 高优先级页面（产品、教程、FAQ）
- [产品介绍](https://example.com/products) | 核心产品功能与优势
- [快速开始](https://example.com/getting-started) | 5分钟上手指南
- [部署教程](https://example.com/docs/deploy) | 完整部署流程
- [常见问题](https://example.com/faq) | 用户常见问答
- [定价方案](https://example.com/pricing) | 套餐与价格对比

## 技术文档
- [API文档](https://example.com/docs/api) | 完整API接口说明
- [SDK指南](https://example.com/docs/sdk) | 多语言SDK使用

## 禁止抓取
# AI爬虫请勿抓取以下页面
Disallow: /admin/*
Disallow: /api/internal/*
Disallow: /checkout/*
`;
}

function generateLlmsFullTxt(): string {
  return `# LLMs-full.txt for {站点名称}
# 此文件包含站点完整内容索引，帮助AI全面理解你的网站

## 站点元数据
- 站点名称: {站点名称}
- 品牌名称: {品牌名称}
- 主营服务: {主营服务描述}
- 目标客户: {目标客户描述}

## 完整页面索引
[此处应包含全站所有页面的标题、URL和摘要信息]
`;
}

function generateJsonLdExample(): string {
  return `<!-- 添加到页面 <head> 中的 JSON-LD 结构化数据 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{产品名称}",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Windows, macOS, Linux",
  "description": "{产品描述 - 150字以内}",
  "url": "https://example.com",
  "offers": {
    "@type": "Offer",
    "price": "299",
    "priceCurrency": "CNY"
  }
}
</script>`;
}

function generateRobotsTxt(): string {
  const allowedCrawlers = AI_CRAWLERS.map(c => `User-agent: ${c}\nAllow: /`).join('\n\n');
  return `# 优化后的 robots.txt - 放行AI搜索引擎爬虫
${allowedCrawlers}

# 通用规则
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/internal/
Disallow: /checkout/
Disallow: /user/settings/

# Sitemap
Sitemap: https://example.com/sitemap.xml
`;
}
