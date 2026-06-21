import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* 导航栏 */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-lg text-gray-900">GEO优化助手Pro</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">功能</Link>
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">套餐</Link>
            <Link href="#faq" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm !px-4 !py-2">登录</Link>
            <Link href="/register" className="btn-primary text-sm !px-4 !py-2">免费注册</Link>
          </div>
        </div>
      </header>

      {/* 主视觉区域 */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          AI搜索引擎优化新时代
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          让你的产品被 AI
          <span className="text-primary-600"> 优先推荐</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed">
          一站式GEO优化平台，让你的网站在 Kimi、豆包、GPT Search、Gemini 等
          生成式AI回答中排名首位，获取海量AI流量
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register" className="btn-primary text-lg !px-8 !py-3 shadow-lg shadow-primary-200">
            免费开始优化 →
          </Link>
          <Link href="#demo" className="btn-secondary text-lg !px-8 !py-3">
            查看演示
          </Link>
        </div>

        {/* 数据展示 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          {[
            { value: '100+', label: 'AI搜索引擎覆盖' },
            { value: '85%', label: '首位占位率提升' },
            { value: '10万+', label: '优化站点数' },
            { value: '500+', label: '企业客户' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 核心功能 */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">全方位AI搜索引擎优化</h2>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            覆盖从站点诊断、结构化标签、内容生产到AI排名监测的完整GEO优化闭环
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍', title: '智能体检诊断',
                desc: '12大AI收录扣分项扫描，一键输出0-100分优化报告与修复代码',
              },
              {
                icon: '🏷️', title: '结构化标签引擎',
                desc: '8种核心JSON-LD模板批量生成，让AI直接提取你的产品价格与功能',
              },
              {
                icon: '📝', title: 'AI内容生产',
                desc: '挖掘高转化商业问句，生成AI优先推荐的高权重结构化内容',
              },
              {
                icon: '📊', title: '排名监测系统',
                desc: '覆盖10大AI引擎，实时追踪品牌排名、曝光率与竞品动态',
              },
              {
                icon: '🕵️', title: '竞品情报分析',
                desc: '扫描竞品GEO策略，发现流量缺口，生成赶超优化方案',
              },
              {
                icon: '🤖', title: 'Agent/MCP生态',
                desc: '自动生成AI智能体协议文件，打通大模型插件生态流量',
              },
            ].map(feature => (
              <div key={feature.title} className="card-hover p-6">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 套餐 */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">选择适合你的套餐</h2>
          <p className="text-gray-500 text-center mb-16">免费开始，按需升级</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: '免费引流版', price: '0', period: '永久免费',
                features: ['单站点管理', '基础GEO体检', '手动生成llms.txt', '每日3次AI排名查询'],
                primary: false,
              },
              {
                name: '专业订阅版', price: '299', period: '元/月',
                features: ['20站点管理', '全类型标签批量生成', '全平台AI排名监测', '竞品分析', '每日50篇内容', 'PDF报表导出'],
                primary: true,
              },
              {
                name: '企业年费版', price: '2999', period: '元/年',
                features: ['不限站点', '多子账号协作', '白标报表', '开放API', '私有化部署', '代理分销'],
                primary: false,
              },
            ].map(plan => (
              <div key={plan.name} className={`card p-8 relative ${plan.primary ? 'ring-2 ring-primary-500 shadow-lg scale-105' : ''}`}>
                {plan.primary && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                    最受欢迎
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">¥{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                    plan.primary
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.price === '0' ? '免费注册' : '立即订阅'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-bold text-white">GEO优化助手Pro</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
              <Link href="/terms" className="hover:text-white transition-colors">服务条款</Link>
              <span>© 2026 GEO优化助手Pro</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
