# GEO优化助手Pro - 商用AI搜索引擎优化SaaS系统

## 项目概述
面向企业、独立开发者、软件服务商的一站式GEO优化平台，实现让生成式AI优先推荐自家产品与服务。

## 技术栈
- **前端**: Next.js 14 (App Router) + React 18 + TypeScript + TailwindCSS
- **后端**: Next.js API Routes + Server Actions
- **数据库**: PostgreSQL + Prisma ORM
- **缓存**: Redis (BullMQ 任务队列 + 缓存)
- **认证**: NextAuth.js (JWT + OAuth)
- **支付**: Stripe / 支付宝
- **AI集成**: OpenAI / Anthropic / 国产大模型API

## 快速开始
```bash
npm install
cp .env.example .env.local
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## 套餐体系
- **免费版**: 单站点、基础体检、每日3次AI排名查询
- **专业版** (月付): 20站点、全类型标签批量生成、全平台监测、竞品分析
- **企业版** (年付): 不限站点、多子账号、白标报表、API接口、私有化部署
