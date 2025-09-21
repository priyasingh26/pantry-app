import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Card, CardContent, Avatar, Button, useTheme, Chip } from '@mui/material';
import { Add, Receipt, LocalCafe, Cookie, Fastfood, TrendingUp, TrendingDown, Assessment } from '@mui/icons-material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { format, parseISO, isToday, isThisMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useAppContext } from '../AppContext';
import { items } from '../data';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard: React.FC = () => {
  const { consumptionLogs, prices } = useAppContext();
  const navigate = useNavigate();
  const theme = useTheme();

  const getThemeColors = () => {
    const isDark = theme.palette.mode === 'dark';
    return {
      primary: isDark ? '#90CAF9' : '#1976D2',
      secondary: isDark ? '#81C784' : '#388E3C',
      tertiary: isDark ? '#FFB74D' : '#F57C00',
      quaternary: isDark ? '#F06292' : '#D32F2F',
      text: isDark ? '#FFFFFF' : '#333333',
      textSecondary: isDark ? '#B0BEC5' : '#666666',
      grid: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    };
  };

  const colors = getThemeColors();

  const todayStats = useMemo(() => {
    const todayLogs = consumptionLogs.filter(log => isToday(parseISO(log.date)));
    const stats = items.map(item => {
      const itemLogs = todayLogs.filter(log => log.itemId === item.id);
      const totalQuantity = itemLogs.reduce((sum, log) => sum + log.quantity, 0);
      const price = prices.find(p => p.itemId === item.id)?.price || 0;
      const totalCost = totalQuantity * price;
      return { ...item, quantity: totalQuantity, cost: totalCost, logs: itemLogs.length };
    });
    return stats;
  }, [consumptionLogs, prices]);

  const weeklyData = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const dailyConsumption = daysInWeek.map(day => {
      const dayLogs = consumptionLogs.filter(log => 
        format(parseISO(log.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      const itemTotals = items.map(item => {
        const itemLogs = dayLogs.filter(log => log.itemId === item.id);
        return itemLogs.reduce((sum, log) => sum + log.quantity, 0);
      });
      return {
        day: format(day, 'EEE'),
        tea: itemTotals[0] || 0,
        coffee: itemTotals[1] || 0,
        biscuits: itemTotals[2] || 0,
        snacks: itemTotals[3] || 0,
        total: itemTotals.reduce((sum, qty) => sum + qty, 0)
      };
    });
    return dailyConsumption;
  }, [consumptionLogs]);

  const monthlyData = useMemo(() => {
    const monthlyLogs = consumptionLogs.filter(log => isThisMonth(parseISO(log.date)));
    const itemStats = items.map(item => {
      const itemLogs = monthlyLogs.filter(log => log.itemId === item.id);
      const totalQuantity = itemLogs.reduce((sum, log) => sum + log.quantity, 0);
      return { name: item.name, quantity: totalQuantity };
    });
    return itemStats;
  }, [consumptionLogs]);

  const weeklyChartData = {
    labels: weeklyData.map(d => d.day),
    datasets: [
      { label: 'Tea', data: weeklyData.map(d => d.tea), backgroundColor: colors.primary + '80', borderColor: colors.primary, borderWidth: 2, tension: 0.3 },
      { label: 'Coffee', data: weeklyData.map(d => d.coffee), backgroundColor: colors.secondary + '80', borderColor: colors.secondary, borderWidth: 2, tension: 0.3 },
      { label: 'Biscuits', data: weeklyData.map(d => d.biscuits), backgroundColor: colors.tertiary + '80', borderColor: colors.tertiary, borderWidth: 2, tension: 0.3 },
      { label: 'Snacks', data: weeklyData.map(d => d.snacks), backgroundColor: colors.quaternary + '80', borderColor: colors.quaternary, borderWidth: 2, tension: 0.3 }
    ]
  };

  const monthlyChartData = {
    labels: monthlyData.map(d => d.name),
    datasets: [{
      label: 'Monthly Consumption',
      data: monthlyData.map(d => d.quantity),
      backgroundColor: [colors.primary + '80', colors.secondary + '80', colors.tertiary + '80', colors.quaternary + '80'],
      borderColor: [colors.primary, colors.secondary, colors.tertiary, colors.quaternary],
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { usePointStyle: true, padding: 20, color: colors.text, font: { size: 12, weight: 600 } } },
      tooltip: { backgroundColor: theme.palette.mode === 'dark' ? 'rgba(55, 55, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)', titleColor: colors.text, bodyColor: colors.text, borderColor: colors.grid, borderWidth: 1, cornerRadius: 8 }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: colors.grid, drawBorder: false }, ticks: { color: colors.textSecondary, font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: colors.textSecondary, font: { size: 11 } } }
    }
  };

  const getItemIcon = (itemId: string) => {
    switch (itemId) {
      case '1': return <LocalCafe fontSize="small" />;
      case '2': return <LocalCafe fontSize="small" />;
      case '3': return <Cookie fontSize="small" />;
      case '4': return <Fastfood fontSize="small" />;
      default: return <Receipt fontSize="small" />;
    }
  };

  const getTrendIcon = (quantity: number) => {
    if (quantity > 10) return <TrendingUp sx={{ color: colors.secondary, fontSize: 16 }} />;
    if (quantity > 5) return <Assessment sx={{ color: colors.tertiary, fontSize: 16 }} />;
    return <TrendingDown sx={{ color: colors.quaternary, fontSize: 16 }} />;
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)' : 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)', color: '#FFFFFF', boxShadow: theme.palette.mode === 'dark' ? 6 : 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 56, height: 56, fontSize: '1.5rem' }}></Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>Pantry Dashboard</Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, color: '#E3F2FD' }}>{format(new Date(), 'EEEE, MMMM do, yyyy')}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/log-consumption')} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', borderRadius: 3, px: 3, py: 1.5, fontWeight: 600, textTransform: 'none', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)', transform: 'translateY(-2px)' } }}>Log Consumption</Button>
          <Button variant="contained" startIcon={<Receipt />} onClick={() => navigate('/reports')} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', borderRadius: 3, px: 3, py: 1.5, fontWeight: 600, textTransform: 'none', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)', transform: 'translateY(-2px)' } }}>View Reports</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 3, backgroundColor: theme.palette.background.paper, boxShadow: theme.palette.mode === 'dark' ? 4 : 2 }}>
        <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.primary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}> Today's Consumption</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {todayStats.map((item) => (
            <Card key={item.id} sx={{ borderRadius: 2, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F8F9FA', border: '1px solid ' + colors.grid, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, backgroundColor: colors.primary + '20', color: colors.primary }}>{getItemIcon(item.id)}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.9rem' }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>{item.unit}</Typography>
                  </Box>
                  {getTrendIcon(item.quantity)}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, lineHeight: 1 }}>{item.quantity}</Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>units consumed</Typography>
                  </Box>
                  <Chip label={'₹' + item.cost} size="small" sx={{ backgroundColor: colors.primary + '15', color: colors.primary, fontWeight: 600, fontSize: '0.75rem' }} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: theme.palette.background.paper, boxShadow: theme.palette.mode === 'dark' ? 4 : 2 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.primary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}> Weekly Consumption Trend</Typography>
          <Box sx={{ height: 350 }}><Line data={weeklyChartData} options={chartOptions} /></Box>
        </Paper>
        <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: theme.palette.background.paper, boxShadow: theme.palette.mode === 'dark' ? 4 : 2 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.text.primary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}> Monthly Consumption Overview</Typography>
          <Box sx={{ height: 350 }}><Bar data={monthlyChartData} options={chartOptions} /></Box>
        </Paper>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, backgroundColor: theme.palette.background.paper, boxShadow: theme.palette.mode === 'dark' ? 4 : 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 2 }}> Quick Insights</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mt: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.primary, mb: 1 }}>{todayStats.reduce((sum, item) => sum + item.quantity, 0)}</Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Items consumed today</Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.secondary, mb: 1 }}>₹{todayStats.reduce((sum, item) => sum + item.cost, 0)}</Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>Today's total cost</Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.tertiary, mb: 1 }}>{weeklyData.reduce((sum, day) => sum + day.total, 0)}</Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>This week's consumption</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
