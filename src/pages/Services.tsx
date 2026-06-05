import { useState } from 'react';
import { Service, ServiceCategory } from '../types';
import GlassCard from '../components/GlassCard';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTelegram } from '../hooks/useTelegram';
import { getServices, addService, addTransaction, markServiceSold, randomDirection } from '../store';

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

const EMOJI_OPTIONS = ['💻', '🎨', '🔧', '📸', '📝', '⚖️', '🎓', '🌍', '🎵', '🏋️', '🍳', '✂️'];

type ViewMode = 'catalog' | 'detail' | 'offer' | 'checkout' | 'success';
type FormatFilter = 'all' | 'онлайн' | 'офлайн';

export default function Services() {
  const { haptic, hapticSuccess, user } = useTelegram();
  const [services, setServices] = useState<Service[]>(() => getServices());
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [isLoading, setIsLoading] = useState(false);
  const [successDirection, setSuccessDirection] = useState('');
  const [offerForm, setOfferForm] = useState({
    title: '', description: '', price: '', category: '' as ServiceCategory | '',
    format: '' as Service['format'] | '', duration: '', contact: '', emoji: '💻',
  });

  const refreshServices = () => setServices(getServices());

  const filtered = services.filter(s => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (formatFilter !== 'all' && !s.format.includes(formatFilter)) return false;
    return true;
  });

  const handlePay = async () => {
    if (!selectedService) return;
    setIsLoading(true);
    haptic('medium');
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    const direction = randomDirection();
    setSuccessDirection(direction);
    addTransaction({
      id: `tx-${Date.now()}`,
      userId: user?.id ?? 999999,
      date: new Date().toISOString().split('T')[0],
      amount: selectedService.price,
      direction,
      type: 'service',
      itemTitle: selectedService.title,
    });
    markServiceSold(selectedService.id);
    refreshServices();
    setViewMode('success');
  };

  const handleSubmitOffer = () => {
    if (!offerForm.title || !offerForm.description || !offerForm.price || !offerForm.category) return;
    hapticSuccess();
    const newService: Service = {
      id: `svc-${Date.now()}`,
      providerId: user?.id ?? 999999,
      providerName: user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Гість',
      title: offerForm.title,
      description: offerForm.description,
      price: parseInt(offerForm.price, 10) || 0,
      category: offerForm.category as ServiceCategory,
      format: (offerForm.format || 'онлайн') as Service['format'],
      duration: offerForm.duration || '—',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    addService(newService);
    refreshServices();
    setOfferForm({ title: '', description: '', price: '', category: '', format: '', duration: '', contact: '', emoji: '💻' });
    setViewMode('catalog');
  };

  // SUCCESS view
  if (viewMode === 'success' && selectedService) {
    return (
      <div className="page-container flex flex-col items-center text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#7CB342' }}>Внесок зараховано!</h2>
        <p className="text-3xl font-bold mb-4" style={{ color: '#F4801A' }}>₴ {selectedService.price.toLocaleString('uk-UA')}</p>
        <GlassCard strong className="p-4 w-full mb-4">
          <p className="text-sm font-medium mb-1" style={{ color: '#7CB342' }}>Напрям підтримки:</p>
          <p className="text-base font-bold" style={{ color: '#2A2418' }}>{successDirection}</p>
        </GlassCard>
        <GlassCard className="p-4 w-full mb-6">
          <p className="text-xs font-semibold mb-2" style={{ color: '#2A2418' }}>Контактні дані виконавця:</p>
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span>👤</span>
              <span className="text-sm" style={{ color: '#2A2418' }}>{selectedService.providerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <span className="text-sm" style={{ color: '#F4801A' }}>
                @{selectedService.providerName.toLowerCase().replace(/\s+/g, '_')}
              </span>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: 'rgba(42,36,24,0.5)' }}>Дякуємо! Ваш внесок іде на підтримку ЗСУ 🇺🇦</p>
        </GlassCard>
        <button className="btn-green w-full" onClick={() => { setViewMode('catalog'); setSelectedService(null); }}>
          Повернутись до послуг
        </button>
      </div>
    );
  }

  // CHECKOUT view
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

        {/* Fake LiqPay-style card UI */}
        <GlassCard className="p-4 mb-4">
          <p className="text-sm font-semibold mb-3" style={{ color: '#2A2418' }}>💳 Дані картки (демо)</p>
          <div className="space-y-3">
            <input placeholder="0000 0000 0000 0000" disabled className="opacity-60" />
            <div className="flex gap-3">
              <input placeholder="MM/YY" disabled className="opacity-60 flex-1" />
              <input placeholder="CVV" disabled className="opacity-60 flex-1" />
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: 'rgba(42,36,24,0.4)' }}>* Демо-режим. Реальна оплата не проводиться.</p>
        </GlassCard>

        <GlassCard className="p-4 mb-6">
          <p className="text-sm font-medium mb-2" style={{ color: '#2A2418' }}>Після оплати ви отримаєте:</p>
          <ul className="space-y-1">
            <li className="text-sm flex gap-2" style={{ color: 'rgba(42,36,24,0.7)' }}>
              <span style={{ color: '#7CB342' }}>✓</span> Контакти виконавця
            </li>
            <li className="text-sm flex gap-2" style={{ color: 'rgba(42,36,24,0.7)' }}>
              <span style={{ color: '#7CB342' }}>✓</span> Підтвердження внеску до ЗСУ
            </li>
          </ul>
        </GlassCard>

        <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={handlePay} disabled={isLoading}>
          {isLoading ? <LoadingSpinner size={20} /> : <>💳 Оплатити (демо)</>}
        </button>
        <p className="text-center text-xs mt-3" style={{ color: 'rgba(42,36,24,0.4)' }}>Демо-режим · 100% → ЗСУ</p>
      </div>
    );
  }

  // DETAIL view
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

        {selectedService.status === 'active' ? (
          <button className="btn-green w-full text-base" onClick={() => { haptic('medium'); setViewMode('checkout'); }}>
            💙 Купити послугу = внесок до ЗСУ
          </button>
        ) : (
          <div className="w-full py-3 text-center rounded-xl font-semibold text-sm" style={{ background: 'rgba(0,0,0,0.1)', color: 'rgba(42,36,24,0.4)' }}>
            Вже придбано
          </div>
        )}
      </div>
    );
  }

  // OFFER FORM view
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

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#2A2418' }}>Контакт (email або Telegram)</label>
            <input placeholder="email або @username" value={offerForm.contact} onChange={e => setOfferForm(f => ({ ...f, contact: e.target.value }))} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: '#2A2418' }}>Емодзі</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center ${offerForm.emoji === emoji ? 'ring-2 ring-orange-400' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.3)' }}
                  onClick={() => setOfferForm(f => ({ ...f, emoji }))}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <GlassCard strong className="p-4">
            <p className="text-xs" style={{ color: '#7CB342' }}>✅ Підтверджую, що 100% від оплати послуги перейдуть на підтримку ЗСУ</p>
          </GlassCard>

          <button
            className="btn-primary w-full"
            disabled={!offerForm.title || !offerForm.description || !offerForm.price || !offerForm.category}
            style={{ opacity: (!offerForm.title || !offerForm.description || !offerForm.price || !offerForm.category) ? 0.5 : 1 }}
            onClick={handleSubmitOffer}
          >
            🚀 Запропонувати послугу
          </button>
        </div>
      </div>
    );
  }

  // CATALOG view
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

      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3 pb-1">
        {categories.map(cat => (
          <button key={cat.id} className={`chip flex-shrink-0 ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => { haptic('light'); setActiveCategory(cat.id); }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'онлайн', 'офлайн'] as FormatFilter[]).map(f => (
          <button key={f} className={`chip text-xs ${formatFilter === f ? 'active' : ''}`} onClick={() => setFormatFilter(f)}>
            {f === 'all' ? 'Будь-який' : f}
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
