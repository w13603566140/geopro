'use client';

import { useState } from 'react';
import {
  Send, CheckCircle, Clock, AlertCircle, Globe, FileText,
  RefreshCw, ExternalLink, Eye, Loader2, ChevronDown, Link2,
} from 'lucide-react';

// 支持的发布平台
const PLATFORMS = [
  { id: 'wechat', name: '微信公众号', icon: '💬', color: 'bg-green-100 text-green-700', desc: '订阅号/服务号文章发布' },
  { id: 'zhihu', name: '知乎', icon: '📘', color: 'bg-blue-100 text-blue-700', desc: '问答/专栏文章发布' },
  { id: 'csdn', name: 'CSDN', icon: '💻', color: 'bg-red-100 text-red-700', desc: '技术博客发布' },
  { id: 'juejin', name: '掘金', icon: '⛏️', color: 'bg-blue-100 text-blue-600', desc: '开发者社区发布' },
  { id: 'jianshu', name: '简书', icon: '📝', color: 'bg-orange-100 text-orange-700', desc: '创作社区发布' },
  { id: 'toutiao', name: '今日头条', icon: '📰', color: 'bg-red-100 text-red-600', desc: '资讯平台发布' },
  { id: 'b2b', name: 'B2B平台', icon: '🏢', color: 'bg-purple-100 text-purple-700', desc: '1688/慧聪等B2B平台' },
  { id: 'media', name: '自媒体矩阵', icon: '📡', color: 'bg-indigo-100 text-indigo-700', desc: '百家号/搜狐号/网易号' },
];

type PublishStatus = 'draft' | 'publishing' | 'success' | 'failed';

interface PublishTask {
  id: string;
  platformId: string;
  platformName: string;
  title: string;
  status: PublishStatus;
  url?: string;
  error?: string;
  publishedAt?: string;
}

export default function PublishPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [tasks, setTasks] = useState<PublishTask[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [publishResult, setPublishResult] = useState<{ success: number; failed: number } | null>(null);

  // 从已生成内容导入
  const [importContent, setImportContent] = useState('');
  const [showImport, setShowImport] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleImportFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setImportContent(text);
        // 尝试解析标题和内容
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length > 0 && lines[0].startsWith('#')) {
          setTitle(lines[0].replace(/^#+\s*/, ''));
          setContent(lines.slice(1).join('\n'));
        } else {
          setContent(text);
        }
      }
    } catch {
      // 剪贴板不可用
    }
  };

  const handlePublish = async () => {
    if (!title || !content || selectedPlatforms.length === 0) return;

    setIsPublishing(true);
    setPublishResult(null);

    const newTasks: PublishTask[] = selectedPlatforms.map(pid => ({
      id: `${pid}-${Date.now()}`,
      platformId: pid,
      platformName: PLATFORMS.find(p => p.id === pid)?.name || pid,
      title,
      status: 'publishing',
    }));

    setTasks(prev => [...newTasks, ...prev]);

    // 模拟逐个发布（真实场景调用后端API）
    for (const task of newTasks) {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

      setTasks(prev => prev.map(t => {
        if (t.id === task.id) {
          const isSuccess = Math.random() > 0.2; // 80%成功率模拟
          return {
            ...t,
            status: isSuccess ? 'success' : 'failed',
            url: isSuccess ? `https://${task.platformId}.example.com/article/${Date.now()}` : undefined,
            error: isSuccess ? undefined : '平台API限流，请稍后重试',
            publishedAt: isSuccess ? new Date().toISOString() : undefined,
          };
        }
        return t;
      }));
    }

    const successCount = selectedPlatforms.length - Math.floor(Math.random() * 2);
    setPublishResult({
      success: Math.min(successCount, selectedPlatforms.length),
      failed: Math.max(0, selectedPlatforms.length - successCount),
    });
    setIsPublishing(false);
  };

  const getStatusIcon = (status: PublishStatus) => {
    switch (status) {
      case 'publishing': return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: PublishStatus) => {
    const map = {
      draft: '草稿',
      publishing: '发布中',
      success: '已发布',
      failed: '失败',
    };
    const colorMap = {
      draft: 'bg-gray-100 text-gray-600',
      publishing: 'bg-blue-100 text-blue-600',
      success: 'bg-green-100 text-green-600',
      failed: 'bg-red-100 text-red-600',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[status]}`}>
        {getStatusIcon(status)}
        {map[status]}
      </span>
    );
  };

  const successCount = tasks.filter(t => t.status === 'success').length;
  const failedCount = tasks.filter(t => t.status === 'failed').length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* 页头 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">一键多平台发布</h1>
        <p className="mt-1 text-gray-500">将内容一键分发到微信公众号、知乎、CSDN、掘金等8大平台</p>
      </div>

      {/* 统计卡片 */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            <div className="text-sm text-gray-500">发布总数</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-gray-500">已发布</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <div className="text-sm text-gray-500">发布失败</div>
          </div>
        </div>
      )}

      {publishResult && (
        <div className={`rounded-xl p-4 ${publishResult.failed === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center gap-2">
            {publishResult.failed === 0
              ? <CheckCircle className="w-5 h-5 text-green-600" />
              : <AlertCircle className="w-5 h-5 text-yellow-600" />
            }
            <span className="font-medium">
              {publishResult.failed === 0
                ? `全部发布成功！共 ${publishResult.success} 个平台`
                : `发布完成：${publishResult.success} 成功，${publishResult.failed} 失败`
              }
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：内容编辑区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 标题 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">文章标题</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入文章标题，AI将自动优化各平台适配版本..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={() => setShowImport(!showImport)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Link2 className="w-3 h-3" />
                从已生成内容导入
              </button>
              <span className="text-xs text-gray-400">
                AI将自动为各平台优化标题格式
              </span>
            </div>
          </div>

          {/* 内容 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">文章内容</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleImportFromClipboard}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  粘贴内容
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  {showPreview ? '编辑' : '预览'}
                </button>
              </div>
            </div>
            {showPreview ? (
              <div className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 min-h-[300px] bg-gray-50">
                {content ? (
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p className="text-gray-400">暂无内容</p>
                )}
              </div>
            ) : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`输入文章正文内容（Markdown格式）...

## 产品介绍
在这里描述您的产品核心功能和优势...

## 使用教程
分步骤说明如何使用...

## 常见问题
列出用户最关心的FAQ...`}
                rows={14}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-y font-mono"
              />
            )}
            <p className="mt-2 text-xs text-gray-400">
              支持Markdown格式，AI将自动转换为各平台适配格式
            </p>
          </div>

          {/* 发布历史 */}
          {tasks.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">发布记录</h3>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {PLATFORMS.find(p => p.id === task.platformId)?.icon || '📄'}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.platformName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{task.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(task.status)}
                      {task.url && (
                        <a
                          href={task.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          查看
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：平台选择 + 发布按钮 */}
        <div className="space-y-6">
          {/* 平台选择 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              选择发布平台
              <span className="text-xs text-gray-400 font-normal">
                ({selectedPlatforms.length}/8)
              </span>
            </h3>

            <div className="space-y-2">
              {PLATFORMS.map(platform => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all
                      ${isSelected
                        ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${platform.color}`}>
                      {platform.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                      <div className="text-xs text-gray-500 truncate">{platform.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                      ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`}
                    >
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 一键全选 */}
            <button
              onClick={() => {
                if (selectedPlatforms.length === PLATFORMS.length) {
                  setSelectedPlatforms([]);
                } else {
                  setSelectedPlatforms(PLATFORMS.map(p => p.id));
                }
              }}
              className="mt-3 w-full text-xs text-primary-600 hover:text-primary-700 py-1.5"
            >
              {selectedPlatforms.length === PLATFORMS.length ? '取消全选' : '一键全选所有平台'}
            </button>

            {/* 发布按钮 */}
            <button
              onClick={handlePublish}
              disabled={!title || !content || selectedPlatforms.length === 0 || isPublishing}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg font-medium
                hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  发布中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  一键发布到 {selectedPlatforms.length} 个平台
                </>
              )}
            </button>

            {/* 提示 */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 <strong>智能适配：</strong>系统将自动为每个平台优化标题、排版和关键词密度，提升搜索可见度。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
