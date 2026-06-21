import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

// 支持的平台列表
const PLATFORMS = [
  { id: 'wechat', name: '微信公众号' },
  { id: 'zhihu', name: '知乎' },
  { id: 'csdn', name: 'CSDN' },
  { id: 'juejin', name: '掘金' },
  { id: 'jianshu', name: '简书' },
  { id: 'toutiao', name: '今日头条' },
  { id: 'b2b', name: 'B2B平台' },
  { id: 'media', name: '自媒体矩阵' },
];

// 模拟发布历史
const publishHistory: any[] = [];

/**
 * POST /api/publish/submit
 * 提交一键发布任务
 */
router.post(
  '/submit',
  [
    body('title').notEmpty().withMessage('标题不能为空'),
    body('content').notEmpty().withMessage('内容不能为空'),
    body('platforms').isArray({ min: 1 }).withMessage('至少选择一个平台'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, content, platforms } = req.body;
    const tasks: any[] = [];

    for (const platformId of platforms) {
      const platform = PLATFORMS.find(p => p.id === platformId);
      if (!platform) continue;

      // 模拟发布（生产环境对接各平台API）
      const task = {
        id: `${platformId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        platformId,
        platformName: platform.name,
        title,
        status: 'success' as const,
        url: `https://${platformId}.example.com/article/${Date.now()}`,
        publishedAt: new Date().toISOString(),
      };
      tasks.push(task);
    }

    publishHistory.push(...tasks);

    return res.json({
      success: true,
      data: {
        total: platforms.length,
        success: tasks.length,
        failed: 0,
        tasks,
      },
    });
  }
);

/**
 * GET /api/publish/history
 * 获取发布历史
 */
router.get('/history', async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: publishHistory.slice(-20).reverse(),
  });
});

/**
 * POST /api/publish/adapt
 * AI内容平台适配
 */
router.post('/adapt', async (req: Request, res: Response) => {
  const { content, platformId, title } = req.body;

  // 模拟AI适配逻辑
  let adaptedTitle = title;
  let adaptedContent = content;

  switch (platformId) {
    case 'zhihu':
      adaptedTitle = `${title} - 深度解析`;
      adaptedContent = `## 问题背景\n\n${content}\n\n## 总结\n\n以上分析仅供参考，欢迎讨论。`;
      break;
    case 'csdn':
      adaptedTitle = `【技术干货】${title}`;
      adaptedContent = `> 本文已收录至GEO优化助手Pro技术专栏\n\n${content}\n\n---\n*转载请注明出处*`;
      break;
    case 'toutiao':
      adaptedTitle = `🔥 ${title}`;
      adaptedContent = `${content}\n\n#GEO优化 #AI推荐`;
      break;
    default:
      break;
  }

  return res.json({
    success: true,
    data: { adaptedTitle, adaptedContent },
  });
});

export default router;
