import React from 'react';

interface TaskRowProps {
  id: string;
  title: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  status: 'Pending' | 'InProgress' | 'Completed';
}

const TaskRow: React.FC<TaskRowProps> = ({
  id,
  title,
  category,
  priority,
  dueDate,
  status,
}) => {
  const priorityColors = {
    Low: 'text-[#9A9EB0] before:bg-[#9A9EB0]',
    Medium: 'text-[#E38B00] before:bg-[#E38B00]',
    High: 'text-[#E5473A] before:bg-[#E5473A]',
  };

  const statusStyles = {
    Pending: 'bg-[#EFF0F7] text-[#666B80] before:bg-[#9A9EB0]',
    InProgress: 'bg-[#FDF1DD] text-[#8A5300] before:bg-[#E38B00]',
    Completed: 'bg-[#E4F8EE] text-[#086941] before:bg-[#0EA36B]',
  };

  const isOverdue = new Date(dueDate) < new Date();

  return (
    <div className="grid grid-cols-[60px_1fr_90px_90px_100px] items-center gap-2.5 py-2.5 px-1 border-b border-[#E4E6F0] text-[13px] last:border-none">
      <span className="font-mono text-[11px] text-[#9A9EB0]">{id}</span>
      <div>
        <div className="font-semibold text-[13px]">{title}</div>
        <div className="text-[11px] text-[#9A9EB0]">{category}</div>
      </div>
      <span className={`flex items-center gap-1.5 text-[12px] text-[#666B80] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full ${priorityColors[priority]}`}>
        {priority}
      </span>
      <span className={`font-mono text-[11.5px] ${isOverdue && status !== 'Completed' ? 'text-[#E5473A] font-semibold' : 'text-[#666B80]'}`}>
        {dueDate}
      </span>
      <span className={`pill inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${statusStyles[status]} before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full`}>
        {status === 'InProgress' ? 'In progress' : status}
      </span>
    </div>
  );
};

export default TaskRow;