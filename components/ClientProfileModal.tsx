import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Avatar,
  Typography,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Close, Person, CheckCircle, HelpOutline, WarningAmberRounded, Launch } from '@mui/icons-material';
import { Button } from './Button';
import { brand } from '../brand/tokens';
import {
  modalPaperSx,
  modalTitleSx,
  modalAvatarSx,
  modalContentSx,
  modalActionsSx,
  modalTextFieldSx,
  modalCancelButtonSx,
  primaryActionButtonSx,
} from '../utils/brandStyles';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const CHECK_WEBHOOK = 'https://leadgear.app.n8n.cloud/webhook/client-profile-check-existing';
const MANUAL_WEBHOOK = 'https://leadgear.app.n8n.cloud/webhook/client-profile-manual';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface CheckResponse {
  'folder-id': string;
  is_exist: boolean;
  file_id?: string;
  website_url: string;
  email: string;
  company_name: string;
}

interface FormState {
  company_name: string;
  website_url: string;
  notification_email: string;
}

interface FormErrors {
  company_name?: string;
  website_url?: string;
  notification_email?: string;
}

type ModalStep = 'form' | 'override-confirm' | 'success';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

/* ─────────────────────────────────────────────
   URL validation — must start with https://
───────────────────────────────────────────── */
function validateHttpsUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return 'Website URL is required';
  if (!trimmed.startsWith('https://')) return 'URL must begin with https:// (e.g. https://example.com)';
  if (trimmed.includes(' ')) return 'URL must not contain spaces';
  const protocolMatches = trimmed.match(/https?:\/\//gi);
  if (protocolMatches && protocolMatches.length > 1)
    return 'Please enter only one URL';
  try {
    const url = new URL(trimmed);
    if (!url.hostname || url.hostname === 'https:') return 'Please enter a valid URL (e.g. https://example.com)';
    return '';
  } catch {
    return 'Please enter a valid URL (e.g. https://example.com)';
  }
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export const ClientProfileModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [step, setStep] = useState<ModalStep>('form');
  const [form, setForm] = useState<FormState>({ company_name: '', website_url: '', notification_email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResponse | null>(null);
  const [isOverriding, setIsOverriding] = useState(false);

  /* ── Reset all state whenever the modal is opened ── */
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setForm({ company_name: '', website_url: '', notification_email: '' });
      setErrors({});
      setCheckResult(null);
      setIsLoading(false);
      setIsOverriding(false);
    }
  }, [isOpen]);

  /* ── helpers ── */
  const googleDocsUrl = (fileId: string) => `https://docs.google.com/document/d/${fileId}/edit`;

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.company_name.trim()) newErrors.company_name = 'Company name is required';

    const urlErr = validateHttpsUrl(form.website_url);
    if (urlErr) newErrors.website_url = urlErr;

    if (!form.notification_email.trim()) {
      newErrors.notification_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.notification_email.trim())) {
      newErrors.notification_email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Step 1: Check existing ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch(CHECK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_email: form.notification_email.trim(),
          website_url: form.website_url.trim(),
          company_name: form.company_name.trim(),
        }),
      });

      if (!res.ok) throw new Error('Request failed');

      const data: CheckResponse[] = await res.json();
      const result = Array.isArray(data) ? data[0] : data;
      setCheckResult(result);

      if (result.is_exist) {
        setStep('override-confirm');
      } else {
        // Profile does not exist — submit directly to manual webhook
        await sendManualWebhook(result['folder-id'], result);
      }
    } catch (err) {
      console.error('Error checking client profile:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Step 2 / Override submit ── */
  const sendManualWebhook = async (folderId: string, result?: CheckResponse) => {
    const r = result ?? checkResult;
    if (!r) return;

    setIsOverriding(true);
    try {
      const res = await fetch(MANUAL_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_email: form.notification_email.trim(),
          website_url: form.website_url.trim(),
          company_name: form.company_name.trim(),
          'folder-id': folderId,
        }),
      });

      if (!res.ok) throw new Error('Request failed');

      setStep('success');
      onSuccess('Your client profile will be ready in 5-10 minutes.');
    } catch (err) {
      console.error('Error sending manual webhook:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsOverriding(false);
    }
  };

  const handleOverride = () => {
    if (!checkResult) return;
    sendManualWebhook(checkResult['folder-id']);
  };

  /* ── Reset ── */
  const handleClose = () => {
    setStep('form');
    setForm({ company_name: '', website_url: '', notification_email: '' });
    setErrors({});
    setCheckResult(null);
    onClose();
  };

  /* ────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────── */
  return (
    <Dialog
      open={isOpen}
      onClose={step === 'form' ? handleClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: modalPaperSx() }}
    >
      {/* ── HEADER ── */}
      <DialogTitle sx={modalTitleSx()} component="div">
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={modalAvatarSx()}>
              <Person sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: brand.colors.slate, lineHeight: 1.3 }}>
                Client Profile
              </Typography>
              <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 0.5 }}>
                {step === 'form' && 'Generate a detailed client profile with AI analysis'}
                {step === 'override-confirm' && 'Profile already exists'}
                {step === 'success' && 'Request submitted'}
              </Typography>
            </Box>
          </Box>
          {step === 'form' && (
            <IconButton onClick={handleClose} size="small" aria-label="Close" sx={{ color: brand.colors.iron, mt: 0.5 }}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      {/* ══════════════════════════════════════
          STEP: FORM
      ══════════════════════════════════════ */}
      {step === 'form' && (
        <>
          <DialogContent sx={{ ...modalContentSx, pt: '24px !important' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* Company Name */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: brand.colors.textSecondary, mb: 0.75, display: 'block', letterSpacing: '0.03em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Company Name
                </Typography>
                <TextField
                  fullWidth
                  hiddenLabel
                  placeholder="E2M Solutions"
                  value={form.company_name}
                  onChange={handleChange('company_name')}
                  error={!!errors.company_name}
                  helperText={errors.company_name}
                  sx={modalTextFieldSx}
                />
              </Box>

              {/* Website URL */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: brand.colors.textSecondary, letterSpacing: '0.03em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    Website URL
                  </Typography>
                  <HelpOutline
                    sx={{ fontSize: 14, color: brand.colors.textMuted, cursor: 'default' }}
                    titleAccess="Must start with https:// — e.g. https://example.com"
                  />
                </Box>
                <TextField
                  fullWidth
                  hiddenLabel
                  placeholder="https://example.com"
                  type="url"
                  value={form.website_url}
                  onChange={handleChange('website_url')}
                  onBlur={() => {
                    const err = validateHttpsUrl(form.website_url);
                    setErrors((prev) => ({ ...prev, website_url: err || undefined }));
                  }}
                  error={!!errors.website_url}
                  helperText={errors.website_url || 'Must start with https:// (e.g. https://example.com)'}
                  FormHelperTextProps={{ sx: { color: errors.website_url ? brand.colors.error : brand.colors.textMuted } }}
                  sx={modalTextFieldSx}
                />
              </Box>

              {/* Email */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: brand.colors.textSecondary, mb: 0.75, display: 'block', letterSpacing: '0.03em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Notification Email
                </Typography>
                <TextField
                  fullWidth
                  hiddenLabel
                  placeholder="you@yourcompany.com"
                  type="email"
                  value={form.notification_email}
                  onChange={handleChange('notification_email')}
                  error={!!errors.notification_email}
                  helperText={errors.notification_email}
                  sx={modalTextFieldSx}
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={modalActionsSx}>
            <Button variant="ghost" onClick={handleClose} sx={modalCancelButtonSx}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={primaryActionButtonSx}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
            >
              {isLoading ? 'Checking...' : 'Generate Profile'}
            </Button>
          </DialogActions>
        </>
      )}

      {/* ══════════════════════════════════════
          STEP: OVERRIDE CONFIRMATION
      ══════════════════════════════════════ */}
      {step === 'override-confirm' && checkResult && (
        <>
          <DialogContent sx={{ ...modalContentSx, pt: '24px !important' }}>
            {/* Warning banner */}
            <Box
              sx={{
                bgcolor: brand.colors.primarySubtle,
                border: `1.5px solid ${brand.colors.primaryLight}`,
                borderRadius: `${brand.radius}px`,
                p: 2.5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                mb: 3,
              }}
            >
              <WarningAmberRounded sx={{ color: brand.colors.primary, fontSize: 26, mt: 0.25, flexShrink: 0 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand.colors.slate, mb: 0.5, lineHeight: 1.3 }}>
                  Profile Already Exists
                </Typography>
                <Typography variant="body2" sx={{ color: brand.colors.textSecondary, lineHeight: 1.6 }}>
                  A client profile for{' '}
                  <Box component="span" sx={{ fontWeight: 700, color: brand.colors.slate }}>
                    {checkResult.company_name}
                  </Box>{' '}
                  already exists. Overriding it will regenerate the profile and replace the current version.
                </Typography>
              </Box>
            </Box>

            {/* Divider + profile info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <InfoRow label="Company" value={checkResult.company_name} />
              <InfoRow label="Website" value={checkResult.website_url} />
              <InfoRow label="Email" value={checkResult.email} />
            </Box>

            {/* View existing document button */}
            {checkResult.file_id && (
              <Box
                component="a"
                href={googleDocsUrl(checkResult.file_id)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.25,
                  mt: 2.5,
                  px: 2.5,
                  py: 1.5,
                  border: `1.5px solid ${brand.colors.primary}`,
                  borderRadius: `${brand.radius}px`,
                  bgcolor: brand.colors.primarySubtle,
                  color: brand.colors.primary,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  transition: 'background-color 0.18s ease, border-color 0.18s ease',
                  '&:hover': {
                    bgcolor: '#FDEAE3',
                    borderColor: brand.colors.primaryDark,
                    color: brand.colors.primaryDark,
                  },
                }}
              >
                <Launch sx={{ fontSize: 17 }} />
                View Existing Version
              </Box>
            )}

            <Divider sx={{ borderColor: brand.colors.mist, mt: 3 }} />

            <Typography variant="body2" sx={{ color: brand.colors.textSecondary, mt: 2, lineHeight: 1.6 }}>
              Are you sure you want to override the existing client profile? This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={modalActionsSx}>
            <Button
              variant="ghost"
              onClick={handleClose}
              sx={{ ...modalCancelButtonSx }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleOverride}
              disabled={isOverriding}
              sx={{
                ...primaryActionButtonSx,
                bgcolor: brand.colors.primary,
                '&:hover': { bgcolor: brand.colors.primaryDark },
              }}
              startIcon={isOverriding ? <CircularProgress size={18} color="inherit" /> : <WarningAmberRounded />}
            >
              {isOverriding ? 'Overriding...' : 'Override Profile'}
            </Button>
          </DialogActions>
        </>
      )}

      {/* ══════════════════════════════════════
          STEP: SUCCESS
      ══════════════════════════════════════ */}
      {step === 'success' && (
        <>
          <DialogContent sx={{ ...modalContentSx, pt: '32px !important' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 2 }}>
              {/* Branded success circle */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  bgcolor: brand.colors.primarySubtle,
                  border: `2px solid ${brand.colors.primaryLight}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <CheckCircle sx={{ fontSize: 38, color: brand.colors.primary }} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, color: brand.colors.slate, mb: 1 }}>
                Request Submitted
              </Typography>

              <Typography variant="body2" sx={{ color: brand.colors.textSecondary, maxWidth: 340, lineHeight: 1.7, mb: 3 }}>
                Your client profile for{' '}
                <Box component="span" sx={{ fontWeight: 700, color: brand.colors.slate }}>
                  {form.company_name}
                </Box>{' '}
                is being generated. You will receive the completed profile at{' '}
                <Box component="span" sx={{ fontWeight: 600, color: brand.colors.primary }}>
                  {form.notification_email}
                </Box>{' '}
                within 5–10 minutes.
              </Typography>

              {/* Timeline indicator */}
              <Box
                sx={{
                  width: '100%',
                  bgcolor: brand.colors.smoke,
                  border: `1px solid ${brand.colors.mist}`,
                  borderRadius: `${brand.radius}px`,
                  px: 2.5,
                  py: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <TimelineRow label="Profile generation" detail="5–10 minutes" />
                <TimelineRow label="Delivery method" detail={`Email to ${form.notification_email}`} />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={modalActionsSx}>
            <Button
              variant="primary"
              onClick={handleClose}
              sx={{ ...primaryActionButtonSx, flex: 1 }}
            >
              Done
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
    <Typography
      variant="caption"
      sx={{ color: brand.colors.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.7rem', minWidth: 70, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ color: brand.colors.textPrimary, fontWeight: 500, wordBreak: 'break-all' }}>
      {value}
    </Typography>
  </Box>
);

const TimelineRow = ({ label, detail }: { label: string; detail: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
    <Typography variant="caption" sx={{ color: brand.colors.textSecondary, fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant="caption" sx={{ color: brand.colors.primary, fontWeight: 700 }}>
      {detail}
    </Typography>
  </Box>
);
