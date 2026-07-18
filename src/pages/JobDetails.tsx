import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJob, useRelatedJobs } from '../hooks/useJobs';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/jobs/JobCard';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  HiMapPin, 
  HiCurrencyDollar, 
  HiBriefcase, 
  HiCalendar, 
  HiClock,
  HiChevronRight,
  HiPaperAirplane,
  HiBriefcase as JobIcon
} from 'react-icons/hi2';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const { data: job, isLoading, isError } = useJob(id || '');
  const { data: relatedJobs } = useRelatedJobs(id || '');

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('You must be logged in to apply');
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/applications', {
        jobId: id,
        coverLetter,
        resumeUrl
      });
      toast.success('Your application has been submitted successfully!');
      setAlreadyApplied(true);
      setShowApplyModal(false);
      setCoverLetter('');
      setResumeUrl('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
        <div className="w-12 h-12 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f1a] text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Job Not Found</h2>
        <p className="text-sm text-slate-400">The listing may have expired or been removed by the employer.</p>
        <Link to="/jobs" className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-semibold">
          Back to Listings
        </Link>
      </div>
    );
  }

  const formattedSalary = () => {
    const { min, max, currency } = job.salary;
    const formatNum = (num: number) => {
      if (num >= 1000) return `${num / 1000}k`;
      return num;
    };
    return `${currency === 'USD' ? '$' : ''}${formatNum(min)} - ${currency === 'USD' ? '$' : ''}${formatNum(max)} / year`;
  };

  const isOwner = user && (job.postedBy === user._id || (typeof job.postedBy === 'object' && job.postedBy._id === user._id));

  return (
    <div className="min-h-screen bg-[#0f0f1a] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-slate-300">Home</Link>
          <HiChevronRight />
          <Link to="/jobs" className="hover:text-slate-300">Browse Jobs</Link>
          <HiChevronRight />
          <span className="text-slate-400 truncate">{job.title}</span>
        </div>

        {/* Hero header */}
        <div className="p-8 rounded-3xl glass border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7]/5 via-transparent to-transparent opacity-40 pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-black/10">
              <img
                src={job.companyLogo || `https://ui-avatars.com/api/?name=${job.company}&background=6C5CE7&color=fff`}
                alt={job.company}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-100 leading-snug">{job.title}</h1>
              <p className="text-sm font-semibold text-[#00D2D3]">{job.company}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            {isOwner ? (
              <span className="px-4 py-2.5 rounded-xl border border-dashed border-[#6C5CE7]/30 text-xs font-semibold text-[#9580f3] bg-[#6C5CE7]/5">
                Your Job Listing
              </span>
            ) : alreadyApplied ? (
              <span className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                Application Submitted
              </span>
            ) : (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error('You must sign in to apply');
                    navigate('/login');
                  } else {
                    setShowApplyModal(true);
                  }
                }}
                className="bg-[#6C5CE7] hover:bg-[#5a3fd9] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#6C5CE7]/20"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Grid content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main info (Description, Requirements, Responsibilities) */}
          <div className="lg:col-span-2 space-y-8 p-8 rounded-2xl glass border border-white/5">
            {/* Overview */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold font-heading text-slate-200 border-b border-white/5 pb-2.5">Job Overview</h2>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold font-heading text-slate-200 border-b border-white/5 pb-2.5">Requirements</h2>
                <ul className="list-disc pl-5 text-slate-400 text-sm space-y-2.5 leading-relaxed">
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold font-heading text-slate-200 border-b border-white/5 pb-2.5">Responsibilities</h2>
                <ul className="list-disc pl-5 text-slate-400 text-sm space-y-2.5 leading-relaxed">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Specifications */}
          <div className="space-y-8 lg:col-span-1">
            {/* Job Details Card */}
            <div className="p-6 rounded-2xl glass border border-white/5 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-heading border-b border-white/5 pb-3">
                Job Specifications
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Location', value: job.location, icon: <HiMapPin className="text-lg text-[#00D2D3]" /> },
                  { label: 'Salary Range', value: formattedSalary(), icon: <HiCurrencyDollar className="text-lg text-[#6C5CE7]" /> },
                  { label: 'Experience Level', value: job.experience, icon: <HiBriefcase className="text-lg text-[#00D2D3]" /> },
                  { label: 'Job Category', value: job.category, icon: <JobIcon className="text-lg text-[#6C5CE7]" /> },
                  { label: 'Work Mode', value: job.type, icon: <HiClock className="text-lg text-[#00D2D3]" /> },
                  { label: 'Date Posted', value: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recent', icon: <HiCalendar className="text-lg text-[#6C5CE7]" /> }
                ].map((spec, i) => (
                  <div key={i} className="flex gap-3.5 items-start">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {spec.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">{spec.label}</p>
                      <p className="text-xs text-slate-300 font-medium mt-0.5">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Benefits */}
            <div className="p-6 rounded-2xl glass border border-white/5 space-y-5">
              {job.skills && job.skills.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">Desired Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill) => (
                      <span key={skill} className="text-[10px] font-semibold bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">Compensation Benefits</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.benefits.map((benefit) => (
                      <span key={benefit} className="text-[10px] font-semibold bg-[#00D2D3]/5 border border-[#00D2D3]/15 px-2.5 py-1 rounded-lg text-[#00D2D3]">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Jobs Section */}
        {relatedJobs && relatedJobs.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-heading text-slate-200">Related Job Openings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedJobs.map((rJob) => (
                <JobCard key={rJob._id} job={rJob} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowApplyModal(false)} />
          
          <div className="bg-[#0a0a14] border border-white/5 rounded-3xl max-w-lg w-full p-8 relative z-10 space-y-6 shadow-2xl animate-scale-in">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-heading text-slate-200">Apply for Job</h3>
              <p className="text-xs text-slate-400">{job.title} at {job.company}</p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Resume Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/your-resume-pdf/view"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-[#6C5CE7]/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Cover Letter *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Introduce yourself and explain why you're a great fit for this career role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-[#6C5CE7]/40 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="w-full py-3 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-all text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#6C5CE7] hover:bg-[#5a3fd9] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#6C5CE7]/15 flex items-center justify-center gap-1.5"
                >
                  <HiPaperAirplane /> {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
