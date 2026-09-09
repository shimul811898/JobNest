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
    style: 'bg-amber-50 text-amber-700 border-amber-300',
    icon: <HiClock className="text-amber-600" />
  },
  reviewed: {
    label: 'Under Review',
    style: 'bg-blue-50 text-blue-700 border-blue-300',
    icon: <HiEye className="text-blue-600" />
  },
  accepted: {
    label: 'Accepted',
    style: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    icon: <HiCheckCircle className="text-emerald-600" />
  },
  rejected: {
    label: 'Not Selected',
    style: 'bg-rose-50 text-rose-700 border-rose-300',
    icon: <HiXCircle className="text-rose-600" />
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
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] flex items-center justify-center shadow-lg shadow-[#6C5CE7]/25">
                <HiDocumentText className="text-xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">My Applied / Booked Jobs</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Private view: only you can view your personal job applications.
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#6C5CE7]/20 hover:opacity-95 transition-all cursor-pointer"
          >
            Explore More Jobs <HiArrowRight className="text-sm" />
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="glass-card border border-slate-200/80 rounded-3xl p-12 text-center space-y-3 shadow-md">
            <p className="text-slate-900 font-bold text-lg font-heading">Failed to load applications</p>
            <p className="text-xs text-slate-500">Please check your internet connection or try again later.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="glass-card border border-slate-200/80 rounded-3xl p-16 text-center space-y-4 shadow-md">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-[#6C5CE7]">
              <HiBriefcase className="text-3xl" />
            </div>
            <h2 className="text-xl font-bold font-heading text-slate-900">No Applied Jobs Yet</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have not applied for or booked any jobs yet. Browse our active listings and find your next career step.
            </p>
            <div className="pt-2">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-[#6C5CE7]/25 hover:opacity-95 transition-all cursor-pointer"
              >
                Browse Open Jobs <HiArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-slate-600 font-medium px-1">
              You have submitted <span className="text-[#6C5CE7] font-bold">{applications.length}</span> application{applications.length > 1 ? 's' : ''}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => {
                const job = app.jobId;
                const statusInfo = statusConfig[app.status] || statusConfig.pending;

                if (!job) {
                  return (
                    <div key={app._id} className="glass-card border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                      <div className="text-slate-500 text-xs">Job listing no longer available</div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${statusInfo.style}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={app._id}
                    className="glass-card border border-slate-200/80 rounded-2xl p-5 sm:p-6 transition-all hover:border-[#6C5CE7]/40 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      {/* Job branding & info */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          <img
                            src={job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=1e1b4b&color=a5b4fc&bold=true`}
                            alt={job.company}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-base font-bold font-heading text-slate-900 hover:text-[#6C5CE7] transition-colors"
                          >
                            {job.title}
                          </Link>
                          <p className="text-xs font-semibold text-[#6C5CE7] mt-0.5">{job.company}</p>
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
                          className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all shadow-sm"
                          title="View Job Details"
                        >
                          <HiEye className="text-base" />
                        </Link>
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <HiMapPin className="text-[#00D2D3] text-sm" />
                        <span>{job.location}</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                        {job.type}
                      </span>
                      {job.salary && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-800 font-semibold">
                            ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()} / yr
                          </span>
                        </>
                      )}
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 text-[11px]">
                        Applied on {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Cover letter snippet if exists */}
                    {app.coverLetter && (
                      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 italic">
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
