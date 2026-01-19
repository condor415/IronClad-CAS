export interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

export interface AuditResult {
  bleed_estimate: string;
  triage_plan: string[];
}

export interface AuditData {
  contactName: string;
  businessName: string;
  industry: string;
  email: string;
  phone: string;
  revenue: string;
  employees: string;
  accountingSetup: string;
  painPoints: string[];
  customPain: string;
}

export interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
}

export type ViewState = 'landing' | 'articles' | 'article-view' | 'about';