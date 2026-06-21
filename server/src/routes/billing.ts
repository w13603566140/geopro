import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { AppError } from '../middleware/error-handler';

export const billingRouter = Router();

const PLAN_CONFIGS = [
  { tier: 'FREE', name: '免费引流版', price: 0, priceUnit: '永久免费', maxSites: 1, maxDailyQueries: 3, maxContentDaily: 5 },
  { tier: 'PROFESSIONAL', name: '专业订阅版', price: 299, priceUnit: '元/月', maxSites: 20, maxDailyQueries: 50, maxContentDaily: 50 },
  { tier: 'ENTERPRISE', name: '企业年费版', price: 2999, priceUnit: '元/年', maxSites: 999, maxDailyQueries: 999, maxContentDaily: 999 },
];

const CREDIT_COSTS = {
  siteAudit: 10, structuredData: 5, aiRankingCheck: 2, contentGenerate: 5, competitorScan: 15, batchMonitoring: 20, reportExport: 3,
};

/**
 * 获取套餐列表
 */
billingRouter.get('/plans', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: PLAN_CONFIGS });
});

/**
 * 获取积分消耗规则
 */
billingRouter.get('/credit-costs', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: CREDIT_COSTS });
});

/**
 * 获取用户使用情况
 */
billingRouter.get('/usage', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { planTier: true, credits: true, dailyQueryUsed: true, contentQuota: true },
    });

    if (!user) throw new AppError('用户不存在', 404);

    const siteCount = await prisma.site.count({ where: { userId: req.userId } });

    res.json({
      success: true,
      data: {
        planTier: user.planTier,
        credits: user.credits,
        sitesCount: siteCount,
        dailyQueriesUsed: user.dailyQueryUsed,
        contentQuota: user.contentQuota,
        planConfig: PLAN_CONFIGS.find(p => p.tier === user.planTier),
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: '获取使用情况失败' });
  }
});

/**
 * 升级套餐
 */
billingRouter.post('/upgrade', async (req: AuthRequest, res: Response) => {
  try {
    const { planTier } = req.body;
    if (!planTier || !['FREE', 'PROFESSIONAL', 'ENTERPRISE'].includes(planTier)) {
      throw new AppError('无效的套餐类型', 400);
    }

    const config = PLAN_CONFIGS.find(p => p.tier === planTier)!;

    await prisma.subscription.updateMany({
      where: { userId: req.userId, status: 'ACTIVE' },
      data: { status: 'CANCELLED' },
    });

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.userId!,
        planTier,
        status: 'ACTIVE',
        autoRenew: true,
        maxSites: config.maxSites,
        maxDailyQueries: config.maxDailyQueries,
        maxContentDaily: config.maxContentDaily,
        endDate: planTier === 'FREE' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.user.update({ where: { id: req.userId }, data: { planTier } });

    res.json({ success: true, data: subscription, message: '套餐升级成功' });
  } catch (error: any) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: '套餐升级失败' });
  }
});

/**
 * 积分充值
 */
billingRouter.post('/recharge', async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) throw new AppError('充值金额无效', 400);

    // 创建订单
    const order = await prisma.order.create({
      data: { userId: req.userId!, amount, currency: 'CNY', status: 'PENDING', paymentMethod: 'alipay' },
    });

    res.json({ success: true, data: order, message: '订单已创建，请完成支付' });
  } catch (error: any) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: '创建订单失败' });
  }
});

/**
 * 订单列表
 */
billingRouter.get('/orders', async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取订单失败' });
  }
});
