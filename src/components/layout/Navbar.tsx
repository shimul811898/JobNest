import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { HiBriefcase, HiBars3, HiXMark, HiArrowRightOnRectangle, HiPlus, HiSquares2X2, HiShieldCheck, HiDocumentCheck } from 'react-icons/hi2';

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
                  className={`text-sm font-semibold transition-colors relative py-2 ${
                    isActive ? 'text-[#6C5CE7]' : 'text-slate-600 hover:text-[#6C5CE7]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] rounded-full"
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
                    className={`text-sm font-semibold transition-colors py-2 flex items-center gap-1.5 ${
                      location.pathname === '/admin' ? 'text-[#6C5CE7]' : 'text-slate-600 hover:text-[#6C5CE7]'
                    }`}
                  >
                    <HiShieldCheck className="text-base text-[#6C5CE7]" /> Admin
                  </Link>
                )}
                <Link
                  to="/applications/my"
                  className={`text-sm font-semibold transition-colors py-2 flex items-center gap-1.5 ${
                    location.pathname === '/applications/my' ? 'text-[#6C5CE7]' : 'text-slate-600 hover:text-[#6C5CE7]'
                  }`}
                >
                  <HiDocumentCheck className="text-base text-[#00D2D3]" /> My Applied
                </Link>
                <Link
                  to="/jobs/manage"
                  className={`text-sm font-semibold transition-colors py-2 flex items-center gap-1.5 ${
                    location.pathname === '/jobs/manage' ? 'text-[#6C5CE7]' : 'text-slate-600 hover:text-[#6C5CE7]'
                  }`}
                >
                  <HiSquares2X2 className="text-base text-[#6C5CE7]" /> My Jobs
                </Link>
                <Link
                  to="/jobs/add"
                  className={`text-sm font-semibold transition-colors py-2 flex items-center gap-1.5 ${
                    location.pathname === '/jobs/add' ? 'text-[#6C5CE7]' : 'text-slate-600 hover:text-[#6C5CE7]'
                  }`}
                >
                  <HiPlus className="text-base text-[#00D2D3]" /> Post Job
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
                  className="flex items-center space-x-3 bg-white/80 border border-slate-200 hover:border-[#6C5CE7]/40 shadow-sm py-1.5 pl-3 pr-4 rounded-full transition-all focus:outline-none cursor-pointer"
                >
                  <img
                    src={avatarError || !user.avatar ? defaultAvatar : user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass shadow-xl border border-slate-200/80 py-2 z-50 origin-top-right"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold truncate text-slate-800">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full badge-gradient-purple">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        to="/applications/my"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-colors font-medium"
                      >
                        <HiDocumentCheck className="text-[#00D2D3]" /> My Applied Jobs
                      </Link>
                      {user?.role === 'admin' && (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-colors font-semibold"
                          >
                            <HiShieldCheck /> Admin Dashboard
                          </Link>
                          <Link
                            to="/jobs/manage"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-colors font-medium"
                          >
                            <HiSquares2X2 /> My Posted Jobs
                          </Link>
                          <Link
                            to="/jobs/add"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-colors font-medium"
                          >
                            <HiPlus /> Post a New Job
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-t border-slate-100 transition-colors mt-1 font-semibold cursor-pointer"
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
                  className="text-sm font-semibold text-slate-700 hover:text-[#6C5CE7] px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] hover:opacity-95 text-white shadow-md shadow-[#6C5CE7]/25 hover:shadow-lg hover:shadow-[#6C5CE7]/35 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
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
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
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
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-[#6C5CE7]/15 to-[#00D2D3]/15 text-[#6C5CE7] border-l-4 border-[#6C5CE7]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  to="/applications/my"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    location.pathname === '/applications/my'
                      ? 'bg-gradient-to-r from-[#6C5CE7]/15 to-[#00D2D3]/15 text-[#6C5CE7] border-l-4 border-[#6C5CE7]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  📄 My Applied Jobs
                </Link>
              )}

              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      location.pathname === '/admin'
                        ? 'bg-violet-50 text-[#6C5CE7] border-l-4 border-[#6C5CE7]'
                        : 'text-[#6C5CE7] hover:bg-violet-50'
                    }`}
                  >
                    🛡️ Admin Dashboard
                  </Link>
                  <Link
                    to="/jobs/manage"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    My Jobs
                  </Link>
                  <Link
                    to="/jobs/add"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    Post a Job
                  </Link>
                </>
              )}

              <div className="pt-4 border-t border-slate-200 space-y-3">
                {isAuthenticated && user ? (
                  <div className="px-2 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={avatarError || !user.avatar ? defaultAvatar : user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                    >
                      <HiArrowRightOnRectangle className="text-xl" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 px-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-center text-sm font-semibold text-slate-700 hover:text-slate-900 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="text-center text-sm font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white py-2.5 rounded-xl shadow-md shadow-[#6C5CE7]/20"
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
