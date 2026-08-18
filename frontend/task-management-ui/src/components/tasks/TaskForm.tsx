import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tasksApi } from '../../api/tasksApi';
import { usersApi } from '../../api/usersApi';
import type { Task, User } from '../../types';
import { ChevronRight, Save, X, User as UserIcon, Lock } from 'lucide-react';

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const isEditMode = Boolean(id);
  
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [assignToUserId, setAssignToUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      if (isEditMode && id) {
        const taskData = await tasksApi.getTaskById(Number(id));
        setTask(taskData);
        setTitle(taskData.title);
        setDescription(taskData.description || '');
        setStatus(taskData.status);
        setPriority(taskData.priority);
        setCategory(taskData.category);
        setDueDate(taskData.dueDate.split('T')[0]);
        setAssignToUserId(taskData.userId);
      } else {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        setDueDate(defaultDate.toISOString().split('T')[0]);
        setAssignToUserId(user?.id);
      }

      if (isAdmin) {
        const usersData = await usersApi.getProfile();
        setUsers(Array.isArray(usersData) ? usersData : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        category,
        dueDate: new Date(dueDate).toISOString(),
      };

      if (isEditMode && id) {
        await tasksApi.updateTask(Number(id), payload);
      } else {
        const createPayload = isAdmin && assignToUserId
          ? { ...payload, assignToUserId }
          : payload;
        await tasksApi.createTask(createPayload);
      }
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = ['Pending', 'InProgress', 'Completed'];
  const priorityOptions = ['Low', 'Medium', 'High'];
  const categoryOptions = ['Work', 'Personal', 'Urgent'];

  const getStatusLabel = (s: string) => s === 'InProgress' ? 'In progress' : s;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-t-transparent border-[#4F46E5] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12.5px] text-[#9A9EB0] font-mono">
        <Link to="/tasks" className="hover:text-[#4F46E5] transition">Tasks</Link>
        <ChevronRight className="w-3 h-3" />
        <span>{isEditMode ? `#TQ-${String(id).padStart(2, '0')} / Edit` : 'New task'}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-['Sora'] tracking-tight">
          {isEditMode ? 'Edit task' : 'Create a new task'}
        </h1>
        <p className="text-[15px] text-[#666B80] mt-1.5">
          {isEditMode 
            ? 'Update the details below and save your changes.'
            : 'Fill in the details below — you can edit everything later.'
          }
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E4E6F0] rounded-xl p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Basics */}
        <div className="space-y-4">
          <div className="text-[10.5px] font-mono uppercase tracking-wide text-[#9A9EB0]">Basics</div>

          <div>
            <label className="block text-[14px] font-semibold mb-1.5">
              Title <span className="text-[#E5473A]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Set up JWT refresh token flow"
              className="w-full px-3 py-2.5 border border-[#E4E6F0] rounded-xl text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-[14px] font-semibold mb-1.5">
              Description <span className="text-[11px] font-medium text-[#9A9EB0]">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any context, acceptance criteria, or links teammates will need..."
              className="w-full px-3 py-2.5 border border-[#E4E6F0] rounded-xl text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition resize-y min-h-[110px]"
              maxLength={1000}
            />
            <div className="text-right font-mono text-[10.5px] text-[#9A9EB0] mt-1">
              {description.length}/1000
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="space-y-4 border-t border-[#E4E6F0] pt-5">
          <div className="text-[10.5px] font-mono uppercase tracking-wide text-[#9A9EB0]">Classification</div>

          <div>
            <label className="block text-[14px] font-semibold mb-1.5">Status</label>
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition ${
                    status === s
                      ? 'border-[#4F46E5] bg-[#EEEDFC] text-[#372F9E]'
                      : 'border-[#E4E6F0] hover:bg-[#F5F6FA] text-[#666B80]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    s === 'Pending' ? 'bg-[#9A9EB0]' :
                    s === 'InProgress' ? 'bg-[#E38B00]' :
                    'bg-[#0EA36B]'
                  }`} />
                  {getStatusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-semibold mb-1.5">Priority</label>
            <div className="flex gap-2 flex-wrap">
              {priorityOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition ${
                    priority === p
                      ? 'border-[#4F46E5] bg-[#EEEDFC] text-[#372F9E]'
                      : 'border-[#E4E6F0] hover:bg-[#F5F6FA] text-[#666B80]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    p === 'Low' ? 'bg-[#9A9EB0]' :
                    p === 'Medium' ? 'bg-[#E38B00]' :
                    'bg-[#E5473A]'
                  }`} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-semibold mb-1.5">Category</label>
            <div className="flex gap-2 flex-wrap">
              {categoryOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full border transition ${
                    category === c
                      ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                      : 'border-[#E4E6F0] hover:bg-[#F5F6FA] text-[#666B80]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scheduling & Ownership */}
        <div className="space-y-4 border-t border-[#E4E6F0] pt-5">
          <div className="text-[10.5px] font-mono uppercase tracking-wide text-[#9A9EB0]">Scheduling &amp; ownership</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-semibold mb-1.5">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E4E6F0] rounded-xl text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-semibold mb-1.5">Assigned user</label>
              {isAdmin ? (
                <select
                  value={assignToUserId || ''}
                  onChange={(e) => setAssignToUserId(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-[#E4E6F0] rounded-xl text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666B80' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '30px',
                  }}
                >
                  <option value={user?.id || ''}>Ashhal S. (you)</option>
                  <option value={2}>Hina K.</option>
                  <option value={3}>Moiz R.</option>
                  <option value={4}>Zara B.</option>
                  <option value={5}>Talha N.</option>
                </select>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2.5 border border-dashed border-[#E4E6F0] rounded-xl bg-[#F5F6FA]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8A83F5] to-[#4F46E5] flex items-center justify-center text-[10.5px] font-mono font-semibold text-white">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-[12.8px] font-semibold">{user?.username || 'You'}</div>
                    <div className="text-[11px] text-[#9A9EB0] font-mono">auto-assigned</div>
                  </div>
                  <Lock className="w-4 h-4 text-[#9A9EB0] ml-auto" />
                </div>
              )}
              <p className="text-[11.5px] text-[#9A9EB0] mt-1.5">
                {isAdmin 
                  ? 'As admin, you can assign this task to any team member.'
                  : 'Tasks you create are assigned to you automatically.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E4E6F0]">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 text-[13.5px] font-semibold text-[#666B80] hover:bg-[#F5F6FA] rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#372F9E] text-white font-semibold text-[13.5px] rounded-xl transition shadow-lg shadow-[#4F46E5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : isEditMode ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;