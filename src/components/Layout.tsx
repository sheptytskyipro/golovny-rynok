import { ReactNode } from 'react';
import { TabId } from '../types';
import AppleLogo from './AppleLogo';

interface LayoutProps {
  children: ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: 'Головна', icon: '🏠' },
  { id: 'items', label: 'Речі', icon: '🎁' },
  { id: 'services', label: 'Послуги', icon: '⚡' },
  { id: 'transparency', label: 'Прозорість', icon: '📊' },
  { id: 'myspace', label: 'Я', icon: '👤' },
];

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #FFF3E0 0%, #FFFDE7 40%, #F1F8E9 100%)' }}>
      {/* Header */}
      <header className="glass-nav sticky top-0 z-40 px-4 py-3 flex items-center gap-3">
        <AppleLogo size={32} />
        <div>
          <h1 className="font-bold text-base leading-tight" style={{ color: '#2A2418' }}>Головний Ринок</h1>
          <p className="text-xs" style={{ color: '#7CB342' }}>100% → ЗСУ</p>
        </div>
        <div className="ml-auto">
          <span className="badge-zsu">🇺🇦 Разом</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="glass-nav fixed bottom-0 left-0 right-0 z-40 flex safe-bottom">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center py-2 px-1 transition-all duration-200"
            style={{
              color: activeTab === tab.id ? '#F4801A' : 'rgba(42,36,24,0.5)',
            }}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-[10px] mt-1 font-medium leading-none">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="w-4 h-0.5 mt-1 rounded-full" style={{ background: '#F4801A' }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
