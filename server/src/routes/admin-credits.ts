import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// 默认积分消耗配置
const DEFAULT_CREDIT_COSTS = [
  { key: 'geo_audit', label: 'GEO诊断', credits: 10, category: '优化功能', description: '全面检测网站AI搜索优化情况，生成详细报告' },
  { key: 'ai_content', label: 'AI内容生成', credits: 5, category: '内容生产', description: '使用AI生成高质量优化内容' },
  { key: 'competitor_analysis', label: '竞品分析', credits: 8, category: '数据分析', description: '分析竞品网站优化策略和关键词' },
  { key: 'rank_monitor', label: '排名监测', credits: 3, category: '数据监测', description: '监测关键词在AI搜索引擎中的排名' },
  { key: 'structured_data', label: '结构化标签生成', credits: 2, category: '优化功能', description: '自动生成结构化数据标签代码' },
  { key: 'batch_publish', label: '一键发布', credits: 15, category: '发布功能', description: '一键发布到多个平台' },
  { key: 'industry_template', label: '行业模板', credits: 20, category: '模板功能', description: '使用行业专属优化模板' },
  { key: 'traffic_clone', label: 'AI流量复刻', credits: 25, category: '高级功能', description: '抓取竞品流量词并生成对标内容' },
];

/**
 * 获取积分配置（管理员）
 */
router.get('/config', authenticate, async (req: any, res) => {
  try {
    // 检查用户是否是管理员
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: '无权访问' });
    }

    let config = await prisma.systemConfig.findUnique({
      where: { key: 'credit_costs' }
    });

    if (!config) {
      // 如果没有配置，创建默认配置
      config = await prisma.systemConfig.create({
        data: {
          key: 'credit_costs',
          value: JSON.stringify(DEFAULT_CREDIT_COSTS),
          description: '积分消耗配置'
        }
      });
    }

    const creditCosts = JSON.parse(config.value as string);
    
    res.json({ 
      success: true, 
      data: creditCosts 
    });
  } catch (error) {
    console.error('获取积分配置失败:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

/**
 * 保存积分配置（管理员）
 */
router.post('/config', authenticate, async (req: any, res) => {
  try {
    // 检查用户是否是管理员
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: '无权访问' });
    }

    const { creditCosts } = req.body;

    if (!Array.isArray(creditCosts)) {
      return res.status(400).json({ success: false, error: '无效的配置数据' });
    }

    // 验证配置数据格式
    for (const item of creditCosts) {
      if (!item.key || !item.label || typeof item.credits !== 'number') {
        return res.status(400).json({ success: false, error: '配置数据格式错误' });
      }
      if (item.credits < 0) {
        return res.status(400).json({ success: false, error: '积分消耗不能为负数' });
      }
    }

    await prisma.systemConfig.upsert({
      where: { key: 'credit_costs' },
      update: { 
        value: JSON.stringify(creditCosts),
        updatedAt: new Date()
      },
      create: {
        key: 'credit_costs',
        value: JSON.stringify(creditCosts),
        description: '积分消耗配置'
      }
    });

    res.json({ 
      success: true, 
      message: '配置保存成功' 
    });
  } catch (error) {
    console.error('保存积分配置失败:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

/**
 * 获取积分统计（管理员）
 */
router.get('/stats', authenticate, async (req: any, res) => {
  try {
    // 检查用户是否是管理员
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: '无权访问' });
    }

    // 总消耗积分
    const totalConsumed = await prisma.creditLog.aggregate({
      _sum: { credits: true },
      where: { credits: { lt: 0 } }
    });

    // 今日消耗
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayConsumed = await prisma.creditLog.aggregate({
      _sum: { credits: true },
      where: { 
        credits: { lt: 0 },
        createdAt: { gte: today }
      }
    });

    // 人均消耗
    const userCount = await prisma.user.count();
    const averagePerUser = userCount > 0 
      ? Math.abs(totalConsumed._sum.credits || 0) / userCount 
      : 0;

    // 最热门功能
    const featureUsage = await prisma.creditLog.groupBy({
      by: ['type'],
      _count: { type: true },
      where: { credits: { lt: 0 } },
      orderBy: { _count: { type: 'desc' } },
      take: 1
    });

    const topFeature = featureUsage.length > 0 ? featureUsage[0].type : '';

    res.json({
      success: true,
      data: {
        totalConsumed: Math.abs(totalConsumed._sum.credits || 0),
        todayConsumed: Math.abs(todayConsumed._sum.credits || 0),
        averagePerUser,
        topFeature
      }
    });
  } catch (error) {
    console.error('获取积分统计失败:', error);
    res.status(500).json({ success: false, error: '服务器错误' });
  }
});

export default router;
