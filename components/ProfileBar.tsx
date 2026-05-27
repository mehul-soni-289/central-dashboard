import { Box, Typography, Avatar, Badge } from '@mui/material';

export const ProfileBar = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
      <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>
        Jeff Old
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'primary.main',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          mt: 0.5,
        }}
      >
        ADMIN
      </Typography>
    </Box>
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main', border: '2px solid', borderColor: 'background.paper' }} />}
    >
      <Avatar
        src="/user.png"
        alt="Jeff Old"
        sx={{
          width: 40,
          height: 40,
          border: '2px solid',
          borderColor: 'background.paper',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
          },
          transition: 'border-color 0.3s ease',
        }}
      />
    </Badge>
  </Box>
);
