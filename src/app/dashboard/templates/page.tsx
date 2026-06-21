'use client';

import { useState } from 'react';
import {
  Package, Download, Eye, Star, Tag, Search, Filter,
  CheckCircle, ShoppingCart, TrendingUp, Loader2, Sparkles,
  FileText, Globe, Shield, Zap,
} from 'lucide-react';

// 行业模板包
const TEMPLATE_PACKS = [
  {
    id: 'saas-enterprise',
    name: 'SaaS企业服务包',
    category: 'SaaS/软件',
    price: 999,
    originalPrice: 1999,
    rating: 4.9,
    sales: 1283,
    description: '面向B2B SaaS产品的全套GEO优化模板，包含官网结构化数据、API文档标签、竞品对比模板和客户案例页面。',
    includes: [
      '官网首页JSON-LD模板',
      '定价页面结构化标签',
      'API文档Schema标记',
      '客户案例Schema模板',
      '竞品对比页面结构',
      '5篇AI优化文章模板',
    ],
    icon: '💻',
    color: 'bg-blue-50 text-blue-700',
    featured: true,
  },
  {
    id: 'ecommerce-retail',
    name: '电商零售行业包',
    category: '电商/零售',
    price: 799,
    originalPrice: 1599,
    rating: 4.8,
    sales: 2156,
    description: '电商产品页优化模板，包含商品详情结构化标记、评论评分Schema、品牌故事页面和产品对比模板。',
    includes: [
      '商品详情页Schema',
      '评论评分结构化标签',
      '品牌故事页模板',
      '产品对比页面结构',
      'FAQ问答库模板',
      '8篇电商文案模板',
    ],
    icon: '🛒',
    color: 'bg-orange-50 text-orange-700',
    featured: false,
  },
  {
    id: 'health-medical',
    name: '医疗健康行业包',
    category: '医疗/健康',
    price: 1299,
    originalPrice: 2499,
    rating: 4.7,
    sales: 876,
    description: '符合医疗合规要求的GEO优化方案，包含医疗机构Schema、医生资质标记、健康科普文章模板和在线问诊页面优化。',
    includes: [
      '医疗机构Schema标记',
      '医生资质结构化数据',
      '医学科普文章模板',
      '在线问诊页面优化',
      '健康FAQ问答库',
      '10篇科普文章模板',
    ],
    icon: '🏥',
    color: 'bg-red-50 text-red-700',
    featured: false,
  },
  {
    id: 'education-training',
    name: '教育培训行业包',
    category: '教育/培训',
    price: 699,
    originalPrice: 1399,
    rating: 4.8,
    sales: 1654,
    description: '教育培训机构专属模板，包含课程Schema、讲师资质标记、学员评价模板和在线课程页面优化方案。',
    includes: [
      '课程Schema结构化标记',
      '讲师资质结构化数据',
      '学员评价展示模板',
      '在线课程页面优化',
      '教育FAQ问答库',
      '6篇招生文案模板',
    ],
    icon: '📚',
    color: 'bg-green-50 text-green-700',
    featured: false,
  },
  {
    id: 'finance-insurance',
    name: '金融保险行业包',
    category: '金融/保险',
    price: 1599,
    originalPrice: 2999,
    rating: 4.6,
    sales: 542,
    description: '金融保险合规模板，包含产品页结构化标记、风险提示标签、理财计算器页面和金融科普文章模板。',
    includes: [
      '金融产品Schema标记',
      '合规风险提示模板',
      '理财计算器页面',
      '金融科普文章模板',
      '保险FAQ问答库',
      '8篇金融科普模板',
    ],
    icon: '💰',
    color: 'bg-yellow-50 text-yellow-700',
    featured: false,
  },
  {
    id: 'manufacturing',
    name: '智能制造行业包',
    category: '制造/工业',
    price: 1099,
    originalPrice: 2199,
    rating: 4.7,
    sales: 698,
    description: '工业制造企业GEO模板，包含产品技术规格Schema、行业解决方案页面、案例展示模板和技术白皮书结构。',
    includes: [
      '产品规格Schema标记',
      '行业解决方案页面',
      '客户案例展示模板',
      '技术白皮书结构',
      '工业FAQ问答库',
      '5篇技术文章模板',
    ],
    icon: '🏭',
    color: 'bg-gray-100 text-gray-700',
    featured: false,
  },
];

const CATEGORIES = ['全部', 'SaaS/软件', '电商/零售', '医疗/健康', '教育/培训', '金融/保险', '制造/工业'];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasedIds, setPurchasedIds] = useState<string[]>(['saas-enterprise']);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const filteredPacks = TEMPLATE_PACKS.filter(pack => {
    const matchCategory = selectedCategory === '全部' || pack.category === selectedCategory;
    const matchSearch = !searchQuery || pack.name.includes(searchQuery) || pack.description.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const handlePurchase = async (packId: string) => {
    setPurchasing(packId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPurchasedIds(prev => [...prev, packId]);
    setPurchasing(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* 页头 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">行业模板包</h1>
        <p className="mt-1 text-gray-500">即买即用的行业专属GEO优化模板，一键部署到你的站点</p>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Package, label: '模板包总数', value: TEMPLATE_PACKS.length, unit: '套' },
          { icon: Download, label: '累计下载', value: '7,209', unit: '次' },
          { icon: Star, label: '平均评分', value: '4.8', unit: '分' },
          { icon: TrendingUp, label: '效果提升', value: '85', unit: '%' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <stat.icon className="w-5 h-5 text-gray-400 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stat.value}<span className="text-sm font-normal text-gray-500 ml-1">{stat.unit}</span></div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 搜索筛选 */}
      <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索模板包..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${selectedCategory === cat
                  ? 'bg-primary-100 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 模板卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPacks.map(pack => {
          const isPurchased = purchasedIds.includes(pack.id);
          return (
            <div
              key={pack.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg
                ${pack.featured ? 'border-primary-200 ring-1 ring-primary-100' : 'border-gray-200'}
                ${selectedPack === pack.id ? 'ring-2 ring-primary-500' : ''}
              `}
            >
              {/* 精选标签 */}
              {pack.featured && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium mb-3">
                  <Sparkles className="w-3 h-3" />
                  精选推荐
                </div>
              )}

              {/* 图标和标题 */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 ${pack.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {pack.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{pack.name}</h3>
                  <span className="text-xs text-gray-500">{pack.category}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pack.description}</p>

              {/* 包含内容 */}
              <div className="space-y-1.5 mb-4">
                {pack.includes.map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* 评分和销量 */}
              <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {pack.rating}
                </span>
                <span>已售 {pack.sales.toLocaleString()}</span>
              </div>

              {/* 价格和操作 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-gray-900">¥{pack.price}</span>
                  {pack.originalPrice > pack.price && (
                    <span className="text-sm text-gray-400 line-through ml-2">¥{pack.originalPrice}</span>
                  )}
                </div>

                {isPurchased ? (
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    已购买
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(pack.id)}
                    disabled={purchasing === pack.id}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium
                      hover:bg-primary-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    {purchasing === pack.id ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />购买中</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" />立即购买</>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI定制模板 */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              没有找到合适的模板？AI为你定制专属方案
            </h3>
            <p className="text-sm text-primary-100 mt-1">提供你的行业和需求，AI将生成专属于你的GEO优化模板包</p>
          </div>
          <button className="px-6 py-2.5 bg-white text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors flex items-center gap-2">
            <Zap className="w-4 h-4" />
            开始定制
          </button>
        </div>
      </div>
    </div>
  );
}
