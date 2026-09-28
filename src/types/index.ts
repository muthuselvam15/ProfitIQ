export type SubscriptionTier = 'FREE' | 'PRO' | 'PREMIUM';
export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF';

export interface BusinessSignal {
  name: string;
  score: number; // 0-100
  status: string;
  change: string;
  keyMetric: string;
  explanation: string;
}

export interface BusinessPulseData {
  score: number;
  status: 'Healthy' | 'Stable' | 'Attention Required';
  signals: {
    sales: BusinessSignal;
    profit: BusinessSignal;
    inventory: BusinessSignal;
    customers: BusinessSignal;
    expenses: BusinessSignal;
  };
}

export interface MetricExplanation {
  metricKey: string;
  title: string;
  value: string;
  change: string;
  explanation: string;
  impact: string;
  suggestedAction: string;
}

export interface PriorityAction {
  id: string;
  code: string; // '01', '02', etc.
  title: string;
  category: 'Restock' | 'Review Expense' | 'Follow Up' | 'Customer Opportunity';
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  expectedImpact: string;
  actionText: string;
  targetView: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  reorderPoint: number;
  supplierLeadTimeDays: number;
  avgDailySales: number;
  daysRemaining: number;
  forecastedStockoutDate: string;
  suggestedReorderQty: number;
  revenue: number;
  marginPct: number;
  status: 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL' | 'OVERSTOCKED';
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  marginAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'CREDIT';
  date: string;
  items: SaleItem[];
}

export interface Expense {
  id: string;
  category: 'Transportation' | 'Supplies' | 'Rent' | 'Utilities' | 'Salaries' | 'Marketing';
  amount: number;
  vendor: string;
  date: string;
  changePct: number;
  isAnomaly?: boolean;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: 'Frequent' | 'New' | 'Returning' | 'Inactive' | 'High-Value';
  totalSpent: number;
  totalOrders: number;
  outstandingBalance: number;
  lastPurchaseDate: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  taxAmount: number;
  dueDate: string;
  issueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT';
  items: InvoiceItem[];
}

export interface ProfitLeak {
  id: string;
  category: string;
  changePct: string;
  impactAmount: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  recommendation: string;
}

export interface ForecastDay {
  day: string;
  date: string;
  actual?: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  isWeekend: boolean;
}

export interface Alert {
  id: string;
  type: 'POSITIVE' | 'ATTENTION' | 'ACTION_REQUIRED' | 'AI_INSIGHT';
  title: string;
  message: string;
  timestamp: string;
  status: 'UNREAD' | 'READ' | 'RESOLVED' | 'SNOOZED';
  actionUrl?: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  dateGroup: 'TODAY' | 'YESTERDAY' | 'THIS_WEEK';
  type: 'Inventory Alert' | 'Sales Insight' | 'Expense Alert' | 'AI Recommendation';
  title: string;
  description: string;
  actionText?: string;
}

export interface BusinessGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: 'Revenue' | 'Profit' | 'Savings' | 'Customer Acquisition';
  deadline: string;
  aiStatus: string;
}

export interface ScenarioParams {
  priceChangePct: number;
  expenseReductionPct: number;
  supplierCostPct: number;
}

export interface ScenarioResult {
  projectedRevenue: number;
  projectedCosts: number;
  projectedProfit: number;
  profitChangeAmount: number;
  projectedMarginPct: number;
}

export interface CopilotResponse {
  intent: string;
  answer: string;
  data?: Record<string, any>;
  reason: string;
  recommendedAction: string;
  actionTarget?: string;
  tierRestricted?: boolean;
  requiredTier?: SubscriptionTier;
  usedFallbackEngine?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  response?: CopilotResponse;
  timestamp: string;
}
