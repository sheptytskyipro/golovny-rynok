import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Package, Sparkles } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore';
import { useUserStore } from '../store/useUserStore';
import type { ItemCategory, ServiceCategory, ItemCondition, ServiceFormat } from '../types';

const ITEM_CATS: ItemCategory[] = ['техніка','інструменти','туризм','одяг','дім','дитяче','авто','хобі','вінтаж','хендмейд','спорядження','книги'];
const SVC_CATS: ServiceCategory[] = ['освіта','дизайн','IT','ремонт','фото/відео','краса','переклади','юридичні'];

const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 14, border: '1px solid var(--glass-border)', background: 'var(--glass-surface)', color: 'var(--text-primary)', fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' };
const labelStyle = { display: 'block', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6 };

export default function PublishPage() {
  const navigate = useNavigate();
  const addItem = useMarketStore(s => s.addItem);
  const addService = useMarketStore(s => s.addService);
  const user = useUserStore(s => s.user);

  const [step, setStep] = useState<'type' | 'item' | 'service'>('type');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [legend, setLegend] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('як нове');
  const [city, setCity] = useState('');
  const [format, setFormat] = useState<ServiceFormat>('онлайн');
  const [duration, setDuration] = useState('');
  const [contact, setContact] = useState('');

  const canSubmit = title && desc && price && category;

  const submit = () => {
    if (!canSubmit || !user) return;
    const id = `u_${Date.now()}`;
    const now = new Date().toISOString();
    if (step === 'item') {
      addItem({ id, sellerId: user.id, sellerName: `${user.first_name} ${user.last_name || ''}`.trim(), title, description: desc, legend: legend || undefined, price: Number(price), category: category as ItemCategory, condition, city: city || 'Київ', status: 'active', imageUrl: `https://picsum.photos/seed/${id}/400/500`, createdAt: now });
    } else {
      addService({ id, providerId: user.id, providerName: `${user.first_name} ${user.last_name || ''}`.trim(), title, description: desc, price: Number(price), category: category as ServiceCategory, format, duration: duration || 'за домовленістю', status: 'active', imageUrl: `https://picsum.photos/seed/${id}/400/500`, contactInfo: contact || `@${user.username || 'user'}`, createdAt: now });
    }
    navigate('/');
  };

  const SegBtn = ({ val, cur, set, children }: { val: string; cur: string; set: (v: string) => void; children: React.ReactNode }) => (
    <button onClick={() => set(val)} style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: cur === val ? 'var(--accent-orange)' : 'transparent', color: cur === val ? '#fff' : 'var(--text-secondary)', transition: 'all 200ms' }}>{children}</button>
  );

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{step === 'type' ? 'Новий лот' : step === 'item' ? 'Виставити річ' : 'Запропонувати послугу'}</span>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={22} /></button>
      </div>

      {/* Progress dots */}
      {step !== 'type' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '10px 0' }}>
          {[0, 1].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? 'var(--text-tertiary)' : 'var(--accent-orange)' }} />)}
        </div>
      )}

      <div style={{ padding: '16px 16px 120px' }}>
        {step === 'type' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 20 }}>
            <button onClick={() => setStep('item')} style={{ padding: '32px 20px', borderRadius: 24, border: '1px solid var(--glass-border)', background: 'var(--glass-surface)', cursor: 'pointer', textAlign: 'center' }}>
              <Package size={40} color="var(--accent-orange)" style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Річ</p>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>Продай те, чим не користуєшся</p>
            </button>
            <button onClick={() => setStep('service')} style={{ padding: '32px 20px', borderRadius: 24, border: '1px solid var(--glass-border)', background: 'var(--glass-surface)', cursor: 'pointer', textAlign: 'center' }}>
              <Sparkles size={40} color="var(--accent-yellow)" style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Послуга</p>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>Поділись навичкою чи часом</p>
            </button>
          </div>
        )}

        {step !== 'type' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={labelStyle}>Назва *</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Наприклад: Рюкзак Osprey 45л" style={inputStyle} /></div>
            <div><label style={labelStyle}>Опис *</label><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Детально про лот..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></div>
            <div>
              <label style={labelStyle}>Категорія *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                <option value="" style={{ background: '#1C1814' }}>Оберіть категорію</option>
                {(step === 'item' ? ITEM_CATS : SVC_CATS).map(c => <option key={c} value={c} style={{ background: '#1C1814' }}>{c}</option>)}
              </select>
            </div>

            {step === 'item' && (
              <>
                <div><label style={labelStyle}>Легенда речі (необов'язково)</label><textarea value={legend} onChange={e => setLegend(e.target.value)} placeholder="Чому віддаєш? Це підвищує довіру покупця..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                <div>
                  <label style={labelStyle}>Стан</label>
                  <div style={{ display: 'flex', background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 3 }}>
                    {(['нове','як нове','вживане'] as ItemCondition[]).map(c => <SegBtn key={c} val={c} cur={condition} set={v => setCondition(v as ItemCondition)}>{c}</SegBtn>)}
                  </div>
                </div>
                <div><label style={labelStyle}>Місто</label><input value={city} onChange={e => setCity(e.target.value)} placeholder="Київ" style={inputStyle} /></div>
              </>
            )}

            {step === 'service' && (
              <>
                <div>
                  <label style={labelStyle}>Формат</label>
                  <div style={{ display: 'flex', background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 3 }}>
                    {(['онлайн','офлайн','гібрид'] as ServiceFormat[]).map(f => <SegBtn key={f} val={f} cur={format} set={v => setFormat(v as ServiceFormat)}>{f}</SegBtn>)}
                  </div>
                </div>
                <div><label style={labelStyle}>Тривалість</label><input value={duration} onChange={e => setDuration(e.target.value)} placeholder="60 хвилин / за домовленістю" style={inputStyle} /></div>
                <div><label style={labelStyle}>Контакт для зв'язку</label><input value={contact} onChange={e => setContact(e.target.value)} placeholder="@telegram або email" style={inputStyle} /></div>
              </>
            )}

            <div><label style={labelStyle}>Ціна (= внесок у ЗСУ) *</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="1000" style={inputStyle} /></div>
            {price && <p style={{ margin: '-8px 0 0', fontSize: 13, color: 'var(--accent-green)' }}>≈ {Math.round(Number(price) / 10)} Монет після продажу</p>}
          </div>
        )}
      </div>

      {step !== 'type' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', background: 'rgba(21,18,15,0.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--glass-border)' }}>
          <button onClick={submit} disabled={!canSubmit} style={{ width: '100%', padding: '16px', borderRadius: 18, border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed', background: canSubmit ? 'linear-gradient(135deg,var(--accent-orange),var(--accent-yellow))' : 'var(--glass-surface)', color: canSubmit ? '#fff' : 'var(--text-tertiary)', fontSize: 17, fontWeight: 700 }}>
            Опублікувати лот
          </button>
        </div>
      )}
    </div>
  );
}
