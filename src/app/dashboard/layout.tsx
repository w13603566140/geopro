import DashboardLayoutClient from './layout-client';

// 演示模式：绕过认证直接进入后台
const DEMO_SESSION = {
  user: {
    id: 'demo-user-001',
    email: 'demo@geo-optimizer.com',
    name: '演示用户',
    role: 'ADMIN',
    planTier: 'PROFESSIONAL',
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient session={DEMO_SESSION as any}>{children}</DashboardLayoutClient>;
}
