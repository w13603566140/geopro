import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { runFullAudit } from '@/lib/geo/audit-engine';
import prisma from '@/lib/prisma';
import { CrawlResult } from '@/lib/geo/audit-engine';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const userId = (session.user as any).id;
  const { siteUrl, siteId } = await req.json();

  if (!siteUrl) return NextResponse.json({ error: '请输入站点URL' }, { status: 400 });

  try {
    // 模拟爬取数据
    const pages = simulateCrawl(siteUrl);

    // 运行体检
    const report = await runFullAudit(siteUrl, pages);

    // 保存到数据库
    if (siteId) {
      const auditReport = await prisma.auditReport.create({
        data: {
          siteId,
          totalScore: report.totalScore,
          scannedPages: report.scannedPages,
          totalIssues: report.totalIssues,
          indexScore: report.indexScore,
          structureScore: report.structureScore,
          contentScore: report.contentScore,
          authorityScore: report.authorityScore,
          technicalScore: report.technicalScore,
          defects: {
            create: report.defects.map(d => ({
              defectType: d.defectType,
              severity: d.severity,
              title: d.title,
              description: d.description,
              affectedPages: JSON.stringify(d.affectedPages),
              fixSnippet: d.fixSnippet,
              scoreDeduction: d.scoreDeduction,
            })),
          },
        },
      });

      // 更新站点评分
      await prisma.site.update({
        where: { id: siteId },
        data: { geoScore: report.totalScore, lastAuditAt: new Date() },
      });
    }

    return NextResponse.json({ data: report });
  } catch (error: any) {
    console.error('体检失败:', error);
    return NextResponse.json({ error: '体检失败: ' + error.message }, { status: 500 });
  }
}

function simulateCrawl(siteUrl: string): CrawlResult[] {
  const baseUrl = siteUrl.replace(/\/$/, '');
  const pages: string[] = [
    baseUrl,
    `${baseUrl}/products`,
    `${baseUrl}/docs`,
    `${baseUrl}/docs/getting-started`,
    `${baseUrl}/faq`,
    `${baseUrl}/pricing`,
    `${baseUrl}/blog`,
    `${baseUrl}/about`,
  ];

  return pages.map((url, i) => ({
    url,
    title: `页面 ${i + 1} - ${url.split('/').pop() || '首页'}`,
    content: '模拟页面内容...',
    statusCode: 200,
    headers: {},
    hasCanonical: i > 0 && Math.random() > 0.3,
    hasJsonLd: i < 3 && Math.random() > 0.5,
    hasFaq: url.includes('faq'),
    hasTutorial: url.includes('getting-started') || url.includes('docs'),
    hasComparison: url.includes('pricing'),
    hasCodeExamples: url.includes('docs'),
    loadTime: 500 + Math.random() * 3000,
  }));
}
