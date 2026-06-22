import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Plus, Heart, User } from 'lucide-react';

const TABS = [
  { path: '/', icon: ShoppingBag, label: 'Ринок' },
  { path: '/mission', icon: Heart, label: 'Ми' },
  { path: '/profile', icon: User, label: 'Простір' },
];

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: 'calc(68px + env(safe-area-inset-bottom))' }}>
      <Outlet />

      {/* Tab bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(21,18,15,0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid var(--glass-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 56 }}>
          {/* Market tab */}
          <button onClick={() => navigate('/')} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2, color: isActive('/') && !isActive('/mission') && !isActive('/profile') ? 'var(--accent-orange)' : 'var(--text-tertiary)',
            background: 'none', border: 'none', cursor: 'pointer', transition: 'color 200ms',
          }}>
            <ShoppingBag size={22} />
            <span style={{ fontSize: 10, fontWeight: 500 }}>Ринок</span>
          </button>

          {/* Publish button (center, raised) */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => navigate('/publish')} style={{
              width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-yellow))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16, boxShadow: '0 4px 20px rgba(244,128,26,0.4)',
              transition: 'transform 150ms',
            }}>
              <Plus size={26} color="#fff" strokeWidth={2.5} />
            </button>
          </div>

          {/* Mission tab */}
          <button onClick={() => navigate('/mission')} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2, color: isActive('/mission') ? 'var(--accent-orange)' : 'var(--text-tertiary)',
            background: 'none', border: 'none', cursor: 'pointer', transition: 'color 200ms',
          }}>
            <Heart size={22} />
            <span style={{ fontSize: 10, fontWeight: 500 }}>Ми</span>
          </button>

          {/* Profile tab */}
          <button onClick={() => navigate('/profile')} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2, color: isActive('/profile') ? 'var(--accent-orange)' : 'var(--text-tertiary)',
            background: 'none', border: 'none', cursor: 'pointer', transition: 'color 200ms',
          }}>
            <User size={22} />
            <span style={{ fontSize: 10, fontWeight: 500 }}>Простір</span>
          </button>
        </div>
      </div>
    </div>
  );
}
