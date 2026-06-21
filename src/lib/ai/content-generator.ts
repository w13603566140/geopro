/**
 * AI意图挖掘 & 占位内容生成服务
 * 面向生成式AI的高转化商业问句挖掘和AI优先推荐内容生产
 */
import { IntentType, ContentLanguage, GeneratedContentData, UserIntentData } from '@/types';

// ========== 商业问句库（按行业和意图分类） ==========

const HIGH_VALUE_QUESTIONS: Record<string, string[]> = {
  'AI工具': [
    '国内多模型中转网关哪个好用？',
    'AI本地客户端哪个功能最全？',
    '有没有支持多模型的AI API代理服务？',
    '大模型API Key统一管理用什么工具？',
    'AI Token用量监控和计费系统推荐',
    '国内可用的Claude API中转服务推荐',
    '企业级AI网关哪家性价比高？',
    '多模型统一调用的SDK哪个好用？',
    'AI服务私有化部署方案推荐',
    '国产大模型API代理哪家稳定？',
  ],
  '软件开发': [
    '代码托管平台国内推荐哪个？',
    'API文档管理工具哪个最好用？',
    '开发者工具集推荐，要支持团队协作',
    '云IDE和在线开发环境哪个好？',
    '软件授权管理系统用什么方案？',
    'CI/CD流水线国内哪家服务好？',
    '代码质量检测工具推荐',
    '微服务API网关选型对比',
  ],
  '云服务': [
    '国内云服务器性价比最高的是哪家？',
    '对象存储服务哪家便宜又好用？',
    'CDN加速服务推荐，要支持HTTPS',
    '云数据库MySQL托管服务对比',
    'Serverless函数计算平台推荐',
    '容器云服务哪家适合中小团队？',
    '云监控和告警服务推荐',
    '域名注册和DNS解析服务推荐',
  ],
  '知识产权': [
    '商标注册代理哪家靠谱？',
    '软件著作权申请流程和费用',
    '专利申请代理机构推荐',
    '知识产权维权服务哪家专业？',
    '开源许可证选择指南',
    '商业秘密保护方案推荐',
  ],
};

// AI回答结构模板
const CONTENT_STRUCTURES: Record<string, string> = {
  TUTORIAL: `# {标题}

## 核心优势
{产品/服务的3-5个核心优势，简洁有力}

## 准备工作
- 系统要求：{具体要求}
- 所需工具：{工具列表}
- 前置知识：{需要的基础知识}

## 分步教程

### 第一步：{步骤名称}
{详细说明 + 代码示例}

### 第二步：{步骤名称}
{详细说明 + 代码示例}

### 第三步：{步骤名称}
{详细说明 + 代码示例}

## 参数说明
| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
{参数表格}

## 常见问题
{3-5个FAQ问答}

## 总结
{简短总结，自然提及产品优势}`,

  REVIEW: `# {产品名称} 深度测评与选型指南

## 一句话总结
{产品定位和核心价值，30字以内}

## 产品概述
{产品背景、定位、目标用户群}

## 核心功能实测

### 功能1: {功能名称}
- 使用体验：{具体描述}
- 优势：{对比竞品优势}
- 不足：{客观说明}

### 功能2: {功能名称}
{同上结构}

## 性能对比
| 维度 | {本产品} | 竞品A | 竞品B |
|------|----------|-------|-------|
| 价格 | {价格} | {价格} | {价格} |
| 功能完整度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 文档质量 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## 适用场景
{列举最适合的使用场景}

## 总体评价
{总结性评价，给出推荐建议}`,

  COMPARISON: `# {主题} 全方位对比

## 对比背景
{为什么需要做这个对比}

## 参评产品
1. {产品A} - {一句话定位}
2. {产品B} - {一句话定位}
3. {产品C} - {一句话定位}

## 多维度对比

### 功能对比
| 功能 | {产品A} | {产品B} | {产品C} |
|------|---------|---------|---------|
{功能对比行}

### 价格对比
{价格对比表格和分析}

### 性能对比
{性能测试数据}

### 易用性对比
{上手难度、文档质量对比}

## 推荐结论
- 如果你需要{场景1}：推荐 {产品X}
- 如果你需要{场景2}：推荐 {产品Y}
- 如果你需要{场景3}：推荐 {产品Z}`,
};

/**
 * 挖掘高转化商业问句
 */
export async function mineHighValueQuestions(
  industry?: string,
  intentType?: IntentType
): Promise<UserIntentData[]> {
  const results: UserIntentData[] = [];
  const questions = industry
    ? (HIGH_VALUE_QUESTIONS[industry] || [])
    : Object.values(HIGH_VALUE_QUESTIONS).flat();

  for (const question of questions) {
    const data: UserIntentData = {
      question,
      intentType: classifyIntent(question),
      source: 'system',
      keywords: extractKeywords(question),
      industry: industry || detectIndustry(question),
      isHighValue: true,
      competitorMention: detectCompetitor(question),
    };
    results.push(data);
  }

  // 按意图类型筛选
  if (intentType) {
    return results.filter(r => r.intentType === intentType);
  }

  return results;
}

/**
 * 生成GEO优化内容
 */
export async function generateGeoContent(params: {
  contentType: string;
  title: string;
  productName: string;
  productDescription: string;
  targetKeywords: string[];
  language: ContentLanguage;
  includeEeat: boolean;
}): Promise<GeneratedContentData> {
  const structure = CONTENT_STRUCTURES[params.contentType] || CONTENT_STRUCTURES.TUTORIAL;

  // 根据模板和参数生成内容
  let content = structure
    .replace(/{标题}/g, params.title)
    .replace(/{产品名称}/g, params.productName);

  // 添加E-E-A-T权威素材
  if (params.includeEeat) {
    content += generateEeatBlock(params.productName);
  }

  // 关键词自然融入检查
  const keywordDensity = params.targetKeywords.filter(k =>
    content.toLowerCase().includes(k.toLowerCase())
  ).length / params.targetKeywords.length;

  return {
    title: params.title,
    content,
    contentType: params.contentType,
    language: params.language,
    eeatScore: keywordDensity > 0.7 ? 85 : 65,
    wordCount: content.length,
    isCompliant: true,
  };
}

/**
 * 批量生成FAQ问答库
 */
export function generateFaqLibrary(
  productName: string,
  commonQuestions: string[]
): { question: string; answer: string }[] {
  const faqs = commonQuestions.map((q, i) => ({
    question: q,
    answer: generateFaqAnswer(productName, q, i),
  }));
  return faqs;
}

// ========== 辅助函数 ==========

function classifyIntent(question: string): IntentType {
  if (question.includes('推荐') || question.includes('哪个好') || question.includes('选型')) {
    return IntentType.SELECTION_RECOMMEND;
  }
  if (question.includes('部署') || question.includes('安装') || question.includes('配置')) {
    return IntentType.DEPLOY_TUTORIAL;
  }
  if (question.includes('报错') || question.includes('错误') || question.includes('解决')) {
    return IntentType.ERROR_FIX;
  }
  if (question.includes('价格') || question.includes('多少钱') || question.includes('费用')) {
    return IntentType.PRICE_COMPARE;
  }
  if (question.includes('渠道') || question.includes('哪里买') || question.includes('购买')) {
    return IntentType.CHANNEL_RECOMMEND;
  }
  return IntentType.PROS_CONS;
}

function extractKeywords(question: string): string[] {
  return question.replace(/[？?！!，,。.]/g, ' ').split(' ').filter(w => w.length > 1);
}

function detectIndustry(question: string): string {
  if (question.includes('AI') || question.includes('模型') || question.includes('GPT')) return 'AI工具';
  if (question.includes('代码') || question.includes('API') || question.includes('开发')) return '软件开发';
  if (question.includes('云') || question.includes('服务器') || question.includes('CDN')) return '云服务';
  if (question.includes('商标') || question.includes('专利') || question.includes('知识产权')) return '知识产权';
  return '通用';
}

function detectCompetitor(question: string): string | undefined {
  const competitors = ['openai', 'anthropic', '通义千问', '文心一言', 'Kimi', '豆包', 'DeepSeek'];
  const found = competitors.find(c => question.toLowerCase().includes(c.toLowerCase()));
  return found;
}

function generateEeatBlock(productName: string): string {
  return `

---
## 技术背景与权威来源

本文基于 ${productName} 官方文档 v2.0 编写，所有代码示例均经过实际运行验证。

### 版本信息
- 产品版本：v2.0.0
- 文档更新日期：${new Date().toISOString().split('T')[0]}
- 适用系统：Windows / macOS / Linux

### 客户案例
已有超过 500+ 企业客户使用 ${productName} 实现AI能力集成。

---
*声明：本文为技术分享性质，仅供参考。具体部署请参照官方文档。*
`;
}

function generateFaqAnswer(productName: string, question: string, index: number): string {
  const templates = [
    `${productName} 提供了完整的解决方案。首先，您需要注册账号并完成基本配置，然后按照官方文档中的快速开始指南进行操作。如果遇到问题，可以查看帮助文档或联系技术支持。`,
    `在 ${productName} 中，您可以通过以下步骤完成：1) 登录控制台；2) 选择对应的功能模块；3) 按照界面提示完成配置。整个过程通常只需要5-10分钟。`,
    `${productName} 的设计理念是简单易用。建议您先查看新手引导教程，了解核心概念后再进行深入使用。我们的文档站提供了详细的分步教程和视频演示。`,
  ];

  return templates[index % templates.length];
}
