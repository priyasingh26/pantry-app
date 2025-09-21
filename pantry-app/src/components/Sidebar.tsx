import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  Assessment,
  Receipt,
  AdminPanelSettings,
  Store,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Logout,
  Settings,
  ShoppingCart,
  Assignment,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import SettingsModal from './SettingsModal';
import type { UserRole } from '../types';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  role: UserRole;
}

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  badge?: string;
}

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 72;

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle, role }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole } = useAppContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const adminMenuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Log Consumption', icon: <Assignment />, path: '/admin/log' },
    { text: 'Reports & Analytics', icon: <Assessment />, path: '/admin/reports' },
  ];

  const vendorMenuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/vendor/dashboard' },
    { text: 'Price Management', icon: <ShoppingCart />, path: '/vendor/prices' },
    { text: 'Generate Invoice', icon: <Receipt />, path: '/vendor/invoice' },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : vendorMenuItems;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };

  const handleLogout = () => {
    setRole(null);
  };

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const sidebarVariants = {
    open: {
      width: sidebarWidth,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }
    },
    closed: {
      width: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
        duration: 0.3
      }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.15,
        duration: 0.3
      }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.15,
      rotate: 3,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15,
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const roleInfo = {
    admin: {
      name: 'Priya Singh',
      title: 'System Administrator',
      avatar: 'PS',
      color: '#005A9C'
    },
    vendor: {
      name: 'ABC Supplies',
      title: 'Vendor Partner',
      avatar: 'AS',
      color: '#007BFF'
    }
  };

  const currentRole = roleInfo[role];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && open && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer - 1,
          }}
          onClick={onToggle}
        />
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={onToggle}
        sx={{
          width: open ? sidebarWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #005A9C 0%, #004080 100%)',
            borderRight: 'none',
            overflow: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <motion.div
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          variants={sidebarVariants}
          animate="open"
          initial="closed"
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 64,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  variants={contentVariants}
                  animate="expanded"
                  exit="collapsed"
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <Coffee sx={{ color: 'white', fontSize: 28 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    Pantry Manager
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isMobile && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={handleCollapse}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {collapsed ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
              </motion.div>
            )}
          </Box>

          {/* User Profile */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: currentRole.color,
                  width: collapsed ? 32 : 48,
                  height: collapsed ? 32 : 48,
                  fontSize: collapsed ? '0.875rem' : '1.25rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {currentRole.avatar}
              </Avatar>
              
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div
                    variants={contentVariants}
                    animate="expanded"
                    exit="collapsed"
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {currentRole.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={currentRole.title}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontSize: '0.75rem',
                          height: 20,
                        }}
                      />
                      {role === 'admin' && (
                        <AdminPanelSettings sx={{ color: 'white', fontSize: 16 }} />
                      )}
                      {role === 'vendor' && (
                        <Store sx={{ color: 'white', fontSize: 16 }} />
                      )}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <List sx={{ p: 1 }}>
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItem disablePadding sx={{ mb: 0.5, mx: collapsed ? 1 : 0 }}>
                      <Tooltip 
                        title={collapsed ? item.text : ''} 
                        placement="right"
                        arrow
                      >
                        <ListItemButton
                          onClick={() => handleNavigation(item.path)}
                          sx={{
                            borderRadius: 2,
                            mx: collapsed ? 0.5 : 1,
                            px: collapsed ? 1 : 2,
                            py: 1.5,
                            minHeight: 48,
                            minWidth: collapsed ? 48 : 'auto',
                            backgroundColor: isActive 
                              ? 'rgba(255, 255, 255, 0.15)' 
                              : 'transparent',
                            border: isActive 
                              ? '1px solid rgba(255, 255, 255, 0.3)' 
                              : '1px solid transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transform: 'translateX(2px)',
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: 'white',
                              minWidth: collapsed ? 40 : 40,
                              mr: collapsed ? 0 : 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              display: 'flex',
                              '& svg': {
                                fontSize: '1.25rem',
                              }
                            }}
                          >
                            <motion.div
                              variants={iconVariants}
                              whileHover="hover"
                            >
                              {item.icon}
                            </motion.div>
                          </ListItemIcon>
                          
                          <AnimatePresence mode="wait">
                            {!collapsed && (
                              <motion.div
                                variants={contentVariants}
                                animate="expanded"
                                exit="collapsed"
                                style={{ width: '100%' }}
                              >
                                <ListItemText
                                  primary={item.text}
                                  primaryTypographyProps={{
                                    color: 'white',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '0.9rem',
                                  }}
                                />
                                {item.badge && (
                                  <Chip
                                    size="small"
                                    label={item.badge}
                                    sx={{
                                      backgroundColor: '#f44336',
                                      color: 'white',
                                      fontSize: '0.7rem',
                                      height: 20,
                                    }}
                                  />
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  </motion.div>
                );
              })}
            </List>
          </Box>

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <List sx={{ p: 1 }}>
              <ListItem disablePadding>
                <Tooltip title={collapsed ? 'Settings' : ''} placement="right" arrow>
                  <ListItemButton
                    onClick={() => setSettingsOpen(true)}
                    sx={{
                      borderRadius: 2,
                      mx: collapsed ? 0.5 : 1,
                      px: collapsed ? 1 : 2,
                      py: 1,
                      minHeight: 44,
                      minWidth: collapsed ? 48 : 'auto',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateX(2px)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        minWidth: collapsed ? 40 : 40,
                        mr: collapsed ? 0 : 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        '& svg': {
                          fontSize: '1.125rem',
                        }
                      }}
                    >
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.div
                          variants={contentVariants}
                          animate="expanded"
                          exit="collapsed"
                        >
                          <ListItemText
                            primary="Settings"
                            primaryTypographyProps={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.875rem',
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              
              <ListItem disablePadding>
                <Tooltip title={collapsed ? 'Sign Out' : ''} placement="right" arrow>
                  <ListItemButton
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 2,
                      mx: collapsed ? 0.5 : 1,
                      px: collapsed ? 1 : 2,
                      py: 1,
                      minHeight: 44,
                      minWidth: collapsed ? 48 : 'auto',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        color: '#f44336',
                        transform: 'translateX(2px)',
                        '& .MuiListItemIcon-root': {
                          color: '#f44336',
                        }
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        minWidth: collapsed ? 40 : 40,
                        mr: collapsed ? 0 : 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        '& svg': {
                          fontSize: '1.125rem',
                        }
                      }}
                    >
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.div
                          variants={contentVariants}
                          animate="expanded"
                          exit="collapsed"
                        >
                          <ListItemText
                            primary="Sign Out"
                            primaryTypographyProps={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.875rem',
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </List>
          </Box>
        </motion.div>
      </Drawer>

      {/* Settings Modal */}
      <SettingsModal 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </>
  );
};

export default Sidebar;