import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Store,
  Coffee,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAppContext } from '../AppContext';
import type { UserRole } from '../types';

interface LoginFormData {
  username: string;
  password: string;
}

const SignInPage: React.FC = () => {
  const { setRole } = useAppContext();
  const [activeTab, setActiveTab] = useState<UserRole>('admin');
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials for testing
  const credentials = {
    admin: { username: 'admin', password: 'admin123', name: 'John Smith' },
    vendor: { username: 'vendor', password: 'vendor123', name: 'ABC Supplies' }
  };

  const handleTabChange = (_: any, newValue: UserRole) => {
    setActiveTab(newValue);
    setFormData({ username: '', password: '' });
    setError('');
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const cred = credentials[activeTab];
    if (formData.username === cred.username && formData.password === cred.password) {
      setRole(activeTab);
    } else {
      setError('Invalid username or password');
    }
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 50%, #1976D2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: 'background.paper',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #1565C0, #1976D2)',
                color: 'white',
                textAlign: 'center',
                py: 4,
              }}
            >
              <motion.div variants={itemVariants}>
                <Coffee sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  Pantry Manager
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Office Pantry Management System
                </Typography>
              </motion.div>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <motion.div variants={itemVariants}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{ mb: 3 }}
                >
                  <Tab
                    value="admin"
                    label="Company Admin"
                    icon={<AdminPanelSettings />}
                    iconPosition="start"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  />
                  <Tab
                    value="vendor"
                    label="Vendor"
                    icon={<Store />}
                    iconPosition="start"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  />
                </Tabs>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    margin="normal"
                    required
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    margin="normal"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Demo Credentials:
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Admin: admin / admin123
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vendor: vendor / vendor123
                  </Typography>
                </Box>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignInPage;
