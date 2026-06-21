import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const userId = (session.user as any).id;
  const sites = await prisma.site.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ data: sites });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json();

  // 检查站点数量限制
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const siteCount = await prisma.site.count({ where: { userId } });
  const limits: Record<string, number> = { FREE: 1, PROFESSIONAL: 20, ENTERPRISE: 999 };

  if (siteCount >= limits[user?.planTier || 'FREE']) {
    return NextResponse.json({ error: '已达到套餐站点数量上限，请升级套餐' }, { status: 403 });
  }

  const site = await prisma.site.create({
    data: {
      userId,
      name: body.name,
      url: body.url,
      type: body.type || 'OFFICIAL_WEBSITE',
      brandName: body.brandName,
      productName: body.productName,
      mainService: body.mainService,
      industry: body.industry,
      targetCustomer: body.targetCustomer,
      verificationToken: generateToken(),
    },
  });

  return NextResponse.json({ data: site }, { status: 201 });
}

function generateToken(): string {
  return 'geo-verify-' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
