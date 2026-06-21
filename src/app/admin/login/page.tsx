'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, isAdmin } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 已登录则跳转
  if (isAdmin) {
    router.replace('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请输入账号和密码');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await adminLogin(username, password);
      router.replace('/admin');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo区 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl mb-4 ring-1 ring-slate-700">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">GEO 管理后台</h1>
          <p className="text-slate-400 text-sm mt-2">独立后台系统 · 仅限管理员访问</p>
        </div>

        {/* 登录卡片 */}
        <div className="bg-slate-800 rounded-2xl p-8 ring-1 ring-slate-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 错误提示 */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">管理员账号</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="输入管理员账号"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500
                  focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                autoComplete="username"
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">管理员密码</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="输入管理员密码"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500
                    focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />验证中...</>
              ) : (
                '登录管理后台'
              )}
            </button>
          </form>

          {/* 底部提示 */}
          <p className="mt-6 text-center text-xs text-slate-600">
            默认账号: admin · 密码: admin888
          </p>
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            ← 返回前台首页
          </a>
        </div>
      </div>
    </div>
  );
}
