import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { AppError } from '../middleware/error-handler';
import bcrypt from 'bcryptjs';

export const settingsRouter = Router();

/**
 * 获取用户个人资料
 */
settingsRouter.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, phone: true, company: true, avatar: true },
    });
    if (!user) throw new AppError('用户不存在', 404);
    res.json({ success: true, data: user });
  } catch (error: any) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: '获取资料失败' });
  }
});

/**
 * 更新个人资料
 */
settingsRouter.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, company } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, phone, company },
      select: { id: true, email: true, name: true, phone: true, company: true },
    });
    res.json({ success: true, data: user, message: '保存成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: '更新失败' });
  }
});

/**
 * 修改密码
 */
settingsRouter.put('/password', async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) throw new AppError('请填写完整信息', 400);
    if (newPassword.length < 8) throw new AppError('新密码至少8位', 400);

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user?.passwordHash) throw new AppError('用户不存在', 404);

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new AppError('当前密码错误', 400);

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.userId }, data: { passwordHash } });

    res.json({ success: true, message: '密码修改成功' });
  } catch (error: any) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, error: error.message });
    res.status(500).json({ success: false, error: '修改密码失败' });
  }
});

/**
 * 获取通知设置
 */
settingsRouter.get('/notifications', async (req: AuthRequest, res: Response) => {
  // 示例通知设置
  res.json({
    success: true,
    data: {
      rankDecline: true,
      competitorAlert: true,
      negativeMention: true,
      scoreDecline: true,
      weeklyReport: true,
      email: true,
      wechat: false,
    },
  });
});

/**
 * API密钥信息
 */
settingsRouter.get('/api-keys', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      key: 'sk-geo-••••••••••••••••',
      createdAt: new Date().toISOString(),
      apis: [
        { method: 'POST', path: '/api/v1/audit', desc: 'GEO体检诊断' },
        { method: 'POST', path: '/api/v1/structured-data', desc: '结构化标签生成' },
        { method: 'POST', path: '/api/v1/monitoring/check', desc: 'AI排名查询' },
        { method: 'POST', path: '/api/v1/content/generate', desc: 'AI内容生成' },
        { method: 'GET', path: '/api/v1/report/export', desc: '数据报表导出' },
      ],
    },
  });
});
