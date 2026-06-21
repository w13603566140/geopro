import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';

export const competitorsRouter = Router();

/**
 * 扫描竞品站点
 */
competitorsRouter.post('/scan', async (req: AuthRequest, res: Response) => {
  try {
    const { competitorUrl, competitorName } = req.body;
    if (!competitorUrl || !competitorName) throw new AppError('竞品名称和URL为必填项', 400);

    await new Promise(r => setTimeout(r, 1500)); // 模拟扫描延迟

    const result = {
      competitorUrl,
      competitorName,
      llmsTxtContent: `# ${competitorName}\n## 产品\n- [${competitorName}产品](https://example.com)`,
      structuredDataSummary: {
        types: ['SoftwareApplication', 'FAQPage', 'Organization'],
        totalCount: 15,
        samples: ['SoftwareApplication', 'FAQPage'],
      },
      highRankQuestions: [
        `${competitorName} 和同类对比哪个好？`,
        `${competitorName} 价格方案有哪些？`,
        `${competitorName} API怎么调用？`,
        `${competitorName} 支持私有化部署吗？`,
      ],
      contentGaps: {
        missingTypes: ['HowTo (分步教程)', 'Review (测评案例)'],
        missingTopics: ['多模型网关部署教程', 'Token监控方案对比', 'AI客户端选型指南'],
        urgentActions: ['补充FAQPage标签', '创建竞品对比文章', '添加HowTo部署教程'],
      },
      exposureTrend: { trend: 'rising', dates: generateDates(90), mentions: generateValues(90, competitorName.length) },
      catchUpPlan: [
        { priority: 'high', action: '创建FAQPage结构化数据，覆盖竞品高排名问句', estimatedImpact: 'AI曝光率提升40%', difficulty: 'easy' },
        { priority: 'high', action: '撰写竞品对比文章 + 选型指南', estimatedImpact: '抢占3-5个关键词首位', difficulty: 'medium' },
        { priority: 'medium', action: '补充HowTo部署教程含代码示例', estimatedImpact: 'E-E-A-T评分+15', difficulty: 'medium' },
        { priority: 'medium', action: '添加Review客户案例结构化数据', estimatedImpact: '增强品牌信任度', difficulty: 'easy' },
        { priority: 'low', action: '生成MCP/Agent生态文件', estimatedImpact: '开辟新流量渠道', difficulty: 'hard' },
      ],
    };

    res.json({ success: true, data: result });
  } catch (error: any) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: '竞品扫描失败' });
  }
});

function generateDates(days: number): string[] {
  const dates: string[] = [];
  for (let i = days; i >= 0; i -= 7) {
    const d = new Date(); d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function generateValues(days: number, seed: number): number[] {
  return Array.from({ length: Math.ceil(days / 7) + 1 }, (_, i) => Math.floor(i * (1 + seed * 0.1) + Math.random() * 5));
}
