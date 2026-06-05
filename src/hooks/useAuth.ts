import { useState, useEffect } from 'react';
import { useTelegram } from './useTelegram';
import { TelegramUser } from '../types';

export function useAuth() {
  const { tg, user } = useTelegram();
  const [currentUser, setCurrentUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tg.ready();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, [tg, user]);

  return {
    user: currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
  };
}
