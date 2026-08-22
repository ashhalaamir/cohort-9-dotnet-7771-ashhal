import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tasksApi } from '../../api/tasksApi';
import { 
  LayoutDashboard, 
  ListTodo, 
  User, 
  LogOut, 
  Plus,
  Users,
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  count?: number;
}

const Sidebar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    fetchTaskCount();
  }, []);

  const fetchTaskCount = async () => {
    try {
      const tasks = await tasksApi.getTasks();
      setTaskCount(tasks.length);
    } catch (error) {
      console.error('Error fetching task count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNewTask = () => {
    navigate('/tasks/new');
  };

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ListTodo, label: 'Tasks', path: '/tasks', count: taskCount },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  if (isAdmin) {
    navItems.splice(2, 0, { icon: Users, label: 'Team', path: '/team' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    // Widened 248px -> 280px, and the collapsed rail 76px -> 84px to stay proportional.
    // Padding scaled up slightly too (py-6/px-4 -> py-7/px-5) so the extra width doesn't
    // just turn into empty margin.
    <aside className="w-[280px] max-[980px]:w-[84px] min-h-screen bg-gradient-to-b from-[#1B1852] to-[#14123A] text-[#ABA7DC] flex flex-col sticky top-0 flex-shrink-0 py-7 px-5 transition-[width] duration-150">
      
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 pt-1 pb-7 max-[980px]:justify-center max-[980px]:px-0">
        <div 
          className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-[#7C74F0] to-[#4F46E5] flex items-center justify-center font-mono font-semibold text-[14px] text-white flex-shrink-0"
          style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }}
        >
          TF
        </div>
        <div className="max-[980px]:hidden">
          <div className="font-['Sora'] font-bold text-[19px] text-white tracking-[-0.01em]">Taskflow</div>
          <div className="font-mono text-[11.5px] text-[#6F6BA0] tracking-[0.04em]">v1.0.0</div>
        </div>
      </div>

      {/* Navigation Group Label */}
      <div className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-[#6F6BA0] px-3 py-2 mt-2.5 max-[980px]:hidden">
        Workspace
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[14.5px] font-medium transition max-[980px]:justify-center ${
              isActive(item.path)
                ? 'bg-[#4F46E5] text-white'
                : 'text-[#ABA7DC] hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="w-[19px] h-[19px] opacity-85 flex-shrink-0" />
            <span className="max-[980px]:hidden">{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <span className={`ml-auto font-mono text-[11px] px-1.5 py-0.5 rounded-full max-[980px]:hidden ${
                isActive(item.path)
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-[#ABA7DC]'
              }`}>
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Session Group */}
      <div className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-[#6F6BA0] px-3 py-2 mt-4 max-[980px]:hidden">
        Session
      </div>
      <nav className="flex flex-col gap-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-[14.5px] font-medium text-[#ABA7DC] hover:bg-white/5 hover:text-white transition w-full text-left max-[980px]:justify-center"
        >
          <LogOut className="w-[19px] h-[19px] opacity-85 flex-shrink-0" />
          <span className="max-[980px]:hidden">Log out</span>
        </button>
      </nav>

      {/* New Task CTA */}
      <button 
        onClick={handleNewTask}
        className="mt-[18px] mx-1 mb-1.5 flex items-center justify-center gap-2 bg-white text-[#372F9E] font-semibold text-[14px] py-3 rounded-lg hover:bg-gray-100 transition"
        style={{ boxShadow: '0 8px 20px -8px rgba(0,0,0,0.5)' }}
      >
        <Plus className="w-[17px] h-[17px]" />
        <span className="max-[980px]:hidden">New task</span>
      </button>

      {/* User Footer */}
      <div className="mt-auto pt-[14px] px-2 pb-1 border-t border-white/10 flex items-center gap-3 max-[980px]:justify-center max-[980px]:px-0">
        <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#8A83F5] to-[#4F46E5] flex items-center justify-center font-mono font-semibold text-[13.5px] text-white flex-shrink-0">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="max-[980px]:hidden">
          <div className="text-[13.5px] font-semibold text-white">{user?.username || 'User'}</div>
          <div className="text-[11.5px] text-[#9B97CC] font-mono">{isAdmin ? 'admin' : 'regular_user'}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;