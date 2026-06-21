'use client';

import { useState } from 'react';
import { Zap, Download, Copy, CheckCircle, Code, Globe, Bot } from 'lucide-react';
import { generateAgentCard, generateMcpConfig } from '@/lib/geo/crawl-rules';

export default function McpPage() {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [generated, setGenerated] = useState<{ agentCard: string; mcpConfig: string } | null>(null);
  const [copied, setCopied] = useState('');

  const handleGenerate = () => {
    if (!serviceName || !description || !url) return;

    const agentCard = generateAgentCard(serviceName, description, url, [
      { name: 'search', url: `${url}/api/search`, description: `搜索 ${serviceName} 相关信息` },
      { name: 'query', url: `${url}/api/query`, description: `查询 ${serviceName} 服务状态` },
    ]);

    const mcpConfig = generateMcpConfig(serviceName, description, [
      {
        name: 'search',
        description: `在 ${serviceName} 中搜索内容`,
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: '搜索关键词' },
            limit: { type: 'number', description: '返回数量限制' },
          },
          required: ['query'],
        },
      },
    ]);

    setGenerated({ agentCard, mcpConfig });
  };

  const handleCopy = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agent / MCP 生态</h1>
        <p className="text-gray-500 mt-1">生成AI智能体协议文件，让AI Agent主动识别并调用你的服务</p>
      </div>

      {/* 功能说明 */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Bot, title: 'agent-card.json', desc: 'AI Agent自动发现你的服务能力，智能推荐给用户' },
          { icon: Code, title: 'mcp.json', desc: 'MCP协议文件，让AI模型直接调用你的API服务' },
          { icon: Globe, title: '插件生态', desc: '标准化服务描述，打通大模型插件生态流量' },
        ].map(item => (
          <div key={item.title} className="card p-5">
            <item.icon className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 输入面板 */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">服务信息配置</h2>
          <div>
            <label className="label">服务名称 *</label>
            <input type="text" className="input-field" placeholder="如：my-ai-gateway"
              value={serviceName} onChange={e => setServiceName(e.target.value)} />
          </div>
          <div>
            <label className="label">服务描述 *</label>
            <textarea className="input-field" rows={2}
              placeholder="描述你的服务能力，AI将据此决定是否推荐"
              value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">服务URL *</label>
            <input type="url" className="input-field" placeholder="https://your-service.com"
              value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <button onClick={handleGenerate} className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={!serviceName || !description || !url}>
            <Zap className="w-4 h-4" /> 生成生态文件
          </button>
        </div>

        {/* 生成预览 */}
        <div className="space-y-4">
          {generated ? (
            <>
              <div className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary-600" /> agent-card.json
                  </h3>
                  <button onClick={() => handleCopy(generated.agentCard, 'agentCard')}
                    className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-700">
                    {copied === 'agentCard' ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'agentCard' ? '已复制' : '复制'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto max-h-64">
                  <code>{generated.agentCard}</code>
                </pre>
              </div>

              <div className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary-600" /> mcp.json
                  </h3>
                  <button onClick={() => handleCopy(generated.mcpConfig, 'mcpConfig')}
                    className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-700">
                    {copied === 'mcpConfig' ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'mcpConfig' ? '已复制' : '复制'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto max-h-64">
                  <code>{generated.mcpConfig}</code>
                </pre>
              </div>

              <div className="flex gap-2">
                <button onClick={() => {
                  const blob = new Blob([generated.agentCard], { type: 'application/json' });
                  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                  a.download = 'agent-card.json'; a.click();
                }} className="btn-secondary text-xs flex items-center gap-1 !py-1.5 !px-3">
                  <Download className="w-3.5 h-3.5" /> agent-card.json
                </button>
                <button onClick={() => {
                  const blob = new Blob([generated.mcpConfig], { type: 'application/json' });
                  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                  a.download = 'mcp.json'; a.click();
                }} className="btn-secondary text-xs flex items-center gap-1 !py-1.5 !px-3">
                  <Download className="w-3.5 h-3.5" /> mcp.json
                </button>
              </div>
            </>
          ) : (
            <div className="card p-12 text-center text-gray-400">
              <Zap className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium">生成的生态文件将在此预览</p>
              <p className="text-sm mt-1">填写左侧服务信息后点击生成</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
