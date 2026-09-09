import { useState, type FormEvent } from 'react';
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#6C5CE7]/10 via-transparent to-transparent opacity-60" />

      {/* Registration Card Container */}
      <div className="glass-card relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-slate-200/80 p-8 shadow-xl shadow-slate-100">
        
        {/* Header Title */}
        <div className="space-y-2 text-center">
          <Link to="/" className="font-heading mb-2 inline-flex items-center space-x-1.5">
            <span className="gradient-text text-2xl font-black tracking-tight">JobNest</span>
          </Link>
          <h2 className="font-heading text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-xs text-slate-500">Join thousands of talents searching and hiring on JobNest.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Full Name
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-colors focus-within:border-[#6C5CE7]">
              <HiUser className="mr-2.5 shrink-0 text-lg text-slate-400" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border-none bg-transparent py-0.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* Email Input */}
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
                placeholder="john@example.com"
                className="w-full border-none bg-transparent py-0.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-colors focus-within:border-[#6C5CE7]">
              <HiLockClosed className="mr-2.5 shrink-0 text-lg text-slate-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
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

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Confirm Password
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-colors focus-within:border-[#6C5CE7]">
              <HiLockClosed className="mr-2.5 shrink-0 text-lg text-slate-400" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full border-none bg-transparent py-0.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] py-3 text-sm font-semibold text-white shadow-md shadow-[#6C5CE7]/25 transition-all duration-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Google Sign Up Section */}
        <div className="space-y-3">
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-slate-200" />
            <span className="mx-3 flex-shrink text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Or sign up with
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => handleCustomGoogleRegister()}
            disabled={loading}
            className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FcGoogle className="text-xl transition-transform group-hover:scale-110" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Sign In Redirect */}
        <p className="mt-2 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-[#6C5CE7] hover:underline">
            Sign In Instead
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;