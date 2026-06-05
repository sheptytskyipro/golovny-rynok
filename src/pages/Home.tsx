import { useState, useEffect } from 'react';
import { TabId } from '../types';
import GlassCard from '../components/GlassCard';
import AppleLogo from '../components/AppleLogo';
import { useTelegram } from '../hooks/useTelegram';

interface HomeProps {
  onNavigate: (tab: TabId) => void;
  onShowAbout: () => void;
  onShowFrontRear: () => void;
}

const stats = [
  { label: 'Коефіцієнт ефективності', value: '1:10', sub: 'кожна гривня множиться' },
  { label: 'Зібрано → передано', value: '₴1.2М', sub: '~100 тис ₴ → 1 млн ₴' },
  { label: 'Підтримані напрями', value: '4', sub: 'активні програми' },
];

const directions = [
  { name: 'Розробка дронів', icon: '🚁', color: '#7CB342' },
  { name: 'Гурток «Науковий»', icon: '🔬', color: '#F4801A' },
  { name: '3-тя штурмова', icon: '⚔️', color: '#558B2F' },
  { name: '47-ма бригада МАҐУРА', icon: '🛡️', color: '#F5C518' },
];

const steps = [
  { num: '1', title: 'Виставляєш річ або послугу', desc: 'Будь-що має цінність — від скріпки до ноутбука', icon: '📦' },
  { num: '2', title: 'Людина купує', desc: 'Покупець отримує товар, ти — відчуття причетності', icon: '🤝' },
  { num: '3', title: '100% → ЗСУ', desc: 'Кожна гривня йде на захист України', icon: '🇺🇦' },
];

const horizons = [
  {
    title: 'Сьогодні',
    emoji: '⚡',
    color: '#F4801A',
    items: ['Народний ленд-ліз', 'FPV-дрони та «Змій»', 'Спорядження для воїнів'],
  },
  {
    title: 'Завтра',
    emoji: '🌱',
    color: '#7CB342',
    items: ['Реабілітація захисників', 'Підтримка сімей', 'Наукові гуртки'],
  },
  {
    title: 'Після Перемоги',
    emoji: '🌅',
    color: '#F5C518',
    items: ['Відбудова України', 'Інноваційні хаби', 'Нове покоління лідерів'],
  },
];

export default function Home({ onNavigate, onShowAbout, onShowFrontRear }: HomeProps) {
  const { haptic } = useTelegram();
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const targetTotal = 1247350;

  useEffect(() => {
    let start = 0;
    const step = targetTotal / 60;
    const interval = setInterval(() => {
      start += step;
      if (start >= targetTotal) {
        setAnimatedTotal(targetTotal);
        clearInterval(interval);
      } else {
        setAnimatedTotal(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <AppleLogo size={80} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#2A2418' }}>
          Головний Ринок
        </h1>
        <p className="text-base font-medium mb-1" style={{ color: '#7CB342' }}>
          Головний Герой
        </p>
        <p className="text-sm px-4 leading-relaxed" style={{ color: 'rgba(42,36,24,0.7)' }}>
          Речі та послуги, що стають зброєю захисту
        </p>

        {/* Total collected */}
        <GlassCard strong className="mt-6 py-4 px-6">
          <p className="text-xs mb-1" style={{ color: 'rgba(42,36,24,0.5)' }}>Загалом зібрано</p>
          <p className="text-3xl font-bold animate-count-up" style={{ color: '#7CB342' }}>
            ₴ {animatedTotal.toLocaleString('uk-UA')}
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(42,36,24,0.5)' }}>і це тільки початок 🇺🇦</p>
        </GlassCard>

        {/* CTA buttons */}
        <div className="flex gap-3 mt-6">
          <button
            className="btn-primary flex-1 text-sm"
            onClick={() => { haptic('light'); onNavigate('items'); }}
          >
            ✏️ Виставити
          </button>
          <button
            className="btn-green flex-1 text-sm"
            onClick={() => { haptic('light'); onNavigate('items'); }}
          >
            💙 Підтримати
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-6">
        <h2 className="section-title">Як це працює</h2>
        <div className="space-y-3">
          {steps.map((step) => (
            <GlassCard key={step.num} className="p-4 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #F4801A, #F5C518)' }}
              >
                {step.num}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: '#2A2418' }}>{step.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(42,36,24,0.6)' }}>{step.desc}</p>
              </div>
              <span className="text-2xl">{step.icon}</span>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <h2 className="section-title">Цифри, що надихають</h2>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <GlassCard key={s.label} strong className="p-3 text-center">
              <p className="text-xl font-bold" style={{ color: '#F4801A' }}>{s.value}</p>
              <p className="text-xs font-medium mt-1 leading-tight" style={{ color: '#2A2418' }}>{s.label}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(42,36,24,0.5)' }}>{s.sub}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Directions */}
      <div className="mb-6">
        <h2 className="section-title">Напрями підтримки</h2>
        <div className="grid grid-cols-2 gap-3">
          {directions.map((d) => (
            <GlassCard key={d.name} className="p-3 flex items-center gap-2">
              <span className="text-xl">{d.icon}</span>
              <span className="text-sm font-medium leading-tight" style={{ color: '#2A2418' }}>{d.name}</span>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Three horizons */}
      <div className="mb-6">
        <h2 className="section-title">Три горизонти</h2>
        <div className="space-y-3">
          {horizons.map((h) => (
            <GlassCard key={h.title} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{h.emoji}</span>
                <h3 className="font-bold text-base" style={{ color: h.color }}>{h.title}</h3>
              </div>
              <div className="space-y-1.5">
                {h.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: h.color }} />
                    <span className="text-sm" style={{ color: 'rgba(42,36,24,0.8)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <GlassCard onClick={() => { haptic('light'); onShowAbout(); }} className="p-4 text-center cursor-pointer">
            <span className="text-2xl">ℹ️</span>
            <p className="font-semibold text-sm mt-2" style={{ color: '#2A2418' }}>Про проєкт</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(42,36,24,0.5)' }}>Місія та цінності</p>
          </GlassCard>
          <GlassCard onClick={() => { haptic('light'); onShowFrontRear(); }} className="p-4 text-center cursor-pointer">
            <span className="text-2xl">🌉</span>
            <p className="font-semibold text-sm mt-2" style={{ color: '#2A2418' }}>Фронт-Тил</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <p className="text-xs" style={{ color: 'rgba(42,36,24,0.5)' }}>Міст</p>
              <span className="text-xs px-1.5 py-0.5 rounded-full text-white font-medium" style={{ background: '#F4801A', fontSize: '9px' }}>СКОРО</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Footer tagline */}
      <GlassCard strong className="p-4 text-center mb-4">
        <p className="text-sm italic" style={{ color: 'rgba(42,36,24,0.7)' }}>
          "Усе починається зі скріпки…
        </p>
        <p className="text-sm font-semibold mt-1" style={{ color: '#7CB342' }}>
          Рухаймось разом 🇺🇦"
        </p>
      </GlassCard>

      <button
        className="btn-primary w-full"
        onClick={() => { haptic('medium'); onNavigate('transparency'); }}
      >
        📊 Переглянути прозорість
      </button>
    </div>
  );
}
