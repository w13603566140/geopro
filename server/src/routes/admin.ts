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
