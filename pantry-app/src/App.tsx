import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SignInPage } from './components/SignInPage';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import LogConsumption from './components/LogConsumption';
import ReportsScreen from './components/ReportsScreen';
import VendorDashboard from './components/VendorDashboard';
import PriceManagement from './components/PriceManagement';
import InvoiceGeneration from './components/InvoiceGeneration';
import type { UserRole } from './types';

const AppContent: React.FC = () => {
  const { role, setRole } = useAppContext();
  const navigate = useNavigate();

  const handleSignIn = (userRole: UserRole, _credentials: { username: string; password: string }) => {
    // For demo purposes, accept any credentials
    setRole(userRole);
    
    // Navigate to appropriate dashboard after sign-in
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/vendor/dashboard');
    }
  };

  if (!role) {
    return <SignInPage onSignIn={handleSignIn} />;
  }

  return (
    <Layout>
      <Routes>
        {role === 'admin' ? (
          <>
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/log" element={<LogConsumption />} />
            <Route path="/admin/reports" element={<ReportsScreen />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/vendor/dashboard" />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/prices" element={<PriceManagement />} />
            <Route path="/vendor/invoice" element={<InvoiceGeneration />} />
          </>
        )}
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
