import { Button as MuiButton, ButtonProps } from '@mui/material';

interface Props extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantMap: Record<string, ButtonProps['variant']> = {
  primary: 'contained',
  secondary: 'contained',
  outline: 'outlined',
  ghost: 'text',
};

const sizeMap: Record<string, ButtonProps['size']> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
};

export const Button = ({ variant = 'primary', size = 'md', sx, ...props }: Props) => {
  const muiVariant = variantMap[variant] || 'contained';
  const muiSize = sizeMap[size] || 'medium';

  const customSx = {
    ...(variant === 'secondary' && {
      bgcolor: 'background.paper',
      color: 'text.primary',
      '&:hover': {
        bgcolor: 'action.hover',
      },
    }),
    ...(variant === 'ghost' && {
      color: 'text.secondary',
      '&:hover': {
        bgcolor: 'action.hover',
        color: 'text.primary',
      },
    }),
    ...sx,
  };

  return <MuiButton variant={muiVariant} size={muiSize} sx={customSx} {...props} />;
};
