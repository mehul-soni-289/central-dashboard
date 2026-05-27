interface IconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export const UserIcon = ({ className = 'w-6 h-6', size, style }: IconProps) => (
  <svg
    className={className}
    width={size || 24}
    height={size || 24}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={style}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const ChartIcon = ({ className = 'w-6 h-6', size, style }: IconProps) => (
  <svg
    className={className}
    width={size || 24}
    height={size || 24}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={style}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const CpuIcon = ({ className = 'w-6 h-6', size, style }: IconProps) => (
  <svg
    className={className}
    width={size || 24}
    height={size || 24}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={style}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

export const SearchIcon = ({ className = 'w-6 h-6', size, style }: IconProps) => (
  <svg
    className={className}
    width={size || 24}
    height={size || 24}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={style}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const LightningIcon = ({ className = 'w-6 h-6', size, style }: IconProps) => (
  <svg
    className={className}
    width={size || 24}
    height={size || 24}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={style}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export const MegaphoneIcon = ({ className = 'w-6 h-6', size, style }: IconProps) => (
  <svg
    className={className}
    width={size || 24}
    height={size || 24}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={style}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

export const BriefcaseIcon = ({ className = 'w-6 h-6', size, style }: IconProps) => (
  <svg
    className={className}
    width={size || 24}
    height={size || 24}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={style}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const TrendingUpIcon = ({ className = 'w-6 h-6', size, style }: IconProps) => (
  <svg
    className={className}
    width={size || 24}
    height={size || 24}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={style}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const iconMap = {
  user: UserIcon,
  chart: ChartIcon,
  cpu: CpuIcon,
  search: SearchIcon,
  lightning: LightningIcon,
  megaphone: MegaphoneIcon,
  briefcase: BriefcaseIcon,
  trending: TrendingUpIcon,
} as const;

export type IconName = keyof typeof iconMap;

interface IconComponentProps extends IconProps {
  name: IconName;
}

export const Icon = ({ name, className, size, style }: IconComponentProps) => {
  const IconComponent = iconMap[name];
  return <IconComponent className={className} size={size} style={style} />;
};
