import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Alert,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Settings,
  Person,
  Notifications,
  Security,
  Palette,
  Close,
  Save,
  Logout,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppContext } from '../AppContext';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { role, setRole } = useAppContext();
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      lowStock: true,
      highDemand: false,
      weeklyReports: true,
    },
    appearance: {
      theme: 'light',
      language: 'en',
      compactMode: false,
    },
    account: {
      name: role === 'admin' ? 'Admin User' : 'Vendor User',
      email: role === 'admin' ? 'admin@pantry.com' : 'vendor@pantry.com',
      phone: '+91 9876543210',
    },
    privacy: {
      profileVisible: true,
      dataCollection: true,
      analytics: true,
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleToggleSetting = (category: string, setting: string) => {
    setSettings(prev => {
      const categoryData = prev[category as keyof typeof prev];
      if (typeof categoryData === 'object' && categoryData !== null) {
        return {
          ...prev,
          [category]: {
            ...categoryData,
            [setting]: !(categoryData as any)[setting],
          },
        };
      }
      return prev;
    });
  };

  const handleInputChange = (category: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleLogout = () => {
    setRole(null);
    onClose();
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Settings />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Settings & Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customize your pantry management experience
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<Person />} label="Account" />
            <Tab icon={<Notifications />} label="Notifications" />
            <Tab icon={<Palette />} label="Appearance" />
            <Tab icon={<Security />} label="Privacy" />
          </Tabs>
        </Box>

        <Box sx={{ px: 3 }}>
          {/* Account Settings */}
          <TabPanel value={activeTab} index={0}>
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        bgcolor: 'primary.main',
                        fontSize: '2rem',
                        fontWeight: 700,
                      }}
                    >
                      {role === 'admin' ? 'A' : 'V'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {settings.account.name}
                      </Typography>
                      <Chip 
                        label={role === 'admin' ? 'Administrator' : 'Vendor'} 
                        size="small" 
                        sx={{ 
                          bgcolor: role === 'admin' ? 'error.light' : 'success.light',
                          color: role === 'admin' ? 'error.dark' : 'success.dark',
                          fontWeight: 600,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Member since March 2024
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Full Name"
                      value={settings.account.name}
                      onChange={(e) => handleInputChange('account', 'name', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Email Address"
                      type="email"
                      value={settings.account.email}
                      onChange={(e) => handleInputChange('account', 'email', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Phone Number"
                      value={settings.account.phone}
                      onChange={(e) => handleInputChange('account', 'phone', e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>

              <Alert severity="info" sx={{ mb: 2 }}>
                Account changes require administrator approval and may take 24-48 hours to process.
              </Alert>
            </motion.div>
          </TabPanel>

          {/* Notification Settings */}
          <TabPanel value={activeTab} index={1}>
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      📧 Email Notifications
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.email}
                            onChange={() => handleToggleSetting('notifications', 'email')}
                          />
                        }
                        label="Enable email notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.weeklyReports}
                            onChange={() => handleToggleSetting('notifications', 'weeklyReports')}
                          />
                        }
                        label="Weekly performance reports"
                      />
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      🔔 Push Notifications
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.push}
                            onChange={() => handleToggleSetting('notifications', 'push')}
                          />
                        }
                        label="Enable push notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.lowStock}
                            onChange={() => handleToggleSetting('notifications', 'lowStock')}
                          />
                        }
                        label="Low stock alerts"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notifications.highDemand}
                            onChange={() => handleToggleSetting('notifications', 'highDemand')}
                          />
                        }
                        label="High demand notifications"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          </TabPanel>

          {/* Appearance Settings */}
          <TabPanel value={activeTab} index={2}>
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      🎨 Theme & Display
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Theme</InputLabel>
                        <Select
                          value={settings.appearance.theme}
                          onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
                          label="Theme"
                        >
                          <MenuItem value="light">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LightMode fontSize="small" />
                              Light Mode
                            </Box>
                          </MenuItem>
                          <MenuItem value="dark">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DarkMode fontSize="small" />
                              Dark Mode
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl size="small" fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select
                          value={settings.appearance.language}
                          onChange={(e) => handleInputChange('appearance', 'language', e.target.value)}
                          label="Language"
                        >
                          <MenuItem value="en">🇺🇸 English</MenuItem>
                          <MenuItem value="hi">🇮🇳 हिंदी</MenuItem>
                          <MenuItem value="es">🇪🇸 Español</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.appearance.compactMode}
                            onChange={() => handleToggleSetting('appearance', 'compactMode')}
                          />
                        }
                        label="Compact mode (more content on screen)"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          </TabPanel>

          {/* Privacy Settings */}
          <TabPanel value={activeTab} index={3}>
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      🔒 Privacy & Data
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.privacy.profileVisible}
                            onChange={() => handleToggleSetting('privacy', 'profileVisible')}
                          />
                        }
                        label="Make profile visible to other users"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.privacy.dataCollection}
                            onChange={() => handleToggleSetting('privacy', 'dataCollection')}
                          />
                        }
                        label="Allow data collection for service improvement"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.privacy.analytics}
                            onChange={() => handleToggleSetting('privacy', 'analytics')}
                          />
                        }
                        label="Share usage analytics"
                      />
                    </Box>
                  </CardContent>
                </Card>

                <Alert severity="warning">
                  <Typography variant="body2">
                    Disabling data collection may limit some features and personalization options.
                  </Typography>
                </Alert>
              </Box>
            </motion.div>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ mr: 'auto' }}
        >
          Logout
        </Button>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={onClose}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsModal;