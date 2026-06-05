import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { useTelegram } from '../hooks/useTelegram';
import { getItems, getServices, getUserContributions } from '../store';

interface MySpaceProps {
  onShowAbout: () => void;
}

export default function MySpace({ onShowAbout }: MySpaceProps) {
  const { haptic, user } = useTelegram();
  const [activeTab, setActiveTab] = useState<'listings' | 'history'>('listings');

  const userId = user?.id ?? 999999;
  const myTransactions = getUserContributions(userId);
  const totalContribution = myTransactions.reduce((sum, t) => sum + t.amount, 0);

  const allItems = getItems();
  const allServices = getServices();
  const myItems = allItems.filter(i => i.sellerId === userId);
  const myServices = allServices.filter(s => s.providerId === userId);

  const avatarLetter = user?.first_name?.[0]?.toUpperCase() || 'Г';
  const fullName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Гість';

  return (
    <div className="page-container">
      {/* Profile card */}
      <GlassCard strong className="p-5 mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7CB342, #8BC34A)', color: 'white' }}
          >
            {user?.photo_url ? (
              <img src={user.photo_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : avatarLetter}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color: '#2A2418' }}>{fullName}</h2>
            {user?.username && (
              <p className="text-sm" style={{ color: '#F4801A' }}>@{user.username}</p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <span className="badge-zsu">Учасник</span>
              <span className="text-xs" style={{ color: 'rgba(42,36,24,0.4)' }}>Головного Ринку</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* My footprint */}
      <GlassCard className="p-4 mb-4">
        <p className="text-xs mb-1" style={{ color: 'rgba(42,36,24,0.5)' }}>🏆 Мій слід</p>
        <p className="text-2xl font-bold" style={{ color: '#7CB342' }}>
          ₴ {totalContribution.toLocaleString('uk-UA')}
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(42,36,24,0.5)' }}>передано на підтримку ЗСУ</p>
        {totalContribution > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(42,36,24,0.1)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((totalContribution / 10000) * 100, 100)}%`,
                  background: 'linear-gradient(90deg, #7CB342, #F4801A)',
                }}
              />
            </div>
            <p className="text-xs" style={{ color: 'rgba(42,36,24,0.5)' }}>до 10k</p>
          </div>
        )}
      </GlassCard>

      {/* Coins teaser */}
      <GlassCard className="p-4 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(245,197,24,0.2)' }}>
          🪙
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: '#2A2418' }}>Монети Ринку</p>
          <p className="text-xs" style={{ color: 'rgba(42,36,24,0.5)' }}>Нагороди за активність</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full text-white font-medium" style={{ background: '#F4801A', fontSize: '9px' }}>СКОРО</span>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`chip flex-1 text-center ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => { haptic('light'); setActiveTab('listings'); }}
        >
          📦 Мої оголошення
        </button>
        <button
          className={`chip flex-1 text-center ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => { haptic('light'); setActiveTab('history'); }}
        >
          📋 Внески
        </button>
      </div>

      {/* Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-3">
          {[...myItems.map(i => ({ id: i.id, title: i.title, price: i.price, type: 'item' as const, status: i.status })),
            ...myServices.map(s => ({ id: s.id, title: s.title, price: s.price, type: 'service' as const, status: s.status }))
          ].length > 0 ? (
            [...myItems.map(i => ({ id: i.id, title: i.title, price: i.price, type: 'item' as const, status: i.status })),
              ...myServices.map(s => ({ id: s.id, title: s.title, price: s.price, type: 'service' as const, status: s.status }))
            ].map(listing => (
              <GlassCard key={listing.id} className="p-4 flex items-center gap-3">
                <span className="text-xl">{listing.type === 'item' ? '📦' : '⚡'}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: '#2A2418' }}>{listing.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#F4801A' }}>₴ {listing.price.toLocaleString('uk-UA')}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                  background: listing.status === 'active' ? 'rgba(124,179,66,0.2)' : 'rgba(0,0,0,0.1)',
                  color: listing.status === 'active' ? '#7CB342' : 'rgba(42,36,24,0.5)',
                }}>
                  {listing.status === 'active' ? 'Активне' : 'Продано'}
                </span>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl">📦</span>
              <p className="mt-3 font-medium" style={{ color: 'rgba(42,36,24,0.6)' }}>Немає оголошень</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(42,36,24,0.4)' }}>Виставте перший товар або послугу</p>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {myTransactions.length > 0 ? myTransactions.map(tx => (
            <GlassCard key={tx.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="font-medium text-sm" style={{ color: '#2A2418' }}>{tx.itemTitle || '—'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(42,36,24,0.5)' }}>{tx.direction}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(42,36,24,0.4)' }}>{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: '#7CB342' }}>₴ {tx.amount.toLocaleString('uk-UA')}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(42,36,24,0.4)' }}>→ ЗСУ</p>
                </div>
              </div>
            </GlassCard>
          )) : (
            <div className="text-center py-8">
              <span className="text-4xl">📋</span>
              <p className="mt-3 font-medium" style={{ color: 'rgba(42,36,24,0.6)' }}>Ще немає внесків</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(42,36,24,0.4)' }}>Купіть річ або послугу, щоб зробити внесок</p>
            </div>
          )}
        </div>
      )}

      {/* About link */}
      <div className="mt-6">
        <GlassCard onClick={onShowAbout} className="p-4 flex items-center gap-3 cursor-pointer">
          <span className="text-xl">ℹ️</span>
          <p className="font-medium text-sm flex-1" style={{ color: '#2A2418' }}>Про проєкт</p>
          <span style={{ color: 'rgba(42,36,24,0.4)' }}>›</span>
        </GlassCard>
      </div>
    </div>
  );
}
