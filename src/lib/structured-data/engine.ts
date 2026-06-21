/**
 * 结构化标签引擎 - JSON-LD 批量生成
 * 支持8种核心结构化数据类型
 */
import { StructuredDataType, StructuredDataTemplateDef } from '@/types';

/**
 * 结构化数据模板定义
 */
export const STRUCTURED_DATA_TEMPLATES: Record<StructuredDataType, StructuredDataTemplateDef> = {
  [StructuredDataType.SOFTWARE_APPLICATION]: {
    type: StructuredDataType.SOFTWARE_APPLICATION,
    name: '软件应用',
    description: '适用于AI客户端、Token网关、API网关等软件产品',
    fields: [
      { key: 'name', label: '软件名称', type: 'text', required: true, description: '产品完整名称' },
      { key: 'description', label: '软件描述', type: 'textarea', required: true, description: '150字以内产品描述' },
      { key: 'applicationCategory', label: '应用分类', type: 'select', required: true,
        options: ['DeveloperApplication', 'BusinessApplication', 'CommunicationApplication', 'MultimediaApplication', 'SecurityApplication'] },
      { key: 'operatingSystem', label: '支持系统', type: 'text', required: true, description: '如: Windows, macOS, Linux' },
      { key: 'url', label: '官网地址', type: 'url', required: true },
      { key: 'price', label: '价格', type: 'number', required: false, description: '基础套餐价格（元）' },
      { key: 'priceCurrency', label: '币种', type: 'select', required: false, options: ['CNY', 'USD'] },
      { key: 'screenshot', label: '截图URL', type: 'url', required: false },
      { key: 'featureList', label: '核心功能(逗号分隔)', type: 'text', required: false },
    ],
  },
  [StructuredDataType.PRODUCT]: {
    type: StructuredDataType.PRODUCT,
    name: '商品/套餐',
    description: '适用于付费套餐、按量充值、私有化部署商品',
    fields: [
      { key: 'name', label: '商品名称', type: 'text', required: true },
      { key: 'description', label: '商品描述', type: 'textarea', required: true },
      { key: 'sku', label: 'SKU编号', type: 'text', required: false },
      { key: 'brand', label: '品牌名称', type: 'text', required: true },
      { key: 'price', label: '价格', type: 'number', required: true },
      { key: 'priceCurrency', label: '币种', type: 'select', required: true, options: ['CNY', 'USD'] },
      { key: 'availability', label: '库存状态', type: 'select', required: false,
        options: ['InStock', 'OutOfStock', 'PreOrder', 'OnlineOnly'] },
      { key: 'url', label: '购买链接', type: 'url', required: true },
    ],
  },
  [StructuredDataType.SERVICE]: {
    type: StructuredDataType.SERVICE,
    name: '技术服务',
    description: '适用于API运维、私有化搭建、技术咨询等服务',
    fields: [
      { key: 'name', label: '服务名称', type: 'text', required: true },
      { key: 'description', label: '服务描述', type: 'textarea', required: true },
      { key: 'serviceType', label: '服务类型', type: 'text', required: true, description: '如: API运维、部署搭建' },
      { key: 'provider', label: '服务提供商', type: 'text', required: true },
      { key: 'areaServed', label: '服务区域', type: 'text', required: false, description: '如: 中国大陆' },
      { key: 'priceRange', label: '价格范围', type: 'text', required: false, description: '如: ¥299-¥2999' },
      { key: 'url', label: '服务页面', type: 'url', required: true },
    ],
  },
  [StructuredDataType.FAQ_PAGE]: {
    type: StructuredDataType.FAQ_PAGE,
    name: 'FAQ问答',
    description: '权重最高的结构化类型，AI直接摘抄问答回答用户',
    fields: [
      { key: 'faqItems', label: '问答列表(JSON)', type: 'textarea', required: true,
        description: '格式: [{"question":"...","answer":"..."}]' },
    ],
  },
  [StructuredDataType.HOW_TO]: {
    type: StructuredDataType.HOW_TO,
    name: '分步教程',
    description: '分步部署/配置教程，AI最爱引用的内容类型',
    fields: [
      { key: 'name', label: '教程标题', type: 'text', required: true },
      { key: 'description', label: '教程简介', type: 'textarea', required: true },
      { key: 'steps', label: '步骤列表(JSON)', type: 'textarea', required: true,
        description: '格式: [{"name":"步骤1","text":"详细说明","image":"图片URL(可选)"}]' },
      { key: 'totalTime', label: '预计耗时', type: 'text', required: false, description: '如: PT30M (30分钟)' },
      { key: 'tools', label: '所需工具', type: 'text', required: false },
    ],
  },
  [StructuredDataType.ORGANIZATION]: {
    type: StructuredDataType.ORGANIZATION,
    name: '品牌组织',
    description: '搭建AI知识图谱，强化品牌占位',
    fields: [
      { key: 'name', label: '组织名称', type: 'text', required: true },
      { key: 'description', label: '组织描述', type: 'textarea', required: true },
      { key: 'url', label: '官网URL', type: 'url', required: true },
      { key: 'logo', label: 'Logo URL', type: 'url', required: false },
      { key: 'sameAs', label: '社交媒体链接(逗号分隔)', type: 'text', required: false },
      { key: 'contactPoint', label: '联系方式', type: 'text', required: false },
      { key: 'address', label: '地址', type: 'text', required: false },
    ],
  },
  [StructuredDataType.REVIEW]: {
    type: StructuredDataType.REVIEW,
    name: '评测/案例',
    description: '客户案例、竞品对比测评',
    fields: [
      { key: 'itemReviewed', label: '被评测对象', type: 'text', required: true },
      { key: 'reviewBody', label: '评测内容', type: 'textarea', required: true },
      { key: 'author', label: '作者', type: 'text', required: true },
      { key: 'reviewRating', label: '评分(1-5)', type: 'number', required: false },
      { key: 'datePublished', label: '发布日期', type: 'text', required: false },
    ],
  },
  [StructuredDataType.ARTICLE]: {
    type: StructuredDataType.ARTICLE,
    name: '技术文章',
    description: '技术干货、避坑指南',
    fields: [
      { key: 'headline', label: '文章标题', type: 'text', required: true },
      { key: 'description', label: '文章摘要', type: 'textarea', required: true },
      { key: 'author', label: '作者', type: 'text', required: true },
      { key: 'datePublished', label: '发布日期', type: 'text', required: true },
      { key: 'url', label: '文章URL', type: 'url', required: true },
      { key: 'image', label: '封面图URL', type: 'url', required: false },
      { key: 'keywords', label: '关键词(逗号分隔)', type: 'text', required: false },
    ],
  },
};

/**
 * 根据模板和数据生成JSON-LD
 */
export function generateJsonLd(
  type: StructuredDataType,
  data: Record<string, unknown>
): string {
  switch (type) {
    case StructuredDataType.SOFTWARE_APPLICATION:
      return generateSoftwareApplication(data);
    case StructuredDataType.PRODUCT:
      return generateProduct(data);
    case StructuredDataType.SERVICE:
      return generateService(data);
    case StructuredDataType.FAQ_PAGE:
      return generateFaqPage(data);
    case StructuredDataType.HOW_TO:
      return generateHowTo(data);
    case StructuredDataType.ORGANIZATION:
      return generateOrganization(data);
    case StructuredDataType.REVIEW:
      return generateReview(data);
    case StructuredDataType.ARTICLE:
      return generateArticle(data);
    default:
      throw new Error(`不支持的结构化数据类型: ${type}`);
  }
}

function generateSoftwareApplication(data: Record<string, unknown>): string {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.name,
    description: data.description,
    applicationCategory: data.applicationCategory || 'DeveloperApplication',
    operatingSystem: data.operatingSystem,
    url: data.url,
  };

  if (data.price && data.priceCurrency) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: String(data.price),
      priceCurrency: data.priceCurrency,
      availability: 'https://schema.org/InStock',
    };
  }

  if (data.featureList) {
    jsonLd.featureList = String(data.featureList).split(',').map(f => f.trim());
  }

  if (data.screenshot) {
    jsonLd.screenshot = data.screenshot;
  }

  return JSON.stringify(jsonLd, null, 2);
}

function generateProduct(data: Record<string, unknown>): string {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    brand: { '@type': 'Brand', name: data.brand },
    url: data.url,
  };

  if (data.price && data.priceCurrency) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: String(data.price),
      priceCurrency: data.priceCurrency,
      availability: `https://schema.org/${data.availability || 'InStock'}`,
    };
  }

  return JSON.stringify(jsonLd, null, 2);
}

function generateService(data: Record<string, unknown>): string {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
    serviceType: data.serviceType,
    provider: { '@type': 'Organization', name: data.provider },
    url: data.url,
  };

  if (data.areaServed) jsonLd.areaServed = data.areaServed;

  return JSON.stringify(jsonLd, null, 2);
}

function generateFaqPage(data: Record<string, unknown>): string {
  let faqItems: { question: string; answer: string }[] = [];
  try {
    faqItems = JSON.parse(data.faqItems as string);
  } catch {
    faqItems = [];
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return JSON.stringify(jsonLd, null, 2);
}

function generateHowTo(data: Record<string, unknown>): string {
  let steps: { name: string; text: string; image?: string }[] = [];
  try {
    steps = JSON.parse(data.steps as string);
  } catch {
    steps = [];
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    step: steps.map((step, i) => {
      const s: Record<string, unknown> = {
        '@type': 'HowToStep',
        position: i + 1,
        name: step.name,
        text: step.text,
      };
      if (step.image) s.image = step.image;
      return s;
    }),
  };

  if (data.totalTime) {
    jsonLd.totalTime = data.totalTime;
  }

  return JSON.stringify(jsonLd, null, 2);
}

function generateOrganization(data: Record<string, unknown>): string {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.description,
    url: data.url,
  };

  if (data.logo) jsonLd.logo = data.logo;
  if (data.sameAs) {
    jsonLd.sameAs = String(data.sameAs).split(',').map(s => s.trim());
  }

  return JSON.stringify(jsonLd, null, 2);
}

function generateReview(data: Record<string, unknown>): string {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'Thing', name: data.itemReviewed },
    reviewBody: data.reviewBody,
    author: { '@type': 'Person', name: data.author },
  };

  if (data.reviewRating) {
    jsonLd.reviewRating = {
      '@type': 'Rating',
      ratingValue: String(data.reviewRating),
      bestRating: '5',
    };
  }

  return JSON.stringify(jsonLd, null, 2);
}

function generateArticle(data: Record<string, unknown>): string {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    author: { '@type': 'Person', name: data.author },
    url: data.url,
  };

  if (data.datePublished) jsonLd.datePublished = data.datePublished;
  if (data.image) jsonLd.image = data.image;
  if (data.keywords) {
    jsonLd.keywords = String(data.keywords).split(',').map(k => k.trim());
  }

  return JSON.stringify(jsonLd, null, 2);
}

/**
 * JSON-LD语法校验
 */
export function validateJsonLd(jsonLd: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  try {
    JSON.parse(jsonLd);
  } catch (e: any) {
    errors.push(`JSON语法错误: ${e.message}`);
    return { valid: false, errors };
  }

  // 检查基本schema.org要求
  if (!jsonLd.includes('@context')) errors.push('缺少 @context');
  if (!jsonLd.includes('@type')) errors.push('缺少 @type');
  if (!jsonLd.includes('schema.org')) errors.push('缺少 schema.org 上下文');

  return { valid: errors.length === 0, errors };
}
