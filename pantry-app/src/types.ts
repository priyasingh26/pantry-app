export interface Item {
  id: string;
  name: string;
  category: 'beverage' | 'snack';
  unit: string; // 'cups', 'pieces', 'packets'
}

export interface ConsumptionLog {
  id: string;
  date: string; // ISO date string
  itemId: string;
  quantity: number;
  loggedBy: string; // Admin username
  type: 'per-visit' | 'daily';
}

export interface Price {
  itemId: string;
  price: number;
  updatedAt: string;
  updatedBy: string; // Vendor username
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface DashboardStats {
  todayConsumption: { [itemId: string]: number };
  weeklyConsumption: { [itemId: string]: number[] }; // 7 days
  monthlyConsumption: { [itemId: string]: number[] }; // 30 days
  totalRevenue: number;
  lowStockAlerts: string[]; // item names
  highDemandItems: string[]; // item names
}

export interface InvoiceData {
  id: string;
  month: string; // YYYY-MM format
  items: { itemId: string; quantity: number; price: number; total: number }[];
  totalAmount: number;
  generatedAt: string;
  generatedBy: string;
}

export type UserRole = 'admin' | 'vendor';