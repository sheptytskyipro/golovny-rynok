import { useState } from 'react';
import { Package, ShoppingBag, Award, Coins } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useMarketStore } from '../store/useMarketStore';
import { useMissionStore } from '../store/useMissionStore';

const fmt = (n: number) => n.toLocaleString('uk-UA');

const ACHIEVEMENTS = [
  { id: 'first', title: 'Перший внесок', icon: '🎯', threshold: 1 },
  { id: 'five', title: '5 угод', icon: '⭐', threshold: 5 },
  { id: 'ten', title: '10 угод', icon: '🏆', threshold: 10 },
  { id: 'generous', title: 'Щедра душа', icon: '💛', threshold: 50000, isMoney: true },
];

export default function ProfilePage() {
  const user = useUserStore(s => s.user);
  const allItems = useMarketStore(s => s.items);
  const allServices = useMarketStore(s => s.services);
  const userContributions = useMissionStore(s => s.userContributions);
  const [activeTab, setActiveTab] = useState<'listings' | 'purchases'>('listings');

  if (!user) return null;

  const myTxs = userContributions(user.id);
  const myTotal = myTxs.reduce((s, t) => s + t.amount, 0);
  const myCoins = Math.round(myTotal / 10);
  const myItems = allItems.filter(i => i.sellerId === user.id);
  const myServices = allServices.filter(s => s.providerId === user.id);
  const myListings = [...myItems, ...myServices];
  const initials = `${user.first_name[0]}${user.last_name?.[0] || ''}`.toUpperCase();

  const cardStyle = { background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 16 };

  return (
    <div style={{ padding: '16px 16px 16px' }}>
      {/* Profile header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingTop: 8 }}>
        {user.photo_url ? (
          <img src={user.photo_url} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent-orange),var(--accent-yellow))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
        )}
        <div>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{user.first_name} {user.last_name}</p>
          {user.username && <p style={{ margin: '2px 0 0', fontSize: 14, color: 'var(--text-tertiary)' }}>@{user.username}</p>}
        </div>
      </div>

      {/* My footprint hero */}
      <div style={{ ...cardStyle, marginBottom: 12, textAlign: 'center', background: 'linear-gradient(135deg,rgba(244,128,26,0.12),rgba(124,179,66,0.08))' }}>
        <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Мій слід</p>
        <p style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 900, color: 'var(--accent-orange)' }}>{fmt(myTotal)} ₴</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{myTxs.filter(t => t.type === 'item').length}</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-tertiary)' }}>куплено речей</p>
          </div>
          <div style={{ width: 1, background: 'var(--separator)' }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{myListings.filter(i => i.status === 'sold').length}</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-tertiary)' }}>продано лотів</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div style={{ ...cardStyle, marginBottom: 12 }}>
        <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Досягнення</p>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }} className="no-scrollbar">
          {ACHIEVEMENTS.map(a => {
            const unlocked = a.isMoney ? myTotal >= a.threshold : myTxs.length >= a.threshold;
            return (
              <div key={a.id} style={{ flexShrink: 0, textAlign: 'center', opacity: unlocked ? 1 : 0.35 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: unlocked ? 'rgba(124,179,66,0.2)' : 'var(--glass-surface)', border: `2px solid ${unlocked ? 'var(--accent-green)' : 'var(--glass-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 6px' }}>
                  {a.icon}
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)', maxWidth: 60, lineHeight: 1.3 }}>{a.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coins */}
      <div style={{ ...cardStyle, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={22} color="var(--accent-yellow)" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--accent-yellow)' }}>{myCoins}</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-tertiary)' }}>Монет накопичено</p>
          </div>
        </div>
        <span style={{ padding: '4px 10px', borderRadius: 100, background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.3)', fontSize: 11, color: 'var(--accent-yellow)', fontWeight: 600 }}>Скоро</span>
      </div>

      {/* My listings / purchases tabs */}
      <div style={{ display: 'flex', background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 3, marginBottom: 14 }}>
        {(['listings','purchases'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, background: activeTab === t ? 'var(--accent-orange)' : 'transparent', color: activeTab === t ? '#fff' : 'var(--text-secondary)', transition: 'all 200ms' }}>
            {t === 'listings' ? 'Мої лоти' : 'Покупки'}
          </button>
        ))}
      </div>

      {activeTab === 'listings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myListings.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '24px 0' }}>Ще немає лотів. Виставте перший!</p>}
          {myListings.map(item => (
            <div key={item.id} style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              <img src={item.imageUrl} alt={item.title} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</p>
                <p style={{ margin: '3px 0 0', fontSize: 14, color: 'var(--accent-orange)', fontWeight: 700 }}>{'price' in item ? fmt((item as { price: number }).price) : 0} ₴</p>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: item.status === 'active' ? 'rgba(124,179,66,0.15)' : 'rgba(255,255,255,0.06)', color: item.status === 'active' ? 'var(--accent-green)' : 'var(--text-tertiary)', border: `1px solid ${item.status === 'active' ? 'rgba(124,179,66,0.3)' : 'var(--glass-border)'}` }}>
                {item.status === 'active' ? 'Активний' : 'Продано'}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'purchases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myTxs.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '24px 0' }}>Ще немає покупок. Підтримайте ЗСУ!</p>}
          {myTxs.map(t => (
            <div key={t.id} style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{t.itemTitle}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--text-tertiary)' }}>{t.direction} · {t.createdAt.slice(0, 10)}</p>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-orange)', flexShrink: 0, marginLeft: 12 }}>{fmt(t.amount)} ₴</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
