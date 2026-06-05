export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    chat?: unknown;
    start_param?: string;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  colorScheme: 'light' | 'dark';
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{ id: string; type?: string; text: string }>;
  }, callback?: (id: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (ok: boolean) => void) => void;
}

export type ItemCategory =
  | 'техніка'
  | 'інструменти'
  | 'туризм'
  | 'одяг'
  | 'дім'
  | 'дитяче'
  | 'авто'
  | 'хобі'
  | 'вінтаж'
  | 'хендмейд'
  | 'спорядження'
  | 'книги';

export type ServiceCategory =
  | 'освіта'
  | 'дизайн'
  | 'IT'
  | 'ремонт'
  | 'фото/відео'
  | 'краса'
  | 'переклади'
  | 'юридичні';

export type ServiceFormat = 'онлайн' | 'офлайн' | 'онлайн/офлайн';

export interface Item {
  id: string;
  sellerId: number;
  sellerName: string;
  sellerCity: string;
  title: string;
  description: string;
  legend?: string;
  price: number;
  category: ItemCategory;
  city: string;
  status: 'active' | 'sold' | 'reserved';
  images: string[];
  createdAt: string;
}

export interface Service {
  id: string;
  providerId: number;
  providerName: string;
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  format: ServiceFormat;
  duration: string;
  status: 'active' | 'sold';
  createdAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  direction: string;
  type: 'item' | 'service';
  itemTitle?: string;
}

export interface TransparencyStats {
  totalCollected: number;
  monthlyData: Array<{
    month: string;
    amount: number;
    transactions: number;
  }>;
  directionData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentTransactions: Transaction[];
}

export interface NovaPoshta {
  ref: string;
  description: string;
  cityRef: string;
  number: string;
}

export type TabId = 'home' | 'items' | 'services' | 'transparency' | 'myspace';
