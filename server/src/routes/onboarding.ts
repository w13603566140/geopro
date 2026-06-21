import { Router, Request, Response } from 'express';

const router = Router();

// 引导步骤配置
const STEPS = [
  { id: 1, title: '产品信息', key: 'productInfo' },
  { id: 2, title: '目标关键词', key: 'keywords' },
  { id: 3, title: '竞品分析', key: 'competitors' },
  { id: 4, title: '功能预览', key: 'features' },
  { id: 5, title: '完成配置', key: 'complete' },
];

// 模拟引导数据存储
const onboardingData: Record<string, any> = {};

/**
 * GET /api/onboarding/status
 * 获取引导状态
 */
router.get('/status', async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || 'demo';
  return res.json({
    success: true,
    data: {
      completed: !!onboardingData[userId]?.completed,
      step: onboardingData[userId]?.step || 1,
      data: onboardingData[userId] || null,
    },
  });
});

/**
 * GET /api/onboarding/steps
 * 获取引导步骤列表
 */
router.get('/steps', async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: STEPS,
  });
});

/**
 * POST /api/onboarding/save
 * 保存引导进度
 */
router.post('/save', async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || 'demo';
  const { step, data } = req.body;

  if (!onboardingData[userId]) {
    onboardingData[userId] = {};
  }

  onboardingData[userId] = {
    ...onboardingData[userId],
    step,
    data: { ...onboardingData[userId]?.data, ...data },
    updatedAt: new Date().toISOString(),
  };

  return res.json({
    success: true,
    data: onboardingData[userId],
    message: '进度已保存',
  });
});

/**
 * POST /api/onboarding/complete
 * 完成新手引导
 */
router.post('/complete', async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || 'demo';
  const { data } = req.body;

  onboardingData[userId] = {
    ...onboardingData[userId],
    ...data,
    completed: true,
    completedAt: new Date().toISOString(),
  };

  return res.json({
    success: true,
    data: onboardingData[userId],
    message: '新手引导已完成',
  });
});

/**
 * POST /api/onboarding/reset
 * 重置引导
 */
router.post('/reset', async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || 'demo';
  delete onboardingData[userId];

  return res.json({
    success: true,
    message: '引导已重置',
  });
});

export default router;
