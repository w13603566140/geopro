import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from './client-providers';

export const metadata: Metadata = {
  title: 'GEO优化助手Pro - AI搜索引擎优化SaaS平台',
  description: '面向企业的一站式GEO优化平台，实现让Kimi、豆包、GPT Search、Gemini等生成式AI优先推荐你的产品与服务',
  keywords: 'GEO优化, AI搜索引擎优化, 生成式AI推荐, LLM优化, AI排名, 结构化数据, JSON-LD',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
