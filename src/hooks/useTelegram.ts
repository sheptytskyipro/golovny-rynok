import { useEffect } from 'react';
import type { TelegramUser } from '../types';
import { useUserStore } from '../store/useUserStore';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe: { user?: TelegramUser };
        initData: string;
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
        BackButton?: { show: () => void; hide: () => void; onClick: (fn: () => void) => void; offClick: (fn: () => void) => void };
        MainButton?: { show: () => void; hide: () => void; setText: (t: string) => void; onClick: (fn: () => void) => void };
        viewportStableHeight?: number;
        colorScheme?: 'light' | 'dark';
      };
    };
  }
}

const MOCK_USER: TelegramUser = { id: 999999, first_name: 'Гість', last_name: '', username: 'guest' };

export const useTelegram = () => {
  const setUser = useUserStore(s => s.setUser);
  const storeUser = useUserStore(s => s.user);
  const tgObj = window.Telegram?.WebApp;
  const isInTelegram = !!tgObj;

  useEffect(() => {
    if (tgObj) {
      tgObj.ready();
      tgObj.expand();
      setUser(tgObj.initDataUnsafe?.user ?? MOCK_USER);
    } else {
      console.warn('[GolovnyiRynok] Browser mode — mock user');
      setUser(MOCK_USER);
    }
  }, []);

  const haptic = (style: 'light' | 'medium' = 'light') => {
    try { tgObj?.HapticFeedback?.impactOccurred(style); } catch {}
  };
  const hapticSuccess = () => {
    try { tgObj?.HapticFeedback?.notificationOccurred('success'); } catch {}
  };

  return { tg: tgObj, isInTelegram, user: storeUser, haptic, hapticSuccess };
};
