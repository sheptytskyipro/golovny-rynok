import { create } from 'zustand';
import type { Transaction, ContributionDirection } from '../types';
import { MOCK_TRANSACTIONS } from '../data/transactions';

const loadTransactions = (): Transaction[] => {
  try {
    const extra = JSON.parse(localStorage.getItem('gm_transactions') || '[]') as Transaction[];
    return [...extra, ...MOCK_TRANSACTIONS];
  } catch { return MOCK_TRANSACTIONS; }
};

interface MissionStore {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  totalContributed: () => number;
  byDirection: () => Record<ContributionDirection, number>;
  byMonth: () => { month: string; amount: number }[];
  userContributions: (userId: number) => Transaction[];
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  transactions: loadTransactions(),

  addTransaction: (t) => {
    const extra = JSON.parse(localStorage.getItem('gm_transactions') || '[]');
    localStorage.setItem('gm_transactions', JSON.stringify([t, ...extra]));
    set(s => ({ transactions: [t, ...s.transactions] }));
  },

  totalContributed: () => get().transactions.reduce((sum, t) => sum + t.amount, 0),

  byDirection: () => {
    const dirs: Record<ContributionDirection, number> = { 'Розробка дронів': 0, 'Гурток «Науковий»': 0, '3-тя штурмова': 0, '47-ма МАҐУРА': 0 };
    get().transactions.forEach(t => { dirs[t.direction] = (dirs[t.direction] || 0) + t.amount; });
    return dirs;
  },

  byMonth: () => {
    const map: Record<string, number> = {};
    get().transactions.forEach(t => {
      const month = t.createdAt.slice(0, 7);
      map[month] = (map[month] || 0) + t.amount;
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([month, amount]) => ({ month, amount }));
  },

  userContributions: (userId) => get().transactions.filter(t => t.userId === userId),
}));
