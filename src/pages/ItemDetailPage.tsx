import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, MapPin, Tag } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore';
import type { MarketItem, MarketService } from '../types';

const fmt = (n: number) => n.toLocaleString('uk-UA');

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const allItems = useMarketStore(s => s.items);
  const allServices = useMarketStore(s => s.services);

  const item = allItems.find(i => i.id === id) || allServices.find(s => s.id === id);
  if (!item) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', color: 'var(--text-secondary)' }}>
      <p>Лот не знайдено</p>
      <button onClick={() => navigate('/')} style={{ marginTop: 12, color: 'var(--accent-orange)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>← На ринок</button>
    </div>
  );

  const isItem = 'condition' in item;
  const typedItem = item as MarketItem;
  const typedService = item as MarketService;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: 100 }}>
      {/* Back header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: 'rgba(21,18,15,0.8)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={22} /> Назад
        </button>
      </div>

      {/* Image */}
      <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/400/500`; }} />
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(124,179,66,0.9)', borderRadius: 100, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Shield size={12} color="#fff" />
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>100% → ЗСУ</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</h1>
        <p style={{ margin: '0 0 16px', fontSize: 28, fontWeight: 800, color: 'var(--accent-orange)' }}>{fmt(item.price)} ₴</p>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-tertiary)' }}>= прямий внесок у ЗСУ через фонд Support Ukraine</p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {isItem && <span style={{ padding: '5px 12px', borderRadius: 100, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-secondary)' }}>{typedItem.condition}</span>}
          {isItem && <span style={{ padding: '5px 12px', borderRadius: 100, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{typedItem.city}</span>}
          {!isItem && <span style={{ padding: '5px 12px', borderRadius: 100, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-secondary)' }}>{typedService.format}</span>}
          {!isItem && <span style={{ padding: '5px 12px', borderRadius: 100, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-secondary)' }}>{typedService.duration}</span>}
          <span style={{ padding: '5px 12px', borderRadius: 100, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><Tag size={12} />{item.category}</span>
        </div>

        {/* Description */}
        <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 16, marginBottom: 12 }}>
          <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Про лот</p>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.5 }}>{item.description}</p>
        </div>

        {/* Legend */}
        {isItem && typedItem.legend && (
          <div style={{ background: 'rgba(244,128,26,0.08)', border: '1px solid rgba(244,128,26,0.2)', borderRadius: 20, padding: 16, marginBottom: 12 }}>
            <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: 'var(--accent-orange)' }}>Легенда речі</p>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>"{typedItem.legend}"</p>
          </div>
        )}

        {/* Seller */}
        <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {(isItem ? typedItem.sellerName : typedService.providerName)[0]}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{isItem ? typedItem.sellerName : typedService.providerName}</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-tertiary)' }}>Учасник проєкту</p>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      {item.status === 'active' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', background: 'rgba(21,18,15,0.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--glass-border)' }}>
          <button onClick={() => navigate(`/checkout/${item.id}`)} style={{
            width: '100%', padding: '16px', borderRadius: 18, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,var(--accent-orange),var(--accent-yellow))',
            color: '#fff', fontSize: 17, fontWeight: 700,
            boxShadow: '0 4px 20px rgba(244,128,26,0.4)',
          }}>
            Купити = зробити внесок — {fmt(item.price)} ₴
          </button>
        </div>
      )}
    </div>
  );
}
