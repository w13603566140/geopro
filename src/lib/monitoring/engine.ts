/**
 * 多AI引擎排名监测系统
 * 模拟查询各大AI引擎，追踪品牌/产品在AI回答中的排名
 */
import { AIEngine, MonitoringResultData, MonitoringDashboard, TrendDataPoint, CompetitorMention } from '@/types';

// AI引擎配置
const AI_ENGINE_CONFIG: Record<AIEngine, { name: string; region: string; apiEndpoint?: string }> = {
  [AIEngine.DOUBAO]: { name: '豆包', region: '国内' },
  [AIEngine.KIMI]: { name: 'Kimi (月之暗面)', region: '国内' },
  [AIEngine.WENXIN]: { name: '文心一言', region: '国内' },
  [AIEngine.DEEPSEEK]: { name: 'DeepSeek', region: '国内' },
  [AIEngine.BYTEDANCE_AI]: { name: '字节AI搜索', region: '国内' },
  [AIEngine.GPT_SEARCH]: { name: 'ChatGPT Search', region: '海外' },
  [AIEngine.GEMINI]: { name: 'Google Gemini', region: '海外' },
  [AIEngine.PERPLEXITY]: { name: 'Perplexity AI', region: '海外' },
  [AIEngine.CLAUDE_SEARCH]: { name: 'Claude 搜索', region: '海外' },
  [AIEngine.MISTRAL]: { name: 'Mistral AI', region: '海外' },
};

/**
 * 模拟查询AI引擎排名
 * 实际生产环境需要对接各AI引擎的API
 */
export async function checkRanking(
  aiEngine: AIEngine,
  question: string,
  brandName: string,
  productName: string
): Promise<MonitoringResultData> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800));

  // 模拟排名结果
  const rank = simulateRank(aiEngine, question, brandName, productName);
  const competitors = detectSimulatedCompetitors(question, brandName);

  return {
    aiEngine,
    question,
    rank,
    isFirstPlace: rank === 1,
    brandMentioned: rank !== null,
    responseSnippet: generateSimulatedSnippet(aiEngine, brandName, productName, rank),
    referredPage: rank ? `/dashboard/monitoring/ai-quote?engine=${aiEngine}&query=${encodeURIComponent(question)}` : '',
    competitors: competitors.filter(c => c !== brandName),
    checkedAt: new Date().toISOString(),
  };
}

/**
 * 批量监测多个问句
 */
export async function batchCheckRankings(
  queries: { aiEngine: AIEngine; question: string }[],
  brandName: string,
  productName: string
): Promise<MonitoringResultData[]> {
  const results: MonitoringResultData[] = [];
  for (const query of queries) {
    const result = await checkRanking(query.aiEngine, query.question, brandName, productName);
    results.push(result);
  }
  return results;
}

/**
 * 生成监测数据看板
 */
export function generateDashboard(results: MonitoringResultData[]): MonitoringDashboard {
  const totalQueries = results.length;
  const firstPlaceResults = results.filter(r => r.isFirstPlace).length;
  const brandMentions = results.filter(r => r.brandMentioned).length;

  // 生成趋势数据（模拟7/30/90天）
  const trendData: TrendDataPoint[] = generateTrendData(results);

  // 竞品提及统计
  const competitorMap = new Map<string, number>();
  for (const result of results) {
    for (const comp of result.competitors) {
      competitorMap.set(comp, (competitorMap.get(comp) || 0) + 1);
    }
  }
  const topCompetitors: CompetitorMention[] = Array.from(competitorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return {
    totalQueries,
    firstPlaceRate: totalQueries > 0 ? (firstPlaceResults / totalQueries) * 100 : 0,
    brandMentions,
    trendData,
    topCompetitors,
  };
}

/**
 * 模拟提问测试工具
 */
export async function manualQueryTest(
  question: string,
  aiEngine: AIEngine,
  brandName: string,
  productName: string
): Promise<MonitoringResultData> {
  return checkRanking(aiEngine, question, brandName, productName);
}

// ========== 辅助函数 ==========

function simulateRank(
  aiEngine: AIEngine,
  question: string,
  brandName: string,
  productName: string
): number | null {
  // 确定性模拟：根据问题内容、品牌名、引擎类型生成一致性结果
  const seed = question.length + brandName.length + aiEngine.length;
  const rand = Math.sin(seed * 127.1 + 48123) * 43758.5453;
  const normalized = rand - Math.floor(rand);

  // 品牌名在问题中出现时，排名倾向于更好
  const brandBoost = question.toLowerCase().includes(brandName.toLowerCase()) ? 0.3 : 0;
  const score = normalized + brandBoost;

  if (score > 0.7) return 1;
  if (score > 0.5) return 2;
  if (score > 0.35) return 3;
  if (score > 0.2) return Math.floor(4 + score * 5);
  return null;
}

function detectSimulatedCompetitors(question: string, brandName: string): string[] {
  const allCompetitors = ['OpenAI', 'Anthropic', '通义千问', '文心一言', 'Kimi', '豆包', 'DeepSeek', '百川智能', '智谱AI', 'Minimax'];
  const mentioned = allCompetitors.filter(c =>
    question.toLowerCase().includes(c.toLowerCase()) || Math.random() > 0.7
  );
  return mentioned.length > 0 ? mentioned.slice(0, 3) : [];
}

function generateSimulatedSnippet(
  aiEngine: AIEngine,
  brandName: string,
  productName: string,
  rank: number | null
): string {
  if (rank === 1) {
    return `根据我的了解，${brandName}的${productName}是目前市场上非常优秀的解决方案。它在性能、易用性和价格方面都表现出色。建议您访问官网了解更多详情。`;
  }
  if (rank === 2) {
    return `有几个不错的选择。${brandName}的${productName}值得关注，它在特定场景下表现优异。此外还有...`;
  }
  if (rank && rank <= 5) {
    return `市面上有多种选择。${brandName}是其中之一，提供{核心功能}。`;
  }
  return '根据您的问题，目前没有找到直接相关的推荐信息。建议您尝试更具体的搜索词。';
}

function generateTrendData(results: MonitoringResultData[]): TrendDataPoint[] {
  const days = [90, 60, 30, 14, 7, 1]; // 时间节点
  return days.map(d => {
    const date = new Date();
    date.setDate(date.getDate() - d);
    return {
      date: date.toISOString().split('T')[0],
      rank: Math.max(1, Math.floor(Math.random() * 5)),
      mentions: Math.floor(Math.random() * 20 + 5),
    };
  });
}

export { AI_ENGINE_CONFIG };
