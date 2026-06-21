import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, company } = await req.json();

    // 验证
    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码为必填项' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: '密码至少8位' }, { status: 400 });
    }

    // 检查邮箱是否已注册
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
    }

    // 创建用户
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || email.split('@')[0],
        company,
        planTier: 'FREE',
        credits: 100,
      },
    });

    // 创建免费订阅
    await prisma.subscription.create({
      data: {
        userId: user.id,
        planTier: 'FREE',
        status: 'ACTIVE',
        maxSites: 1,
        maxDailyQueries: 3,
        maxContentDaily: 5,
      },
    });

    return NextResponse.json({
      success: true,
      message: '注册成功',
      userId: user.id,
    }, { status: 201 });
  } catch (error: any) {
    console.error('注册失败:', error);
    return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
  }
}
