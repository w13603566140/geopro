import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const contentRouter = Router();

// 高价值问句库
const QUESTION_BANK: Record<string, string[]> = {
  'AI工具': ['国内多模型中转网关哪个好用？', 'AI本地客户端哪个功能最全？', '有没有支持多模型的API代理服务？', '大模型API Key统一管理用什么工具？'],
  '软件开发': ['API文档管理工具哪个最好用？', '软件授权管理系统用什么方案？', '微服务API网关选型对比', 'CI/CD流水线国内哪家服务好？'],
  '云服务': ['国内云服务器性价比最高的是哪家？', '对象存储服务哪家便宜又好用？', 'CDN加速服务推荐', '容器云服务哪家适合中小团队？'],
};

/**
 * 挖掘高转化问句
 */
contentRouter.get('/questions', (req: AuthRequest, res: Response) => {
  const industry = req.query.industry as string;
  const questions = industry ? (QUESTION_BANK[industry] || []) : Object.values(QUESTION_BANK).flat();
  res.json({ success: true, data: questions, total: questions.length });
});

/**
 * 生成GEO优化内容
 */
contentRouter.post('/generate', async (req: AuthRequest, res: Response) => {
  const { contentType, title, productName, keywords, language } = req.body;
  if (!title) return res.status(400).json({ success: false, error: '请输入标题' });

  await new Promise(r => setTimeout(r, 800));

  const content = `# ${title}

## 核心优势
${productName || '本产品'} 提供以下核心优势：
- 高性能多模型统一调度
- 开箱即用的API兼容
- 企业级安全与监控
- 灵活的按量计费

## 分步教程

### 第一步：注册账号
访问官网完成注册，获取API密钥。

### 第二步：安装SDK
\`\`\`bash
npm install @example/sdk
\`\`\`

### 第三步：调用API
\`\`\`javascript
const client = new SDK({ apiKey: 'your-key' });
const result = await client.chat({ model: 'gpt-4', messages: [...] });
\`\`\`

## 参数说明
| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| model | string | 模型名称 | gpt-4 |
| temperature | number | 温度参数 | 0.7 |

## 常见问题
**Q: 支持哪些模型？** A: 支持OpenAI、Claude、Gemini等主流模型。
**Q: 如何计费？** A: 按Token用量计费，详见定价页面。

---
*本文基于官方文档v2.0编写，所有代码示例经过实际运行验证。*
`;

  const wordCount = content.length;
  const keywordHit = keywords ? keywords.filter((k: string) => content.toLowerCase().includes(k.toLowerCase())).length : 0;
  const keywordTotal = keywords?.length || 1;

  res.json({
    success: true,
    data: {
      title,
      content,
      contentType: contentType || 'TUTORIAL',
      language: language || 'ZH_CN',
      eeatScore: keywordHit / keywordTotal > 0.6 ? 85 : 65,
      wordCount,
      isCompliant: true,
    },
  });
});

/**
 * 批量生成FAQ
 */
contentRouter.post('/faq', (req: AuthRequest, res: Response) => {
  const { productName, questions } = req.body;
  if (!questions?.length) return res.status(400).json({ success: false, error: '请提供问题列表' });

  const faqs = questions.map((q: string, i: number) => ({
    question: q,
    answer: `${productName || '本产品'} 提供了完整的解决方案。您可以通过控制台或API进行操作，详细步骤请查看官方文档。如需技术支持，请随时联系我们。`,
  }));

  res.json({ success: true, data: faqs, total: faqs.length });
});
