import { TelegramWebApp } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const GUEST_USER = {
  id: 999999,
  first_name: 'Гість',
  last_name: '',
  username: 'guest',
  photo_url: '',
};

const mockTelegram = {
  WebApp: {
    ready: () => {},
    expand: () => {},
    close: () => {},
    initData: '',
    initDataUnsafe: {
      user: GUEST_USER,
    },
    MainButton: {
      text: '',
      color: '#F4801A',
      textColor: '#FFFFFF',
      isVisible: false,
      isActive: true,
      show: () => {},
      hide: () => {},
      setText: () => {},
      onClick: () => {},
      offClick: () => {},
      enable: () => {},
      disable: () => {},
      showProgress: () => {},
      hideProgress: () => {},
    },
    BackButton: {
      isVisible: false,
      show: () => {},
      hide: () => {},
      onClick: () => {},
      offClick: () => {},
    },
    HapticFeedback: {
      impactOccurred: () => {},
      notificationOccurred: () => {},
      selectionChanged: () => {},
    },
    themeParams: {},
    colorScheme: 'light' as const,
    openLink: (url: string) => window.open(url, '_blank'),
    openTelegramLink: (url: string) => window.open(url, '_blank'),
    showPopup: (_params: unknown, callback?: (id: string) => void) => {
      if (callback) callback('ok');
    },
    showAlert: (_message: string, callback?: () => void) => {
      if (callback) callback();
    },
    showConfirm: (_message: string, callback?: (ok: boolean) => void) => {
      if (callback) callback(true);
    },
  } as TelegramWebApp
};

export function useTelegram() {
  const isInTelegram = !!(window.Telegram?.WebApp);
  const tg = (window.Telegram?.WebApp ?? mockTelegram.WebApp) as TelegramWebApp;

  const haptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      tg.HapticFeedback.impactOccurred(style);
    } catch {
      // ignore
    }
  };

  const hapticSuccess = () => {
    try {
      tg.HapticFeedback.notificationOccurred('success');
    } catch {
      // ignore
    }
  };

  const user = tg.initDataUnsafe?.user ?? GUEST_USER;

  return {
    tg,
    user,
    haptic,
    hapticSuccess,
    isReady: true,
    isInTelegram,
  };
}
