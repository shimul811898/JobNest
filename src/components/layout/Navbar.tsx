import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { HiBriefcase, HiBars3, HiXMark, HiArrowRightOnRectangle, HiPlus, HiSquares2X2, HiShieldCheck } from 'react-icons/hi2';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const defaultAvatar = user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e8e4fd&color=6C5CE7&bold=true` : '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Jobs', path: '/jobs' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-dark py-4 shadow-lg shadow-black/10'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] flex items-center justify-center text-white shadow-md shadow-[#6C5CE7]/20 group-hover:scale-105 transition-transform duration-200">
              <HiBriefcase className="text-xl" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-heading gradient-text">
              JobNest
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-2 ${
                    isActive ? 'text-[#00D2D3]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D2D3] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            
            {/* Conditional Links (Logged In) */}
            {isAuthenticated && (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors py-2 flex items-center gap-1 ${
                      location.pathname === '/admin' ? 'text-[#00D2D3]' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <HiShieldCheck className="text-base" /> Admin
                  </Link>
                )}
                <Link
                  to="/jobs/manage"
                  className={`text-sm font-medium transition-colors py-2 flex items-center gap-1 ${
                    location.pathname === '/jobs/manage' ? 'text-[#00D2D3]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <HiSquares2X2 className="text-base" /> My Jobs
                </Link>
                <Link
                  to="/jobs/add"
                  className={`text-sm font-medium transition-colors py-2 flex items-center gap-1 ${
                    location.pathname === '/jobs/add' ? 'text-[#00D2D3]' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <HiPlus className="text-base" /> Post Job
                </Link>
              </>
            )}
          </div>

          {/* Desktop User Panel */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 bg-white/5 border border-white/10 hover:border-white/20 py-1.5 pl-3 pr-4 rounded-full transition-all focus:outline-none"
                >
                  <img
                    src={avatarError || !user.avatar ? defaultAvatar : user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-sm font-medium text-slate-200">{user.name}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl glass-dark shadow-xl border border-white/5 py-2 z-50 origin-top-right"
                    >
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold truncate text-slate-200">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#6C5CE7]/20 text-[#6C5CE7]">
                          {user.role}
                        </span>
                      </div>
                      {user?.role === 'admin' && (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#00D2D3] hover:text-white hover:bg-white/5 transition-colors font-semibold"
                          >
                            <HiShieldCheck /> Admin Dashboard
                          </Link>
                          <Link
                            to="/jobs/manage"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <HiSquares2X2 /> My Posted Jobs
                          </Link>
                          <Link
                            to="/jobs/add"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <HiPlus /> Post a New Job
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 border-t border-white/5 transition-colors mt-1"
                      >
                        <HiArrowRightOnRectangle /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] hover:from-[#5a3fd9] hover:to-[#03a0a6] text-white shadow-lg shadow-[#6C5CE7]/25 hover:shadow-[#6C5CE7]/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <HiXMark className="h-6 w-6" /> : <HiBars3 className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-b border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-white/10 text-white border-l-4 border-[#00D2D3]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                      location.pathname === '/admin'
                        ? 'bg-[#6C5CE7]/20 text-[#00D2D3] border-l-4 border-[#00D2D3]'
                        : 'text-[#00D2D3] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    🛡️ Admin Dashboard
                  </Link>
                  <Link
                    to="/jobs/manage"
                    className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    My Jobs
                  </Link>
                  <Link
                    to="/jobs/add"
                    className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    Post a Job
                  </Link>
                </>
              )}

              <div className="pt-4 border-t border-white/5 space-y-3">
                {isAuthenticated && user ? (
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={avatarError || !user.avatar ? defaultAvatar : user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <HiArrowRightOnRectangle className="text-xl" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-2">
                    <Link
                      to="/login"
                      className="text-center text-sm font-medium text-slate-300 hover:text-white py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="text-center text-sm font-medium bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white py-3 rounded-xl shadow-lg shadow-[#6C5CE7]/20"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
