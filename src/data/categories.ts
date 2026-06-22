import type { CategoryDef } from '../types';

export const ITEM_CATEGORIES: CategoryDef[] = [
  { id: 'техніка', name: 'Техніка', color: '#3B82F6', iconName: 'Smartphone' },
  { id: 'інструменти', name: 'Інструменти', color: '#F59E0B', iconName: 'Wrench' },
  { id: 'туризм', name: 'Туризм', color: '#10B981', iconName: 'Backpack' },
  { id: 'одяг', name: 'Одяг', color: '#8B5CF6', iconName: 'Shirt' },
  { id: 'дім', name: 'Дім', color: '#EF4444', iconName: 'Home' },
  { id: 'дитяче', name: 'Дитяче', color: '#EC4899', iconName: 'Baby' },
  { id: 'авто', name: 'Авто', color: '#F97316', iconName: 'Car' },
  { id: 'хобі', name: 'Хобі', color: '#14B8A6', iconName: 'Palette' },
  { id: 'вінтаж', name: 'Вінтаж', color: '#A78BFA', iconName: 'Clock' },
  { id: 'хендмейд', name: 'Хендмейд', color: '#F43F5E', iconName: 'Scissors' },
  { id: 'спорядження', name: 'Спорядження', color: '#6366F1', iconName: 'Flashlight' },
  { id: 'книги', name: 'Книги', color: '#84CC16', iconName: 'BookOpen' },
];

export const SERVICE_CATEGORIES: CategoryDef[] = [
  { id: 'освіта', name: 'Освіта', color: '#3B82F6', iconName: 'GraduationCap' },
  { id: 'дизайн', name: 'Дизайн', color: '#8B5CF6', iconName: 'PenTool' },
  { id: 'IT', name: 'IT', color: '#10B981', iconName: 'Code2' },
  { id: 'ремонт', name: 'Ремонт', color: '#F59E0B', iconName: 'HardHat' },
  { id: 'фото/відео', name: 'Фото/відео', color: '#EC4899', iconName: 'Camera' },
  { id: 'краса', name: 'Краса', color: '#F43F5E', iconName: 'Sparkles' },
  { id: 'переклади', name: 'Переклади', color: '#14B8A6', iconName: 'Languages' },
  { id: 'юридичні', name: 'Юридичні', color: '#6366F1', iconName: 'Scale' },
];

export const MOCK_CITIES = [
  { id: 'kyiv', name: 'Київ', branches: ['Відділення №1: вул. Хрещатик, 22', 'Відділення №3: пр. Перемоги, 15', 'Поштомат №12: ТРЦ Арена Сіті'] },
  { id: 'lviv', name: 'Львів', branches: ['Відділення №2: вул. Городоцька, 189', 'Відділення №5: вул. Стрийська, 45', 'Поштомат №7: ТРЦ Форум Львів'] },
  { id: 'kharkiv', name: 'Харків', branches: ['Відділення №1: пр. Науки, 14', 'Відділення №4: вул. Клочківська, 192'] },
  { id: 'odesa', name: 'Одеса', branches: ['Відділення №2: вул. Рішельєвська, 33', 'Відділення №6: пр. Шевченка, 4'] },
  { id: 'dnipro', name: 'Дніпро', branches: ['Відділення №3: вул. Робоча, 2а', 'Відділення №8: пр. Гагаріна, 72'] },
];
