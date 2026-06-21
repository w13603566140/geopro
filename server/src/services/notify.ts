/**
 * 通知服务 - 邮件/企业微信通知
 */
import nodemailer from 'nodemailer';

interface NotifyOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

// 邮件发送器 (懒初始化)
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
  return transporter;
}

/** 发送邮件通知 */
export async function sendEmail(options: NotifyOptions): Promise<boolean> {
  try {
    const mail = getTransporter();
    await mail.sendMail({
      from: `"GEO优化助手" <${process.env.SMTP_USER || 'noreply@geo-optimizer.com'}>`,
      to: options.to,
      subject: `[GEO系统] ${options.subject}`,
      text: options.body,
      html: options.html,
    });
    console.log(`📧 邮件已发送: ${options.to} - ${options.subject}`);
    return true;
  } catch (error) {
    console.error('邮件发送失败:', error);
    return false;
  }
}

/** 发送企业微信通知 (Webhook) */
export async function sendWechatNotify(content: string): Promise<boolean> {
  const webhookUrl = process.env.WECHAT_WEBHOOK_URL;
  if (!webhookUrl) return false;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: { content: `## GEO系统通知\n${content}\n> ${new Date().toLocaleString('zh-CN')}` },
      }),
    });
    return true;
  } catch {
    return false;
  }
}

/** 排名下跌告警 */
export async function sendRankAlert(email: string, brandName: string, modelName: string, oldRank: number, newRank: number) {
  return sendEmail({
    to: email,
    subject: `⚠️ ${brandName} 在 ${modelName} 排名下跌`,
    body: `${brandName} 在 ${modelName} 的排名从第${oldRank}位跌至第${newRank}位，建议立即检查优化状态。`,
    html: `<h3>排名下跌告警</h3><p>品牌: <b>${brandName}</b></p><p>平台: ${modelName}</p><p>排名: 第${oldRank}位 → <span style="color:red">第${newRank}位</span></p>`,
  });
}

/** 周报通知 */
export async function sendWeeklyReport(email: string, data: { brandName: string; score: number; visibleCount: number; totalCount: number }) {
  return sendEmail({
    to: email,
    subject: `📊 ${data.brandName} 周度GEO报告`,
    body: `${data.brandName} 本周AI可见度评分: ${data.score}/100，${data.visibleCount}/${data.totalCount} 平台可见。`,
    html: `<h3>周度GEO报告</h3><p>品牌: <b>${data.brandName}</b></p><p>综合评分: <b style="color:${data.score>=70?'green':'orange'}">${data.score}/100</b></p><p>可见平台: ${data.visibleCount}/${data.totalCount}</p>`,
  });
}
