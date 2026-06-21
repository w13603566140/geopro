import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'geo-optimizer-secret-key-change-in-production';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userPlanTier?: string;
}

/**
 * JWT 认证中间件
 */
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 演示模式：允许无token访问
    if (process.env.DEMO_MODE === 'true') {
      req.userId = 'demo-user-001';
      req.userRole = 'ADMIN';
      req.userPlanTier = 'PROFESSIONAL';
      return next();
    }
    return res.status(401).json({ success: false, error: '未登录，请先登录' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userPlanTier = decoded.planTier;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: '登录已过期，请重新登录' });
  }
}

/**
 * 套餐等级权限中间件
 */
export function requirePlan(minPlan: string) {
  const planOrder: Record<string, number> = {
    FREE: 0,
    PROFESSIONAL: 1,
    ENTERPRISE: 2,
  };

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userPlan = req.userPlanTier || 'FREE';
    if (planOrder[userPlan] < planOrder[minPlan]) {
      return res.status(403).json({
        success: false,
        error: '当前套餐不支持此功能，请升级套餐',
        requiredPlan: minPlan,
        currentPlan: userPlan,
      });
    }
    next();
  };
}

/**
 * 生成JWT Token
 */
export function generateToken(payload: { userId: string; role: string; planTier: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

/**
 * 可选认证（不强制要求登录）
 */
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      req.userPlanTier = decoded.planTier;
    } catch {
      // 忽略无效token
    }
  }
  next();
}
