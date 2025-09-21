import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Settings,
  Home,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../AppContext';
import { useThemeMode } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';
import NotificationDropdown from './NotificationDropdown';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { role } = useAppContext();
  const { mode, toggleTheme } = useThemeMode();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs: Array<{ label: string; path: string; icon?: React.ReactElement }> = [
      { label: 'Home', path: '/', icon: <Home fontSize="small" /> }
    ];

    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      
      if (index === 0) {
        breadcrumbs.push({
          label: name === 'admin' ? 'Administrator' : name === 'vendor' ? 'Vendor Portal' : name,
          path: currentPath,
        });
      } else {
        const labelMap: Record<string, string> = {
          dashboard: 'Dashboard',
          log: 'Log Consumption',
          reports: 'Reports & Analytics',
          prices: 'Price Management',
          invoice: 'Generate Invoice',
        };
        
        breadcrumbs.push({
          label: labelMap[name] || name.charAt(0).toUpperCase() + name.slice(1),
          path: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const currentTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  const roleInfo = {
    admin: {
      name: 'John Smith',
      title: 'System Administrator',
      avatar: 'JS',
      color: '#005A9C'
    },
    vendor: {
      name: 'ABC Supplies',
      title: 'Vendor Partner',
      avatar: 'AS',
      color: '#007BFF'
    }
  };

  const currentRole = roleInfo[role!];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} role={role!} />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: { xs: '100%', md: sidebarOpen ? 'calc(100% - 280px)' : '100%' },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Top AppBar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            backgroundColor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: 'text.primary',
            zIndex: theme.zIndex.drawer - 1,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleSidebarToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Page Title and Breadcrumbs */}
              <Box>
                <Typography 
                  variant="h6" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                  }}
                >
                  {currentTitle}
                </Typography>
                
                {/* Breadcrumbs for larger screens */}
                {!isMobile && breadcrumbs.length > 1 && (
                  <Breadcrumbs 
                    aria-label="breadcrumb" 
                    sx={{ mt: 0.5 }}
                    separator="›"
                  >
                    {breadcrumbs.slice(0, -1).map((crumb) => (
                      <Link
                        key={crumb.path}
                        color="text.secondary"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (crumb.path !== '/') navigate(crumb.path);
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {crumb.icon && crumb.icon}
                        {crumb.label}
                      </Link>
                    ))}
                    <Typography 
                      color="text.primary" 
                      sx={{ 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      {breadcrumbs[breadcrumbs.length - 1].label}
                    </Typography>
                  </Breadcrumbs>
                )}
              </Box>
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Role Badge */}
              <Chip 
                label={role === 'admin' ? 'Administrator' : 'Vendor'}
                size="small"
                sx={{ 
                  backgroundColor: currentRole.color,
                  color: 'white',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'flex' },
                }}
              />

              {/* Notifications */}
              <NotificationDropdown />

              {/* Theme Toggle */}
              <IconButton 
                color="inherit" 
                size="small"
                onClick={toggleTheme}
                title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
              >
                {mode === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>

              {/* Settings */}
              <IconButton 
                color="inherit" 
                size="small"
                onClick={handleSettingsOpen}
              >
                <Settings />
              </IconButton>

              {/* User Avatar */}
              <Avatar
                sx={{
                  bgcolor: currentRole.color,
                  width: 36,
                  height: 36,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  ml: 1,
                }}
              >
                {currentRole.avatar}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: 'background.default',
            position: 'relative',
            overflow: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              width: '100%', 
              minHeight: '100%',
              padding: theme.spacing(3),
            }}
          >
            {children}
          </motion.div>
        </Box>
      </Box>

      {/* Settings Modal */}
      <SettingsModal 
        open={settingsOpen} 
        onClose={handleSettingsClose} 
      />
    </Box>
  );
};

export default Layout;