import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore';
import { useUserStore } from '../store/useUserStore';
import { useMissionStore } from '../store/useMissionStore';
import type { ContributionDirection } from '../types';

const CITIES = [
  { id: 'kyiv', name: 'Київ', branches: ['Відділення №1: вул. Хрещатик, 22', 'Відділення №3: пр. Перемоги, 15', 'Поштомат №12: ТРЦ Арена Сіті'] },
  { id: 'lviv', name: 'Львів', branches: ['Відділення №2: вул. Городоцька, 189', 'Відділення №5: вул. Стрийська, 45'] },
  { id: 'kharkiv', name: 'Харків', branches: ['Відділення №1: пр. Науки, 14', 'Відділення №4: вул. Клочківська, 192'] },
  { id: 'odesa', name: 'Одеса', branches: ['Відділення №2: вул. Рішельєвська, 33'] },
  { id: 'dnipro', name: 'Дніпро', branches: ['Відділення №3: вул. Робоча, 2а', 'Відділення №8: пр. Гагаріна, 72'] },
];
const DIRECTIONS: ContributionDirection[] = ['Розробка дронів', 'Гурток «Науковий»', '3-тя штурмова', '47-ма МАҐУРА'];
const fmt = (n: number) => n.toLocaleString('uk-UA');

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const allItems = useMarketStore(s => s.items);
  const allServices = useMarketStore(s => s.services);
  const markItemSold = useMarketStore(s => s.markItemSold);
  const markServiceSold = useMarketStore(s => s.markServiceSold);
  const addTransaction = useMissionStore(s => s.addTransaction);
  const user = useUserStore(s => s.user);

  const item = allItems.find(i => i.id === id) || allServices.find(s => s.id === id);
  const isItem = item && 'condition' in item;

  const [city, setCity] = useState('');
  const [branch, setBranch] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!item) return null;

  const selectedCity = CITIES.find(c => c.id === city);
  const canPay = !isItem || (city && branch);

  const handlePay = () => {
    if (!canPay || !user) return;
    setProcessing(true);
    setTimeout(() => {
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      addTransaction({
        id: `tx_${Date.now()}`,
        userId: user.id,
        itemId: isItem ? id : undefined,
        serviceId: !isItem ? id : undefined,
        itemTitle: item.title,
        amount: item.price,
        direction,
        type: isItem ? 'item' : 'service',
        createdAt: new Date().toISOString(),
      });
      if (isItem) markItemSold(id!);
      else markServiceSold(id!);
      navigate('/success', { state: { title: item.title, amount: item.price, direction } });
    }, 2000);
  };

  if (processing) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg-base)', gap: 20 }}>
      <div style={{ width: 56, height: 56, border: '3px solid var(--accent-orange)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Обробка платежу…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={22} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>Оформлення</span>
      </div>

      <div style={{ padding: 16 }}>
        {/* Item summary */}
        <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 14, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
          <img src={item.imageUrl} alt={item.title} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</p>
            <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: 'var(--accent-orange)' }}>{fmt(item.price)} ₴</p>
          </div>
        </div>

        {/* Delivery (items only) */}
        {isItem && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Доставка Нова Пошта</p>
            <select value={city} onChange={e => { setCity(e.target.value); setBranch(''); }} style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1px solid var(--glass-border)', background: 'var(--glass-surface)', color: 'var(--text-primary)', fontSize: 15, marginBottom: 10, outline: 'none' }}>
              <option value="" style={{ background: '#1C1814' }}>Оберіть місто</option>
              {CITIES.map(c => <option key={c.id} value={c.id} style={{ background: '#1C1814' }}>{c.name}</option>)}
            </select>
            {selectedCity && (
              <select value={branch} onChange={e => setBranch(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1px solid var(--glass-border)', background: 'var(--glass-surface)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}>
                <option value="" style={{ background: '#1C1814' }}>Оберіть відділення</option>
                {selectedCity.branches.map(b => <option key={b} value={b} style={{ background: '#1C1814' }}>{b}</option>)}
              </select>
            )}
          </div>
        )}

        {/* Contact */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Контакт</p>
          <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 14, padding: '12px 14px' }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 15 }}>@{user?.username || 'guest'}</p>
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', background: 'rgba(21,18,15,0.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--glass-border)' }}>
        <button onClick={handlePay} disabled={!canPay} style={{
          width: '100%', padding: '16px', borderRadius: 18, border: 'none', cursor: canPay ? 'pointer' : 'not-allowed',
          background: canPay ? 'linear-gradient(135deg,var(--accent-orange),var(--accent-yellow))' : 'var(--glass-surface)',
          color: canPay ? '#fff' : 'var(--text-tertiary)', fontSize: 17, fontWeight: 700,
          boxShadow: canPay ? '0 4px 20px rgba(244,128,26,0.4)' : 'none',
        }}>
          Перейти до оплати — {fmt(item.price)} ₴
        </button>
      </div>
    </div>
  );
}
