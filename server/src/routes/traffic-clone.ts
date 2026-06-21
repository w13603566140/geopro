import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * 分析竞品网站
 */
router.post('/analyze', authenticate, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: '请提供竞品网站URL' });
    }

    // 检查用户积分
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < 25) {
      return res.status(400).json({ 
        success: false, 
        error: '积分不足，需要25积分进行分析' 
      });
    }

    // 扣除积分
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 25 } }
    });

    // 记录积分消耗
    await prisma.creditLog.create({
      data: {
        userId,
        type: 'traffic_clone',
        credits: -25,
        description: `分析竞品网站: ${url}`
      }
    });

    // 提取域名
    let domain = '';
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname;
    } catch {
      domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    }

    // 模拟分析竞品数据（实际项目中需要调用SEO API或爬虫服务）
    const mockKeywords = [
      {
        keyword: 'SEO优化工具',
        volume: 12000,
        difficulty: 65,
        currentRank: null,
        competitorRank: 3,
        opportunity: 'high' as const
      },
      {
        keyword: '关键词排名查询',
        volume: 8500,
        difficulty: 58,
        currentRank: null,
        competitorRank: 5,
        opportunity: 'high' as const
      },
      {
        keyword: '网站流量分析',
        volume: 6200,
        difficulty: 72,
        currentRank: null,
        competitorRank: 8,
        opportunity: 'medium' as const
      },
      {
        keyword: 'AI内容生成器',
        volume: 4800,
        difficulty: 45,
        currentRank: null,
        competitorRank: 2,
        opportunity: 'high' as const
      },
      {
        keyword: '结构化数据标记',
        volume: 3500,
        difficulty: 38,
        currentRank: null,
        competitorRank: 4,
        opportunity: 'high' as const
      },
      {
        keyword: '竞品SEO分析',
        volume: 2800,
        difficulty: 52,
        currentRank: null,
        competitorRank: 6,
        opportunity: 'medium' as const
      },
      {
        keyword: '长尾关键词挖掘',
        volume: 2200,
        difficulty: 41,
        currentRank: null,
        competitorRank: 7,
        opportunity: 'high' as const
      },
      {
        keyword: '网站速度优化',
        volume: 1800,
        difficulty: 68,
        currentRank: null,
        competitorRank: 10,
        opportunity: 'low' as const
      },
      {
        keyword: '移动端SEO',
        volume: 1500,
        difficulty: 55,
        currentRank: null,
        competitorRank: 9,
        opportunity: 'medium' as const
      },
      {
        keyword: '语音搜索优化',
        volume: 1200,
        difficulty: 35,
        currentRank: null,
        competitorRank: 3,
        opportunity: 'high' as const
      }
    ];

    const mockContentGaps = [
      '缺少详细的SEO诊断报告功能',
      '没有AI驱动的内容优化工具',
      '缺乏批量关键词排名监测',
      '没有竞品流量复刻功能',
      '缺少结构化数据自动生成'
    ];

    const analysis = {
      url,
      domain,
      totalKeywords: Math.floor(Math.random() * 500) + 200,
      totalTraffic: Math.floor(Math.random() * 50000) + 10000,
      topKeywords: mockKeywords,
      contentGaps: mockContentGaps
    };

    res.json({ 
      success: true, 
      data: analysis,
      message: '竞品分析完成，消耗25积分'
    });
  } catch (error) {
    console.error('竞品分析失败:', error);
    res.status(500).json({ success: false, error: '分析失败，请稍后重试' });
  }
});

/**
 * 生成对标内容
 */
router.post('/generate', authenticate, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { competitorUrl, keywords } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ success: false, error: '请选择至少一个关键词' });
    }

    const totalCost = keywords.length * 5;

    // 检查用户积分
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < totalCost) {
      return res.status(400).json({ 
        success: false, 
        error: `积分不足，需要${totalCost}积分生成内容` 
      });
    }

    // 扣除积分
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: totalCost } }
    });

    // 记录积分消耗
    await prisma.creditLog.create({
      data: {
        userId,
        type: 'traffic_clone',
        credits: -totalCost,
        description: `生成对标内容: ${keywords.join(', ')}`
      }
    });

    // 生成对标内容（实际项目中需要调用AI API）
    let content = '# AI流量复刻 - 对标内容\n\n';
    content += `**竞品网站**: ${competitorUrl}\n`;
    content += `**目标关键词**: ${keywords.join(', ')}\n`;
    content += `**生成时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;
    content += '---\n\n';

    keywords.forEach((keyword: string, index: number) => {
      content += `## ${index + 1}. ${keyword}\n\n`;
      content += `### 标题建议\n`;
      content += `- ${keyword}完全指南：从入门到精通\n`;
      content += `- 2026年${keyword}最佳实践\n`;
      content += `- 如何用${keyword}提升网站流量\n\n`;
      
      content += `### 内容结构\n`;
      content += `1. **引言** - 介绍${keyword}的重要性和应用场景\n`;
      content += `2. **核心概念** - 详细解释${keyword}的基本原理\n`;
      content += `3. **实操步骤** - 手把手教学如何使用\n`;
      content += `4. **案例分析** - 真实案例展示效果\n`;
      content += `5. **常见问题** - FAQ解答\n`;
      content += `6. **总结** - 关键要点回顾\n\n`;
      
      content += `### SEO优化要点\n`;
      content += `- 标题包含关键词"${keyword}"\n`;
      content += `- H2/H3标签自然融入关键词\n`;
      content += `- 内容长度建议2000-3000字\n`;
      content += `- 添加相关图片和视频\n`;
      content += `- 内部链接到相关页面\n`;
      content += `- 添加结构化数据标记\n\n`;
      
      content += `### 差异化优势\n`;
      content += `- 提供更详细的操作指南\n`;
      content += `- 包含更多实际案例\n`;
      content += `- 提供免费下载资源\n`;
      content += `- 定期更新维护内容\n\n`;
      
      content += '---\n\n';
    });

    content += `## 下一步行动\n\n`;
    content += `1. 选择1-2个关键词优先创作\n`;
    content += `2. 按照内容结构撰写文章\n`;
    content += `3. 优化SEO元素（标题、描述、关键词密度）\n`;
    content += `4. 发布并推广内容\n`;
    content += `5. 监测排名和流量变化\n`;
    content += `6. 根据数据反馈持续优化\n`;

    res.json({ 
      success: true, 
      data: { content },
      message: `内容生成完成，消耗${totalCost}积分`
    });
  } catch (error) {
    console.error('生成对标内容失败:', error);
    res.status(500).json({ success: false, error: '生成失败，请稍后重试' });
  }
});

export default router;
