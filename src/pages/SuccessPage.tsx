import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const fmt = (n: number) => n.toLocaleString('uk-UA');

export default function SuccessPage() {
  const { state } = useLocation() as { state: { title: string; amount: number; direction: string } | null };
  const navigate = useNavigate();

  if (!state) { navigate('/'); return null; }
  const txId = `GM-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div className="scale-in">
        <CheckCircle size={80} color="var(--accent-green)" strokeWidth={1.5} style={{ marginBottom: 20 }} />
      </div>
      <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Дякуємо!</h1>
      <p style={{ margin: '0 0 24px', fontSize: 16, color: 'var(--text-secondary)' }}>Твій внесок зараховано</p>

      <div style={{ background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', borderRadius: 24, padding: 20, width: '100%', maxWidth: 380, marginBottom: 32, textAlign: 'left' }}>
        <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Квитанція</p>
        <div style={{ borderBottom: '1px solid var(--separator)', paddingBottom: 10, marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>№ транзакції</p>
          <p style={{ margin: '2px 0 0', fontSize: 15, color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'monospace' }}>{txId}</p>
        </div>
        <div style={{ borderBottom: '1px solid var(--separator)', paddingBottom: 10, marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Лот</p>
          <p style={{ margin: '2px 0 0', fontSize: 15, color: 'var(--text-primary)', fontWeight: 600 }}>{state.title}</p>
        </div>
        <div style={{ borderBottom: '1px solid var(--separator)', paddingBottom: 10, marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Сума внеску</p>
          <p style={{ margin: '2px 0 0', fontSize: 22, color: 'var(--accent-orange)', fontWeight: 800 }}>{fmt(state.amount)} ₴</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Напрямок</p>
          <p style={{ margin: '2px 0 0', fontSize: 15, color: 'var(--accent-green)', fontWeight: 700 }}>{state.direction}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 }}>
        <button onClick={() => navigate('/mission')} style={{ padding: '14px', borderRadius: 16, border: '1px solid var(--accent-orange)', background: 'transparent', color: 'var(--accent-orange)', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
          Переглянути у Прозорості
        </button>
        <button onClick={() => navigate('/')} style={{ padding: '14px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,var(--accent-orange),var(--accent-yellow))', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
          До ринку
        </button>
      </div>
    </div>
  );
}
