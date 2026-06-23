import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, Package, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useMissionStore } from '../store/useMissionStore';
import type { ContributionDirection } from '../types';

const COLORS = ['#F4801A', '#7CB342', '#F5C518', '#6366F1'];
const fmt = (n: number) => n.toLocaleString('uk-UA');
const MONTH_NAMES: Record<string, string> = { '01': 'Січ', '02': 'Лют', '03': 'Бер', '04': 'Кві', '05': 'Тра', '06': 'Чер', '07': 'Лип', '08': 'Сер', '09': 'Вер', '10': 'Жов', '11': 'Лис', '12': 'Гру' };

function CountUp({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = Date.now();
    const dur = 1000;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setVal(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <>{fmt(val)}</>;
}

function CollapsibleCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 20, marginBottom: 10 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>
        {title} {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div style={{ padding: '0 16px 14px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{children}</div>}
    </div>
  );
}

export default function MissionPage() {
  const transactions = useMissionStore(s => s.transactions);

  const total = useMemo(() => transactions.reduce((sum, t) => sum + t.amount, 0), [transactions]);

  const byDir = useMemo(() => {
    const dirs: Record<ContributionDirection, number> = { 'Розробка дронів': 0, 'Гурток «Науковий»': 0, '3-тя штурмова': 0, '47-ма МАҐУРА': 0 };
    transactions.forEach(t => { dirs[t.direction] = (dirs[t.direction] || 0) + t.amount; });
    return dirs;
  }, [transactions]);

  const byMonth = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(t => {
      const month = t.createdAt.slice(0, 7);
      map[month] = (map[month] || 0) + t.amount;
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([month, amount]) => ({ month, amount }));
  }, [transactions]);

  const pieData = useMemo(() => Object.entries(byDir).map(([name, value]) => ({ name, value })), [byDir]);
  const barData = useMemo(() => byMonth.slice(-6).map(({ month, amount }) => {
    const [, m] = month.split('-');
    return { month: MONTH_NAMES[m] || m, amount };
  }), [byMonth]);

  const itemCount = useMemo(() => transactions.filter(t => t.type === 'item').length, [transactions]);
  const svcCount = useMemo(() => transactions.filter(t => t.type === 'service').length, [transactions]);

  const cardStyle = { background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 16 };

  return (
    <div style={{ padding: '16px 16px 16px' }}>
      {/* Hero total */}
      <div style={{ textAlign: 'center', marginBottom: 20, paddingTop: 8 }}>
        <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Разом зібрано</p>
        <p style={{ margin: 0, fontSize: 44, fontWeight: 900, color: 'var(--accent-orange)', lineHeight: 1.1 }}><CountUp target={total} /> <span style={{ fontSize: 24 }}>₴</span></p>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>Коефіцієнт ефективності 1:10</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { icon: Package, label: 'Речей продано', value: itemCount },
          { icon: Sparkles, label: 'Послуг надано', value: svcCount },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} style={{ ...cardStyle, textAlign: 'center' }}>
            <Icon size={24} color="var(--accent-orange)" style={{ margin: '0 auto 8px', display: 'block' }} />
            <p style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-tertiary)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Pie chart */}
      <div style={{ ...cardStyle, marginBottom: 12 }}>
        <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Розподіл за напрямами</p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pieData.map(({ name, value }, i) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(value)} ₴</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Динаміка за місяцями</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData}>
            <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', borderRadius: 12, color: 'var(--text-primary)' }} formatter={(v: number) => [`${fmt(v)} ₴`, 'Сума']} />
            <Bar dataKey="amount" fill="var(--accent-orange)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction registry */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Реєстр транзакцій</p>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-tertiary)' }}>Спільнота — аудитор. Без персональних даних.</p>
        {transactions.slice(0, 10).map(t => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--separator)' }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{t.itemTitle}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-tertiary)' }}>{t.direction} · {t.createdAt.slice(0, 10)}</p>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-orange)', flexShrink: 0, marginLeft: 12 }}>{fmt(t.amount)} ₴</span>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Чому Головний Ринок</p>
        <div style={{ background: 'rgba(244,128,26,0.08)', border: '1px solid rgba(244,128,26,0.2)', borderRadius: 20, padding: 16, marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>"У кожного вже є все, щоб допомогти — треба лише дати ресурсам напрямок"</p>
        </div>
        <CollapsibleCard title="Третій Сезон Головного Героя">
          Головний Ринок — продовження «Головного Героя», об'єднання «Звітів» і «Народного Ленд-Лізу» фонду Support Ukraine. Перший сезон довів: 100 000 ₴ власних коштів → 1 000 000 ₴ акумульованих. Коефіцієнт ефективності 1:10.
        </CollapsibleCard>
        <CollapsibleCard title="Простота як цінність">
          Філософія «Менше — Більше» (Міс ван дер Рое). Мінімалізм — не обмеження, а стратегія. Кожна зайва ланка в ланцюгу — це втрата. Ринок прибирає всі зайві ланки між бажанням допомогти і реальним внеском.
        </CollapsibleCard>
        <CollapsibleCard title="Речі отримують друге дихання">
          FPV-дрони «Змій», дрон-комплекси, мобільні майстерні МАҐУРА — все це починалося з простих рішень. Гурток «Науковий» виховує нове покоління інженерів прямо зараз.
        </CollapsibleCard>
      </div>

      {/* Track record */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Картина Другого Сезону</p>
        <p style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>100 000 ₴ → 1 000 000 ₴</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['3-тя штурмова бригада', '47-ма бригада МАҐУРА', 'Гурток «Науковий»', 'Розробка дронів'].map(d => (
            <span key={d} style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(124,179,66,0.15)', border: '1px solid rgba(124,179,66,0.3)', fontSize: 12, color: 'var(--accent-green)', fontWeight: 600 }}>{d}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <Shield size={16} color="var(--accent-green)" />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Фонд Support Ukraine</span>
        </div>
      </div>

      {/* Three horizons */}
      <p style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Три горизонти</p>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', marginBottom: 20 }} className="no-scrollbar">
        {[
          { title: 'Сьогодні', text: 'Кожна угода — прямий внесок. Речі та послуги стають зброєю захисту прямо зараз.' },
          { title: 'Завтра', text: 'Екосистема взаємодопомоги. Монети, досягнення, репутація — видимий слід кожного.' },
          { title: 'Після Перемоги', text: 'Інфраструктура відновлення. Ринок як міст між потребою і ресурсом у мирний час.' },
        ].map(({ title, text }) => (
          <div key={title} style={{ minWidth: 240, background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 16, flexShrink: 0 }}>
            <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: 'var(--accent-yellow)' }}>{title}</p>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}
      </div>

      {/* Closing */}
      <div style={{ background: 'linear-gradient(135deg,rgba(244,128,26,0.15),rgba(124,179,66,0.1))', border: '1px solid rgba(244,128,26,0.2)', borderRadius: 24, padding: '24px 20px', textAlign: 'center', marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5 }}>"Усе починається зі скріпки…</p>
        <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--text-secondary)' }}>Цінність народжується в русі. Рухаймось разом."</p>
      </div>
    </div>
  );
}
