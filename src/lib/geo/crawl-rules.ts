/**
 * AI抓取规则自动生成引擎
 * 生成 llms.txt、llms-full.txt、优化 robots.txt、sitemap、agent-card、mcp.json
 */

interface PageInfo {
  url: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  pageType: 'product' | 'tutorial' | 'faq' | 'blog' | 'docs' | 'admin' | 'other';
  summary: string;
}

/**
 * 生成标准 llms.txt 文件
 */
export function generateLlmsTxt(
  siteName: string,
  pages: PageInfo[]
): string {
  const highPriority = pages.filter(p => p.priority === 'high');
  const mediumPriority = pages.filter(p => p.priority === 'medium');
  const disallowed = pages.filter(p =>
    ['admin', 'other'].includes(p.pageType) &&
    (p.url.includes('/admin') || p.url.includes('/checkout') || p.url.includes('/login'))
  );

  let content = `# ${siteName}\n`;
  content += `# LLMs.txt - AI搜索引擎索引文件\n`;
  content += `# 生成时间: ${new Date().toISOString()}\n\n`;

  content += `## 高优先级页面\n`;
  for (const page of highPriority) {
    content += `- [${page.title}](${page.url}) | ${page.summary}\n`;
  }

  content += `\n## 中等优先级页面\n`;
  for (const page of mediumPriority) {
    content += `- [${page.title}](${page.url}) | ${page.summary}\n`;
  }

  if (disallowed.length > 0) {
    content += `\n## 禁止抓取\n`;
    for (const page of disallowed) {
      content += `Disallow: ${page.url}\n`;
    }
  }

  return content;
}

/**
 * 生成 llms-full.txt - 全量AI索引文件
 */
export function generateLlmsFullTxt(
  siteName: string,
  brandName: string,
  mainService: string,
  targetCustomer: string,
  pages: PageInfo[]
): string {
  let content = `# ${siteName} - 完整AI索引\n`;
  content += `# 站点名称: ${siteName}\n`;
  content += `# 品牌: ${brandName}\n`;
  content += `# 主营服务: ${mainService}\n`;
  content += `# 目标客户: ${targetCustomer}\n`;
  content += `# 生成时间: ${new Date().toISOString()}\n\n`;

  for (const page of pages) {
    if (page.pageType === 'admin') continue;
    content += `## ${page.title}\n`;
    content += `URL: ${page.url}\n`;
    content += `类型: ${page.pageType}\n`;
    content += `摘要: ${page.summary}\n\n`;
  }

  return content;
}

/**
 * 生成优化后的 robots.txt
 */
export function generateRobotsTxt(siteUrl: string): string {
  const aiCrawlers = [
    'GPTBot', 'ChatGPT-User', 'Google-Extended', 'OAI-SearchBot',
    'Bytespider', 'Baiduspider', 'KimiBot', 'MoonshotBot',
    'DeepSeekBot', 'Claude-Web', 'PerplexityBot', 'MistralAI',
  ];

  let content = `# GEO优化助手Pro - 自动生成 robots.txt\n`;
  content += `# 策略: 放行全部AI搜索引擎爬虫，屏蔽后台管理页面\n\n`;

  for (const crawler of aiCrawlers) {
    content += `User-agent: ${crawler}\n`;
    content += `Allow: /\n\n`;
  }

  content += `User-agent: *\n`;
  content += `Allow: /\n`;
  content += `Disallow: /admin/\n`;
  content += `Disallow: /api/internal/\n`;
  content += `Disallow: /checkout/\n`;
  content += `Disallow: /user/settings/\n`;
  content += `Disallow: /wp-admin/\n\n`;

  content += `Sitemap: ${siteUrl}/sitemap.xml\n`;

  return content;
}

/**
 * 生成 agent-card.json
 */
export function generateAgentCard(
  name: string,
  description: string,
  url: string,
  endpoints: { name: string; url: string; description: string }[]
): string {
  const card = {
    schemaVersion: '1.0',
    name,
    description,
    url,
    provider: {
      organization: name,
    },
    capabilities: {
      streaming: true,
      pushNotifications: false,
    },
    defaultInputModes: ['text'],
    defaultOutputModes: ['text'],
    endpoints: endpoints.map(e => ({
      name: e.name,
      url: e.url,
      description: e.description,
    })),
  };

  return JSON.stringify(card, null, 2);
}

/**
 * 生成 MCP 协议文件 (mcp.json)
 */
export function generateMcpConfig(
  serviceName: string,
  description: string,
  tools: { name: string; description: string; inputSchema: Record<string, unknown> }[]
): string {
  const config = {
    mcpServers: {
      [serviceName]: {
        command: 'npx',
        args: ['-y', `@${serviceName}/mcp-server`],
        env: {},
        description,
      },
    },
    tools: tools.map(t => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  };

  return JSON.stringify(config, null, 2);
}

/**
 * 智能解析页面类型
 */
export function classifyPageType(url: string, title: string, content?: string): PageInfo['pageType'] {
  const combined = `${url} ${title} ${content || ''}`.toLowerCase();

  if (combined.match(/admin|后台|管理|dashboard|login|登录|register|注册|checkout|支付/))
    return 'admin';
  if (combined.match(/product|产品|服务|feature|功能|pricing|价格|套餐/))
    return 'product';
  if (combined.match(/tutorial|教程|guide|指南|deploy|部署|install|安装|配置|config/))
    return 'tutorial';
  if (combined.match(/faq|问答|常见问题|question|help|帮助|support/))
    return 'faq';
  if (combined.match(/blog|文章|news|新闻|update|更新|changelog/))
    return 'blog';
  if (combined.match(/docs|文档|api|reference|参考/))
    return 'docs';

  return 'other';
}

/**
 * 一站式生成所有AI抓取规则
 */
export function generateCrawlRules(params: {
  siteName: string;
  siteUrl: string;
  brandName: string;
  mainService: string;
  targetCustomer: string;
  pages: PageInfo[];
  agentEndpoints?: { name: string; url: string; description: string }[];
}) {
  return {
    llmsTxt: generateLlmsTxt(params.siteName, params.pages),
    llmsFullTxt: generateLlmsFullTxt(
      params.siteName, params.brandName, params.mainService, params.targetCustomer, params.pages
    ),
    robotsTxt: generateRobotsTxt(params.siteUrl),
    agentCard: generateAgentCard(params.brandName, params.mainService, params.siteUrl, params.agentEndpoints || []),
    mcpConfig: generateMcpConfig(params.siteName, params.mainService, [
      {
        name: 'search',
        description: `搜索 ${params.siteName} 产品信息`,
        inputSchema: { query: { type: 'string' } },
      },
    ]),
  };
}
