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
    <aside className="w-[248px] min-h-screen bg-gradient-to-b from-[#1B1852] to-[#14123A] text-[#ABA7DC] flex flex-col sticky top-0 flex-shrink-0 p-4">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 pb-7">
        <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#7C74F0] to-[#4F46E5] flex items-center justify-center font-mono font-semibold text-[13px] text-white shadow-lg shadow-[#4F46E5]/20 flex-shrink-0">
          TF
        </div>
        <div>
          <div className="font-['Sora'] font-bold text-[17px] text-white tracking-tight">Taskflow</div>
          <div className="font-mono text-[10.5px] text-[#6F6BA0] tracking-wide">v1.0.0</div>
        </div>
      </div>

      {/* Navigation Group Label */}
      <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[#6F6BA0] px-3 py-2 mt-2.5">
        Workspace
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition ${
              isActive(item.path)
                ? 'bg-[#4F46E5] text-white'
                : 'text-[#ABA7DC] hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="w-[17px] h-[17px] opacity-85 flex-shrink-0" />
            <span>{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <span className={`ml-auto font-mono text-[10.5px] px-1.5 py-0.5 rounded-full ${
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
      <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[#6F6BA0] px-3 py-2 mt-4">
        Session
      </div>
      <nav className="flex flex-col gap-0.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-[#ABA7DC] hover:bg-white/5 hover:text-white transition w-full text-left"
        >
          <LogOut className="w-[17px] h-[17px] opacity-85 flex-shrink-0" />
          <span>Log out</span>
        </button>
      </nav>

      {/* New Task CTA */}
      <button 
        onClick={handleNewTask}
        className="mt-4 mx-1 flex items-center justify-center gap-2 bg-white text-[#372F9E] font-semibold text-[13px] py-2.5 rounded-lg shadow-lg shadow-black/30 hover:bg-gray-100 transition"
      >
        <Plus className="w-[15px] h-[15px]" />
        <span>New task</span>
      </button>

      {/* User Footer */}
      <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-2.5 px-2 pt-3.5">
        <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#8A83F5] to-[#4F46E5] flex items-center justify-center font-mono font-semibold text-[12.5px] text-white flex-shrink-0">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <div className="text-[12.5px] font-semibold text-white">{user?.username || 'User'}</div>
          <div className="text-[10.5px] text-[#6F6BA0] font-mono">{isAdmin ? 'admin' : 'regular_user'}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;