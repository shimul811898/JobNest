import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJobs, useStats } from '../hooks/useJobs';
import JobCard from '../components/jobs/JobCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { motion } from 'framer-motion';
import { 
  HiMagnifyingGlass, 
  HiBriefcase, 
  HiUserGroup, 
  HiBuildingOffice2, 
  HiArrowRight, 
  HiCommandLine, 
  HiCpuChip, 
  HiChartBar, 
  HiSparkles,
  HiHeart,
  HiArrowTrendingUp,
  HiEnvelopeOpen
} from 'react-icons/hi2';

const categories = [
  { name: 'Technology', icon: <HiCpuChip className="text-2xl" />, count: 12, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { name: 'Finance', icon: <HiChartBar className="text-2xl" />, count: 4, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Marketing', icon: <HiArrowTrendingUp className="text-2xl" />, count: 3, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { name: 'Healthcare', icon: <HiHeart className="text-2xl" />, count: 2, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { name: 'Design', icon: <HiSparkles className="text-2xl" />, count: 2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { name: 'Engineering', icon: <HiCommandLine className="text-2xl" />, count: 2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
];

const testimonials = [
  {
    quote: "JobNest completely transformed my career search. Within 2 weeks of applying, I secured a role as a Senior React Engineer at TechVista!",
    author: "Sarah Jenkins",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    rating: 5
  },
  {
    quote: "Finding high-quality tech talent was a constant challenge for our scaling startup. JobNest linked us with qualified candidates instantly.",
    author: "Marcus Chen",
    role: "CTO, CloudScale",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    rating: 5
  },
  {
    quote: "The interface is smooth and the filters actually work! I found a great remote marketing role that aligned perfectly with my experience.",
    author: "Elena Rostova",
    role: "Growth Manager",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    rating: 5
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data, isLoading } = useJobs({ limit: 4 });
  const { data: stats } = useStats();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const featuredJobs = data?.jobs || [];

  return (
    <div className="min-h-screen bg-[#0f0f1a] overflow-hidden pt-20">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 border-b border-white/5 py-12 md:py-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#6C5CE7]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center z-10 space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 text-[#9580f3] text-xs font-semibold"
          >
            <HiSparkles className="text-sm" /> The Intelligent Way to Find Work
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading leading-none"
          >
            Connect with Your <br className="hidden sm:inline" />
            <span className="gradient-text">Dream Career</span> Today
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Discover thousands of hand-verified jobs across engineering, design, marketing, finance, healthcare, and educational services.
          </motion.p>

          {/* Hero CTA Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl glass border border-white/5 focus-within:border-[#6C5CE7]/40 shadow-xl transition-all duration-200">
              <div className="flex items-center flex-1 px-3 py-2 sm:py-0">
                <HiMagnifyingGlass className="text-slate-400 text-xl mr-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keywords or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-slate-100 placeholder-slate-500 text-sm py-1.5"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-95 shadow-md shadow-[#6C5CE7]/15 transition-all duration-200"
              >
                Search Jobs
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* SECTION 2: STATISTICS SECTION */}
      <section className="py-12 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Active Postings', value: stats?.totalJobs || 24, suffix: '+', icon: <HiBriefcase className="text-[#00D2D3] mx-auto text-xl mb-1.5" /> },
              { label: 'Verified Employers', value: stats?.totalCompanies || 20, suffix: '+', icon: <HiBuildingOffice2 className="text-[#a29bfe] mx-auto text-xl mb-1.5" /> },
              { label: 'Success Placement', value: 94, suffix: '%', icon: <HiArrowTrendingUp className="text-[#00D2D3] mx-auto text-xl mb-1.5" /> },
              { label: 'Active Talents', value: stats?.totalUsers || 2, suffix: 'k', icon: <HiUserGroup className="text-[#a29bfe] mx-auto text-xl mb-1.5" /> },
            ].map((stat, i) => (
              <div key={i} className="p-5 glass-card rounded-2xl border border-white/10 flex flex-col justify-center shadow-lg hover:border-[#6C5CE7]/40 transition-all">
                {stat.icon}
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                  {stat.value}{stat.suffix}
                </span>
                <span className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: POPULAR CATEGORIES */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-heading text-white">Popular Categories</h2>
            <p className="text-slate-400 text-sm mt-2">Explore available job listings grouped by functional industry domains.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/jobs?category=${cat.name}`}
                className="flex flex-col items-center justify-center p-6 rounded-2xl glass-card border border-white/10 hover:border-[#00D2D3]/40 transition-all duration-300 text-center group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110 border ${cat.color}`}>
                  {cat.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors font-heading mb-1">{cat.name}</h3>
                <span className="text-xs text-slate-400">{cat.count} listings</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURED JOBS */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold font-heading text-white">Featured Job Openings</h2>
              <p className="text-slate-400 text-sm mt-1">Apply now to premium, verified job listings matching current talent needs.</p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D2D3] hover:text-[#00D2D3]/90 group"
            >
              Explore All Jobs <HiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
            ) : featuredJobs.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400">
                No featured jobs available.
              </div>
            ) : (
              featuredJobs.map((job) => <JobCard key={job._id} job={job} />)
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-heading text-white">How It Works</h2>
            <p className="text-slate-400 text-sm mt-2">Get hired in three easy steps with our streamlined recruitment system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {[
              { step: '01', title: 'Create Account', text: 'Register as a Candidate or Employer. Flesh out your credentials, skills, or hiring brand logs.', bg: 'bg-[#6C5CE7]/15 border-[#6C5CE7]/30 text-[#a29bfe]' },
              { step: '02', title: 'Apply or Post Jobs', text: 'Search through curated listings with precise filters, or post job needs using our form builder.', bg: 'bg-[#00D2D3]/15 border-[#00D2D3]/30 text-[#00D2D3]' },
              { step: '03', title: 'Succeed & Recruit', text: 'Submit applications with cover letters and resume logs, or review applicants and hire top talents.', bg: 'bg-[#FD7272]/15 border-[#FD7272]/30 text-[#FD7272]' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-8 rounded-2xl glass-card border border-white/10 relative z-10 hover:border-[#6C5CE7]/40 transition-all">
                <span className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border font-heading mb-6 shadow-md ${item.bg}`}>
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 font-heading">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS SECTION */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-heading text-white">Reviews & Success Stories</h2>
            <p className="text-slate-400 text-sm mt-2">Hear directly from job seekers and employers using our automated workspace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, index) => (
              <div key={index} className="p-6 rounded-2xl glass-card border border-white/10 flex flex-col h-full hover:border-[#00D2D3]/30 transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <span key={i} className="text-[#00D2D3] text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic mb-6 flex-1">
                  "{test.quote}"
                </p>
                <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                  <img
                    src={test.avatar}
                    alt={test.author}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white font-heading">{test.author}</h4>
                    <p className="text-xs text-slate-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CTA / NEWSLETTER */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl glass-card border border-white/10 bg-gradient-to-tr from-[#6C5CE7]/15 via-[#00D2D3]/10 to-transparent p-10 md:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto text-white text-2xl shadow-lg">
              <HiEnvelopeOpen className="text-[#00D2D3]" />
            </div>
            <h2 className="text-3xl font-bold font-heading text-white">Never Miss a Career Match</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Subscribe to our weekly job alerts and receive recommendations matching your search parameters straight to your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); setSearch(''); }} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm outline-none focus:border-[#00D2D3]"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white py-3 px-6 rounded-xl text-sm font-semibold hover:opacity-95 shadow-md shadow-[#6C5CE7]/20 transition-all duration-150"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
