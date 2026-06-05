import { useState } from 'react';
import { Item, ItemCategory } from '../types';
import GlassCard from '../components/GlassCard';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTelegram } from '../hooks/useTelegram';
import { generateOrderId, openLiqPayForm } from '../utils/liqpay';
import { searchCities, getBranches, mockCities, mockBranches } from '../utils/novaPoshta';
import type { NovaPoshtaCity, NovaPoshta } from '../utils/novaPoshta';

const categories: { id: ItemCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'Усі', emoji: '🌐' },
  { id: 'техніка', label: 'Техніка', emoji: '💻' },
  { id: 'інструменти', label: 'Інструменти', emoji: '🔧' },
  { id: 'туризм', label: 'Туризм', emoji: '🏕️' },
  { id: 'одяг', label: 'Одяг', emoji: '👕' },
  { id: 'дім', label: 'Дім', emoji: '🏠' },
  { id: 'дитяче', label: 'Дитяче', emoji: '🧸' },
  { id: 'авто', label: 'Авто', emoji: '🚗' },
  { id: 'хобі', label: 'Хобі', emoji: '🎨' },
  { id: 'вінтаж', label: 'Вінтаж', emoji: '🕰️' },
  { id: 'хендмейд', label: 'Хендмейд', emoji: '✂️' },
  { id: 'спорядження', label: 'Спорядження', emoji: '⛺' },
  { id: 'книги', label: 'Книги', emoji: '📚' },
];

const mockItems: Item[] = [
  {
    id: '1', sellerId: 1, sellerName: 'Олена К.', sellerCity: 'Київ',
    title: 'Ноутбук Dell Latitude 5520, i5, 16GB RAM',
    description: 'Відмінний стан, працює бездоганно. Купила новий, цей більше не потрібен.',
    legend: 'Цей ноутбук пережив два переїзди і написання дисертації. Час йому допомагати далі — тепер у більш важливій справі.',
    price: 18500, category: 'техніка', city: 'Київ', status: 'active',
    images: [], createdAt: '2024-02-15',
  },
  {
    id: '2', sellerId: 2, sellerName: 'Микола Д.', sellerCity: 'Львів',
    title: 'Набір туристичного спорядження (рюкзак + намет)',
    description: 'Рюкзак 65л + 2-місний намет. Використовувалось 3 рази, відмінний стан.',
    legend: 'Купував для походів, які відклали через війну. Нехай це спорядження служить тим, хто захищає наші ліси.',
    price: 4200, category: 'туризм', city: 'Львів', status: 'active',
    images: [], createdAt: '2024-02-10',
  },
  {
    id: '3', sellerId: 3, sellerName: 'Анна М.', sellerCity: 'Дніпро',
    title: 'Дитячий велосипед Trek 20" (8-12 років)',
    description: 'Синього кольору, гарний стан. Дитина виросла.',
    legend: 'На ньому моя донька навчилась їздити на велосипеді. Тепер вона підросла, а велосипед ще може принести радість і допомогти ЗСУ.',
    price: 2800, category: 'дитяче', city: 'Дніпро', status: 'active',
    images: [], createdAt: '2024-02-08',
  },
  {
    id: '4', sellerId: 4, sellerName: 'Ігор П.', sellerCity: 'Харків',
    title: 'Дриль Bosch Professional + насадки (50 шт)',
    description: 'Потужний дриль 800Вт, набір з 50 насадок. В ідеальному стані.',
    price: 3600, category: 'інструменти', city: 'Харків', status: 'active',
    images: [], createdAt: '2024-02-05',
  },
  {
    id: '5', sellerId: 5, sellerName: 'Марія В.', sellerCity: 'Одеса',
    title: 'Вінтажна швейна машина Singer (1965 р.)',
    description: 'Повністю робоча, є голки та нитки. Справжній раритет.',
    legend: 'Дісталась від бабусі. Вона шила на ній одяг для всієї родини. Тепер ця машина може допомогти у зовсім інший спосіб.',
    price: 5500, category: 'вінтаж', city: 'Одеса', status: 'active',
    images: [], createdAt: '2024-02-03',
  },
  {
    id: '6', sellerId: 6, sellerName: 'Степан Б.', sellerCity: 'Запоріжжя',
    title: 'Гірські лижі Rossignol + черевики (р. 42)',
    description: 'Лижі 170 см + черевики 42 розмір. Сезон 2022, відмінний стан.',
    price: 7200, category: 'спорядження', city: 'Запоріжжя', status: 'active',
    images: [], createdAt: '2024-01-28',
  },
  {
    id: '7', sellerId: 7, sellerName: 'Олексій Т.', sellerCity: 'Київ',
    title: 'Колекція книг "Українська класика" (20 томів)',
    description: 'Шевченко, Франко, Леся Українка та ін. Повне зібрання творів.',
    price: 1800, category: 'книги', city: 'Київ', status: 'active',
    images: [], createdAt: '2024-01-25',
  },
  {
    id: '8', sellerId: 8, sellerName: 'Галина Р.', sellerCity: 'Львів',
    title: 'Зимова куртка пухова Columbia (р. L, жіноча)',
    description: 'Куртка-пуховик, колір темно-синій. Носили 1 сезон, відмінний стан.',
    price: 2200, category: 'одяг', city: 'Львів', status: 'active',
    images: [], createdAt: '2024-01-22',
  },
  {
    id: '9', sellerId: 9, sellerName: 'Василь К.', sellerCity: 'Дніпро',
    title: 'Хендмейд керамічний посуд (набір 6 предметів)',
    description: 'Авторська робота, ручний розпис. Кружки та тарілки.',
    legend: 'Кожен виріб — це години роботи та любов до нашої землі. Купуючи це, ви не просто підтримуєте ЗСУ — ви цінуєте українське мистецтво.',
    price: 3200, category: 'хендмейд', city: 'Дніпро', status: 'active',
    images: [], createdAt: '2024-01-20',
  },
  {
    id: '10', sellerId: 10, sellerName: 'Тетяна П.', sellerCity: 'Харків',
    title: 'Радіокерована модель літака (для дорослих)',
    description: 'Масштаб 1:8, розмах крил 120 см. Повний комплект, акумулятори.',
    price: 6800, category: 'хобі', city: 'Харків', status: 'sold',
    images: [], createdAt: '2024-01-18',
  },
];

type ViewMode = 'catalog' | 'detail' | 'sell' | 'checkout' | 'delivery';

export default function Items() {
  const { haptic, hapticSuccess } = useTelegram();
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [isLoading, setIsLoading] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState<NovaPoshtaCity[]>(mockCities);
  const [selectedCity, setSelectedCity] = useState<NovaPoshtaCity | null>(null);
  const [branches, setBranches] = useState<NovaPoshta[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<NovaPoshta | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);

  // Sell form state
  const [sellForm, setSellForm] = useState({
    title: '', description: '', legend: '', price: '', category: '' as ItemCategory | '', city: '',
  });

  const filtered = mockItems.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCitySearch = async (q: string) => {
    setCityQuery(q);
    if (q.length >= 2) {
      const results = await searchCities(q);
      setCities(results.length > 0 ? results : mockCities.filter(c => c.description.toLowerCase().includes(q.toLowerCase())));
    }
  };

  const handleCitySelect = async (city: NovaPoshtaCity) => {
    setSelectedCity(city);
    setCityQuery(city.description);
    setCities([]);
    const b = await getBranches(city.ref);
    setBranches(b.length > 0 ? b : mockBranches);
  };

  const handleBuy = (item: Item) => {
    haptic('medium');
    setSelectedItem(item);
    setViewMode('checkout');
  };

  const handlePayment = async () => {
    if (!selectedItem) return;
    setIsLoading(true);
    haptic('medium');
    try {
      // Mock payment flow since we don't have real credentials
      await new Promise(r => setTimeout(r, 1500));
      setViewMode('delivery');
    } catch {
      alert('Помилка оплати. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelivery = () => {
    if (!selectedBranch) return;
    hapticSuccess();
    setPaymentDone(true);
  };

  if (paymentDone && selectedItem) {
    return (
      <div className="page-container flex flex-col items-center text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#7CB342' }}>Дякуємо!</h2>
        <p className="text-base mb-4" style={{ color: '#2A2418' }}>Ваш внесок на суму</p>
        <p className="text-3xl font-bold mb-4" style={{ color: '#F4801A' }}>₴ {selectedItem.price.toLocaleString('uk-UA')}</p>
        <p className="mb-2" style={{ color: 'rgba(42,36,24,0.7)' }}>іде 100% на підтримку ЗСУ 🇺🇦</p>
        <p className="text-sm mb-6" style={{ color: 'rgba(42,36,24,0.5)' }}>Доставка на відділення: {selectedBranch?.description}</p>
        <GlassCard strong className="p-4 w-full mb-6">
          <p className="text-sm font-medium" style={{ color: '#7CB342' }}>🏆 Ваш слід в обороні України</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(42,36,24,0.6)' }}>Кожна покупка — це крок до перемоги</p>
        </GlassCard>
        <button className="btn-primary w-full" onClick={() => { setPaymentDone(false); setViewMode('catalog'); setSelectedItem(null); }}>
          Повернутись до каталогу
        </button>
      </div>
    );
  }

  if (viewMode === 'delivery' && selectedItem) {
    return (
      <div className="page-container">
        <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => setViewMode('checkout')}>
          ← Назад
        </button>
        <h2 className="section-title">🚚 Обери відділення Нової Пошти</h2>
        <GlassCard className="p-4 mb-4">
          <p className="text-sm font-medium mb-1" style={{ color: '#2A2418' }}>{selectedItem.title}</p>
          <p className="text-lg font-bold" style={{ color: '#F4801A' }}>₴ {selectedItem.price.toLocaleString('uk-UA')}</p>
        </GlassCard>

        <div className="mb-4">
          <label className="text-sm font-medium block mb-2" style={{ color: '#2A2418' }}>Місто</label>
          <input
            placeholder="Введіть назву міста..."
            value={cityQuery}
            onChange={e => handleCitySearch(e.target.value)}
          />
          {cities.length > 0 && cityQuery.length >= 2 && !selectedCity && (
            <div className="glass-card mt-2 overflow-hidden">
              {cities.slice(0, 5).map(city => (
                <button
                  key={city.ref}
                  className="w-full text-left px-4 py-3 text-sm border-b border-white/20 last:border-0"
                  style={{ color: '#2A2418' }}
                  onClick={() => handleCitySelect(city)}
                >
                  {city.description}
                </button>
              ))}
            </div>
          )}
        </div>

        {branches.length > 0 && (
          <div className="mb-6">
            <label className="text-sm font-medium block mb-2" style={{ color: '#2A2418' }}>Відділення</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {branches.slice(0, 8).map(branch => (
                <GlassCard
                  key={branch.ref}
                  className={`p-3 cursor-pointer ${selectedBranch?.ref === branch.ref ? 'ring-2 ring-orange-400' : ''}`}
                  onClick={() => { haptic('light'); setSelectedBranch(branch); }}
                >
                  <p className="text-xs" style={{ color: '#2A2418' }}>{branch.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        <button
          className="btn-green w-full"
          disabled={!selectedBranch}
          style={{ opacity: selectedBranch ? 1 : 0.5 }}
          onClick={handleConfirmDelivery}
        >
          ✅ Підтвердити замовлення
        </button>
      </div>
    );
  }

  if (viewMode === 'checkout' && selectedItem) {
    return (
      <div className="page-container">
        <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => setViewMode('detail')}>
          ← Назад
        </button>
        <h2 className="section-title">💳 Оплата = Внесок до ЗСУ</h2>

        <GlassCard strong className="p-4 mb-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-base flex-1 pr-4" style={{ color: '#2A2418' }}>{selectedItem.title}</h3>
            <span className="badge-zsu">100% → ЗСУ</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#F4801A' }}>₴ {selectedItem.price.toLocaleString('uk-UA')}</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(42,36,24,0.5)' }}>Продавець: {selectedItem.sellerName} • {selectedItem.city}</p>
        </GlassCard>

        <GlassCard className="p-4 mb-6">
          <h3 className="font-semibold text-sm mb-3" style={{ color: '#2A2418' }}>Куди йдуть кошти:</h3>
          <div className="space-y-2">
            {[
              { icon: '🚁', text: 'Розробка FPV-дронів та «Змія»', pct: '40%' },
              { icon: '🔬', text: 'Гурток «Науковий»', pct: '25%' },
              { icon: '⚔️', text: '3-тя штурмова бригада', pct: '20%' },
              { icon: '🛡️', text: '47-ма бригада МАҐУРА', pct: '15%' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="flex-1 text-xs" style={{ color: 'rgba(42,36,24,0.7)' }}>{item.text}</span>
                <span className="text-xs font-semibold" style={{ color: '#7CB342' }}>{item.pct}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size={20} /> : <>💳 Оплатити через LiqPay</>}
        </button>
        <p className="text-center text-xs mt-3" style={{ color: 'rgba(42,36,24,0.4)' }}>Безпечна оплата · 100% → ЗСУ</p>
      </div>
    );
  }

  if (viewMode === 'detail' && selectedItem) {
    return (
      <div className="page-container">
        <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => setViewMode('catalog')}>
          ← До каталогу
        </button>

        <div className="w-full h-48 rounded-2xl flex items-center justify-center text-6xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(124,179,66,0.15), rgba(244,128,26,0.1))' }}>
          📦
        </div>

        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold flex-1 pr-4" style={{ color: '#2A2418' }}>{selectedItem.title}</h2>
          <span className="badge-zsu mt-1">100% → ЗСУ</span>
        </div>

        <p className="text-2xl font-bold mb-1" style={{ color: '#F4801A' }}>₴ {selectedItem.price.toLocaleString('uk-UA')}</p>
        <p className="text-sm mb-4" style={{ color: 'rgba(42,36,24,0.5)' }}>📍 {selectedItem.city} · {selectedItem.sellerName}</p>

        <GlassCard className="p-4 mb-4">
          <h3 className="font-semibold text-sm mb-2" style={{ color: '#2A2418' }}>Опис</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(42,36,24,0.7)' }}>{selectedItem.description}</p>
        </GlassCard>

        {selectedItem.legend && (
          <GlassCard strong className="p-4 mb-4">
            <h3 className="font-semibold text-sm mb-2" style={{ color: '#7CB342' }}>📖 Легенда речі</h3>
            <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(42,36,24,0.7)' }}>"{selectedItem.legend}"</p>
          </GlassCard>
        )}

        <GlassCard className="p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #7CB342, #8BC34A)' }}>
              👤
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#2A2418' }}>{selectedItem.sellerName}</p>
              <p className="text-xs" style={{ color: 'rgba(42,36,24,0.5)' }}>📍 {selectedItem.sellerCity}</p>
            </div>
          </div>
        </GlassCard>

        {selectedItem.status === 'active' ? (
          <button className="btn-green w-full text-base" onClick={() => handleBuy(selectedItem)}>
            💙 Купити = внесок до ЗСУ
          </button>
        ) : (
          <div className="w-full py-3 text-center rounded-xl font-semibold text-sm" style={{ background: 'rgba(0,0,0,0.1)', color: 'rgba(42,36,24,0.4)' }}>
            Вже продано
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'sell') {
    return (
      <div className="page-container">
        <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => setViewMode('catalog')}>
          ← До каталогу
        </button>
        <h2 className="section-title">📦 Виставити річ</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Назва *</label>
            <input placeholder="Наприклад: Ноутбук Dell, 16GB RAM" value={sellForm.title} onChange={e => setSellForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Опис *</label>
            <textarea rows={3} placeholder="Стан, комплектація, особливості..." value={sellForm.description} onChange={e => setSellForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#7CB342' }}>📖 Легенда речі (необов'язково)</label>
            <textarea rows={3} placeholder="Розкажіть історію цієї речі. Чому вона для вас важлива? Звідки вона прийшла?" value={sellForm.legend} onChange={e => setSellForm(f => ({ ...f, legend: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Ціна (₴) *</label>
            <input type="number" placeholder="0" value={sellForm.price} onChange={e => setSellForm(f => ({ ...f, price: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: '#2A2418' }}>Категорія *</label>
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c.id !== 'all').map(cat => (
                <button
                  key={cat.id}
                  className={`chip ${sellForm.category === cat.id ? 'active' : ''}`}
                  onClick={() => setSellForm(f => ({ ...f, category: cat.id as ItemCategory }))}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Місто *</label>
            <input placeholder="Ваше місто" value={sellForm.city} onChange={e => setSellForm(f => ({ ...f, city: e.target.value }))} />
          </div>

          <div className="glass-card-strong p-4">
            <p className="text-xs" style={{ color: '#7CB342' }}>✅ Підтверджую, що 100% виторгу перейдуть на підтримку ЗСУ через фонд "Support Ukraine"</p>
          </div>

          <button
            className="btn-primary w-full"
            disabled={!sellForm.title || !sellForm.description || !sellForm.price || !sellForm.category || !sellForm.city}
            style={{ opacity: (!sellForm.title || !sellForm.description || !sellForm.price || !sellForm.category || !sellForm.city) ? 0.5 : 1 }}
            onClick={() => {
              hapticSuccess();
              alert('Оголошення відправлено на модерацію! 🎉');
              setViewMode('catalog');
              setSellForm({ title: '', description: '', legend: '', price: '', category: '', city: '' });
            }}
          >
            🚀 Виставити на продаж
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Речі</h2>
        <button className="btn-primary text-sm py-2 px-4" onClick={() => { haptic('light'); setViewMode('sell'); }}>
          + Виставити
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input placeholder="🔍 Пошук речей..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`chip flex-shrink-0 ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => { haptic('light'); setActiveCategory(cat.id); }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs mb-4" style={{ color: 'rgba(42,36,24,0.5)' }}>
        {filtered.length} {filtered.length === 1 ? 'оголошення' : 'оголошень'} • Відображаються активні
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => { haptic('light'); setSelectedItem(item); setViewMode('detail'); }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl">🔍</span>
          <p className="mt-3 font-medium" style={{ color: 'rgba(42,36,24,0.6)' }}>Нічого не знайдено</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(42,36,24,0.4)' }}>Спробуй інші фільтри</p>
        </div>
      )}
    </div>
  );
}
