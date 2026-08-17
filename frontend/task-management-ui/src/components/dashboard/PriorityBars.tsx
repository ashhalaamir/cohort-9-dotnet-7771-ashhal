import React from 'react';

interface PriorityData {
  label: string;
  count: number;
  total: number;
  color: string;
}

interface PriorityBarsProps {
  data: PriorityData[];
}

const PriorityBars: React.FC<PriorityBarsProps> = ({ data }) => {
  return (
    <div className="space-y-3.5">
      {data.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-[12px] mb-1.5">
            <span className="text-[#666B80] font-medium">{item.label}</span>
            <span className="font-mono font-semibold">{item.count}</span>
          </div>
          <div className="h-[7px] bg-[#EFF0F7] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%`,
                background: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriorityBars;