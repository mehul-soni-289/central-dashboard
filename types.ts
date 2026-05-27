import { IconName } from './components/MuiIcons';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface Automation {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: IconName;
  accentColor: string;
  formFields?: FormField[];
  externalLink?: string;
  status?: 'active' | 'inactive';
  /** When true, click only opens a details modal (no form, no webhook). */
  detailsOnly?: boolean;
  /** Full detailed description shown in the details-only modal. */
  detailedDescription?: string;
}

export enum Category {
  ALL = 'All Systems',
  MARKETING = 'Marketing',
  AI_TOOLS = 'AI Tools',
  SALES = 'Sales',
  DATA = 'Analytics'
}
