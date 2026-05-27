import { Button, useTheme } from '@mui/material';
import { IconName } from './MuiIcons';
import { Icon } from './MuiIcons';

interface SidebarItemProps {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: IconName;
}

export const SidebarItem = ({ active, label, onClick, icon }: SidebarItemProps) => {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      fullWidth
      startIcon={<Icon name={icon} fontSize="small" />}
      sx={{
        justifyContent: 'flex-start',
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        px: 2,
        py: 1.5,
        color: active ? 'primary.contrastText' : 'text.secondary',
        backgroundColor: active ? 'primary.main' : 'transparent',
        boxShadow: active ? `0 4px 12px ${theme.palette.primary.main}33` : 'none',
        '&:hover': {
          backgroundColor: active ? 'primary.dark' : 'action.hover',
          color: active ? 'primary.contrastText' : 'text.primary',
        },
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </Button>
  );
};
