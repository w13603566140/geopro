import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';

export const mcpRouter = Router();

/**
 * 生成 agent-card.json
 */
mcpRouter.post('/agent-card', (req: AuthRequest, res: Response) => {
  const { name, description, url } = req.body;
  if (!name || !description || !url) throw new AppError('服务名称、描述和URL为必填项', 400);

  const agentCard = {
    schemaVersion: '1.0',
    name,
    description,
    url,
    provider: { organization: name },
    capabilities: { streaming: true, pushNotifications: false },
    defaultInputModes: ['text'],
    defaultOutputModes: ['text'],
    endpoints: [
      { name: 'search', url: `${url}/api/search`, description: `搜索${name}相关信息` },
      { name: 'query', url: `${url}/api/query`, description: `查询${name}服务状态` },
    ],
  };

  res.json({ success: true, data: { agentCard: JSON.stringify(agentCard, null, 2) } });
});

/**
 * 生成 mcp.json
 */
mcpRouter.post('/mcp-config', (req: AuthRequest, res: Response) => {
  const { serviceName, description } = req.body;
  if (!serviceName) throw new AppError('服务名称为必填项', 400);

  const mcpConfig = {
    mcpServers: {
      [serviceName]: {
        command: 'npx',
        args: ['-y', `@${serviceName}/mcp-server`],
        description: description || `${serviceName} MCP服务`,
      },
    },
    tools: [
      {
        name: 'search',
        description: `在${serviceName}中搜索内容`,
        inputSchema: {
          type: 'object',
          properties: { query: { type: 'string', description: '搜索关键词' } },
          required: ['query'],
        },
      },
    ],
  };

  res.json({ success: true, data: { mcpConfig: JSON.stringify(mcpConfig, null, 2) } });
});

/**
 * 一键生成全部生态文件
 */
mcpRouter.post('/generate-all', (req: AuthRequest, res: Response) => {
  const { name, description, url } = req.body;
  if (!name || !description || !url) throw new AppError('服务名称、描述和URL为必填项', 400);

  const agentCard = {
    schemaVersion: '1.0', name, description, url,
    provider: { organization: name },
    capabilities: { streaming: true },
    endpoints: [{ name: 'search', url: `${url}/api/search`, description: `搜索${name}` }],
  };

  const mcpConfig = {
    mcpServers: { [name]: { command: 'npx', args: ['-y', `@${name}/mcp-server`], description } },
    tools: [{ name: 'search', description: `搜索${name}`, inputSchema: { type: 'object', properties: { query: { type: 'string' } } } }],
  };

  // llms.txt 示例
  const llmsTxt = `# ${name}\n## 产品\n- [产品介绍](${url})\n## 文档\n- [快速开始](${url}/docs)\n- [API文档](${url}/api)`;

  res.json({
    success: true,
    data: {
      agentCard: JSON.stringify(agentCard, null, 2),
      mcpConfig: JSON.stringify(mcpConfig, null, 2),
      llmsTxt,
    },
  });
});
