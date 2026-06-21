import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const adminRouter = Router();

/**
 * 系统配置获取
 */
adminRouter.get('/system-config', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      siteName: 'GEO优化助手Pro',
      domain: 'geo-optimizer.com',
      frontendUrl: 'https://app.geo-optimizer.com',
      apiUrl: 'https://api.geo-optimizer.com',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      openRegistration: true,
      emailVerify: false,
      adminApprove: false,
      smtp: { host: 'smtp.example.com', port: 587, encryption: 'TLS' },
      security: { jwtExpiry: '30d', rateLimit: 60, loginLockout: 5, sessionTimeout: 30 },
      notifications: { wechat: false, dingtalk: false, feishu: false, slack: false },
    },
  });
});

/**
 * 系统配置更新
 */
adminRouter.put('/system-config', (req: AuthRequest, res: Response) => {
  const config = req.body;
  // 实际生产环境保存到数据库
  res.json({ success: true, message: '系统配置已更新', data: config });
});

/**
 * 用户列表
 */
adminRouter.get('/users', (_req: AuthRequest, res: Response) => {
  const users = [
    { id: '1', name: '张晓明', email: 'zhang@tech.com', plan: 'ENTERPRISE', role: 'ADMIN', status: 'active', credits: 12500 },
    { id: '2', name: '李开发', email: 'li@dev.com', plan: 'PROFESSIONAL', role: 'MANAGER', status: 'active', credits: 3200 },
    { id: '3', name: '王创业', email: 'wang@startup.cn', plan: 'FREE', role: 'EDITOR', status: 'active', credits: 86 },
    { id: '4', name: '刘测试', email: 'liu@test.cn', plan: 'FREE', role: 'EDITOR', status: 'suspended', credits: 10 },
  ];
  res.json({ success: true, data: users, total: users.length });
});

/**
 * 更新用户状态/角色
 */
adminRouter.put('/users/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role, status, planTier } = req.body;
  res.json({ success: true, message: `用户 ${id} 已更新`, data: { id, role, status, planTier } });
});

/**
 * 支付配置
 */
adminRouter.get('/payment-config', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      alipay: { enabled: true, appId: '2021••••••••••••', pid: '2088••••••••••••' },
      wechat: { enabled: true, mchId: '16••••••••', appId: 'wx••••••••••••••••' },
      epay: { enabled: true, apiUrl: 'https://pay.example.com/submit.php', pid: '1001', notifyUrl: 'https://api.geo-optimizer.com/api/payment/epay/notify', returnUrl: 'https://app.geo-optimizer.com/payment/return', defaultPayType: 'alipay', channels: { alipay: true, wxpay: true, qqpay: false, unionpay: false } },
      stripe: { enabled: false, publishableKey: 'pk_live_••••••••••••' },
      bankTransfer: { enabled: true, bank: '工商银行', account: '6222••••••••' },
    },
  });
});

/**
 * 支付配置更新
 */
adminRouter.put('/payment-config', (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: '支付配置已更新' });
});

/**
 * 套餐管理
 */
adminRouter.get('/plans', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'free', name: '免费引流版', price: 0, period: '永久免费', maxSites: 1, maxQueries: 3, maxContent: 5 },
      { id: 'pro', name: '专业订阅版', price: 299, period: '元/月', maxSites: 20, maxQueries: 50, maxContent: 50 },
      { id: 'enterprise', name: '企业年费版', price: 2999, period: '元/年', maxSites: 999, maxQueries: 999, maxContent: 999 },
    ],
  });
});

/**
 * 操作日志
 */
adminRouter.get('/logs', (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  res.json({
    success: true,
    data: {
      items: [],
      total: 1256,
      page,
      pageSize,
      totalPages: Math.ceil(1256 / pageSize),
    },
  });
});

// ========== 发布管理 ==========

/**
 * 获取发布平台配置
 */
adminRouter.get('/publish-config', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      platforms: [
        { id: 'wechat', name: '微信公众号', enabled: true, dailyLimit: 10, cooldownMinutes: 5, needReview: true },
        { id: 'zhihu', name: '知乎', enabled: true, dailyLimit: 20, cooldownMinutes: 3, needReview: false },
        { id: 'csdn', name: 'CSDN', enabled: true, dailyLimit: 30, cooldownMinutes: 2, needReview: false },
        { id: 'juejin', name: '掘金', enabled: true, dailyLimit: 15, cooldownMinutes: 5, needReview: true },
        { id: 'jianshu', name: '简书', enabled: false, dailyLimit: 10, cooldownMinutes: 5, needReview: false },
        { id: 'toutiao', name: '今日头条', enabled: false, dailyLimit: 5, cooldownMinutes: 10, needReview: true },
        { id: 'b2b', name: 'B2B平台矩阵', enabled: false, dailyLimit: 20, cooldownMinutes: 5, needReview: false },
        { id: 'media', name: '自媒体矩阵', enabled: false, dailyLimit: 30, cooldownMinutes: 3, needReview: true },
      ],
      planLimits: [
        { planId: 'FREE', dailyPublish: 0, monthlyPublish: 0, platforms: ['wechat'], allowScheduled: false, allowBulk: false },
        { planId: 'PROFESSIONAL', dailyPublish: 10, monthlyPublish: 100, platforms: ['wechat','zhihu','csdn','juejin'], allowScheduled: true, allowBulk: false },
        { planId: 'ENTERPRISE', dailyPublish: 50, monthlyPublish: 999, platforms: ['wechat','zhihu','csdn','juejin','jianshu','toutiao','b2b','media'], allowScheduled: true, allowBulk: true },
      ],
    },
  });
});

/**
 * 更新发布平台配置
 */
adminRouter.put('/publish-config', (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: '发布配置已更新', data: req.body });
});

/**
 * 获取发布队列状态
 */
adminRouter.get('/publish-queue', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: { pending: 12, processing: 3, completed: 1286, failed: 47 },
  });
});

// ========== 代运营管理 ==========

/**
 * 获取代运营订单列表
 */
adminRouter.get('/managed-orders', (req: AuthRequest, res: Response) => {
  const status = req.query.status as string;
  const orders = [
    { id: 'MO-20260620-001', planName: '标准代运营', companyName: '张科技有限公司', amount: 7999, status: 'active', assignedTo: '运营专员小王', startDate: '2026-06-20', endDate: '2026-07-20' },
    { id: 'MO-20260615-002', planName: '企业代运营', companyName: '李互联网集团', amount: 19999, status: 'active', assignedTo: '高级顾问老陈', startDate: '2026-06-15', endDate: '2026-07-15' },
    { id: 'MO-20260610-003', planName: '基础代运营', companyName: '王创业工作室', amount: 2999, status: 'pending', assignedTo: '待分配', startDate: '', endDate: '' },
    { id: 'MO-20260501-004', planName: '基础代运营', companyName: '刘测试科技', amount: 2999, status: 'completed', assignedTo: '运营专员小王', startDate: '2026-05-01', endDate: '2026-06-01' },
    { id: 'MO-20260415-005', planName: '标准代运营', companyName: '赵网络科技', amount: 7999, status: 'cancelled', assignedTo: '未分配', startDate: '', endDate: '' },
  ];
  const filtered = status ? orders.filter(o => o.status === status) : orders;
  res.json({ success: true, data: filtered, total: filtered.length });
});

/**
 * 更新订单状态
 */
adminRouter.put('/managed-orders/:id', (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;
  res.json({ success: true, message: `订单 ${id} 已更新`, data: { id, status, assignedTo } });
});

/**
 * 获取代运营套餐配置
 */
adminRouter.get('/managed-plans', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'basic', name: '基础代运营', price: 2999, period: '月', articlesPerMonth: 4, platformsCount: 3, active: true },
      { id: 'standard', name: '标准代运营', price: 7999, period: '月', articlesPerMonth: 12, platformsCount: 6, active: true },
      { id: 'enterprise', name: '企业代运营', price: 19999, period: '月', articlesPerMonth: 30, platformsCount: 8, active: true },
    ],
  });
});

// ========== 模板包管理 ==========

/**
 * 获取模板包列表（admin）
 */
adminRouter.get('/templates', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'saas-enterprise', name: 'SaaS企业服务包', category: 'SaaS/软件', price: 999, originalPrice: 1999, sales: 1283, rating: 4.9, active: true, featured: true },
      { id: 'ecommerce-retail', name: '电商零售行业包', category: '电商/零售', price: 799, originalPrice: 1599, sales: 2156, rating: 4.8, active: true, featured: false },
      { id: 'health-medical', name: '医疗健康行业包', category: '医疗/健康', price: 1299, originalPrice: 2499, sales: 876, rating: 4.7, active: true, featured: false },
      { id: 'education-training', name: '教育培训行业包', category: '教育/培训', price: 699, originalPrice: 1399, sales: 1654, rating: 4.8, active: true, featured: false },
      { id: 'finance-insurance', name: '金融保险行业包', category: '金融/保险', price: 1599, originalPrice: 2999, sales: 542, rating: 4.6, active: true, featured: false },
      { id: 'manufacturing', name: '智能制造行业包', category: '制造/工业', price: 1099, originalPrice: 2199, sales: 698, rating: 4.7, active: false, featured: false },
    ],
    stats: { totalSales: 7209, totalRevenue: 6284591, avgRating: 4.8, conversionRate: '12.4%' },
  });
});

/**
 * 创建/更新模板包
 */
adminRouter.post('/templates', (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: '模板已创建', data: req.body });
});

adminRouter.put('/templates/:id', (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: `模板 ${req.params.id} 已更新`, data: req.body });
});

adminRouter.delete('/templates/:id', (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: `模板 ${req.params.id} 已删除` });
});

// ========== 新手引导配置 ==========

/**
 * 获取引导配置
 */
adminRouter.get('/onboarding-config', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      autoShow: true,
      showOnDashboard: true,
      requireCompletion: false,
      skipAllowed: true,
      collectAnalytics: true,
      welcomeMessage: '欢迎使用GEO优化助手Pro！我是你的AI搜索引擎优化专家，5步帮你完成初始配置。',
      steps: [
        { id: 1, title: '产品信息', subtitle: '告诉AI你是谁', enabled: true, required: true },
        { id: 2, title: '目标关键词', subtitle: '设定关键词策略', enabled: true, required: true },
        { id: 3, title: '竞品分析', subtitle: '知己知彼', enabled: true, required: false },
        { id: 4, title: '功能预览', subtitle: '了解核心功能', enabled: true, required: false },
        { id: 5, title: '开始使用', subtitle: '完成配置', enabled: true, required: true },
      ],
    },
  });
});

/**
 * 更新引导配置
 */
adminRouter.put('/onboarding-config', (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: '引导配置已更新', data: req.body });
});
