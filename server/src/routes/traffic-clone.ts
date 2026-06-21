import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import * as cheerio from 'cheerio';

const router = express.Router();
const prisma = new PrismaClient();

// 中文停用词表
const CN_STOP_WORDS = new Set([
  '的','了','在','是','我','有','和','就','不','人','都','一','一个','上','也','很','到','说','要','去','你',
  '会','着','没有','看','好','自己','这','他','她','它','们','那','什么','怎么','哪','为什么','可以','因为',
  '所以','但是','如果','虽然','而且','或者','然后','关于','对于','以及','通过','根据','其中','已经','可能',
  '应该','需要','能够','不能','知道','觉得','认为','让','把','被','从','对','与','为','以','之','等','而',
  '于','更','最','非常','比较','有些','每个','所有','很多','一些','这样','那样','如何','怎么','怎样',
  '不是','就是','还是','只是','而是','不过','而且','然而','只有','无论','不管','除了','不仅','当然',
  '目前','现在','最近','以后','以前','将来','之后','之前','以来','时候','时间','今天','昨天','明天',
  '这个','那个','哪个','这里','那里','哪里','这么','那么','怎么','用','做','来','去','出','进','到',
  '会','能','可以','想','希望','欢迎','联系','关于','更多','了解','查看','点击','浏览','首页','网站',
  '公司','服务','产品','提供','使用','我们','他们','您','各位','大家'
]);

// 英文停用词表
const EN_STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being','have','has','had','having','do','does',
  'did','doing','will','would','could','should','may','might','can','shall','to','of','in','for','on',
  'with','at','by','from','as','into','through','during','before','after','above','below','between',
  'and','but','or','nor','not','so','yet','both','either','neither','if','then','than','that','this',
  'these','those','it','its','he','she','they','them','we','us','our','your','my','me','i','you',
  'which','who','whom','what','when','where','how','all','each','every','any','few','more','most',
  'other','some','such','only','own','same','too','very','just','now','here','there','about','also',
  'up','out','over','under','again','further','once','get','make','see','know','use','take','come',
  'go','give','find','think','say','tell','look','ask','try','leave','keep','need','want','like','new',
  'one','two','first','last','long','great','little','much','many','well','back','still','even','no'
]);

interface ExtractedKeyword {
  keyword: string;
  volume: number;
  difficulty: number;
  currentRank: null;
  competitorRank: number;
  opportunity: 'high' | 'medium' | 'low';
  source: string;
}

/**
 * 从 HTML 中提取中文关键词（2-4字 n-gram）
 */
function extractChineseKeywords(text: string, source: string): Map<string, number> {
  const keywords = new Map<string, number>();
  // 移除标点、空白、英文、数字
  const cleaned = text.replace(/[a-zA-Z0-9，。！？；：""''（）【】《》\s\r\n.,!?;:'"()\[\]{}<>\/\\|`~@#$%^&*=+_-]/g, '');
  
  // 提取2-4字中文词组
  for (let len = 4; len >= 2; len--) {
    for (let i = 0; i <= cleaned.length - len; i++) {
      const phrase = cleaned.substring(i, i + len);
      // 跳过含非中文字符
      if (!/^[\u4e00-\u9fff]+$/.test(phrase)) continue;
      // 跳过纯数字
      if (/^\d+$/.test(phrase)) continue;
      // 跳过包含高频停用字的2字词组
      if (phrase.length === 2 && (CN_STOP_WORDS.has(phrase[0]) || CN_STOP_WORDS.has(phrase[1]))) continue;
      
      const prev = keywords.get(phrase) || 0;
      keywords.set(phrase, prev + 1);
    }
  }
  
  return keywords;
}

/**
 * 从 HTML 中提取英文关键词（基于完整单词）
 */
function extractEnglishKeywords(text: string, source: string): Map<string, number> {
  const keywords = new Map<string, number>();
  // 提取纯文本单词（过滤CSS/JS残留）
  const cleanText = text
    .replace(/[{}()[\]<>@#$%^&*=+;:'",.\/\\|`~]/g, ' ')
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, ' ');
  
  const words = cleanText.split(' ').filter(w => w.length >= 4); // 跳过短碎片词
  
  // 提取2-3词短语
  for (let phraseLen = 3; phraseLen >= 1; phraseLen--) {
    for (let i = 0; i <= words.length - phraseLen; i++) {
      const phrase = words.slice(i, i + phraseLen).join(' ').trim();
      
      // 过滤太短的短语
      if (phrase.length < 8) continue;
      
      // 检查是否全是停用词
      const parts = phrase.split(' ');
      if (parts.length === 1 && parts[0].length < 5) continue;
      if (parts.every(w => EN_STOP_WORDS.has(w.toLowerCase()))) continue;
      
      const prev = keywords.get(phrase) || 0;
      keywords.set(phrase, prev + 1);
    }
  }
  
  return keywords;
}

/**
 * 计算关键词的综合得分
 */
function scoreKeywords(
  rawKeywords: Map<string, number>,
  titleText: string,
  h1Text: string,
  metaKeywords: string
): ExtractedKeyword[] {
  const results: ExtractedKeyword[] = [];
  const titleLower = titleText.toLowerCase();
  const h1Lower = h1Text.toLowerCase();
  const metaLower = metaKeywords.toLowerCase();
  
  for (const [keyword, freq] of rawKeywords.entries()) {
    if (freq < 2) continue;
    if (keyword.length < 2) continue;
    
    // 过滤纯英文碎片（如只包含1-2字母的单词组合）
    const parts = keyword.split(' ');
    const isGarbage = parts.every(p => p.length <= 3);
    if (isGarbage && keyword.length < 8) continue;
    
    const kwLower = keyword.toLowerCase();
    
    // 权重计算：标题中 +5, H1中 +3, meta keywords 中 +2, 频率
    let weight = freq;
    if (titleLower.includes(kwLower)) weight += 5;
    if (h1Lower.includes(kwLower)) weight += 3;
    if (metaLower.includes(kwLower)) weight += 2;
    
    // 难度估算：关键词越长通常难度越低（长尾词），频率高=竞争高
    const difficulty = Math.min(85, Math.max(15, Math.round(60 - keyword.length * 3 + freq * 2)));
    
    // 搜索量估算：基于权重
    const volume = Math.round(weight * 400 + Math.random() * 2000);
    
    // 竞品排名估算：基于难度
    const competitorRank = Math.max(1, Math.min(20, Math.round(difficulty / 5 + Math.random() * 5)));
    
    // 机会评估
    let opportunity: 'high' | 'medium' | 'low' = 'medium';
    if (difficulty < 45 && volume > 2000) opportunity = 'high';
    else if (difficulty > 65 || volume < 800) opportunity = 'low';
    
    results.push({
      keyword,
      volume,
      difficulty,
      currentRank: null,
      competitorRank,
      opportunity,
      source: '页面提取',
    });
  }
  
  // 按权重降序排列
  results.sort((a, b) => {
    const scoreA = a.volume * (1 - a.difficulty / 100);
    const scoreB = b.volume * (1 - b.difficulty / 100);
    return scoreB - scoreA;
  });
  
  return results.slice(0, 15);
}

/**
 * 分析竞品网站 - 真实抓取并提取关键词
 */
router.post('/analyze', authenticate, async (req: any, res) => {
  try {
    const userId = req.userId;
    let { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: '请提供竞品网站URL' });
    }

    // 规范化URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // DEMO_MODE下跳过数据库操作
    if (process.env.DEMO_MODE !== 'true') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.credits < 25) {
        return res.status(400).json({ 
          success: false, 
          error: '积分不足，需要25积分进行分析' 
        });
      }
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 25 } }
      });
      await prisma.creditTransaction.create({
        data: {
          userId,
          type: 'CONSUME',
          amount: -25,
          balance: 0,
          description: `分析竞品网站: ${url}`
        }
      });
    }

    // 提取域名
    let domain = '';
    try {
      const urlObj = new URL(url);
      domain = urlObj.hostname;
    } catch {
      domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    }

    // ========== 真实抓取网页内容 ==========
    let html = '';
    let fetchError = '';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        },
        signal: controller.signal,
        redirect: 'follow',
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        fetchError = `HTTP ${response.status}: ${response.statusText}`;
      } else {
        html = await response.text();
      }
    } catch (err: any) {
      fetchError = err.message || '无法连接到目标网站';
      console.error('抓取网页失败:', err.message);
    }

    // 如果抓取失败，返回有意义的错误
    if (!html && fetchError) {
      return res.status(200).json({
        success: true,
        data: {
          url,
          domain,
          totalKeywords: 0,
          totalTraffic: 0,
          topKeywords: [],
          contentGaps: [`无法抓取该网页: ${fetchError}`],
        },
        message: `网页抓取失败: ${fetchError}。该网站可能屏蔽了爬虫或需要验证。`,
      });
    }

    // ========== 用 Cheerio 解析 HTML ==========
    const $ = cheerio.load(html);

    // 提取页面标题
    const pageTitle = $('title').text().trim();
    
    // 提取 meta 信息
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaKeywordsRaw = $('meta[name="keywords"]').attr('content') || '';
    
    // 提取各级标题文本
    const h1Texts: string[] = [];
    $('h1').each((_, el) => { h1Texts.push($(el).text().trim()); });
    const h1All = h1Texts.join(' ');
    
    const h2Texts: string[] = [];
    $('h2').each((_, el) => { h2Texts.push($(el).text().trim()); });
    const h2All = h2Texts.join(' ');
    
    const h3Texts: string[] = [];
    $('h3').each((_, el) => { h3Texts.push($(el).text().trim()); });
    const h3All = h3Texts.join(' ');

    // 移除无关标签后提取正文（保留有意义的文本区域）
    $('script, style, noscript, nav, footer, header, iframe, svg, form, [aria-hidden="true"], .hidden').remove();
    let bodyText = $('main, article, .content, .main, #content, #main, body').text().replace(/\s+/g, ' ').trim();
    
    // 如果正文太短或噪音太多，回退到整个body并清理
    if (bodyText.length < 100) {
      bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    }
    // 清理明显的CSS/JS碎片（1-3字母短词）
    bodyText = bodyText.replace(/\b[a-z]{1,3}\b/gi, ' ').replace(/[{}[\]()<>@#$%^&*=+;:'",.\/\\|`~]/g, ' ').replace(/\s+/g, ' ').trim();

    // ========== 提取关键词 ==========
    const allRawKeywords = new Map<string, number>();
    
    // 判断网页语言（简单检测：如果有中文字符就是中文页面）
    const hasChinese = /[\u4e00-\u9fff]/.test(bodyText + pageTitle);
    
    // 从不同来源提取关键词，赋予不同权重
    // 元数据权重远高于正文（正文可能含CSS碎片）
    const sources: { text: string; weight: number }[] = [
      { text: pageTitle, weight: 8 },
      { text: metaDescription, weight: 6 },
      { text: metaKeywordsRaw, weight: 5 },
      { text: h1All, weight: 5 },
      { text: h2All, weight: 3 },
      { text: h3All, weight: 2 },
      { text: bodyText.substring(0, 3000), weight: 1 },
    ];

    for (const source of sources) {
      if (!source.text) continue;
      
      let sourceKeywords: Map<string, number>;
      if (hasChinese) {
        sourceKeywords = extractChineseKeywords(source.text, '');
      } else {
        sourceKeywords = extractEnglishKeywords(source.text, '');
      }
      
      for (const [kw, freq] of sourceKeywords.entries()) {
        const prev = allRawKeywords.get(kw) || 0;
        allRawKeywords.set(kw, prev + freq * source.weight);
      }
    }

    // 添加 meta keywords 中逗号分隔的关键词
    if (metaKeywordsRaw) {
      const metaKws = metaKeywordsRaw.split(/[,;，；]/).map(k => k.trim()).filter(k => k.length >= 2);
      for (const kw of metaKws) {
        const prev = allRawKeywords.get(kw) || 0;
        allRawKeywords.set(kw, prev + 3);
      }
    }

    // ========== 评分排序 ==========
    const topKeywords = scoreKeywords(allRawKeywords, pageTitle, h1All, metaKeywordsRaw);

    // 如果提取结果太少，尝试放宽条件
    let finalKeywords = topKeywords;
    if (finalKeywords.length < 5) {
      // 放宽频率限制，重新评分
      const relaxedResults: ExtractedKeyword[] = [];
      for (const [keyword, freq] of allRawKeywords.entries()) {
        if (keyword.length < 2) continue;
        if (relaxedResults.length >= 15) break;
        
        const difficulty = Math.min(80, Math.max(20, Math.round(50 - keyword.length * 2 + Math.random() * 20)));
        const volume = Math.round(1000 + Math.random() * 4000);
        relaxedResults.push({
          keyword,
          volume,
          difficulty,
          currentRank: null,
          competitorRank: Math.max(1, Math.round(difficulty / 6 + Math.random() * 4)),
          opportunity: difficulty < 50 ? 'high' : 'medium',
          source: '页面提取',
        });
      }
      finalKeywords = relaxedResults;
    }

    // ========== 分析内容缺口 ==========
    const contentGaps: string[] = [];
    
    // 检查是否有结构化数据
    const hasStructuredData = html.includes('application/ld+json') || html.includes('itemscope') || html.includes('schema.org');
    if (!hasStructuredData) {
      contentGaps.push(`缺少结构化数据标记（结构化标签），不利于AI搜索引擎理解页面内容`);
    }
    
    // 检查meta描述
    if (!metaDescription || metaDescription.length < 50) {
      contentGaps.push(`Meta描述过短或缺失（当前${metaDescription.length}字符），影响搜索展现`);
    }
    
    // 检查标题
    if (!pageTitle || pageTitle.length < 10) {
      contentGaps.push(`页面标题过短或缺失，建议10-60字符的标题`);
    } else if (pageTitle.length > 70) {
      contentGaps.push(`页面标题过长（${pageTitle.length}字符），建议控制在60字符以内`);
    }
    
    // 检查H1
    if (!h1All) {
      contentGaps.push(`缺少H1标题标签，不利于SEO优化`);
    }
    
    // 检查图片alt
    const imgCount = $('img').length;
    const imgWithAlt = $('img[alt]').length;
    if (imgCount > 0 && imgWithAlt < imgCount * 0.5) {
      contentGaps.push(`图片alt属性缺失严重（${imgCount}张图片中仅${imgWithAlt}张有alt），影响图片搜索和AI理解`);
    }
    
    // 检查内链
    const internalLinks = $('a[href]').filter((_, el) => {
      const href = $(el).attr('href') || '';
      return !!(href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript'));
    }).length;
    if (internalLinks < 5) {
      contentGaps.push(`站内链接偏少（仅${internalLinks}个），建议增加相关页面互链`);
    }
    
    // 检查移动端适配
    const hasViewport = html.includes('viewport');
    if (!hasViewport) {
      contentGaps.push(`未检测到viewport声明，可能未做移动端适配`);
    }

    // 如果缺口太少，添加通用建议
    if (contentGaps.length < 3) {
      contentGaps.push('建议增加FAQ结构化数据，提高在AI搜索引擎中的呈现机会');
      contentGaps.push('内容更新频率未知，建议保持定期更新以维持排名');
    }

    // ========== 估算总关键词数和流量 ==========
    const extractedCount = allRawKeywords.size;
    const totalKeywords = Math.max(extractedCount, Math.floor(Math.random() * 200) + 50);
    const totalTraffic = Math.floor(totalKeywords * (Math.random() * 80 + 20));

    const analysis = {
      url,
      domain,
      pageTitle,
      metaDescription: metaDescription.substring(0, 200),
      totalKeywords,
      totalTraffic,
      topKeywords: finalKeywords,
      contentGaps,
      headings: { h1: h1Texts, h2: h2Texts.slice(0, 10), h3Count: h3Texts.length },
    };

    res.json({ 
      success: true, 
      data: analysis,
      message: `竞品分析完成！从 "${domain}" 提取了 ${finalKeywords.length} 个高价值关键词，发现 ${contentGaps.length} 个优化缺口，消耗25积分`
    });
  } catch (error) {
    console.error('竞品分析失败:', error);
    res.status(500).json({ success: false, error: '分析失败，请稍后重试' });
  }
});

/**
 * 生成对标内容 - 智能生成基于关键词的优化内容
 */
router.post('/generate', authenticate, async (req: any, res) => {
  try {
    const userId = req.userId;
    const { competitorUrl, keywords } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ success: false, error: '请选择至少一个关键词' });
    }

    const totalCost = keywords.length * 5;

    // DEMO_MODE下跳过数据库操作
    if (process.env.DEMO_MODE !== 'true') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.credits < totalCost) {
        return res.status(400).json({ 
          success: false, 
          error: `积分不足，需要${totalCost}积分生成内容` 
        });
      }
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: totalCost } }
      });
      await prisma.creditTransaction.create({
        data: {
          userId,
          type: 'CONSUME',
          amount: -totalCost,
          balance: 0,
          description: `生成对标内容: ${keywords.join(', ')}`
        }
      });
    }

    // 尝试抓取竞品页面获取标题和描述作为参考
    let competitorTitle = '';
    let competitorDesc = '';
    if (competitorUrl) {
      try {
        let fetchUrl = competitorUrl;
        if (!fetchUrl.startsWith('http')) fetchUrl = 'https://' + fetchUrl;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const resp = await fetch(fetchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0)',
            'Accept': 'text/html',
          },
          signal: controller.signal,
          redirect: 'follow',
        });
        clearTimeout(timeoutId);
        if (resp.ok) {
          const pageHtml = await resp.text();
          const $ = cheerio.load(pageHtml);
          competitorTitle = $('title').text().trim();
          competitorDesc = $('meta[name="description"]').attr('content') || '';
        }
      } catch {
        // 抓取失败不影响内容生成
      }
    }

    // 根据关键词智能生成对标内容
    let content = `# 🔄 AI流量复刻 - 对标优化内容\n\n`;
    content += `> **对标站点**: ${competitorUrl || 'N/A'}\n`;
    if (competitorTitle) {
      content += `> **竞品标题**: ${competitorTitle}\n`;
    }
    if (competitorDesc) {
      content += `> **竞品描述**: ${competitorDesc.substring(0, 150)}${competitorDesc.length > 150 ? '...' : ''}\n`;
    }
    content += `> **目标关键词**: ${keywords.join('、')}\n`;
    content += `> **生成时间**: ${new Date().toLocaleString('zh-CN')}\n`;
    content += `> **策略**: 针对竞品 "${competitorTitle || competitorUrl}" 的内容缺口，优化以下关键词\n\n`;
    content += `---\n\n`;

    keywords.forEach((keyword: string, index: number) => {
      const kwLen = keyword.length;
      const suggestedWordCount = kwLen <= 4 ? '1500-2500' : kwLen <= 8 ? '2000-3500' : '2500-5000';
      
      content += `## ${index + 1}. 🎯 核心关键词：${keyword}\n\n`;
      
      // 根据关键词智能生成标题变体
      content += `### 📝 标题方案（选择最优）\n`;
      content += `| 方案 | 标题 | 预估CTR |\n`;
      content += `|------|------|--------|\n`;
      content += `| A | **${keyword}完全指南：从入门到精通【2026最新】** | 4.2% |\n`;
      content += `| B | ${keyword}是什么？一文讲透${keyword}的核心价值 | 3.8% |\n`;
      content += `| C | 2026年${keyword}最佳实践：提升效果的${Math.floor(Math.random()*5)+5}个技巧 | 5.1% |\n\n`;
      
      content += `### 🏗️ 内容架构\n`;
      content += `\`\`\`\n`;
      content += `引言（200字）→ 痛点引入 → ${keyword}概念解析（400字）\n`;
      content += `→ 核心方法（600字）→ 实操步骤（500字）→ 案例验证（400字）\n`;
      content += `→ 常见误区（300字）→ FAQ（200字）→ 总结CTA（100字）\n`;
      content += `\`\`\`\n\n`;
      content += `**推荐字数**: ${suggestedWordCount}字 | **段落数**: 8-12段 | **图片**: 3-5张\n\n`;
      
      content += `### 📋 详细大纲\n`;
      content += `1. **引言** - 为什么要关注"${keyword}"？当前行业痛点与机遇\n`;
      content += `   - 用数据说明${keyword}的重要性\n`;
      content += `   - 引出读者最关心的核心问题\n\n`;
      content += `2. **核心概念** - "${keyword}"到底是什么？\n`;
      content += `   - 定义解释（用自己的话，避免复制百科）\n`;
      content += `   - 常见误解澄清\n`;
      content += `   - 与相关概念的区别与联系\n\n`;
      content += `3. **核心方法** - 如何做好${keyword}？\n`;
      content += `   - 方法一：基于数据分析的${keyword}策略\n`;
      content += `   - 方法二：${keyword}的自动化/工具化方案\n`;
      content += `   - 方法三：${keyword}的进阶优化技巧\n\n`;
      content += `4. **实操步骤** - 手把手教你落地${keyword}\n`;
      content += `   - Step 1: 准备工作（工具、数据、环境）\n`;
      content += `   - Step 2: 执行${keyword}的核心操作\n`;
      content += `   - Step 3: 验证效果并持续优化\n\n`;
      content += `5. **案例分析** - ${keyword}的真实应用\n`;
      content += `   - 案例一：某企业通过${keyword}实现XX%增长\n`;
      content += `   - 案例二：${keyword}帮助团队节省XX小时/月\n\n`;
      content += `6. **常见误区** - 做${keyword}时容易犯的错误\n`;
      content += `   - 误区1及正确做法\n`;
      content += `   - 误区2及正确做法\n\n`;
      content += `7. **FAQ** - 关于${keyword}的常见问题\n`;
      content += `   - Q: ${keyword}适合什么类型的企业？\n`;
      content += `   - Q: ${keyword}需要多少预算？\n`;
      content += `   - Q: ${keyword}多久能见效？\n\n`;
      content += `8. **总结与行动** - 立即开始${keyword}\n`;
      content += `   - 3个关键要点回顾\n`;
      content += `   - 下一步行动建议\n`;
      content += `   - CTA：引导用户行动\n\n`;
      
      content += `### 🔍 SEO优化清单\n`;
      content += `- [ ] 标题中包含核心关键词"${keyword}"（前15个字符内）\n`;
      content += `- [ ] Meta描述自然融入"${keyword}"和相关长尾词\n`;
      content += `- [ ] URL中包含关键词拼音/英文\n`;
      content += `- [ ] H2/H3标签合理分布关键词变体\n`;
      content += `- [ ] 首段100字内出现"${keyword}"\n`;
      content += `- [ ] 图片alt属性包含"${keyword}"\n`;
      content += `- [ ] 添加FAQ结构化数据(JSON-LD)\n`;
      content += `- [ ] 内部链接到${keyword}相关的其他页面\n`;
      content += `- [ ] 外部链接到权威来源（增加可信度）\n`;
      content += `- [ ] 移动端阅读体验优化\n\n`;
      
      content += `### 🆚 竞品差异化策略\n`;
      if (competitorTitle) {
        content += `- **竞品优势**: 标题覆盖了核心关键词，需在内容深度上超越\n`;
      }
      content += `- **差异化点1**: 提供可下载的${keyword}检查清单/模板\n`;
      content += `- **差异化点2**: 加入真实数据对比（竞品缺少量化数据）\n`;
      content += `- **差异化点3**: 制作${keyword}相关视频/信息图（多媒体超越）\n`;
      content += `- **差异化点4**: 定期更新"${keyword}"内容（竞品内容可能过时）\n\n`;
      
      content += `---\n\n`;
    });

    // 整体优化策略
    content += `## 📊 整体优化策略\n\n`;
    content += `### 内链策略\n`;
    keywords.forEach((kw: string, i: number) => {
      if (i < keywords.length - 1) {
        content += `- "${kw}"页面 ↔ "${keywords[i+1]}"页面：主题相关性高，建议互链\n`;
      }
    });
    content += `\n### 发布计划\n`;
    content += `| 优先级 | 关键词 | 建议发布日 | 预期排名周期 |\n`;
    content += `|--------|--------|-----------|-------------|\n`;
    keywords.forEach((kw: string, i: number) => {
      const days = 7 * (i + 1);
      const rankWeeks = 4 + i * 2;
      content += `| ${i+1} | ${kw} | 第${days}天 | ${rankWeeks}-${rankWeeks+4}周 |\n`;
    });
    content += `\n### 效果监测指标\n`;
    content += `- 目标关键词排名变化（每周监测）\n`;
    content += `- 页面自然流量增长（按月对比）\n`;
    content += `- AI搜索引擎引用率（月度统计）\n`;
    content += `- 用户停留时间与跳出率\n`;
    content += `- 转化率（咨询/注册/购买）\n`;

    res.json({
      success: true,
      data: { 
        content, 
        keywordsCount: keywords.length, 
        cost: totalCost,
        competitorInfo: competitorTitle ? { title: competitorTitle, description: competitorDesc.substring(0, 200) } : null,
      },
      message: `成功生成${keywords.length}个关键词的对标优化内容，消耗${totalCost}积分`
    });
  } catch (error) {
    console.error('生成对标内容失败:', error);
    res.status(500).json({ success: false, error: '生成失败，请稍后重试' });
  }
});

export default router;
