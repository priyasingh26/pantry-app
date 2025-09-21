import type { Item, ConsumptionLog, Price } from './types';

export const items: Item[] = [
  { id: 'tea', name: 'Tea', category: 'beverage', unit: 'cups' },
  { id: 'coffee', name: 'Coffee', category: 'beverage', unit: 'cups' },
  { id: 'biscuits', name: 'Biscuits', category: 'snack', unit: 'packets' },
  { id: 'snacks', name: 'Snacks', category: 'snack', unit: 'pieces' },
];

export const initialPrices: Price[] = [
  { itemId: 'tea', price: 5, updatedAt: new Date().toISOString(), updatedBy: 'vendor' },
  { itemId: 'coffee', price: 10, updatedAt: new Date().toISOString(), updatedBy: 'vendor' },
  { itemId: 'biscuits', price: 20, updatedAt: new Date().toISOString(), updatedBy: 'vendor' },
  { itemId: 'snacks', price: 30, updatedAt: new Date().toISOString(), updatedBy: 'vendor' },
];

// Generate sample consumption logs for the last 30 days
const generateSampleLogs = (): ConsumptionLog[] => {
  const logs: ConsumptionLog[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    items.forEach((item, index) => {
      // Add some randomness to consumption
      const baseQuantity = item.category === 'beverage' ? 15 : 10;
      const quantity = Math.floor(Math.random() * baseQuantity) + 5;
      
      logs.push({
        id: `${Date.now()}-${i}-${index}`,
        date: dateStr,
        itemId: item.id,
        quantity,
        loggedBy: 'admin',
        type: 'daily'
      });
    });
  }
  
  return logs;
};

export const initialConsumptionLogs: ConsumptionLog[] = generateSampleLogs();

// Utility functions for localStorage
const STORAGE_KEYS = {
  PRICES: 'pantry_prices',
  LOGS: 'pantry_logs',
};

export const getPrices = (): Price[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRICES);
  return stored ? JSON.parse(stored) : initialPrices;
};

export const savePrices = (prices: Price[]) => {
  localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(prices));
};

export const getConsumptionLogs = (): ConsumptionLog[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
  return stored ? JSON.parse(stored) : initialConsumptionLogs;
};

export const saveConsumptionLogs = (logs: ConsumptionLog[]) => {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
};

export const addConsumptionLog = (log: Omit<ConsumptionLog, 'id'>) => {
  const logs = getConsumptionLogs();
  const newLog: ConsumptionLog = { ...log, id: Date.now().toString() };
  logs.push(newLog);
  saveConsumptionLogs(logs);
  return newLog;
};