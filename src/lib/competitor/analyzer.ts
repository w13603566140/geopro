/**
 * 竞品GEO情报分析服务
 * 扫描竞品站点，分析差距，生成赶超方案
 */

export interface CompetitorScanResult {
  competitorUrl: string;
  competitorName: string;
  llmsTxtContent: string | null;
  structuredDataSummary: {
    types: string[];
    totalCount: number;
    samples: string[];
  };
  highRankQuestions: string[];
  contentGaps: {
    missingTypes: string[];
    missingTopics: string[];
    urgentActions: string[];
  };
  exposureTrend: {
    dates: string[];
    mentions: number[];
    trend: 'rising' | 'stable' | 'declining';
  };
  catchUpPlan: CatchUpAction[];
}

interface CatchUpAction {
  priority: 'high' | 'medium' | 'low';
  action: string;
  estimatedImpact: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * 扫描竞品站点
 */
export async function scanCompetitor(
  competitorUrl: string,
  competitorName: string
): Promise<CompetitorScanResult> {
  // 模拟扫描结果
  const structuredDataTypes = ['SoftwareApplication', 'FAQPage', 'Organization', 'Article'];
  const highRankQuestions = [
    `${competitorName} 和同类产品对比哪个更好？`,
    `${competitorName} 的价格方案有哪些？`,
    `${competitorName} 的API怎么调用？`,
    `${competitorName} 支持私有化部署吗？`,
    `${competitorName} 的企业版有哪些功能？`,
  ];

  const contentGaps = {
    missingTypes: ['HowTo (分步教程)', 'Review (测评案例)', 'Service (技术服务)'],
    missingTopics: [
      '多模型网关部署完整教程',
      'Token用量监控方案对比',
      'AI客户端选型指南',
      '企业级AI网关高可用架构',
    ],
    urgentActions: [
      '立即补充FAQPage结构化标签',
      '创建多模型对比测评文章',
      '添加HowTo分步部署教程',
      '生成竞品对比选型指南',
    ],
  };

  return {
    competitorUrl,
    competitorName,
    llmsTxtContent: generateSampleLlmsTxt(competitorName),
    structuredDataSummary: {
      types: structuredDataTypes,
      totalCount: 12 + Math.floor(Math.random() * 20),
      samples: structuredDataTypes.slice(0, 3),
    },
    highRankQuestions,
    contentGaps,
    exposureTrend: {
      dates: generateDateRange(90),
      mentions: generateTrendValues(90, competitorName.length),
      trend: 'rising',
    },
    catchUpPlan: [
      { priority: 'high', action: '创建FAQPage结构化数据，覆盖竞品高排名问句', estimatedImpact: '预计AI曝光率提升40%', difficulty: 'easy' },
      { priority: 'high', action: '撰写多模型网关选型指南 + 竞品对比文章', estimatedImpact: '预计抢占3-5个关键词首位', difficulty: 'medium' },
      { priority: 'medium', action: '补充HowTo分步部署教程含代码示例', estimatedImpact: '提升E-E-A-T权威分15分', difficulty: 'medium' },
      { priority: 'medium', action: '添加Review类型结构化数据（客户案例）', estimatedImpact: '增强品牌信任度', difficulty: 'easy' },
      { priority: 'low', action: '生成MCP/Agent生态文件，拓展智能体流量', estimatedImpact: '开辟新流量渠道', difficulty: 'hard' },
    ],
  };
}

/**
 * 生成赶超方案
 */
export async function generateCatchUpPlan(
  mySite: { name: string; geoScore: number },
  competitors: CompetitorScanResult[]
): Promise<{
  overallStrategy: string;
  quickWins: CatchUpAction[];
  longTermPlans: CatchUpAction[];
  estimatedTimeline: string;
}> {
  const allGaps = competitors.flatMap(c => c.contentGaps.missingTopics);
  const uniqueGaps = [...new Set(allGaps)];

  return {
    overallStrategy: `针对 ${competitors.map(c => c.competitorName).join('、')} 等竞品，建议采取"快赢+长期"双轨策略。优先补齐FAQ和测评内容缺口，同步推进品牌知识图谱建设。`,
    quickWins: [
      { priority: 'high', action: '3天内补充FAQPage结构化数据', estimatedImpact: 'AI可见度立即提升', difficulty: 'easy' },
      { priority: 'high', action: '1周内发布选型指南文章', estimatedImpact: '抢占推荐类问句首位', difficulty: 'medium' },
      { priority: 'medium', action: '添加版本号和客户案例', estimatedImpact: 'E-E-A-T评分+15', difficulty: 'easy' },
    ],
    longTermPlans: [
      { priority: 'medium', action: '建设品牌知识图谱（Organization结构化数据）', estimatedImpact: '建立长期品牌占位', difficulty: 'medium' },
      { priority: 'low', action: '定期发布技术干货和教程内容', estimatedImpact: '持续提升AI采信权重', difficulty: 'medium' },
      { priority: 'low', action: '拓展Agent/MCP生态，接入智能体流量', estimatedImpact: '捕获新型AI流量', difficulty: 'hard' },
    ],
    estimatedTimeline: '预计30天内GEO评分可从当前提升至85+，3个月内实现核心关键词AI推荐首位占位。',
  };
}

// 辅助函数
function generateSampleLlmsTxt(name: string): string {
  return `# ${name}\n\n## 产品\n- [${name}产品介绍](https://example.com)\n\n## 文档\n- [API文档](https://example.com/docs)\n`;
}

function generateDateRange(days: number): string[] {
  const dates: string[] = [];
  for (let i = days; i >= 0; i -= 7) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function generateTrendValues(days: number, seed: number): number[] {
  return Array.from({ length: Math.ceil(days / 7) + 1 }, (_, i) =>
    Math.floor(i * (1 + seed * 0.1) + Math.random() * 5)
  );
}
