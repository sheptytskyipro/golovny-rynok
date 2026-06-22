import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Shield, Smartphone, Wrench, Backpack, Shirt, Home, Baby, Car, Palette, Clock, Scissors, BookOpen, GraduationCap, PenTool, Code2, HardHat, Camera, Sparkles, Languages, Scale } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore';
import { useMissionStore } from '../store/useMissionStore';

const ITEM_ICONS: Record<string, React.ElementType> = {
  техніка: Smartphone, інструменти: Wrench, туризм: Backpack, одяг: Shirt,
  дім: Home, дитяче: Baby, авто: Car, хобі: Palette, вінтаж: Clock,
  хендмейд: Scissors, спорядження: BookOpen, книги: BookOpen,
};
const ITEM_COLORS: Record<string, string> = {
  техніка: '#3B82F6', інструменти: '#F59E0B', туризм: '#10B981', одяг: '#8B5CF6',
  дім: '#EF4444', дитяче: '#EC4899', авто: '#F97316', хобі: '#14B8A6',
  вінтаж: '#A78BFA', хендмейд: '#F43F5E', спорядження: '#6366F1', книги: '#84CC16',
};
const SVC_ICONS: Record<string, React.ElementType> = {
  освіта: GraduationCap, дизайн: PenTool, IT: Code2, ремонт: HardHat,
  'фото/відео': Camera, краса: Sparkles, переклади: Languages, юридичні: Scale,
};
const SVC_COLORS: Record<string, string> = {
  освіта: '#3B82F6', дизайн: '#8B5CF6', IT: '#10B981', ремонт: '#F59E0B',
  'фото/відео': '#EC4899', краса: '#F43F5E', переклади: '#14B8A6', юридичні: '#6366F1',
};

const fmt = (n: number) => n.toLocaleString('uk-UA');

function CountUp({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useState(() => {
    let start = 0;
    const duration = 800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      start = Math.round(progress * target);
      setVal(start);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  return <>{fmt(val)}</>;
}

export default function MarketPage() {
  const navigate = useNavigate();
  const { filters, setTab, setCategory, setSearch } = useMarketStore();
  const filteredItems = useMarketStore(s => s.filteredItems());
  const filteredServices = useMarketStore(s => s.filteredServices());
  const total = useMissionStore(s => s.totalContributed());
  const txCount = useMissionStore(s => s.transactions.length);

  const tab = filters.tab;
  const list = tab === 'items' ? filteredItems : filteredServices;
  const itemCats = ['техніка','інструменти','туризм','одяг','дім','дитяче','авто','хобі','вінтаж','хендмейд','спорядження','книги'];
  const svcCats = ['освіта','дизайн','IT','ремонт','фото/відео','краса','переклади','юридичні'];
  const cats = tab === 'items' ? itemCats : svcCats;
  const icons = tab === 'items' ? ITEM_ICONS : SVC_ICONS;
  const colors = tab === 'items' ? ITEM_COLORS : SVC_COLORS;

  return (
    <div style={{ padding: '16px 16px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7CB342,#5C8A38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍎</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Головний Ринок</span>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <Search size={20} />
        </button>
      </div>

      {/* Mini stats bar */}
      <button onClick={() => navigate('/mission')} style={{
        width: '100%', marginBottom: 14, padding: '10px 14px', borderRadius: 100,
        background: 'var(--glass-surface)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, cursor: 'pointer',
      }}>
        <Shield size={14} color="var(--accent-green)" />
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {txCount} угод · <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}><CountUp target={total} /> ₴</span> зібрано
        </span>
      </button>

      {/* Segmented control */}
      <div style={{
        display: 'flex', background: 'var(--glass-surface)', borderRadius: 12, padding: 3,
        border: '1px solid var(--glass-border)', marginBottom: 12,
      }}>
        {(['items','services'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '7px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
            background: filters.tab === t ? 'var(--accent-orange)' : 'transparent',
            color: filters.tab === t ? '#fff' : 'var(--text-secondary)',
            transition: 'all 200ms',
          }}>
            {t === 'items' ? 'Речі' : 'Послуги'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input
          value={filters.search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Пошук..."
          style={{
            width: '100%', padding: '9px 12px 9px 36px', borderRadius: 12, border: '1px solid var(--glass-border)',
            background: 'var(--glass-surface)', color: 'var(--text-primary)', fontSize: 14, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }} className="no-scrollbar">
        <button onClick={() => setCategory(null)} style={{
          flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: '1px solid var(--glass-border)',
          background: !filters.category ? 'var(--accent-orange)' : 'var(--glass-surface)',
          color: !filters.category ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>Всі</button>
        {cats.map(cat => {
          const Icon = icons[cat];
          const active = filters.category === cat;
          return (
            <button key={cat} onClick={() => setCategory(active ? null : cat)} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 100, border: '1px solid var(--glass-border)',
              background: active ? colors[cat] : 'var(--glass-surface)',
              color: active ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {Icon && <Icon size={13} />}{cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingBottom: 8 }}>
        {list.map(item => (
          <button key={item.id} onClick={() => navigate(`/item/${item.id}`)} style={{
            background: 'var(--glass-surface)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid var(--glass-border)', borderRadius: 24, overflow: 'hidden',
            cursor: 'pointer', textAlign: 'left', padding: 0, display: 'flex', flexDirection: 'column',
            transition: 'transform 150ms',
          }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: item.status === 'sold' ? 'grayscale(1)' : 'none' }}
                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/400/500`; }}
              />
              <div style={{
                position: 'absolute', top: 8, left: 8, background: 'rgba(124,179,66,0.9)',
                borderRadius: 100, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Shield size={10} color="#fff" />
                <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>100% → ЗСУ</span>
              </div>
              {item.status === 'sold' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Продано</span>
                </div>
              )}
            </div>
            <div style={{ padding: '10px 12px 12px' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
              <p style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 700, color: 'var(--accent-orange)' }}>{fmt(item.price)} ₴</p>
              <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--text-tertiary)' }}>
                {'city' in item ? (item as { city: string }).city : ''}
                {'condition' in item ? ` · ${(item as { condition: string }).condition}` : ''}
                {'format' in item ? ` · ${(item as { format: string }).format}` : ''}
              </p>
            </div>
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
          <SlidersHorizontal size={32} style={{ margin: '0 auto 12px', display: 'block' }} />
          <p>Нічого не знайдено</p>
        </div>
      )}
    </div>
  );
}
