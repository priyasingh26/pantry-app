import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import type { UserRole } from '../types';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface SignInPageProps {
  onSignIn: (role: UserRole, credentials: { username: string; password: string }) => void;
}

export function SignInPage({ onSignIn }: SignInPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [vendorCredentials, setVendorCredentials] = useState({ username: '', password: '' });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSubmit = (event: React.FormEvent, role: UserRole) => {
    event.preventDefault();
    const credentials = role === 'admin' ? adminCredentials : vendorCredentials;
    onSignIn(role, credentials);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        background: 'linear-gradient(135deg, #F4F6F8 0%, #E8ECEF 50%, #D6DBDF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'auto',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(0, 90, 156, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 123, 255, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            elevation={8}
            sx={{
              background: '#FFFFFF',
              border: '1px solid #D6DBDF',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 90, 156, 0.1), 0 2px 16px rgba(0, 90, 156, 0.05)',
              overflow: 'hidden',
              maxWidth: 480,
              width: '100%',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  fontWeight: 700,
                  color: '#2E3641',
                  letterSpacing: '-0.025em',
                }}
              >
                Pantry Management System
              </Typography>
              
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: '#D6DBDF',
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#007BFF',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      color: '#5A6C7D',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&.Mui-selected': {
                        color: '#005A9C',
                      },
                      '&:hover': {
                        color: '#2E3641',
                        transition: 'color 0.2s ease',
                      },
                    },
                  }}
                >
                  <Tab label="Admin Login" {...a11yProps(0)} />
                  <Tab label="Vendor Login" {...a11yProps(1)} />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                <Box
                  component="form"
                  onSubmit={(e) => handleSubmit(e, 'admin')}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                >
                  <TextField
                    fullWidth
                    label="Admin Username"
                    variant="outlined"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F4F6F8',
                        '& fieldset': {
                          borderColor: '#D6DBDF',
                        },
                        '&:hover fieldset': {
                          borderColor: '#005A9C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#007BFF',
                          borderWidth: 2,
                        },
                        '& input': {
                          color: '#2E3641',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#5A6C7D',
                        '&.Mui-focused': {
                          color: '#007BFF',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F4F6F8',
                        '& fieldset': {
                          borderColor: '#D6DBDF',
                        },
                        '&:hover fieldset': {
                          borderColor: '#005A9C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#007BFF',
                          borderWidth: 2,
                        },
                        '& input': {
                          color: '#2E3641',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#5A6C7D',
                        '&.Mui-focused': {
                          color: '#007BFF',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #007BFF 0%, #0056CC 100%)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 16px rgba(0, 123, 255, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0056CC 0%, #004099 100%)',
                        boxShadow: '0 6px 20px rgba(0, 123, 255, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Sign in as Admin
                  </Button>
                </Box>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Box
                  component="form"
                  onSubmit={(e) => handleSubmit(e, 'vendor')}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                >
                  <TextField
                    fullWidth
                    label="Vendor Username"
                    variant="outlined"
                    value={vendorCredentials.username}
                    onChange={(e) => setVendorCredentials({ ...vendorCredentials, username: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F4F6F8',
                        '& fieldset': {
                          borderColor: '#D6DBDF',
                        },
                        '&:hover fieldset': {
                          borderColor: '#005A9C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#007BFF',
                          borderWidth: 2,
                        },
                        '& input': {
                          color: '#2E3641',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#5A6C7D',
                        '&.Mui-focused': {
                          color: '#007BFF',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={vendorCredentials.password}
                    onChange={(e) => setVendorCredentials({ ...vendorCredentials, password: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#F4F6F8',
                        '& fieldset': {
                          borderColor: '#D6DBDF',
                        },
                        '&:hover fieldset': {
                          borderColor: '#005A9C',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#007BFF',
                          borderWidth: 2,
                        },
                        '& input': {
                          color: '#2E3641',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#5A6C7D',
                        '&.Mui-focused': {
                          color: '#007BFF',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #007BFF 0%, #0056CC 100%)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 16px rgba(0, 123, 255, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0056CC 0%, #004099 100%)',
                        boxShadow: '0 6px 20px rgba(0, 123, 255, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Sign in as Vendor
                  </Button>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}