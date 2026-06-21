'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, ChevronRight, ChevronLeft, CheckCircle, Sparkles,
  Search, FileText, Globe, BarChart3, Rocket, Star,
} from 'lucide-react';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  step: number;
  productName: string;
  productDesc: string;
  industry: string;
  targetKeywords: string[];
  competitors: string[];
  goals: string[];
  planTier: string;
}

const STEPS = [
  { id: 1, title: '产品信息', subtitle: '告诉AI你是谁', icon: Sparkles },
  { id: 2, title: '目标关键词', subtitle: '设定关键词策略', icon: Search },
  { id: 3, title: '竞品分析', subtitle: '知己知彼', icon: Globe },
  { id: 4, title: '功能预览', subtitle: '了解核心功能', icon: Rocket },
  { id: 5, title: '开始使用', subtitle: '完成配置', icon: Star },
];

const INDUSTRIES = [
  'AI工具/SaaS', '电商零售', '企业服务', '教育培训', '医疗健康',
  '金融科技', '智能制造', '游戏娱乐', '本地生活', '房产家居',
  '人力资源', '法律咨询', '营销广告', '物流快递', '其他行业',
];

const FEATURES = [
  {
    icon: Globe,
    title: 'GEO可见度诊断',
    desc: '8大AI模型扫描你的品牌可见度，找到被AI推荐的关键突破口',
    href: '/dashboard/audit',
  },
  {
    icon: FileText,
    title: 'AI内容生产',
    desc: '6种高权重内容模板，让AI优先引用你的产品信息',
    href: '/dashboard/content',
  },
  {
    icon: BarChart3,
    title: '排名监测',
    desc: '10大AI引擎实时追踪，发现排名变化立即告警',
    href: '/dashboard/monitoring',
  },
  {
    icon: Search,
    title: '竞品分析',
    desc: '精准追踪竞品AI曝光策略，自动生成赶超方案',
    href: '/dashboard/competitors',
  },
];

export default function OnboardingWizard({ isOpen, onClose, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    step: 1,
    productName: '',
    productDesc: '',
    industry: '',
    targetKeywords: [],
    competitors: [''],
    goals: [],
    planTier: 'FREE',
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [competitorInput, setCompetitorInput] = useState('');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...partial }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !data.targetKeywords.includes(keywordInput.trim())) {
      updateData({ targetKeywords: [...data.targetKeywords, keywordInput.trim()] });
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    updateData({ targetKeywords: data.targetKeywords.filter(k => k !== kw) });
  };

  const addCompetitor = () => {
    if (competitorInput.trim() && !data.competitors.includes(competitorInput.trim())) {
      updateData({ competitors: [...data.competitors.filter(c => c), competitorInput.trim()] });
      setCompetitorInput('');
    }
  };

  const removeCompetitor = (c: string) => {
    updateData({ competitors: data.competitors.filter(co => co !== c) });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      onComplete({ ...data, step: 5 });
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const canNext = () => {
    switch (step) {
      case 1: return data.productName.trim() && data.productDesc.trim() && data.industry;
      case 2: return data.targetKeywords.length > 0;
      case 3: return true; // 竞品可选
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  if (!mounted || !isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 向导弹窗 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* 顶部进度条 */}
        <div className="px-8 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">🚀 新手引导</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center">
                <div className={`flex items-center gap-2 px-2 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${step > s.id ? 'bg-green-100 text-green-700' :
                    step === s.id ? 'bg-primary-100 text-primary-700' :
                    'bg-gray-100 text-gray-400'}`}
                >
                  {step > s.id ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <s.icon className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{s.title}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded ${step > s.id ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 步骤内容 */}
        <div className="px-8 py-6 max-h-[50vh] overflow-y-auto">
          {/* 第1步：产品信息 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">介绍你的产品</h3>
                <p className="text-sm text-gray-500 mt-1">告诉AI你的产品是什么，它就能更好地推荐你</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">产品/品牌名称 *</label>
                <input
                  type="text"
                  value={data.productName}
                  onChange={e => updateData({ productName: e.target.value })}
                  placeholder="例如：GEO优化助手Pro"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">产品描述 *</label>
                <textarea
                  value={data.productDesc}
                  onChange={e => updateData({ productDesc: e.target.value })}
                  placeholder="简要描述你的产品功能、目标用户和核心卖点..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">所属行业 *</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map(ind => (
                    <button
                      key={ind}
                      onClick={() => updateData({ industry: ind })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                        ${data.industry === ind
                          ? 'bg-primary-100 border-primary-300 text-primary-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 第2步：目标关键词 */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">设定目标关键词</h3>
                <p className="text-sm text-gray-500 mt-1">这些关键词将用于AI可见度诊断和内容优化</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  placeholder="输入关键词，如：AI优化工具、GEO排名..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={addKeyword}
                  className="px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  添加
                </button>
              </div>

              {data.targetKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.targetKeywords.map(kw => (
                    <span key={kw} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      {kw}
                      <button onClick={() => removeKeyword(kw)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 <strong>提示：</strong>建议添加 3-5 个核心关键词，覆盖品牌词、产品词和长尾问句。
                </p>
              </div>
            </div>
          )}

          {/* 第3步：竞品分析 */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">添加竞品（可选）</h3>
                <p className="text-sm text-gray-500 mt-1">AI将帮你分析竞品的GEO策略并生成赶超方案</p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={competitorInput}
                  onChange={e => setCompetitorInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
                  placeholder="输入竞品名称或网址..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={addCompetitor}
                  className="px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  添加
                </button>
              </div>

              {data.competitors.filter(c => c).length > 0 && (
                <div className="space-y-2">
                  {data.competitors.filter(c => c).map(comp => (
                    <div key={comp} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{comp}</span>
                      <button onClick={() => removeCompetitor(comp)} className="text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  // AI推荐竞品（模拟）
                  const suggestions = ['竞品A', '竞品B', '竞品C'];
                  updateData({
                    competitors: [...data.competitors.filter(c => c), ...suggestions.filter(s => !data.competitors.includes(s))],
                  });
                }}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI智能推荐竞品
              </button>
            </div>
          )}

          {/* 第4步：功能预览 */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">了解核心功能</h3>
                <p className="text-sm text-gray-500 mt-1">以下是GEO优化助手的核心功能模块</p>
              </div>

              <div className="space-y-3">
                {FEATURES.map(feature => (
                  <div key={feature.title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = feature.href}
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{feature.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{feature.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 第5步：开始使用 */}
          {step === 5 && (
            <div className="space-y-5 text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-6xl">🎉</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">一切就绪！</h3>
                <p className="text-sm text-gray-500 mt-2">你的GEO优化之旅现在开始</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">产品名称</span>
                  <span className="text-gray-900 font-medium">{data.productName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">所属行业</span>
                  <span className="text-gray-900">{data.industry}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">目标关键词</span>
                  <span className="text-gray-900">{data.targetKeywords.length} 个</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">竞品追踪</span>
                  <span className="text-gray-900">{data.competitors.filter(c => c).length} 个</span>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                点击"开始使用"执行首次AI可见度诊断
              </p>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={step === 1 ? onClose : handlePrev}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? '跳过引导' : '上一步'}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{step} / 5</span>
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium
                hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {step === 5 ? (
                <>
                  <Rocket className="w-4 h-4" />
                  开始使用
                </>
              ) : (
                <>
                  下一步
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
