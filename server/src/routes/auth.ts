import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateToken, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';

const DEMO_MODE = process.env.DEMO_MODE === 'true';

export const authRouter = Router();

/**
 * 用户注册
 */
authRouter.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, company } = req.body;

    if (!email || !password) {
      throw new AppError('邮箱和密码为必填项', 400);
    }
    if (password.length < 8) {
      throw new AppError('密码至少8位', 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('该邮箱已注册', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || email.split('@')[0],
        company,
        planTier: 'FREE',
        credits: 100,
        subscription: {
          create: {
            planTier: 'FREE',
            status: 'ACTIVE',
            maxSites: 1,
            maxDailyQueries: 3,
            maxContentDaily: 5,
          },
        },
      },
    });

    const token = generateToken({
      userId: user.id,
      role: user.role,
      planTier: user.planTier,
    });

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          planTier: user.planTier,
        },
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '注册失败，请稍后重试' });
  }
});

/**
 * 用户登录
 */
authRouter.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('请输入邮箱和密码', 400);
    }

    // 演示模式：任意账号密码均可登录
    if (DEMO_MODE) {
      const demoUser = {
        id: 'demo-user-001', email, name: email.split('@')[0],
        role: 'ADMIN', planTier: 'PROFESSIONAL', credits: 286,
        company: '示例科技有限公司',
      };
      const token = generateToken({ userId: demoUser.id, role: demoUser.role, planTier: demoUser.planTier });
      return res.json({ success: true, data: { token, user: demoUser } });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new AppError('邮箱或密码错误', 401);
    }

    if (!user.isActive) {
      throw new AppError('账号已被禁用', 403);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('邮箱或密码错误', 401);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken({
      userId: user.id,
      role: user.role,
      planTier: user.planTier,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          planTier: user.planTier,
          credits: user.credits,
          company: user.company,
        },
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '登录失败' });
  }
});

/**
 * 获取当前用户信息
 */
authRouter.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    // 演示模式
    if (!req.userId || req.userId === 'demo-user-001') {
      return res.json({
        success: true,
        data: {
          id: 'demo-user-001',
          email: 'demo@geo-optimizer.com',
          name: '演示用户',
          role: 'ADMIN',
          planTier: 'PROFESSIONAL',
          credits: 286,
          company: '示例科技有限公司',
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true, email: true, name: true, role: true, planTier: true,
        credits: true, company: true, avatar: true, phone: true,
        dailyQueryUsed: true, createdAt: true,
      },
    });

    if (!user) throw new AppError('用户不存在', 404);

    res.json({ success: true, data: user });
  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: '获取用户信息失败' });
  }
});
