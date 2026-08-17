import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Check } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0F0E2A] via-[#1B1852] to-[#0F0E2A] text-white p-16 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#4F46E5] opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#7C74F0] opacity-20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C74F0] to-[#4F46E5] flex items-center justify-center font-mono font-bold text-lg shadow-lg shadow-[#4F46E5]/20">
            TF
          </div>
          <span className="text-2xl font-bold font-['Sora'] tracking-tight">Taskflow</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="text-sm font-mono uppercase tracking-widest text-[#ABA7DC] mb-5">
            Task management, sorted
          </p>
          <h1 className="text-5xl font-bold font-['Sora'] leading-tight mb-5 tracking-tight">
            Everything your team is working on, in one clean view.
          </h1>
          <p className="text-[#ABA7DC] text-base leading-relaxed mb-10">
            Create, assign, and track tasks with role-based access — a straightforward dashboard for individuals, and full visibility for admins.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 flex-shrink-0">
                <Check className="w-5 h-5 text-[#7C74F0]" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">Track status &amp; priority at a glance</p>
                <p className="text-sm text-[#6F6BA0]">Filter by status, priority, or category in one click</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 flex-shrink-0">
                <Check className="w-5 h-5 text-[#7C74F0]" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">Role-based access control</p>
                <p className="text-sm text-[#6F6BA0]">Admins see everything, regular users see their own</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 flex-shrink-0">
                <Check className="w-5 h-5 text-[#7C74F0]" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">Full activity history</p>
                <p className="text-sm text-[#6F6BA0]">Every change is logged, so nothing gets lost</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-[#6F6BA0] font-mono">
          <div className="flex -space-x-2">
            {['AS', 'HK', 'MR', 'ZB'].map((initials, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 border-[#0F0E2A] flex items-center justify-center text-xs font-bold text-white ${
                  i === 0 ? 'bg-gradient-to-br from-[#8A83F5] to-[#4F46E5]' :
                  i === 1 ? 'bg-gradient-to-br from-[#4FD1C5] to-[#0EA36B]' :
                  i === 2 ? 'bg-gradient-to-br from-[#F79E6A] to-[#E38B00]' :
                  'bg-gradient-to-br from-[#F58FA0] to-[#E5473A]'
                }`}
              >
                {initials}
              </div>
            ))}
          </div>
          <span>Built for teams who like their tasks organized</span>
        </div>
      </div>

      {/* RIGHT: Form Panel */}
      <div className="flex items-center justify-center p-8 lg:p-16 bg-[#F5F6FA]">
        <div className="w-full max-w-lg">
          <div className="flex bg-[#EFF0F7] rounded-xl p-1 mb-8">
            <button className="flex-1 py-3 text-sm font-semibold rounded-lg bg-white text-gray-900 shadow-sm transition text-center">
              Log in
            </button>
            <Link
              to="/register"
              className="flex-1 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 rounded-lg transition text-center"
            >
              Sign up
            </Link>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="text-4xl font-bold font-['Sora'] text-[#12131C] tracking-tight">Welcome back</h2>
              <p className="text-base text-[#666B80] mt-2">Log in to pick up right where you left off.</p>
            </div>

            {error && (
              <div className="mb-5">
                <ErrorMessage message={error} onDismiss={() => setError(null)} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#12131C] mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9EB0]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E4E6F0] rounded-xl text-base focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] outline-none transition placeholder:text-[#9A9EB0]"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#12131C] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9EB0]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#E4E6F0] rounded-xl text-base focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] outline-none transition placeholder:text-[#9A9EB0]"
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A9EB0] hover:text-[#666B80] transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 text-sm text-[#666B80]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#4F46E5] rounded"
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm font-semibold text-[#4F46E5]">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#4F46E5] hover:bg-[#372F9E] text-white font-semibold text-base rounded-xl transition shadow-lg shadow-[#4F46E5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Log in'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-center text-base text-[#666B80] mt-8">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#4F46E5] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;