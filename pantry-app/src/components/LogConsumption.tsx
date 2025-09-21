import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  FormControl,
  TextField,
  Button,
  Alert,
  Chip,
  Avatar,
  IconButton,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
} from '@mui/material';
import {
  Add,
  Remove,
  LocalCafe,
  Cookie,
  Fastfood,
  DateRange,
  AccessTime,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../AppContext';
import { items } from '../data';

interface ItemCounter {
  itemId: string;
  quantity: number;
}

const LogConsumption: React.FC = () => {
  const { addConsumptionLog } = useAppContext();
  const navigate = useNavigate();
  const [logType, setLogType] = useState<'per-visit' | 'daily'>('daily');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [itemCounters, setItemCounters] = useState<ItemCounter[]>(
    items.map(item => ({ itemId: item.id, quantity: 0 }))
  );
  const [success, setSuccess] = useState<boolean>(false);

  const handleQuantityChange = (itemId: string, change: number) => {
    setItemCounters(prev => prev.map(counter => 
      counter.itemId === itemId 
        ? { ...counter, quantity: Math.max(0, counter.quantity + change) }
        : counter
    ));
  };

  const handleDirectQuantityChange = (itemId: string, value: number) => {
    setItemCounters(prev => prev.map(counter => 
      counter.itemId === itemId 
        ? { ...counter, quantity: Math.max(0, value) }
        : counter
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasItems = itemCounters.some(counter => counter.quantity > 0);
    
    if (hasItems) {
      itemCounters.forEach(counter => {
        if (counter.quantity > 0) {
          addConsumptionLog({
            date,
            itemId: counter.itemId,
            quantity: counter.quantity,
            loggedBy: 'admin',
            type: logType,
          });
        }
      });
      
      setSuccess(true);
      setItemCounters(items.map(item => ({ itemId: item.id, quantity: 0 })));
      setTimeout(() => setSuccess(false), 3000);
    }
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

  const getItemColor = (index: number) => {
    const colors = ['primary.main', 'secondary.main', 'success.main', 'warning.main'];
    return colors[index] || 'primary.main';
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

  const totalItems = itemCounters.reduce((sum, counter) => sum + counter.quantity, 0);

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
        maxWidth: '800px',
        width: '100%',
        mx: 'auto',
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
              Log Consumption
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Record pantry item consumption for accurate tracking and reporting.
            </Typography>
          </Box>
        </motion.div>

        {/* Configuration Section */}
        <motion.div variants={itemVariants}>
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Logging Configuration
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ borderRadius: 2 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <FormControl component="fieldset">
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Log Type
                    </Typography>
                    <RadioGroup
                      row
                      value={logType}
                      onChange={(e) => setLogType(e.target.value as 'per-visit' | 'daily')}
                    >
                      <FormControlLabel 
                        value="daily" 
                        control={<Radio />} 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DateRange fontSize="small" />
                            Daily Total
                          </Box>
                        }
                      />
                      <FormControlLabel 
                        value="per-visit" 
                        control={<Radio />} 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime fontSize="small" />
                            Per Visit
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Item Counters */}
        <motion.div variants={itemVariants}>
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Item Quantities
                </Typography>
                <Chip 
                  label={`Total: ${totalItems} items`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {items.map((item, index) => {
                  const counter = itemCounters.find(c => c.itemId === item.id);
                  const quantity = counter?.quantity || 0;
                  
                  return (
                    <Paper 
                      key={item.id} 
                      elevation={1} 
                      sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        border: quantity > 0 ? `2px solid` : '1px solid',
                        borderColor: quantity > 0 ? getItemColor(index) : 'grey.200',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: getItemColor(index) }}>
                            {getItemIcon(item.id)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Unit: {item.unit}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={quantity === 0}
                            color="primary"
                            sx={{ 
                              bgcolor: 'grey.100',
                              '&:hover': { bgcolor: 'grey.200' }
                            }}
                          >
                            <Remove />
                          </IconButton>

                          <TextField
                            value={quantity}
                            onChange={(e) => handleDirectQuantityChange(item.id, Number(e.target.value))}
                            type="number"
                            inputProps={{ min: 0, style: { textAlign: 'center' } }}
                            sx={{ width: 80 }}
                          />

                          <IconButton
                            onClick={() => handleQuantityChange(item.id, 1)}
                            color="primary"
                            sx={{ 
                              bgcolor: 'grey.100',
                              '&:hover': { bgcolor: 'grey.200' }
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Section */}
        <motion.div variants={itemVariants}>
          <Box component="form" onSubmit={handleSubmit}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={totalItems === 0}
              fullWidth
              sx={{
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                mb: 2,
              }}
            >
              Log {totalItems} Item{totalItems !== 1 ? 's' : ''} for {new Date(date).toLocaleDateString()}
            </Button>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity="success"
                  sx={{ borderRadius: 2, mb: 2 }}
                >
                  Consumption logged successfully! {totalItems} items recorded.
                </Alert>
              </motion.div>
            )}

            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="text"
                onClick={() => navigate('/admin/dashboard')}
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'primary.light',
                  }
                }}
              >
                ← Back to Dashboard
              </Button>
            </Box>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default LogConsumption;