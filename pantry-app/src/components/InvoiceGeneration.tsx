import React, { useMemo, useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import {
  Receipt,
  Download,
  CalendarToday,
  Store,
  AttachMoney,
  Description,
  Print,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { useAppContext } from '../AppContext';
import { items } from '../data';
import type { GridColDef } from '@mui/x-data-grid';

const InvoiceGeneration: React.FC = () => {
  const { consumptionLogs, prices } = useAppContext();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = current month, 1 = last month, etc.

  const getMonthRange = (monthsBack: number) => {
    const date = subMonths(new Date(), monthsBack);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, 'MMMM yyyy')
    };
  };

  const monthRange = getMonthRange(selectedMonth);
  
  const filteredLogs = consumptionLogs.filter(log => {
    const logDate = parseISO(log.date);
    return logDate >= monthRange.start && logDate <= monthRange.end;
  });

  const invoiceData = useMemo(() => {
    const grouped: Record<string, { quantity: number; price: number; days: Set<string> }> = {};
    
    filteredLogs.forEach(log => {
      if (!grouped[log.itemId]) {
        grouped[log.itemId] = { 
          quantity: 0, 
          price: prices.find(p => p.itemId === log.itemId)?.price || 0,
          days: new Set()
        };
      }
      grouped[log.itemId].quantity += log.quantity;
      grouped[log.itemId].days.add(log.date);
    });

    return Object.entries(grouped).map(([itemId, data]) => {
      const item = items.find(i => i.id === itemId);
      return {
        id: itemId,
        item: item?.name || '',
        unit: item?.unit || '',
        quantity: data.quantity,
        price: data.price,
        total: data.quantity * data.price,
        activeDays: data.days.size,
      };
    }).sort((a, b) => b.total - a.total);
  }, [filteredLogs, prices]);

  const totalAmount = invoiceData.reduce((sum, item) => sum + item.total, 0);
  const totalItems = invoiceData.reduce((sum, item) => sum + item.quantity, 0);

  const columns: GridColDef[] = [
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (value) => format(parseISO(value), 'MMM dd')
    },
    { 
      field: 'item', 
      headerName: 'Item', 
      width: 150,
      valueGetter: (_, row) => {
        const item = items.find(i => i.id === row.itemId);
        return item?.name || '';
      }
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: 100,
      type: 'number'
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120,
      valueFormatter: (value: string) => value?.charAt(0).toUpperCase() + value?.slice(1) || ''
    },
  ];

  const rows = filteredLogs.map((log, index) => ({
    id: index,
    date: log.date,
    itemId: log.itemId,
    quantity: log.quantity,
    type: log.type,
  }));

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(21, 101, 192); // Primary blue
    doc.text('OFFICE PANTRY INVOICE', 20, 30);
    
    // Company info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Pantry Management System', 20, 45);
    doc.text('Monthly Consumption Report', 20, 55);
    
    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice Date: ${format(new Date(), 'dd MMM yyyy')}`, 20, 70);
    doc.text(`Period: ${monthRange.label}`, 20, 78);
    doc.text(`Total Days Active: ${new Set(filteredLogs.map(log => log.date)).size}`, 20, 86);
    
    // Table header
    let y = 105;
    doc.setFontSize(11);
    doc.setTextColor(21, 101, 192);
    doc.text('ITEM DETAILS', 20, y);
    y += 10;
    
    // Table content
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('Item', 20, y);
    doc.text('Qty', 80, y);
    doc.text('Unit Price', 110, y);
    doc.text('Total', 150, y);
    y += 5;
    
    // Line under header
    doc.setDrawColor(21, 101, 192);
    doc.line(20, y, 180, y);
    y += 10;
    
    // Invoice items
    invoiceData.forEach(item => {
      doc.setTextColor(0, 0, 0);
      doc.text(item.item, 20, y);
      doc.text(`${item.quantity} ${item.unit}`, 80, y);
      doc.text(`₹${item.price}`, 110, y);
      doc.text(`₹${item.total}`, 150, y);
      y += 8;
    });
    
    // Total section
    y += 10;
    doc.setDrawColor(21, 101, 192);
    doc.line(20, y, 180, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(21, 101, 192);
    doc.text('SUMMARY', 20, y);
    y += 10;
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Items: ${totalItems}`, 20, y);
    doc.text(`Total Amount: ₹${totalAmount}`, 110, y);
    
    // Footer
    y += 20;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by Pantry Management System', 20, y);
    doc.text(format(new Date(), 'dd MMM yyyy, HH:mm'), 20, y + 8);
    
    doc.save(`pantry-invoice-${monthRange.label.replace(' ', '-').toLowerCase()}.pdf`);
  };

  const monthOptions = [
    { value: 0, label: format(new Date(), 'MMMM yyyy') + ' (Current)' },
    { value: 1, label: format(subMonths(new Date(), 1), 'MMMM yyyy') },
    { value: 2, label: format(subMonths(new Date(), 2), 'MMMM yyyy') },
    { value: 3, label: format(subMonths(new Date(), 3), 'MMMM yyyy') },
  ];

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
              Invoice Generation
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate and download monthly consumption invoices with detailed breakdowns.
            </Typography>
          </Box>
        </motion.div>

        {/* Month Selection */}
        <motion.div variants={itemVariants}>
          <Card sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <CalendarToday />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Select Invoice Period
                  </Typography>
                </Box>
                
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    {monthOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Chip 
                  label={`${filteredLogs.length} consumption entries`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {filteredLogs.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Alert severity="info" sx={{ borderRadius: 2, textAlign: 'center' }}>
              No consumption data found for {monthRange.label}. Please select a different month or add consumption logs.
            </Alert>
          </motion.div>
        ) : (
          <>
            {/* Invoice Summary */}
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px' }}>
                  <Card sx={{ borderRadius: 3, height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                        <AttachMoney />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                        ₹{totalAmount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <Card sx={{ borderRadius: 3, height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                        <Store />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {totalItems}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Items
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ flex: '1 1 200px' }}>
                  <Card sx={{ borderRadius: 3, height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                        <Description />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        {invoiceData.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Item Types
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </motion.div>

            {/* Invoice Preview */}
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Receipt />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Invoice Preview - {monthRange.label}
                    </Typography>
                  </Box>

                  <Paper sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Office Pantry Management
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Invoice Date: {format(new Date(), 'dd MMM yyyy')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Consumption Report for {monthRange.label}
                    </Typography>
                  </Paper>

                  <Box sx={{ mb: 3 }}>
                    {invoiceData.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 2,
                            px: 3,
                            mb: 1,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: 1,
                            borderColor: 'divider',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            }
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>
                              {item.item}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity} {item.unit} × ₹{item.price}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                              ₹{item.total}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.activeDays} days
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 3,
                      bgcolor: 'primary.light',
                      borderRadius: 2,
                      color: 'primary.contrastText'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      ₹{totalAmount}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Consumption Details */}
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3, mb: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Detailed Consumption Log
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
                        borderColor: 'divider',
                      },
                      '& .MuiDataGrid-columnHeaders': {
                        bgcolor: 'grey.50',
                        borderColor: 'divider',
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={downloadPDF}
                    startIcon={<Download />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 200,
                    }}
                  >
                    Download PDF
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Print />}
                    onClick={() => window.print()}
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
                    Print Invoice
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
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default InvoiceGeneration;