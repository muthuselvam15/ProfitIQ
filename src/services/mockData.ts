import type {
  BusinessPulseData,
  PriorityAction,
  Product,
  Sale,
  Expense,
  Customer,
  Invoice,
  ProfitLeak,
  ForecastDay,
  Alert,
  TimelineEvent,
  BusinessGoal,
  MetricExplanation
} from '../types';

export const INITIAL_PULSE_DATA: BusinessPulseData = {
  score: 82,
  status: 'Healthy',
  signals: {
    sales: {
      name: 'Sales Health',
      score: 88,
      status: 'High Growth',
      change: '+12.4% vs last mo',
      keyMetric: '₹4,82,500',
      explanation: 'Weekend sales outperforming weekday sales by 23%. Strong volume in top 3 beverage categories.'
    },
    profit: {
      name: 'Profit Health',
      score: 78,
      status: 'Margin Compression',
      change: '-7.4% profit margin',
      keyMetric: '₹1,18,500',
      explanation: 'Overall revenue is up, but supplier cost inflation (+14%) has compressed net margins to 24.8%.'
    },
    inventory: {
      name: 'Inventory Health',
      score: 91,
      status: 'Optimal Velocity',
      change: '4.2x turnover',
      keyMetric: '42 SKUs Active',
      explanation: 'Stock turnover velocity is healthy. 5 items require immediate restock before weekend surge.'
    },
    customers: {
      name: 'Customer Health',
      score: 84,
      status: 'Strong Retention',
      change: '+18% repeat rate',
      keyMetric: '342 Active',
      explanation: 'High repeat customer frequency. 18 inactive customers ready for re-engagement.'
    },
    expenses: {
      name: 'Expense Health',
      score: 72,
      status: 'Anomaly Detected',
      change: '+14.2% total costs',
      keyMetric: '₹68,500',
      explanation: 'Transportation expenses spiked by +23.5% due to emergency restocking runs.'
    }
  }
};

export const METRIC_EXPLANATIONS: Record<string, MetricExplanation> = {
  revenue: {
    metricKey: 'revenue',
    title: 'Monthly Revenue: ₹4,82,500',
    value: '₹4,82,500',
    change: '+12.4%',
    explanation: 'Revenue increased mainly because Coffee Powder (500g) and Organic Green Tea generated 31% higher sales volume during weekend peak shifts.',
    impact: 'Increased top-line cash flow by ₹53,200 over previous 30-day period.',
    suggestedAction: 'Maintain current inventory levels for top 5 fast-movers to capitalize on weekend demand.'
  },
  netProfit: {
    metricKey: 'netProfit',
    title: 'Net Profit: ₹1,18,500',
    value: '₹1,18,500',
    change: '-7.4%',
    explanation: 'Net profit dropped 7.4% despite revenue growth because wholesale supplier costs jumped +14% and transportation logistics rose +11%.',
    impact: 'Net margin dropped from 29.5% to 24.8%.',
    suggestedAction: 'Review top 3 vendor terms or consider a modest 3-5% price adjustment on premium items.'
  },
  inventoryTurnover: {
    metricKey: 'inventoryTurnover',
    title: 'Inventory Health Score: 91/100',
    value: '91 / 100',
    change: '+4.2x velocity',
    explanation: 'Inventory velocity is strong with low dead-stock overall. However, 5 high-velocity products are within 3 days of stockout.',
    impact: 'Prevents locked-up capital, but risks stockout losses during peak weekend hours.',
    suggestedAction: 'Reorder safety stock for Coffee Powder and Almond Milk today.'
  },
  expenses: {
    metricKey: 'expenses',
    title: 'Operating Expenses: ₹68,500',
    value: '₹68,500',
    change: '+14.2%',
    explanation: 'Transportation costs jumped 23.5% (₹18,400) because orders were split into 4 separate emergency deliveries instead of 1 bulk shipment.',
    impact: 'Added ₹4,500 in avoidable freight surcharges.',
    suggestedAction: 'Switch supplier ordering to a fixed weekly bulk schedule.'
  }
};

export const PRIORITY_ACTIONS: PriorityAction[] = [
  {
    id: 'act-1',
    code: '01',
    title: 'Restock High-Velocity Items',
    category: 'Restock',
    description: '5 products are below safety threshold and predicted to stock out before Friday.',
    priority: 'HIGH',
    reason: 'Coffee Powder (18 units) & Green Tea (8 units) depleting 23% faster than weekday average.',
    expectedImpact: 'Prevents ₹12,400 in lost weekend sales revenue.',
    actionText: 'View Products & Restock',
    targetView: 'inventory'
  },
  {
    id: 'act-2',
    code: '02',
    title: 'Review Transportation Expense Anomaly',
    category: 'Review Expense',
    description: 'Freight expenses jumped +23.5% this month to ₹18,400.',
    priority: 'HIGH',
    reason: 'Multiple emergency courier deliveries triggered by late reordering.',
    expectedImpact: 'Potential monthly cost saving of ~₹4,500.',
    actionText: 'Investigate Expense Radar',
    targetView: 'expenses'
  },
  {
    id: 'act-3',
    code: '03',
    title: 'Follow Up Overdue Customer Invoices',
    category: 'Follow Up',
    description: '7 customer invoices totalling ₹14,500 are past 30-day payment terms.',
    priority: 'MEDIUM',
    reason: 'Delayed payment reminders on accounts past due date.',
    expectedImpact: 'Immediately recovers ₹14,500 into operating cash flow.',
    actionText: 'Send Invoice Reminders',
    targetView: 'invoices'
  },
  {
    id: 'act-4',
    code: '04',
    title: 'Re-engage Inactive Customer Segment',
    category: 'Customer Opportunity',
    description: '18 high-value customers have not made a purchase in 60+ days.',
    priority: 'MEDIUM',
    reason: 'Customer purchase cycle has elapsed without automated follow-up.',
    expectedImpact: 'Est. ₹18,000 incremental revenue from win-back campaign.',
    actionText: 'View Customer Radar',
    targetView: 'customers'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Coffee Beans Powder (500g)',
    sku: 'BEV-COF-500',
    category: 'Beverages',
    costPrice: 280,
    sellingPrice: 450,
    currentStock: 18,
    reorderPoint: 30,
    supplierLeadTimeDays: 2,
    avgDailySales: 5.0,
    daysRemaining: 3.6,
    forecastedStockoutDate: 'Oct 02, 2026',
    suggestedReorderQty: 50,
    revenue: 84500,
    marginPct: 37.7,
    status: 'CRITICAL'
  },
  {
    id: 'prod-2',
    name: 'Organic Green Tea (250g)',
    sku: 'BEV-TEA-250',
    category: 'Beverages',
    costPrice: 150,
    sellingPrice: 280,
    currentStock: 8,
    reorderPoint: 20,
    supplierLeadTimeDays: 3,
    avgDailySales: 3.5,
    daysRemaining: 2.3,
    forecastedStockoutDate: 'Oct 01, 2026',
    suggestedReorderQty: 40,
    revenue: 42000,
    marginPct: 46.4,
    status: 'CRITICAL'
  },
  {
    id: 'prod-3',
    name: 'Cold Brew Bottled Coffee (500ml)',
    sku: 'BEV-CBD-500',
    category: 'Beverages',
    costPrice: 65,
    sellingPrice: 140,
    currentStock: 12,
    reorderPoint: 25,
    supplierLeadTimeDays: 2,
    avgDailySales: 4.2,
    daysRemaining: 2.8,
    forecastedStockoutDate: 'Oct 01, 2026',
    suggestedReorderQty: 60,
    revenue: 58800,
    marginPct: 53.5,
    status: 'LOW_STOCK'
  },
  {
    id: 'prod-4',
    name: 'Almond Milk Pack (1L)',
    sku: 'BEV-MLK-1L',
    category: 'Dairy & Alternatives',
    costPrice: 120,
    sellingPrice: 210,
    currentStock: 5,
    reorderPoint: 15,
    supplierLeadTimeDays: 2,
    avgDailySales: 3.0,
    daysRemaining: 1.6,
    forecastedStockoutDate: 'Sep 30, 2026',
    suggestedReorderQty: 30,
    revenue: 31500,
    marginPct: 42.8,
    status: 'CRITICAL'
  },
  {
    id: 'prod-5',
    name: 'Artisanal Cinnamon Pastry',
    sku: 'BAK-PAS-001',
    category: 'Bakery',
    costPrice: 40,
    sellingPrice: 110,
    currentStock: 45,
    reorderPoint: 20,
    supplierLeadTimeDays: 1,
    avgDailySales: 12.0,
    daysRemaining: 3.7,
    forecastedStockoutDate: 'Oct 02, 2026',
    suggestedReorderQty: 50,
    revenue: 39600,
    marginPct: 63.6,
    status: 'HEALTHY'
  },
  {
    id: 'prod-6',
    name: 'Roasted Hazelnut Syrup (750ml)',
    sku: 'BEV-SYR-HAZ',
    category: 'Supplies',
    costPrice: 380,
    sellingPrice: 650,
    currentStock: 65,
    reorderPoint: 15,
    supplierLeadTimeDays: 4,
    avgDailySales: 0.5,
    daysRemaining: 130.0,
    forecastedStockoutDate: 'Feb 10, 2027',
    suggestedReorderQty: 0,
    revenue: 16250,
    marginPct: 41.5,
    status: 'OVERSTOCKED'
  }
];

export const MOCK_SALES: Sale[] = [
  {
    id: 'sal-1',
    invoiceNumber: 'INV-2026-089',
    customerName: 'Aarav Sharma',
    totalAmount: 1850,
    marginAmount: 720,
    paymentMethod: 'UPI',
    date: '2026-09-28 14:30',
    items: [
      { productId: 'prod-1', productName: 'Coffee Beans Powder (500g)', quantity: 3, unitPrice: 450, total: 1350 },
      { productId: 'prod-5', productName: 'Artisanal Cinnamon Pastry', quantity: 4, unitPrice: 110, total: 440 }
    ]
  },
  {
    id: 'sal-2',
    invoiceNumber: 'INV-2026-088',
    customerName: 'Priya Patel',
    totalAmount: 960,
    marginAmount: 430,
    paymentMethod: 'CARD',
    date: '2026-09-28 11:15',
    items: [
      { productId: 'prod-2', productName: 'Organic Green Tea (250g)', quantity: 2, unitPrice: 280, total: 560 },
      { productId: 'prod-3', productName: 'Cold Brew Bottled Coffee (500ml)', quantity: 2, unitPrice: 140, total: 280 }
    ]
  },
  {
    id: 'sal-3',
    invoiceNumber: 'INV-2026-087',
    customerName: 'Rohan Mehta',
    totalAmount: 2450,
    marginAmount: 980,
    paymentMethod: 'CREDIT',
    date: '2026-09-27 16:45',
    items: [
      { productId: 'prod-1', productName: 'Coffee Beans Powder (500g)', quantity: 4, unitPrice: 450, total: 1800 },
      { productId: 'prod-6', productName: 'Roasted Hazelnut Syrup (750ml)', quantity: 1, unitPrice: 650, total: 650 }
    ]
  }
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    category: 'Transportation',
    amount: 18400,
    vendor: 'Express Logistics India',
    date: '2026-09-25',
    changePct: 23.5,
    isAnomaly: true,
    notes: 'Emergency weekend courier delivery charges due to low stock'
  },
  {
    id: 'exp-2',
    category: 'Supplies',
    amount: 22100,
    vendor: 'EcoPack Solutions',
    date: '2026-09-20',
    changePct: 8.2,
    isAnomaly: false,
    notes: 'Biodegradable coffee cups and packaging bags'
  },
  {
    id: 'exp-3',
    category: 'Rent',
    amount: 25000,
    vendor: 'Metro Commercial Properties',
    date: '2026-09-01',
    changePct: 0.0,
    isAnomaly: false,
    notes: 'Monthly retail premises rent'
  },
  {
    id: 'exp-4',
    category: 'Utilities',
    amount: 3000,
    vendor: 'State Electricity Board',
    date: '2026-09-10',
    changePct: 4.0,
    isAnomaly: false,
    notes: 'Power & water utility bill'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    segment: 'Frequent',
    totalSpent: 48500,
    totalOrders: 32,
    outstandingBalance: 0,
    lastPurchaseDate: '2026-09-28'
  },
  {
    id: 'cust-2',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    phone: '+91 98123 45678',
    segment: 'High-Value',
    totalSpent: 62400,
    totalOrders: 28,
    outstandingBalance: 0,
    lastPurchaseDate: '2026-09-28'
  },
  {
    id: 'cust-3',
    name: 'Rohan Mehta',
    email: 'rohan.m@example.com',
    phone: '+91 97654 32109',
    segment: 'Returning',
    totalSpent: 28900,
    totalOrders: 14,
    outstandingBalance: 2450,
    lastPurchaseDate: '2026-09-27'
  },
  {
    id: 'cust-4',
    name: 'Kavita Iyer',
    email: 'kavita.iyer@example.com',
    phone: '+91 99887 76655',
    segment: 'Inactive',
    totalSpent: 19400,
    totalOrders: 9,
    outstandingBalance: 3200,
    lastPurchaseDate: '2026-07-14'
  },
  {
    id: 'cust-5',
    name: 'Sunil Verma',
    email: 'sunil.v@example.com',
    phone: '+91 91234 56789',
    segment: 'Inactive',
    totalSpent: 12500,
    totalOrders: 6,
    outstandingBalance: 4850,
    lastPurchaseDate: '2026-06-22'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-087',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.m@example.com',
    amount: 2450,
    taxAmount: 220,
    dueDate: '2026-10-10',
    issueDate: '2026-09-27',
    status: 'PENDING',
    items: [
      { id: 'item-1', description: 'Coffee Beans Powder (500g) x 4', quantity: 4, unitPrice: 450, amount: 1800 },
      { id: 'item-2', description: 'Roasted Hazelnut Syrup (750ml) x 1', quantity: 1, unitPrice: 650, amount: 650 }
    ]
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-074',
    customerName: 'Kavita Iyer',
    customerEmail: 'kavita.iyer@example.com',
    amount: 3200,
    taxAmount: 288,
    dueDate: '2026-08-15',
    issueDate: '2026-07-14',
    status: 'OVERDUE',
    items: [
      { id: 'item-3', description: 'Bulk Catering Beverage Order', quantity: 1, unitPrice: 3200, amount: 3200 }
    ]
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-062',
    customerName: 'Sunil Verma',
    customerEmail: 'sunil.v@example.com',
    amount: 4850,
    taxAmount: 436,
    dueDate: '2026-07-22',
    issueDate: '2026-06-22',
    status: 'OVERDUE',
    items: [
      { id: 'item-4', description: 'Monthly Retail Wholesale Supplies', quantity: 1, unitPrice: 4850, amount: 4850 }
    ]
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-089',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    amount: 1850,
    taxAmount: 166,
    dueDate: '2026-09-28',
    issueDate: '2026-09-28',
    status: 'PAID',
    items: [
      { id: 'item-5', description: 'Coffee Powder (500g) x 3 & Pastries x 4', quantity: 1, unitPrice: 1850, amount: 1850 }
    ]
  }
];

export const MOCK_PROFIT_LEAKS: ProfitLeak[] = [
  {
    id: 'leak-1',
    category: 'Transportation Costs',
    changePct: '+23.5%',
    impactAmount: 4800,
    severity: 'HIGH',
    reason: 'Frequent split courier orders triggered by stockouts.',
    recommendation: 'Consolidate deliveries into a fixed weekly order schedule.'
  },
  {
    id: 'leak-2',
    category: 'Slow-Moving Stock Hold',
    changePct: '130 days remaining',
    impactAmount: 3200,
    severity: 'MEDIUM',
    reason: '65 units of Roasted Hazelnut Syrup sitting idle for 45+ days.',
    recommendation: 'Run a 15% bundled promo with Cold Brew to liquidate inventory.'
  },
  {
    id: 'leak-3',
    category: 'Overdue Customer Invoices',
    changePct: '7 Invoices',
    impactAmount: 14500,
    severity: 'HIGH',
    reason: 'Uncollected balances exceeding 30-day payment term windows.',
    recommendation: 'Send automated payment reminders with direct online payment link.'
  }
];

export const MOCK_FORECAST_DATA: ForecastDay[] = [
  { day: 'Day 1', date: 'Sep 01', actual: 13200, predicted: 13500, lowerBound: 12400, upperBound: 14600, isWeekend: false },
  { day: 'Day 5', date: 'Sep 05', actual: 18400, predicted: 18100, lowerBound: 16800, upperBound: 19500, isWeekend: true },
  { day: 'Day 10', date: 'Sep 10', actual: 14100, predicted: 14300, lowerBound: 13100, upperBound: 15500, isWeekend: false },
  { day: 'Day 15', date: 'Sep 15', actual: 19200, predicted: 18900, lowerBound: 17400, upperBound: 20400, isWeekend: true },
  { day: 'Day 20', date: 'Sep 20', actual: 14800, predicted: 15000, lowerBound: 13800, upperBound: 16200, isWeekend: false },
  { day: 'Day 25', date: 'Sep 25', actual: 20100, predicted: 19800, lowerBound: 18200, upperBound: 21400, isWeekend: true },
  { day: 'Day 30 (NOW)', date: 'Sep 30', actual: 16200, predicted: 16000, lowerBound: 14800, upperBound: 17200, isWeekend: false },
  { day: 'Day 35', date: 'Oct 05', actual: undefined, predicted: 21500, lowerBound: 19800, upperBound: 23200, isWeekend: true },
  { day: 'Day 40', date: 'Oct 10', actual: undefined, predicted: 16800, lowerBound: 15400, upperBound: 18200, isWeekend: false },
  { day: 'Day 45', date: 'Oct 15', actual: undefined, predicted: 17400, lowerBound: 16000, upperBound: 18800, isWeekend: false },
  { day: 'Day 50', date: 'Oct 20', actual: undefined, predicted: 22800, lowerBound: 21000, upperBound: 24600, isWeekend: true },
  { day: 'Day 60', date: 'Oct 30', actual: undefined, predicted: 23500, lowerBound: 21600, upperBound: 25400, isWeekend: true }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'alt-1',
    type: 'ACTION_REQUIRED',
    title: '7 Overdue Invoices Detected',
    message: 'Customer accounts have ₹14,500 in overdue balances exceeding 30-day payment terms.',
    timestamp: '10 mins ago',
    status: 'UNREAD'
  },
  {
    id: 'alt-2',
    type: 'ATTENTION',
    title: 'Low Stock Alert: Coffee Beans Powder',
    message: 'Current stock (18 units) estimated to deplete in 3.6 days. Supplier lead time is 2 days.',
    timestamp: '45 mins ago',
    status: 'UNREAD'
  },
  {
    id: 'alt-3',
    type: 'POSITIVE',
    title: 'Weekend Sales Peak +23%',
    message: 'Saturday & Sunday revenues generated ₹41,200 higher sales than weekday average.',
    timestamp: '2 hours ago',
    status: 'READ'
  },
  {
    id: 'alt-4',
    type: 'AI_INSIGHT',
    title: 'Transportation Cost Spike',
    message: 'Freight costs increased +23.5% this month due to split reorder shipments.',
    timestamp: 'Yesterday',
    status: 'READ'
  }
];

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'time-1',
    time: '09:20 AM',
    dateGroup: 'TODAY',
    type: 'Inventory Alert',
    title: 'Low Safety Stock Threshold Reached',
    description: 'Coffee Beans Powder (18 units) & Green Tea (8 units) are 2.5 days away from stockout.',
    actionText: 'Restock Products'
  },
  {
    id: 'time-2',
    time: '08:45 AM',
    dateGroup: 'TODAY',
    type: 'Sales Insight',
    title: 'Weekend Performance Spike Detected',
    description: 'Weekend sales outperformed weekday baseline by +23.5% driven by Cold Brew & Pastries.',
    actionText: 'View Sales Report'
  },
  {
    id: 'time-3',
    time: '06:30 PM',
    dateGroup: 'YESTERDAY',
    type: 'Expense Alert',
    title: 'Transportation Anomaly Flagged',
    description: 'Express freight expense of ₹18,400 recorded (+23.5% vs trailing average).',
    actionText: 'Investigate Leak'
  },
  {
    id: 'time-4',
    time: '02:15 PM',
    dateGroup: 'THIS_WEEK',
    type: 'AI Recommendation',
    title: 'Slow-Moving Liquidation Suggested',
    description: 'Roasted Hazelnut Syrup (65 units) holding ₹24,700 capital over 45+ days idle.',
    actionText: 'Create Bundle Offer'
  }
];

export const MOCK_GOALS: BusinessGoal[] = [
  {
    id: 'goal-1',
    title: 'Monthly Revenue Goal',
    targetAmount: 500000,
    currentAmount: 482500,
    category: 'Revenue',
    deadline: 'Sep 30, 2026',
    aiStatus: 'At current pace, ₹17,500 remains to reach target with 2 days left. 96.5% completed.'
  },
  {
    id: 'goal-2',
    title: 'Net Profit Target',
    targetAmount: 135000,
    currentAmount: 118500,
    category: 'Profit',
    deadline: 'Sep 30, 2026',
    aiStatus: 'Margin compression from supplier costs leaves a ₹16,500 gap. 87.7% completed.'
  },
  {
    id: 'goal-3',
    title: 'Transportation Cost Reduction',
    targetAmount: 14000,
    currentAmount: 18400,
    category: 'Savings',
    deadline: 'Oct 15, 2026',
    aiStatus: 'Current expenditure exceeds limit by ₹4,400. Freight consolidation required.'
  }
];
