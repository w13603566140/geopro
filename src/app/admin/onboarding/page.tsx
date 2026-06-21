'use client';

import { useState } from 'react';
import {
  Compass, Save, CheckCircle, Edit3, Plus, Trash2,
  Eye, EyeOff, Sparkles, Globe, Search, FileText,
  BarChart3, MoveUp, MoveDown,
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  enabled: boolean;
  required: boolean;
  content?: string;
}

interface QuickAction {
  label: string;
  href: string;
  icon: string;
  enabled: boolean;
}

export default function AdminOnboardingPage() {
  const [saved, setSaved] = useState('');
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { id: 1, title: '产品信息', subtitle: '告诉AI你是谁', enabled: true, required: true },
    { id: 2, title: '目标关键词', subtitle: '设定关键词策略', enabled: true, required: true },
    { id: 3, title: '竞品分析', subtitle: '知己知彼', enabled: true, required: false },
    { id: 4, title: '功能预览', subtitle: '了解核心功能', enabled: true, required: false },
    { id: 5, title: '开始使用', subtitle: '完成配置', enabled: true, required: true },
  ]);

  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    { label: 'GEO可见度诊断', href: '/dashboard/audit', icon: '🔍', enabled: true },
    { label: 'AI内容生产', href: '/dashboard/content', icon: '📝', enabled: true },
    { label: '排名监测', href: '/dashboard/monitoring', icon: '📊', enabled: true },
    { label: '竞品分析', href: '/dashboard/competitors', icon: '👥', enabled: true },
  ]);

  const [welcomeMessage, setWelcomeMessage] = useState(
    '欢迎使用GEO优化助手Pro！我是你的AI搜索引擎优化专家，5步帮你完成初始配置，让AI优先推荐你的产品。'
  );

  const [config, setConfig] = useState({
    autoShow: true,          // 首次登录自动弹出
    showOnDashboard: true,   // 控制台显示引导入口
    requireCompletion: false, // 强制完成引导
    skipAllowed: true,       // 允许跳过
    collectAnalytics: true,  // 收集引导行为数据
  });

  const handleSave = () => {
    setSaved('all');
    setTimeout(() => setSaved(''), 2000);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    newSteps.forEach((s, i) => s.id = i + 1);
    setSteps(newSteps);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary-600" /> 新手引导配置
        </h2>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved === 'all' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved === 'all' ? '已保存' : '保存全部配置'}
        </button>
      </div>

      {/* 引导行为配置 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> 引导行为设置
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'autoShow' as const, label: '首次登录自动弹出', desc: '新用户登录后自动展示引导向导' },
            { key: 'showOnDashboard' as const, label: '控制台显示入口', desc: '在控制台底部显示"开始引导"按钮' },
            { key: 'requireCompletion' as const, label: '强制完成引导', desc: '用户必须完成引导才能使用其他功能' },
            { key: 'skipAllowed' as const, label: '允许跳过引导', desc: '用户可选择跳过引导直接进入控制台' },
            { key: 'collectAnalytics' as const, label: '收集引导数据', desc: '记录用户在引导中的行为和选择' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
              <button
                onClick={() => setConfig(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`w-10 h-6 rounded-full relative transition-colors ${
                  config[item.key] ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  config[item.key] ? 'left-5' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 欢迎语编辑 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">欢迎语</h3>
        <textarea
          value={welcomeMessage}
          onChange={e => setWelcomeMessage(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
          rows={2}
        />
        <p className="text-xs text-gray-400 mt-2">在引导向导第一步展示的欢迎文案</p>
      </div>

      {/* 引导步骤管理 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4" /> 引导步骤
          </h3>
          <button className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> 添加步骤
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {steps.map((step, index) => (
            <div key={step.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              {/* 拖拽排序 */}
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveStep(index, 'up')} disabled={index === 0}
                  className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30">
                  <MoveUp className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1}
                  className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30">
                  <MoveDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>

              {/* 步骤编号 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step.enabled ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {step.id}
              </div>

              {/* 步骤信息 */}
              <div className="flex-1">
                <input
                  type="text"
                  value={step.title}
                  onChange={e => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, title: e.target.value } : s))}
                  className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none w-full"
                />
                <input
                  type="text"
                  value={step.subtitle}
                  onChange={e => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, subtitle: e.target.value } : s))}
                  className="text-xs text-gray-500 bg-transparent border-none outline-none w-full mt-0.5"
                />
              </div>

              {/* 必填标记 */}
              <button
                onClick={() => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, required: !s.required } : s))}
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  step.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {step.required ? '必填' : '可选'}
              </button>

              {/* 启用开关 */}
              <button
                onClick={() => setSteps(prev => prev.map(s => s.id === step.id ? { ...s, enabled: !s.enabled } : s))}
                className={`w-10 h-6 rounded-full relative transition-colors ${
                  step.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  step.enabled ? 'left-5' : 'left-1'
                }`} />
              </button>

              {/* 删除 */}
              <button
                onClick={() => setSteps(prev => prev.filter(s => s.id !== step.id))}
                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 引导完成后快捷操作 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4" /> 功能预览配置
        </h3>
        <p className="text-xs text-gray-500 mb-4">引导第4步展示的核心功能入口</p>
        <div className="space-y-3">
          {quickActions.map(action => (
            <div key={action.label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">{action.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{action.label}</div>
                <div className="text-xs text-gray-400">{action.href}</div>
              </div>
              <button
                onClick={() => setQuickActions(prev => prev.map(a =>
                  a.label === action.label ? { ...a, enabled: !a.enabled } : a
                ))}
                className={`w-10 h-6 rounded-full relative transition-colors ${
                  action.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  action.enabled ? 'left-5' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
