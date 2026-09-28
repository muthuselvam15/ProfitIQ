import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  SubscriptionTier,
  UserRole,
  BusinessPulseData,
  Product,
  Sale,
  SaleItem,
  Expense,
  Customer,
  Invoice,
  Alert,
  MetricExplanation
} from '../types';

import {
  INITIAL_PULSE_DATA,
  METRIC_EXPLANATIONS,
  MOCK_EXPENSES,
  MOCK_INVOICES,
  MOCK_ALERTS
} from '../services/mockData';

const API_BASE_URL = 'http://localhost:8000/api';

type CustomerApiData = Partial<Customer> & {
  total_spent?: number;
  total_orders?: number;
  outstanding_balance?: number;
  last_purchase_at?: string | null;
};

type SaleApiData = Partial<Sale> & {
  invoice_number?: string | null;
  customer_name?: string;
  total_amount?: number;
  margin_amount?: number;
  payment_method?: Sale['paymentMethod'];
  created_at?: string;
  items_json?: SaleItem[];
};

const normalizeCustomer = (customer: CustomerApiData = {}): Customer => ({
  id: customer.id || `cust-${Date.now()}`,
  name: customer.name || 'Unnamed Customer',
  email: customer.email || 'unknown@example.com',
  phone: customer.phone || '',
  segment: (customer.segment as Customer['segment']) || 'Returning',
  totalSpent: Number(customer.total_spent ?? customer.totalSpent ?? 0),
  totalOrders: Number(customer.total_orders ?? customer.totalOrders ?? 0),
  outstandingBalance: Number(customer.outstanding_balance ?? customer.outstandingBalance ?? 0),
  lastPurchaseDate: customer.last_purchase_at ? new Date(customer.last_purchase_at).toISOString().slice(0, 10) : (customer.lastPurchaseDate || new Date().toISOString().slice(0, 10))
});

const normalizeSale = (sale: SaleApiData = {}): Sale => ({
  id: sale.id || `sal-${Date.now()}`,
  invoiceNumber: sale.invoiceNumber || sale.invoice_number || `INV-${Math.floor(100 + Math.random() * 900)}`,
  customerName: sale.customerName || sale.customer_name || 'Walk-in Customer',
  totalAmount: Number(sale.totalAmount ?? sale.total_amount ?? 0),
  marginAmount: Number(sale.marginAmount ?? sale.margin_amount ?? 0),
  paymentMethod: (sale.paymentMethod || sale.payment_method || 'UPI') as Sale['paymentMethod'],
  date: sale.date || (sale.created_at ? new Date(sale.created_at).toISOString().replace('T', ' ').substring(0, 16) : new Date().toISOString().replace('T', ' ').substring(0, 16)),
  items: Array.isArray(sale.items) ? sale.items : (Array.isArray(sale.items_json) ? sale.items_json : [])
});

const normalizeProduct = (product: Partial<Product> = {}): Product => {
  const purchasePrice = Number(product.purchase_price ?? product.costPrice ?? 0);
  const sellingPrice = Number(product.selling_price ?? product.sellingPrice ?? 0);
  const stockQuantity = Number(product.stock_quantity ?? product.currentStock ?? 0);
  const minimumStock = Number(product.minimum_stock ?? product.reorderPoint ?? 0);
  const revenue = Number(product.revenue ?? (sellingPrice * stockQuantity));
  const marginPct = sellingPrice > 0 ? Math.round(((sellingPrice - purchasePrice) / sellingPrice) * 100) : 0;
  const status = product.status ?? (stockQuantity <= minimumStock ? 'LOW_STOCK' : 'HEALTHY');

  return {
    id: product.id || `prod-${Date.now()}`,
    business_id: product.business_id || 'default-business',
    name: product.name || 'Unnamed Product',
    category: product.category || 'General',
    description: product.description || '',
    purchase_price: purchasePrice,
    selling_price: sellingPrice,
    stock_quantity: stockQuantity,
    minimum_stock: minimumStock,
    supplier: product.supplier || '',
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
    sku: product.sku || `${(product.name || 'PROD').slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
    costPrice: purchasePrice,
    sellingPrice: sellingPrice,
    currentStock: stockQuantity,
    reorderPoint: minimumStock,
    supplierLeadTimeDays: 3,
    avgDailySales: 2,
    daysRemaining: Math.max(0, Math.round(stockQuantity / 2)),
    forecastedStockoutDate: 'TBD',
    suggestedReorderQty: Math.max(10, minimumStock * 2),
    revenue,
    marginPct,
    status
  };
};

const toProductPayload = (product: Partial<Product>) => ({
  business_id: product.business_id || 'default-business',
  name: product.name || 'New Product',
  category: product.category || 'General',
  description: product.description || '',
  purchase_price: Number(product.purchase_price ?? product.costPrice ?? 0),
  selling_price: Number(product.selling_price ?? product.sellingPrice ?? 1),
  stock_quantity: Number(product.stock_quantity ?? product.currentStock ?? 0),
  minimum_stock: Number(product.minimum_stock ?? product.reorderPoint ?? 0),
  supplier: product.supplier || ''
});

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
  lowStockProducts: Product[];
  fetchProducts: () => Promise<void>;
  fetchLowStockProducts: () => Promise<void>;
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
  addSale: (sale: Partial<Sale>) => Promise<Sale | null>;
  addProduct: (product: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
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

  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [customers, setCustomers] = useState<Customer[]>([]);
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

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) return;
      const data = await res.json();
      setProducts(data.map((product: Partial<Product>) => normalizeProduct(product)));
    } catch (error) {
      console.error('Failed to load products from backend:', error);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/low-stock`);
      if (!res.ok) return;
      const data = await res.json();
      setLowStockProducts(data.map((product: Partial<Product>) => normalizeProduct(product)));
    } catch (error) {
      console.error('Failed to load low-stock products:', error);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sales`);
      if (!res.ok) return;
      const data = await res.json();
      setSales(data.map((sale: Partial<Sale>) => normalizeSale(sale)));
    } catch (error) {
      console.error('Failed to load sales from backend:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/customers`);
      if (!res.ok) return;
      const data = await res.json();
      setCustomers(data.map((customer: Partial<Customer>) => normalizeCustomer(customer)));
    } catch (error) {
      console.error('Failed to load customers from backend:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchLowStockProducts();
    fetchSales();
    fetchCustomers();
  }, []);

  const addSale = async (newSale: Partial<Sale>) => {
    try {
      const payload = {
        business_id: 'default-business',
        customer_name: newSale.customerName || 'Walk-in Customer',
        total_amount: Number(newSale.totalAmount ?? 0),
        margin_amount: Number(newSale.marginAmount ?? (Number(newSale.totalAmount ?? 0) * 0.4)),
        payment_method: newSale.paymentMethod || 'UPI',
        invoice_number: newSale.invoiceNumber || `INV-${Date.now()}`,
        items: (newSale.items || []).map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: Number(item.quantity ?? 1),
          unitPrice: Number(item.unitPrice ?? 0),
          total: Number(item.total ?? ((Number(item.unitPrice ?? 0) * Number(item.quantity ?? 1))))
        }))
      };

      const res = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error('Failed to create sale:', await res.text());
        return null;
      }

      const created = normalizeSale(await res.json());
      setSales(prev => [created, ...prev]);
      return created;
    } catch (error) {
      console.error('Create sale failed:', error);
      return null;
    }
  };

  const addProduct = async (newProduct: Partial<Product>): Promise<Product | null> => {
    try {
      const payload = toProductPayload(newProduct);
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error('Failed to create product:', await res.text());
        return null;
      }

      const created = normalizeProduct(await res.json());
      setProducts(prev => [created, ...prev]);
      await fetchLowStockProducts();
      return created;
    } catch (error) {
      console.error('Create product failed:', error);
      return null;
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<Product | null> => {
    try {
      const payload = toProductPayload(updatedProduct);
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error('Failed to update product:', await res.text());
        return null;
      }

      const saved = normalizeProduct(await res.json());
      setProducts(prev => prev.map(product => product.id === id ? saved : product));
      await fetchLowStockProducts();
      return saved;
    } catch (error) {
      console.error('Update product failed:', error);
      return null;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        console.error('Failed to delete product:', await res.text());
        return false;
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      await fetchLowStockProducts();
      return true;
    } catch (error) {
      console.error('Delete product failed:', error);
      return false;
    }
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
        lowStockProducts,
        fetchProducts,
        fetchLowStockProducts,
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
        updateProduct,
        deleteProduct,
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
