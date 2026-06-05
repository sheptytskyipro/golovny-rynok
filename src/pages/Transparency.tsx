import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import GlassCard from '../components/GlassCard';
import { getTransactions, getTotalContributed, DIRECTIONS } from '../store';

const DIRECTION_COLORS: Record<string, string> = {
  'Розробка дронів': '#7CB342',
  'Гурток «Науковий»': '#F4801A',
  '3-тя штурмова': '#558B2F',
  '47-ма МАҐУРА': '#F5C518',
};

const MONTHLY_DATA = [
  { month: 'Січ', amount: 145000 },
  { month: 'Лют', amount: 198000 },
  { month: 'Бер', amount: 212000 },
  { month: 'Кві', amount: 187500 },
  { month: 'Тра', amount: 256800 },
  { month: 'Чер', amount: 47350 },
];

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { setDisplayed(value); clearInterval(interval); }
      else setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(interval);
  }, [value, duration]);

  return <span>{displayed.toLocaleString('uk-UA')}</span>;
}

export default function Transparency() {
  const transactions = getTransactions();
  const total = getTotalContributed();

  // Build pie chart data from transactions
  const directionTotals: Record<string, number> = {};
  for (const dir of DIRECTIONS) directionTotals[dir] = 0;
  for (const tx of transactions) {
    if (directionTotals[tx.direction] !== undefined) {
      directionTotals[tx.direction] += tx.amount;
    }
  }
  const directionData = DIRECTIONS.map(name => ({
    name,
    value: directionTotals[name] || 0,
    color: DIRECTION_COLORS[name] || '#999',
  })).filter(d => d.value > 0);

  return (
    <div className="page-container">
      <h2 className="section-title">📊 Прозорість</h2>

      {/* Total */}
      <GlassCard strong className="p-6 text-center mb-6">
        <p className="text-sm mb-1" style={{ color: 'rgba(42,36,24,0.5)' }}>Загалом зібрано та передано</p>
        <p className="text-4xl font-bold" style={{ color: '#7CB342' }}>
          ₴ <AnimatedNumber value={total} />
        </p>
        <p className="text-xs mt-2" style={{ color: 'rgba(42,36,24,0.4)' }}>
          Коефіцієнт ефективності: <strong style={{ color: '#F4801A' }}>1:10</strong> •{' '}
          {transactions.length} транзакцій
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="badge-zsu">🔒 Верифіковано</span>
          <span className="text-xs" style={{ color: 'rgba(42,36,24,0.4)' }}>Support Ukraine Foundation</span>
        </div>
      </GlassCard>

      {/* Pie chart */}
      <div className="mb-6">
        <h3 className="font-semibold text-base mb-3" style={{ color: '#2A2418' }}>Розподіл по напрямах</h3>
        <GlassCard className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={directionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {directionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₴ ${value.toLocaleString('uk-UA')}`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {directionData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <div>
                  <p className="text-xs font-medium leading-tight" style={{ color: '#2A2418' }}>{d.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(42,36,24,0.5)' }}>₴ {d.value.toLocaleString('uk-UA')}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bar chart */}
      <div className="mb-6">
        <h3 className="font-semibold text-base mb-3" style={{ color: '#2A2418' }}>Динаміка зборів (місяці)</h3>
        <GlassCard className="p-4">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,36,24,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(42,36,24,0.6)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(42,36,24,0.6)' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`₴ ${value.toLocaleString('uk-UA')}`, 'Зібрано']} />
              <Bar dataKey="amount" fill="#7CB342" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Community auditor */}
      <GlassCard strong className="p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl">🔒</span>
        <div>
          <p className="font-semibold text-sm" style={{ color: '#2A2418' }}>Спільнота — аудитор</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(42,36,24,0.6)' }}>
            Кожна транзакція публічна. Ми публікуємо звіти щомісяця. Ніяких особистих даних — тільки суми та напрями.
          </p>
        </div>
      </GlassCard>

      {/* Transaction registry */}
      <div className="mb-4">
        <h3 className="font-semibold text-base mb-3" style={{ color: '#2A2418' }}>Реєстр транзакцій</h3>
        <div className="space-y-2">
          {transactions.slice(0, 20).map(tx => (
            <GlassCard key={tx.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{tx.type === 'item' ? '📦' : '⚡'}</span>
                    <p className="text-xs font-medium truncate" style={{ color: '#2A2418' }}>{tx.itemTitle}</p>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(42,36,24,0.5)' }}>{tx.direction} · {tx.date}</p>
                </div>
                <p className="font-bold text-sm ml-2 flex-shrink-0" style={{ color: '#7CB342' }}>
                  ₴ {tx.amount.toLocaleString('uk-UA')}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <GlassCard className="p-4 text-center">
        <p className="text-xs" style={{ color: 'rgba(42,36,24,0.5)' }}>
          🔒 Персональні дані не відображаються · Дані перевірені Foundation Support Ukraine
        </p>
      </GlassCard>
    </div>
  );
}
