import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { HiUser, HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Try another email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await googleLogin({ accessToken: tokenResponse.access_token });
        navigate(redirectPath, { replace: true });
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Google registration failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign Up was cancelled or encountered an error');
    },
  });

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#6C5CE7]/10 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Registration Card Container */}
      <div className="max-w-md w-full p-8 rounded-3xl glass-card border border-white/10 space-y-6 shadow-2xl relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-1.5 mb-2 font-heading">
            <span className="text-2xl font-black tracking-tight gradient-text">JobNest</span>
          </Link>
          <h2 className="text-2xl font-bold font-heading text-white">Create Account</h2>
          <p className="text-xs text-slate-300">Join thousands of talents searching and hiring on JobNest.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#6C5CE7]/40 transition-colors">
              <HiUser className="text-slate-500 mr-2.5 text-lg shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 text-sm py-0.5"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#6C5CE7]/40 transition-colors">
              <HiEnvelope className="text-slate-500 mr-2.5 text-lg shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 text-sm py-0.5"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Password</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#6C5CE7]/40 transition-colors">
              <HiLockClosed className="text-slate-500 mr-2.5 text-lg shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 text-sm py-0.5"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 focus:outline-none ml-2 shrink-0"
              >
                {showPassword ? <HiEyeSlash className="text-lg" /> : <HiEye className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Confirm Password</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#6C5CE7]/40 transition-colors">
              <HiLockClosed className="text-slate-500 mr-2.5 text-lg shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 text-sm py-0.5"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] hover:opacity-95 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-[#6C5CE7]/25 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Google Sign In Section */}
        <div className="space-y-3">
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              Or sign up with
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={() => handleCustomGoogleRegister()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all duration-200 shadow-md shadow-black/20 group cursor-pointer"
          >
            <FcGoogle className="text-xl group-hover:scale-110 transition-transform" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Sign In Redirect */}
        <p className="text-center text-xs text-slate-400 mt-2">
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-[#00D2D3] hover:underline">
            Sign In Instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;