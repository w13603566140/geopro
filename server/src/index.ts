import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { authRouter } from './routes/auth';
import { sitesRouter } from './routes/sites';
import { auditRouter } from './routes/audit';
import { structuredDataRouter } from './routes/structured-data';
import { monitoringRouter } from './routes/monitoring';
import { competitorsRouter } from './routes/competitors';
import { contentRouter } from './routes/content';
import { mcpRouter } from './routes/mcp';
import { billingRouter } from './routes/billing';
import { settingsRouter } from './routes/settings';
import { adminRouter } from './routes/admin';
import { diagnosisRouter } from './routes/diagnosis';
import { paymentRouter } from './routes/payment-callback';
import publishRouter from './routes/publish';
import managedRouter from './routes/managed';
import templatesRouter from './routes/templates';
import onboardingRouter from './routes/onboarding';
import adminAuthRouter from './routes/admin-auth';
import creditsRouter from './routes/credits';
import { startScheduler } from './services/scheduler';
import { errorHandler } from './middleware/error-handler';
import { authenticate } from './middleware/auth';

export const app = express();
const PORT = process.env.PORT || 3001;

// ========== 全局中间件 ==========

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 全局限流
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000,
  message: { success: false, error: '请求过于频繁，请稍后再试' },
});
app.use('/api/', globalLimiter);

// ========== 健康检查 ==========

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'GEO优化助手Pro后端服务运行中',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ========== API路由 ==========

app.use('/api/auth', authRouter);
app.use('/api/sites', authenticate, sitesRouter);
app.use('/api/audit', authenticate, auditRouter);
app.use('/api/structured-data', authenticate, structuredDataRouter);
app.use('/api/monitoring', authenticate, monitoringRouter);
app.use('/api/competitors', authenticate, competitorsRouter);
app.use('/api/content', authenticate, contentRouter);
app.use('/api/mcp', authenticate, mcpRouter);
app.use('/api/billing', authenticate, billingRouter);
app.use('/api/settings', authenticate, settingsRouter);
app.use('/api/admin', authenticate, adminRouter);
app.use('/api/diagnosis', authenticate, diagnosisRouter);
app.use('/api/payment', paymentRouter);  // 支付回调不需要认证
app.use('/api/admin-auth', adminAuthRouter);  // 管理后台独立认证
app.use('/api/publish', authenticate, publishRouter);
app.use('/api/managed', authenticate, managedRouter);
app.use('/api/templates', authenticate, templatesRouter);
app.use('/api/onboarding', authenticate, onboardingRouter);
app.use('/api/credits', authenticate, creditsRouter);

// 启动定时任务
startScheduler();

// ========== 错误处理 ==========

app.use(errorHandler);

// ========== 启动服务 ==========

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 GEO优化助手Pro 后端服务已启动`);
    console.log(`📡 地址: http://localhost:${PORT}`);
    console.log(`📋 健康检查: http://localhost:${PORT}/api/health`);
    console.log(`📚 API文档: http://localhost:${PORT}/api/health\n`);
  });
}
