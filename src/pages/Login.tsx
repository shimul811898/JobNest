import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Capture the protected route they came from, default to homepage '/'
  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error('No credential received from Google');
      return;
    }
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign In was cancelled or encountered an error');
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#6C5CE7]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
      
      {/* Login Card Container */}
      <div className="max-w-md w-full p-8 rounded-3xl glass-card border border-white/10 space-y-6 shadow-2xl relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-1.5 mb-2 font-heading">
            <span className="text-2xl font-black tracking-tight gradient-text">JobNest</span>
          </Link>
          <h2 className="text-2xl font-bold font-heading text-white">Welcome Back</h2>
          <p className="text-xs text-slate-300">Sign in to search listings and apply for jobs.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="you@example.com"
                className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 text-sm py-0.5"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Password</label>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); toast.error('Password reset is not configured. Please register a new account.'); }} 
                className="text-[10px] font-semibold text-[#00D2D3] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-[#6C5CE7]/40 transition-colors">
              <HiLockClosed className="text-slate-500 mr-2.5 text-lg shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6C5CE7] hover:bg-[#5a3fd9] text-white py-3 rounded-xl text-sm font-semibold transition-all duration-150 shadow-md shadow-[#6C5CE7]/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Google Sign In Section */}
        <div className="space-y-3">
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              Or continue with
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
              size="large"
              text="signin_with"
              width="100%"
            />
          </div>
        </div>

        {/* Register Redirect */}
        <p className="text-center text-xs text-slate-400 mt-2">
          New to JobNest?{' '}
          <Link to="/register" state={location.state} className="font-semibold text-[#00D2D3] hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;