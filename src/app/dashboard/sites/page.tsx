import SitesClient from './sites-client';

// 演示模式：使用模拟站点数据
export const dynamic = 'force-dynamic';

const DEMO_SITES = [
  {
    id: 'demo-site-1',
    name: 'AI网关Pro官网',
    url: 'https://example.com',
    type: 'OFFICIAL_WEBSITE',
    brandName: 'AI网关Pro',
    isVerified: true,
    status: 'ACTIVE',
    geoScore: 85,
    lastAuditAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-site-2',
    name: '开发文档中心',
    url: 'https://docs.example.com',
    type: 'DOCS_SITE',
    brandName: 'AI网关Pro',
    isVerified: true,
    status: 'ACTIVE',
    geoScore: 72,
    lastAuditAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-site-3',
    name: 'GitHub开源项目',
    url: 'https://github.com/example/project',
    type: 'OPEN_SOURCE',
    brandName: null,
    isVerified: false,
    status: 'PENDING_VERIFICATION',
    geoScore: 58,
    lastAuditAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function SitesPage() {
  return <SitesClient initialSites={DEMO_SITES as any} />;
}
