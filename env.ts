interface EnvironmentConfig {
  apiBaseUrl: string;
  clientProfileWebhook: string;
  competitorAnalysisWebhook: string;
  competitorServiceWebhook: string;
  clientProfileFormUrl: string;
  competitorAnalysisFormUrl: string;
  ragKnowledgeBaseUrl: string;
  claudeIntelligenceUrl: string;
  logoUrl: string;
}

function validateEnv(): void {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_CLIENT_PROFILE_WEBHOOK',
    'VITE_COMPETITOR_ANALYSIS_WEBHOOK',
    'VITE_CLIENT_PROFILE_FORM_URL',
    'VITE_COMPETITOR_ANALYSIS_FORM_URL',
    'VITE_RAG_KNOWLEDGE_BASE_URL',
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0 && import.meta.env.DEV) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
}

if (import.meta.env.DEV) {
  validateEnv();
}

export const env: EnvironmentConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://leadgear.app.n8n.cloud',
  clientProfileWebhook: import.meta.env.VITE_CLIENT_PROFILE_WEBHOOK || '/webhook/client-profile',
  competitorAnalysisWebhook: import.meta.env.VITE_COMPETITOR_ANALYSIS_WEBHOOK || '/webhook/competitor-analysis',
  competitorServiceWebhook: import.meta.env.VITE_COMPETITOR_SERVICE_WEBHOOK || '/webhook/competitor_service',
  clientProfileFormUrl: import.meta.env.VITE_CLIENT_PROFILE_FORM_URL || 'https://leadgear.app.n8n.cloud/form/f15edb1d-4f4d-4808-8221-ac24efc0b74b',
  competitorAnalysisFormUrl: import.meta.env.VITE_COMPETITOR_ANALYSIS_FORM_URL || 'https://leadgear.app.n8n.cloud/form/5dec6955-4f3c-4352-a42c-7f097dd528e8',
  ragKnowledgeBaseUrl: import.meta.env.VITE_RAG_KNOWLEDGE_BASE_URL || 'https://leadgear-multi-tenant-ai-knowledgeb.vercel.app/',
  claudeIntelligenceUrl: import.meta.env.VITE_CLAUDE_INTELLIGENCE_URL || 'https://claude.ai/new',
  logoUrl: import.meta.env.VITE_LOGO_URL || '/App.svg',
};

export const getApiUrl = (endpoint: string): string => `${env.apiBaseUrl}${endpoint}`;

export const {
  apiBaseUrl,
  clientProfileWebhook,
  competitorAnalysisWebhook,
  competitorServiceWebhook,
  clientProfileFormUrl,
  competitorAnalysisFormUrl,
  ragKnowledgeBaseUrl,
  claudeIntelligenceUrl,
  logoUrl,
} = env;
