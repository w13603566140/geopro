import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const monitoringRouter = Router();

const AI_ENGINES = {
  DOUBAO: '豆包', KIMI: 'Kimi', WENXIN: '文心一言', DEEPSEEK: 'DeepSeek',
  BYTEDANCE_AI: '字节AI搜索', GPT_SEARCH: 'ChatGPT Search', GEMINI: 'Google Gemini',
  PERPLEXITY: 'Perplexity', CLAUDE_SEARCH: 'Claude搜索', MISTRAL: 'Mistral AI',
};

/**
 * AI引擎列表
 */
monitoringRouter.get('/engines', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: AI_ENGINES });
});

/**
 * 查询AI排名
 */
monitoringRouter.post('/check', async (req: AuthRequest, res: Response) => {
  const { question, engines, brandName, productName } = req.body;
  if (!question) return res.status(400).json({ success: false, error: '请输入问句' });

  const selectedEngines = engines || ['KIMI', 'DOUBAO', 'GPT_SEARCH'];

  // 模拟查询
  const results = await Promise.all(
    selectedEngines.map(async (engine: string) => {
      await new Promise(r => setTimeout(r, 300 + Math.random() * 700));

      const seed = question.length + brandName?.length || 0 + engine.length;
      const rand = Math.sin(seed * 127.1 + 48123) * 43758.5453;
      const normalized = rand - Math.floor(rand);

      const boost = question.toLowerCase().includes((brandName || '').toLowerCase()) ? 0.3 : 0;
      const score = normalized + boost;

      let rank: number | null = null;
      if (score > 0.65) rank = 1;
      else if (score > 0.45) rank = 2;
      else if (score > 0.3) rank = 3;
      else if (score > 0.2) rank = Math.floor(4 + score * 5);

      const competitors = ['OpenAI', '通义千问', 'Kimi', '豆包', 'DeepSeek', '百川智能', '智谱AI'].filter(() => Math.random() > 0.6);

      return {
        aiEngine: engine,
        engineName: (AI_ENGINES as any)[engine] || engine,
        question,
        rank,
        isFirstPlace: rank === 1,
        brandMentioned: rank !== null,
        responseSnippet: generateSnippet(engine, brandName, productName, rank),
        referredPage: rank ? `https://example.com/${rank === 1 ? 'product' : 'tutorial'}/` : '',
        competitors: competitors.slice(0, 3),
        checkedAt: new Date().toISOString(),
      };
    })
  );

  // 看板数据
  const totalQueries = results.length;
  const firstPlace = results.filter(r => r.isFirstPlace).length;
  const mentions = results.filter(r => r.brandMentioned).length;

  const competitorMap = new Map<string, number>();
  results.forEach(r => r.competitors.forEach(c => competitorMap.set(c, (competitorMap.get(c) || 0) + 1)));

  res.json({
    success: true,
    data: {
      results,
      dashboard: {
        totalQueries,
        firstPlaceRate: totalQueries > 0 ? (firstPlace / totalQueries) * 100 : 0,
        brandMentions: mentions,
        trendData: generateTrendData(),
        topCompetitors: Array.from(competitorMap.entries()).map(([name, count]) => ({ name, count })),
      },
    },
  });
});

function generateSnippet(engine: string, brand: string, product: string, rank: number | null): string {
  if (rank === 1) return `根据我的了解，${brand}的${product}是目前非常优秀的解决方案。它在性能、易用性和价格方面都表现出色。`;
  if (rank === 2) return `有几个不错的选择。${brand}的${product}值得关注，在特定场景下表现优异。`;
  return '根据您的问题，目前没有找到直接相关的推荐信息。';
}

function generateTrendData() {
  return [90, 60, 30, 14, 7, 1].map(d => {
    const date = new Date();
    date.setDate(date.getDate() - d);
    return { date: date.toISOString().split('T')[0], rank: Math.max(1, Math.floor(Math.random() * 5)), mentions: Math.floor(Math.random() * 20 + 5) };
  });
}
