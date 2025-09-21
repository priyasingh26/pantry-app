import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  AttachMoney,
  Save,
  Refresh,
  LocalCafe,
  Cookie,
  Fastfood,
  Close,
  Edit,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../AppContext';
import { items } from '../data';
import type { Price } from '../types';

const PriceManagement: React.FC = () => {
  const { prices, setPrices, consumptionLogs } = useAppContext();
  const navigate = useNavigate();
  const [editedPrices, setEditedPrices] = useState<Price[]>(prices);
  const [openDialog, setOpenDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const handlePriceChange = (itemId: string, newPrice: number) => {
    setEditedPrices(prev => prev.map(p => 
      p.itemId === itemId ? { ...p, price: Math.max(0, newPrice) } : p
    ));
  };

  const handleSave = () => {
    setOpenDialog(true);
  };

  const confirmSave = () => {
    setPrices(editedPrices);
    setOpenDialog(false);
    setShowSuccess(true);
    setEditingItem(null);
  };

  const resetPrices = () => {
    setEditedPrices(prices);
    setEditingItem(null);
  };

  const getItemIcon = (itemId: string) => {
    switch (itemId) {
      case 'tea':
      case 'coffee':
        return <LocalCafe />;
      case 'biscuits':
        return <Cookie />;
      case 'snacks':
        return <Fastfood />;
      default:
        return <LocalCafe />;
    }
  };

  const getPriceChange = (itemId: string) => {
    const originalPrice = prices.find(p => p.itemId === itemId)?.price || 0;
    const newPrice = editedPrices.find(p => p.itemId === itemId)?.price || 0;
    return newPrice - originalPrice;
  };

  const hasChanges = editedPrices.some((price, index) => 
    price.price !== prices[index]?.price
  );

  const getItemStats = (itemId: string) => {
    const recentLogs = consumptionLogs.filter(log => log.itemId === itemId).slice(-10);
    const totalQuantity = recentLogs.reduce((sum, log) => sum + log.quantity, 0);
    return { totalQuantity, popularity: totalQuantity > 20 ? 'high' : totalQuantity > 10 ? 'medium' : 'low' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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

  const cardVariants = {
    hover: {
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
        maxWidth: '100%',
        width: '100%',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              Price Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update item prices and manage your pricing strategy effectively.
            </Typography>
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            {items.map((item, index) => {
              const price = editedPrices.find(p => p.itemId === item.id)?.price || 0;
              const priceChange = getPriceChange(item.id);
              const itemStats = getItemStats(item.id);
              const isEditing = editingItem === item.id;

              return (
                <Box key={item.id} sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 300 }}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    layout
                  >
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        height: '100%',
                        border: isEditing ? 2 : 1,
                        borderColor: isEditing ? 'primary.main' : 'divider',
                        transition: 'all 0.3s'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: ['primary.main', 'secondary.main', 'success.main', 'warning.main'][index],
                              mr: 2,
                              width: 48,
                              height: 48
                            }}
                          >
                            {getItemIcon(item.id)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {item.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                size="small" 
                                label={itemStats.popularity.toUpperCase()} 
                                color={
                                  itemStats.popularity === 'high' ? 'success' :
                                  itemStats.popularity === 'medium' ? 'warning' : 'default'
                                }
                              />
                              <Chip 
                                size="small" 
                                label={`${itemStats.totalQuantity} sold`}
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                          <IconButton
                            onClick={() => setEditingItem(isEditing ? null : item.id)}
                            color={isEditing ? "primary" : "default"}
                            sx={{ 
                              bgcolor: isEditing ? 'primary.light' : 'transparent',
                              '&:hover': { bgcolor: isEditing ? 'primary.light' : 'action.hover' }
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current Price
                          </Typography>
                          <TextField
                            type="number"
                            value={price}
                            onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                            inputProps={{ min: 0, step: 0.5 }}
                            size="small"
                            fullWidth
                            disabled={!isEditing}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoney fontSize="small" />
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: 2,
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                  borderWidth: 2,
                                },
                              }
                            }}
                          />
                        </Box>

                        <AnimatePresence>
                          {priceChange !== 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Alert 
                                severity={priceChange > 0 ? "warning" : "info"}
                                icon={priceChange > 0 ? <TrendingUp /> : <TrendingDown />}
                                sx={{ borderRadius: 2, mb: 2 }}
                              >
                                Price {priceChange > 0 ? 'increase' : 'decrease'}: ₹{Math.abs(priceChange)}
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          pt: 2,
                          borderTop: 1,
                          borderColor: 'divider'
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Per {item.unit}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: priceChange > 0 ? 'warning.main' : 
                                     priceChange < 0 ? 'info.main' : 'text.primary'
                            }}
                          >
                            ₹{price}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              );
            })}
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={!hasChanges}
                startIcon={<Save />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: 180,
                }}
              >
                Save Changes
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={resetPrices}
                disabled={!hasChanges}
                startIcon={<Refresh />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 }
                }}
              >
                Reset
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="text"
                size="large"
                onClick={() => navigate('/vendor/dashboard')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Back to Dashboard
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, p: 1 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', pb: 1 }}>
            Confirm Price Update
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to update the prices? This action will affect all future invoices and calculations.
            </Typography>
            
            <Box sx={{ 
              bgcolor: 'grey.50', 
              borderRadius: 2, 
              p: 2,
              border: 1,
              borderColor: 'grey.200'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Price Changes Summary:
              </Typography>
              {editedPrices
                .filter(price => getPriceChange(price.itemId) !== 0)
                .map(price => {
                  const item = items.find(i => i.id === price.itemId);
                  const change = getPriceChange(price.itemId);
                  return (
                    <Box key={price.itemId} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mb: 1
                    }}>
                      <Typography variant="body2">{item?.name}</Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: change > 0 ? 'warning.main' : 'info.main',
                          fontWeight: 600
                        }}
                      >
                        {change > 0 ? '+' : ''}₹{change}
                      </Typography>
                    </Box>
                  );
                })
              }
            </Box>
          </DialogContent>
          <DialogActions sx={{ gap: 2, p: 3 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSave}
              variant="contained"
              sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
            >
              Confirm Update
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={showSuccess}
          autoHideDuration={4000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowSuccess(false)}
            severity="success" 
            sx={{ borderRadius: 2 }}
            action={
              <IconButton size="small" color="inherit" onClick={() => setShowSuccess(false)}>
                <Close fontSize="small" />
              </IconButton>
            }
          >
            Prices updated successfully!
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default PriceManagement;