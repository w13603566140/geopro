import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'geo-optimizer-secret-key-change-in-production';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-master-key-change-me';

// 管理后台独立账号体系（生产环境从数据库读取）
const ADMIN_ACCOUNTS = [
  {
    id: 'super-admin-001',
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin888',
    role: 'super_admin' as const,
  },
  {
    id: 'admin-002',
    username: 'operator',
    password: 'operator666',
    role: 'operator' as const,
  },
];

/**
 * POST /api/admin-auth/login
 * 管理后台独立登录（与用户账号体系分离）
 */
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '请输入管理员账号和密码',
    });
  }

  // 查找匹配的管理员账号
  const admin = ADMIN_ACCOUNTS.find(
    a => a.username === username && a.password === password
  );

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: '账号或密码错误',
    });
  }

  // 生成管理员JWT（带admin role标记）
  const token = jwt.sign(
    {
      adminId: admin.id,
      username: admin.username,
      role: admin.role,
      type: 'admin', // 标记为管理员token
      iat: Math.floor(Date.now() / 1000),
    },
    ADMIN_SECRET,
    { expiresIn: '12h' }
  );

  return res.json({
    success: true,
    message: '登录成功',
    data: {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        lastLogin: new Date().toISOString(),
      },
    },
  });
});

/**
 * POST /api/admin-auth/verify
 * 验证管理员token有效性
 */
router.post('/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未提供token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ADMIN_SECRET) as any;

    if (decoded.type !== 'admin') {
      return res.status(403).json({ success: false, message: '非管理员token' });
    }

    return res.json({
      success: true,
      data: {
        id: decoded.adminId,
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch {
    return res.status(401).json({ success: false, message: 'token已过期或无效' });
  }
});

/**
 * POST /api/admin-auth/change-password
 * 修改管理员密码
 */
router.post('/change-password', (req: Request, res: Response) => {
  const { username, oldPassword, newPassword } = req.body;

  const admin = ADMIN_ACCOUNTS.find(
    a => a.username === username && a.password === oldPassword
  );

  if (!admin) {
    return res.status(400).json({ success: false, message: '原密码错误' });
  }

  admin.password = newPassword;

  return res.json({ success: true, message: '密码修改成功' });
});

export default router;
