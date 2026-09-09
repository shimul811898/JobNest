import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

  const handleCustomGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await googleLogin({ accessToken: tokenResponse.access_token });
        navigate(redirectPath, { replace: true });
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Google login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error('Google Sign In was cancelled or encountered an error');
    },
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#6C5CE7]/10 via-transparent to-transparent opacity-60" />

      {/* Login Card Container */}
      <div className="glass-card relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-slate-200/80 p-8 shadow-xl shadow-slate-100">
        
        {/* Header Title */}
        <div className="space-y-2 text-center">
          <Link to="/" className="font-heading mb-2 inline-flex items-center space-x-1.5">
            <span className="gradient-text text-2xl font-black tracking-tight">JobNest</span>
          </Link>
          <h2 className="font-heading text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to search listings and apply for jobs.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-colors focus-within:border-[#6C5CE7]">
              <HiEnvelope className="mr-2.5 shrink-0 text-lg text-slate-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-none bg-transparent py-0.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast.error('Password reset is not configured. Please register a new account.')}
                className="text-[10px] font-semibold text-[#6C5CE7] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-colors focus-within:border-[#6C5CE7]">
              <HiLockClosed className="mr-2.5 shrink-0 text-lg text-slate-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-none bg-transparent py-0.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 shrink-0 cursor-pointer text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiEyeSlash className="text-lg" /> : <HiEye className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] py-3 text-sm font-semibold text-white shadow-md shadow-[#6C5CE7]/20 transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider & OAuth Section */}
        <div className="space-y-3">
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-slate-200" />
            <span className="mx-3 flex-shrink text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => handleCustomGoogleLogin()}
            disabled={loading}
            className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FcGoogle className="text-xl transition-transform group-hover:scale-110" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer Redirect */}
        <p className="mt-2 text-center text-xs text-slate-500">
          New to JobNest?{' '}
          <Link to="/register" state={location.state} className="font-semibold text-[#6C5CE7] hover:underline">
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;