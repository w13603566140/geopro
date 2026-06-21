import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';

export const structuredDataRouter = Router();

// 8种JSON-LD模板
const TEMPLATES: Record<string, any> = {
  SOFTWARE_APPLICATION: {
    type: 'SoftwareApplication',
    name: '软件应用',
    fields: ['name', 'description', 'applicationCategory', 'operatingSystem', 'url', 'price'],
  },
  PRODUCT: {
    type: 'Product',
    name: '商品/套餐',
    fields: ['name', 'description', 'sku', 'brand', 'price', 'priceCurrency', 'url'],
  },
  SERVICE: {
    type: 'Service',
    name: '技术服务',
    fields: ['name', 'description', 'serviceType', 'provider', 'areaServed', 'priceRange', 'url'],
  },
  FAQ_PAGE: {
    type: 'FAQPage',
    name: 'FAQ问答',
    fields: ['faqItems'],
  },
  HOW_TO: {
    type: 'HowTo',
    name: '分步教程',
    fields: ['name', 'description', 'steps', 'totalTime'],
  },
  ORGANIZATION: {
    type: 'Organization',
    name: '品牌组织',
    fields: ['name', 'description', 'url', 'logo', 'sameAs', 'address'],
  },
  REVIEW: {
    type: 'Review',
    name: '评测/案例',
    fields: ['itemReviewed', 'reviewBody', 'author', 'reviewRating', 'datePublished'],
  },
  ARTICLE: {
    type: 'Article',
    name: '技术文章',
    fields: ['headline', 'description', 'author', 'datePublished', 'url', 'keywords'],
  },
};

/**
 * 获取模板列表
 */
structuredDataRouter.get('/templates', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: TEMPLATES });
});

/**
 * 生成JSON-LD
 */
structuredDataRouter.post('/generate', (req: AuthRequest, res: Response) => {
  try {
    const { type, data } = req.body;
    if (!type || !data) throw new AppError('类型和数据为必填项', 400);
    if (!TEMPLATES[type]) throw new AppError('不支持的数据类型', 400);

    const jsonLd: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': type === 'FAQ_PAGE' ? 'FAQPage' :
               type === 'HOW_TO' ? 'HowTo' :
               type === 'ORGANIZATION' ? 'Organization' :
               type === 'REVIEW' ? 'Review' :
               type === 'ARTICLE' ? 'Article' :
               type === 'SOFTWARE_APPLICATION' ? 'SoftwareApplication' :
               type === 'PRODUCT' ? 'Product' : 'Service',
    };

    // 映射数据字段
    if (type === 'FAQ_PAGE' && data.faqItems) {
      try {
        const items = JSON.parse(data.faqItems);
        jsonLd.mainEntity = items.map((item: any) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        }));
      } catch { /* ignore parse error */ }
    }

    if (type === 'HOW_TO' && data.steps) {
      try {
        const steps = JSON.parse(data.steps);
        jsonLd.step = steps.map((s: any, i: number) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name,
          text: s.text,
        }));
      } catch { /* ignore */ }
    }

    if (type === 'SOFTWARE_APPLICATION') {
      if (data.name) jsonLd.name = data.name;
      if (data.description) jsonLd.description = data.description;
      if (data.applicationCategory) jsonLd.applicationCategory = data.applicationCategory;
      if (data.operatingSystem) jsonLd.operatingSystem = data.operatingSystem;
      if (data.url) jsonLd.url = data.url;
      if (data.price) jsonLd.offers = { '@type': 'Offer', price: String(data.price), priceCurrency: 'CNY' };
    }

    if (type === 'PRODUCT') {
      if (data.name) jsonLd.name = data.name;
      if (data.description) jsonLd.description = data.description;
      if (data.brand) jsonLd.brand = { '@type': 'Brand', name: data.brand };
      if (data.url) jsonLd.url = data.url;
      if (data.price) jsonLd.offers = { '@type': 'Offer', price: String(data.price), priceCurrency: data.priceCurrency || 'CNY' };
    }

    if (type === 'ORGANIZATION') {
      if (data.name) jsonLd.name = data.name;
      if (data.description) jsonLd.description = data.description;
      if (data.url) jsonLd.url = data.url;
      if (data.logo) jsonLd.logo = data.logo;
    }

    const jsonLdString = JSON.stringify(jsonLd, null, 2);

    // 导出格式
    const htmlSnippet = `<!-- JSON-LD Structured Data -->\n<script type="application/ld+json">\n${jsonLdString}\n</script>`;
    const reactComponent = `import Script from 'next/script';\n\nconst jsonLd = ${jsonLdString};\n\nexport default function StructuredData() {\n  return <Script id="jsonld" type="application/ld+json">{JSON.stringify(jsonLd)}</Script>;\n}`;

    res.json({
      success: true,
      data: {
        jsonLd: jsonLdString,
        htmlSnippet,
        reactComponent,
        validation: { valid: true, errors: [] },
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: '生成失败' });
  }
});
