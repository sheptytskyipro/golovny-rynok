import { Item, Service, Transaction, ItemCategory, ServiceCategory } from '../types';

// ─── Seed mock data ───────────────────────────────────────────────────────────

const SEED_ITEMS: Item[] = [
  {
    id: 'item-1', sellerId: 101, sellerName: 'Олена К.', sellerCity: 'Київ',
    title: 'iPhone 12 Mini — 64GB, ідеальний стан',
    description: 'Телефон у відмінному стані, без подряпин. Комплект: коробка, кабель.',
    legend: 'Купила новий айфон, а цей просто лежить у шухляді. Нехай краще допоможе нашим захисникам!',
    price: 4500, category: 'техніка', city: 'Київ', status: 'active',
    images: [], createdAt: '2024-03-10',
  },
  {
    id: 'item-2', sellerId: 102, sellerName: 'Богдан Л.', sellerCity: 'Львів',
    title: 'Туристичний рюкзак Osprey Atmos 65л',
    description: 'Легкий і зручний рюкзак для тривалих походів. Стан — майже новий, використовувався 2 рази.',
    legend: 'Планував похід у Карпати, але плани змінились через війну. Нехай рюкзак служить тим, хто захищає ці гори.',
    price: 2800, category: 'туризм', city: 'Львів', status: 'active',
    images: [], createdAt: '2024-03-08',
  },
  {
    id: 'item-3', sellerId: 103, sellerName: 'Андрій С.', sellerCity: 'Харків',
    title: 'Бібліотека з 50 книг — українська та світова класика',
    description: 'Зібрання книг у чудовому стані. Шевченко, Франко, Достоєвський, Гарпер Лі та ін.',
    legend: 'Збирав бібліотеку роками. Зараз переїжджаю і місця немає, але хочу щоб книги знайшли нового читача.',
    price: 1200, category: 'книги', city: 'Харків', status: 'active',
    images: [], createdAt: '2024-03-06',
  },
  {
    id: 'item-4', sellerId: 104, sellerName: 'Олексій Д.', sellerCity: 'Дніпро',
    title: 'Налобний ліхтар Fenix HL60R — 1200 лм',
    description: 'Акумуляторний, заряджається від USB. Водонепроникний IPX6, 3 режими.',
    legend: 'Купував для рибалки — тепер не до того. Нехай світить там, де це справді потрібно.',
    price: 850, category: 'спорядження', city: 'Дніпро', status: 'active',
    images: [], createdAt: '2024-03-05',
  },
  {
    id: 'item-5', sellerId: 105, sellerName: 'Ганна В.', sellerCity: 'Одеса',
    title: 'Гітара акустична Yamaha F310 + чохол',
    description: 'Гітара в ідеальному стані, нові струни. Підійде для початківців і не тільки.',
    legend: 'Навчилась грати, але зараз не до музики. Нехай ця гітара принесе радість і допоможе ЗСУ.',
    price: 3200, category: 'хобі', city: 'Одеса', status: 'active',
    images: [], createdAt: '2024-03-03',
  },
  {
    id: 'item-6', sellerId: 106, sellerName: 'Тарас Н.', sellerCity: 'Київ',
    title: 'Гірськолижні черевики Salomon X Pro 100, р. 42',
    description: 'Черевики у відмінному стані. Жорсткість 100, підходять для досвідчених лижників.',
    legend: 'Більше не катаюся на лижах. Нехай черевики знайдуть господаря, а кошти допоможуть армії.',
    price: 1800, category: 'туризм', city: 'Київ', status: 'active',
    images: [], createdAt: '2024-03-02',
  },
  {
    id: 'item-7', sellerId: 107, sellerName: 'Марина П.', sellerCity: 'Львів',
    title: 'Пуховик зимовий Columbia Powder Lite, р. M',
    description: 'Жіночий пуховик, колір темно-зелений. Носили один сезон, відмінний стан.',
    legend: 'Купила два пуховики, один зайвий. Краще хай допомагає ніж висить у шафі.',
    price: 950, category: 'одяг', city: 'Львів', status: 'active',
    images: [], createdAt: '2024-02-28',
  },
  {
    id: 'item-8', sellerId: 108, sellerName: 'Оксана Ф.', sellerCity: 'Київ',
    title: 'Картина «Ранок у Карпатах» — авторська, олія',
    description: 'Авторська картина, олія на полотні, 60×80 см. Підписана художницею.',
    legend: 'Кожен мазок — це любов до рідної землі. Купуючи цю картину, ви підтримуєте і мистецтво, і армію.',
    price: 2200, category: 'хендмейд', city: 'Київ', status: 'active',
    images: [], createdAt: '2024-02-25',
  },
  {
    id: 'item-9', sellerId: 109, sellerName: 'Сергій Г.', sellerCity: 'Харків',
    title: 'Монітор Dell UltraSharp U2412M — 24"',
    description: 'Монітор IPS, Full HD, без пікселів. Ідеальний для роботи та навчання.',
    legend: 'Перейшов на ноутбук, монітор більше не потрібен. Хай приносить користь і наближає перемогу!',
    price: 3800, category: 'техніка', city: 'Харків', status: 'active',
    images: [], createdAt: '2024-02-22',
  },
  {
    id: 'item-10', sellerId: 110, sellerName: 'Наталія К.', sellerCity: 'Дніпро',
    title: 'Набір дитячих книг — 20 штук для дошкільнят',
    description: 'Книги в чудовому стані: казки, розвивалки, абетки. Для дітей 3–7 років.',
    legend: 'Діти виросли, а книги живуть. Нехай ростять нових маленьких українців!',
    price: 600, category: 'дитяче', city: 'Дніпро', status: 'active',
    images: [], createdAt: '2024-02-20',
  },
];

const SEED_SERVICES: Service[] = [
  {
    id: 'svc-1', providerId: 201, providerName: 'Дмитро Код',
    title: 'Курс Python для початківців — 8 занять онлайн',
    description: 'Базовий курс Python з нуля: змінні, цикли, функції, файли, API. Заняття по 1.5 год. Домашні завдання з перевіркою.',
    price: 1500, category: 'освіта', format: 'онлайн', duration: '8 занять',
    status: 'active', createdAt: '2024-03-10',
  },
  {
    id: 'svc-2', providerId: 202, providerName: 'Аліса Дизайн',
    title: 'Дизайн логотипу + брендбук для бізнесу',
    description: 'Повний фірмовий стиль: логотип (3 варіанти), кольорова палітра, шрифти, візитки, шаблони соцмереж. Формат AI, PDF, PNG.',
    price: 3500, category: 'дизайн', format: 'онлайн', duration: '5–7 днів',
    status: 'active', createdAt: '2024-03-08',
  },
  {
    id: 'svc-3', providerId: 203, providerName: 'Іван Техніка',
    title: 'Ремонт ноутбука — діагностика + чищення + ремонт',
    description: 'Повна діагностика, заміна термопасти, чищення від пилу, ремонт клавіш, заміна екрана. Гарантія 3 місяці.',
    price: 800, category: 'ремонт', format: 'офлайн', duration: '1–2 дні',
    status: 'active', createdAt: '2024-03-05',
  },
  {
    id: 'svc-4', providerId: 204, providerName: 'Катерина Фото',
    title: 'Фотосесія — портретна або сімейна, 2 год',
    description: '2 год зйомки, 30 оброблених фото у форматі JPG та RAW. Локація — за домовленістю (Львів).',
    price: 2500, category: 'фото/відео', format: 'офлайн', duration: '2 год',
    status: 'active', createdAt: '2024-03-03',
  },
  {
    id: 'svc-5', providerId: 205, providerName: 'Ольга Мови',
    title: 'Переклад документів укр/англ — будь-яка тематика',
    description: 'Переклад офіційних документів, договорів, особистих листів. Досвід 7 років, юридична тематика вітається.',
    price: 500, category: 'переклади', format: 'онлайн', duration: '1–3 дні',
    status: 'active', createdAt: '2024-03-01',
  },
  {
    id: 'svc-6', providerId: 206, providerName: 'Юрій Право',
    title: 'Юридична консультація — 1 год онлайн',
    description: 'Консультація з будь-яких питань: нерухомість, трудові спори, сімейне право, підприємництво. Адвокат з 10-річним досвідом.',
    price: 1200, category: 'юридичні', format: 'онлайн', duration: '1 год',
    status: 'active', createdAt: '2024-02-28',
  },
];

const DIRECTIONS = ['Розробка дронів', 'Гурток «Науковий»', '3-тя штурмова', '47-ма МАҐУРА'];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1',  userId: 0, date: '2024-03-10', amount: 4500,  direction: 'Розробка дронів',   type: 'item',    itemTitle: 'iPhone 12 Mini' },
  { id: 'tx-2',  userId: 0, date: '2024-03-09', amount: 3500,  direction: 'Гурток «Науковий»', type: 'service', itemTitle: 'Дизайн логотипу' },
  { id: 'tx-3',  userId: 0, date: '2024-03-08', amount: 2800,  direction: 'Розробка дронів',   type: 'item',    itemTitle: 'Рюкзак Osprey 65л' },
  { id: 'tx-4',  userId: 0, date: '2024-03-07', amount: 1500,  direction: '47-ма МАҐУРА',      type: 'service', itemTitle: 'Курс Python' },
  { id: 'tx-5',  userId: 0, date: '2024-03-05', amount: 3800,  direction: '3-тя штурмова',     type: 'item',    itemTitle: 'Монітор Dell 24"' },
  { id: 'tx-6',  userId: 0, date: '2024-03-04', amount: 1200,  direction: 'Розробка дронів',   type: 'service', itemTitle: 'Юридична консультація' },
  { id: 'tx-7',  userId: 0, date: '2024-03-02', amount: 2200,  direction: 'Гурток «Науковий»', type: 'item',    itemTitle: 'Картина «Ранок у Карпатах»' },
  { id: 'tx-8',  userId: 0, date: '2024-03-01', amount: 800,   direction: '47-ма МАҐУРА',      type: 'service', itemTitle: 'Ремонт ноутбука' },
  { id: 'tx-9',  userId: 0, date: '2024-02-28', amount: 3200,  direction: '3-тя штурмова',     type: 'item',    itemTitle: 'Гітара Yamaha F310' },
  { id: 'tx-10', userId: 0, date: '2024-02-27', amount: 23850, direction: 'Розробка дронів',   type: 'item',    itemTitle: 'Стартовий пул зборів' },
];
// tx total: 4500+3500+2800+1500+3800+1200+2200+800+3200+23850 = 47350

// ─── localStorage helpers ─────────────────────────────────────────────────────

const KEYS = {
  items: 'gm_items',
  services: 'gm_services',
  transactions: 'gm_transactions',
};

function load<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch { /* ignore */ }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function save<T>(key: string, data: T[]): void {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getItems(): Item[] {
  return load<Item>(KEYS.items, SEED_ITEMS);
}

export function getServices(): Service[] {
  return load<Service>(KEYS.services, SEED_SERVICES);
}

export function getTransactions(): Transaction[] {
  return load<Transaction>(KEYS.transactions, SEED_TRANSACTIONS);
}

export function addItem(item: Item): void {
  const items = getItems();
  items.unshift(item);
  save(KEYS.items, items);
}

export function addService(service: Service): void {
  const services = getServices();
  services.unshift(service);
  save(KEYS.services, services);
}

export function addTransaction(tx: Transaction): void {
  const txs = getTransactions();
  txs.unshift(tx);
  save(KEYS.transactions, txs);
}

export function markItemSold(id: string): void {
  const items = getItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx !== -1) { items[idx].status = 'sold'; save(KEYS.items, items); }
}

export function markServiceSold(id: string): void {
  const services = getServices();
  const idx = services.findIndex(s => s.id === id);
  if (idx !== -1) { services[idx].status = 'sold'; save(KEYS.services, services); }
}

export function getTotalContributed(): number {
  return getTransactions().reduce((sum, t) => sum + t.amount, 0);
}

export function getUserContributions(userId: number): Transaction[] {
  return getTransactions().filter(t => t.userId === userId);
}

export function randomDirection(): string {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

export { DIRECTIONS };
export type { ItemCategory, ServiceCategory };
