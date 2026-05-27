import {
  Person as UserIcon,
  BarChart as ChartIcon,
  Memory as CpuIcon,
  Search as SearchIcon,
  Bolt as LightningIcon,
  Campaign as MegaphoneIcon,
  Work as BriefcaseIcon,
  TrendingUp as TrendingUpIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const iconMap = {
  user: UserIcon,
  chart: ChartIcon,
  cpu: CpuIcon,
  search: SearchIcon,
  lightning: LightningIcon,
  megaphone: MegaphoneIcon,
  briefcase: BriefcaseIcon,
  trending: TrendingUpIcon,
  description: DescriptionIcon,
} as const;

export type IconName = keyof typeof iconMap;

interface IconComponentProps {
  name: IconName;
  className?: string;
  sx?: any;
  fontSize?: 'small' | 'medium' | 'large' | 'inherit';
}

export const Icon = ({ name, sx, fontSize = 'medium', ...props }: IconComponentProps) => {
  const IconComponent = iconMap[name];
  return <IconComponent fontSize={fontSize} sx={sx} {...props} />;
};
