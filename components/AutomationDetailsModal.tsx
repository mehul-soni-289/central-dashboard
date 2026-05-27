import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Avatar,
  Typography,
} from '@mui/material';
import { Close, Description } from '@mui/icons-material';
import { Automation } from '../types';
import { modalPaperSx, modalTitleSx, modalAvatarSx, modalContentSx } from '../utils/brandStyles';
import { brand } from '../brand/tokens';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  automation: Automation | null;
}

export const AutomationDetailsModal = ({ isOpen, onClose, automation }: Props) => {
  if (!automation) return null;

  const { title, description, detailedDescription, accentColor } = automation;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: modalPaperSx() }}>
      <DialogTitle sx={modalTitleSx()} component="div">
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={modalAvatarSx(accentColor)}>
              <Description sx={{ fontSize: 26 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: brand.colors.slate }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 0.5 }}>
                {description}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: brand.colors.iron }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ ...modalContentSx, py: 3 }}>
        {detailedDescription && (
          <Typography
            component="div"
            sx={{
              whiteSpace: 'pre-line',
              color: brand.colors.textSecondary,
              lineHeight: 1.8,
              '& strong': { color: brand.colors.textPrimary },
            }}
          >
            {detailedDescription.split(/\n\n+/).map((block, i) => {
              const trimmed = block.trim();
              if (!trimmed) return null;
              if (/^\d+\.\s+.+/.test(trimmed)) {
                const titleMatch = trimmed.match(/^(\d+\.\s+[^\n]+)/);
                const sectionTitle = titleMatch ? titleMatch[1] : trimmed;
                const rest = titleMatch ? trimmed.slice(sectionTitle.length).trim() : '';
                return (
                  <Box key={i} sx={{ mb: 2.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: brand.colors.slate }}>
                      {sectionTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1, whiteSpace: 'pre-line' }}>
                      {rest}
                    </Typography>
                  </Box>
                );
              }
              if (trimmed.startsWith('•')) {
                return (
                  <Box key={i} component="ul" sx={{ pl: 2.5, mb: 1.5, color: 'text.secondary' }}>
                    {trimmed.split('\n').filter(Boolean).map((line, j) => (
                      <li key={j}>
                        <Typography component="span" variant="body2">
                          {line.replace(/^•\s*/, '')}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                );
              }
              return (
                <Typography key={i} variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                  {trimmed}
                </Typography>
              );
            })}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};
