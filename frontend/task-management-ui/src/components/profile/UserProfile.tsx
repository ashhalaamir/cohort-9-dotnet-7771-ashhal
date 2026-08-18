import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/usersApi';
import { tasksApi } from '../../api/tasksApi';
import type { User } from '../../types';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  LogOut,
  Edit,
  CheckCircle2,
  Clock,
  Circle
} from 'lucide-react';

const UserProfile: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-t-transparent border-[#4F46E5] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full">
      {/* Hero Section */}
      <div className="bg-white border border-[#E4E6F0] rounded-xl p-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#7C74F0] opacity-10" />
        
        <div className="flex items-center gap-5 relative z-10 flex-wrap">
          <div className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-[#8A83F5] to-[#4F46E5] flex items-center justify-center font-display font-bold text-[26px] text-white shadow-lg shadow-[#4F46E5]/40 flex-shrink-0">
            {getInitials(profile?.username || 'U')}
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-display text-[22px] font-bold tracking-tight">
                {profile?.username}
              </span>
              <span className={`font-mono text-[10.5px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
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
                className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-xl font-semibold text-[13px] shadow-lg shadow-[#4F46E5]/30 hover:bg-[#372F9E] transition"
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
                className="px-4 py-2 text-[13px] font-semibold text-[#666B80] hover:bg-[#F5F6FA] rounded-xl transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E4E6F0] rounded-xl p-4">
          <div className="font-display text-[24px] font-bold tracking-tight">
            {taskCount}
          </div>
          <div className="text-[12px] text-[#666B80] mt-1">
            {isAdmin ? 'System-wide tasks' : 'My total tasks'}
          </div>
        </div>
        <div className="bg-white border border-[#E4E6F0] rounded-xl p-4">
          <div className="font-display text-[24px] font-bold tracking-tight">
            {completedCount}
          </div>
          <div className="text-[12px] text-[#666B80] mt-1">Completed</div>
        </div>
        <div className="bg-white border border-[#E4E6F0] rounded-xl p-4">
          <div className="font-display text-[24px] font-bold tracking-tight">
            {taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0}%
          </div>
          <div className="text-[12px] text-[#666B80] mt-1">
            {isAdmin ? 'Avg. team completion rate' : 'On-time completion rate'}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Account Details */}
        <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-['Sora'] font-bold text-[16px]">Account details</h3>
              <p className="text-[11.5px] text-[#9A9EB0] font-mono">visible to you only</p>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${
              message.type === 'success' 
                ? 'bg-[#E4F8EE] text-[#086941]' 
                : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E4E6F0] rounded-xl text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E4E6F0] rounded-xl text-[13.5px] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFC] outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Role</label>
                <input
                  type="text"
                  value={isAdmin ? 'Admin' : 'Regular User'}
                  disabled
                  className="w-full px-3 py-2.5 border border-[#E4E6F0] rounded-xl text-[13.5px] bg-[#F5F6FA] text-[#666B80] cursor-not-allowed"
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
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#4F46E5] hover:bg-[#372F9E] text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-['Sora'] font-bold text-[16px]">Security</h3>
                <p className="text-[11.5px] text-[#9A9EB0] font-mono">password &amp; access</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Current password</label>
                <input
                  type="password"
                  value="••••••••••"
                  disabled
                  className="w-full px-3 py-2.5 border border-[#E4E6F0] rounded-xl text-[13.5px] bg-[#F5F6FA] text-[#666B80] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">New password</label>
                <input
                  type="password"
                  placeholder="Enter a new password"
                  disabled
                  className="w-full px-3 py-2.5 border border-[#E4E6F0] rounded-xl text-[13.5px] bg-[#F5F6FA] text-[#666B80] cursor-not-allowed"
                />
              </div>
              <button
                disabled
                className="w-full py-2.5 bg-[#E4E6F0] text-[#9A9EB0] font-semibold rounded-xl cursor-not-allowed"
              >
                Update password (coming soon)
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-['Sora'] font-bold text-[16px]">
                  {isAdmin ? 'Admin overview' : 'Quick facts'}
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[#E4E6F0] last:border-none">
                <span className="text-[12.5px] text-[#9A9EB0]">User ID</span>
                <span className="font-mono text-[12.8px] font-semibold">USR-{String(profile?.id || '').padStart(4, '0')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E4E6F0] last:border-none">
                <span className="text-[12.5px] text-[#9A9EB0]">Last login</span>
                <span className="font-mono text-[12.8px] font-semibold">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E4E6F0] last:border-none">
                <span className="text-[12.5px] text-[#9A9EB0]">Permissions</span>
                <span className="font-mono text-[12.8px] font-semibold">
                  {isAdmin ? 'Full system access' : 'Own tasks only'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white border border-[#E4E6F0] rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-['Sora'] font-bold text-[16px]">My activity</h3>
            <p className="text-[11.5px] text-[#9A9EB0] font-mono">tasks completed, last 14 weeks</p>
          </div>
        </div>
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
            {Array.from({ length: 98 }).map((_, i) => {
              const rand = (i * 9301 + 49297) % 233280 / 233280;
              let level = 0;
              if (rand > 0.78) level = 3;
              else if (rand > 0.55) level = 2;
              else if (rand > 0.35) level = 1;
              const colors = ['#EFF0F7', '#C9C4F5', '#8A80EC', '#4F46E5'];
              return (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-sm"
                  style={{ background: colors[level] }}
                />
              );
            })}
          </div>
        </div>
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
      <div className="bg-white border border-[#E4E6F0] rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-lg bg-red-50 text-[#E5473A] flex items-center justify-center flex-shrink-0">
            <LogOut className="w-[18px] h-[18px]" />
          </div>
          <div>
            <div className="text-[13.2px] font-semibold">End your session</div>
            <div className="text-[11.8px] text-[#9A9EB0]">You'll need to sign in again to access Taskflow.</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 border border-[#F6D3CF] text-[#E5473A] rounded-xl font-semibold text-[13px] hover:bg-[#FCE9E7] transition"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;