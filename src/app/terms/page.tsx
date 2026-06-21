'use client';

import Link from 'next/link';

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">服务条款</h1>
          <p className="text-sm text-gray-500 mb-8">最后更新日期：2026年6月21日</p>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed">
            {/* 第1条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">一、接受条款</h2>
              <p className="text-gray-600 mb-2">
                欢迎使用 GEO优化助手Pro（以下简称"本平台"）。本平台由【公司名称】运营并提供服务。通过访问或使用本平台的网站、应用程序及相关服务（以下统称"服务"），即表示您同意接受本服务条款（以下简称"条款"）的约束。
              </p>
              <p className="text-gray-600 mb-2">
                如果您代表某个组织使用本服务，则您声明并保证您有权代表该组织同意本条款。如果您不同意本条款的任何部分，请勿使用本服务。
              </p>
              <p className="text-gray-600">
                本平台保留随时修改本条款的权利。修改后的条款将在发布后立即生效。您继续使用本服务即表示您接受修改后的条款。建议您定期查阅本条款。
              </p>
            </section>

            {/* 第2条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">二、服务说明</h2>
              <p className="text-gray-600 mb-2">
                本平台提供生成式AI搜索引擎优化（GEO）相关服务，包括但不限于：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                <li>AI可见度诊断：检测品牌在主流AI大模型中的可见度与排名；</li>
                <li>结构化数据标签生成：为网站生成符合搜索引擎标准的JSON-LD结构化数据；</li>
                <li>AI内容生产：基于AI技术生成符合搜索引擎偏好的优质内容；</li>
                <li>排名监测：持续追踪品牌在各大AI引擎中的排名变化；</li>
                <li>竞品分析：分析竞争对手的GEO策略并提供优化建议；</li>
                <li>多平台内容发布：将优化内容一键分发至多个内容平台。</li>
              </ul>
              <p className="text-gray-600">
                本平台保留随时修改、暂停或终止任何服务（或其任何部分）的权利，恕不另行通知。对于服务的任何修改、暂停或终止，本平台不对您或任何第三方承担责任。
              </p>
            </section>

            {/* 第3条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">三、账号注册与安全</h2>
              <p className="text-gray-600 mb-2">
                为使用本服务的全部功能，您需要注册一个账号。注册时，您必须提供准确、完整和最新的信息，并在信息变更时及时更新。
              </p>
              <p className="text-gray-600 mb-2">
                您对维护账号和密码的机密性承担全部责任。您账号下发生的所有活动均由您负责。如发现任何未经授权使用您账号的情况，请立即通知本平台。
              </p>
              <p className="text-gray-600">
                本平台保留基于合理判断拒绝注册、暂停或终止任何账号的权利，包括但不限于以下情况：提供虚假信息、滥用服务、侵犯他人权益或违反法律法规。
              </p>
            </section>

            {/* 第4条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">四、用户行为规范</h2>
              <p className="text-gray-600 mb-2">在使用本服务时，您同意：</p>
              <ul className="list-decimal pl-5 space-y-1 text-gray-600 mb-2">
                <li>遵守所有适用的法律法规，包括但不限于《中华人民共和国网络安全法》《中华人民共和国数据安全法》《中华人民共和国个人信息保护法》；</li>
                <li>不上传、发布、传播任何违法、侵权、虚假、诽谤、骚扰、威胁、淫秽或其他不当内容；</li>
                <li>不干扰或破坏本服务或与本服务相连的服务器和网络；</li>
                <li>不通过本服务发送垃圾信息、病毒、恶意代码或其他有害程序；</li>
                <li>不对本服务进行逆向工程、反编译或反汇编；</li>
                <li>不使用任何自动化手段（包括但不限于机器人、爬虫、脚本）大规模访问或抓取本服务数据；</li>
                <li>不得利用本服务提供的信息进行虚假宣传、误导消费者或从事不正当竞争行为。</li>
              </ul>
            </section>

            {/* 第5条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">五、知识产权</h2>
              <p className="text-gray-600 mb-2">
                本平台及其原始内容（包括但不限于软件、代码、文本、图片、标识、商标、界面设计、数据等）的知识产权归本平台所有，受《中华人民共和国著作权法》《中华人民共和国商标法》等法律法规保护。
              </p>
              <p className="text-gray-600 mb-2">
                用户通过本服务生成的内容（包括但不限于诊断报告、结构化标签、AI生成文章、优化方案等），其知识产权归属如下：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                <li><strong>用户原始输入数据：</strong>归用户所有；</li>
                <li><strong>AI生成内容：</strong>用户拥有使用权，可在其自身业务范围内使用、修改和发布；</li>
                <li><strong>本平台的算法、模型和模板：</strong>归本平台所有。</li>
              </ul>
              <p className="text-gray-600">
                未经本平台书面许可，不得以任何方式复制、修改、传播、出售或利用本平台的任何内容。
              </p>
            </section>

            {/* 第6条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">六、付费服务与退款</h2>
              <p className="text-gray-600 mb-2">
                本平台提供免费版、专业版和企业版等多层级的付费服务套餐。不同套餐的具体功能、限制和价格以购买时页面显示为准。
              </p>
              <p className="text-gray-600 mb-2">
                付款将通过本平台指定的第三方支付服务商（包括但不限于支付宝、微信支付）进行处理。您同意遵守相关支付服务商的服务条款。
              </p>
              <p className="text-gray-600 mb-2">
                退款政策：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>月度订阅：购买后7天内可申请全额退款，超过7天不予退款；</li>
                <li>年度订阅：购买后14天内可申请按比例退款，超过14天不予退款；</li>
                <li>一次性购买服务（如模板包、诊断报告等）：交付后不支持退款；</li>
                <li>如因本平台原因导致服务无法正常使用，将按受影响天数进行服务延期或按比例退款。</li>
              </ul>
            </section>

            {/* 第7条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">七、免责声明</h2>
              <p className="text-gray-600 mb-2">
                本服务按"现状"提供，不作任何明示或默示的保证。本平台不保证：
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-2">
                <li>服务将完全满足您的需求或不中断；</li>
                <li>AI分析结果100%准确，因AI大模型的训练数据和算法存在局限性；</li>
                <li>优化后必然提升在AI搜索引擎中的排名和可见度，因为排名结果受多种因素影响；</li>
                <li>第三方AI平台（如DeepSeek、豆包、通义千问等）将持续采用相同方式检索和推荐内容。</li>
              </ul>
              <p className="text-gray-600">
                本平台不对因使用或无法使用本服务而导致的任何直接、间接、偶然、特殊或后果性损害承担责任，包括但不限于利润损失、商誉损失、数据丢失或其他无形损失。
              </p>
            </section>

            {/* 第8条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">八、责任限制</h2>
              <p className="text-gray-600 mb-2">
                在法律允许的最大范围内，本平台对任何索赔的总责任金额不超过您在索赔事件发生前十二（12）个月内向本平台支付的费用总额。
              </p>
              <p className="text-gray-600">
                对于因不可抗力（包括但不限于自然灾害、战争、政府行为、网络攻击、第三方服务故障等）导致的服务中断或数据丢失，本平台不承担责任。
              </p>
            </section>

            {/* 第9条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">九、第三方服务</h2>
              <p className="text-gray-600 mb-2">
                本服务可能包含指向第三方网站或服务的链接，或集成第三方AI大模型API。本平台不对任何第三方网站、服务或AI模型的内容、隐私政策、行为或输出负责。
              </p>
              <p className="text-gray-600">
                您在使用本服务过程中与他方（包括但不限于AI大模型提供商、支付服务商等）产生的互动或交易，仅属于您与该方的行为，本平台不承担任何责任。
              </p>
            </section>

            {/* 第10条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">十、终止</h2>
              <p className="text-gray-600 mb-2">
                本平台保留在任何时候因任何原因（包括但不限于违反本条款）终止或暂停您账号的权利，无需事先通知。
              </p>
              <p className="text-gray-600 mb-2">
                账号终止后，您将失去对服务的访问权限。本平台将在法律允许的范围内保留您的数据，并在合理期限内提供数据导出服务。
              </p>
              <p className="text-gray-600">
                本条款中按其性质应在终止后继续有效的条款（包括但不限于知识产权、免责声明、责任限制等），在终止后将继续有效。
              </p>
            </section>

            {/* 第11条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">十一、管辖法律与争议解决</h2>
              <p className="text-gray-600 mb-2">
                本条款受中华人民共和国法律管辖。因本条款引起或与之相关的任何争议，双方应首先通过友好协商解决。
              </p>
              <p className="text-gray-600">
                协商不成的，任何一方均有权将争议提交至本平台所在地有管辖权的人民法院诉讼解决。
              </p>
            </section>

            {/* 第12条 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">十二、联系我们</h2>
              <p className="text-gray-600 mb-2">
                如您对本条款有任何疑问、意见或建议，请通过以下方式联系我们：
              </p>
              <ul className="list-none space-y-1 text-gray-600">
                <li>📧 邮箱：legal@geo-optimizer.com</li>
                <li>📞 电话：400-XXX-XXXX（工作日 9:00-18:00）</li>
                <li>📍 地址：[公司注册地址]</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-gray-600 underline">隐私政策</Link>
          <span className="mx-3">·</span>
          <Link href="/" className="hover:text-gray-600 underline">返回首页</Link>
        </div>
      </main>
    </div>
  );
}
