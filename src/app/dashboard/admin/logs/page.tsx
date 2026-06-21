'use client';

import { useState } from 'react';
import { ScrollText, Search, Download, Filter, Eye, Shield, AlertTriangle, Info, Trash2, User, Globe } from 'lucide-react';

export default function LogsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const logs = [
    { id: '1', action: '系统配置更新', user: '管理员', resource: '邮件服务配置', detail: '更新了SMTP服务器地址', level: 'info', ip: '192.168.1.100', time: '2026-06-21 14:32:15' },
    { id: '2', action: '用户禁用', user: '管理员', resource: '用户 - 刘测试', detail: '因违规操作禁用账号', level: 'warning', ip: '192.168.1.100', time: '2026-06-21 11:20:08' },
    { id: '3', action: '支付配置修改', user: '管理员', resource: '支付宝支付', detail: '更新了支付宝App ID和应用私钥', level: 'warning', ip: '192.168.1.100', time: '2026-06-21 10:05:33' },
    { id: '4', action: '套餐升级', user: '张晓明', resource: '订阅套餐', detail: '从专业版升级至企业版', level: 'info', ip: '203.0.113.50', time: '2026-06-20 16:45:22' },
    { id: '5', action: '站点添加', user: '李开发', resource: '新站点 - docs.li.com', detail: '添加文档站点进行GEO优化', level: 'info', ip: '198.51.100.22', time: '2026-06-20 14:10:09' },
    { id: '6', action: 'API密钥重置', user: '王创业', resource: 'API Keys', detail: '重置了个人API访问密钥', level: 'info', ip: '203.0.113.88', time: '2026-06-20 09:30:45' },
    { id: '7', action: 'GEO体检执行', user: '系统自动', resource: '站点 - example.com', detail: '定时自动体检任务完成，评分: 72', level: 'info', ip: '系统内部', time: '2026-06-20 03:00:01' },
    { id: '8', action: '登录失败', user: '未知', resource: '登录尝试', detail: '连续5次密码错误，IP已临时封禁', level: 'warning', ip: '45.33.32.156', time: '2026-06-19 22:15:30' },
    { id: '9', action: '数据导出', user: '赵运维', resource: '监测数据', detail: '导出了90天排名趋势报表CSV', level: 'info', ip: '192.0.2.45', time: '2026-06-19 18:00:12' },
    { id: '10', action: '权限变更', user: '管理员', resource: '用户 - 王创业', detail: '权限从编辑升级为经理', level: 'warning', ip: '192.168.1.100', time: '2026-06-19 15:22:08' },
    { id: '11', action: '数据库备份', user: '系统自动', resource: '数据库', detail: '每日自动备份成功，大小: 256MB', level: 'info', ip: '系统内部', time: '2026-06-19 03:00:00' },
    { id: '12', action: '支付退款', user: '管理员', resource: '订单 #ORD-20260618001', detail: '用户申请退款，已处理 ¥299', level: 'warning', ip: '192.168.1.100', time: '2026-06-18 10:45:30' },
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const map: Record<string, string> = { error: 'bg-red-50 text-red-700', warning: 'bg-amber-50 text-amber-700', info: 'bg-blue-50 text-blue-700' };
    const names: Record<string, string> = { error: '错误', warning: '警告', info: '信息' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[level]}`}>{names[level]}</span>;
  };

  return (
    <div className="space-y-6">
      {/* 筛选栏 */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" className="input-field !pl-10" placeholder="搜索操作日志..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field !w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">全部级别</option>
            <option value="error">错误</option>
            <option value="warning">警告</option>
            <option value="info">信息</option>
          </select>
          <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />导出日志</button>
        </div>
      </div>

      {/* 日志统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '今日操作', value: 156, color: 'text-blue-600 bg-blue-50' },
          { label: '警告事件', value: 8, color: 'text-amber-600 bg-amber-50' },
          { label: '错误事件', value: 1, color: 'text-red-600 bg-red-50' },
          { label: '保留天数', value: 90, color: 'text-gray-600 bg-gray-100' },
        ].map(stat => (
          <div key={stat.label} className="card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 日志列表 */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['级别', '操作', '用户', '资源', '详情', 'IP地址', '时间'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getLevelIcon(log.level)}
                      {getLevelBadge(log.level)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{log.action}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{log.resource}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 max-w-[200px] truncate block">{log.detail}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <code className="text-xs text-gray-500">{log.ip}</code>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-400">{log.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-500">共 {logs.length} 条记录 · 今日156条</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100" disabled>上一页</button>
            <span className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg">1</span>
            <span className="px-3 py-1 text-sm text-gray-500">2</span>
            <span className="px-3 py-1 text-sm text-gray-500">3</span>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">下一页</button>
          </div>
        </div>
      </div>

      {/* 清除日志 */}
      <div className="card p-4 border-red-200 bg-red-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <div className="font-medium text-sm text-red-700">日志清理</div>
              <div className="text-xs text-red-500">清除超过指定天数的操作日志（不可恢复）</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select className="input-field !w-auto text-sm" defaultValue="90">
              <option value="30">30天前</option>
              <option value="60">60天前</option>
              <option value="90">90天前</option>
              <option value="180">180天前</option>
            </select>
            <button className="btn-danger text-sm flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" />清除日志
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
