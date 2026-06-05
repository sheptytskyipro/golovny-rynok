import { ReactNode, CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  strong?: boolean;
}

export default function GlassCard({ children, className = '', style, onClick, strong = false }: GlassCardProps) {
  const baseClass = strong ? 'glass-card-strong' : 'glass-card';
  return (
    <div
      className={`${baseClass} ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
