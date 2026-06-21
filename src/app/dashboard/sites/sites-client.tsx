'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ExternalLink, CheckCircle, XCircle, Clock, RefreshCw, Trash2, Search } from 'lucide-react';
import { sitesApi } from '@/lib/api-client';

interface SiteData {
  id: string;
  name: string;
  url: string;
  type: string;
  brandName: string | null;
  isVerified: boolean;
  status: string;
  geoScore: number | null;
  lastAuditAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function SitesClient() {
  const router = useRouter();
  const [sites, setSites] = useState<SiteData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '', url: '', type: 'OFFICIAL_WEBSITE', brandName: '',
    productName: '', mainService: '', industry: '', targetCustomer: '',
  });

  // 加载站点
  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const res = await sitesApi.list();
      if (res.success && res.data) setSites(res.data as SiteData[]);
    } catch { /* keep demo data */ }
    setLoading(false);
  };

  const siteTypes: Record<string, string> = {
    OFFICIAL_WEBSITE: '官方网站',
    DOCS_SITE: '文档站',
    OPEN_SOURCE: '开源项目',
    API_GATEWAY: 'API网关',
    DOWNLOAD_SITE: '下载站',
    BLOG: '博客',
    OTHER: '其他',
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sitesApi.create(form);
      if (res.success && res.data) {
        setSites([res.data as SiteData, ...sites]);
        setShowAdd(false);
        setForm({ name: '', url: '', type: 'OFFICIAL_WEBSITE', brandName: '', productName: '', mainService: '', industry: '', targetCustomer: '' });
      } else {
        alert(res.error || '添加站点失败');
      }
    } catch (err: any) {
      alert(err.message || '添加站点失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此站点？相关数据将一并删除。')) return;
    await sitesApi.delete(id);
    setSites(sites.filter(s => s.id !== id));
  };

  const getStatusBadge = (site: SiteData) => {
    if (!site.isVerified) return <span className="badge-warning flex items-center gap-1"><Clock className="w-3 h-3" />待验证</span>;
    if (site.status === 'ACTIVE') return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" />正常</span>;
    return <span className="badge-danger flex items-center gap-1"><XCircle className="w-3 h-3" />异常</span>;
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">站点管理</h1>
          <p className="text-gray-500 mt-1">管理你的所有待优化网站</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> 添加站点
        </button>
      </div>

      {/* 添加站点表单 */}
      {showAdd && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">添加新站点</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">站点名称 *</label>
                <input type="text" className="input-field" placeholder="如: 我的产品官网"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">站点URL *</label>
                <input type="url" className="input-field" placeholder="https://example.com"
                  value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} required />
              </div>
              <div>
                <label className="label">站点类型</label>
                <select className="input-field" value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}>
                  {Object.entries(siteTypes).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">品牌名称</label>
                <input type="text" className="input-field" placeholder="品牌名称"
                  value={form.brandName} onChange={e => setForm({ ...form, brandName: e.target.value })} />
              </div>
              <div>
                <label className="label">产品名称</label>
                <input type="text" className="input-field" placeholder="核心产品名称"
                  value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })} />
              </div>
              <div>
                <label className="label">所属行业</label>
                <input type="text" className="input-field" placeholder="如: AI工具、软件开发"
                  value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">主营服务描述</label>
              <textarea className="input-field" rows={2} placeholder="简要描述主营服务与目标客户"
                value={form.mainService} onChange={e => setForm({ ...form, mainService: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '添加中...' : '确认添加'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>取消</button>
            </div>
          </form>
        </div>
      )}

      {/* 站点列表 */}
      {sites.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🌐</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">还没有添加站点</h3>
          <p className="text-gray-500 mb-4">添加你的网站，开始AI搜索引擎优化之旅</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            <Plus className="w-4 h-4 inline mr-1" /> 添加第一个站点
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sites.map(site => (
            <div key={site.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{site.name}</h3>
                    {getStatusBadge(site)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="truncate">{site.url}</span>
                    <a href={site.url} target="_blank" rel="noopener" className="text-primary-500 hover:text-primary-700">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>类型: {siteTypes[site.type] || site.type}</span>
                    {site.brandName && <span>品牌: {site.brandName}</span>}
                    {site.lastAuditAt && (
                      <span>上次体检: {new Date(site.lastAuditAt).toLocaleDateString('zh-CN')}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(site.geoScore)}`}>
                      {site.geoScore ?? '--'}
                    </div>
                    <div className="text-xs text-gray-400">GEO评分</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => router.push(`/dashboard/audit?siteId=${site.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg" title="立即体检">
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => handleDelete(site.id)}
                      className="p-2 hover:bg-red-50 rounded-lg" title="删除">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
