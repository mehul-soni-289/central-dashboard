import { Card, CardContent, Box, Chip, Typography } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Automation } from '../types';
import { Icon } from './MuiIcons';
import { brand } from '../brand/tokens';
import { cardElevationSx } from '../utils/brandStyles';

interface Props {
  automation: Automation;
  onClick: () => void;
}

export const AutomationCard = ({ automation, onClick }: Props) => {
  const { title, description, icon, accentColor, status = 'active' } = automation;
  const isActive = status === 'active';
  const iconBg = isActive ? `${accentColor}18` : brand.colors.mist;
  const launchColor = isActive ? accentColor : brand.colors.textMuted;

  return (
    <Card
      onClick={isActive ? onClick : undefined}
      sx={{
        ...cardElevationSx,
        height: '100%',
        cursor: isActive ? 'pointer' : 'not-allowed',
        opacity: isActive ? 1 : 0.72,
        filter: isActive ? 'none' : 'grayscale(0.35)',
        '&:hover': isActive
          ? {
              transform: 'translateY(-3px)',
              boxShadow: `0 12px 28px ${accentColor}22`,
            }
          : {},
      }}
    >
      <CardContent
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: iconBg,
            }}
          >
            <Icon name={icon} sx={{ color: isActive ? accentColor : brand.colors.iron, fontSize: 26 }} />
          </Box>
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              fontSize: '0.625rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              height: 24,
              ...(isActive
                ? {
                    bgcolor: brand.colors.primarySubtle,
                    color: brand.colors.primaryDark,
                  }
                : {
                    bgcolor: brand.colors.smoke,
                    color: brand.colors.textMuted,
                  }),
            }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: brand.colors.slate,
            fontSize: '1.0625rem',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: brand.colors.textSecondary,
            mb: 2.5,
            flexGrow: 1,
            lineHeight: 1.55,
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            pt: 2,
            borderTop: `1px solid ${brand.colors.mist}`,
            display: 'flex',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: launchColor,
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {isActive ? 'Launch System' : 'Coming Soon'}
            {isActive && <ArrowForward sx={{ fontSize: 15 }} />}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
