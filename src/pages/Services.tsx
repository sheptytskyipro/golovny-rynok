import { useState } from 'react';
import { Service, ServiceCategory } from '../types';
import GlassCard from '../components/GlassCard';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTelegram } from '../hooks/useTelegram';

const categories: { id: ServiceCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'Усі', emoji: '🌐' },
  { id: 'освіта', label: 'Освіта', emoji: '📚' },
  { id: 'дизайн', label: 'Дизайн', emoji: '🎨' },
  { id: 'IT', label: 'IT', emoji: '💻' },
  { id: 'ремонт', label: 'Ремонт', emoji: '🔨' },
  { id: 'фото/відео', label: 'Фото/Відео', emoji: '📸' },
  { id: 'краса', label: 'Краса', emoji: '💄' },
  { id: 'переклади', label: 'Переклади', emoji: '🌐' },
  { id: 'юридичні', label: 'Юридичні', emoji: '⚖️' },
];

const mockServices: Service[] = [
  {
    id: 's1', providerId: 1, providerName: 'Олена Коваль',
    title: 'Курс англійської мови для початківців (8 занять)',
    description: 'Базовий курс розмовної англійської. Заняття 1 год, онлайн. Сертифікат після завершення.',
    price: 2400, category: 'освіта', format: 'онлайн', duration: '8 год',
    status: 'active', createdAt: '2024-02-15',
  },
  {
    id: 's2', providerId: 2, providerName: 'Артем Дизайн',
    title: 'Дизайн логотипу та фірмового стилю',
    description: 'Повний фірмовий стиль: логотип, кольорова палітра, шрифти, візитки. До 3 варіантів.',
    price: 3500, category: 'дизайн', format: 'онлайн', duration: '5-7 днів',
    status: 'active', createdAt: '2024-02-12',
  },
  {
    id: 's3', providerId: 3, providerName: 'Микола Dev',
    title: 'Landing page на React (повністю адаптивна)',
    description: 'Сучасний лендінг на React + TypeScript. SEO-оптимізація, мобільна версія, анімації.',
    price: 8000, category: 'IT', format: 'онлайн', duration: '7-10 днів',
    status: 'active', createdAt: '2024-02-10',
  },
  {
    id: 's4', providerId: 4, providerName: 'Іван Майстер',
    title: 'Ремонт ноутбука (діагностика + ремонт)',
    description: 'Повна діагностика, заміна термопасти, чищення від пилу, ремонт клавіатури чи екрану.',
    price: 800, category: 'ремонт', format: 'офлайн', duration: '1-2 дні',
    status: 'active', createdAt: '2024-02-08',
  },
  {
    id: 's5', providerId: 5, providerName: 'Аліна Фото',
    title: 'Фотосесія (портретна, 2 год, 30 фото)',
    description: 'Портретна або сімейна фотосесія. Ретушування 30 фото, передача у форматі JPG та RAW.',
    price: 2800, category: 'фото/відео', format: 'офлайн', duration: '2 год',
    status: 'active', createdAt: '2024-02-05',
  },
  {
    id: 's6', providerId: 6, providerName: 'Катерина Ю.',
    title: 'Консультація юриста (1 год)',
    description: 'Юридична консультація з будь-яких питань: нерухомість, трудові спори, сімейне право.',
    price: 1200, category: 'юридичні', format: 'онлайн/офлайн', duration: '1 год',
    status: 'active', createdAt: '2024-02-03',
  },
];

type ViewMode = 'catalog' | 'detail' | 'offer' | 'checkout';

export default function Services() {
  const { haptic, hapticSuccess } = useTelegram();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [isLoading, setIsLoading] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: '', description: '', price: '', category: '' as ServiceCategory | '',
    format: '' as Service['format'] | '', duration: '',
  });

  const filtered = mockServices.filter(s => activeCategory === 'all' || s.category === activeCategory);

  const handlePay = async () => {
    if (!selectedService) return;
    setIsLoading(true);
    haptic('medium');
    try {
      await new Promise(r => setTimeout(r, 1500));
      setContactRevealed(true);
    } catch {
      alert('Помилка оплати');
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === 'checkout' && selectedService) {
    return (
      <div className="page-container">
        <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => setViewMode('detail')}>
          ← Назад
        </button>
        <h2 className="section-title">💳 Оплата послуги</h2>

        <GlassCard strong className="p-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold flex-1 pr-2" style={{ color: '#2A2418' }}>{selectedService.title}</h3>
            <span className="badge-zsu">100% → ЗСУ</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#F4801A' }}>₴ {selectedService.price.toLocaleString('uk-UA')}</p>
          <div className="flex gap-2 mt-2">
            <span className="chip text-xs py-1">{selectedService.format}</span>
            <span className="chip text-xs py-1">{selectedService.duration}</span>
          </div>
        </GlassCard>

        {contactRevealed ? (
          <GlassCard strong className="p-4 mb-6">
            <h3 className="font-semibold mb-2" style={{ color: '#7CB342' }}>✅ Оплата підтверджена!</h3>
            <p className="text-sm mb-3" style={{ color: '#2A2418' }}>Контактні дані виконавця:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>👤</span>
                <span className="text-sm" style={{ color: '#2A2418' }}>{selectedService.providerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span className="text-sm" style={{ color: '#F4801A' }}>@{selectedService.providerName.toLowerCase().replace(' ', '_')}</span>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: 'rgba(42,36,24,0.5)' }}>Дякуємо! Ваш внесок іде на підтримку ЗСУ 🇺🇦</p>
          </GlassCard>
        ) : (
          <>
            <GlassCard className="p-4 mb-6">
              <p className="text-sm font-medium mb-2" style={{ color: '#2A2418' }}>Після оплати ви отримаєте:</p>
              <ul className="space-y-1">
                <li className="text-sm flex gap-2" style={{ color: 'rgba(42,36,24,0.7)' }}>
                  <span style={{ color: '#7CB342' }}>✓</span> Контакти виконавця
                </li>
                <li className="text-sm flex gap-2" style={{ color: 'rgba(42,36,24,0.7)' }}>
                  <span style={{ color: '#7CB342' }}>✓</span> Підтвердження внеску до ЗСУ
                </li>
                <li className="text-sm flex gap-2" style={{ color: 'rgba(42,36,24,0.7)' }}>
                  <span style={{ color: '#7CB342' }}>✓</span> Чек про благодійний платіж
                </li>
              </ul>
            </GlassCard>
            <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={handlePay} disabled={isLoading}>
              {isLoading ? <LoadingSpinner size={20} /> : <>💳 Оплатити через LiqPay</>}
            </button>
          </>
        )}

        {contactRevealed && (
          <button className="btn-green w-full mt-3" onClick={() => { setViewMode('catalog'); setContactRevealed(false); setSelectedService(null); }}>
            Повернутись до послуг
          </button>
        )}
      </div>
    );
  }

  if (viewMode === 'detail' && selectedService) {
    return (
      <div className="page-container">
        <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => setViewMode('catalog')}>
          ← До каталогу
        </button>

        <div className="w-full h-32 rounded-2xl flex items-center justify-center text-5xl mb-4" style={{ background: 'linear-gradient(135deg, rgba(124,179,66,0.15), rgba(244,128,26,0.1))' }}>
          {categories.find(c => c.id === selectedService.category)?.emoji || '⚡'}
        </div>

        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-bold flex-1 pr-4" style={{ color: '#2A2418' }}>{selectedService.title}</h2>
          <span className="badge-zsu mt-1">100% → ЗСУ</span>
        </div>

        <p className="text-2xl font-bold mb-2" style={{ color: '#F4801A' }}>₴ {selectedService.price.toLocaleString('uk-UA')}</p>

        <div className="flex gap-2 mb-4">
          <span className="chip text-xs">{selectedService.format}</span>
          <span className="chip text-xs">⏱ {selectedService.duration}</span>
          <span className="chip text-xs">{selectedService.category}</span>
        </div>

        <GlassCard className="p-4 mb-4">
          <h3 className="font-semibold text-sm mb-2" style={{ color: '#2A2418' }}>Опис послуги</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(42,36,24,0.7)' }}>{selectedService.description}</p>
        </GlassCard>

        <GlassCard className="p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #7CB342, #8BC34A)' }}>
              👤
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#2A2418' }}>{selectedService.providerName}</p>
              <p className="text-xs" style={{ color: 'rgba(42,36,24,0.5)' }}>Контакти будуть доступні після оплати</p>
            </div>
          </div>
        </GlassCard>

        <button className="btn-green w-full text-base" onClick={() => { haptic('medium'); setViewMode('checkout'); }}>
          💙 Купити послугу = внесок до ЗСУ
        </button>
      </div>
    );
  }

  if (viewMode === 'offer') {
    return (
      <div className="page-container">
        <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => setViewMode('catalog')}>
          ← До каталогу
        </button>
        <h2 className="section-title">⚡ Запропонувати послугу</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Назва послуги *</label>
            <input placeholder="Наприклад: Курс Python для початківців" value={offerForm.title} onChange={e => setOfferForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Опис *</label>
            <textarea rows={4} placeholder="Що включає послуга? Що отримає покупець?" value={offerForm.description} onChange={e => setOfferForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Ціна (₴) *</label>
            <input type="number" placeholder="0" value={offerForm.price} onChange={e => setOfferForm(f => ({ ...f, price: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: '#2A2418' }}>Категорія *</label>
            <div className="flex flex-wrap gap-2">
              {categories.filter(c => c.id !== 'all').map(cat => (
                <button key={cat.id} className={`chip ${offerForm.category === cat.id ? 'active' : ''}`} onClick={() => setOfferForm(f => ({ ...f, category: cat.id as ServiceCategory }))}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: '#2A2418' }}>Формат</label>
            <div className="flex gap-2">
              {(['онлайн', 'офлайн', 'онлайн/офлайн'] as const).map(f => (
                <button key={f} className={`chip ${offerForm.format === f ? 'active' : ''}`} onClick={() => setOfferForm(form => ({ ...form, format: f }))}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Тривалість</label>
            <input placeholder="Наприклад: 1 год, 3 дні, 2 тижні" value={offerForm.duration} onChange={e => setOfferForm(f => ({ ...f, duration: e.target.value }))} />
          </div>

          <GlassCard strong className="p-4">
            <p className="text-xs" style={{ color: '#7CB342' }}>✅ Підтверджую, що 100% від оплати послуги перейдуть на підтримку ЗСУ</p>
          </GlassCard>

          <button
            className="btn-primary w-full"
            disabled={!offerForm.title || !offerForm.description || !offerForm.price || !offerForm.category}
            style={{ opacity: (!offerForm.title || !offerForm.description || !offerForm.price || !offerForm.category) ? 0.5 : 1 }}
            onClick={() => {
              hapticSuccess();
              alert('Послугу відправлено на модерацію! 🎉');
              setViewMode('catalog');
            }}
          >
            🚀 Запропонувати послугу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Послуги</h2>
        <button className="btn-primary text-sm py-2 px-4" onClick={() => { haptic('light'); setViewMode('offer'); }}>
          + Запропонувати
        </button>
      </div>

      <GlassCard className="p-3 mb-4 flex items-center gap-2">
        <span className="text-lg">💡</span>
        <p className="text-xs" style={{ color: 'rgba(42,36,24,0.7)' }}>Купуй послугу → вноси в ЗСУ. Контакт виконавця відкривається після оплати.</p>
      </GlassCard>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {categories.map(cat => (
          <button key={cat.id} className={`chip flex-shrink-0 ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => { haptic('light'); setActiveCategory(cat.id); }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(service => (
          <ServiceCard key={service.id} service={service} onClick={() => { haptic('light'); setSelectedService(service); setViewMode('detail'); }} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl">🔍</span>
          <p className="mt-3 font-medium" style={{ color: 'rgba(42,36,24,0.6)' }}>Послуги не знайдено</p>
        </div>
      )}
    </div>
  );
}
