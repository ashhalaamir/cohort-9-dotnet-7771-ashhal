import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  tag: string;
  trend?: {
    direction: 'up' | 'down' | 'flat';
    text: string;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  tag,
  trend,
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    flat: 'text-gray-400',
  };

  const trendSymbols = {
    up: '↑',
    down: '↓',
    flat: '—',
  };

  return (
    <div className="bg-white border border-[#E4E6F0] rounded-xl p-4 relative overflow-hidden">
      <span className="absolute top-3 right-4 font-mono text-[10px] text-[#9A9EB0] tracking-wide">
        {tag}
      </span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="font-display text-[30px] font-bold tracking-tight leading-none">
        {value}
      </div>
      <div className="text-[12.5px] text-[#666B80] mt-1.5">{title}</div>
      {trend && (
        <div className={`mt-3 font-mono text-[11px] flex items-center gap-1 ${trendColors[trend.direction]}`}>
          <span>{trendSymbols[trend.direction]}</span>
          {trend.text}
        </div>
      )}
    </div>
  );
};

export default StatsCard;