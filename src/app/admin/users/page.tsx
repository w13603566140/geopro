'use client';

import { useState } from 'react';
import { Search, Plus, Shield, Ban, CheckCircle, XCircle, Mail, Filter, Download, Users as UsersIcon, TrendingUp, Activity, DollarSign, Eye, Edit3, Trash2 } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'list' | 'roles' | 'logs'>('list');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedUsers(prev => prev.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id));
  };

  const filteredUsers = users.filter(u => {
    if (search && !u.name.includes(search) && !u.email.includes(search) && !u.company.includes(search)) return false;
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterPlan !== 'all' && u.plan !== filterPlan) return false;
    return true;
  });

  // 统计数据
  const stats = [
    { label: '总用户数', value: users.length, icon: UsersIcon, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: '活跃用户', value: users.filter(u => u.status === 'active').length, icon: Activity, color: 'from-green-500 to-emerald-500', change: '+5%' },
    { label: '今日新增', value: 1, icon: TrendingUp, color: 'from-violet-500 to-purple-500', change: '+1' },
    { label: '月营收', value: '¥86,420', icon: DollarSign, color: 'from-amber-500 to-orange-500', change: '+18%' },
  ];

  // 操作日志
  const logs = [
    { id: '1', user: '张晓明', action: '登录系统', time: '2026-06-21 09:15:32', ip: '192.168.1.100' },
    { id: '2', user: '李开发', action: '修改密码', time: '2026-06-21 08:45:21', ip: '192.168.1.101' },
    { id: '3', user: '王创业', action: '升级套餐', time: '2026-06-20 16:30:15', ip: '192.168.1.102' },
    { id: '4', user: '赵运维', action: '导出报表', time: '2026-06-20 14:22:08', ip: '192.168.1.103' },
    { id: '5', user: '陈设计', action: '新增站点', time: '2026-06-20 11:10:45', ip: '192.168.1.104' },
  ];

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-400 font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tab切换 */}
      <div className="flex items-center gap-1 bg-slate-800 rounded-xl border border-slate-700 p-1.5 w-fit">
        {[
          { key: 'list' as const, label: '用户列表', icon: UsersIcon },
          { key: 'roles' as const, label: '角色权限', icon: Shield },
          { key: 'logs' as const, label: '操作日志', icon: Activity },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key ? 'bg-amber-600/20 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 用户列表 */}
      {activeTab === 'list' && (
        <>
          {/* 搜索和筛选 */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500" placeholder="搜索用户名称/邮箱/公司..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                <option value="all">全部角色</option>
                <option value="ADMIN">管理员</option>
                <option value="MANAGER">经理</option>
                <option value="EDITOR">编辑</option>
                <option value="VIEWER">只读</option>
              </select>
              <select className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500" value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
                <option value="all">全部套餐</option>
                <option value="ENTERPRISE">企业版</option>
                <option value="PROFESSIONAL">专业版</option>
                <option value="FREE">免费版</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-4 h-4" />添加用户
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
                <Download className="w-4 h-4" />导出
              </button>
            </div>

            {/* 批量操作栏 */}
            {selectedUsers.length > 0 && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-amber-600/10 border border-amber-500/20 rounded-lg">
                <span className="text-sm text-amber-400 font-medium">已选择 {selectedUsers.length} 项</span>
                <button className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs font-medium hover:bg-red-500/30 transition-colors">
                  批量禁用
                </button>
                <button className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs font-medium hover:bg-red-500/30 transition-colors">
                  批量删除
                </button>
                <button className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded text-xs font-medium hover:bg-slate-600 transition-colors ml-auto">
                  取消选择
                </button>
              </div>
            )}
          </div>

          {/* 用户表格 */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50">
                    <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500"
                      />
                    </th>
                    {['用户信息', '套餐', '角色', '积分', '状态', '注册时间', '操作'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                          className="rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">{user.name[0]}</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm text-slate-200">{user.name}</div>
                            <div className="text-xs text-slate-400">{user.email}</div>
                            {user.company !== '-' && <div className="text-xs text-slate-500">{user.company}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getPlanBadge(user.plan)}</td>
                      <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-slate-300">{user.credits.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {user.status === 'active' ? '正常' : '已禁用'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{user.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button title="查看" className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button title="编辑" className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                            <Edit3 className="w-4 h-4 text-slate-400" />
                          </button>
                          <button title="邮件" className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                            <Mail className="w-4 h-4 text-slate-400" />
                          </button>
                          <button title={user.status === 'active' ? '禁用' : '启用'}
                            className={`p-1.5 rounded-lg transition-colors ${user.status === 'active' ? 'hover:bg-red-500/20' : 'hover:bg-green-500/20'}`}>
                            {user.status === 'active' ? <Ban className="w-4 h-4 text-red-400" /> : <CheckCircle className="w-4 h-4 text-green-400" />}
                          </button>
                          <button title="删除" className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700 bg-slate-900/50">
              <span className="text-sm text-slate-400">共 {filteredUsers.length} 个用户</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm border border-slate-600 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-50" disabled>上一页</button>
                <span className="px-3 py-1 text-sm bg-amber-600 text-white rounded-lg">1</span>
                <button className="px-3 py-1 text-sm border border-slate-600 rounded-lg hover:bg-slate-700 text-slate-300">下一页</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 角色权限 */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          {[
            { role: '超级管理员', icon: Shield, desc: '全部权限：系统配置、用户管理、支付设置、全部数据访问', color: 'from-red-500 to-rose-500', permissions: ['系统配置', '用户管理', '支付设置', '套餐管理', '全部数据访问'] },
            { role: '管理员', icon: Shield, desc: '站点管理、GEO优化、内容管理、数据查看、团队管理', color: 'from-orange-500 to-amber-500', permissions: ['站点管理', 'GEO优化', '内容管理', '数据查看', '团队管理'] },
            { role: '编辑', icon: Shield, desc: '内容编辑、站点体检、结构化标签生成、排名查询', color: 'from-blue-500 to-cyan-500', permissions: ['内容编辑', '站点体检', '标签生成', '排名查询'] },
            { role: '只读', icon: Shield, desc: '查看报告、查看排名、查看数据、无编辑权限', color: 'from-gray-500 to-slate-500', permissions: ['查看报告', '查看排名', '查看数据'] },
          ].map(item => (
            <div key={item.role} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-200">{item.role}</h3>
                    <button className="px-3 py-1 text-xs bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
                      编辑权限
                    </button>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.permissions.map(p => (
                      <span key={p} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs font-medium">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 操作日志 */}
      {activeTab === 'logs' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  {['用户', '操作', '时间', 'IP地址'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-200 font-medium">{log.user}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{log.action}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{log.time}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
