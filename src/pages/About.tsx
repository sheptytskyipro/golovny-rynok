import GlassCard from '../components/GlassCard';
import AppleLogo from '../components/AppleLogo';
import { useTelegram } from '../hooks/useTelegram';

interface AboutProps {
  onBack: () => void;
}

const values = [
  { icon: '🌱', title: 'Менше — Більше', desc: 'Принцип Міса ван дер Рое: кожна дія має максимальний ефект' },
  { icon: '🔍', title: 'Прозорість', desc: '100% прозорість фінансів. Спільнота — аудитор' },
  { icon: '🤝', title: 'Кожен може', desc: '"У кожного вже є все, щоб допомогти"' },
  { icon: '🎨', title: 'Творчість як зброя', desc: 'Дизайн, код, мистецтво — все стає на захист' },
];

export default function About({ onBack }: AboutProps) {
  const { haptic } = useTelegram();
  return (
    <div className="page-container">
      <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => { haptic('light'); onBack(); }}>
        ← Назад
      </button>

      {/* Hero */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AppleLogo size={64} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#2A2418' }}>Про проєкт</h1>
        <p className="text-sm" style={{ color: '#7CB342' }}>Головний Ринок — Головний Герой</p>
      </div>

      {/* Brand context */}
      <GlassCard strong className="p-5 mb-4">
        <h2 className="font-bold text-base mb-3" style={{ color: '#2A2418' }}>🇺🇦 Контекст</h2>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(42,36,24,0.7)' }}>
          <strong>Головний Ринок</strong> = <strong>Головний Герой</strong>. Це не просто маркетплейс — це інфраструктура народного спротиву.
        </p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(42,36,24,0.7)' }}>
          Проєкт об'єднує <strong>Звіти</strong> (прозорість) та <strong>Народний ленд-ліз</strong> (передача речей та послуг на потреби ЗСУ).
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(42,36,24,0.7)' }}>
          Партнер: фонд <strong>Support Ukraine Foundation</strong> — гарантує цільове використання коштів.
        </p>
      </GlassCard>

      {/* Mission */}
      <GlassCard className="p-5 mb-4">
        <h2 className="font-bold text-base mb-3" style={{ color: '#F4801A' }}>🎯 Місія</h2>
        <p className="text-base font-medium italic text-center py-2" style={{ color: '#2A2418' }}>
          "У кожного вже є все, щоб допомогти"
        </p>
        <div className="mt-3 pt-3 border-t border-white/20">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(42,36,24,0.7)' }}>
            Від скріпки до ноутбука, від години консультації до курсу програмування — все може стати частиною оборони України.
          </p>
        </div>
      </GlassCard>

      {/* FPV section */}
      <GlassCard className="p-5 mb-4">
        <h2 className="font-bold text-base mb-3" style={{ color: '#7CB342' }}>🚁 Технологічний фронт</h2>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(42,36,24,0.7)' }}>
          Завдяки Головному Ринку фінансуються:
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span>🚁</span>
            <p className="text-sm" style={{ color: 'rgba(42,36,24,0.7)' }}>
              <strong>FPV-дрони</strong> — розробка та виробництво тактичних дронів
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span>🐉</span>
            <p className="text-sm" style={{ color: 'rgba(42,36,24,0.7)' }}>
              <strong>Дрон «Змій»</strong> — інноваційна розробка українських інженерів
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span>🔬</span>
            <p className="text-sm" style={{ color: 'rgba(42,36,24,0.7)' }}>
              <strong>Гурток «Науковий»</strong> — підготовка наступного покоління оборонних технологів
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Values */}
      <div className="mb-4">
        <h2 className="font-bold text-base mb-3" style={{ color: '#2A2418' }}>💎 Цінності</h2>
        <div className="grid grid-cols-2 gap-3">
          {values.map(v => (
            <GlassCard key={v.title} className="p-4">
              <span className="text-2xl">{v.icon}</span>
              <p className="font-semibold text-sm mt-2 mb-1" style={{ color: '#2A2418' }}>{v.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(42,36,24,0.6)' }}>{v.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Less is more */}
      <GlassCard strong className="p-5 mb-4">
        <p className="text-sm italic text-center mb-2" style={{ color: 'rgba(42,36,24,0.6)' }}>Людвіг Міс ван дер Рое:</p>
        <p className="text-base font-bold text-center" style={{ color: '#2A2418' }}>"Less is more"</p>
        <p className="text-sm mt-3 leading-relaxed text-center" style={{ color: 'rgba(42,36,24,0.7)' }}>
          Менше — більше. Одна дія множить результат у 10 разів.
        </p>
      </GlassCard>

      {/* Footer */}
      <GlassCard className="p-4 text-center">
        <p className="text-sm font-medium" style={{ color: '#7CB342' }}>🌻 Слава Україні!</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(42,36,24,0.5)' }}>
          Головний Ринок · Народний ленд-ліз · Support Ukraine Foundation
        </p>
      </GlassCard>
    </div>
  );
}
