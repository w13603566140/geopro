/**
 * PDF报告生成服务
 * 生成GEO诊断报告的PDF文件
 */
import PDFDocument from 'pdfkit';

interface ReportData {
  brandName: string;
  industryWords: string[];
  siteUrl: string;
  overallScore: number;
  visiblePlatforms: number;
  totalPlatforms: number;
  firstPlacePlatforms: number;
  visibilityRate: number;
  results: { modelName: string; modelIcon: string; visible: boolean; rank: number | null; responseSnippet: string; }[];
  actions: { priority: string; action: string; }[];
}

export function generatePDFReport(data: ReportData): PDFKit.PDFDocument {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const color = data.overallScore >= 70 ? '#16a34a' : data.overallScore >= 40 ? '#d97706' : '#dc2626';

  // 标题
  doc.fontSize(24).font('Helvetica-Bold').text('GEO AI可见度诊断报告', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).font('Helvetica').fillColor('#666')
    .text(`品牌: ${data.brandName}`, { align: 'center' })
    .text(`行业: ${data.industryWords.join('、')}`, { align: 'center' })
    .text(`站点: ${data.siteUrl || '未填写'}`, { align: 'center' })
    .text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, { align: 'center' });
  doc.moveDown();

  // 综合评分
  doc.fontSize(48).font('Helvetica-Bold').fillColor(color)
    .text(`${data.overallScore}`, { align: 'center' });
  doc.fontSize(14).fillColor('#666')
    .text('AI可见度综合评分 / 100', { align: 'center' });
  doc.moveDown();

  // 统计
  const stats = [
    { label: '可见平台', value: `${data.visiblePlatforms}/${data.totalPlatforms}` },
    { label: '首位占位', value: String(data.firstPlacePlatforms) },
    { label: '可见率', value: `${data.visibilityRate}%` },
  ];
  stats.forEach(s => {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#333').text(s.label);
    doc.fontSize(14).fillColor(color).text(s.value, { continued: true });
    doc.moveDown(0.3);
  });
  doc.moveDown();

  // 平台详情
  doc.fontSize(16).font('Helvetica-Bold').fillColor('#333').text('AI模型可见度详情');
  doc.moveDown(0.5);
  data.results.forEach(r => {
    const status = r.visible ? (r.rank === 1 ? '🥇首位' : `第${r.rank}位`) : '未收录';
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#333')
      .text(`${r.modelIcon} ${r.modelName} - ${status}`);
    doc.fontSize(9).font('Helvetica').fillColor('#666')
      .text(r.responseSnippet.slice(0, 200), { indent: 20 });
    doc.moveDown(0.3);
  });

  // 优化方案
  doc.addPage();
  doc.fontSize(16).font('Helvetica-Bold').fillColor('#333').text('品牌优化方案');
  doc.moveDown(0.5);
  data.actions.forEach(a => {
    const pColor = a.priority === 'high' ? '#dc2626' : a.priority === 'medium' ? '#d97706' : '#2563eb';
    doc.fontSize(10).font('Helvetica-Bold').fillColor(pColor)
      .text(`[${a.priority === 'high' ? '紧急' : a.priority === 'medium' ? '短期' : '长期'}]`, { continued: true });
    doc.fillColor('#333').text(` ${a.action}`);
    doc.moveDown(0.3);
  });

  // 页脚
  doc.fontSize(8).fillColor('#999')
    .text('本报告由 GEO优化助手Pro 自动生成', { align: 'center' });

  doc.end();
  return doc;
}
