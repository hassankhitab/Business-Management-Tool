export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';

export type IncomeCategory =
  | 'Client Payment'
  | 'Advance'
  | 'Milestone Payment'
  | 'Retention Release'
  | 'Other Income';

export type ExpenseCategory =
  | 'Materials'
  | 'Labor'
  | 'Equipment Rental'
  | 'Fuel/Transport'
  | 'Subcontractor'
  | 'Permits/Fees'
  | 'Utilities'
  | 'Miscellaneous';

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientId?: string;
  location: string;
  startDate: string;
  endDate: string;
  contractValue: number;
  budget: number;
  status: ProjectStatus;
  notes?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  projectId: string;
  category: IncomeCategory | ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  reference?: string;
  vendorOrPayer: string;
  partyId?: string;
  notes?: string;
  workerId?: string;
  createdAt: string;
}

export type WorkerRole =
  | 'Mason'
  | 'Electrician'
  | 'Plumber'
  | 'Helper'
  | 'Carpenter'
  | 'Steel Fixer'
  | 'Painter'
  | 'Site Supervisor';

export interface Worker {
  id: string;
  name: string;
  role: WorkerRole;
  phone: string;
  dailyWage: number;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  projectId: string;
  date: string;
  daysWorked: number; // e.g. 1, 0.5, 1.5
  dailyWage: number;
  totalDue: number;
  paid: boolean;
  paidTransactionId?: string;
  notes?: string;
}

export type PartyType = 'client' | 'vendor';
export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';

export interface Party {
  id: string;
  name: string;
  type: PartyType;
  phone: string;
  company?: string;
  email?: string;
  address?: string;
  totalBilled: number;
  totalPaid: number;
  dueDate: string;
  status: PaymentStatus;
  notes?: string;
}

export type CurrencyCode = 'PKR' | 'USD' | 'EUR' | 'AED' | 'SAR';

export interface AppSettings {
  contractorName: string;
  companyName: string;
  tagline: string;
  currency: CurrencyCode;
  currencySymbol: string;
  phone: string;
  email: string;
  address: string;
}
