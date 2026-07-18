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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Hybrid':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
    }
  };

  const defaultLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=e8e4fd&color=6C5CE7&bold=true&size=128`;

  return (
    <div className="flex flex-col h-full rounded-2xl glass border border-slate-100 p-6 card-hover hover:shadow-xl transition-all duration-300 bg-white">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 mb-4.5">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-inner">
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
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
            {job.category}
          </span>
        </div>
      </div>

      {/* Title & Company */}
      <div className="mb-3.5 flex-1">
        <h3 className="text-base font-extrabold text-slate-900 font-heading hover:text-[#6C5CE7] transition-colors leading-snug line-clamp-1 mb-1">
          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
        </h3>
        <p className="text-xs text-[#6C5CE7] font-bold tracking-wide uppercase">{job.company}</p>
      </div>

      {/* Description */}
      <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
        {job.shortDescription}
      </p>

      {/* Skills Badges (if available) */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4.5">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="text-[9px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[9px] font-bold text-slate-400 px-1 py-0.5">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-slate-100 pt-4 mb-5">
        <div className="flex items-center text-slate-500 text-[11px] gap-1.5 min-w-0">
          <HiMapPin className="text-[#00D2D3] shrink-0 text-sm" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center text-slate-500 text-[11px] gap-1.5 min-w-0">
          <HiCurrencyDollar className="text-[#6C5CE7] shrink-0 text-sm" />
          <span className="truncate font-bold text-slate-700">{formattedSalary()}</span>
        </div>
        <div className="flex items-center text-slate-500 text-[11px] gap-1.5 min-w-0">
          <HiBriefcase className="text-[#00D2D3] shrink-0 text-sm" />
          <span className="truncate">{job.experience}</span>
        </div>
        <div className="flex items-center text-slate-500 text-[11px] gap-1.5 min-w-0">
          <HiCalendar className="text-[#6C5CE7] shrink-0 text-sm" />
          <span className="truncate">
            {job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'}
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <Link
        to={`/jobs/${job._id}`}
        className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-extrabold bg-[#6C5CE7]/10 hover:bg-[#6C5CE7] text-[#6C5CE7] hover:text-white transition-all duration-300 block shadow-sm"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
