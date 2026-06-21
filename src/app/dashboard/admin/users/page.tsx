'use client';

import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Shield, Ban, CheckCircle, XCircle, Mail, Filter, Download } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  role: string;
  status: string;
  credits: number;
  createdAt: string;
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  const users: UserData[] = [
    { id: '1', name: '张晓明', email: 'zhang@tech.com', company: '张科技有限公司', plan: 'ENTERPRISE', role: 'ADMIN', status: 'active', credits: 12500, createdAt: '2026-01-15' },
    { id: '2', name: '李开发', email: 'li@dev.com', company: '李开发工作室', plan: 'PROFESSIONAL', role: 'MANAGER', status: 'active', credits: 3200, createdAt: '2026-03-22' },
    { id: '3', name: '王创业', email: 'wang@startup.cn', company: '王创业团队', plan: 'FREE', role: 'EDITOR', status: 'active', credits: 86, createdAt: '2026-06-10' },
    { id: '4', name: '赵运维', email: 'zhao@ops.com', company: '赵互联网公司', plan: 'PROFESSIONAL', role: 'VIEWER', status: 'active', credits: 450, createdAt: '2026-05-08' },
    { id: '5', name: '刘测试', email: 'liu@test.cn', company: '-', plan: 'FREE', role: 'EDITOR', status: 'suspended', credits: 10, createdAt: '2026-06-18' },
    { id: '6', name: '陈设计', email: 'chen@design.cn', company: '陈设计工作室', plan: 'PROFESSIONAL', role: 'EDITOR', status: 'active', credits: 890, createdAt: '2026-04-30' },
  ];

  const getPlanBadge = (plan: string) => {
    const map: Record<string, string> = { ENTERPRISE: 'bg-purple-100 text-purple-700', PROFESSIONAL: 'bg-blue-100 text-blue-700', FREE: 'bg-gray-100 text-gray-600' };
    const names: Record<string, string> = { ENTERPRISE: '企业版', PROFESSIONAL: '专业版', FREE: '免费版' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[plan]}`}>{names[plan]}</span>;
  };

  const getRoleBadge = (role: string) => {
    const map: Record<string, string> = { ADMIN: 'bg-red-50 text-red-700', MANAGER: 'bg-orange-50 text-orange-700', EDITOR: 'bg-blue-50 text-blue-700', VIEWER: 'bg-gray-50 text-gray-600' };
    const names: Record<string, string> = { ADMIN: '管理员', MANAGER: '经理', EDITOR: '编辑', VIEWER: '只读' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[role]}`}>{names[role]}</span>;
  };

  const filteredUsers = users.filter(u => {
    if (search && !u.name.includes(search) && !u.email.includes(search) && !u.company.includes(search)) return false;
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterPlan !== 'all' && u.plan !== filterPlan) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 搜索和筛选 */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" className="input-field !pl-10" placeholder="搜索用户名称/邮箱/公司..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field !w-auto" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="all">全部角色</option>
            <option value="ADMIN">管理员</option>
            <option value="MANAGER">经理</option>
            <option value="EDITOR">编辑</option>
            <option value="VIEWER">只读</option>
          </select>
          <select className="input-field !w-auto" value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
            <option value="all">全部套餐</option>
            <option value="ENTERPRISE">企业版</option>
            <option value="PROFESSIONAL">专业版</option>
            <option value="FREE">免费版</option>
          </select>
          <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />添加用户</button>
          <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />导出</button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['用户信息', '套餐', '角色', '积分', '状态', '注册时间', '操作'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-700 font-medium text-sm">{user.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                        {user.company !== '-' && <div className="text-xs text-gray-400">{user.company}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getPlanBadge(user.plan)}</td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-gray-700">{user.credits.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {user.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.status === 'active' ? '正常' : '已禁用'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="编辑" className="p-1.5 hover:bg-gray-100 rounded-lg"><Shield className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button title="邮件" className="p-1.5 hover:bg-gray-100 rounded-lg"><Mail className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button title={user.status === 'active' ? '禁用' : '启用'}
                        className={`p-1.5 rounded-lg ${user.status === 'active' ? 'hover:bg-red-50' : 'hover:bg-green-50'}`}>
                        {user.status === 'active' ? <Ban className="w-3.5 h-3.5 text-red-400" /> : <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-500">共 {filteredUsers.length} 个用户</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>上一页</button>
            <span className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg">1</span>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">下一页</button>
          </div>
        </div>
      </div>

      {/* 角色权限说明 */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { role: '超级管理员', desc: '全部权限：系统配置、用户管理、支付设置、全部数据访问', color: 'border-red-200 bg-red-50' },
          { role: '管理员', desc: '站点管理、GEO优化、内容管理、数据查看、团队管理', color: 'border-orange-200 bg-orange-50' },
          { role: '编辑', desc: '内容编辑、站点体检、结构化标签生成、排名查询', color: 'border-blue-200 bg-blue-50' },
          { role: '只读', desc: '查看报告、查看排名、查看数据、无编辑权限', color: 'border-gray-200 bg-gray-50' },
        ].map(item => (
          <div key={item.role} className={`border rounded-xl p-4 ${item.color}`}>
            <div className="font-medium text-sm mb-1">{item.role}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
