// ========== 诊断相关类型 ==========

export interface AIVisibilityResult {
  modelKey: string;
  modelName: string;
  modelIcon: string;
  visible: boolean;
  rank: number | null;
  brandMentioned: boolean;
  responseSnippet: string;
  referredUrl: string;
  confidence: number;
  topCompetitors: string[];
  suggestions: string[];
}

export interface DiagnosisSummary {
  totalPlatforms: number;
  visiblePlatforms: number;
  firstPlacePlatforms: number;
  averageRank: number;
  visibilityRate: number;
  topIssues: string[];
  overallScore: number;
}

export interface OptimizationAction {
  priority: 'high' | 'medium' | 'low';
  action: string;
  targetPlatforms: string[];
  estimatedImpact: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface OptimizationPlan {
  urgentActions: OptimizationAction[];
  shortTermActions: OptimizationAction[];
  longTermActions: OptimizationAction[];
}

export interface DiagnosisReport {
  id: string;
  brandName: string;
  industryWords: string[];
  siteUrl: string;
  checkedAt: string;
  platforms: string[];
  results: AIVisibilityResult[];
  summary: DiagnosisSummary;
  optimizationPlan: OptimizationPlan;
}
