import { create } from 'zustand';
import type { MarketItem, MarketService, SortOption } from '../types';
import { MOCK_ITEMS } from '../data/products';
import { MOCK_SERVICES } from '../data/services';

interface Filters {
  tab: 'items' | 'services';
  category: string | null;
  minPrice: number;
  maxPrice: number;
  cities: string[];
  sort: SortOption;
  search: string;
}

const DEFAULT_FILTERS: Filters = { tab: 'items', category: null, minPrice: 0, maxPrice: 999999, cities: [], sort: 'newest', search: '' };

const loadPersisted = <T>(key: string, fallback: T[]): T[] => {
  try { return [...fallback, ...(JSON.parse(localStorage.getItem(key) || '[]') as T[])]; } catch { return fallback; }
};

interface MarketStore {
  items: MarketItem[];
  services: MarketService[];
  filters: Filters;
  setTab: (tab: 'items' | 'services') => void;
  setCategory: (cat: string | null) => void;
  setSort: (s: SortOption) => void;
  setSearch: (s: string) => void;
  setFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;
  addItem: (item: MarketItem) => void;
  addService: (svc: MarketService) => void;
  markItemSold: (id: string) => void;
  markServiceSold: (id: string) => void;
  filteredItems: () => MarketItem[];
  filteredServices: () => MarketService[];
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  items: loadPersisted<MarketItem>('gm_items', MOCK_ITEMS),
  services: loadPersisted<MarketService>('gm_services', MOCK_SERVICES),
  filters: DEFAULT_FILTERS,

  setTab: (tab) => set(s => ({ filters: { ...s.filters, tab, category: null } })),
  setCategory: (category) => set(s => ({ filters: { ...s.filters, category } })),
  setSort: (sort) => set(s => ({ filters: { ...s.filters, sort } })),
  setSearch: (search) => set(s => ({ filters: { ...s.filters, search } })),
  setFilters: (f) => set(s => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set(s => ({ filters: { ...DEFAULT_FILTERS, tab: s.filters.tab } })),

  addItem: (item) => {
    const userItems = JSON.parse(localStorage.getItem('gm_items') || '[]');
    localStorage.setItem('gm_items', JSON.stringify([item, ...userItems]));
    set(s => ({ items: [item, ...s.items] }));
  },
  addService: (svc) => {
    const userServices = JSON.parse(localStorage.getItem('gm_services') || '[]');
    localStorage.setItem('gm_services', JSON.stringify([svc, ...userServices]));
    set(s => ({ services: [svc, ...s.services] }));
  },
  markItemSold: (id) => set(s => ({ items: s.items.map(i => i.id === id ? { ...i, status: 'sold' as const } : i) })),
  markServiceSold: (id) => set(s => ({ services: s.services.map(sv => sv.id === id ? { ...sv, status: 'sold' as const } : sv) })),

  filteredItems: () => {
    const { items, filters } = get();
    let result = items.filter(i => i.status === 'active');
    if (filters.category) result = result.filter(i => i.category === filters.category);
    if (filters.cities.length) result = result.filter(i => filters.cities.includes(i.city));
    if (filters.search) result = result.filter(i => i.title.toLowerCase().includes(filters.search.toLowerCase()) || i.description.toLowerCase().includes(filters.search.toLowerCase()));
    result = result.filter(i => i.price >= filters.minPrice && i.price <= filters.maxPrice);
    if (filters.sort === 'cheapest') result.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'priciest') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  },
  filteredServices: () => {
    const { services, filters } = get();
    let result = services.filter(s => s.status === 'active');
    if (filters.category) result = result.filter(s => s.category === filters.category);
    if (filters.search) result = result.filter(s => s.title.toLowerCase().includes(filters.search.toLowerCase()));
    result = result.filter(s => s.price >= filters.minPrice && s.price <= filters.maxPrice);
    if (filters.sort === 'cheapest') result.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'priciest') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  },
}));
