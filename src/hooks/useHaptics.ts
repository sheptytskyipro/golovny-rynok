export const useHaptics = () => ({
  light: () => { try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light'); } catch {} },
  medium: () => { try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium'); } catch {} },
  success: () => { try { window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success'); } catch {} },
  error: () => { try { window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error'); } catch {} },
});
