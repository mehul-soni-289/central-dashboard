import { Box, Typography, LinearProgress } from '@mui/material';
import { LOGO_URL } from '../constants';
import { OrangeGearLoader } from './OrangeGearLoader';
import { brand } from '../brand/tokens';

interface IntroOverlayProps {
  isVisible: boolean;
}

export const IntroOverlay = ({ isVisible }: IntroOverlayProps) => {
  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(180deg, ${brand.colors.powder} 0%, ${brand.colors.smoke} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <OrangeGearLoader size={56} className="intro-gear" />
      <Box
        component="img"
        src={LOGO_URL}
        alt="Leadgear"
        sx={{
          width: 260,
          height: 'auto',
          mt: 3,
          mb: 2,
          animation: 'logoEntrance 0.8s ease-out forwards',
        }}
      />
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.25rem' },
          fontWeight: 800,
          color: brand.colors.slate,
          mb: 1,
          textAlign: 'center',
        }}
      >
        Welcome to Leadgear
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: brand.colors.textSecondary,
          fontWeight: 500,
          letterSpacing: '0.04em',
          textAlign: 'center',
        }}
      >
        Initializing System Control…
      </Typography>
      <Box
        sx={{
          width: 220,
          height: 4,
          bgcolor: brand.colors.mist,
          borderRadius: 1,
          mt: 4,
          overflow: 'hidden',
        }}
      >
        <LinearProgress
          sx={{
            height: '100%',
            bgcolor: 'transparent',
            '& .MuiLinearProgress-bar': {
              bgcolor: brand.colors.primary,
            },
          }}
        />
      </Box>
      <style>
        {`
          @keyframes logoEntrance {
            0% { transform: translateY(12px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};
