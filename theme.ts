import { createTheme } from '@mui/material/styles';
import { brand } from './brand/tokens';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: typeof brand.shadow;
  }
  interface ThemeOptions {
    customShadows?: typeof brand.shadow;
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.colors.primary,
      light: brand.colors.primaryLight,
      dark: brand.colors.primaryDark,
      contrastText: brand.colors.textInverse,
    },
    secondary: {
      main: brand.colors.slate,
      contrastText: brand.colors.textInverse,
    },
    success: {
      main: brand.colors.success,
    },
    warning: {
      main: brand.colors.warning,
    },
    error: {
      main: brand.colors.error,
    },
    info: {
      main: brand.colors.info,
    },
    background: {
      default: brand.colors.background,
      paper: brand.colors.surfaceRaised,
    },
    text: {
      primary: brand.colors.textPrimary,
      secondary: brand.colors.textSecondary,
      disabled: brand.colors.textMuted,
    },
    divider: brand.colors.border,
    action: {
      hover: brand.colors.smoke,
      selected: brand.colors.primarySubtle,
    },
  },
  typography: {
    fontFamily: brand.fonts.body,
    h1: {
      fontFamily: brand.fonts.display,
      fontWeight: 800,
      fontSize: '2.5rem',
      color: brand.colors.slate,
    },
    h2: {
      fontFamily: brand.fonts.display,
      fontWeight: 800,
      fontSize: '2rem',
      color: brand.colors.slate,
    },
    h3: {
      fontFamily: brand.fonts.display,
      fontWeight: 700,
      fontSize: '1.5rem',
      color: brand.colors.slate,
    },
    h4: {
      fontFamily: brand.fonts.display,
      fontWeight: 700,
      fontSize: '1.25rem',
    },
    h5: {
      fontFamily: brand.fonts.display,
      fontWeight: 700,
    },
    h6: {
      fontFamily: brand.fonts.display,
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      fontFamily: brand.fonts.body,
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: brand.radius,
  },
  customShadows: brand.shadow,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: 'rgba(241, 90, 41, 0.45) transparent',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: brand.radius,
        },
        containedPrimary: {
          boxShadow: brand.shadow.raised,
          '&:hover': {
            boxShadow: brand.shadow.raised,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: brand.radius,
          boxShadow: brand.shadow.card,
          border: `1px solid ${brand.colors.border}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: brand.colors.powder,
          borderRight: `1px solid ${brand.colors.border}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: brand.radius,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: brand.colors.primary,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: brand.colors.primary,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.colors.primary,
            boxShadow: `0 0 0 3px ${brand.colors.primarySubtle}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorSuccess: {
          backgroundColor: `${brand.colors.success}1A`,
          color: brand.colors.success,
        },
      },
    },
  },
});
