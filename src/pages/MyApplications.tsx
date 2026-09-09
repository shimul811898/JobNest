import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  HiBriefcase, 
  HiMapPin, 
  HiClock, 
  HiCheckCircle, 
  HiXCircle, 
  HiEye, 
  HiArrowRight,
  HiDocumentText
} from 'react-icons/hi2';

interface ApplicationItem {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary?: {
      min: number;
      max: number;
      currency: string;
    };
    type: string;
    companyLogo?: string;
  };
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; style: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Pending',
    style: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    icon: <HiClock className="text-amber-400" />
  },
  reviewed: {
    label: 'Under Review',
    style: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    icon: <HiEye className="text-blue-400" />
  },
  accepted: {
    label: 'Accepted',
    style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: <HiCheckCircle className="text-emerald-400" />
  },
  rejected: {
    label: 'Not Selected',
    style: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    icon: <HiXCircle className="text-rose-400" />
  },
};

const MyApplications = () => {
  const { data: applications = [], isLoading, isError } = useQuery<ApplicationItem[]>({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const { data } = await api.get('/applications/my');
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-[#0f0f1a] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] flex items-center justify-center shadow-lg shadow-[#6C5CE7]/25">
                <HiDocumentText className="text-xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">My Applied / Booked Jobs</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Private view: only you can view your personal job applications.
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#6C5CE7]/20 hover:opacity-95 transition-all"
          >
            Explore More Jobs <HiArrowRight className="text-sm" />
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#00D2D3] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="glass-card border border-white/10 rounded-3xl p-12 text-center space-y-3">
            <p className="text-white font-bold text-lg font-heading">Failed to load applications</p>
            <p className="text-xs text-slate-400">Please check your internet connection or try again later.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="glass-card border border-white/10 rounded-3xl p-16 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#00D2D3]">
              <HiBriefcase className="text-3xl" />
            </div>
            <h2 className="text-xl font-bold font-heading text-white">No Applied Jobs Yet</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You have not applied for or booked any jobs yet. Browse our active listings and find your next career step.
            </p>
            <div className="pt-2">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-[#6C5CE7]/25 hover:opacity-95 transition-all"
              >
                Browse Open Jobs <HiArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 font-medium px-1">
              You have submitted <span className="text-[#00D2D3] font-bold">{applications.length}</span> application{applications.length > 1 ? 's' : ''}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => {
                const job = app.jobId;
                const statusInfo = statusConfig[app.status] || statusConfig.pending;

                if (!job) {
                  return (
                    <div key={app._id} className="glass-card border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                      <div className="text-slate-400 text-xs">Job listing no longer available</div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${statusInfo.style}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={app._id}
                    className="glass-card border border-white/10 rounded-2xl p-5 sm:p-6 transition-all hover:border-[#6C5CE7]/40 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      {/* Job branding & info */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                          <img
                            src={job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=1e1b4b&color=a5b4fc&bold=true`}
                            alt={job.company}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-base font-bold font-heading text-white hover:text-[#00D2D3] transition-colors"
                          >
                            {job.title}
                          </Link>
                          <p className="text-xs font-semibold text-[#00D2D3] mt-0.5">{job.company}</p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${statusInfo.style}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="p-2 rounded-xl bg-white/5 hover:bg-[#6C5CE7]/20 text-slate-300 hover:text-white border border-white/10 transition-all"
                          title="View Job Details"
                        >
                          <HiEye className="text-base" />
                        </Link>
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <HiMapPin className="text-[#00D2D3] text-sm" />
                        <span>{job.location}</span>
                      </div>
                      <span className="text-slate-600">•</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-[11px] font-semibold">
                        {job.type}
                      </span>
                      {job.salary && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-white font-semibold">
                            ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()} / yr
                          </span>
                        </>
                      )}
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-[11px]">
                        Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Cover letter snippet if exists */}
                    {app.coverLetter && (
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-slate-400 italic">
                        "{app.coverLetter.length > 140 ? `${app.coverLetter.slice(0, 140)}...` : app.coverLetter}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
