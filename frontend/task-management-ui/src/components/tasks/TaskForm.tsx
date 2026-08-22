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
      // Fetch all users if admin
      let allUsers: User[] = [];
      if (isAdmin) {
        try {
          allUsers = await usersApi.getAllUsers();
        } catch (err) {
          console.error('Error fetching users:', err);
        }
        setUsers(allUsers);
      }

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
      <div className="flex items-center gap-2 text-[13.5px] text-[#9A9EB0] font-mono">
        <Link to="/tasks" className="hover:text-[#4F46E5] transition">Tasks</Link>
        <ChevronRight className="w-3 h-3" />
        <span>{isEditMode ? `#TQ-${String(id).padStart(2, '0')} / Edit` : 'New task'}</span>
      </div>

      {/* Header — 25px to match every other screen's title, not text-3xl/4xl */}
      <div>
        <h1 className="text-[27px] font-bold font-['Sora'] tracking-[-0.015em]">
          {isEditMode ? 'Edit task' : 'Create a new task'}
        </h1>
        <p className="text-[14.5px] text-[#666B80] mt-1">
          {isEditMode 
            ? 'Update the details below and save your changes.'
            : 'Fill in the details below — you can edit everything later.'
          }
        </p>
      </div>

      {/* Form — 14px panel radius, not 12px */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E4E6F0] rounded-[14px] p-6 space-y-6">
        {error && (
          // System danger tokens instead of Tailwind's default red-*
          <div className="p-3 bg-[#FCE9E7] border border-[#F6D3CF] rounded-[10px] text-[#E5473A] text-sm">
            {error}
          </div>
        )}

        {/* Basics */}
        <div className="space-y-4">
          <div className="text-[11.5px] font-mono uppercase tracking-[0.08em] text-[#9A9EB0]">Basics</div>

          <div>
            <label className="block text-[13.8px] font-semibold mb-[7px]">
              Title <span className="text-[#E5473A]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Set up JWT refresh token flow"
              className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[14.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-[13.8px] font-semibold mb-[7px]">
              Description <span className="text-[12px] font-medium text-[#9A9EB0]">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any context, acceptance criteria, or links teammates will need..."
              className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[14.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition resize-y min-h-[110px]"
              maxLength={1000}
            />
            <div className="text-right font-mono text-[11.5px] text-[#9A9EB0] mt-1.5">
              {description.length}/1000
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="space-y-4 border-t border-[#E4E6F0] pt-5">
          <div className="text-[11.5px] font-mono uppercase tracking-[0.08em] text-[#9A9EB0]">Classification</div>

          {/* Status — segmented control now has explicit type sizing (12.8px/semibold)
              instead of inheriting the browser's default button text, which is what was
              making these look like plain unstyled buttons. Radius 12px -> 10px, border
              bumped to 1.5px, dot sized to match the mockup's 7px exactly. */}
          <div>
            <label className="block text-[13.8px] font-semibold mb-[7px]">Status</label>
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 min-w-[110px] flex items-center justify-center gap-[7px] px-3 py-2.5 rounded-[10px] border-[1.5px] text-[13.8px] font-semibold transition ${
                    status === s
                      ? 'border-[#4F46E5] bg-[#EEEDFC] text-[#372F9E]'
                      : 'border-[#E4E6F0] hover:bg-[#F5F6FA] text-[#666B80]'
                  }`}
                >
                  <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${
                    s === 'Pending' ? 'bg-[#9A9EB0]' :
                    s === 'InProgress' ? 'bg-[#E38B00]' :
                    'bg-[#0EA36B]'
                  }`} />
                  {getStatusLabel(s)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority — same segmented treatment as Status */}
          <div>
            <label className="block text-[13.8px] font-semibold mb-[7px]">Priority</label>
            <div className="flex gap-2 flex-wrap">
              {priorityOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 min-w-[110px] flex items-center justify-center gap-[7px] px-3 py-2.5 rounded-[10px] border-[1.5px] text-[13.8px] font-semibold transition ${
                    priority === p
                      ? 'border-[#4F46E5] bg-[#EEEDFC] text-[#372F9E]'
                      : 'border-[#E4E6F0] hover:bg-[#F5F6FA] text-[#666B80]'
                  }`}
                >
                  <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${
                    p === 'Low' ? 'bg-[#9A9EB0]' :
                    p === 'Medium' ? 'bg-[#E38B00]' :
                    'bg-[#E5473A]'
                  }`} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category — chip needs the same explicit type sizing (12.5px/medium)
              and a 1.5px border to match Status/Priority's weight; shape (pill) was
              already correct, as was the solid-brand "checked" state. */}
          <div>
            <label className="block text-[13.8px] font-semibold mb-[7px]">Category</label>
            <div className="flex gap-2 flex-wrap">
              {categoryOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-2 rounded-full border-[1.5px] text-[13.5px] font-medium transition ${
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
          <div className="text-[11.5px] font-mono uppercase tracking-[0.08em] text-[#9A9EB0]">Scheduling &amp; ownership</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13.8px] font-semibold mb-[7px]">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[14.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-[13.8px] font-semibold mb-[7px]">Assigned user</label>
              {isAdmin ? (
                <select
                  value={assignToUserId || ''}
                  onChange={(e) => setAssignToUserId(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[14.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666B80' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '30px',
                  }}
                >
                  {users.length > 0 ? (
                    users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} {u.id === user?.id ? '(you)' : ''}
                      </option>
                    ))
                  ) : (
                    <option value={user?.id || ''}>{user?.username || 'You'} (you)</option>
                  )}
                </select>
              ) : (
                // bg-[#EFF0F7] (the app's disabled/readonly token) instead of #F5F6FA,
                // which is the page background color, not the field-lock color
                <div className="flex items-center gap-3 px-3 py-2.5 border-[1.5px] border-dashed border-[#E4E6F0] rounded-[10px] bg-[#EFF0F7]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8A83F5] to-[#4F46E5] flex items-center justify-center text-[11.5px] font-mono font-semibold text-white">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-[13.8px] font-semibold">{user?.username || 'You'}</div>
                    <div className="text-[12px] text-[#9A9EB0] font-mono">auto-assigned</div>
                  </div>
                  <Lock className="w-4 h-4 text-[#9A9EB0] ml-auto" />
                </div>
              )}
              <p className="text-[12.5px] text-[#9A9EB0] mt-1.5">
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
            className="px-4 py-2.5 text-[14.5px] font-semibold text-[#666B80] hover:bg-[#EFF0F7] rounded-[10px] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#372F9E] text-white font-semibold text-[14.5px] rounded-[10px] transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: '0 10px 20px -8px rgba(79,70,229,0.55)' }}
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