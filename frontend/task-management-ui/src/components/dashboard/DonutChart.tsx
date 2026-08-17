import React from 'react';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  total: number;
  totalLabel?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, total, totalLabel = 'tasks' }) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;
  const segments = data.map((item) => {
    const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
    const start = cumulativePercentage;
    cumulativePercentage += percentage;
    return { ...item, percentage, start, end: cumulativePercentage };
  });

  const conicGradient = segments
    .map((seg) => `${seg.color} ${seg.start}% ${seg.end}%`)
    .join(', ');

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: `conic-gradient(${conicGradient})`,
        }}
      >
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="font-display text-[21px] font-bold leading-none">{total}</div>
            <div className="text-[9.5px] text-[#9A9EB0] font-mono uppercase tracking-wide">{totalLabel}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 flex-1">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-[12.5px]">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-[#666B80] flex-1">{item.label}</span>
            <span className="font-mono font-semibold text-[12.5px]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;