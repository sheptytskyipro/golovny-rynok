import { Item } from '../types';
import GlassCard from './GlassCard';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

const categoryEmoji: Record<string, string> = {
  'техніка': '💻',
  'інструменти': '🔧',
  'туризм': '🏕️',
  'одяг': '👕',
  'дім': '🏠',
  'дитяче': '🧸',
  'авто': '🚗',
  'хобі': '🎨',
  'вінтаж': '🕰️',
  'хендмейд': '✂️',
  'спорядження': '⛺',
  'книги': '📚',
};

export default function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <GlassCard onClick={onClick} className="overflow-hidden">
      {/* Image placeholder */}
      <div
        className="w-full h-36 flex items-center justify-center text-4xl relative"
        style={{ background: 'linear-gradient(135deg, rgba(124,179,66,0.15), rgba(244,128,26,0.1))' }}
      >
        {item.images[0] ? (
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span>{categoryEmoji[item.category] || '📦'}</span>
        )}
        <div className="absolute top-2 right-2">
          <span className="badge-zsu">100% → ЗСУ</span>
        </div>
        {item.status === 'sold' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Продано</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2" style={{ color: '#2A2418' }}>{item.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-base" style={{ color: '#F4801A' }}>{item.price.toLocaleString('uk-UA')} ₴</span>
          <span className="text-xs" style={{ color: 'rgba(42,36,24,0.5)' }}>📍 {item.city}</span>
        </div>
        <div className="mt-2">
          <span className="chip text-xs py-1 px-2">{categoryEmoji[item.category]} {item.category}</span>
        </div>
      </div>
    </GlassCard>
  );
}
