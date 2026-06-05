import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import GlassCard from '../components/GlassCard';
import { TransparencyStats } from '../types';

const stats: TransparencyStats = {
  totalCollected: 1247350,
  monthlyData: [
    { month: 'Вер', amount: 145000, transactions: 42 },
    { month: 'Жов', amount: 198000, transactions: 58 },
    { month: 'Лис', amount: 212000, transactions: 63 },
    { month: 'Гру', amount: 187500, transactions: 54 },
    { month: 'Січ', amount: 256800, transactions: 72 },
    { month: 'Лют', amount: 248050, transactions: 69 },
  ],
  directionData: [
    { name: 'Розробка дронів', value: 498940, color: '#7CB342' },
    { name: 'Гурток «Науковий»', value: 311838, color: '#F4801A' },
    { name: '3-тя штурмова', value: 249470, color: '#558B2F' },
    { name: '47-ма МАҐУРА', value: 187102, color: '#F5C518' },
  ],
  recentTransactions: [
    { id: 't1', date: '2024-02-15', amount: 18500, direction: 'Розробка дронів', type: 'item', itemTitle: 'Ноутбук Dell' },
    { id: 't2', date: '2024-02-15', amount: 2400, direction: 'Гурток «Науковий»', type: 'service', itemTitle: 'Курс англійської' },
    { id: 't3', date: '2024-02-14', amount: 4200, direction: 'Розробка дронів', type: 'item', itemTitle: 'Туристичне спорядження' },
    { id: 't4', date: '2024-02-14', amount: 3500, direction: '47-ма МАҐУРА', type: 'service', itemTitle: 'Дизайн логотипу' },
    { id: 't5', date: '2024-02-13', amount: 7200, direction: '3-тя штурмова', type: 'item', itemTitle: 'Гірські лижі' },
    { id: 't6', date: '2024-02-13', amount: 8000, direction: 'Розробка дронів', type: 'service', itemTitle: 'Landing page' },
    { id: 't7', date: '2024-02-12', amount: 5500, direction: 'Гурток «Науковий»', type: 'item', itemTitle: 'Швейна машина Singer' },
    { id: 't8', date: '2024-02-12', amount: 2800, direction: '47-ма МАҐУРА', type: 'item', itemTitle: 'Дитячий велосипед' },
    { id: 't9', date: '2024-02-11', amount: 1200, direction: '3-тя штурмова', type: 'service', itemTitle: 'Юридична консультація' },
    { id: 't10', date: '2024-02-11', amount: 6800, direction: 'Розробка дронів', type: 'item', itemTitle: 'Радіокерована модель' },
  ],
};

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
  return (
    <div className="page-container">
      <h2 className="section-title">📊 Прозорість</h2>

      {/* Total */}
      <GlassCard strong className="p-6 text-center mb-6">
        <p className="text-sm mb-1" style={{ color: 'rgba(42,36,24,0.5)' }}>Загалом зібрано та передано</p>
        <p className="text-4xl font-bold" style={{ color: '#7CB342' }}>
          ₴ <AnimatedNumber value={stats.totalCollected} />
        </p>
        <p className="text-xs mt-2" style={{ color: 'rgba(42,36,24,0.4)' }}>
          Коефіцієнт ефективності: <strong style={{ color: '#F4801A' }}>1:10</strong> •
          {' '}{stats.recentTransactions.length} транзакцій показано
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
                data={stats.directionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {stats.directionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₴ ${value.toLocaleString('uk-UA')}`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {stats.directionData.map(d => (
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

      {/* Line chart */}
      <div className="mb-6">
        <h3 className="font-semibold text-base mb-3" style={{ color: '#2A2418' }}>Динаміка зборів (місяці)</h3>
        <GlassCard className="p-4">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stats.monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,36,24,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(42,36,24,0.6)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(42,36,24,0.6)' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [`₴ ${value.toLocaleString('uk-UA')}`, 'Зібрано']} />
              <Line type="monotone" dataKey="amount" stroke="#7CB342" strokeWidth={2.5} dot={{ fill: '#7CB342', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Community auditor message */}
      <GlassCard strong className="p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl">👥</span>
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
          {stats.recentTransactions.map(tx => (
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
