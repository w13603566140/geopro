'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-hero-gradient">
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      {/* 光晕装饰 */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

      {/* 登录卡片 - 玻璃拟态 */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">登录GEO优化助手</h1>
            <p className="text-slate-500 text-sm mt-1">欢迎回来，继续你的AI优化之旅</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">邮箱</label>
              <input
                type="email"
                className="input-field"
                placeholder="请输入邮箱"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">密码</label>
              <input
                type="password"
                className="input-field"
                placeholder="请输入密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full !py-3 text-base"
              disabled={loading || !agreed}
            >
              {loading ? '登录中...' : '登录'}
            </button>

            <label className="flex items-start gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs text-slate-500">
                登录即表示同意{' '}
                <Link href="/terms" target="_blank" className="text-primary-600 hover:underline">服务条款</Link>
                {' '}和{' '}
                <Link href="/privacy" target="_blank" className="text-primary-600 hover:underline">隐私政策</Link>
              </span>
            </label>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            还没有账号？{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              免费注册
            </Link>
          </p>
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
