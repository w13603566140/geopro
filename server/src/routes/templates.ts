import { Router, Request, Response } from 'express';

const router = Router();

// 行业模板包
const TEMPLATES = [
  {
    id: 'saas-enterprise',
    name: 'SaaS企业服务包',
    category: 'SaaS/软件',
    price: 999,
    originalPrice: 1999,
    rating: 4.9,
    sales: 1283,
    description: '面向B2B SaaS产品的全套GEO优化模板',
    includes: ['官网首页JSON-LD模板', '定价页面结构化标签', 'API文档Schema标记', '客户案例Schema模板', '竞品对比页面结构', '5篇AI优化文章模板'],
    downloadUrl: '/templates/saas-enterprise.zip',
  },
  {
    id: 'ecommerce-retail',
    name: '电商零售行业包',
    category: '电商/零售',
    price: 799,
    originalPrice: 1599,
    rating: 4.8,
    sales: 2156,
    description: '电商产品页优化模板',
    includes: ['商品详情页Schema', '评论评分结构化标签', '品牌故事页模板', '产品对比页面结构', 'FAQ问答库模板', '8篇电商文案模板'],
    downloadUrl: '/templates/ecommerce-retail.zip',
  },
  {
    id: 'health-medical',
    name: '医疗健康行业包',
    category: '医疗/健康',
    price: 1299,
    originalPrice: 2499,
    rating: 4.7,
    sales: 876,
    description: '符合医疗合规要求的GEO优化方案',
    includes: ['医疗机构Schema标记', '医生资质结构化数据', '医学科普文章模板', '在线问诊页面优化', '健康FAQ问答库', '10篇科普文章模板'],
    downloadUrl: '/templates/health-medical.zip',
  },
  {
    id: 'education-training',
    name: '教育培训行业包',
    category: '教育/培训',
    price: 699,
    originalPrice: 1399,
    rating: 4.8,
    sales: 1654,
    description: '教育培训机构专属模板',
    includes: ['课程Schema结构化标记', '讲师资质结构化数据', '学员评价展示模板', '在线课程页面优化', '教育FAQ问答库', '6篇招生文案模板'],
    downloadUrl: '/templates/education-training.zip',
  },
  {
    id: 'finance-insurance',
    name: '金融保险行业包',
    category: '金融/保险',
    price: 1599,
    originalPrice: 2999,
    rating: 4.6,
    sales: 542,
    description: '金融保险合规模板',
    includes: ['金融产品Schema标记', '合规风险提示模板', '理财计算器页面', '金融科普文章模板', '保险FAQ问答库', '8篇金融科普模板'],
    downloadUrl: '/templates/finance-insurance.zip',
  },
  {
    id: 'manufacturing',
    name: '智能制造行业包',
    category: '制造/工业',
    price: 1099,
    originalPrice: 2199,
    rating: 4.7,
    sales: 698,
    description: '工业制造企业GEO模板',
    includes: ['产品规格Schema标记', '行业解决方案页面', '客户案例展示模板', '技术白皮书结构', '工业FAQ问答库', '5篇技术文章模板'],
    downloadUrl: '/templates/manufacturing.zip',
  },
];

// 模拟已购买记录
const purchases: string[] = ['saas-enterprise'];

/**
 * GET /api/templates
 * 获取模板包列表
 */
router.get('/', async (req: Request, res: Response) => {
  const { category } = req.query;

  let filtered = TEMPLATES;
  if (category && category !== '全部') {
    filtered = TEMPLATES.filter(t => t.category === category);
  }

  return res.json({
    success: true,
    data: filtered.map(t => ({
      ...t,
      isPurchased: purchases.includes(t.id),
    })),
  });
});

/**
 * GET /api/templates/:id
 * 获取单个模板详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  const template = TEMPLATES.find(t => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ success: false, message: '模板不存在' });
  }

  return res.json({
    success: true,
    data: {
      ...template,
      isPurchased: purchases.includes(template.id),
    },
  });
});

/**
 * POST /api/templates/purchase
 * 购买模板包
 */
router.post('/purchase', async (req: Request, res: Response) => {
  const { templateId } = req.body;

  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    return res.status(404).json({ success: false, message: '模板不存在' });
  }

  if (purchases.includes(templateId)) {
    return res.status(400).json({ success: false, message: '已购买该模板' });
  }

  // 模拟购买流程
  purchases.push(templateId);
  template.sales += 1;

  return res.json({
    success: true,
    message: '购买成功',
    data: {
      templateId,
      downloadUrl: template.downloadUrl,
    },
  });
});

/**
 * GET /api/templates/categories
 * 获取模板分类
 */
router.get('/categories/list', async (_req: Request, res: Response) => {
  const categories = [...new Set(TEMPLATES.map(t => t.category))];
  return res.json({
    success: true,
    data: ['全部', ...categories],
  });
});

export default router;
