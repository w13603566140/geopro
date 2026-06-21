import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';
import prisma from '../config/database';

export const auditRouter = Router();

// 模拟爬虫结果
interface CrawlPage { url: string; title: string; content: string; statusCode: number; headers: Record<string, string>; hasCanonical: boolean; hasJsonLd: boolean; hasFaq: boolean; hasTutorial: boolean; hasComparison: boolean; hasCodeExamples: boolean; loadTime: number; }
interface DefectItem { type: string; name: string; severity: string; deduction: number; affectedPages: string[]; }

function simulateCrawl(siteUrl: string): CrawlPage[] {
  const baseUrl = siteUrl.replace(/\/$/, '');
  return ['', '/products', '/docs', '/docs/getting-started', '/faq', '/pricing', '/blog', '/about'].map((path, i) => ({
    url: `${baseUrl}${path}`, title: `页面${i+1}`, content: '内容', statusCode: 200, headers: {},
    hasCanonical: i > 0 && Math.random() > 0.3, hasJsonLd: i < 3 && Math.random() > 0.5,
    hasFaq: path.includes('faq'), hasTutorial: path.includes('docs'), hasComparison: path.includes('pricing'),
    hasCodeExamples: path.includes('docs'), loadTime: 500 + Math.random() * 3000,
  }));
}

// GEO体检缺陷定义
const DEFECT_CHECKS = [
  { type: 'MISSING_LLMS_TXT', name: '缺少 llms.txt 核心AI索引文件', severity: 'CRITICAL', deduction: 20 },
  { type: 'MISSING_LLMS_FULL_TXT', name: '缺少 llms-full.txt 完整AI索引文件', severity: 'HIGH', deduction: 10 },
  { type: 'MISSING_JSON_LD', name: '缺少 JSON-LD 结构化标签', severity: 'CRITICAL', deduction: 16 },
  { type: 'ROBOTS_BLOCK_AI', name: 'robots.txt 屏蔽AI爬虫', severity: 'CRITICAL', deduction: 15 },
  { type: 'NO_FAQ_CONTENT', name: '无FAQ问答内容', severity: 'MEDIUM', deduction: 6 },
  { type: 'NO_TUTORIAL', name: '缺少分步教程', severity: 'MEDIUM', deduction: 5 },
  { type: 'NO_COMPARISON', name: '缺少对比测评', severity: 'LOW', deduction: 5 },
  { type: 'NO_CODE_EXAMPLES', name: '缺少代码实操案例', severity: 'LOW', deduction: 4 },
  { type: 'DUPLICATE_PAGES', name: '存在重复页面', severity: 'LOW', deduction: 3 },
  { type: 'MISSING_CANONICAL', name: '缺少canonical标签', severity: 'MEDIUM', deduction: 4 },
  { type: 'LOAD_BLOCKING', name: '页面加载阻碍AI抓取', severity: 'MEDIUM', deduction: 5 },
  { type: 'NO_BRAND_ENTITY', name: '无品牌实体信息', severity: 'HIGH', deduction: 6 },
];

function calcScore(defects: DefectItem[], types: string[], multiplier: number): number {
  return Math.max(0, 100 - defects
    .filter(d => types.includes(d.type))
    .reduce((s, d) => s + d.deduction * multiplier, 0));
}

/**
 * 执行站点GEO体检
 */
auditRouter.post('/run', async (req: AuthRequest, res: Response) => {
  try {
    const { siteUrl, siteId } = req.body;
    if (!siteUrl) throw new AppError('请输入站点URL', 400);

    const pages = simulateCrawl(siteUrl);
    const defects: DefectItem[] = [];

    // 模拟检测
    const hasLlmsTxt = Math.random() > 0.7;
    const hasJsonLd = pages.filter(p => p.hasJsonLd).length > pages.length * 0.5;

    if (!hasLlmsTxt) defects.push({ ...DEFECT_CHECKS[0], affectedPages: [siteUrl] });
    if (!hasLlmsTxt) defects.push({ ...DEFECT_CHECKS[1], affectedPages: [siteUrl] });
    if (!hasJsonLd) defects.push({ ...DEFECT_CHECKS[2], affectedPages: pages.slice(0, 3).map(p => p.url) });
    if (!pages.some(p => p.hasFaq)) defects.push({ ...DEFECT_CHECKS[4], affectedPages: [siteUrl + '/faq'] });
    if (!pages.some(p => p.hasTutorial)) defects.push({ ...DEFECT_CHECKS[5], affectedPages: [siteUrl + '/docs'] });
    if (!pages.some(p => p.hasComparison)) defects.push({ ...DEFECT_CHECKS[6], affectedPages: [siteUrl + '/pricing'] });
    if (!pages.some(p => p.hasCodeExamples)) defects.push({ ...DEFECT_CHECKS[7], affectedPages: [siteUrl + '/docs'] });
    if (!hasJsonLd) defects.push({ ...DEFECT_CHECKS[11], affectedPages: [siteUrl] });

    const totalDeduction = defects.reduce((s, d) => s + d.deduction, 0);
    const totalScore = Math.max(0, 100 - totalDeduction);

    const report = {
      totalScore,
      scannedPages: pages.length,
      totalIssues: defects.length,
      indexScore: calcScore(defects, ['MISSING_LLMS_TXT', 'MISSING_LLMS_FULL_TXT', 'ROBOTS_BLOCK_AI'], 1),
      structureScore: calcScore(defects, ['MISSING_JSON_LD'], 3),
      contentScore: calcScore(defects, ['NO_FAQ_CONTENT', 'NO_TUTORIAL', 'NO_COMPARISON', 'NO_CODE_EXAMPLES'], 1),
      authorityScore: calcScore(defects, ['NO_BRAND_ENTITY'], 4),
      technicalScore: calcScore(defects, ['LOAD_BLOCKING', 'DUPLICATE_PAGES', 'MISSING_CANONICAL'], 2),
      defects,
      fixSnippets: {
        llmsTxt: '# LLMs.txt 示例\n## 高优先级\n- [产品页](https://example.com)',
        robotsTxt: 'User-agent: GPTBot\nAllow: /\n\nUser-agent: *\nAllow: /',
        jsonLd: '<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication"}</script>',
      },
    };

    // 保存到数据库（如果有siteId）
    if (siteId) {
      await prisma.site.update({
        where: { id: siteId },
        data: { geoScore: totalScore, lastAuditAt: new Date() },
      });
    }

    res.json({ success: true, data: report });
  } catch (error: any) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: '体检失败' });
  }
});

