import { Automation } from '../types';
import {
  logoUrl,
  clientProfileFormUrl,
  competitorAnalysisFormUrl,
  ragKnowledgeBaseUrl,
  claudeIntelligenceUrl,
} from '../env';

export const LOGO_URL = logoUrl;

export const AUTOMATIONS: Automation[] = [
  {
    id: 'client-profile',
    title: 'Client Profile',
    description: 'AI-generated business profile summarizing company services, target markets, competitive positioning, and growth strategy for internal planning and client intelligence.',
    category: 'Sales',
    icon: 'user',
    accentColor: '#3B82F6', // info
    externalLink: clientProfileFormUrl
  },
  {
    id: 'competitor-analysis',
    title: 'Competitor Analysis',
    description: 'Identifies top website competitors, analyzes their SEO and content strategies, and generates a comprehensive competitor analysis report.',
    category: 'Marketing',
    icon: 'chart',
    accentColor: '#10B981',
    externalLink: competitorAnalysisFormUrl
  },
  {
    id: 'rag-knowledge-base',
    title: 'RAG Knowledge Base',
    description: 'Access AI-powered knowledge base for instant answers and insights from company documentation.',
    category: 'AI Tools',
    icon: 'cpu',
    accentColor: '#8B5CF6',
    externalLink: ragKnowledgeBaseUrl
  },
  {
    id: 'seo-audit',
    title: 'SEO Dashboard',
    description: 'Comprehensive website SEO analysis and performance auditing tool. Generates detailed reports on technical SEO, content gaps, and optimization opportunities.',
    category: 'Analytics',
    icon: 'search',
    accentColor: '#F59E0B', // warning
    externalLink: 'https://seo-analytics-ai-dashboardfrontend-production.up.railway.app/'
  },
  {
    id: 'onboarding-dashboard',
    title: 'Onboarding Dashboard',
    description: 'Client onboarding automation for collecting business details, configuring workflows, and tracking new client setup from a single dashboard.',
    category: 'Sales',
    icon: 'briefcase',
    accentColor: '#F15A29', // brand primary
    externalLink: 'https://clientonbordingformsfrontend-production.up.railway.app/login'
  },
  {
    id: 'claude-intelligence-hub',
    title: 'Claude Intelligence Hub',
    description:
      'Chat with Claude connected to Google Drive, custom MCP tools, and unified LeadGear data—Drive files, meeting transcripts, and SEO dashboard insights—with automated report generation.',
    category: 'AI Tools',
    icon: 'lightning',
    accentColor: '#D14B20', // brand primary dark
    externalLink: claudeIntelligenceUrl,
  },
  // {
  //   id: 'mom-generation',
  //   title: 'Automated MOM Generation',
  //   description: 'A fully automated workflow that generates structured Minutes of Meeting (MOM) from Fathom meeting transcripts and distributes them via Gmail to stakeholders.',
  //   category: 'AI Tools',
  //   icon: 'description',
  //   accentColor: '#0EA5E9',
  //   detailsOnly: true,
  //   detailedDescription: `This automation streamlines post-meeting documentation by automatically converting meeting transcripts into structured MOM documents and sharing them via email. The process operates end-to-end without manual intervention.

  //     Workflow Process :

  //     1. Meeting Transcript Capture
  //     Meeting transcripts are automatically retrieved from Fathom after each meeting concludes.

  //     2. MOM Generation
  //     The transcript is processed to generate a structured Minutes of Meeting (MOM) document containing:
  //     • Key discussion points
  //     • Decisions made
  //     • Action items
  //     • Responsible stakeholders (if identified in the transcript)

  //     The MOM is formatted in a professional and standardized structure suitable for internal or client communication.

  //     3. Automated Email Distribution
  //     The generated MOM is automatically sent via Gmail to predefined stakeholders for documentation and reference purposes.`
  // }
];
