export interface SiteData {
  id: string;
  name: string;
  url: string;
  type: SiteType;
  brandName: string | null;
  isVerified: boolean;
  status: SiteStatus;
  geoScore: number | null;
  lastAuditAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SiteType = 'OFFICIAL_WEBSITE' | 'DOCS_SITE' | 'OPEN_SOURCE' | 'API_GATEWAY' | 'DOWNLOAD_SITE' | 'BLOG' | 'OTHER';
export type SiteStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'VERIFICATION_FAILED' | 'SUSPENDED';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
