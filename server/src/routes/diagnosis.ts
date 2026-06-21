import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';
import { runAIDiagnosis, quickQuery, AI_MODELS } from '../services/ai-models';

export const diagnosisRouter = Router();

/**
 * 获取支持的AI模型列表
 */
diagnosisRouter.get('/models', (_req: AuthRequest, res: Response) => {
  const models = Object.entries(AI_MODELS).map(([key, config]) => ({
    key,
    name: config.name,
    icon: config.icon,
    company: config.company,
  }));
  res.json({ success: true, data: models });
});

/**
 * 执行AI可见度诊断（批量查询所有选中的AI模型）
 */
diagnosisRouter.post('/run', async (req: AuthRequest, res: Response) => {
  try {
    const { brandName, industryWords, siteUrl, platforms } = req.body;

    if (!brandName) throw new AppError('请填写品牌名称', 400);
    if (!industryWords || industryWords.length === 0) throw new AppError('请至少填写1个行业词', 400);
    if (!platforms || platforms.length === 0) throw new AppError('请至少选择1个AI平台', 400);

    // 限制行业词数量
    const words = Array.isArray(industryWords) ? industryWords.slice(0, 3) : [industryWords];

    const report = await runAIDiagnosis({
      brandName,
      industryWords: words,
      siteUrl: siteUrl || '',
      platforms,
    });

    res.json({ success: true, data: report });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '诊断失败: ' + error.message });
  }
});

/**
 * 快速单模型查询（模拟提问测试）
 */
diagnosisRouter.post('/quick-query', async (req: AuthRequest, res: Response) => {
  try {
    const { modelKey, question, brandName } = req.body;

    if (!modelKey || !question) throw new AppError('请选择模型并输入问句', 400);

    const result = await quickQuery(modelKey, question, brandName || '');

    res.json({ success: true, data: result });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '查询失败' });
  }
});
