import { useState, useMemo, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Grid,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon, Search } from '@mui/icons-material';
import { Category, Automation } from './types';
import { AUTOMATIONS, LOGO_URL } from './constants';
import { AutomationCard } from './components/AutomationCard';
import { ClientProfileModal } from './components/ClientProfileModal';
import { CompetitorAnalysisModal } from './components/CompetitorAnalysisModal';
import { AutomationDetailsModal } from './components/AutomationDetailsModal';
import { SidebarItem } from './components/SidebarItem';
import { ProfileBar } from './components/ProfileBar';
import { IntroOverlay } from './components/IntroOverlay';
import { theme } from './theme';

const drawerWidth = 288;

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  const [clientProfileModalOpen, setClientProfileModalOpen] = useState(false);
  const [competitorAnalysisModalOpen, setCompetitorAnalysisModalOpen] = useState(false);
  const [detailsModalAutomation, setDetailsModalAutomation] = useState<Automation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('lg'));

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(
    () =>
      AUTOMATIONS.filter(item => {
        const catMatch = activeCategory === Category.ALL || item.category === activeCategory;
        const searchLower = searchQuery.toLowerCase();
        const searchMatch =
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower);
        return catMatch && searchMatch;
      }),
    [activeCategory, searchQuery]
  );

  const handleAutomationClick = (automation: Automation) => {
    if (automation.id === 'client-profile') {
      setClientProfileModalOpen(true);
    } else if (automation.id === 'competitor-analysis') {
      setCompetitorAnalysisModalOpen(true);
    } else if (automation.detailsOnly) {
      setDetailsModalAutomation(automation);
    } else if (automation.externalLink) {
      window.open(automation.externalLink, '_blank');
    }
  };

  const handleSuccess = (message: string) => {
    setToast({ show: true, msg: message });
    setTimeout(() => setToast({ show: false, msg: '' }), 5000);
  };

  const drawerContent = (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 6 }}>
        <Box component="img" src={LOGO_URL} alt="Leadgear" sx={{ height: 36, objectFit: 'contain' }} />
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '10px',
            fontWeight: 800,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            mb: 3,
            px: 1,
            display: 'block',
          }}
        >
          Main Menu
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <SidebarItem
            active={activeCategory === Category.ALL}
            label="All Flows"
            icon="lightning"
            onClick={() => {
              setActiveCategory(Category.ALL);
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            active={activeCategory === Category.MARKETING}
            label="Marketing"
            icon="megaphone"
            onClick={() => {
              setActiveCategory(Category.MARKETING);
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            active={activeCategory === Category.AI_TOOLS}
            label="AI Agents"
            icon="cpu"
            onClick={() => {
              setActiveCategory(Category.AI_TOOLS);
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            active={activeCategory === Category.SALES}
            label="Sales"
            icon="briefcase"
            onClick={() => {
              setActiveCategory(Category.SALES);
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            active={activeCategory === Category.DATA}
            label="Analytics"
            icon="trending"
            onClick={() => {
              setActiveCategory(Category.DATA);
              setSidebarOpen(false);
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 'auto', pt: 3 }}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Chip
            label="PRO"
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: '9px',
              fontWeight: 800,
              height: 32,
              width: 32,
            }}
          />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
              Leadgear Pro
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary', display: 'block' }}>
              Enterprise Access
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IntroOverlay isVisible={showIntro} />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? sidebarOpen : true}
          onClose={() => setSidebarOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <AppBar
            position="sticky"
            sx={{
              bgcolor: 'background.default',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
            }}
          >
            <Toolbar sx={{ px: { xs: 2, sm: 5 }, gap: 2 }}>
              <IconButton
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ display: { lg: 'none' }, color: 'text.secondary' }}
              >
                <MenuIcon />
              </IconButton>
              <TextField
                fullWidth
                placeholder="Search automated systems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: 600,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'background.paper',
                    },
                  },
                }}
              />
              <Box sx={{ ml: 'auto' }}>
                <ProfileBar />
              </Box>
            </Toolbar>
          </AppBar>

          <Box className="custom-scrollbar" sx={{ p: { xs: 3, lg: 5 }, flexGrow: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                Leadgear System Control
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600 }}>
                Launch pre-configured automation sequences to accelerate growth and operational efficiency.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {filtered.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <AutomationCard automation={item} onClick={() => handleAutomationClick(item)} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={toast.show}
        autoHideDuration={5000}
        onClose={() => setToast({ show: false, msg: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {toast.msg}
        </Alert>
      </Snackbar>

      <ClientProfileModal
        isOpen={clientProfileModalOpen}
        onClose={() => setClientProfileModalOpen(false)}
        onSuccess={handleSuccess}
      />
      <CompetitorAnalysisModal
        isOpen={competitorAnalysisModalOpen}
        onClose={() => setCompetitorAnalysisModalOpen(false)}
        onSuccess={handleSuccess}
      />
      <AutomationDetailsModal
        isOpen={!!detailsModalAutomation}
        onClose={() => setDetailsModalAutomation(null)}
        automation={detailsModalAutomation}
      />
    </ThemeProvider>
  );
};

export default App;
