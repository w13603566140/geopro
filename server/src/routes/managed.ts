import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

// 代运营套餐
const MANAGED_PLANS = [
  { id: 'basic', name: '基础代运营', price: 2999, period: '月' },
  { id: 'standard', name: '标准代运营', price: 7999, period: '月' },
  { id: 'enterprise', name: '企业代运营', price: 19999, period: '月' },
];

// 模拟订单存储
const orders: any[] = [
  {
    id: 'MO-20240601-001',
    planId: 'standard',
    planName: '标准代运营',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-07-01',
    amount: 7999,
    companyName: '示例科技有限公司',
    contactName: '张三',
    contactPhone: '13800138000',
    createdAt: '2024-05-28T10:00:00Z',
  },
];

/**
 * POST /api/managed/order
 * 提交代运营订单
 */
router.post(
  '/order',
  [
    body('planId').notEmpty().withMessage('请选择套餐'),
    body('companyName').notEmpty().withMessage('公司名称不能为空'),
    body('contactName').notEmpty().withMessage('联系人不能为空'),
    body('contactPhone').notEmpty().withMessage('联系电话不能为空'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { planId, companyName, contactName, contactPhone, contactEmail, productUrl, requirements, startDate } = req.body;

    const plan = MANAGED_PLANS.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ success: false, message: '无效的套餐' });
    }

    const order = {
      id: `MO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(orders.length + 1).padStart(3, '0')}`,
      planId: plan.id,
      planName: plan.name,
      status: 'pending',
      startDate: startDate || new Date().toISOString().slice(0, 10),
      endDate: '',
      amount: plan.price,
      companyName,
      contactName,
      contactPhone,
      contactEmail: contactEmail || '',
      productUrl: productUrl || '',
      requirements: requirements || '',
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    return res.json({
      success: true,
      data: order,
      message: '订单提交成功，客服将在24小时内与你联系',
    });
  }
);

/**
 * GET /api/managed/orders
 * 获取我的代运营订单
 */
router.get('/orders', async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: orders.reverse(),
  });
});

/**
 * GET /api/managed/plans
 * 获取代运营套餐列表
 */
router.get('/plans', async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: MANAGED_PLANS,
  });
});

export default router;
