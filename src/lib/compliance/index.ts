/**
 * 风控合规系统
 * 内容敏感词过滤、站点风险检测、操作日志审计
 */

// 敏感词库（示例，生产环境需接入专业敏感词API）
const SENSITIVE_KEYWORDS = [
  // 跨境违规
  '翻墙', 'VPN推荐', '科学上网', '梯子推荐',
  // 时政敏感
  '政治', '民主运动', '独立',
  // 医疗违规
  '药品保证', '治愈率', '无副作用', '特效药', '祖传秘方',
  // 金融违规
  '稳赚', '保本', '无风险', '年化收益率保证', '内幕消息',
  // 其他违规
  '赌博', '色情', '枪支', '毒品',
];

const FINANCIAL_RISK_PATTERNS = [
  /年化(收益|回报)率.*%/,
  /保证.*收益/,
  /稳赚不赔/,
  /无风险/,
  /日入.*万/,
];

const MEDICAL_RISK_PATTERNS = [
  /治愈率.*%/,
  /根治/,
  /无副作用/,
  /特效药/,
  /祖传/,
];

/**
 * 内容合规检查
 */
export function checkContentCompliance(content: string): {
  isCompliant: boolean;
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKED';
  riskReasons: string[];
  sanitizedContent?: string;
} {
  const riskReasons: string[] = [];
  let riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKED' = 'SAFE';

  // 检查敏感词
  for (const keyword of SENSITIVE_KEYWORDS) {
    if (content.includes(keyword)) {
      riskReasons.push(`包含敏感词: "${keyword}"`);
      riskLevel = 'BLOCKED';
    }
  }

  // 检查金融违规
  for (const pattern of FINANCIAL_RISK_PATTERNS) {
    if (pattern.test(content)) {
      riskReasons.push('包含金融营销违规表述');
      riskLevel = riskLevel === 'BLOCKED' ? 'BLOCKED' : 'HIGH';
    }
  }

  // 检查医疗违规
  for (const pattern of MEDICAL_RISK_PATTERNS) {
    if (pattern.test(content)) {
      riskReasons.push('包含医疗违规宣传表述');
      riskLevel = riskLevel === 'BLOCKED' ? 'BLOCKED' : 'HIGH';
    }
  }

  // 检查过度营销
  const marketingPatterns = content.match(/最好|第一|唯一|最低价|免费永久/g);
  if (marketingPatterns && marketingPatterns.length > 3) {
    riskReasons.push('包含过度营销表述');
    if (riskLevel === 'SAFE') riskLevel = 'LOW';
  }

  // 敏感词替换清理
  let sanitizedContent = content;
  if (riskReasons.length > 0 && riskLevel !== 'BLOCKED') {
    for (const keyword of SENSITIVE_KEYWORDS) {
      sanitizedContent = sanitizedContent.replace(new RegExp(keyword, 'g'), '***');
    }
  }

  return {
    isCompliant: riskLevel !== 'BLOCKED',
    riskLevel,
    riskReasons,
    sanitizedContent: riskLevel !== 'BLOCKED' ? sanitizedContent : undefined,
  };
}

/**
 * 站点风险检测
 */
export function detectSiteRisk(pageUrl: string, pageContent: string): {
  riskScore: number;
  issues: { severity: string; description: string; suggestion: string }[];
} {
  const issues: { severity: string; description: string; suggestion: string }[] = [];
  let riskScore = 0;

  // 检测无ICP备案
  if (!pageContent.includes('ICP备') && !pageContent.includes('ICP证')) {
    issues.push({
      severity: 'medium',
      description: '网站缺少ICP备案信息展示',
      suggestion: '在页面底部添加ICP备案号',
    });
    riskScore += 10;
  }

  // 检测跨境内容
  const crossBorderPatterns = [/海外.*服务器/, /境外.*主机/, /国际.*节点/];
  for (const pattern of crossBorderPatterns) {
    if (pattern.test(pageContent)) {
      issues.push({
        severity: 'low',
        description: '包含跨境服务相关内容',
        suggestion: '请确保相关服务符合跨境运营法规要求',
      });
      riskScore += 5;
    }
  }

  // 检测隐私政策
  if (!pageContent.includes('隐私政策') && !pageContent.includes('隐私协议')) {
    issues.push({
      severity: 'high',
      description: '网站缺少隐私政策页面',
      suggestion: '添加标准隐私政策页面并链接到页脚',
    });
    riskScore += 20;
  }

  // 检测用户协议
  if (!pageContent.includes('用户协议') && !pageContent.includes('服务条款')) {
    issues.push({
      severity: 'medium',
      description: '网站缺少用户协议/服务条款',
      suggestion: '添加用户协议页面',
    });
    riskScore += 10;
  }

  // 检测AI生成内容声明
  if (pageContent.includes('AI生成') || pageContent.includes('AI写作')) {
    issues.push({
      severity: 'low',
      description: '包含AI生成内容但缺少声明',
      suggestion: '根据网信办规定，AI生成内容建议添加标识声明',
    });
    riskScore += 5;
  }

  return { riskScore: Math.min(100, riskScore), issues };
}

/**
 * 用户操作日志记录
 */
export interface AuditLogEntry {
  userId?: string;
  organizationId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
}

/**
 * 标准法律页面模板
 */
export function generatePrivacyPolicy(companyName: string): string {
  return `# 隐私政策

更新日期：${new Date().toISOString().split('T')[0]}

${companyName}（以下简称"我们"）深知个人信息对您的重要性，我们将按照法律法规的规定，保护您的个人信息及隐私安全。

## 一、我们收集的信息
- 账号信息：邮箱、用户名
- 使用信息：操作日志、访问记录
- 站点信息：您添加的待优化网站URL及内容

## 二、信息使用目的
- 提供GEO优化服务
- 生成优化报告
- 改进服务质量

## 三、信息存储与保护
我们采用业界通行的安全措施保护您的信息，防止未经授权的访问、使用或泄露。

## 四、您的权利
您有权访问、更正、删除您的个人信息，以及撤回同意。

## 五、联系我们
如有任何隐私相关问题，请联系：support@example.com
`;
}

export function generateTermsOfService(companyName: string): string {
  return `# 服务条款

更新日期：${new Date().toISOString().split('T')[0]}

欢迎使用 ${companyName} GEO优化助手（以下简称"本服务"）。

## 一、服务说明
本服务为SaaS形式的生成式AI搜索引擎优化（GEO）工具，帮助用户提升在AI搜索引擎中的品牌可见度。

## 二、账号管理
- 用户应妥善保管账号密码
- 不得转借、转让账号
- 不得利用本服务进行违法违规活动

## 三、套餐与付费
- 免费版提供基础功能
- 专业版和企业版按套餐规则收费
- 付费后不支持无理由退款（7天内可申请）

## 四、使用限制
- 不得使用本服务优化违法违规网站
- 不得恶意攻击、爬取第三方网站
- 不得生成违法违规内容

## 五、免责声明
AI搜索引擎排名受多种因素影响，我们不保证特定排名结果。

## 六、服务变更与终止
我们有权根据业务需要调整服务内容，重大变更将提前通知。
`;
}
