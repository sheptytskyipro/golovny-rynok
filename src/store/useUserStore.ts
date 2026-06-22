import { create } from 'zustand';
import type { TelegramUser } from '../types';

interface UserStore {
  user: TelegramUser | null;
  setUser: (u: TelegramUser) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
