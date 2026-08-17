import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../api/dashboardApi';
import { tasksApi } from '../../api/tasksApi';
import type { DashboardStats, Task } from '../../types';
import StatsCard from './StatsCard';
import DonutChart from './DonutChart';
import PriorityBars from './PriorityBars';
import TaskRow from './TaskRow';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus,
} from 'lucide-react';

// 🔥 Define the trend type
type TrendDirection = 'up' | 'down' | 'flat';

interface Trend {
  direction: TrendDirection;
  text: string;
}

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, tasksData] = await Promise.all([
        isAdmin ? dashboardApi.getAdminStats() : dashboardApi.getStats(),
        tasksApi.getTasks(),
      ]);
      setStats(statsData);
      setAllTasks(tasksData);
      setRecentTasks(tasksData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // 🔥 DYNAMIC CALCULATIONS WITH PROPER TYPES
  // ============================================================

  const getWeeklyChange = (tasks: Task[]): Trend => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentWeek = tasks.filter(t => new Date(t.createdAt) >= sevenDaysAgo).length;
    const previousWeek = tasks.filter(t => {
      const created = new Date(t.createdAt);
      return created >= fourteenDaysAgo && created < sevenDaysAgo;
    }).length;

    const change = recentWeek - previousWeek;
    const direction: TrendDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
    const text = change === 0 
      ? 'no change' 
      : `${Math.abs(change)} since last week`;

    return { direction, text };
  };

  const getCompletedWeeklyChange = (tasks: Task[]): Trend => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentWeek = tasks.filter(t => 
      t.status === 'Completed' && new Date(t.updatedAt || t.createdAt) >= sevenDaysAgo
    ).length;
    const previousWeek = tasks.filter(t => {
      const date = new Date(t.updatedAt || t.createdAt);
      return t.status === 'Completed' && date >= fourteenDaysAgo && date < sevenDaysAgo;
    }).length;

    const change = recentWeek - previousWeek;
    const direction: TrendDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
    const text = change === 0 
      ? 'no change' 
      : `${Math.abs(change)} since last week`;

    return { direction, text };
  };

  const getInProgressWeeklyChange = (tasks: Task[]): Trend => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentWeek = tasks.filter(t => 
      t.status === 'InProgress' && new Date(t.updatedAt || t.createdAt) >= sevenDaysAgo
    ).length;
    const previousWeek = tasks.filter(t => {
      const date = new Date(t.updatedAt || t.createdAt);
      return t.status === 'InProgress' && date >= fourteenDaysAgo && date < sevenDaysAgo;
    }).length;

    const change = recentWeek - previousWeek;
    const direction: TrendDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
    const text = change === 0 
      ? 'no change' 
      : `${Math.abs(change)} since last week`;

    return { direction, text };
  };

  const getPendingWeeklyChange = (tasks: Task[]): Trend => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentWeek = tasks.filter(t => 
      t.status === 'Pending' && new Date(t.updatedAt || t.createdAt) >= sevenDaysAgo
    ).length;
    const previousWeek = tasks.filter(t => {
      const date = new Date(t.updatedAt || t.createdAt);
      return t.status === 'Pending' && date >= fourteenDaysAgo && date < sevenDaysAgo;
    }).length;

    const change = recentWeek - previousWeek;
    const direction: TrendDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
    const text = change === 0 
      ? 'no change' 
      : `${Math.abs(change)} since last week`;

    return { direction, text };
  };

  const getStatusData = (tasks: Task[]) => {
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'InProgress').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    
    return [
      { label: 'Completed', value: completed, color: '#0EA36B' },
      { label: 'In progress', value: inProgress, color: '#4F46E5' },
      { label: 'Pending', value: pending, color: '#9A9EB0' },
    ];
  };

  const getPriorityData = (tasks: Task[]) => {
    const high = tasks.filter(t => t.priority === 'High').length;
    const medium = tasks.filter(t => t.priority === 'Medium').length;
    const low = tasks.filter(t => t.priority === 'Low').length;
    const total = high + medium + low || 1;
    
    return [
      { label: 'High', count: high, total, color: '#E5473A' },
      { label: 'Medium', count: medium, total, color: '#E38B00' },
      { label: 'Low', count: low, total, color: '#9A9EB0' },
    ];
  };

  const getFilteredTasks = () => {
    if (activeFilter === 'All') return recentTasks;
    return recentTasks.filter(task => task.status === activeFilter);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-t-transparent border-[#4F46E5] rounded-full animate-spin" />
      </div>
    );
  }

  const totalTasks = stats?.totalTasks || 0;
  const statusData = getStatusData(allTasks);
  const priorityData = getPriorityData(allTasks);
  const filteredTasks = getFilteredTasks();
  
  // 🔥 Dynamic trends
  const totalChange = getWeeklyChange(allTasks);
  const completedChange = getCompletedWeeklyChange(allTasks);
  const inProgressChange = getInProgressWeeklyChange(allTasks);
  const pendingChange = getPendingWeeklyChange(allTasks);

  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-['Sora'] tracking-tight">
            Welcome back, {user?.username}
          </h1>
          <p className="text-[15px] text-[#666B80] mt-1">
            Here's what's on your plate today.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-3 rounded-xl font-semibold text-[14px] shadow-lg shadow-[#4F46E5]/30 hover:bg-[#372F9E] transition">
          <Plus className="w-4 h-4" />
          New task
        </button>
      </div>

      {/* Stats Grid - Dynamic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="My total tasks"
          value={totalTasks}
          icon={LayoutDashboard}
          iconBg="bg-[#EEEDFC]"
          iconColor="text-[#4F46E5]"
          tag="#ALL"
          trend={totalTasks > 0 ? totalChange : undefined}
        />
        <StatsCard
          title="Pending"
          value={stats?.pending || 0}
          icon={Circle}
          iconBg="bg-[#FDF1DD]"
          iconColor="text-[#E38B00]"
          tag="#PEND"
          trend={(stats?.pending || 0) > 0 ? pendingChange : undefined}
        />
        <StatsCard
          title="In progress"
          value={stats?.inProgress || 0}
          icon={Clock}
          iconBg="bg-[#EEEDFC]"
          iconColor="text-[#4F46E5]"
          tag="#PROG"
          trend={(stats?.inProgress || 0) > 0 ? inProgressChange : undefined}
        />
        <StatsCard
          title="Completed"
          value={stats?.completed || 0}
          icon={CheckCircle2}
          iconBg="bg-[#E4F8EE]"
          iconColor="text-[#0EA36B]"
          tag="#DONE"
          trend={(stats?.completed || 0) > 0 ? completedChange : undefined}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-['Sora'] font-bold text-xl">Status breakdown</h3>
              <p className="text-[13px] text-[#9A9EB0] font-mono">{totalTasks} tasks total</p>
            </div>
          </div>
          <DonutChart data={statusData} total={totalTasks} totalLabel="tasks" />
        </div>

        <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-['Sora'] font-bold text-xl">Priority mix</h3>
              <p className="text-[13px] text-[#9A9EB0] font-mono">across open tasks</p>
            </div>
          </div>
          <PriorityBars data={priorityData} />
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-['Sora'] font-bold text-xl">Recent tasks</h3>
            <p className="text-[13px] text-[#9A9EB0] font-mono">your latest activity</p>
          </div>
          <a href="#" className="text-[13px] font-semibold text-[#4F46E5] hover:underline">View all →</a>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 flex-wrap mb-3.5">
          {['All', 'Pending', 'InProgress', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-[13px] font-medium px-3 py-1.5 rounded-full border transition ${
                activeFilter === filter
                  ? 'bg-[#EEEDFC] text-[#372F9E] border-[#D9D6FA]'
                  : 'bg-[#EFF0F7] text-[#666B80] border-transparent hover:bg-[#EEEDFC]'
              }`}
            >
              {filter === 'InProgress' ? 'In progress' : filter}
            </button>
          ))}
        </div>

        {/* Task List Header */}
        <div className="grid grid-cols-[60px_1fr_90px_90px_100px] items-center gap-2.5 px-1 pb-2 border-b border-[#E4E6F0] font-mono text-[11px] uppercase tracking-wide text-[#9A9EB0]">
          <span>ID</span>
          <span>Task</span>
          <span>Priority</span>
          <span>Due</span>
          <span>Status</span>
        </div>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskRow
              key={task.id}
              id={`#TQ-${String(task.id).padStart(2, '0')}`}
              title={task.title}
              category={task.category}
              priority={task.priority as 'Low' | 'Medium' | 'High'}
              dueDate={new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              status={task.status as 'Pending' | 'InProgress' | 'Completed'}
            />
          ))
        ) : (
          <div className="text-center py-8 text-[#9A9EB0]">
            <p>No tasks yet. Create your first task!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;