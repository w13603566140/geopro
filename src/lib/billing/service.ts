/**
 * 计费与订阅服务
 * 处理套餐管理、积分扣费、订单处理
 */
import prisma from '@/lib/prisma';
import { PlanTier, PLAN_CONFIGS } from '@/types';

/**
 * 获取套餐配置
 */
export function getPlanConfig(tier: PlanTier) {
  return PLAN_CONFIGS.find(p => p.tier === tier) || PLAN_CONFIGS[0];
}

/**
 * 创建/更新订阅
 */
export async function createOrUpdateSubscription(
  userId: string,
  planTier: PlanTier,
  autoRenew: boolean = true
) {
  const config = getPlanConfig(planTier);

  // 取消现有订阅
  await prisma.subscription.updateMany({
    where: { userId, status: 'ACTIVE' },
    data: { status: 'CANCELLED' },
  });

  // 创建新订阅
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planTier,
      status: 'ACTIVE',
      autoRenew,
      maxSites: config.maxSites,
      maxDailyQueries: config.maxDailyQueries,
      maxContentDaily: config.maxContentDaily,
      endDate: planTier === PlanTier.FREE ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // 更新用户套餐等级
  await prisma.user.update({
    where: { id: userId },
    data: { planTier },
  });

  return subscription;
}

/**
 * 创建订单
 */
export async function createOrder(
  userId: string,
  amount: number,
  planTier: PlanTier,
  paymentMethod: string = 'alipay'
) {
  const order = await prisma.order.create({
    data: {
      userId,
      amount,
      currency: 'CNY',
      status: 'PENDING',
      paymentMethod,
    },
  });

  return order;
}

/**
 * 处理支付成功
 */
export async function processPaymentSuccess(orderId: string, transactionId: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'PAID',
      transactionId,
      paidAt: new Date(),
    },
    include: { user: true },
  });

  // 生成发票
  await prisma.invoice.create({
    data: {
      orderId: order.id,
      invoiceNumber: `INV-${Date.now()}-${order.userId.slice(0, 8)}`,
      amount: order.amount,
      taxAmount: Number(order.amount) * 0.06,
    },
  });

  return order;
}

/**
 * 积分充值
 */
export async function rechargeCredits(userId: string, amount: number, paymentMethod: string) {
  const order = await prisma.order.create({
    data: {
      userId,
      amount,
      currency: 'CNY',
      status: 'PENDING',
      paymentMethod,
    },
  });

  return order;
}

/**
 * 消费积分
 */
export async function consumeCredits(userId: string, amount: number, description: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  if (!user || user.credits < amount) {
    throw new Error(`积分不足，当前余额${user?.credits || 0}积分，需要${amount}积分`);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: amount } },
  });

  await prisma.creditTransaction.create({
    data: {
      userId,
      amount: -amount,
      balance: user.credits - amount,
      description,
      type: 'CONSUME',
    },
  });
}

/**
 * 获取用户套餐使用情况
 */
export async function getUserUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      sites: { select: { id: true } },
      subscription: { where: { status: 'ACTIVE' }, take: 1 },
    },
  });

  if (!user) throw new Error('用户不存在');

  return {
    planTier: user.planTier,
    credits: user.credits,
    sitesCount: user.sites.length,
    dailyQueriesUsed: user.dailyQueryUsed,
    contentQuota: user.contentQuota,
    subscription: user.subscription[0] || null,
  };
}

/**
 * 计费项定义
 */
export const BILLING_ITEMS = {
  SITE_AUDIT: { name: '全站体检', credits: 10, description: '单次全站GEO体检扫描' },
  STRUCTURED_DATA_GENERATE: { name: '结构化标签生成', credits: 5, description: '单个页面JSON-LD生成' },
  AI_RANKING_CHECK: { name: 'AI排名查询', credits: 2, description: '单个问句AI引擎排名查询' },
  CONTENT_GENERATE: { name: 'AI内容生成', credits: 5, description: '单篇GEO优化内容生成' },
  COMPETITOR_SCAN: { name: '竞品扫描', credits: 15, description: '单个竞品站点全盘分析' },
  BATCH_MONITORING: { name: '批量监测', credits: 20, description: '10个问句批量AI排名监测' },
  REPORT_EXPORT: { name: '报表导出', credits: 3, description: '单次PDF/CSV报表导出' },
};
