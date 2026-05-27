import type { SxProps, Theme } from '@mui/material/styles';
import { brand } from '../brand/tokens';

export const modalPaperSx = (): SxProps<Theme> => ({
  bgcolor: brand.colors.powder,
  border: '1px solid',
  borderColor: brand.colors.border,
  borderRadius: `${brand.modalRadius}px`,
  boxShadow: brand.shadow.modal,
  overflow: 'hidden',
});

export const modalTitleSx = (): SxProps<Theme> => ({
  bgcolor: brand.colors.headerWarm,
  borderBottom: `1px solid ${brand.colors.mist}`,
  px: 3,
  py: 2.5,
});

export const modalAvatarSx = (accentColor: string = brand.colors.primary): SxProps<Theme> => ({
  bgcolor: accentColor,
  color: brand.colors.textInverse,
  width: 56,
  height: 56,
});

export const modalContentSx: SxProps<Theme> = {
  bgcolor: brand.colors.powder,
  px: 3,
  py: 3,
};

export const modalActionsSx: SxProps<Theme> = {
  px: 3,
  pb: 3,
  pt: 0,
  bgcolor: brand.colors.powder,
  gap: 1.5,
};

export const modalTextFieldSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: `${brand.radius}px`,
    bgcolor: brand.colors.powder,
    '& fieldset': {
      borderColor: brand.colors.border,
    },
    '&:hover fieldset': {
      borderColor: brand.colors.borderStrong,
    },
    '&.Mui-focused fieldset': {
      borderColor: brand.colors.primary,
      borderWidth: 2,
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: brand.colors.textMuted,
    opacity: 1,
  },
};

export const modalCancelButtonSx: SxProps<Theme> = {
  flex: 1,
  py: 1.5,
  fontWeight: 600,
  fontSize: '0.9375rem',
  borderRadius: `${brand.radius}px`,
  bgcolor: brand.colors.powder,
  color: brand.colors.textPrimary,
  border: `1px solid ${brand.colors.border}`,
  boxShadow: 'none',
  '&:hover': {
    bgcolor: brand.colors.smoke,
    borderColor: brand.colors.borderStrong,
    boxShadow: 'none',
  },
};

export const primaryActionButtonSx: SxProps<Theme> = {
  flex: 1,
  py: 1.5,
  fontWeight: 700,
  fontSize: '0.9375rem',
  borderRadius: `${brand.radius}px`,
  bgcolor: brand.colors.primary,
  color: brand.colors.textInverse,
  boxShadow: 'none',
  '&:hover': {
    bgcolor: brand.colors.primaryDark,
    boxShadow: 'none',
  },
  '&:disabled': {
    bgcolor: brand.colors.mist,
    color: brand.colors.textMuted,
  },
};

export const accentActionButtonSx = (accentColor: string): SxProps<Theme> => ({
  ...primaryActionButtonSx,
  bgcolor: accentColor,
  '&:hover': {
    bgcolor: accentColor,
    filter: 'brightness(0.92)',
    boxShadow: 'none',
  },
});

export const cardElevationSx: SxProps<Theme> = {
  borderRadius: `${brand.modalRadius}px`,
  boxShadow: brand.shadow.card,
  border: `1px solid ${brand.colors.border}`,
  bgcolor: brand.colors.powder,
  overflow: 'hidden',
  transition: 'box-shadow 0.25s ease, transform 0.25s ease',
  '&:hover': {
    boxShadow: brand.shadow.raised,
  },
};
