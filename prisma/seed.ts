import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始种子数据初始化...');

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@geo-optimizer.com' },
    update: {},
    create: {
      email: 'admin@geo-optimizer.com',
      passwordHash: adminPassword,
      name: '系统管理员',
      company: 'GEO优化助手',
      role: 'SUPER_ADMIN',
      planTier: 'ENTERPRISE',
      credits: 99999,
      isActive: true,
    },
  });
  console.log(`✅ 管理员账号: admin@geo-optimizer.com / admin123456`);

  // 创建演示用户
  const demoPassword = await bcrypt.hash('demo123456', 12);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@geo-optimizer.com' },
    update: {},
    create: {
      email: 'demo@geo-optimizer.com',
      passwordHash: demoPassword,
      name: '演示用户',
      company: '示例科技有限公司',
      role: 'ADMIN',
      planTier: 'FREE',
      credits: 100,
      isActive: true,
    },
  });
  console.log(`✅ 演示账号: demo@geo-optimizer.com / demo123456`);

  // 创建演示站点
  const demoSite = await prisma.site.upsert({
    where: { id: 'demo-site-001' },
    update: {},
    create: {
      id: 'demo-site-001',
      userId: demo.id,
      name: 'AI网关Pro官网',
      url: 'https://example.com',
      type: 'OFFICIAL_WEBSITE',
      brandName: 'AI网关Pro',
      productName: '多模型AI中转网关',
      mainService: '提供国内可用的多模型AI API统一代理服务，支持OpenAI、Claude、Gemini等模型的统一调用',
      industry: 'AI工具',
      targetCustomer: '开发者、AI创业团队、企业技术部门',
      pricingModel: '免费版/专业版¥299/月/企业版¥2999/年',
      isVerified: true,
      status: 'ACTIVE',
      geoScore: 72,
    },
  });
  console.log(`✅ 演示站点已创建`);

  // 创建免费套餐订阅
  await prisma.subscription.upsert({
    where: { id: 'demo-sub-001' },
    update: {},
    create: {
      id: 'demo-sub-001',
      userId: demo.id,
      planTier: 'FREE',
      status: 'ACTIVE',
      maxSites: 1,
      maxDailyQueries: 3,
      maxContentDaily: 5,
    },
  });

  // 创建企业套餐订阅
  await prisma.subscription.upsert({
    where: { id: 'admin-sub-001' },
    update: {},
    create: {
      id: 'admin-sub-001',
      userId: admin.id,
      planTier: 'ENTERPRISE',
      status: 'ACTIVE',
      maxSites: 999,
      maxDailyQueries: 999,
      maxContentDaily: 999,
    },
  });

  console.log('✅ 种子数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
