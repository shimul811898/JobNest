import { useMyJobs, useDeleteJob } from '../hooks/useJobs';
import { Link } from 'react-router-dom';
import { HiEye as EyeIcon, HiTrash as TrashIcon, HiPlus as PlusIcon, HiMapPin as MapIcon, HiBriefcase as BriefcaseIcon } from 'react-icons/hi2';
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const COLORS = ['#6C5CE7', '#00D2D3', '#FD7272', '#54a0ff', '#5f27cd', '#ff9f43', '#10ac84'];

const ManageJobs = () => {
  const { data, isLoading, refetch } = useMyJobs();
  const deleteMutation = useDeleteJob();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    const confirmed = window.confirm(`Are you sure you want to delete the job listing: "${title}"?`);
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (err) {
        // handled in mutation hook
      }
    }
    setDeletingId(null);
  };

  const jobs = data?.jobs || [];

  // Generate category stats on the fly for Recharts
  const categoryStats = jobs.reduce((acc: { name: string; count: number }[], job) => {
    const existing = acc.find((item) => item.name === job.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: job.category, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f1a] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black font-heading text-slate-900">Manage Job Postings</h1>
            <p className="text-xs text-slate-500">View logs, analyze distribution, and modify listings posted from your company account.</p>
          </div>
          <Link
            to="/jobs/add"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#6C5CE7]/15 hover:opacity-95 transition-all shrink-0"
          >
            <PlusIcon /> Post a Job
          </Link>
        </div>

        {/* Recharts Analytics Panel */}
        {!isLoading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Box 1 */}
            <div className="glass rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Listings</span>
              <div className="mt-4.5">
                <span className="text-4xl font-extrabold text-slate-900 font-heading">{jobs.length}</span>
                <p className="text-xs text-slate-500 mt-1">Live active openings on JobNest</p>
              </div>
            </div>

            {/* Stat Box 2 */}
            <div className="glass rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mock Applications</span>
              <div className="mt-4.5">
                <span className="text-4xl font-extrabold text-slate-900 font-heading">
                  {jobs.length * 3 + 4}
                </span>
                <p className="text-xs text-slate-500 mt-1">Candidates applied for review</p>
              </div>
            </div>

            {/* Recharts Bar Chart Panel */}
            <div className="glass rounded-2xl p-5 bg-white border border-slate-100 shadow-sm md:col-span-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Category Distribution</span>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats}>
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '10px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {categoryStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Table / Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 glass border border-slate-100 bg-white rounded-3xl space-y-4 shadow-sm">
            <p className="text-slate-700 font-bold font-heading">No listings posted yet</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">Create details maps and post your first career opening on JobNest.</p>
            <Link
              to="/jobs/add"
              className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
            >
              Post First Job
            </Link>
          </div>
        ) : (
          <div className="glass border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-sm">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Job Details</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Salary Range</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={job.companyLogo || `https://ui-avatars.com/api/?name=${job.company}&background=6C5CE7&color=fff`}
                              alt={job.company}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 font-heading">{job.title}</p>
                            <p className="text-xs text-[#6C5CE7] font-semibold">{job.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 font-semibold text-slate-500">{job.category}</td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapIcon className="text-[#00D2D3] text-sm shrink-0" />
                          <span>{job.location}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 font-bold text-slate-700">
                        ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="p-2 rounded-xl bg-slate-50 hover:bg-[#6C5CE7]/10 text-slate-500 hover:text-[#6C5CE7] border border-slate-200 transition-all shadow-sm"
                            title="View Job"
                          >
                            <EyeIcon className="text-base" />
                          </Link>
                          <button
                            onClick={() => handleDelete(job._id, job.title)}
                            disabled={deletingId === job._id}
                            className="p-2 rounded-xl bg-slate-50 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 border border-slate-200 transition-all shadow-sm disabled:opacity-50"
                            title="Delete Job"
                          >
                            <TrashIcon className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 divide-y divide-slate-100 md:hidden">
              {jobs.map((job) => (
                <div key={job._id} className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={job.companyLogo || `https://ui-avatars.com/api/?name=${job.company}&background=6C5CE7&color=fff`}
                        alt={job.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 font-heading leading-tight">{job.title}</h4>
                      <p className="text-xs text-[#6C5CE7] font-semibold">{job.company}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <BriefcaseIcon className="text-[#6C5CE7] text-sm shrink-0" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapIcon className="text-[#00D2D3] text-sm shrink-0" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold text-slate-700">
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600"
                      >
                        <EyeIcon className="text-sm" /> View
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id, job.title)}
                        disabled={deletingId === job._id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 disabled:opacity-50"
                      >
                        <TrashIcon className="text-sm" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
