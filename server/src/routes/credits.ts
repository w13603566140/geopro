import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 积分套餐配置
const creditPackages = [
  { id: 1, name: '体验包', credits: 100, price: 10, originalPrice: 15, bonus: null },
  { id: 2, name: '入门包', credits: 500, price: 45, originalPrice: 75, bonus: 50 },
  { id: 3, name: '标准包', credits: 2000, price: 160, originalPrice: 300, bonus: 300 },
  { id: 4, name: '专业包', credits: 5000, price: 375, originalPrice: 750, bonus: 1000 },
  { id: 5, name: '企业包', credits: 10000, price: 700, originalPrice: 1500, bonus: 2500 },
];

// 积分消耗配置（不同功能的消耗量）- 默认值，实际使用时从数据库读取
const DEFAULT_CREDIT_COSTS = {
  'GEO诊断': 10,
  'AI内容生成': 5,
  '竞品分析': 8,
  '排名监测': 3,
  '结构化标签生成': 2,
  '一键发布': 15,
  '行业模板': 20,
  'AI流量复刻': 25,
};

/**
 * 从数据库获取积分消耗配置
 */
async function getCreditCostsFromDB(): Promise<Record<string, number>> {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'credit_costs' }
    });

    if (!config) {
      return DEFAULT_CREDIT_COSTS;
    }

    const configData = JSON.parse(config.value as string);
    
    // 将配置数组转换为对象格式
    const costs: Record<string, number> = {};
    configData.forEach((item: any) => {
      costs[item.label] = item.credits;
    });

    return costs;
  } catch (error) {
    console.error('获取积分配置失败，使用默认值:', error);
    return DEFAULT_CREDIT_COSTS;
  }
}

/**
 * 获取用户积分余额
 */
router.get('/balance', async (req: any, res) => {
  try {
    const userId = req.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }

    res.json({ 
      success: true, 
      data: { 
        credits: user.credits || 0 
      } 
    });
  } catch (error) {
    console.error('获取积分余额失败:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

/**
 * 获取积分套餐列表
 */
router.get('/packages', async (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: creditPackages 
    });
  } catch (error) {
    console.error('获取积分套餐失败:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

/**
 * 创建充值订单
 */
router.post('/recharge', async (req: any, res) => {
  try {
    const userId = req.userId;
    const { packageId, paymentMethod } = req.body;

    const pkg = creditPackages.find(p => p.id === packageId);
    if (!pkg) {
      return res.status(400).json({ success: false, error: '无效的积分套餐' });
    }

    // 计算总积分（包含赠送）
    const totalCredits = pkg.credits + (pkg.bonus || 0);

    // 创建订单记录
    const order = await prisma.creditOrder.create({
      data: {
        userId,
        packageId,
        packageName: pkg.name,
        credits: totalCredits,
        amount: pkg.price,
        paymentMethod,
        status: 'pending',
      }
    });

    // 实际应用中这里应该调用支付宝/微信支付接口
    // 返回支付链接或二维码
    const mockPaymentUrl = `https://mock-payment.com/pay?orderId=${order.id}&amount=${pkg.price}`;

    res.json({ 
      success: true, 
      data: {
        orderId: order.id,
        paymentUrl: mockPaymentUrl,
        credits: totalCredits,
        amount: pkg.price
      }
    });
  } catch (error) {
    console.error('创建充值订单失败:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

/**
 * 消耗积分（被其他功能调用）
 */
router.post('/consume', async (req: any, res) => {
  try {
    const userId = req.userId;
    const { type, site, credits: customCredits } = req.body;

    // 从数据库获取积分消耗配置
    const creditCosts = await getCreditCostsFromDB();
    
    // 获取消耗量（如果自定义则使用自定义值，否则使用配置值）
    const credits = customCredits || creditCosts[type];
    
    if (!credits) {
      return res.status(400).json({ success: false, error: '无效的功能类型' });
    }

    // 检查用户积分是否足够
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    if (!user || user.credits < credits) {
      return res.status(400).json({ 
        success: false, 
        error: '积分不足，请先充值',
        currentCredits: user?.credits || 0,
        requiredCredits: credits
      });
    }

    // 扣除积分
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: credits } }
    });

    // 记录消费日志
    await prisma.creditLog.create({
      data: {
        userId,
        type,
        credits: -credits,
        site: site || '',
      }
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true }
    });

    res.json({ 
      success: true, 
      data: {
        consumedCredits: credits,
        remainingCredits: updatedUser?.credits || 0
      }
    });
  } catch (error) {
    console.error('消耗积分失败:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

/**
 * 获取积分使用记录
 */
router.get('/history', async (req: any, res) => {
  try {
    const userId = req.userId;
    const { page = 1, pageSize = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);

    const [logs, total] = await Promise.all([
      prisma.creditLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(pageSize),
      }),
      prisma.creditLog.count({ where: { userId } })
    ]);

    res.json({ 
      success: true, 
      data: {
        logs,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize))
      }
    });
  } catch (error) {
    console.error('获取积分记录失败:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

/**
 * 获取积分消耗配置
 */
router.get('/costs', async (req, res) => {
  try {
    const creditCosts = await getCreditCostsFromDB();
    res.json({ 
      success: true, 
      data: creditCosts 
    });
  } catch (error) {
    console.error('获取积分消耗配置失败:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

export default router;
