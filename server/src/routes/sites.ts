import { Router, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';

export const sitesRouter = Router();

/**
 * 获取所有站点
 */
sitesRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const sites = await prisma.site.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: sites });
  } catch (error) {
    if (process.env.DEMO_MODE === 'true') {
      return res.json({
        success: true,
        data: [
          { id: 'demo-site-1', name: 'AI网关Pro官网', url: 'https://example.com', type: 'OFFICIAL_WEBSITE', isVerified: true, status: 'ACTIVE', geoScore: 85, lastAuditAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'demo-site-2', name: '开发文档站', url: 'https://docs.example.com', type: 'DOCS_SITE', isVerified: true, status: 'ACTIVE', geoScore: 72, lastAuditAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'demo-site-3', name: '开源项目页', url: 'https://github.com/example/project', type: 'OPEN_SOURCE', isVerified: false, status: 'PENDING', geoScore: 58, lastAuditAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ]
      });
    }
    res.status(500).json({ success: false, error: '获取站点列表失败' });
  }
});

/**
 * 获取单个站点
 */
sitesRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const site = await prisma.site.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { auditReports: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
    if (!site) throw new AppError('站点不存在', 404);
    res.json({ success: true, data: site });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '获取站点失败' });
  }
});

/**
 * 添加站点
 */
sitesRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, url, type, brandName, productName, mainService, industry, targetCustomer, framework } = req.body;

    if (!name || !url) throw new AppError('站点名称和URL为必填项', 400);

    // DEMO_MODE 下跳过数据库操作，返回模拟数据
    if (process.env.DEMO_MODE === 'true') {
      const demoSite = {
        id: 'demo-site-' + Date.now(),
        userId: req.userId || 'demo-user-001',
        name,
        url,
        type: type || 'OFFICIAL_WEBSITE',
        brandName: brandName || null,
        productName: productName || null,
        mainService: mainService || null,
        industry: industry || null,
        targetCustomer: targetCustomer || null,
        framework: framework || 'OTHER',
        isVerified: false,
        status: 'PENDING',
        geoScore: null,
        lastAuditAt: null,
        verificationToken: `geo-verify-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return res.status(201).json({ success: true, data: demoSite });
    }

    // 检查站点数量限制
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const siteCount = await prisma.site.count({ where: { userId: req.userId } });
    const limits: Record<string, number> = { FREE: 1, PROFESSIONAL: 20, ENTERPRISE: 999 };

    if (siteCount >= limits[user?.planTier || 'FREE']) {
      throw new AppError('已达到套餐站点数量上限，请升级套餐', 403);
    }

    const site = await prisma.site.create({
      data: {
        userId: req.userId!,
        name,
        url,
        type: type || 'OFFICIAL_WEBSITE',
        framework: framework || 'OTHER',
        brandName,
        productName,
        mainService,
        industry,
        targetCustomer,
        verificationToken: `geo-verify-${Date.now().toString(36)}`,
      },
    });

    res.status(201).json({ success: true, data: site });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '添加站点失败' });
  }
});

/**
 * 更新站点
 */
sitesRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const site = await prisma.site.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!site) throw new AppError('站点不存在', 404);

    const updated = await prisma.site.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '更新站点失败' });
  }
});

/**
 * 删除站点
 */
sitesRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const site = await prisma.site.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!site) throw new AppError('站点不存在', 404);

    await prisma.site.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: '站点已删除' });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '删除站点失败' });
  }
});

/**
 * 验证站点所有权
 */
sitesRouter.post('/:id/verify', async (req: AuthRequest, res: Response) => {
  try {
    const { method } = req.body; // FILE_UPLOAD / DNS_TXT / HTML_META
    const site = await prisma.site.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!site) throw new AppError('站点不存在', 404);

    const updated = await prisma.site.update({
      where: { id: req.params.id },
      data: {
        verificationMethod: method,
        isVerified: true,
        verifiedAt: new Date(),
        status: 'ACTIVE',
      },
    });

    res.json({ success: true, data: updated, message: '站点验证成功' });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '站点验证失败' });
  }
});
