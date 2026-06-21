import { getServerSession } from 'next-auth';
import { authOptions } from './auth.config';
import { PlanTier } from '@/types';
import prisma from '@/lib/prisma';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { subscription: true },
  });
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('未登录，请先登录');
  }
  return user;
}

export async function requirePlan(minPlan: PlanTier) {
  const user = await requireAuth();
  const planOrder: Record<PlanTier, number> = {
    FREE: 0,
    PROFESSIONAL: 1,
    ENTERPRISE: 2,
  };

  if (planOrder[user.planTier] < planOrder[minPlan]) {
    throw new Error('当前套餐不支持此功能，请升级套餐');
  }
  return user;
}

export async function checkCreditBalance(userId: string, required: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  if (!user || user.credits < required) {
    throw new Error(`积分不足，需要${required}积分，当前余额${user?.credits || 0}积分`);
  }
}

export async function deductCredits(userId: string, amount: number, description: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: amount } },
  });

  await prisma.creditTransaction.create({
    data: {
      userId,
      amount: -amount,
      balance: user.credits,
      description,
      type: 'CONSUME',
    },
  });

  return user;
}

export async function checkDailyQuota(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { dailyQueryUsed: true, dailyQueryDate: true, planTier: true },
  });

  if (!user) throw new Error('用户不存在');

  const today = new Date().toDateString();
  const queryDate = user.dailyQueryDate?.toDateString();

  if (queryDate !== today) {
    // 重置每日配额
    await prisma.user.update({
      where: { id: userId },
      data: { dailyQueryUsed: 0, dailyQueryDate: new Date() },
    });
    return true;
  }

  const limits: Record<PlanTier, number> = { FREE: 3, PROFESSIONAL: 50, ENTERPRISE: 999 };
  return user.dailyQueryUsed < limits[user.planTier];
}
