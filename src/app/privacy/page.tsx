'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-bold text-gray-900">GEO优化助手Pro</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← 返回首页</Link>
        </div>
      </header>

      {/* 内容 */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
          <p className="text-sm text-gray-500 mb-8">最后更新日期：2026年6月21日 · 版本：V2.0</p>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed">
            {/* 引言 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">引言</h2>
              <p className="text-gray-600 mb-2">
                GEO优化助手Pro（以下简称"我们"）深知个人信息对您的重要性。我们致力于保护您的个人信息安全，并严格遵守《中华人民共和国个人信息保护法》《中华人民共和国网络安全法》《中华人民共和国数据安全法》及相关法律法规。
              </p>
              <p className="text-gray-600">
                本隐私政策旨在向您说明我们如何收集、使用、存储、共享和保护您的个人信息，以及您享有的相关权利。请您在使用我们的服务前仔细阅读本隐私政策。
              </p>
            </section>

            {/* 第1条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">一、我们收集的信息</h2>
              <p className="text-gray-600 mb-2">根据您使用的服务不同，我们可能收集以下类型的信息：</p>

              <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">1.1 您主动提供的信息</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                <li><strong>账号信息：</strong>姓名、电子邮箱、手机号码、公司名称、密码（加密存储）；</li>
                <li><strong>业务信息：</strong>网站URL、品牌名称、行业关键词、竞品信息；</li>
                <li><strong>支付信息：</strong>支付方式、账单地址（完整银行卡号由第三方支付平台处理，我们不直接存储）；</li>
                <li><strong>沟通信息：</strong>您通过客服渠道与我们沟通时提供的信息。</li>
              </ul>

              <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">1.2 自动收集的信息</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                <li><strong>日志信息：</strong>IP地址、浏览器类型、操作系统、访问时间、访问页面、来源URL；</li>
                <li><strong>设备信息：</strong>设备型号、设备标识符、网络类型；</li>
                <li><strong>使用数据：</strong>功能使用频率、操作行为、页面停留时间、点击流数据；</li>
                <li><strong>Cookie及类似技术：</strong>用于会话管理、偏好记忆和数据分析。</li>
              </ul>

              <h3 className="text-base font-medium text-gray-800 mt-4 mb-2">1.3 第三方AI平台数据</h3>
              <p className="text-gray-600">
                当您使用AI可见度诊断服务时，我们会将您的品牌名称和行业关键词发送至第三方AI大模型平台（如DeepSeek、豆包、通义千问、Kimi等）进行查询。这些查询仅包含您主动提供的关键词信息，不包含任何个人身份信息。
              </p>
            </section>

            {/* 第2条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">二、我们如何使用信息</h2>
              <p className="text-gray-600 mb-2">我们收集的信息将用于以下目的：</p>
              <ul className="list-decimal pl-5 space-y-1 text-gray-600">
                <li><strong>提供和维护服务：</strong>处理您的GEO诊断请求、生成优化报告、监测排名变化；</li>
                <li><strong>身份验证与安全：</strong>验证用户身份、检测和防止欺诈或滥用行为；</li>
                <li><strong>客户支持：</strong>响应您的咨询、投诉和技术支持请求；</li>
                <li><strong>产品改进：</strong>分析使用趋势、优化AI模型效果、改进用户体验；</li>
                <li><strong>个性化推荐：</strong>根据您的行业和使用习惯推荐合适的优化方案和模板；</li>
                <li><strong>计费与结算：</strong>处理套餐订阅、积分消耗、模板购买等付费交易；</li>
                <li><strong>法律合规：</strong>满足法律法规要求、应对法律程序或政府请求。</li>
              </ul>
            </section>

            {/* 第3条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">三、信息的存储与保护</h2>
              <p className="text-gray-600 mb-2">
                <strong>存储地点：</strong>您的个人信息存储于中华人民共和国境内的服务器上。我们不会将您的个人信息转移至境外，除非获得您的明确同意或法律法规要求。
              </p>
              <p className="text-gray-600 mb-2">
                <strong>存储期限：</strong>我们仅在实现本隐私政策所述目的所必需的时间内保留您的个人信息。账号注销后，我们将在30天内删除或匿名化处理您的个人信息，法律法规另有规定的除外。
              </p>
              <p className="text-gray-600 mb-2">
                <strong>安全措施：</strong>我们采取以下措施保护您的个人信息安全：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>数据传输采用TLS/SSL加密；</li>
                <li>敏感数据（如密码）采用bcrypt等单向散列算法加密存储；</li>
                <li>实施访问控制策略，仅授权人员可接触个人信息；</li>
                <li>定期进行安全审计和漏洞扫描；</li>
                <li>建立数据安全事件应急响应机制。</li>
              </ul>
            </section>

            {/* 第4条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">四、信息的共享与披露</h2>
              <p className="text-gray-600 mb-2">
                我们不会向第三方出售您的个人信息。在以下情况下，我们可能共享您的信息：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                <li><strong>服务提供商：</strong>与为我们提供技术基础设施、支付处理、邮件发送、数据分析等服务的第三方合作方共享必要信息；</li>
                <li><strong>AI大模型平台：</strong>在执行AI可见度诊断时，将品牌名称和行业关键词发送至第三方AI平台；</li>
                <li><strong>法律要求：</strong>根据法律法规、法院命令或政府要求披露信息；</li>
                <li><strong>业务转移：</strong>在合并、收购或资产出售等情况下，您的信息可能作为资产转移；</li>
                <li><strong>经您同意：</strong>在获得您明确同意后的其他共享情况。</li>
              </ul>
              <p className="text-gray-600">
                我们要求所有第三方服务提供商遵守不低于本隐私政策标准的数据保护要求，并对他们处理个人信息的行为进行监督。
              </p>
            </section>

            {/* 第5条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">五、您的权利</h2>
              <p className="text-gray-600 mb-2">
                根据《中华人民共和国个人信息保护法》，您享有以下权利：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                <li><strong>查阅权：</strong>您有权查阅我们持有的您的个人信息；</li>
                <li><strong>更正权：</strong>您有权要求更正不准确或不完整的个人信息；</li>
                <li><strong>删除权：</strong>在特定情况下，您有权要求删除您的个人信息；</li>
                <li><strong>限制处理权：</strong>您有权要求限制对您个人信息的处理；</li>
                <li><strong>数据可携权：</strong>您有权获取您提供的个人信息的副本；</li>
                <li><strong>撤回同意权：</strong>您有权随时撤回此前对个人信息处理的同意；</li>
                <li><strong>注销账号权：</strong>您有权注销您的账号，注销后相关信息将被删除或匿名化。</li>
              </ul>
              <p className="text-gray-600">
                您可以通过"系统设置"页面自行管理个人信息，或通过本隐私政策底部列出的联系方式向我们提出相关请求。我们将在收到请求后15个工作日内处理。
              </p>
            </section>

            {/* 第6条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">六、Cookie及类似技术</h2>
              <p className="text-gray-600 mb-2">
                我们使用Cookie和类似技术（如LocalStorage、SessionStorage）来提升您的使用体验。具体包括：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                <li><strong>必要Cookie：</strong>用于维持登录状态和会话管理，是服务正常运行所必需的；</li>
                <li><strong>偏好Cookie：</strong>记住您的语言偏好和界面设置；</li>
                <li><strong>分析Cookie：</strong>帮助我们了解服务的使用情况，以便改进产品。</li>
              </ul>
              <p className="text-gray-600">
                您可以通过浏览器设置管理或禁用Cookie，但请注意，禁用必要Cookie可能导致部分功能无法正常使用。
              </p>
            </section>

            {/* 第7条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">七、未成年人保护</h2>
              <p className="text-gray-600 mb-2">
                本服务面向企业用户和专业人士，不面向未满18周岁的未成年人。我们不会故意收集未成年人的个人信息。
              </p>
              <p className="text-gray-600">
                如果我们发现无意中收集了未成年人的个人信息，我们将立即删除相关数据。如果您是监护人且发现未成年人向我们提供了个人信息，请立即联系我们。
              </p>
            </section>

            {/* 第8条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">八、AI生成内容说明</h2>
              <p className="text-gray-600 mb-2">
                本服务的核心功能依赖于第三方AI大模型技术。请注意：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                <li>AI生成的内容可能存在不准确、不完整或偏见的情况，请自行判断内容质量；</li>
                <li>为确保诊断准确性，我们会在您授权下将品牌名称和关键词发送至AI平台；</li>
                <li>我们不对AI平台如何使用您提供的查询关键词承担责任，建议您同时参阅相关AI平台的隐私政策；</li>
                <li>AI生成内容可能受到AI平台自身训练数据和算法的影响而产生变化。</li>
              </ul>
            </section>

            {/* 第9条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">九、隐私政策的更新</h2>
              <p className="text-gray-600 mb-2">
                我们可能会不时更新本隐私政策。更新后的版本将在本页面发布，并在页首注明更新日期。
              </p>
              <p className="text-gray-600 mb-2">
                对于重大变更，我们将通过以下方式之一通知您：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>在服务内显著位置发布通知；</li>
                <li>向您注册的电子邮箱发送通知；</li>
                <li>在登录时弹出变更确认提示。</li>
              </ul>
            </section>

            {/* 第10条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">十、联系我们</h2>
              <p className="text-gray-600 mb-2">
                如您对本隐私政策有任何疑问、意见或请求，请通过以下方式联系我们：
              </p>
              <ul className="list-none space-y-1 text-gray-600 mb-2">
                <li>📧 隐私保护邮箱：privacy@geo-optimizer.com</li>
                <li>📞 客服电话：400-XXX-XXXX（工作日 9:00-18:00）</li>
                <li>📍 公司地址：[公司注册地址]</li>
                <li>👤 个人信息保护负责人：[姓名]</li>
              </ul>
              <p className="text-gray-600">
                我们将在收到您的请求后15个工作日内予以回复。如您对我们的处理结果不满意，您有权向相关监管机构投诉。
              </p>
            </section>

            {/* 附录 */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-base font-semibold text-gray-900 mb-3">附录：第三方SDK及数据共享清单</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-700">第三方名称</th>
                      <th className="text-left py-2 font-medium text-gray-700">用途</th>
                      <th className="text-left py-2 font-medium text-gray-700">共享信息类型</th>
                      <th className="text-left py-2 font-medium text-gray-700">隐私政策链接</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="py-2">支付宝</td>
                      <td className="py-2">支付处理</td>
                      <td className="py-2">订单金额、商品描述</td>
                      <td className="py-2">render.alipay.com/p/privacy</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">微信支付</td>
                      <td className="py-2">支付处理</td>
                      <td className="py-2">订单金额、商品描述</td>
                      <td className="py-2">weixin.qq.com/privacy</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">DeepSeek</td>
                      <td className="py-2">AI诊断查询</td>
                      <td className="py-2">品牌名称、行业关键词</td>
                      <td className="py-2">deepseek.com/privacy</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">通义千问</td>
                      <td className="py-2">AI诊断查询</td>
                      <td className="py-2">品牌名称、行业关键词</td>
                      <td className="py-2">tongyi.aliyun.com/privacy</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">豆包</td>
                      <td className="py-2">AI诊断查询</td>
                      <td className="py-2">品牌名称、行业关键词</td>
                      <td className="py-2">doubao.com/privacy</td>
                    </tr>
                    <tr>
                      <td className="py-2">Kimi</td>
                      <td className="py-2">AI诊断查询</td>
                      <td className="py-2">品牌名称、行业关键词</td>
                      <td className="py-2">kimi.moonshot.cn/privacy</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-400">
          <Link href="/terms" className="hover:text-gray-600 underline">服务条款</Link>
          <span className="mx-3">·</span>
          <Link href="/" className="hover:text-gray-600 underline">返回首页</Link>
        </div>
      </main>
    </div>
  );
}
