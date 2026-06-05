import { Service } from '../types';
import GlassCard from './GlassCard';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const categoryEmoji: Record<string, string> = {
  'освіта': '📚',
  'дизайн': '🎨',
  'IT': '💻',
  'ремонт': '🔨',
  'фото/відео': '📸',
  'краса': '💄',
  'переклади': '🌐',
  'юридичні': '⚖️',
};

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <GlassCard onClick={onClick} className="p-4">
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(124,179,66,0.2), rgba(244,128,26,0.1))' }}
        >
          {categoryEmoji[service.category] || '⚡'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight" style={{ color: '#2A2418' }}>{service.title}</h3>
            <span className="badge-zsu flex-shrink-0">ЗСУ</span>
          </div>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(42,36,24,0.6)' }}>{service.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-sm" style={{ color: '#F4801A' }}>{service.price.toLocaleString('uk-UA')} ₴</span>
            <div className="flex gap-1">
              <span className="chip text-xs py-0.5 px-2">{service.format}</span>
              <span className="chip text-xs py-0.5 px-2">{service.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
