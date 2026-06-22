export type ItemCategory = 'техніка' | 'інструменти' | 'туризм' | 'одяг' | 'дім' | 'дитяче' | 'авто' | 'хобі' | 'вінтаж' | 'хендмейд' | 'спорядження' | 'книги';
export type ServiceCategory = 'освіта' | 'дизайн' | 'IT' | 'ремонт' | 'фото/відео' | 'краса' | 'переклади' | 'юридичні';
export type ItemCondition = 'нове' | 'як нове' | 'вживане';
export type ServiceFormat = 'онлайн' | 'офлайн' | 'гібрид';
export type ContributionDirection = 'Розробка дронів' | 'Гурток «Науковий»' | '3-тя штурмова' | '47-ма МАҐУРА';
export type SortOption = 'newest' | 'cheapest' | 'priciest';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface MarketItem {
  id: string;
  sellerId: number;
  sellerName: string;
  title: string;
  description: string;
  legend?: string;
  price: number;
  category: ItemCategory;
  condition: ItemCondition;
  city: string;
  status: 'active' | 'sold';
  imageUrl: string;
  createdAt: string;
}

export interface MarketService {
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
  imageUrl: string;
  contactInfo: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: number;
  itemId?: string;
  serviceId?: string;
  itemTitle: string;
  amount: number;
  direction: ContributionDirection;
  type: 'item' | 'service';
  createdAt: string;
}

export interface CategoryDef {
  id: string;
  name: string;
  color: string;
  iconName: string;
}

export interface MockCity {
  id: string;
  name: string;
  branches: string[];
}

// Compat aliases for old code still referencing these
export type Item = MarketItem;
export type Service = MarketService;
export type TabId = 'home' | 'items' | 'services' | 'transparency' | 'myspace';
