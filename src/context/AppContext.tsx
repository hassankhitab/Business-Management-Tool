import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  Transaction,
  Worker,
  AttendanceRecord,
  Party,
  AppSettings,
  CurrencyCode,
} from '../types';
import {
  initialSettings,
  initialProjects,
  initialClients,
  initialVendors,
  initialWorkers,
  initialAttendance,
  initialTransactions,
} from '../data/initialData';

interface ProjectStats {
  budget: number;
  spent: number;
  income: number;
  profit: number;
  percentSpent: number;
  isNearLimit: boolean; // >= 90% of budget
  isOverBudget: boolean; // > 100% of budget
  balanceRemaining: number;
}

interface OverallStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  cashInHand: number;
  pendingReceivables: number;
  pendingPayables: number;
}

interface AlertItem {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  linkTab?: string;
  targetId?: string;
}

interface AppContextType {
  // Navigation & View
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedPartyId: string | null;
  setSelectedPartyId: (id: string | null) => void;

  // Modals
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  isAddIncomeOpen: boolean;
  setIsAddIncomeOpen: (open: boolean) => void;
  isAddProjectOpen: boolean;
  setIsAddProjectOpen: (open: boolean) => void;

  // Data
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  projects: Project[];
  transactions: Transaction[];
  workers: Worker[];
  attendance: AttendanceRecord[];
  clients: Party[];
  vendors: Party[];

  // Project operations
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectStats: (projectId: string) => ProjectStats;

  // Transaction operations
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Worker & Attendance operations
  addWorker: (worker: Omit<Worker, 'id'>) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  logAttendance: (record: Omit<AttendanceRecord, 'id' | 'paid'>) => void;
  markAttendancePaid: (attendanceId: string) => void;

  // Client & Vendor operations
  addParty: (party: Omit<Party, 'id'>) => void;
  updateParty: (id: string, updates: Partial<Party>) => void;
  deleteParty: (id: string) => void;
  recordPartyPayment: (
    partyId: string,
    amount: number,
    projectId: string,
    method: 'Cash' | 'Bank Transfer' | 'Cheque',
    notes?: string
  ) => void;

  // Stats & Helpers
  overallStats: OverallStats;
  alerts: AlertItem[];
  formatCurrency: (amount: number) => string;
  resetToDemoData: () => void;
  exportTransactionsToCSV: () => void;
  exportProjectReportToCSV: () => void;
}

const STORAGE_KEY = 'jaleel_builder_db_v1';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);

  // Quick modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  // Primary State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return stored ? JSON.parse(stored) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_projects`);
      return stored ? JSON.parse(stored) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_transactions`);
      return stored ? JSON.parse(stored) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_workers`);
      return stored ? JSON.parse(stored) : initialWorkers;
    } catch {
      return initialWorkers;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_attendance`);
      return stored ? JSON.parse(stored) : initialAttendance;
    } catch {
      return initialAttendance;
    }
  });

  const [clients, setClients] = useState<Party[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_clients`);
      return stored ? JSON.parse(stored) : initialClients;
    } catch {
      return initialClients;
    }
  });

  const [vendors, setVendors] = useState<Party[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_vendors`);
      return stored ? JSON.parse(stored) : initialVendors;
    } catch {
      return initialVendors;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_workers`, JSON.stringify(workers));
    } catch (e) {
      console.error(e);
    }
  }, [workers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendance));
    } catch (e) {
      console.error(e);
    }
  }, [attendance]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(clients));
    } catch (e) {
      console.error(e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_vendors`, JSON.stringify(vendors));
    } catch (e) {
      console.error(e);
    }
  }, [vendors]);

  // Format Currency
  const formatCurrency = (amount: number): string => {
    const sym = settings.currencySymbol || 'Rs.';
    const formatted = Math.abs(amount).toLocaleString('en-US');
    if (amount < 0) {
      return `-${sym} ${formatted}`;
    }
    return `${sym} ${formatted}`;
  };

  // Project Stats calculation
  const getProjectStats = (projectId: string): ProjectStats => {
    const proj = projects.find((p) => p.id === projectId);
    const budget = proj ? proj.budget : 0;

    const projTransactions = transactions.filter((t) => t.projectId === projectId);
    const spent = projTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const income = projTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = income - spent;
    const percentSpent = budget > 0 ? (spent / budget) * 100 : 0;
    const isNearLimit = percentSpent >= 90;
    const isOverBudget = spent > budget;
    const balanceRemaining = budget - spent;

    return {
      budget,
      spent,
      income,
      profit,
      percentSpent,
      isNearLimit,
      isOverBudget,
      balanceRemaining,
    };
  };

  // Overall Stats
  const overallStats: OverallStats = React.useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const t of transactions) {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpenses += t.amount;
      }
    }

    const netProfit = totalIncome - totalExpenses;
    const cashInHand = netProfit;

    const pendingReceivables = clients.reduce((acc, c) => {
      const balance = Math.max(0, c.totalBilled - c.totalPaid);
      return acc + balance;
    }, 0);

    const pendingPayables = vendors.reduce((acc, v) => {
      const balance = Math.max(0, v.totalBilled - v.totalPaid);
      return acc + balance;
    }, 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      cashInHand,
      pendingReceivables,
      pendingPayables,
    };
  }, [transactions, clients, vendors]);

  // Alerts Generator
  const alerts: AlertItem[] = React.useMemo(() => {
    const list: AlertItem[] = [];

    // 1. Projects over 90% or over budget
    projects.forEach((proj) => {
      const stats = getProjectStats(proj.id);
      if (stats.isOverBudget) {
        list.push({
          id: `alert-budget-exceeded-${proj.id}`,
          type: 'danger',
          title: `Project Budget Exceeded: ${proj.name}`,
          description: `Total expenses (${formatCurrency(stats.spent)}) exceeded allocated budget (${formatCurrency(stats.budget)}) by ${formatCurrency(stats.spent - stats.budget)}.`,
          linkTab: 'projects',
          targetId: proj.id,
        });
      } else if (stats.isNearLimit) {
        list.push({
          id: `alert-budget-warn-${proj.id}`,
          type: 'danger',
          title: `Budget Limit Warning: ${proj.name}`,
          description: `Spending has reached ${stats.percentSpent.toFixed(1)}% of total budget. Only ${formatCurrency(stats.balanceRemaining)} remaining!`,
          linkTab: 'projects',
          targetId: proj.id,
        });
      }
    });

    // 2. Overdue client invoices
    const now = new Date();
    clients.forEach((c) => {
      const balance = c.totalBilled - c.totalPaid;
      if (balance > 0 && c.dueDate && new Date(c.dueDate) < now) {
        list.push({
          id: `alert-client-overdue-${c.id}`,
          type: 'danger',
          title: `Overdue Client Payment: ${c.name}`,
          description: `Receivable of ${formatCurrency(balance)} was due on ${c.dueDate}. Milestone pending follow-up.`,
          linkTab: 'parties',
          targetId: c.id,
        });
      }
    });

    // 3. Overdue vendor bills
    vendors.forEach((v) => {
      const balance = v.totalBilled - v.totalPaid;
      if (balance > 0 && v.dueDate && new Date(v.dueDate) < now) {
        list.push({
          id: `alert-vendor-overdue-${v.id}`,
          type: 'warning',
          title: `Supplier Bill Overdue: ${v.name}`,
          description: `Outstanding payable of ${formatCurrency(balance)} was due on ${v.dueDate}.`,
          linkTab: 'parties',
          targetId: v.id,
        });
      }
    });

    // 4. Pending Worker wages
    const unpaidAttendance = attendance.filter((a) => !a.paid);
    if (unpaidAttendance.length > 0) {
      const totalUnpaid = unpaidAttendance.reduce((sum, a) => sum + a.totalDue, 0);
      list.push({
        id: 'alert-worker-wages',
        type: 'warning',
        title: `Unpaid Labor Wages: ${unpaidAttendance.length} records pending`,
        description: `Total due wages of ${formatCurrency(totalUnpaid)} ready to be disbursed to site workers.`,
        linkTab: 'workers',
      });
    }

    return list;
  }, [projects, transactions, clients, vendors, attendance, settings]);

  // Project Operations
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Optional: Keep or delete associated transactions
  };

  // Transaction Operations
  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // If transaction is linked to a party, update their totalPaid
    if (txData.partyId) {
      if (txData.type === 'income') {
        setClients((prev) =>
          prev.map((c) => {
            if (c.id === txData.partyId) {
              const updatedPaid = c.totalPaid + txData.amount;
              const status =
                updatedPaid >= c.totalBilled
                  ? 'Paid'
                  : updatedPaid > 0
                  ? 'Partial'
                  : 'Unpaid';
              return { ...c, totalPaid: updatedPaid, status };
            }
            return c;
          })
        );
      } else {
        setVendors((prev) =>
          prev.map((v) => {
            if (v.id === txData.partyId) {
              const updatedPaid = v.totalPaid + txData.amount;
              const status =
                updatedPaid >= v.totalBilled
                  ? 'Paid'
                  : updatedPaid > 0
                  ? 'Partial'
                  : 'Unpaid';
              return { ...v, totalPaid: updatedPaid, status };
            }
            return v;
          })
        );
      }
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Worker & Attendance
  const addWorker = (workerData: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...workerData,
      id: `worker-${Date.now()}`,
    };
    setWorkers((prev) => [...prev, newWorker]);
  };

  const updateWorker = (id: string, updates: Partial<Worker>) => {
    setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const deleteWorker = (id: string) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
  };

  const logAttendance = (recordData: Omit<AttendanceRecord, 'id' | 'paid'>) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `att-${Date.now()}`,
      paid: false,
    };
    setAttendance((prev) => [newRecord, ...prev]);
  };

  // "Mark as paid" action that creates an expense entry
  const markAttendancePaid = (attendanceId: string) => {
    const record = attendance.find((a) => a.id === attendanceId);
    if (!record || record.paid) return;

    const worker = workers.find((w) => w.id === record.workerId);
    const project = projects.find((p) => p.id === record.projectId);
    const workerName = worker ? worker.name : 'Site Worker';
    const projName = project ? project.name : 'General Site';

    const txId = `tx-${Date.now()}`;
    const newExpense: Transaction = {
      id: txId,
      type: 'expense',
      projectId: record.projectId,
      category: 'Labor',
      amount: record.totalDue,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      reference: `WAGE-${record.id.slice(-6).toUpperCase()}`,
      vendorOrPayer: `${workerName} (${worker?.role || 'Labor'})`,
      workerId: record.workerId,
      notes: `Daily wages payout for ${record.daysWorked} days worked on ${projName}.`,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newExpense, ...prev]);
    setAttendance((prev) =>
      prev.map((a) =>
        a.id === attendanceId
          ? { ...a, paid: true, paidTransactionId: txId }
          : a
      )
    );
  };

  // Client & Vendor Operations
  const addParty = (partyData: Omit<Party, 'id'>) => {
    const newParty: Party = {
      ...partyData,
      id: `${partyData.type}-${Date.now()}`,
    };
    if (partyData.type === 'client') {
      setClients((prev) => [...prev, newParty]);
    } else {
      setVendors((prev) => [...prev, newParty]);
    }
  };

  const updateParty = (id: string, updates: Partial<Party>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const deleteParty = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const recordPartyPayment = (
    partyId: string,
    amount: number,
    projectId: string,
    method: 'Cash' | 'Bank Transfer' | 'Cheque',
    notes?: string
  ) => {
    const isClient = clients.some((c) => c.id === partyId);
    const party = isClient
      ? clients.find((c) => c.id === partyId)
      : vendors.find((v) => v.id === partyId);

    if (!party) return;

    if (isClient) {
      addTransaction({
        type: 'income',
        projectId,
        category: 'Milestone Payment',
        amount,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: method,
        reference: `REC-${Date.now().toString().slice(-6)}`,
        vendorOrPayer: party.name,
        partyId: party.id,
        notes: notes || `Payment received from ${party.name}`,
      });
    } else {
      addTransaction({
        type: 'expense',
        projectId,
        category: 'Materials',
        amount,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: method,
        reference: `PAY-${Date.now().toString().slice(-6)}`,
        vendorOrPayer: party.name,
        partyId: party.id,
        notes: notes || `Supplier bill payment to ${party.name}`,
      });
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      if (newSettings.currency && newSettings.currency !== prev.currency) {
        const symbolMap: Record<CurrencyCode, string> = {
          PKR: 'Rs.',
          USD: '$',
          EUR: '€',
          AED: 'AED',
          SAR: 'SAR',
        };
        merged.currencySymbol = symbolMap[newSettings.currency] || 'Rs.';
      }
      return merged;
    });
  };

  const resetToDemoData = () => {
    setSettings(initialSettings);
    setProjects(initialProjects);
    setTransactions(initialTransactions);
    setWorkers(initialWorkers);
    setAttendance(initialAttendance);
    setClients(initialClients);
    setVendors(initialVendors);
    setSelectedProjectId(null);
    setSelectedPartyId(null);
  };

  // CSV Exporters
  const exportTransactionsToCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Project', 'Category', 'Party/Vendor', 'Amount', 'Payment Method', 'Reference', 'Notes'];
    const rows = transactions.map((t) => {
      const proj = projects.find((p) => p.id === t.projectId);
      return [
        t.id,
        t.date,
        t.type.toUpperCase(),
        `"${(proj?.name || 'Unknown').replace(/"/g, '""')}"`,
        t.category,
        `"${t.vendorOrPayer.replace(/"/g, '""')}"`,
        t.amount,
        t.paymentMethod,
        `"${(t.reference || '').replace(/"/g, '""')}"`,
        `"${(t.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Jaleel_Builder_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportProjectReportToCSV = () => {
    const headers = ['Project Name', 'Client', 'Status', 'Contract Value', 'Allocated Budget', 'Total Spent', 'Total Received', 'Net Profit/Loss', 'Budget Used %'];
    const rows = projects.map((p) => {
      const stats = getProjectStats(p.id);
      return [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.clientName.replace(/"/g, '""')}"`,
        p.status,
        p.contractValue,
        p.budget,
        stats.spent,
        stats.income,
        stats.profit,
        `${stats.percentSpent.toFixed(1)}%`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Jaleel_Builder_Projects_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedProjectId,
        setSelectedProjectId,
        selectedPartyId,
        setSelectedPartyId,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isAddIncomeOpen,
        setIsAddIncomeOpen,
        isAddProjectOpen,
        setIsAddProjectOpen,
        settings,
        updateSettings,
        projects,
        transactions,
        workers,
        attendance,
        clients,
        vendors,
        addProject,
        updateProject,
        deleteProject,
        getProjectStats,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addWorker,
        updateWorker,
        deleteWorker,
        logAttendance,
        markAttendancePaid,
        addParty,
        updateParty,
        deleteParty,
        recordPartyPayment,
        overallStats,
        alerts,
        formatCurrency,
        resetToDemoData,
        exportTransactionsToCSV,
        exportProjectReportToCSV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
