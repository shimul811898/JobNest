import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type Job } from '../../types';
import { HiMapPin, HiCurrencyDollar, HiBriefcase, HiCalendar } from 'react-icons/hi2';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const [logoError, setLogoError] = useState(false);

  const formattedSalary = () => {
    const { min, max, currency } = job.salary;
    const formatNum = (num: number) => {
      if (num >= 1000) return `${num / 1000}k`;
      return num;
    };
    return `${currency === 'USD' ? '$' : ''}${formatNum(min)} - ${currency === 'USD' ? '$' : ''}${formatNum(max)}`;
  };


  const defaultLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=1e1b4b&color=a5b4fc&bold=true&size=128`;

  return (
    <div className="flex flex-col h-full rounded-2xl glass-card border border-slate-200/90 p-6 card-hover group transition-all duration-300 relative overflow-hidden bg-white/70">
      {/* Subtle ambient accent glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#6C5CE7]/10 to-[#00D2D3]/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:scale-125 transition-all duration-500" />

      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 mb-4.5 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-sm group-hover:border-[#6C5CE7]/40 transition-colors">
          <img
            src={logoError || !job.companyLogo ? defaultLogo : job.companyLogo}
            alt={job.company}
            referrerPolicy="no-referrer"
            onError={() => setLogoError(true)}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
            job.type === 'Remote'
              ? 'badge-gradient-emerald'
              : job.type === 'Hybrid'
              ? 'badge-gradient-cyan'
              : 'badge-gradient-purple'
          }`}>
            {job.type}
          </span>
          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
            {job.category}
          </span>
        </div>
      </div>

      {/* Title & Company */}
      <div className="mb-3.5 flex-1 relative z-10">
        <h3 className="text-base font-extrabold text-slate-900 font-heading group-hover:text-[#6C5CE7] transition-colors leading-snug line-clamp-1 mb-1">
          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
        </h3>
        <p className="text-xs text-[#6C5CE7] font-bold tracking-wide uppercase">{job.company}</p>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2 relative z-10">
        {job.shortDescription}
      </p>

      {/* Skills Badges (if available) */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4.5 relative z-10">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="text-[10px] font-semibold text-slate-600 bg-slate-100/90 border border-slate-200/80 px-2.5 py-0.5 rounded-md">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-slate-100 pt-4 mb-5 relative z-10">
        <div className="flex items-center text-slate-600 text-[11px] font-medium gap-1.5 min-w-0">
          <HiMapPin className="text-[#00D2D3] shrink-0 text-sm" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center text-slate-600 text-[11px] font-medium gap-1.5 min-w-0">
          <HiCurrencyDollar className="text-[#6C5CE7] shrink-0 text-sm" />
          <span className="truncate font-bold text-slate-900">{formattedSalary()}</span>
        </div>
        <div className="flex items-center text-slate-600 text-[11px] font-medium gap-1.5 min-w-0">
          <HiBriefcase className="text-[#00D2D3] shrink-0 text-sm" />
          <span className="truncate">{job.experience}</span>
        </div>
        <div className="flex items-center text-slate-500 text-[11px] font-medium gap-1.5 min-w-0">
          <HiCalendar className="text-[#6C5CE7] shrink-0 text-sm" />
          <span className="truncate">
            {job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'}
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <Link
        to={`/jobs/${job._id}`}
        className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] hover:opacity-95 text-white shadow-md shadow-[#6C5CE7]/20 hover:shadow-lg hover:shadow-[#6C5CE7]/30 transition-all duration-300 block relative z-10"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
