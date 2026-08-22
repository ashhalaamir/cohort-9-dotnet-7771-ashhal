import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../api/dashboardApi';
import type { TeamMemberStats } from '../../api/dashboardApi';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle,
} from 'lucide-react';

const Team: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const [members, setMembers] = useState<TeamMemberStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/dashboard';
      return;
    }
    fetchTeamData();
  }, [isAdmin]);

  const fetchTeamData = async () => {
    try {
      const data = await dashboardApi.getTeamStats();
      setMembers(data);
    } catch (err: any) {
      console.error('Error fetching team data:', err);
      setError(err.response?.data?.message || 'Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-t-transparent border-[#4F46E5] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#9A9EB0]">
        <AlertCircle className="w-12 h-12 mb-3 text-[#E5473A]" />
        <p className="text-[13.5px] font-semibold text-[#666B80]">{error}</p>
        <button 
          onClick={fetchTeamData}
          className="mt-4 text-[#4F46E5] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const totalCompleted = members.reduce((sum, m) => sum + m.completed, 0);
  const totalOverdue = members.reduce((sum, m) => sum + m.overdue, 0);

  return (
    <div className="space-y-5 w-full">
      {/* Header — 25px to match the title size used on Dashboard/Tasks/Profile;
          text-3xl/4xl was oversized relative to the rest of the app */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[25px] font-bold font-['Sora'] tracking-[-0.015em] leading-tight mb-1">
            Team Overview
          </h1>
          <p className="text-[13.5px] text-[#666B80]">
            {members.length} team members
          </p>
        </div>
      </div>

      {/* Stats Cards — rebuilt to match the Dashboard stat-card pattern:
          small corner tag, icon badge, large Sora number, label underneath.
          The old icon-and-number-side-by-side layout is the "outdated" part —
          this is the same card shape used for every other stat in the app. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-[18px] relative overflow-hidden">
          <span className="absolute top-3.5 right-4 font-mono text-[10px] text-[#9A9EB0] tracking-[0.03em]">#MEM</span>
          <div className="w-8 h-8 rounded-[9px] bg-[#EEEDFC] text-[#4F46E5] flex items-center justify-center mb-3.5">
            <Users className="w-4 h-4" />
          </div>
          <div className="font-['Sora'] text-[30px] font-bold tracking-[-0.02em] leading-none">
            {members.length}
          </div>
          <div className="text-[12.5px] text-[#666B80] mt-1.5">Total members</div>
        </div>

        <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-[18px] relative overflow-hidden">
          <span className="absolute top-3.5 right-4 font-mono text-[10px] text-[#9A9EB0] tracking-[0.03em]">#DONE</span>
          <div className="w-8 h-8 rounded-[9px] bg-[#E4F8EE] text-[#0EA36B] flex items-center justify-center mb-3.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="font-['Sora'] text-[30px] font-bold tracking-[-0.02em] leading-none">
            {totalCompleted}
          </div>
          <div className="text-[12.5px] text-[#666B80] mt-1.5">Total completed</div>
        </div>

        <div className="bg-white border border-[#E4E6F0] rounded-[14px] p-[18px] relative overflow-hidden">
          <span className="absolute top-3.5 right-4 font-mono text-[10px] text-[#9A9EB0] tracking-[0.03em]">#LATE</span>
          {/* bg-[#FCE9E7] is the app's actual danger-light token — red-50 is Tailwind's
              default red and reads slightly off next to the custom palette used elsewhere */}
          <div className="w-8 h-8 rounded-[9px] bg-[#FCE9E7] text-[#E5473A] flex items-center justify-center mb-3.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="font-['Sora'] text-[30px] font-bold tracking-[-0.02em] leading-none">
            {totalOverdue}
          </div>
          <div className="text-[12.5px] text-[#666B80] mt-1.5">Total overdue</div>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-white border border-[#E4E6F0] rounded-[14px] overflow-hidden w-full">
        {/* Table Head — bumped 10px -> 11px, font-semibold instead of default weight,
            and a darker gray for contrast. 10px uppercase mono is right at the edge of
            legible; this keeps the same "label" feel but is actually readable at a glance. */}
        <div className="grid grid-cols-[40px_1fr_1fr_100px_100px_100px_110px] items-center gap-3 px-5 py-3.5 bg-[#EFF0F7] border-b border-[#E4E6F0] font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-[#7D8194]">
          <span></span>
          <span>Member</span>
          <span>Email</span>
          <span className="text-center">Tasks</span>
          <span className="text-center">Completed</span>
          <span className="text-center">Overdue</span>
          <span className="text-center">Completion</span>
        </div>

        {/* Team Rows */}
        {members.length > 0 ? (
          members.map((member) => {
            const initials = member.username?.charAt(0).toUpperCase() || 'U';
            const isCurrentUser = member.userId === user?.id;
            
            return (
              <div
                key={member.userId}
                className={`grid grid-cols-[40px_1fr_1fr_100px_100px_100px_110px] items-center gap-3 px-5 py-3.5 border-b border-[#E4E6F0] hover:bg-[#EFF0F7] transition last:border-none ${
                  isCurrentUser ? 'bg-[#EEEDFC]' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8A83F5] to-[#4F46E5] flex items-center justify-center text-[10px] font-mono font-semibold text-white flex-shrink-0">
                  {initials}
                </div>
                <div className="font-semibold text-[13px]">
                  {member.username}
                  {isCurrentUser && (
                    <span className="ml-2 text-[10px] font-mono text-[#9A9EB0]">(you)</span>
                  )}
                </div>
                <div className="text-[12.5px] text-[#666B80] truncate">{member.email}</div>
                <div className="text-center font-mono text-[13px] font-semibold">{member.totalTasks}</div>
                <div className="text-center font-mono text-[13px] font-semibold text-[#0EA36B]">{member.completed}</div>
                <div className="text-center font-mono text-[13px] font-semibold text-[#E5473A]">{member.overdue}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#EFF0F7] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#4F46E5]"
                      style={{ width: `${member.completionRate}%` }}
                    />
                  </div>
                  <span className="font-mono text-[12px] font-semibold min-w-[40px] text-right">
                    {member.completionRate}%
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-[#9A9EB0]">
            <Users className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-[13.5px] font-semibold text-[#666B80]">No team members found</p>
            <p className="text-[12px]">Invite team members to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;