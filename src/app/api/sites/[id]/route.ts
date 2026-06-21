import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const userId = (session.user as any).id;
  const site = await prisma.site.findFirst({
    where: { id: params.id, userId },
  });

  if (!site) return NextResponse.json({ error: '站点不存在' }, { status: 404 });

  await prisma.site.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
