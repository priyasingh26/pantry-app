import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Store,
  AttachMoney,
  Receipt,
  Warning,
  LocalCafe,
  Cookie,
  Fastfood,
  AccountBalance,
} from '@mui/icons-material';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { isThisMonth, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../AppContext';
import { items } from '../data';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

const VendorDashboard: React.FC = () => {
  const { consumptionLogs, prices } = useAppContext();
  const navigate = useNavigate();

  const monthlyLogs = consumptionLogs.filter(log => isThisMonth(parseISO(log.date)));

  const dashboardData = useMemo(() => {
    const itemStats = items.map(item => {
      const totalQuantity = monthlyLogs
        .filter(log => log.itemId === item.id)
        .reduce((sum, log) => sum + log.quantity, 0);
      const price = prices.find(p => p.itemId === item.id)?.price || 0;
      const revenue = totalQuantity * price;
      
      return { 
        ...item, 
        quantity: totalQuantity, 
        revenue,
        price,
        trend: totalQuantity > 20 ? 'high' : totalQuantity > 10 ? 'medium' : 'low'
      };
    });

    const totalRevenue = itemStats.reduce((sum, item) => sum + item.revenue, 0);
    const totalQuantity = itemStats.reduce((sum, item) => sum + item.quantity, 0);
    
    const alerts = itemStats.filter(item => 
      item.quantity > 50 || item.quantity < 5
    ).map(item => ({
      ...item,
      type: item.quantity > 50 ? 'high-demand' : 'low-stock',
      message: item.quantity > 50 
        ? `${item.name} has high demand (${item.quantity} units sold)`
        : `${item.name} has low activity (${item.quantity} units sold)`
    }));

    return { itemStats, totalRevenue, totalQuantity, alerts };
  }, [monthlyLogs, prices]);

  const revenueChartData = {
    labels: items.map(item => item.name),
    datasets: [{
      label: 'Revenue (₹)',
      data: dashboardData.itemStats.map(stat => stat.revenue),
      backgroundColor: [
        'rgba(0, 90, 156, 0.8)',
        'rgba(0, 123, 255, 0.8)',
        'rgba(40, 167, 69, 0.8)',
        'rgba(255, 193, 7, 0.8)',
      ],
      borderColor: [
        '#005A9C',
        '#007BFF',
        '#28A745',
        '#FFC107',
      ],
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const quantityChartData = {
    labels: items.map(item => item.name),
    datasets: [{
      data: dashboardData.itemStats.map(stat => stat.quantity),
      backgroundColor: [
        '#005A9C',
        '#007BFF',
        '#28A745',
        '#FFC107',
      ],
      borderWidth: 2,
    }],
  };

  // Line chart for weekly trends
  const weeklyTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Tea',
        data: [120, 135, 150, 165],
        borderColor: '#005A9C',
        backgroundColor: 'rgba(0, 90, 156, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#005A9C',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Coffee',
        data: [80, 95, 110, 125],
        borderColor: '#007BFF',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#007BFF',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Biscuits',
        data: [60, 70, 85, 95],
        borderColor: '#28A745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#28A745',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Weekly Consumption Trends',
        font: { size: 16 },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(121, 63, 139, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#793f8b',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} units`;
          }
        }
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(121, 63, 139, 0.1)',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 11 },
          color: '#793f8b',
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 11 },
          color: '#793f8b'
        }
      }
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Monthly Revenue by Item',
        font: { size: 16 },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(121, 63, 139, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#793f8b',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(121, 63, 139, 0.1)',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 11 },
          color: '#793f8b',
          callback: function(value: any) {
            return '₹' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 11 },
          color: '#793f8b'
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 11 }
        }
      },
      title: {
        display: true,
        text: 'Quantity Distribution',
        font: { size: 14 },
        padding: { bottom: 15 }
      },
      tooltip: {
        backgroundColor: 'rgba(121, 63, 139, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#793f8b',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} units (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
    },
    cutout: '60%',
    elements: {
      arc: {
        borderWidth: 3,
        borderColor: '#fff',
      }
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

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'high': return 'success.main';
      case 'medium': return 'warning.main';
      case 'low': return 'error.main';
      default: return 'grey.500';
    }
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
              Vendor Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your sales performance and manage inventory efficiently.
            </Typography>
          </Box>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '1 1 250px' }}>
              <Card sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <AccountBalance />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Total Revenue
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                    ₹{dashboardData.totalRevenue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This month's earnings
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 250px' }}>
              <Card sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <Store />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Items Sold
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {dashboardData.totalQuantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total units this month
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {dashboardData.itemStats.map((item, index) => (
              <Box key={item.id} sx={{ flex: '1 1 200px' }}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card sx={{ height: '100%', borderRadius: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: ['primary.main', 'secondary.main', 'success.main', 'warning.main'][index],
                            mr: 2 
                          }}
                        >
                          {getItemIcon(item.id)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={item.trend.toUpperCase()} 
                            sx={{ 
                              bgcolor: getTrendColor(item.trend),
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.unit} sold
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        Revenue: ₹{item.revenue}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((item.quantity / 50) * 100, 100)} 
                        sx={{ mt: 2, borderRadius: 1 }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '2 1 400px' }}>
              <Card sx={{ borderRadius: 3, height: 400 }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ height: 'calc(100% - 40px)' }}>
                    <Bar data={revenueChartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px' }}>
              <Card sx={{ borderRadius: 3, height: 400 }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ height: 'calc(100% - 40px)' }}>
                    <Doughnut data={quantityChartData} options={doughnutOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Additional Line Chart */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ borderRadius: 3, height: 400 }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Box sx={{ height: 'calc(100% - 40px)' }}>
                  <Line data={weeklyTrendData} options={lineChartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </motion.div>

        {/* Modern Analytics Section */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}
            >
              📊 Advanced Analytics Dashboard
            </Typography>
            
            {/* Real-time Metrics Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
              {/* Growth Rate Card */}
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #005A9C 0%, #007BFF 100%)', color: 'white' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Growth Rate
                      </Typography>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                        📈
                      </Avatar>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      +23.5%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Compared to last month
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ 
                        mt: 2, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                      }} 
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profit Margin Card */}
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #28A745 0%, #34CE57 100%)', color: 'white' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Profit Margin
                      </Typography>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                        💰
                      </Avatar>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      42.8%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Average margin this month
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      sx={{ 
                        mt: 2, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                      }} 
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Customer Satisfaction */}
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)', color: 'white' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Satisfaction
                      </Typography>
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                        ⭐
                      </Avatar>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      4.8/5
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Customer rating average
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={96} 
                      sx={{ 
                        mt: 2, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                      }} 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            {/* Performance Insights */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 3 }}>
              {/* Best Selling Hours */}
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    🕐 Peak Hours Analysis
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { time: '9:00 AM - 11:00 AM', percentage: 85, label: 'Morning Rush' },
                      { time: '1:00 PM - 3:00 PM', percentage: 70, label: 'Lunch Break' },
                      { time: '4:00 PM - 6:00 PM', percentage: 60, label: 'Evening Tea' },
                      { time: '7:00 PM - 9:00 PM', percentage: 45, label: 'Dinner Time' }
                    ].map((slot, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {slot.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {slot.percentage}% busy
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={slot.percentage} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {slot.time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Top Performing Items */}
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    🏆 Top Performers
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { name: 'Premium Tea', sales: 245, trend: '+12%', icon: '☕' },
                      { name: 'Coffee Blend', sales: 198, trend: '+8%', icon: '☕' },
                      { name: 'Chocolate Biscuits', sales: 156, trend: '+15%', icon: '🍪' },
                      { name: 'Energy Drinks', sales: 134, trend: '+5%', icon: '🥤' }
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                          {item.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.sales} units sold
                          </Typography>
                        </Box>
                        <Chip 
                          label={item.trend} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'success.light',
                            color: 'success.dark',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </motion.div>

        {/* Alerts Section */}
        {dashboardData.alerts.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card sx={{ borderRadius: 3, mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Warning />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Performance Alerts
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {dashboardData.alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Alert
                        severity={alert.type === 'high-demand' ? 'warning' : 'info'}
                        sx={{ borderRadius: 2 }}
                        icon={
                          <Avatar sx={{ 
                            bgcolor: alert.type === 'high-demand' ? 'warning.main' : 'info.main',
                            width: 24,
                            height: 24
                          }}>
                            {getItemIcon(alert.id)}
                          </Avatar>
                        }
                      >
                        {alert.message}
                      </Alert>
                    </motion.div>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px' }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 6,
                    }
                  }}
                  onClick={() => navigate('/vendor/prices')}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                      <AttachMoney sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      Price Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Update item prices and manage your pricing strategy
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ 
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      Manage Prices
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            <Box sx={{ flex: '1 1 300px' }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 6,
                    }
                  }}
                  onClick={() => navigate('/vendor/invoice')}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                      <Receipt sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      Invoice Generation
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Generate and download monthly invoices for your sales
                    </Typography>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ 
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                        }
                      }}
                    >
                      Generate Invoice
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default VendorDashboard;