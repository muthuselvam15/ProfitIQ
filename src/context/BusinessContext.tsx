import React, { createContext, useContext, useState } from 'react';
import type {
  SubscriptionTier,
  UserRole,
  BusinessPulseData,
  Product,
  Sale,
  Expense,
  Customer,
  Invoice,
  Alert,
  MetricExplanation
} from '../types';

import {
  INITIAL_PULSE_DATA,
  METRIC_EXPLANATIONS,
  MOCK_PRODUCTS,
  MOCK_SALES,
  MOCK_EXPENSES,
  MOCK_CUSTOMERS,
  MOCK_INVOICES,
  MOCK_ALERTS
} from '../services/mockData';

interface BusinessContextType {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  pulseData: BusinessPulseData;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  activeWhyMetric: MetricExplanation | null;
  setActiveWhyMetric: (metric: MetricExplanation | null) => void;
  openWhyModal: (metricKey: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  addSale: (sale: Partial<Sale>) => void;
  addProduct: (product: Partial<Product>) => void;
  addExpense: (expense: Partial<Expense>) => void;
  addInvoice: (invoice: Partial<Invoice>) => void;
  markAlertRead: (id: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<string>('landing');
  const [userRole, setUserRole] = useState<UserRole>('OWNER');
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('PRO');
  const [pulseData] = useState<BusinessPulseData>(INITIAL_PULSE_DATA);
  
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  const [activeWhyMetric, setActiveWhyMetric] = useState<MetricExplanation | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  const openWhyModal = (metricKey: string) => {
    if (METRIC_EXPLANATIONS[metricKey]) {
      setActiveWhyMetric(METRIC_EXPLANATIONS[metricKey]);
    }
  };

  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  const addSale = (newSale: Partial<Sale>) => {
    const created: Sale = {
      id: `sal-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: newSale.customerName || 'Walk-in Customer',
      totalAmount: newSale.totalAmount || 0,
      marginAmount: (newSale.totalAmount || 0) * 0.4,
      paymentMethod: newSale.paymentMethod || 'UPI',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      items: newSale.items || []
    };
    setSales(prev => [created, ...prev]);
  };

  const addProduct = (newProduct: Partial<Product>) => {
    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name || 'New Product',
      sku: newProduct.sku || 'SKU-000',
      category: newProduct.category || 'General',
      costPrice: newProduct.costPrice || 100,
      sellingPrice: newProduct.sellingPrice || 180,
      currentStock: newProduct.currentStock || 50,
      reorderPoint: newProduct.reorderPoint || 15,
      supplierLeadTimeDays: 3,
      avgDailySales: 2.0,
      daysRemaining: Math.round((newProduct.currentStock || 50) / 2.0),
      forecastedStockoutDate: 'Oct 15, 2026',
      suggestedReorderQty: 30,
      revenue: 0,
      marginPct: Math.round((((newProduct.sellingPrice || 180) - (newProduct.costPrice || 100)) / (newProduct.sellingPrice || 180)) * 100),
      status: 'HEALTHY'
    };
    setProducts(prev => [created, ...prev]);
  };

  const addExpense = (newExp: Partial<Expense>) => {
    const created: Expense = {
      id: `exp-${Date.now()}`,
      category: newExp.category || 'Supplies',
      amount: newExp.amount || 0,
      vendor: newExp.vendor || 'Local Vendor',
      date: new Date().toISOString().substring(0, 10),
      changePct: 0,
      isAnomaly: false,
      notes: newExp.notes || ''
    };
    setExpenses(prev => [created, ...prev]);
  };

  const addInvoice = (newInv: Partial<Invoice>) => {
    const created: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: newInv.customerName || 'Client Name',
      customerEmail: newInv.customerEmail || 'client@example.com',
      amount: newInv.amount || 0,
      taxAmount: Math.round((newInv.amount || 0) * 0.09),
      dueDate: newInv.dueDate || '2026-10-30',
      issueDate: new Date().toISOString().substring(0, 10),
      status: 'PENDING',
      items: newInv.items || []
    };
    setInvoices(prev => [created, ...prev]);
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'READ' } : a));
  };

  return (
    <BusinessContext.Provider
      value={{
        activeView,
        setActiveView,
        userRole,
        setUserRole,
        subscriptionTier,
        setSubscriptionTier,
        pulseData,
        products,
        setProducts,
        sales,
        setSales,
        expenses,
        setExpenses,
        customers,
        setCustomers,
        invoices,
        setInvoices,
        alerts,
        setAlerts,
        activeWhyMetric,
        setActiveWhyMetric,
        openWhyModal,
        isSearchOpen,
        setIsSearchOpen,
        isDemoMode,
        toggleDemoMode,
        addSale,
        addProduct,
        addExpense,
        addInvoice,
        markAlertRead
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusiness must be used within a BusinessProvider');
  return context;
};
