import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 10) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['', 'Weak — try adding numbers or symbols', 'Good — almost there', 'Strong password'];
  const strengthColors = ['', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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

      {/* RIGHT: Form Panel - More compact */}
      <div className="flex items-center justify-center p-6 lg:p-10 bg-[#F5F6FA]">
        <div className="w-full max-w-lg">
          {/* Tabs - Smaller padding */}
          <div className="flex bg-[#EFF0F7] rounded-xl p-1 mb-6">
            <Link
              to="/login"
              className="flex-1 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 rounded-lg transition text-center"
            >
              Log in
            </Link>
            <button 
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg bg-white text-gray-900 shadow-sm transition text-center"
            >
              Sign up
            </button>
          </div>

          <div>
            {/* Header - Smaller margin */}
            <div className="mb-5">
              <h2 className="text-4xl font-bold font-['Sora'] text-[#12131C] tracking-tight">Create your account</h2>
              <p className="text-base text-[#666B80] mt-1.5">Get started — you'll be set up as a regular user by default.</p>
            </div>

            {error && (
              <div className="mb-4">
                <ErrorMessage message={error} onDismiss={() => setError(null)} />
              </div>
            )}

            {/* Form - Compact spacing */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-sm font-semibold text-[#12131C] mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9EB0]" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-[#E4E6F0] rounded-xl text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] outline-none transition placeholder:text-[#9A9EB0]"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#12131C] mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9EB0]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-[#E4E6F0] rounded-xl text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] outline-none transition placeholder:text-[#9A9EB0]"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#12131C] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9EB0]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-[#E4E6F0] rounded-xl text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] outline-none transition placeholder:text-[#9A9EB0]"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A9EB0] hover:text-[#666B80] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition ${
                            i <= strength ? strengthColors[strength] : 'bg-[#EFF0F7]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-mono text-[#9A9EB0] mt-1">
                      {strengthLabels[strength] || 'At least 8 characters'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#12131C] mb-1.5">Confirm password</label>
                <div className="relative">
                  <Check className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9EB0]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-[#E4E6F0] rounded-xl text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] outline-none transition placeholder:text-[#9A9EB0]"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A9EB0] hover:text-[#666B80] transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms checkbox - Compact */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#4F46E5] rounded"
                />
                <span className="text-sm text-[#666B80]">
                  I agree to the <a href="#" className="text-[#4F46E5] font-semibold">Terms</a>
                </span>
              </div>

              {/* Button - Compact padding */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-[#4F46E5] hover:bg-[#372F9E] text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-[#4F46E5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer - Smaller margin */}
            <p className="text-center text-sm text-[#666B80] mt-5">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#4F46E5] hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;