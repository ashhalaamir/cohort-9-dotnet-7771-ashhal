import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/usersApi';
import { tasksApi } from '../../api/tasksApi';
import type { User, Task } from '../../types';
import { 
  Shield, 
  LogOut,
  Edit,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';

// ============================================================
// 🔥 Helper: Build activity data from tasks
// ============================================================
const buildActivityData = (tasks: Task[]): number[][] => {
  const weeks = 14;
  const days = 7;
  const activity: number[][] = Array.from({ length: weeks }, () => Array(days).fill(0));

  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(oneYearAgo.getDate() - (weeks * 7));

  tasks.forEach(task => {
    if (task.status !== 'Completed') return;
    
    const completedDate = new Date(task.updatedAt || task.createdAt);
    if (completedDate < oneYearAgo || completedDate > today) return;

    const diffTime = today.getTime() - completedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekIndex = Math.floor(diffDays / 7);
    const dayIndex = diffDays % 7;

    if (weekIndex < weeks && weekIndex >= 0) {
      const adjustedDay = (dayIndex + 6) % 7;
      activity[weekIndex][adjustedDay] = (activity[weekIndex][adjustedDay] || 0) + 1;
    }
  });

  return activity;
};

const getActivityColor = (count: number): string => {
  if (count === 0) return '#EFF0F7';
  if (count <= 1) return '#C9C4F5';
  if (count <= 2) return '#8A80EC';
  return '#4F46E5';
};

const UserProfile: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);

  // Activity data state
  const [activityData, setActivityData] = useState<number[][]>([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileData, tasksData] = await Promise.all([
        usersApi.getProfile(),
        tasksApi.getTasks(),
      ]);
      setProfile(profileData);
      setUsername(profileData.username);
      setEmail(profileData.email);
      
      const completed = tasksData.filter(t => t.status === 'Completed').length;
      setTaskCount(tasksData.length);
      setCompletedCount(completed);

      // Build activity data from tasks
      const activity = buildActivityData(tasksData);
      setActivityData(activity);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const updated = await usersApi.updateProfile({ username, email });
      setProfile(updated);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsChangingPw(true);

    try {
      await usersApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password.' 
      });
    } finally {
      setIsChangingPw(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

  const totalActivity = activityData.flat().filter(v => v > 0).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-t-transparent border-[#4F46E5] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full max-w-[1040px]">
      {/* Hero Section */}
      <div className="bg-white border border-[#E4E6F0] rounded-[20px] p-6 relative overflow-hidden">
        <div 
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7C74F0 0%, transparent 70%)', opacity: 0.15 }}
        />
        
        <div className="flex items-center gap-5 relative z-10 flex-wrap">
          <div 
            className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-[#8A83F5] to-[#4F46E5] flex items-center justify-center font-['Sora'] font-bold text-[26px] text-white flex-shrink-0"
            style={{ boxShadow: '0 12px 24px -10px rgba(79,70,229,0.55)' }}
          >
            {getInitials(profile?.username || 'U')}
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-['Sora'] text-[22px] font-bold tracking-[-0.01em]">
                {profile?.username}
              </span>
              <span className={`font-mono text-[10.5px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 tracking-[0.03em] ${
                isAdmin 
                  ? 'bg-[#FDEFD8] text-[#8A5300]' 
                  : 'bg-[#EEEDFC] text-[#372F9E]'
              }`}>
                <Shield className="w-3 h-3" />
                {isAdmin ? 'Admin' : 'Regular User'}
              </span>
            </div>
            <div className="text-[12.8px] text-[#666B80] mt-1">
              <span className="font-mono text-[11.5px] text-[#9A9EB0]">@{profile?.username}</span>
              <span className="mx-2 text-[#E4E6F0]">·</span>
              Member since {new Date(profile?.createdAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
          
          <div className="ml-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] text-white rounded-[10px] font-semibold text-[13px] hover:bg-[#372F9E] transition"
                style={{ boxShadow: '0 10px 20px -8px rgba(79,70,229,0.55)' }}
              >
                <Edit className="w-4 h-4" />
                Edit profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setUsername(profile?.username || '');
                  setEmail(profile?.email || '');
                  setMessage(null);
                }}
                className="px-4 py-2.5 text-[13px] font-semibold text-[#666B80] hover:bg-[#EFF0F7] rounded-[10px] transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-4">
          <div className="font-['Sora'] text-[24px] font-bold tracking-[-0.01em]">
            {taskCount}
          </div>
          <div className="text-[12px] text-[#666B80] mt-1">
            {isAdmin ? 'System-wide tasks' : 'My total tasks'}
          </div>
        </div>
        <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-4">
          <div className="font-['Sora'] text-[24px] font-bold tracking-[-0.01em]">
            {completedCount}
          </div>
          <div className="text-[12px] text-[#666B80] mt-1">Completed</div>
        </div>
        <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-4">
          <div className="font-['Sora'] text-[24px] font-bold tracking-[-0.01em]">
            {taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0}%
          </div>
          <div className="text-[12px] text-[#666B80] mt-1">
            {isAdmin ? 'Avg. team completion rate' : 'On-time completion rate'}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Account Details - Same as before */}
        <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-['Sora'] font-bold text-[14.5px]">Account details</h3>
              <p className="text-[11.5px] text-[#9A9EB0] font-mono mt-0.5">visible to you only</p>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-[10px] text-sm mb-4 ${
              message.type === 'success' 
                ? 'bg-[#E4F8EE] text-[#086941]' 
                : 'bg-[#FCE9E7] text-[#E5473A]'
            }`}>
              {message.text}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[12.8px] font-semibold mb-[7px]">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-[12.8px] font-semibold mb-[7px]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[12.8px] font-semibold mb-[7px]">Role</label>
                <input
                  type="text"
                  value={isAdmin ? 'Admin' : 'Regular User'}
                  disabled
                  className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[13.5px] bg-[#EFF0F7] text-[#666B80] cursor-not-allowed"
                />
                <p className="text-[11px] text-[#9A9EB0] mt-1.5 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {isAdmin 
                    ? 'You have administrator access across all users\' tasks.'
                    : 'Roles are managed by an administrator.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4F46E5] hover:bg-[#372F9E] text-white font-semibold rounded-[10px] transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 10px 20px -8px rgba(79,70,229,0.55)' }}
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#9A9EB0] mb-1">Username</label>
                <p className="text-[14px] font-medium">{profile?.username}</p>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#9A9EB0] mb-1">Email</label>
                <p className="text-[14px] font-medium">{profile?.email}</p>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#9A9EB0] mb-1">Role</label>
                <p className="text-[14px] font-medium">{isAdmin ? 'Admin' : 'Regular User'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Security & Quick Facts */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-['Sora'] font-bold text-[14.5px]">Security</h3>
                <p className="text-[11.5px] text-[#9A9EB0] font-mono mt-0.5">password &amp; access</p>
              </div>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="text-[12px] font-semibold text-[#4F46E5] hover:underline"
                >
                  Change password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-[12.8px] font-semibold mb-[7px]">Current password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition pr-10"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9EB0] hover:text-[#666B80] transition"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[12.8px] font-semibold mb-[7px]">New password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition pr-10"
                      placeholder="Enter new password (min 8 chars)"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9EB0] hover:text-[#666B80] transition"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[12.8px] font-semibold mb-[7px]">Confirm password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 border-[1.5px] border-[#E4E6F0] rounded-[10px] text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition pr-10"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9EB0] hover:text-[#666B80] transition"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setMessage(null);
                    }}
                    className="flex-1 py-2 text-[13px] font-semibold text-[#666B80] hover:bg-[#EFF0F7] rounded-[10px] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPw}
                    className="flex-1 py-2 bg-[#4F46E5] hover:bg-[#372F9E] text-white font-semibold text-[13px] rounded-[10px] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ boxShadow: '0 10px 20px -8px rgba(79,70,229,0.55)' }}
                  >
                    {isChangingPw ? 'Updating...' : 'Update password'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[12.5px] font-semibold text-[#9A9EB0] mb-1">Password</label>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-medium">••••••••••</p>
                    <Lock className="w-4 h-4 text-[#9A9EB0]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-['Sora'] font-bold text-[14.5px]">
                  {isAdmin ? 'Admin overview' : 'Quick facts'}
                </h3>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center py-[11px] border-b border-[#E4E6F0]">
                <span className="text-[12.5px] text-[#9A9EB0]">User ID</span>
                <span className="font-mono text-[12.8px] font-semibold">USR-{String(profile?.id || '').padStart(4, '0')}</span>
              </div>
              <div className="flex justify-between items-center py-[11px] border-b border-[#E4E6F0]">
                <span className="text-[12.5px] text-[#9A9EB0]">Last login</span>
                <span className="font-mono text-[12.8px] font-semibold">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-[11px] last:border-none">
                <span className="text-[12.5px] text-[#9A9EB0]">Permissions</span>
                <span className="font-mono text-[12.8px] font-semibold">
                  {isAdmin ? 'Full system access' : 'Own tasks only'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 Activity Heatmap - Dynamic from real task data */}
      <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-['Sora'] font-bold text-[14.5px]">My activity</h3>
            <p className="text-[11.5px] text-[#9A9EB0] font-mono mt-0.5">
              tasks completed, last 14 weeks
              {totalActivity > 0 && (
                <span className="ml-2 text-[#4F46E5]">
                  ({totalActivity} completions)
                </span>
              )}
            </p>
          </div>
        </div>
        
        {activityData.length > 0 && totalActivity > 0 ? (
          <div className="flex gap-3.5 items-start overflow-x-auto pb-1">
            <div className="flex flex-col gap-0.5 font-mono text-[9px] text-[#9A9EB0] pt-3.5">
              <div className="h-3.5 flex items-center"></div>
              <div className="h-3.5 flex items-center">Mon</div>
              <div className="h-3.5 flex items-center"></div>
              <div className="h-3.5 flex items-center">Wed</div>
              <div className="h-3.5 flex items-center"></div>
              <div className="h-3.5 flex items-center">Fri</div>
              <div className="h-3.5 flex items-center"></div>
            </div>
            
            <div className="grid grid-flow-col grid-rows-7 gap-0.5">
              {activityData.map((week, weekIndex) => (
                week.map((count, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{ background: getActivityColor(count) }}
                    title={`Week ${14 - weekIndex}, ${count} task${count !== 1 ? 's' : ''} completed`}
                  />
                ))
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-[#9A9EB0]">
            <p className="text-sm">No completed tasks yet. Start completing tasks to see your activity!</p>
          </div>
        )}
        
        <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-[#9A9EB0] justify-end mt-2.5">
          Less
          <span className="w-3 h-3 rounded-sm bg-[#EFF0F7]" />
          <span className="w-3 h-3 rounded-sm bg-[#C9C4F5]" />
          <span className="w-3 h-3 rounded-sm bg-[#8A80EC]" />
          <span className="w-3 h-3 rounded-sm bg-[#4F46E5]" />
          More
        </div>
      </div>

      {/* Session / Logout */}
      <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-[10px] bg-[#FCE9E7] text-[#E5473A] flex items-center justify-center flex-shrink-0">
            <LogOut className="w-[18px] h-[18px]" />
          </div>
          <div>
            <div className="text-[13.2px] font-semibold">End your session</div>
            <div className="text-[11.8px] text-[#9A9EB0]">You'll need to sign in again to access Taskflow.</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#F6D3CF] text-[#E5473A] rounded-[10px] font-semibold text-[13px] hover:bg-[#FCE9E7] transition"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;