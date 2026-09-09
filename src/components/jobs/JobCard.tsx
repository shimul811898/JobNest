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

  const typeColor = () => {
    switch (job.type) {
      case 'Remote':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
      case 'Hybrid':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]';
    }
  };

  const defaultLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=1e1b4b&color=a5b4fc&bold=true&size=128`;

  return (
    <div className="flex flex-col h-full rounded-2xl glass-card border border-white/10 p-6 card-hover group transition-all duration-300 relative overflow-hidden">
      {/* Subtle ambient accent glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5CE7]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:bg-[#00D2D3]/15 transition-all duration-500" />

      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 mb-4.5 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-md group-hover:border-[#6C5CE7]/40 transition-colors">
          <img
            src={logoError || !job.companyLogo ? defaultLogo : job.companyLogo}
            alt={job.company}
            referrerPolicy="no-referrer"
            onError={() => setLogoError(true)}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${typeColor()}`}>
            {job.type}
          </span>
          <span className="text-[10px] font-semibold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
            {job.category}
          </span>
        </div>
      </div>

      {/* Title & Company */}
      <div className="mb-3.5 flex-1 relative z-10">
        <h3 className="text-base font-extrabold text-white font-heading group-hover:text-[#00D2D3] transition-colors leading-snug line-clamp-1 mb-1">
          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
        </h3>
        <p className="text-xs text-[#a29bfe] font-bold tracking-wide uppercase">{job.company}</p>
      </div>

      {/* Description */}
      <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-2 relative z-10">
        {job.shortDescription}
      </p>

      {/* Skills Badges (if available) */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4.5 relative z-10">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="text-[10px] font-medium text-slate-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-white/10 pt-4 mb-5 relative z-10">
        <div className="flex items-center text-slate-300 text-[11px] gap-1.5 min-w-0">
          <HiMapPin className="text-[#00D2D3] shrink-0 text-sm" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center text-slate-300 text-[11px] gap-1.5 min-w-0">
          <HiCurrencyDollar className="text-[#a29bfe] shrink-0 text-sm" />
          <span className="truncate font-bold text-white">{formattedSalary()}</span>
        </div>
        <div className="flex items-center text-slate-300 text-[11px] gap-1.5 min-w-0">
          <HiBriefcase className="text-[#00D2D3] shrink-0 text-sm" />
          <span className="truncate">{job.experience}</span>
        </div>
        <div className="flex items-center text-slate-300 text-[11px] gap-1.5 min-w-0">
          <HiCalendar className="text-[#a29bfe] shrink-0 text-sm" />
          <span className="truncate">
            {job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'}
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <Link
        to={`/jobs/${job._id}`}
        className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#6C5CE7]/20 to-[#00D2D3]/20 hover:from-[#6C5CE7] hover:to-[#00D2D3] text-white border border-white/10 hover:border-transparent transition-all duration-300 block shadow-md hover:shadow-[#6C5CE7]/30 relative z-10"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
