export type TransactionType = 'income' | 'expense' | 'sale';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface UserProfile {
  userId: string;
  salaryReserve: number;
  updatedAt: Date;
}

export interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  totalSales: number;
  netBalance: number;
  reserveProgress: number;
}
