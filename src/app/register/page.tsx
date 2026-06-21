'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', company: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('两次密码输入不一致');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          company: form.company,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '注册失败');

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">创建免费账号</h1>
          <p className="text-gray-500 text-sm mt-1">开始你的AI搜索引擎优化之旅</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">姓名</label>
            <input type="text" className="input-field" placeholder="请输入姓名"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">邮箱</label>
            <input type="email" className="input-field" placeholder="请输入邮箱"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label">公司/团队名称（选填）</label>
            <input type="text" className="input-field" placeholder="请输入公司名称"
              value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          </div>
          <div>
            <label className="label">密码</label>
            <input type="password" className="input-field" placeholder="至少8位密码"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} />
          </div>
          <div>
            <label className="label">确认密码</label>
            <input type="password" className="input-field" placeholder="再次输入密码"
              value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
            {loading ? '注册中...' : '免费注册'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          注册即表示同意{' '}
          <Link href="/terms" className="text-primary-600 hover:underline">服务条款</Link>
          {' '}和{' '}
          <Link href="/privacy" className="text-primary-600 hover:underline">隐私政策</Link>
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          已有账号？{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">立即登录</Link>
        </p>
      </div>
    </div>
  );
}
