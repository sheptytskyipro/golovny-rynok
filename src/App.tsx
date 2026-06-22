import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTelegram } from './hooks/useTelegram';
import Layout from './components/Layout';
import MarketPage from './pages/MarketPage';
import ItemDetailPage from './pages/ItemDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import PublishPage from './pages/PublishPage';
import MissionPage from './pages/MissionPage';
import ProfilePage from './pages/ProfilePage';

function AppInit() {
  useTelegram(); // init Telegram SDK + set user
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename="/golovny-rynok/">
      <AppInit />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MarketPage />} />
          <Route path="mission" element={<MissionPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="item/:id" element={<ItemDetailPage />} />
        <Route path="checkout/:id" element={<CheckoutPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="publish" element={<PublishPage />} />
      </Routes>
    </BrowserRouter>
  );
}
