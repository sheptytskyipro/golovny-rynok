import { TelegramWebApp } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const mockTelegram = {
  WebApp: {
    ready: () => {},
    expand: () => {},
    close: () => {},
    initData: 'mock_init_data',
    initDataUnsafe: {
      user: {
        id: 123456789,
        first_name: 'Тестовий',
        last_name: 'Користувач',
        username: 'test_user',
        photo_url: ''
      }
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

  const user = tg.initDataUnsafe?.user;

  return {
    tg,
    user,
    haptic,
    hapticSuccess,
    isReady: true,
  };
}
