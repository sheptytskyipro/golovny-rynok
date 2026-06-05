import { useState } from 'react';
import { Item, ItemCategory } from '../types';
import GlassCard from '../components/GlassCard';
import ItemCard from '../components/ItemCard';
import { useTelegram } from '../hooks/useTelegram';
import { getItems, addItem, addTransaction, markItemSold, randomDirection } from '../store';

const MOCK_CITIES = [
  {
    id: 'kyiv', name: 'Київ',
    branches: [
      'Відділення №1: вул. Хрещатик, 22',
      'Відділення №3: пр. Перемоги, 15',
      'Поштомат №12: ТРЦ Арена Сіті',
    ],
  },
  {
    id: 'lviv', name: 'Львів',
    branches: [
      'Відділення №2: вул. Городоцька, 189',
      'Відділення №5: вул. Стрийська, 45',
      'Поштомат №7: ТРЦ Форум Львів',
    ],
  },
  {
    id: 'kharkiv', name: 'Харків',
    branches: [
      'Відділення №1: пр. Науки, 14',
      'Відділення №4: вул. Клочківська, 192',
    ],
  },
  {
    id: 'odesa', name: 'Одеса',
    branches: [
      'Відділення №2: вул. Рішельєвська, 33',
      'Відділення №6: пр. Шевченка, 4',
    ],
  },
  {
    id: 'dnipro', name: 'Дніпро',
    branches: [
      'Відділення №3: вул. Робоча, 2а',
      'Відділення №8: пр. Гагаріна, 72',
    ],
  },
];

const EMOJI_OPTIONS = ['📱', '💻', '🎒', '📚', '🔦', '🎸', '🏂', '👕', '🎨', '🧸', '🔧', '🪑', '🎮', '📷', '⌚', '🚲', '👟', '🎁', '🌿', '🏺'];

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

type ViewMode = 'catalog' | 'detail' | 'sell' | 'delivery' | 'success';
type SortMode = 'newer' | 'cheaper' | 'pricier';

interface SellForm {
  title: string;
  description: string;
  legend: string;
  price: string;
  category: ItemCategory | '';
  city: string;
  imageEmoji: string;
}

export default function Items() {
  const { haptic, hapticSuccess, user } = useTelegram();
  const [items, setItems] = useState<Item[]>(() => getItems());
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newer');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [selectedCity, setSelectedCity] = useState<typeof MOCK_CITIES[0] | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [successDirection, setSuccessDirection] = useState('');
  const [sellForm, setSellForm] = useState<SellForm>({
    title: '', description: '', legend: '', price: '', category: '', city: '', imageEmoji: '📦',
  });

  const refreshItems = () => setItems(getItems());

  const filtered = items
    .filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortMode === 'newer') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortMode === 'cheaper') return a.price - b.price;
      return b.price - a.price;
    });

  const handleBuyClick = (item: Item) => {
    haptic('medium');
    setSelectedItem(item);
    setSelectedCity(null);
    setSelectedBranch(null);
    setViewMode('delivery');
  };

  const handleConfirmDelivery = () => {
    if (!selectedBranch || !selectedItem) return;
    hapticSuccess();
    const direction = randomDirection();
    setSuccessDirection(direction);
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: user?.id ?? 999999,
      date: new Date().toISOString().split('T')[0],
      amount: selectedItem.price,
      direction,
      type: 'item',
      itemTitle: selectedItem.title,
    });
    markItemSold(selectedItem.id);
    refreshItems();
    setViewMode('success');
  };

  const handleSubmitSell = () => {
    if (!sellForm.title || !sellForm.description || !sellForm.price || !sellForm.category || !sellForm.city) return;
    hapticSuccess();
    const newItem: Item = {
      id: `item-${Date.now()}`,
      sellerId: user?.id ?? 999999,
      sellerName: user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Гість',
      sellerCity: sellForm.city,
      title: sellForm.title,
      description: sellForm.description,
      legend: sellForm.legend,
      price: parseInt(sellForm.price, 10) || 0,
      category: sellForm.category as ItemCategory,
      city: sellForm.city,
      status: 'active',
      images: [sellForm.imageEmoji],
      createdAt: new Date().toISOString().split('T')[0],
    };
    addItem(newItem);
    refreshItems();
    setSellForm({ title: '', description: '', legend: '', price: '', category: '', city: '', imageEmoji: '📦' });
    setViewMode('catalog');
  };

  // SUCCESS view
  if (viewMode === 'success' && selectedItem) {
    return (
      <div className="page-container flex flex-col items-center text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#7CB342' }}>Дякуємо!</h2>
        <p className="text-base mb-1" style={{ color: '#2A2418' }}>Внесок зараховано</p>
        <p className="text-3xl font-bold mb-4" style={{ color: '#F4801A' }}>₴ {selectedItem.price.toLocaleString('uk-UA')}</p>
        <GlassCard strong className="p-4 w-full mb-4">
          <p className="text-sm font-medium mb-1" style={{ color: '#7CB342' }}>Напрям підтримки:</p>
          <p className="text-base font-bold" style={{ color: '#2A2418' }}>{successDirection}</p>
        </GlassCard>
        <GlassCard className="p-4 w-full mb-6">
          <p className="text-xs font-semibold mb-2" style={{ color: '#2A2418' }}>🧾 Квитанція</p>
          <div className="text-left space-y-1">
            <p className="text-xs" style={{ color: 'rgba(42,36,24,0.7)' }}>Товар: {selectedItem.title}</p>
            <p className="text-xs" style={{ color: 'rgba(42,36,24,0.7)' }}>Сума: ₴ {selectedItem.price.toLocaleString('uk-UA')}</p>
            <p className="text-xs" style={{ color: 'rgba(42,36,24,0.7)' }}>Відділення: {selectedBranch}</p>
            <p className="text-xs" style={{ color: 'rgba(42,36,24,0.7)' }}>Дата: {new Date().toLocaleDateString('uk-UA')}</p>
          </div>
        </GlassCard>
        <button className="btn-primary w-full" onClick={() => { setViewMode('catalog'); setSelectedItem(null); }}>
          Повернутись до каталогу
        </button>
      </div>
    );
  }

  // DELIVERY view
  if (viewMode === 'delivery' && selectedItem) {
    return (
      <div className="page-container">
        <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => setViewMode('detail')}>
          ← Назад
        </button>
        <h2 className="section-title">🚚 Обери відділення Нової Пошти</h2>
        <GlassCard className="p-4 mb-4">
          <p className="text-sm font-medium mb-1" style={{ color: '#2A2418' }}>{selectedItem.title}</p>
          <p className="text-lg font-bold" style={{ color: '#F4801A' }}>₴ {selectedItem.price.toLocaleString('uk-UA')}</p>
        </GlassCard>

        <div className="mb-4">
          <label className="text-sm font-medium block mb-2" style={{ color: '#2A2418' }}>Місто</label>
          <div className="space-y-2">
            {MOCK_CITIES.map(city => (
              <GlassCard
                key={city.id}
                className={`p-3 cursor-pointer ${selectedCity?.id === city.id ? 'ring-2 ring-orange-400' : ''}`}
                onClick={() => { haptic('light'); setSelectedCity(city); setSelectedBranch(null); }}
              >
                <p className="text-sm font-medium" style={{ color: '#2A2418' }}>{city.name}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {selectedCity && (
          <div className="mb-6">
            <label className="text-sm font-medium block mb-2" style={{ color: '#2A2418' }}>Відділення</label>
            <div className="space-y-2">
              {selectedCity.branches.map((branch, i) => (
                <GlassCard
                  key={i}
                  className={`p-3 cursor-pointer ${selectedBranch === branch ? 'ring-2 ring-orange-400' : ''}`}
                  onClick={() => { haptic('light'); setSelectedBranch(branch); }}
                >
                  <p className="text-xs" style={{ color: '#2A2418' }}>{branch}</p>
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

  // DETAIL view
  if (viewMode === 'detail' && selectedItem) {
    const emoji = selectedItem.images?.[0] || '📦';
    return (
      <div className="page-container">
        <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => setViewMode('catalog')}>
          ← До каталогу
        </button>

        <div className="w-full h-48 rounded-2xl flex items-center justify-center text-6xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(124,179,66,0.15), rgba(244,128,26,0.1))' }}>
          {emoji}
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
          <button className="btn-green w-full text-base" onClick={() => handleBuyClick(selectedItem)}>
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

  // SELL FORM view
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
            <input placeholder="Наприклад: iPhone 12, Рюкзак Osprey..." value={sellForm.title} onChange={e => setSellForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Опис *</label>
            <textarea rows={3} placeholder="Стан, комплектація, особливості..." value={sellForm.description} onChange={e => setSellForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#7CB342' }}>📖 Легенда речі (необов'язково)</label>
            <textarea rows={3} placeholder="Розкажіть історію цієї речі..." value={sellForm.legend} onChange={e => setSellForm(f => ({ ...f, legend: e.target.value }))} />
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

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: '#2A2418' }}>Емодзі-зображення</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center ${sellForm.imageEmoji === emoji ? 'ring-2 ring-orange-400' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.3)' }}
                  onClick={() => setSellForm(f => ({ ...f, imageEmoji: emoji }))}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <GlassCard strong className="p-4">
            <p className="text-xs" style={{ color: '#7CB342' }}>✅ Підтверджую, що 100% виторгу перейдуть на підтримку ЗСУ</p>
          </GlassCard>

          <button
            className="btn-primary w-full"
            disabled={!sellForm.title || !sellForm.description || !sellForm.price || !sellForm.category || !sellForm.city}
            style={{ opacity: (!sellForm.title || !sellForm.description || !sellForm.price || !sellForm.category || !sellForm.city) ? 0.5 : 1 }}
            onClick={handleSubmitSell}
          >
            🚀 Виставити на продаж
          </button>
        </div>
      </div>
    );
  }

  // CATALOG view
  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Речі</h2>
        <button className="btn-primary text-sm py-2 px-4" onClick={() => { haptic('light'); setViewMode('sell'); }}>
          + Виставити
        </button>
      </div>

      <div className="mb-4">
        <input placeholder="🔍 Пошук речей..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 pb-1">
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

      <div className="flex gap-2 mb-4">
        {(['newer', 'cheaper', 'pricier'] as SortMode[]).map(s => (
          <button
            key={s}
            className={`chip text-xs ${sortMode === s ? 'active' : ''}`}
            onClick={() => setSortMode(s)}
          >
            {s === 'newer' ? 'Новіші' : s === 'cheaper' ? 'Дешевші' : 'Дорожчі'}
          </button>
        ))}
      </div>

      <p className="text-xs mb-4" style={{ color: 'rgba(42,36,24,0.5)' }}>
        {filtered.length} {filtered.length === 1 ? 'оголошення' : 'оголошень'}
      </p>

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
