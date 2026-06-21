// ========== GEO 体检诊断类型 ==========

export enum DefectType {
  MISSING_LLMS_TXT = 'MISSING_LLMS_TXT',
  MISSING_LLMS_FULL_TXT = 'MISSING_LLMS_FULL_TXT',
  MISSING_JSON_LD = 'MISSING_JSON_LD',
  ROBOTS_BLOCK_AI = 'ROBOTS_BLOCK_AI',
  NO_FAQ_CONTENT = 'NO_FAQ_CONTENT',
  NO_TUTORIAL = 'NO_TUTORIAL',
  NO_COMPARISON = 'NO_COMPARISON',
  NO_CODE_EXAMPLES = 'NO_CODE_EXAMPLES',
  DUPLICATE_PAGES = 'DUPLICATE_PAGES',
  MISSING_CANONICAL = 'MISSING_CANONICAL',
  LOAD_BLOCKING = 'LOAD_BLOCKING',
  NO_BRAND_ENTITY = 'NO_BRAND_ENTITY',
}

export enum DefectSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface AuditDefect {
  defectType: DefectType;
  severity: DefectSeverity;
  title: string;
  description: string;
  affectedPages: string[];
  fixSnippet: string;
  scoreDeduction: number;
}

export interface AuditReportData {
  totalScore: number;
  scannedPages: number;
  totalIssues: number;
  indexScore: number;
  structureScore: number;
  contentScore: number;
  authorityScore: number;
  technicalScore: number;
  defects: AuditDefect[];
}

// ========== 站点类型 ==========

export enum SiteType {
  OFFICIAL_WEBSITE = 'OFFICIAL_WEBSITE',
  DOCS_SITE = 'DOCS_SITE',
  OPEN_SOURCE = 'OPEN_SOURCE',
  API_GATEWAY = 'API_GATEWAY',
  DOWNLOAD_SITE = 'DOWNLOAD_SITE',
  BLOG = 'BLOG',
  OTHER = 'OTHER',
}

export enum FrameworkType {
  VUE_SPA = 'VUE_SPA',
  REACT_SPA = 'REACT_SPA',
  NEXT_JS = 'NEXT_JS',
  WORDPRESS = 'WORDPRESS',
  VITEPRESS = 'VITEPRESS',
  HEXO = 'HEXO',
  STATIC_HTML = 'STATIC_HTML',
  OTHER = 'OTHER',
}

export interface SiteInfo {
  id: string;
  name: string;
  url: string;
  type: SiteType;
  framework: FrameworkType;
  brandName?: string;
  productName?: string;
  mainService?: string;
  industry?: string;
  targetCustomer?: string;
  pricingModel?: string;
  isVerified: boolean;
  geoScore?: number;
  lastAuditAt?: string;
}

// ========== 结构化数据类型 ==========

export enum StructuredDataType {
  SOFTWARE_APPLICATION = 'SOFTWARE_APPLICATION',
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
  FAQ_PAGE = 'FAQ_PAGE',
  HOW_TO = 'HOW_TO',
  ORGANIZATION = 'ORGANIZATION',
  REVIEW = 'REVIEW',
  ARTICLE = 'ARTICLE',
}

export interface StructuredDataField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'url' | 'select' | 'richtext';
  required: boolean;
  options?: string[];
  description?: string;
}

export interface StructuredDataTemplateDef {
  type: StructuredDataType;
  name: string;
  description: string;
  fields: StructuredDataField[];
}

// ========== AI 监测类型 ==========

export enum AIEngine {
  DOUBAO = 'DOUBAO',
  KIMI = 'KIMI',
  WENXIN = 'WENXIN',
  DEEPSEEK = 'DEEPSEEK',
  BYTEDANCE_AI = 'BYTEDANCE_AI',
  GPT_SEARCH = 'GPT_SEARCH',
  GEMINI = 'GEMINI',
  PERPLEXITY = 'PERPLEXITY',
  CLAUDE_SEARCH = 'CLAUDE_SEARCH',
  MISTRAL = 'MISTRAL',
}

export interface MonitoringResultData {
  aiEngine: AIEngine;
  question: string;
  rank: number | null;
  isFirstPlace: boolean;
  brandMentioned: boolean;
  responseSnippet: string;
  referredPage: string;
  competitors: string[];
  checkedAt: string;
}

export interface MonitoringDashboard {
  totalQueries: number;
  firstPlaceRate: number;
  brandMentions: number;
  trendData: TrendDataPoint[];
  topCompetitors: CompetitorMention[];
}

export interface TrendDataPoint {
  date: string;
  rank: number;
  mentions: number;
}

export interface CompetitorMention {
  name: string;
  count: number;
}

// ========== 内容生成类型 ==========

export enum IntentType {
  SELECTION_RECOMMEND = 'SELECTION_RECOMMEND',
  DEPLOY_TUTORIAL = 'DEPLOY_TUTORIAL',
  ERROR_FIX = 'ERROR_FIX',
  PRICE_COMPARE = 'PRICE_COMPARE',
  CHANNEL_RECOMMEND = 'CHANNEL_RECOMMEND',
  PROS_CONS = 'PROS_CONS',
}

export enum ContentLanguage {
  ZH_CN = 'ZH_CN',
  EN_US = 'EN_US',
  BILINGUAL = 'BILINGUAL',
}

export interface UserIntentData {
  question: string;
  intentType: IntentType;
  source: string;
  keywords: string[];
  industry: string;
  isHighValue: boolean;
  competitorMention?: string;
}

export interface GeneratedContentData {
  title: string;
  content: string;
  contentType: string;
  language: ContentLanguage;
  eeatScore: number;
  wordCount: number;
  isCompliant: boolean;
}

// ========== 计费套餐 ==========

export enum PlanTier {
  FREE = 'FREE',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export interface PlanFeatures {
  tier: PlanTier;
  name: string;
  price: number;
  priceUnit: string;
  maxSites: number;
  maxDailyQueries: number;
  maxContentDaily: number;
  features: string[];
  highlighted: boolean;
}

export const PLAN_CONFIGS: PlanFeatures[] = [
  {
    tier: PlanTier.FREE,
    name: '免费引流版',
    price: 0,
    priceUnit: '永久免费',
    maxSites: 1,
    maxDailyQueries: 3,
    maxContentDaily: 5,
    features: [
      '单站点管理',
      '基础GEO体检评分',
      '单页面手动生成llms.txt',
      '简易结构化标签',
      '每日3次AI排名查询',
      '基础内容生成额度',
    ],
    highlighted: false,
  },
  {
    tier: PlanTier.PROFESSIONAL,
    name: '专业订阅版',
    price: 299,
    priceUnit: '元/月',
    maxSites: 20,
    maxDailyQueries: 50,
    maxContentDaily: 50,
    features: [
      '最多20个站点管理',
      '全站批量扫描优化',
      '全类型结构化标签批量生成',
      '全平台AI排名每日批量监测',
      '周度数据报表',
      '完整竞品情报分析',
      '海量问句挖掘',
      '每日50篇内容生成',
      'PDF报表导出',
      '基础数据导出',
    ],
    highlighted: true,
  },
  {
    tier: PlanTier.ENTERPRISE,
    name: '企业年费版',
    price: 2999,
    priceUnit: '元/年',
    maxSites: 999,
    maxDailyQueries: 999,
    maxContentDaily: 999,
    features: [
      '不限站点数量',
      '多子账号团队协作',
      '分级权限管理',
      '定时全自动全站优化',
      '批量内容生产任务',
      '白标无logo报表',
      '开放HTTP API接口',
      'MCP/Agent全套生态文件',
      '专属人工技术支持',
      '私有化独立部署授权',
      'OEM贴牌授权',
      '代理分销后台',
    ],
    highlighted: false,
  },
];

// ========== 通用 API 响应 ==========

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
