import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tasksApi } from '../../api/tasksApi';
import type { Task } from '../../types';
import { 
  Plus, 
  Search, 
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react';

type StatusTab = 'all' | 'Pending' | 'InProgress' | 'Completed';

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, activeTab, searchTerm, priorityFilter, categoryFilter]);

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.getTasks();
      
      // 🔥 FIXED: Map user names from either userName or nested user object
      const tasksWithUserNames = data.map(task => ({
        ...task,
        // Try userName first (from API), then fallback to user?.username, then 'Unknown'
        userName: task.userName || task.user?.username || 'Unknown'
      }));
      
      setTasks(tasksWithUserNames);
      setFilteredTasks(tasksWithUserNames);
      
      // 🔥 Debug: Log the first task to see what's coming from the API
      if (tasksWithUserNames.length > 0) {
        console.log('First task from API:', tasksWithUserNames[0]);
        console.log('UserName:', tasksWithUserNames[0].userName);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...tasks];

    if (activeTab !== 'all') {
      result = result.filter(t => t.status === activeTab);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(t => 
        t.title.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term)
      );
    }

    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    setFilteredTasks(result);
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return tasks.length;
    return tasks.filter(t => t.status === status).length;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'InProgress') return 'In progress';
    return status;
  };

  const getStatusPillClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-[#EFF0F7] text-[#666B80] before:bg-[#9A9EB0]';
      case 'InProgress': return 'bg-[#FDF1DD] text-[#8A5300] before:bg-[#E38B00]';
      case 'Completed': return 'bg-[#E4F8EE] text-[#086941] before:bg-[#0EA36B]';
      default: return '';
    }
  };

  const getPriorityDotClass = (priority: string) => {
    switch (priority) {
      case 'High': return 'before:bg-[#E5473A]';
      case 'Medium': return 'before:bg-[#E38B00]';
      case 'Low': return 'before:bg-[#9A9EB0]';
      default: return 'before:bg-[#9A9EB0]';
    }
  };

  const handleRowClick = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setActiveTab('all');
  };

  const categories = ['all', ...new Set(tasks.map(t => t.category))].filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-t-transparent border-[#4F46E5] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-[1240px]">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[25px] font-bold font-['Sora'] tracking-[-0.015em] leading-tight mb-1">
            {isAdmin ? 'All tasks' : 'My tasks'}
          </h1>
          <p className="text-[13.5px] text-[#666B80]">
            {isAdmin 
              ? `${tasks.length} tasks across the team`
              : `${tasks.length} tasks assigned to you`
            }
          </p>
        </div>
        <button 
          onClick={() => navigate('/tasks/new')}
          className="flex items-center gap-2 bg-[#4F46E5] text-white px-4 py-2.5 rounded-[10px] font-semibold text-[13.5px] shadow-[0_10px_20px_-8px_rgba(79,70,229,0.55)] hover:bg-[#372F9E] transition whitespace-nowrap"
        >
          <Plus className="w-[15px] h-[15px]" />
          New task
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-[#E4E6F0] overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'Pending', label: 'Pending' },
          { key: 'InProgress', label: 'In progress' },
          { key: 'Completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as StatusTab)}
            className={`py-2.5 px-1 mr-[18px] text-[13px] font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-[#12131C] border-[#4F46E5]'
                : 'text-[#9A9EB0] border-transparent hover:text-[#666B80]'
            }`}
          >
            {tab.label}
            <span className={`text-[10.5px] font-mono px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key
                ? 'bg-[#EEEDFC] text-[#372F9E]'
                : 'bg-[#EFF0F7] text-[#666B80]'
            }`}>
              {getStatusCount(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2.5 flex-wrap w-full">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-[320px] bg-white border-[1.5px] border-[#E4E6F0] rounded-[10px] px-3 py-2.5 focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#EEEDFC] transition">
          <Search className="w-4 h-4 text-[#9A9EB0] flex-shrink-0" />
          <input
            type="text"
            placeholder="Filter by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-none outline-none bg-transparent text-[13px] placeholder:text-[#9A9EB0] min-w-[100px]"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[12.8px] font-medium bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition appearance-none min-w-[140px]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666B80' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '30px',
          }}
        >
          <option value="all">Priority: All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[12.8px] font-medium bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition appearance-none min-w-[140px]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666B80' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '30px',
          }}
        >
          <option value="all">Category: All</option>
          {categories.filter(c => c !== 'all').map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-[11.5px] font-mono text-[#9A9EB0] hover:text-[#E5473A] transition whitespace-nowrap px-1"
        >
          <X className="w-3 h-3" />
          Clear filters
        </button>

        <span className="ml-auto text-[12px] text-[#9A9EB0] font-mono whitespace-nowrap">
          {filteredTasks.length} results
        </span>
      </div>

      {/* Task List Table */}
      <div className="bg-white border border-[#E4E6F0] rounded-[14px] overflow-hidden w-full">
        {/* Table Head */}
        <div className={`grid ${isAdmin ? 'grid-cols-[60px_1fr_140px_100px_100px_120px_28px]' : 'grid-cols-[60px_1fr_100px_100px_120px_28px]'} items-center gap-3 px-5 py-3 bg-[#EFF0F7] border-b border-[#E4E6F0] font-mono text-[10px] uppercase tracking-wide text-[#9A9EB0]`}>
          <span>ID</span>
          <span className="flex items-center gap-1">Task <ChevronDown className="w-2.5 h-2.5 opacity-60" /></span>
          {isAdmin && <span>Assigned to</span>}
          <span>Priority</span>
          <span className="flex items-center gap-1">Due <ChevronDown className="w-2.5 h-2.5 opacity-60" /></span>
          <span>Status</span>
          <span></span>
        </div>

        {/* Task Rows */}
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
            // 🔥 Get the display name
            const displayName = task.userName || task.user?.username || 'Unknown';
            return (
              <div
                key={task.id}
                onClick={() => handleRowClick(task.id)}
                className={`grid ${isAdmin ? 'grid-cols-[60px_1fr_140px_100px_100px_120px_28px]' : 'grid-cols-[60px_1fr_100px_100px_120px_28px]'} items-center gap-3 px-5 py-3.5 border-b border-[#E4E6F0] hover:bg-[#EFF0F7] cursor-pointer transition last:border-none`}
              >
                <span className="font-mono text-[11px] text-[#9A9EB0]">#TQ-{String(task.id).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-[13px] truncate">{task.title}</div>
                  <div className="text-[11px] text-[#9A9EB0]">{task.category}</div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2 text-[12.5px] min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8A83F5] to-[#4F46E5] flex items-center justify-center text-[9.5px] font-mono font-semibold text-white flex-shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{displayName}</span>
                  </div>
                )}
                <span className={`flex items-center gap-1.5 text-[12px] text-[#666B80] before:content-[''] before:w-[7px] before:h-[7px] before:rounded-full before:flex-shrink-0 ${getPriorityDotClass(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`font-mono text-[11.5px] ${isOverdue ? 'text-[#E5473A] font-semibold' : 'text-[#666B80]'}`}>
                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-full justify-self-start before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full ${getStatusPillClass(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
                <ChevronRight className="w-4 h-4 text-[#9A9EB0] justify-self-end flex-shrink-0" />
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-[#9A9EB0]">
            <Search className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-[13.5px] font-semibold text-[#666B80]">No tasks match your filters</p>
            <p className="text-[12px]">Try adjusting or clearing the filters above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;