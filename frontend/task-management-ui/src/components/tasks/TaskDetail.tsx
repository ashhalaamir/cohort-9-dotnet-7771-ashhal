import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tasksApi } from '../../api/tasksApi';
import { usersApi } from '../../api/usersApi';
import type { Task, User } from '../../types';
import { 
  ChevronRight, 
  Pencil, 
  Trash2, 
  CheckCircle2,
  Clock,
  Circle,
  Calendar,
  User as UserIcon,
  Tag,
  AlertCircle
} from 'lucide-react';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchTaskData();
  }, [id]);

  const fetchTaskData = async () => {
    try {
      const [taskData, usersData] = await Promise.all([
        tasksApi.getTaskById(Number(id)),
        isAdmin ? usersApi.getProfile() : Promise.resolve([]),
      ]);
      setTask(taskData);
      if (isAdmin && Array.isArray(usersData)) {
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await tasksApi.updateTask(task.id, {
        ...task,
        status: newStatus,
      });
      setTask(updated);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    try {
      await tasksApi.deleteTask(task.id);
      navigate('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusPillClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-[#EFF0F7] text-[#666B80] before:bg-[#9A9EB0]';
      case 'InProgress': return 'bg-[#FDF1DD] text-[#8A5300] before:bg-[#E38B00]';
      case 'Completed': return 'bg-[#E4F8EE] text-[#086941] before:bg-[#0EA36B]';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'InProgress') return 'In progress';
    return status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Circle className="w-4 h-4 text-[#9A9EB0]" />;
      case 'InProgress': return <Clock className="w-4 h-4 text-[#E38B00]" />;
      case 'Completed': return <CheckCircle2 className="w-4 h-4 text-[#0EA36B]" />;
      default: return null;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'High': return 'high';
      case 'Medium': return 'medium';
      case 'Low': return 'low';
      default: return '';
    }
  };

  const isOverdue = task && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
  const canEdit = isAdmin || (user && task && task.userId === user.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-t-transparent border-[#4F46E5] rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#9A9EB0]">
        <AlertCircle className="w-12 h-12 mb-3" />
        <p className="text-lg font-semibold text-[#666B80]">Task not found</p>
        <Link to="/tasks" className="text-[#4F46E5] hover:underline mt-2">Back to tasks</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12.5px] text-[#9A9EB0] font-mono">
        <Link to="/tasks" className="hover:text-[#4F46E5] transition">Tasks</Link>
        <ChevronRight className="w-3 h-3" />
        <span>#TQ-{String(task.id).padStart(2, '0')}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[13px] font-semibold text-[#372F9E] bg-[#EEEDFC] px-3 py-1 rounded-full">
              #TQ-{String(task.id).padStart(2, '0')}
            </span>
            <span className={`pill inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full ${getStatusPillClass(task.status)} before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full`}>
              {getStatusIcon(task.status)}
              {getStatusLabel(task.status)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-['Sora'] tracking-tight break-words">
            {task.title}
          </h1>
          <p className="text-[14px] text-[#9A9EB0] font-mono">
            Created by <span className="text-[#666B80] font-semibold">{task.userName || 'Unknown'}</span> · 
            last updated {new Date(task.updatedAt || task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {canEdit && (
            <button
              onClick={() => navigate(`/tasks/${task.id}/edit`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E4E6F0] hover:bg-[#F5F6FA] transition text-[14px] font-semibold"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
          {canEdit && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#F6D3CF] text-[#E5473A] hover:bg-[#FCE9E7] transition text-[14px] font-semibold disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        {/* Left Column - Description */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
            <h3 className="font-['Sora'] font-bold text-[16px] mb-3">Description</h3>
            <div className="text-[14px] text-[#666B80] leading-relaxed whitespace-pre-wrap break-words">
              {task.description || 'No description provided.'}
            </div>
          </div>
        </div>

        {/* Right Column - Properties */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
            <h3 className="font-['Sora'] font-bold text-[16px] mb-4">Properties</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[#E4E6F0]">
                <span className="flex items-center gap-2 text-[12.5px] text-[#9A9EB0]">
                  <Tag className="w-3.5 h-3.5" />
                  Status
                </span>
                <span className={`pill inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${getStatusPillClass(task.status)} before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full`}>
                  {getStatusIcon(task.status)}
                  {getStatusLabel(task.status)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#E4E6F0]">
                <span className="flex items-center gap-2 text-[12.5px] text-[#9A9EB0]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Priority
                </span>
                <span className={`priority-dot flex items-center gap-1.5 text-[12px] text-[#666B80] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#E4E6F0]">
                <span className="flex items-center gap-2 text-[12.5px] text-[#9A9EB0]">
                  <Tag className="w-3.5 h-3.5" />
                  Category
                </span>
                <span className="text-[12.5px] font-medium text-[#666B80]">{task.category}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#E4E6F0]">
                <span className="flex items-center gap-2 text-[12.5px] text-[#9A9EB0]">
                  <Calendar className="w-3.5 h-3.5" />
                  Due date
                </span>
                <span className={`font-mono text-[12.5px] ${isOverdue ? 'text-[#E5473A] font-semibold' : 'text-[#666B80]'}`}>
                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="flex items-center gap-2 text-[12.5px] text-[#9A9EB0]">
                  <UserIcon className="w-3.5 h-3.5" />
                  Assigned to
                </span>
                <span className="flex items-center gap-2 text-[12.5px]">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8A83F5] to-[#4F46E5] flex items-center justify-center text-[9.5px] font-mono font-semibold text-white">
                    {task.userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {task.userName || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Status Update */}
          {canEdit && (
            <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
              <h3 className="font-['Sora'] font-bold text-[16px] mb-3">Change status</h3>
              <div className="space-y-2">
                {['Pending', 'InProgress', 'Completed'].map((status) => {
                  const isCurrent = task.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={isUpdatingStatus || isCurrent}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition ${
                        isCurrent
                          ? 'border-[#4F46E5] bg-[#EEEDFC] text-[#372F9E]'
                          : 'border-[#E4E6F0] hover:bg-[#F5F6FA] text-[#666B80]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          status === 'Pending' ? 'bg-[#9A9EB0]' :
                          status === 'InProgress' ? 'bg-[#E38B00]' :
                          'bg-[#0EA36B]'
                        }`} />
                        {status === 'InProgress' ? 'In progress' : status}
                      </span>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#4F46E5]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;