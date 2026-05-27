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
  Checkbox,
  FormControlLabel,
  Grid,
  Alert,
  Chip,
  Snackbar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Close,
  BarChart,
  CheckCircle,
  Assignment,
  Add,
  Delete,
  HelpOutline,
  WarningAmberRounded,
  Launch,
} from '@mui/icons-material';
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
  accentActionButtonSx,
  primaryActionButtonSx,
} from '../utils/brandStyles';
import { OrangeGearLoader } from './OrangeGearLoader';

/* ─────────────────────────────────────────────
   Webhook constants
───────────────────────────────────────────── */
const CHECK_WEBHOOK =
  'https://leadgear.app.n8n.cloud/webhook/competitor-analysis-check-existing';
const SUGGEST_WEBHOOK =
  'https://leadgear.app.n8n.cloud/webhook/competitor-analysis-suggested-competitors';
const TRIGGER_WEBHOOK =
  'https://leadgear.app.n8n.cloud/webhook/competitor-analysis-trigger';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
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

interface CheckResponse {
  'folder-id': string;
  is_exist: boolean;
  file_id?: string;
  website_url: string;
  email: string;
  company_name: string;
}

interface Competitor {
  competitor_name: string;
  rationale: string;
  website_url?: string;
  location?: string;
  problem_solved?: string;
}

interface SuggestedCompetitors {
  geographic_local_based: Competitor[];
  use_case_problem_based: Competitor[];
  customer_segment_based: Competitor[];
  product_service_based: Competitor[];
  price_positioning_based: Competitor[];
}

// Selected competitor carries name + url for the final payload
interface SelectedCompetitor {
  competitor_name: string;
  competitor_url: string;
}

type ModalStep =
  | 'form'
  | 'override-confirm'
  | 'select-competitors'
  | 'success';

const MAX_COMPETITORS = 5;
const success = brand.colors.success;

/* ─────────────────────────────────────────────
   https-only URL validation
───────────────────────────────────────────── */
function validateHttpsUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return 'Website URL is required';
  if (!trimmed.startsWith('https://'))
    return 'URL must begin with https:// (e.g. https://example.com)';
  if (trimmed.includes(' ')) return 'URL must not contain spaces';
  const protocolMatches = trimmed.match(/https?:\/\//gi);
  if (protocolMatches && protocolMatches.length > 1)
    return 'Please enter only one URL';
  try {
    const url = new URL(trimmed);
    if (!url.hostname) return 'Please enter a valid URL (e.g. https://example.com)';
    return '';
  } catch {
    return 'Please enter a valid URL (e.g. https://example.com)';
  }
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export const CompetitorAnalysisModal = ({ isOpen, onClose, onSuccess }: Props) => {
  /* ── Form state ── */
  const [step, setStep] = useState<ModalStep>('form');
  const [form, setForm] = useState<FormState>({
    company_name: '',
    website_url: '',
    notification_email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  /* ── Check-existing state ── */
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResponse | null>(null);
  const [isOverriding, setIsOverriding] = useState(false);

  /* ── Competitors state ── */
  const [isFetchingCompetitors, setIsFetchingCompetitors] = useState(false);
  const [suggestedCompetitors, setSuggestedCompetitors] =
    useState<SuggestedCompetitors>({
      geographic_local_based: [],
      use_case_problem_based: [],
      customer_segment_based: [],
      product_service_based: [],
      price_positioning_based: [],
    });
  const [selectedCompetitors, setSelectedCompetitors] = useState<
    SelectedCompetitor[]
  >([]);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customUrlError, setCustomUrlError] = useState('');
  const [customUrlName, setCustomUrlName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  /* ── Toast ── */
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  /* ── Reset on open ── */
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setForm({ company_name: '', website_url: '', notification_email: '' });
      setErrors({});
      setCheckResult(null);
      setIsChecking(false);
      setIsOverriding(false);
      setIsFetchingCompetitors(false);
      setSuggestedCompetitors({
        geographic_local_based: [],
        use_case_problem_based: [],
        customer_segment_based: [],
        product_service_based: [],
        price_positioning_based: [],
      });
      setSelectedCompetitors([]);
      setCustomUrlInput('');
      setCustomUrlError('');
      setCustomUrlName('');
      setIsSubmitting(false);
      setLoadingMessage('');
      setToast({ show: false, message: '', type: 'info' });
    }
  }, [isOpen]);

  /* ─────────────────────────────────────────────
     Helpers
  ───────────────────────────────────────────── */
  const showToast = (message: string, type: 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3500);
  };

  const googleDocsUrl = (fileId: string) =>
    `https://docs.google.com/document/d/${fileId}/edit`;

  const totalCount = selectedCompetitors.length;

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.company_name.trim())
      newErrors.company_name = 'Company name is required';
    const urlErr = validateHttpsUrl(form.website_url);
    if (urlErr) newErrors.website_url = urlErr;
    if (!form.notification_email.trim()) {
      newErrors.notification_email = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.notification_email.trim())
    ) {
      newErrors.notification_email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => onClose();

  /* ─────────────────────────────────────────────
     Step 1 — Check existing
  ───────────────────────────────────────────── */
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsChecking(true);
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
      if (!res.ok) throw new Error('Check failed');
      const data: CheckResponse[] = await res.json();
      const result = Array.isArray(data) ? data[0] : data;
      setCheckResult(result);

      if (result.is_exist) {
        setStep('override-confirm');
      } else {
        await fetchSuggestedCompetitors(result);
      }
    } catch (err) {
      console.error('Check-existing error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsChecking(false);
    }
  };

  /* ─────────────────────────────────────────────
     Fetch suggested competitors
  ───────────────────────────────────────────── */
  const fetchSuggestedCompetitors = async (result: CheckResponse) => {
    setIsFetchingCompetitors(true);
    setLoadingMessage('Fetching suggested competitors...');
    try {
      const res = await fetch(SUGGEST_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_email: form.notification_email.trim(),
          website_url: result.website_url || form.website_url.trim(),
          company_name: form.company_name.trim(),
        }),
      });
      if (!res.ok) throw new Error('Suggest failed');
      const raw = await res.json();
      const data = Array.isArray(raw) ? raw[0] : raw;
      const sg: SuggestedCompetitors =
        data?.suggested_competitors || data?.output?.suggested_competitors || data?.output || data;

      setSuggestedCompetitors({
        geographic_local_based: sg?.geographic_local_based ?? [],
        use_case_problem_based: sg?.use_case_problem_based ?? [],
        customer_segment_based: sg?.customer_segment_based ?? [],
        product_service_based: sg?.product_service_based ?? [],
        price_positioning_based: sg?.price_positioning_based ?? [],
      });
      setStep('select-competitors');
    } catch (err) {
      console.error('Suggest-competitors error:', err);
      showToast('Failed to fetch suggested competitors. Please try again.', 'error');
    } finally {
      setIsFetchingCompetitors(false);
      setLoadingMessage('');
    }
  };

  /* ─────────────────────────────────────────────
     Override flow
  ───────────────────────────────────────────── */
  const handleOverride = async () => {
    if (!checkResult) return;
    setIsOverriding(true);
    try {
      // Re-use same check result — now proceed to fetch competitors
      await fetchSuggestedCompetitors(checkResult);
    } finally {
      setIsOverriding(false);
    }
  };

  /* ─────────────────────────────────────────────
     Competitor selection
  ───────────────────────────────────────────── */
  const handleCompetitorToggle = (competitor: Competitor) => {
    setSelectedCompetitors((prev) => {
      const exists = prev.some(
        (c) => c.competitor_name === competitor.competitor_name
      );
      if (exists)
        return prev.filter(
          (c) => c.competitor_name !== competitor.competitor_name
        );
      if (prev.length >= MAX_COMPETITORS) {
        showToast(`Maximum ${MAX_COMPETITORS} competitors allowed`, 'error');
        return prev;
      }
      return [
        ...prev,
        {
          competitor_name: competitor.competitor_name,
          competitor_url: competitor.website_url ?? '',
        },
      ];
    });
  };

  const normalizeUrl = (url: string) =>
    url.trim().toLowerCase().replace(/\/+$/, '');

  const handleAddCustomUrl = () => {
    const url = customUrlInput.trim();
    const name = customUrlName.trim();
    if (!url) {
      setCustomUrlError('Enter a URL to add');
      return;
    }
    const err = validateHttpsUrl(url);
    if (err) {
      setCustomUrlError(err);
      showToast(err, 'error');
      return;
    }
    if (
      selectedCompetitors.some(
        (c) => normalizeUrl(c.competitor_url) === normalizeUrl(url)
      )
    ) {
      setCustomUrlError('This URL is already added');
      showToast('This competitor URL is already added', 'error');
      return;
    }
    if (
      form.website_url.trim() &&
      normalizeUrl(form.website_url) === normalizeUrl(url)
    ) {
      setCustomUrlError('Cannot add your own website as a competitor');
      return;
    }
    if (totalCount >= MAX_COMPETITORS) {
      showToast(`Maximum ${MAX_COMPETITORS} competitors allowed`, 'error');
      return;
    }
    setSelectedCompetitors((prev) => [
      ...prev,
      {
        competitor_name: name || url,
        competitor_url: url,
      },
    ]);
    setCustomUrlInput('');
    setCustomUrlName('');
    setCustomUrlError('');
  };

  const handleRemoveSelected = (name: string) => {
    setSelectedCompetitors((prev) =>
      prev.filter((c) => c.competitor_name !== name)
    );
  };

  /* ─────────────────────────────────────────────
     Final submit
  ───────────────────────────────────────────── */
  const handleFinalSubmit = async () => {
    if (totalCount === 0) {
      showToast(
        'Please select at least one competitor from the list or add a URL',
        'error'
      );
      return;
    }
    if (!checkResult) return;

    setIsSubmitting(true);
    setLoadingMessage(
      'Generating competitor analysis for your selection. Please wait...'
    );
    try {
      const res = await fetch(TRIGGER_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitors: selectedCompetitors.map((c) => ({
            competitor_name: c.competitor_name,
            competitor_url: c.competitor_url,
          })),
          competitor_urls: selectedCompetitors.map((c) => c.competitor_url),
          email: form.notification_email.trim(),
          website: form.website_url.trim(),
          'folder-id': checkResult['folder-id'],
        }),
      });
      if (!res.ok) throw new Error('Trigger failed');
      setStep('success');
      onSuccess(
        'Competitor analysis is being generated. You will receive the report at your email within 5-10 minutes.'
      );
    } catch (err) {
      console.error('Trigger error:', err);
      showToast('Failed to submit. Please try again.', 'error');
      setLoadingMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────────────────────────
     Render helpers
  ───────────────────────────────────────────── */
  const renderCompetitorCard = (competitor: Competitor) => {
    const isSelected = selectedCompetitors.some(
      (c) => c.competitor_name === competitor.competitor_name
    );
    const atLimit = totalCount >= MAX_COMPETITORS;
    const canSelect = isSelected || !atLimit;

    return (
      <Box
        key={competitor.competitor_name}
        sx={{
          p: 2,
          borderRadius: 2,
          border: '2px solid',
          borderColor: isSelected ? brand.colors.primary : 'divider',
          bgcolor: isSelected ? brand.colors.primarySubtle : 'background.paper',
          cursor: canSelect ? 'pointer' : 'not-allowed',
          opacity: canSelect ? 1 : 0.65,
          transition: 'all 0.2s ease',
          boxShadow: isSelected ? brand.shadow.raised : 'none',
          '&:hover': canSelect
            ? {
                borderColor: brand.colors.primary,
                bgcolor: isSelected
                  ? brand.colors.primarySubtle
                  : brand.colors.headerWarm,
                boxShadow: brand.shadow.raised,
                transform: 'translateY(-2px)',
              }
            : {},
        }}
        onClick={() =>
          canSelect && !isSubmitting && handleCompetitorToggle(competitor)
        }
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={isSelected}
              disabled={isSubmitting || (!isSelected && atLimit)}
              sx={{
                color: isSelected ? brand.colors.primary : 'text.secondary',
                '&.Mui-checked': { color: brand.colors.primary },
                '& .MuiSvgIcon-root': { fontSize: 22 },
              }}
            />
          }
          label={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.25 }}>
                {competitor.competitor_name}
              </Typography>
              {(competitor.location ?? competitor.problem_solved) && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 0.25,
                    color: brand.colors.primary,
                    fontWeight: 600,
                  }}
                >
                  {competitor.location ?? competitor.problem_solved}
                </Typography>
              )}
              {competitor.website_url && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 0.5,
                    color: brand.colors.textMuted,
                    fontSize: '0.7rem',
                  }}
                >
                  {competitor.website_url}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {competitor.rationale}
              </Typography>
            </Box>
          }
          sx={{ m: 0, alignItems: 'flex-start' }}
        />
      </Box>
    );
  };

  const renderCategory = (title: string, competitors: Competitor[]) => {
    if (!competitors || competitors.length === 0) return null;
    return (
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{ borderLeft: `4px solid ${brand.colors.primary}`, pl: 2, mb: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {competitors.length} competitor{competitors.length > 1 ? 's' : ''}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {competitors.map((c) => (
            <Grid item xs={12} md={6} lg={4} key={c.competitor_name}>
              {renderCompetitorCard(c)}
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  /* ─────────────────────────────────────────────
     Shared modal header
  ───────────────────────────────────────────── */
  const headerSubtitle: Record<ModalStep, string> = {
    form: 'Analyze competitor strategies with AI insights',
    'override-confirm': 'Analysis already exists',
    'select-competitors': 'Choose up to 5 competitors to analyze',
    success: 'Request submitted',
  };

  const sharedHeader = (showClose = true) => (
    <DialogTitle sx={modalTitleSx()} component="div">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              ...modalAvatarSx(brand.colors.primary),
              width: 56,
              height: 56,
            }}
          >
            <BarChart sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: brand.colors.slate, lineHeight: 1.3 }}
            >
              Competitor Analysis
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: brand.colors.textSecondary, mt: 0.5 }}
            >
              {headerSubtitle[step]}
            </Typography>
          </Box>
        </Box>
        {showClose && (
          <IconButton
            onClick={handleClose}
            size="small"
            aria-label="Close"
            sx={{ color: brand.colors.iron, mt: 0.5 }}
          >
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>
    </DialogTitle>
  );

  /* ══════════════════════════════════════════════
     SELECT-COMPETITORS SCREEN (full-width dialog)
  ══════════════════════════════════════════════ */
  if (step === 'select-competitors') {
    return (
      <>
        <Dialog
          open={isOpen}
          onClose={handleClose}
          maxWidth="xl"
          fullWidth
          PaperProps={{ sx: modalPaperSx() }}
        >
          <DialogTitle sx={modalTitleSx()} component="div">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    ...modalAvatarSx(brand.colors.primary),
                    width: 56,
                    height: 56,
                  }}
                >
                  <Assignment sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: brand.colors.slate,
                      lineHeight: 1.3,
                    }}
                  >
                    Select Competitors
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: brand.colors.textSecondary, mt: 0.5 }}
                  >
                    Choose up to {MAX_COMPETITORS} competitors to analyze
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={handleClose} size="small" aria-label="Close">
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent
            dividers
            className="custom-scrollbar"
            sx={{ maxHeight: '70vh', overflowY: 'auto', ...modalContentSx }}
          >
            {loadingMessage && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: brand.colors.primarySubtle,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: brand.colors.primaryLight,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <OrangeGearLoader size={24} />
                  <Typography variant="body2">{loadingMessage}</Typography>
                </Box>
              </Box>
            )}

            {renderCategory(
              'Geographic / Local Based',
              suggestedCompetitors.geographic_local_based
            )}
            {renderCategory(
              'Use Case / Problem Based',
              suggestedCompetitors.use_case_problem_based
            )}
            {renderCategory(
              'Customer Segment Based',
              suggestedCompetitors.customer_segment_based
            )}
            {renderCategory(
              'Product & Service Based',
              suggestedCompetitors.product_service_based
            )}
            {renderCategory(
              'Price Positioning Based',
              suggestedCompetitors.price_positioning_based
            )}

            {/* ── Add custom competitor ── */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: brand.colors.textSecondary }}
                >
                  Add a competitor manually (counts toward total of {MAX_COMPETITORS})
                </Typography>
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Manual entry
                      </Typography>
                      <Typography variant="caption" component="div">
                        Enter the competitor's website URL starting with https:// and
                        optionally a name. The URL must be their live public site.
                      </Typography>
                    </Box>
                  }
                  placement="top"
                  arrow
                >
                  <IconButton size="small" sx={{ color: 'text.secondary', p: 0.25 }}>
                    <HelpOutline sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box
                sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap' }}
              >
                <TextField
                  size="small"
                  label="Competitor Name (optional)"
                  value={customUrlName}
                  onChange={(e) => setCustomUrlName(e.target.value)}
                  placeholder="Acme Corp"
                  disabled={isSubmitting || totalCount >= MAX_COMPETITORS}
                  sx={{ flex: '1 1 200px', minWidth: 160 }}
                />
                <TextField
                  size="small"
                  label="Competitor URL"
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => {
                    setCustomUrlInput(e.target.value);
                    if (customUrlError) setCustomUrlError('');
                  }}
                  onBlur={() => {
                    const t = customUrlInput.trim();
                    setCustomUrlError(t ? validateHttpsUrl(t) : '');
                  }}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddCustomUrl())
                  }
                  placeholder="https://competitor.com"
                  error={!!customUrlError}
                  helperText={customUrlError}
                  disabled={isSubmitting || totalCount >= MAX_COMPETITORS}
                  sx={{ flex: '1 1 280px', minWidth: 200 }}
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddCustomUrl}
                  disabled={
                    isSubmitting ||
                    totalCount >= MAX_COMPETITORS ||
                    !customUrlInput.trim()
                  }
                  startIcon={<Add />}
                  sx={{ mt: 0.5, flexShrink: 0 }}
                >
                  Add
                </Button>
              </Box>
            </Box>

            {/* ── Selected summary ── */}
            {totalCount > 0 && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: brand.colors.primarySubtle,
                  borderRadius: 2,
                  border: `2px solid ${brand.colors.primary}`,
                  boxShadow: brand.shadow.raised,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: brand.colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        <Typography
                          component="span"
                          sx={{ color: brand.colors.primary, fontSize: '1.1rem' }}
                        >
                          {totalCount}
                        </Typography>{' '}
                        / {MAX_COMPETITORS} competitor{totalCount !== 1 ? 's' : ''} selected
                      </Typography>
                    </Box>
                  </Box>
                  {totalCount >= MAX_COMPETITORS && (
                    <Chip
                      label="Maximum reached"
                      size="small"
                      sx={{
                        bgcolor: brand.colors.primary,
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>

                {/* Selected list */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {selectedCompetitors.map((c) => (
                    <Box
                      key={c.competitor_name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 0.75,
                        px: 1.5,
                        borderRadius: 1,
                        bgcolor: '#fff',
                        border: `1px solid ${brand.colors.mist}`,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: brand.colors.slate }}
                          noWrap
                        >
                          {c.competitor_name}
                        </Typography>
                        {c.competitor_url && (
                          <Typography
                            variant="caption"
                            sx={{ color: brand.colors.textMuted, fontSize: '0.7rem' }}
                            noWrap
                          >
                            {c.competitor_url}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveSelected(c.competitor_name)}
                        disabled={isSubmitting}
                        sx={{ color: brand.colors.iron }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={modalActionsSx}>
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              sx={modalCancelButtonSx}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleFinalSubmit}
              disabled={isSubmitting || totalCount === 0}
              sx={{ flex: 1, ...accentActionButtonSx(brand.colors.primary) }}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckCircle />
                )
              }
            >
              {isSubmitting ? 'Submitting...' : 'Submit Selection'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={toast.show}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={3500}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
          sx={{ top: '24px !important', right: '24px !important' }}
        >
          <Alert
            severity={toast.type === 'error' ? 'error' : 'info'}
            onClose={() => setToast({ show: false, message: '', type: 'info' })}
            sx={{
              width: '100%',
              minWidth: 300,
              bgcolor:
                toast.type === 'error'
                  ? `${brand.colors.error}14`
                  : `${brand.colors.primary}14`,
              color:
                toast.type === 'error' ? brand.colors.error : brand.colors.primary,
              border: `1px solid ${
                toast.type === 'error' ? brand.colors.error : brand.colors.primary
              }`,
              '& .MuiAlert-icon': {
                color:
                  toast.type === 'error' ? brand.colors.error : brand.colors.primary,
              },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  /* ══════════════════════════════════════════════
     MAIN sm DIALOG (form / override / success)
  ══════════════════════════════════════════════ */
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={step === 'form' ? handleClose : undefined}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: modalPaperSx() }}
      >
        {sharedHeader(step === 'form')}

        {/* ── FORM ── */}
        {step === 'form' && (
          <>
            <DialogContent sx={{ ...modalContentSx, pt: '24px !important' }}>
              <Box
                component="form"
                onSubmit={handleSubmitForm}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
              >
                {/* Company Name */}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: brand.colors.textSecondary,
                      mb: 0.75,
                      display: 'block',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                    }}
                  >
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
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: brand.colors.textSecondary,
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                      }}
                    >
                      Website URL
                    </Typography>
                    <HelpOutline
                      sx={{ fontSize: 14, color: brand.colors.textMuted }}
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
                      setErrors((prev) => ({
                        ...prev,
                        website_url: err || undefined,
                      }));
                    }}
                    error={!!errors.website_url}
                    helperText={
                      errors.website_url ||
                      'Must start with https:// (e.g. https://example.com)'
                    }
                    FormHelperTextProps={{
                      sx: {
                        color: errors.website_url
                          ? brand.colors.error
                          : brand.colors.textMuted,
                      },
                    }}
                    sx={modalTextFieldSx}
                  />
                </Box>

                {/* Email */}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: brand.colors.textSecondary,
                      mb: 0.75,
                      display: 'block',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                    }}
                  >
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
                onClick={handleSubmitForm}
                disabled={isChecking || isFetchingCompetitors}
                sx={primaryActionButtonSx}
                startIcon={
                  isChecking || isFetchingCompetitors ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <BarChart />
                  )
                }
              >
                {isChecking
                  ? 'Checking...'
                  : isFetchingCompetitors
                  ? 'Fetching Competitors...'
                  : 'Analyze Competitors'}
              </Button>
            </DialogActions>
          </>
        )}

        {/* ── OVERRIDE CONFIRMATION ── */}
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
                <WarningAmberRounded
                  sx={{
                    color: brand.colors.primary,
                    fontSize: 26,
                    mt: 0.25,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: brand.colors.slate,
                      mb: 0.5,
                      lineHeight: 1.3,
                    }}
                  >
                    Analysis Already Exists
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: brand.colors.textSecondary, lineHeight: 1.6 }}
                  >
                    A competitor analysis for{' '}
                    <Box
                      component="span"
                      sx={{ fontWeight: 700, color: brand.colors.slate }}
                    >
                      {checkResult.company_name}
                    </Box>{' '}
                    already exists. Proceeding will regenerate the analysis and
                    replace the current version.
                  </Typography>
                </Box>
              </Box>

              {/* Info rows */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <InfoRow label="Company" value={checkResult.company_name} />
                <InfoRow label="Website" value={checkResult.website_url} />
                <InfoRow label="Email" value={checkResult.email} />
              </Box>

              {/* View existing doc button */}
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
              <Typography
                variant="body2"
                sx={{ color: brand.colors.textSecondary, mt: 2, lineHeight: 1.6 }}
              >
                Are you sure you want to proceed and select new competitors? The
                existing analysis will be overridden.
              </Typography>
            </DialogContent>

            <DialogActions sx={modalActionsSx}>
              <Button
                variant="ghost"
                onClick={handleClose}
                sx={modalCancelButtonSx}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleOverride}
                disabled={isOverriding || isFetchingCompetitors}
                sx={{
                  ...primaryActionButtonSx,
                  bgcolor: brand.colors.primary,
                  '&:hover': { bgcolor: brand.colors.primaryDark },
                }}
                startIcon={
                  isOverriding || isFetchingCompetitors ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <WarningAmberRounded />
                  )
                }
              >
                {isOverriding || isFetchingCompetitors
                  ? 'Loading Competitors...'
                  : 'Proceed and Select Competitors'}
              </Button>
            </DialogActions>
          </>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <>
            <DialogContent sx={{ ...modalContentSx, pt: '32px !important' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  py: 2,
                }}
              >
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

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: brand.colors.slate, mb: 1 }}
                >
                  Request Submitted
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: brand.colors.textSecondary,
                    maxWidth: 340,
                    lineHeight: 1.7,
                    mb: 3,
                  }}
                >
                  Your competitor analysis for{' '}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: brand.colors.slate }}
                  >
                    {form.company_name}
                  </Box>{' '}
                  is being generated. You will receive the completed report at{' '}
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: brand.colors.primary }}
                  >
                    {form.notification_email}
                  </Box>{' '}
                  within 5-10 minutes.
                </Typography>

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
                  <TimelineRow label="Analysis generation" detail="5-10 minutes" />
                  <TimelineRow
                    label="Delivery method"
                    detail={`Email to ${form.notification_email}`}
                  />
                  <TimelineRow
                    label="Competitors analyzed"
                    detail={`${totalCount || selectedCompetitors.length} selected`}
                  />
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

      {/* Toast for non-selection screens */}
      <Snackbar
        open={toast.show}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3500}
        onClose={() => setToast({ show: false, message: '', type: 'info' })}
        sx={{ top: '24px !important', right: '24px !important' }}
      >
        <Alert
          severity={toast.type === 'error' ? 'error' : 'info'}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
          sx={{
            width: '100%',
            minWidth: 300,
            bgcolor:
              toast.type === 'error'
                ? `${brand.colors.error}14`
                : `${brand.colors.primary}14`,
            color:
              toast.type === 'error' ? brand.colors.error : brand.colors.primary,
            border: `1px solid ${
              toast.type === 'error' ? brand.colors.error : brand.colors.primary
            }`,
            '& .MuiAlert-icon': {
              color:
                toast.type === 'error'
                  ? brand.colors.error
                  : brand.colors.primary,
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
    <Typography
      variant="caption"
      sx={{
        color: brand.colors.textMuted,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        fontSize: '0.7rem',
        minWidth: 70,
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: brand.colors.textPrimary, fontWeight: 500, wordBreak: 'break-all' }}
    >
      {value}
    </Typography>
  </Box>
);

const TimelineRow = ({ label, detail }: { label: string; detail: string }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 1,
    }}
  >
    <Typography variant="caption" sx={{ color: brand.colors.textSecondary, fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant="caption" sx={{ color: brand.colors.primary, fontWeight: 700 }}>
      {detail}
    </Typography>
  </Box>
);
