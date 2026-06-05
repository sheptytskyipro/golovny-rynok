import { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import Layout from './components/Layout';
import Home from './pages/Home';
import Items from './pages/Items';
import Services from './pages/Services';
import Transparency from './pages/Transparency';
import MySpace from './pages/MySpace';
import About from './pages/About';
import FrontRear from './pages/FrontRear';
import { TabId } from './types';

export default function App() {
  const { tg } = useTelegram();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showAbout, setShowAbout] = useState(false);
  const [showFrontRear, setShowFrontRear] = useState(false);

  useEffect(() => {
    tg.ready();
    tg.expand();
  }, [tg]);

  const handleTabChange = (tab: TabId) => {
    try { tg.HapticFeedback.impactOccurred('light'); } catch {}
    setActiveTab(tab);
    setShowAbout(false);
    setShowFrontRear(false);
  };

  const renderPage = () => {
    if (showAbout) return <About onBack={() => { setShowAbout(false); }} />;
    if (showFrontRear) return <FrontRear onBack={() => { setShowFrontRear(false); }} />;
    switch (activeTab) {
      case 'home': return <Home onNavigate={handleTabChange} onShowAbout={() => setShowAbout(true)} onShowFrontRear={() => setShowFrontRear(true)} />;
      case 'items': return <Items />;
      case 'services': return <Services />;
      case 'transparency': return <Transparency />;
      case 'myspace': return <MySpace onShowAbout={() => setShowAbout(true)} />;
      default: return <Home onNavigate={handleTabChange} onShowAbout={() => setShowAbout(true)} onShowFrontRear={() => setShowFrontRear(true)} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderPage()}
    </Layout>
  );
}
