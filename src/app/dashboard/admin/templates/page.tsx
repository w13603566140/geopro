'use client';

import { useState } from 'react';
import {
  Package, Plus, Save, CheckCircle, Edit3, Trash2,
  DollarSign, TrendingUp, Star, Download, Search,
  Image, Tag, FileText, BarChart3, Eye, ShoppingCart,
} from 'lucide-react';

interface TemplatePack {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  sales: number;
  description: string;
  includes: string[];
  icon: string;
  active: boolean;
  featured: boolean;
}

export default function AdminTemplatesPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState('');
  const [showNew, setShowNew] = useState(false);

  const [templates, setTemplates] = useState<TemplatePack[]>([
    { id: 'saas-enterprise', name: 'SaaS企业服务包', category: 'SaaS/软件', price: 999, originalPrice: 1999, rating: 4.9, sales: 1283, description: '面向B2B SaaS产品的全套GEO优化模板', includes: ['官网首页JSON-LD', '定价页结构化标签', 'API文档Schema', '客户案例模板', '竞品对比页', '5篇AI文章模板'], icon: '💻', active: true, featured: true },
    { id: 'ecommerce-retail', name: '电商零售行业包', category: '电商/零售', price: 799, originalPrice: 1599, rating: 4.8, sales: 2156, description: '电商产品页优化模板', includes: ['商品详情Schema', '评论评分标签', '品牌故事页', '产品对比页', 'FAQ问答库', '8篇电商文案'], icon: '🛒', active: true, featured: false },
    { id: 'health-medical', name: '医疗健康行业包', category: '医疗/健康', price: 1299, originalPrice: 2499, rating: 4.7, sales: 876, description: '医疗合规GEO方案', includes: ['医疗机构Schema', '医生资质标记', '医学科普模板', '在线问诊页', '健康FAQ库', '10篇科普模板'], icon: '🏥', active: true, featured: false },
    { id: 'education-training', name: '教育培训行业包', category: '教育/培训', price: 699, originalPrice: 1399, rating: 4.8, sales: 1654, description: '教培机构专属模板', includes: ['课程Schema', '讲师资质标记', '学员评价模板', '在线课程页', '教育FAQ库', '6篇招生文案'], icon: '📚', active: true, featured: false },
    { id: 'finance-insurance', name: '金融保险行业包', category: '金融/保险', price: 1599, originalPrice: 2999, rating: 4.6, sales: 542, description: '金融合规模板', includes: ['金融产品Schema', '合规风险提示', '理财计算器页', '金融科普模板', '保险FAQ库', '8篇金融科普'], icon: '💰', active: true, featured: false },
    { id: 'manufacturing', name: '智能制造行业包', category: '制造/工业', price: 1099, originalPrice: 2199, rating: 4.7, sales: 698, description: '工业制造GEO模板', includes: ['产品规格Schema', '行业解决方案页', '客户案例模板', '技术白皮书', '工业FAQ库', '5篇技术文章'], icon: '🏭', active: false, featured: false },
  ]);

  const stats = {
    totalSales: 7209,
    totalRevenue: 6284591,
    avgRating: 4.8,
    conversionRate: '12.4%',
  };

  const [newTemplate, setNewTemplate] = useState<Partial<TemplatePack>>({
    name: '', category: '', price: 0, originalPrice: 0, description: '', includes: [''], icon: '📦',
  });

  const handleSave = (id: string) => {
    setEditingId(null);
    setSaved(id);
    setTimeout(() => setSaved(''), 2000);
  };

  const handleCreate = () => {
    const template = {
      ...newTemplate,
      id: `template-${Date.now()}`,
      rating: 0,
      sales: 0,
      active: true,
      featured: false,
    } as TemplatePack;
    setTemplates(prev => [template, ...prev]);
    setShowNew(false);
    setNewTemplate({ name: '', category: '', price: 0, originalPrice: 0, description: '', includes: [''], icon: '📦' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-600" /> 模板包管理
        </h2>
        <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />新建模板包
        </button>
      </div>

      {/* 销售统计 */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '累计销量', value: stats.totalSales.toLocaleString(), unit: '套', icon: ShoppingCart, color: 'text-blue-600' },
          { label: '累计营收', value: `¥${(stats.totalRevenue / 10000).toFixed(1)}`, unit: '万', icon: DollarSign, color: 'text-green-600' },
          { label: '平均评分', value: stats.avgRating, unit: '分', icon: Star, color: 'text-yellow-600' },
          { label: '付费转化', value: stats.conversionRate, unit: '', icon: TrendingUp, color: 'text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold text-gray-900">{stat.value}<span className="text-sm font-normal text-gray-400 ml-1">{stat.unit}</span></div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 新建模板弹窗 */}
      {showNew && (
        <div className="bg-white rounded-xl border-2 border-primary-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">新建模板包</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">模板名称</label>
              <input type="text" value={newTemplate.name} onChange={e => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="如：XX行业优化包" />
            </div>
            <div>
              <label className="text-xs text-gray-500">分类</label>
              <select value={newTemplate.category} onChange={e => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="">选择分类</option>
                <option>SaaS/软件</option><option>电商/零售</option><option>医疗/健康</option>
                <option>教育/培训</option><option>金融/保险</option><option>制造/工业</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">售价 (¥)</label>
              <input type="number" value={newTemplate.price} onChange={e => setNewTemplate(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500">原价 (¥)</label>
              <input type="number" value={newTemplate.originalPrice} onChange={e => setNewTemplate(prev => ({ ...prev, originalPrice: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500">描述</label>
              <textarea value={newTemplate.description} onChange={e => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} placeholder="简要描述模板包内容..." />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="btn-primary text-sm">创建</button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 border rounded-lg text-sm">取消</button>
          </div>
        </div>
      )}

      {/* 模板列表 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="搜索模板..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">模板</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">分类</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">售价</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">销量</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">评分</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">状态</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(tpl => {
                const isEditing = editingId === tpl.id;
                return (
                  <tr key={tpl.id} className={`border-b border-gray-50 hover:bg-gray-50 ${!tpl.active ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tpl.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {isEditing ? (
                              <input type="text" defaultValue={tpl.name} className="px-2 py-1 border rounded text-sm w-48" />
                            ) : tpl.name}
                            {tpl.featured && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">精选</span>}
                          </div>
                          <div className="text-xs text-gray-400 truncate max-w-xs">{tpl.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {isEditing ? (
                        <input type="text" defaultValue={tpl.category} className="px-2 py-1 border rounded text-xs w-24" />
                      ) : tpl.category}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">¥</span>
                          <input type="number" defaultValue={tpl.price} className="w-20 px-2 py-1 border rounded text-xs" />
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium text-gray-900">¥{tpl.price}</span>
                          {tpl.originalPrice > tpl.price && (
                            <span className="text-xs text-gray-400 line-through ml-1">¥{tpl.originalPrice}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input type="number" defaultValue={tpl.sales} className="w-20 px-2 py-1 border rounded text-xs" />
                      ) : (
                        <span className="text-gray-700">{tpl.sales.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3.5 h-3.5 fill-yellow-500" />
                        {tpl.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setTemplates(prev => prev.map(t => t.id === tpl.id ? { ...t, active: !t.active } : t))}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tpl.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {tpl.active ? '上架' : '下架'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSave(tpl.id)} className="text-xs text-green-600 hover:text-green-700">
                              {saved === tpl.id ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:text-gray-600">取消</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setEditingId(tpl.id)} className="text-xs text-primary-600 hover:text-primary-700">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button className="text-xs text-red-500 hover:text-red-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 销售趋势图区 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> 模板销售排行
        </h3>
        <div className="space-y-3">
          {[...templates].sort((a, b) => b.sales - a.sales).map((tpl, i) => (
            <div key={tpl.id} className="flex items-center gap-4">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i < 3 ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
              }`}>{i + 1}</span>
              <span className="text-lg">{tpl.icon}</span>
              <span className="text-sm text-gray-900 flex-1">{tpl.name}</span>
              <span className="text-sm text-gray-500">{tpl.sales.toLocaleString()} 套</span>
              <span className="text-sm font-medium text-gray-900">¥{(tpl.price * tpl.sales).toLocaleString()}</span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${(tpl.sales / 2156) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
