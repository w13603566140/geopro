/**
 * GEO优化助手Pro - 前端API客户端
 * 所有前端请求统一通过此后端API服务 (端口3001)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// 内存中的Token存储
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    if (typeof window !== 'undefined') localStorage.setItem('geo_auth_token', token);
  } else {
    if (typeof window !== 'undefined') localStorage.removeItem('geo_auth_token');
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('geo_auth_token');
  }
  return authToken;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `请求失败 (${response.status})`);
  }

  return data;
}

// ========== 认证 API ==========

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { name: string; email: string; password: string; company?: string }) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request<any>('/auth/me'),
};

// ========== 站点 API ==========

export const sitesApi = {
  list: () => request<any[]>('/sites'),
  get: (id: string) => request<any>(`/sites/${id}`),
  create: (data: any) => request<any>('/sites', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => request<any>(`/sites/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<any>(`/sites/${id}`, { method: 'DELETE' }),
  verify: (id: string, method: string) => request<any>(`/sites/${id}/verify`, { method: 'POST', body: JSON.stringify({ method }) }),
};

// ========== GEO体检 API ==========

export const auditApi = {
  run: (siteUrl: string, siteId?: string) =>
    request<any>('/audit/run', { method: 'POST', body: JSON.stringify({ siteUrl, siteId }) }),
};

// ========== 结构化标签 API ==========

export const structuredDataApi = {
  getTemplates: () => request<any>('/structured-data/templates'),
  generate: (type: string, data: any) =>
    request<any>('/structured-data/generate', { method: 'POST', body: JSON.stringify({ type, data }) }),
};

// ========== 监测 API ==========

export const monitoringApi = {
  getEngines: () => request<any>('/monitoring/engines'),
  check: (question: string, engines?: string[], brandName?: string, productName?: string) =>
    request<any>('/monitoring/check', {
      method: 'POST',
      body: JSON.stringify({ question, engines, brandName, productName }),
    }),
};

// ========== 竞品 API ==========

export const competitorsApi = {
  scan: (competitorUrl: string, competitorName: string) =>
    request<any>('/competitors/scan', {
      method: 'POST',
      body: JSON.stringify({ competitorUrl, competitorName }),
    }),
};

// ========== 内容 API ==========

export const contentApi = {
  getQuestions: (industry?: string) =>
    request<string[]>(`/content/questions${industry ? `?industry=${encodeURIComponent(industry)}` : ''}`),
  generate: (data: any) =>
    request<any>('/content/generate', { method: 'POST', body: JSON.stringify(data) }),
  generateFaq: (productName: string, questions: string[]) =>
    request<any>('/content/faq', { method: 'POST', body: JSON.stringify({ productName, questions }) }),
};

// ========== MCP API ==========

export const mcpApi = {
  generateAgentCard: (name: string, description: string, url: string) =>
    request<any>('/mcp/agent-card', { method: 'POST', body: JSON.stringify({ name, description, url }) }),
  generateMcpConfig: (serviceName: string, description: string) =>
    request<any>('/mcp/mcp-config', { method: 'POST', body: JSON.stringify({ serviceName, description }) }),
  generateAll: (name: string, description: string, url: string) =>
    request<any>('/mcp/generate-all', { method: 'POST', body: JSON.stringify({ name, description, url }) }),
};

// ========== 计费 API ==========

export const billingApi = {
  getPlans: () => request<any[]>('/billing/plans'),
  getCreditCosts: () => request<any>('/billing/credit-costs'),
  getUsage: () => request<any>('/billing/usage'),
  upgrade: (planTier: string) =>
    request<any>('/billing/upgrade', { method: 'POST', body: JSON.stringify({ planTier }) }),
  recharge: (amount: number) =>
    request<any>('/billing/recharge', { method: 'POST', body: JSON.stringify({ amount }) }),
  getOrders: () => request<any[]>('/billing/orders'),
};

// ========== 设置 API ==========

export const settingsApi = {
  getProfile: () => request<any>('/settings/profile'),
  updateProfile: (data: any) =>
    request<any>('/settings/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updatePassword: (currentPassword: string, newPassword: string) =>
    request<any>('/settings/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
};

// ========== AI诊断 API ==========

export const diagnosisApi = {
  getModels: () => request<any[]>('/diagnosis/models'),
  runDiagnosis: (brandName: string, industryWords: string[], siteUrl: string, platforms: string[]) =>
    request<any>('/diagnosis/run', {
      method: 'POST',
      body: JSON.stringify({ brandName, industryWords, siteUrl, platforms }),
    }),
  quickQuery: (modelKey: string, question: string, brandName: string) =>
    request<any>('/diagnosis/quick-query', {
      method: 'POST',
      body: JSON.stringify({ modelKey, question, brandName }),
    }),
};

export const adminApi = {
  getSystemConfig: () => request<any>('/admin/system-config'),
  updateSystemConfig: (config: any) =>
    request<any>('/admin/system-config', { method: 'PUT', body: JSON.stringify(config) }),
  getUsers: () => request<any[]>('/admin/users'),
  updateUser: (id: string, data: any) =>
    request<any>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getPaymentConfig: () => request<any>('/admin/payment-config'),
  updatePaymentConfig: (config: any) =>
    request<any>('/admin/payment-config', { method: 'PUT', body: JSON.stringify(config) }),
  getPlans: () => request<any[]>('/admin/plans'),
  getLogs: (page?: number) => request<any>(`/admin/logs?page=${page || 1}`),
};
