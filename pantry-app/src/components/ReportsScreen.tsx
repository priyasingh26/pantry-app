import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  Avatar,
} from '@mui/material';
import {
  PictureAsPdf,
  TableChart,
  DateRange,
  TrendingUp,
  LocalCafe,
  Cookie,
  Fastfood,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { format, isWithinInterval, parseISO, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import { useAppContext } from '../AppContext';
import { items } from '../data';

const ReportsScreen: React.FC = () => {
  const { consumptionLogs } = useAppContext();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [exportStatus, setExportStatus] = useState<string>('');

  const filteredLogs = useMemo(() => {
    if (!startDate || !endDate) return consumptionLogs;
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return consumptionLogs.filter(log =>
      isWithinInterval(parseISO(log.date), { start, end })
    );
  }, [consumptionLogs, startDate, endDate]);

  const summaryData = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredLogs.forEach(log => {
      totals[log.itemId] = (totals[log.itemId] || 0) + log.quantity;
    });
    
    return items.map(item => ({
      id: item.id,
      name: item.name,
      unit: item.unit,
      quantity: totals[item.id] || 0,
    }));
  }, [filteredLogs]);

  const chartData = {
    labels: summaryData.map(item => item.name),
    datasets: [{
      label: 'Total Consumption',
      data: summaryData.map(item => item.quantity),
      backgroundColor: [
        'rgba(21, 101, 192, 0.8)',
        'rgba(25, 118, 210, 0.8)',
        'rgba(46, 125, 50, 0.8)',
        'rgba(245, 124, 0, 0.8)',
      ],
      borderColor: [
        '#1565C0',
        '#1976D2',
        '#2E7D32',
        '#F57C00',
      ],
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Consumption Report (${format(parseISO(startDate), 'MMM dd')} - ${format(parseISO(endDate), 'MMM dd')})`,
        font: { size: 16 },
        padding: { bottom: 20 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    },
  };

  const columns: GridColDef[] = [
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 150,
      renderCell: (params) => format(parseISO(params.value), 'MMM dd, yyyy')
    },
    { 
      field: 'item', 
      headerName: 'Item', 
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              bgcolor: 'primary.main', 
              fontSize: '0.75rem' 
            }}
          >
            {getItemIcon(params.row.itemId)}
          </Avatar>
          {params.value}
        </Box>
      )
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={`${params.value} ${params.row.unit}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      )
    },
    { 
      field: 'type', 
      headerName: 'Log Type', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value === 'daily' ? 'Daily' : 'Per Visit'}
          size="small"
          color={params.value === 'daily' ? 'success' : 'secondary'}
        />
      )
    },
  ];

  const rows = filteredLogs.map((log, index) => ({
    id: index,
    date: log.date,
    item: items.find(i => i.id === log.itemId)?.name || '',
    itemId: log.itemId,
    quantity: log.quantity,
    unit: items.find(i => i.id === log.itemId)?.unit || '',
    type: log.type,
  }));

  const getItemIcon = (itemId: string) => {
    switch (itemId) {
      case 'tea':
      case 'coffee':
        return <LocalCafe sx={{ fontSize: 14 }} />;
      case 'biscuits':
        return <Cookie sx={{ fontSize: 14 }} />;
      case 'snacks':
        return <Fastfood sx={{ fontSize: 14 }} />;
      default:
        return <LocalCafe sx={{ fontSize: 14 }} />;
    }
  };

  const exportPDF = async () => {
    setExportStatus('Generating PDF...');
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Pantry Consumption Report', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Report Period: ${format(parseISO(startDate), 'MMM dd, yyyy')} to ${format(parseISO(endDate), 'MMM dd, yyyy')}`, 20, 45);
    doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 20, 55);
    doc.text(`Total Records: ${filteredLogs.length}`, 20, 65);

    let y = 85;
    doc.setFontSize(16);
    doc.text('Summary by Item:', 20, y);
    y += 15;

    doc.setFontSize(11);
    summaryData.forEach(item => {
      doc.text(`${item.name}: ${item.quantity} ${item.unit}`, 25, y);
      y += 8;
    });

    if (filteredLogs.length > 0) {
      y += 15;
      doc.setFontSize(16);
      doc.text('Detailed Logs (First 50 records):', 20, y);
      y += 15;

      doc.setFontSize(9);
      const logHeaders = ['Date', 'Item', 'Quantity', 'Type'];
      logHeaders.forEach((header, index) => {
        doc.text(header, 20 + (index * 40), y);
      });
      y += 10;

      rows.slice(0, 50).forEach(row => {
        const dateStr = format(parseISO(row.date), 'MM/dd/yy');
        doc.text(dateStr, 20, y);
        doc.text(row.item, 60, y);
        doc.text(`${row.quantity} ${row.unit}`, 100, y);
        doc.text(row.type, 140, y);
        y += 8;
        
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.save(`pantry-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    setExportStatus('PDF exported successfully!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  const exportExcel = async () => {
    setExportStatus('Generating Excel file...');
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    const detailSheet = XLSX.utils.json_to_sheet(rows.map(row => ({
      Date: format(parseISO(row.date), 'yyyy-MM-dd'),
      Item: row.item,
      Quantity: row.quantity,
      Unit: row.unit,
      Type: row.type,
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(wb, detailSheet, 'Detailed Logs');
    
    XLSX.writeFile(wb, `pantry-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    setExportStatus('Excel file exported successfully!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  const totalItems = summaryData.reduce((sum, item) => sum + item.quantity, 0);

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
              Reports & Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Analyze consumption patterns and generate detailed reports for better insights.
            </Typography>
          </Box>
        </motion.div>

        {/* Date Range Filter */}
        <motion.div variants={itemVariants}>
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <DateRange />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Date Range Filter
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 200 }}
                />
                <Chip 
                  label={`${filteredLogs.length} records found`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '1 1 250px' }}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <TrendingUp />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Total Items
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {totalItems}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Consumed in selected period
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {summaryData.map((item, index) => (
              <Box key={item.id} sx={{ flex: '1 1 200px' }}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card sx={{ borderRadius: 3, height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: ['primary.main', 'secondary.main', 'warning.main', 'error.main'][index],
                          }}
                        >
                          {getItemIcon(item.id)}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.unit} total
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* Chart */}
        <motion.div variants={itemVariants}>
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ height: 300 }}>
                <Bar data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Table */}
        <motion.div variants={itemVariants}>
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Detailed Consumption Logs
              </Typography>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 25, 50]}
                autoHeight
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderColor: 'grey.200',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'grey.50',
                    borderColor: 'grey.200',
                  },
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Export Buttons */}
        <motion.div variants={itemVariants}>
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Export Reports
              </Typography>
              
              {exportStatus && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {exportStatus}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    startIcon={<PictureAsPdf />}
                    onClick={exportPDF}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    Export PDF
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outlined"
                    startIcon={<TableChart />}
                    onClick={exportExcel}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      }
                    }}
                  >
                    Export Excel
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
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
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default ReportsScreen;