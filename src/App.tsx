import { useState, useEffect } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';

import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { GradientBackground } from './components/GradientBackground';

import { Dashboard } from './pages/Dashboard';
import { SkillAssessment } from './pages/SkillAssessment';
import { Resources } from './pages/Resources';
import { PlacementPreparation } from './pages/PlacementPreparation';
import { JobPortals } from './pages/JobPortals';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { MockInterview } from './pages/MockInterview';

import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/landing';

const pageTitle: Record<string, string> = {
  dashboard: 'Dashboard',
  assessment: 'Skill Assessment',
  resources: 'Resources',
  placement: 'Placement Preparation',
  jobs: 'Job Portals',
  resume: 'Resume Analyzer',
  interview: 'Mock Interview',
};

function App() {
  // 🔐 AUTH STATE (SAFE)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authPage, setAuthPage] = useState<'landing' | 'login' | 'register' | 'app'>('landing');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // EXISTING STATE
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ CHECK LOGIN ONCE (NO FLICKER)
  useEffect(() => {
    const stored = localStorage.getItem('ml_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
        setIsAuthenticated(true);
        // Keep authPage as 'landing' so landing page always shows first
        // User can click "Continue to Dashboard" if they want to access the app
      } catch {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // ✅ CALLED ONLY AFTER SUCCESSFUL LOGIN
  const handleAuthSuccess = (user: any) => {
    localStorage.setItem('ml_user', JSON.stringify(user));
    setIsAuthenticated(true);
    setCurrentUser(user);
    setCurrentPage('dashboard');
    setAuthPage('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('ml_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthPage('landing');
  };

  // ⏳ PREVENT FLASH
  if (isAuthenticated === null) {
    return null;
  }

  // ✅ ALWAYS SHOW LANDING FIRST (even if a session exists)
  if (authPage === 'landing') {
    return (
      <Landing
        isAuthenticated={!!isAuthenticated}
        onLogin={() => setAuthPage('login')}
        onRegister={() => setAuthPage('register')}
        onContinue={() => (isAuthenticated ? setAuthPage('app') : setAuthPage('login'))}
        onLogout={handleLogout}
      />
    );
  }

  // 🔐 AUTH SCREENS
  if (!isAuthenticated) {
    return authPage === 'login' ? (
      <Login onSuccess={handleAuthSuccess} onSwitch={() => setAuthPage('register')} />
    ) : (
      <Register onSuccess={handleAuthSuccess} onSwitch={() => setAuthPage('login')} />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'assessment':
        return <SkillAssessment />;
      case 'resources':
        return <Resources />;
      case 'placement':
        return <PlacementPreparation />;
      case 'jobs':
        return <JobPortals />;
      case 'resume':
        return <ResumeAnalyzer />;
      case 'interview':
        return <MockInterview />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <GradientBackground />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: 'calc(100% - 260px)' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={pageTitle[currentPage]}
          user={currentUser}
          onLogout={handleLogout}
          onProfile={() => setProfileOpen(true)}
        />

        <Box
          sx={{
            flexGrow: 1,
            mt: '64px',
            p: { xs: 2, sm: 3, md: 4 },
            overflowY: 'auto',
            width: '100%',
          }}
        >
          {renderPage()}
        </Box>

        {/* Simple profile dialog */}
        <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>My Profile</DialogTitle>
          <DialogContent dividers>
            {currentUser ? (
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  These details are stored locally in your browser.
                </Typography>
                <TextField
                  label="Name"
                  value={currentUser.name || ''}
                  size="small"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={currentUser.email || ''}
                  size="small"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Stack>
            ) : (
              <Typography variant="body2">No profile data available.</Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}

export default App;
