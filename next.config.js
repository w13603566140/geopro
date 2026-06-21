/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'pdfkit'],
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: ['localhost'],
  },
  // 中文站元数据
  env: {
    APP_NAME: 'GEO优化助手Pro',
    APP_DOMAIN: process.env.APP_DOMAIN || 'http://localhost:3000',
  },
  // API代理到后端
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
