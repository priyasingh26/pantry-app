import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserRole, Price, ConsumptionLog } from './types';
import { getPrices, savePrices, getConsumptionLogs, saveConsumptionLogs } from './data';

interface AppContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  prices: Price[];
  setPrices: (prices: Price[]) => void;
  consumptionLogs: ConsumptionLog[];
  addConsumptionLog: (log: Omit<ConsumptionLog, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [prices, setPricesState] = useState<Price[]>([]);
  const [consumptionLogs, setConsumptionLogsState] = useState<ConsumptionLog[]>([]);

  useEffect(() => {
    setPricesState(getPrices());
    setConsumptionLogsState(getConsumptionLogs());
  }, []);

  const setPrices = (newPrices: Price[]) => {
    setPricesState(newPrices);
    savePrices(newPrices);
  };

  const addConsumptionLog = (log: Omit<ConsumptionLog, 'id'>) => {
    const logs = getConsumptionLogs();
    const newLog: ConsumptionLog = { ...log, id: Date.now().toString() };
    const updatedLogs = [...logs, newLog];
    setConsumptionLogsState(updatedLogs);
    saveConsumptionLogs(updatedLogs);
  };

  return (
    <AppContext.Provider value={{ role, setRole, prices, setPrices, consumptionLogs, addConsumptionLog }}>
      {children}
    </AppContext.Provider>
  );
};