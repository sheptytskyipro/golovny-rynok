import GlassCard from '../components/GlassCard';
import { useTelegram } from '../hooks/useTelegram';

interface FrontRearProps {
  onBack: () => void;
}

const examples = [
  { icon: '🏥', title: 'Відвідати військового в лікарні', desc: 'Моральна підтримка та допомога з реабілітацією' },
  { icon: '📄', title: 'Допомогти з документами', desc: 'Оформлення виплат, пільг, документів' },
  { icon: '🚗', title: 'Підвезти до лікарні', desc: 'Транспортна допомога ветеранам та їхнім сім\'ям' },
  { icon: '🍲', title: 'Приготувати їжу', desc: 'Допомога сім\'ям, де є мобілізовані' },
  { icon: '📚', title: 'Навчання дітей', desc: 'Репетиторство для дітей захисників' },
  { icon: '💬', title: 'Психологічна підтримка', desc: 'Розмова, слухання, підтримка близьких' },
];

const warnings = [
  'Не публікуйте координати та місця дислокації',
  'Не передавайте позивні та особисті дані',
  'Не обговорюйте оперативні плани',
  'Перевіряйте людей перед зустріччю',
];

export default function FrontRear({ onBack }: FrontRearProps) {
  const { haptic } = useTelegram();
  return (
    <div className="page-container">
      <button className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#F4801A' }} onClick={() => { haptic('light'); onBack(); }}>
        ← Назад
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl" style={{ background: 'linear-gradient(135deg, rgba(124,179,66,0.2), rgba(244,128,26,0.1))' }}>
          🌉
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-2xl font-bold" style={{ color: '#2A2418' }}>Фронт-Тил</h1>
          <span className="text-xs px-2 py-1 rounded-full text-white font-bold" style={{ background: '#F4801A' }}>СКОРО</span>
        </div>
        <p className="text-sm" style={{ color: '#7CB342' }}>Міст між фронтом і тилом</p>
      </div>

      {/* Description */}
      <GlassCard strong className="p-5 mb-4">
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(42,36,24,0.7)' }}>
          <strong style={{ color: '#2A2418' }}>Фронт-Тил</strong> — розділ, де тилові жителі знаходять конкретні можливості підтримати тих, хто на фронті або повертається з нього.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: 'rgba(42,36,24,0.7)' }}>
          Це не про гроші — це про <strong>живий людський контакт</strong>. Час, увага, присутність.
        </p>
      </GlassCard>

      {/* Examples */}
      <div className="mb-4">
        <h2 className="font-bold text-base mb-3" style={{ color: '#2A2418' }}>🤝 Приклади допомоги</h2>
        <div className="space-y-3">
          {examples.map(ex => (
            <GlassCard key={ex.title} className="p-4 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{ex.icon}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#2A2418' }}>{ex.title}</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(42,36,24,0.6)' }}>{ex.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Safety warning */}
      <GlassCard className="p-4 mb-4" style={{ borderColor: 'rgba(244,128,26,0.3)', background: 'rgba(244,128,26,0.08)' }}>
        <div className="flex items-start gap-2 mb-3">
          <span className="text-xl">⚠️</span>
          <h3 className="font-bold text-sm" style={{ color: '#F4801A' }}>Правила безпеки</h3>
        </div>
        <div className="space-y-2">
          {warnings.map(w => (
            <div key={w} className="flex items-start gap-2">
              <span className="text-xs mt-0.5" style={{ color: '#F4801A' }}>●</span>
              <p className="text-xs" style={{ color: 'rgba(42,36,24,0.7)' }}>{w}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Coming soon CTA */}
      <GlassCard strong className="p-6 text-center">
        <span className="text-4xl">🚀</span>
        <h3 className="font-bold text-lg mt-3 mb-2" style={{ color: '#2A2418' }}>Незабаром</h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(42,36,24,0.7)' }}>
          Ми будуємо безпечну платформу для живих зустрічей і реальної допомоги. Будьте першими!
        </p>
        <button
          className="btn-primary w-full"
          onClick={() => { haptic('medium'); alert('Підписку оформлено! Ми повідомимо вас про запуск 🎉'); }}
        >
          🔔 Повідомити про запуск
        </button>
      </GlassCard>
    </div>
  );
}
