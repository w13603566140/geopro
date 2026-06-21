import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 导航栏 - 玻璃拟态 */}
      <header className="nav-glass sticky top-0 z-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-base">G</span>
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">GEO优化助手Pro</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">功能</Link>
            <Link href="#cases" className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">案例</Link>
            <Link href="#pricing" className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">套餐</Link>
            <Link href="#faq" className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm !px-4 !py-2">登录</Link>
            <Link href="/register" className="btn-primary text-sm !px-4 !py-2">免费注册</Link>
          </div>
        </div>
      </header>

      {/* 主视觉区域 - 深色渐变 + 网格背景 */}
      <section className="relative overflow-hidden bg-hero-gradient">
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        {/* 光晕装饰 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-white/20 animate-fade-in-up">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            AI搜索引擎优化新时代 · 让AI主动推荐你
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            让你的产品被 AI
            <span className="block mt-2 bg-gradient-to-r from-primary-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              优先推荐
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            一站式GEO优化平台，让你的网站在 Kimi、豆包、GPT Search、Gemini 等
            生成式AI回答中排名首位，获取海量AI流量
          </p>
          <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/register" className="group inline-flex items-center gap-2 bg-white text-slate-900 text-lg px-8 py-3.5 rounded-xl font-semibold shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all duration-300">
              免费开始优化
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link href="#demo" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-lg px-8 py-3.5 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
              查看演示
            </Link>
          </div>

          {/* 数据展示 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '100+', label: 'AI搜索引擎覆盖' },
              { value: '85%', label: '首位占位率提升' },
              { value: '10万+', label: '优化站点数' },
              { value: '500+', label: '企业客户' },
            ].map(stat => (
              <div key={stat.label} className="text-center group">
                <div className="text-4xl font-bold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部渐变过渡 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* 核心功能 */}
      <section id="features" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              核心功能
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">全方位AI搜索引擎优化</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              覆盖从站点诊断、结构化标签、内容生产到AI排名监测的完整GEO优化闭环
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: '智能体检诊断', desc: '12大AI收录扣分项扫描，一键输出0-100分优化报告与修复代码', gradient: 'from-blue-500 to-cyan-500' },
              { icon: '🏷️', title: '结构化标签引擎', desc: '8种核心JSON-LD模板批量生成，让AI直接提取你的产品价格与功能', gradient: 'from-violet-500 to-purple-500' },
              { icon: '📝', title: 'AI内容生产', desc: '挖掘高转化商业问句，生成AI优先推荐的高权重结构化内容', gradient: 'from-emerald-500 to-teal-500' },
              { icon: '📊', title: '排名监测系统', desc: '覆盖10大AI引擎，实时追踪品牌排名、曝光率与竞品动态', gradient: 'from-amber-500 to-orange-500' },
              { icon: '🕵️', title: '竞品情报分析', desc: '扫描竞品GEO策略，发现流量缺口，生成赶超优化方案', gradient: 'from-pink-500 to-rose-500' },
              { icon: '🤖', title: 'Agent/MCP生态', desc: '自动生成AI智能体协议文件，打通大模型插件生态流量', gradient: 'from-indigo-500 to-blue-500' },
            ].map(feature => (
              <div key={feature.title} className="card-glow p-7 group cursor-default">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 案例展示 - 深色渐变背景 */}
      <section id="cases" className="py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        {/* 装饰光晕 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/20">
              客户案例
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">真实客户案例</h2>
            <p className="text-slate-400 text-lg">500+企业信赖的AI搜索引擎优化方案</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: '小米科技', industry: '智能家居',
                before: { score: 32, visible: '2/8', rank: '-' },
                after: { score: 87, visible: '8/8', rank: '5个首位' },
                quote: '使用GEO优化助手后，小米智能家居在8大AI模型中的可见率从25%提升至100%',
              },
              {
                name: '华为云', industry: '云计算',
                before: { score: 45, visible: '3/8', rank: '1个首位' },
                after: { score: 92, visible: '8/8', rank: '6个首位' },
                quote: 'AI诊断报告精准定位了我们的内容缺口，优化方案一键执行效率极高',
              },
              {
                name: '字节跳动', industry: 'AI工具',
                before: { score: 28, visible: '1/8', rank: '-' },
                after: { score: 78, visible: '7/8', rank: '3个首位' },
                quote: '从几乎不可见到7个AI平台推荐，豆包/Kimi/DeepSeek均排名前三',
              },
            ].map((cs, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">{cs.name[0]}</div>
                  <div>
                    <div className="font-semibold text-white text-lg">{cs.name}</div>
                    <div className="text-xs text-slate-400">{cs.industry}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <div className="text-xs text-slate-400 mb-1">优化前</div>
                    <div className="text-2xl font-bold text-red-400">{cs.before.score}<span className="text-sm">分</span></div>
                    <div className="text-xs text-slate-500 mt-0.5">{cs.before.visible} 可见 · {cs.before.rank}</div>
                  </div>
                  <div className="bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-500/20">
                    <div className="text-xs text-emerald-300 mb-1">优化后</div>
                    <div className="text-2xl font-bold text-emerald-400">{cs.after.score}<span className="text-sm">分</span></div>
                    <div className="text-xs text-emerald-300/60 mt-0.5">{cs.after.visible} 可见 · {cs.after.rank}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{cs.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 套餐 */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              价格方案
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">选择适合你的套餐</h2>
            <p className="text-slate-500 text-lg">免费开始，按需升级</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
              <div key={plan.name} className={`relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                plan.primary
                  ? 'bg-gradient-to-br from-primary-600 to-violet-600 text-white shadow-2xl shadow-primary-500/30 scale-105'
                  : 'bg-white border border-slate-200 shadow-sm hover:shadow-xl'
              }`}>
                {plan.primary && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary-600 px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    🔥 最受欢迎
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.primary ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                <div className="mb-6">
                  <span className={`text-5xl font-extrabold ${plan.primary ? 'text-white' : 'text-slate-900'}`}>¥{plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.primary ? 'text-white/70' : 'text-slate-500'}`}>/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.primary ? 'text-white/90' : 'text-slate-600'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${plan.primary ? 'bg-white/20' : 'bg-emerald-100 text-emerald-600'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                    plan.primary
                      ? 'bg-white text-primary-600 hover:bg-slate-100 shadow-lg'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
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
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">G</span>
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
