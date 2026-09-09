import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  HiUsers,
  HiBriefcase,
  HiDocumentText,
  HiChartBar,
  HiEye,
  HiTrash,
  HiMagnifyingGlass,
  HiArrowPath,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiMapPin,
  HiShieldCheck,
} from 'react-icons/hi2';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useDeleteJob } from '../hooks/useJobs';

const COLORS = ['#6C5CE7', '#00D2D3', '#FD7272', '#54a0ff', '#5f27cd', '#ff9f43', '#10ac84', '#ee5a24'];

type TabId = 'overview' | 'jobs' | 'users' | 'applications';

const AdminDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [jobSearch, setJobSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [appFilter, setAppFilter] = useState('all');

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data;
    },
  });

  // Fetch all jobs (admin)
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['adminJobs', jobSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (jobSearch) params.append('search', jobSearch);
      params.append('limit', '100');
      const { data } = await api.get(`/admin/jobs?${params.toString()}`);
      return data;
    },
    enabled: activeTab === 'jobs' || activeTab === 'overview',
  });

  // Fetch all users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers', userSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      params.append('limit', '100');
      const { data } = await api.get(`/admin/users?${params.toString()}`);
      return data;
    },
    enabled: activeTab === 'users' || activeTab === 'overview',
  });

  // Fetch all applications
  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['adminApplications', appFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (appFilter !== 'all') params.append('status', appFilter);
      params.append('limit', '100');
      const { data } = await api.get(`/admin/applications?${params.toString()}`);
      return data;
    },
    enabled: activeTab === 'applications' || activeTab === 'overview',
  });

  // Update application status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/admin/applications/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminApplications'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Application status updated!');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const deleteMutation = useDeleteJob();

  const handleDeleteJob = async (id: string, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"?`);
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(id);
        queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
        queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      } catch {
        // handled by hook
      }
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <HiChartBar /> },
    { id: 'jobs', label: 'All Jobs', icon: <HiBriefcase /> },
    { id: 'users', label: 'All Users', icon: <HiUsers /> },
    { id: 'applications', label: 'Applications', icon: <HiDocumentText /> },
  ];

  const categoryChartData = stats?.categoryCounts
    ? Object.entries(stats.categoryCounts).map(([name, count]) => ({ name, count }))
    : [];

  const typeChartData = stats?.typeCounts
    ? Object.entries(stats.typeCounts).map(([name, count]) => ({ name, count }))
    : [];

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-300',
    reviewed: 'bg-blue-50 text-blue-700 border-blue-300',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    rejected: 'bg-rose-50 text-rose-700 border-rose-300',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <HiClock className="text-amber-600" />,
    reviewed: <HiEye className="text-blue-600" />,
    accepted: <HiCheckCircle className="text-emerald-600" />,
    rejected: <HiXCircle className="text-rose-600" />,
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] flex items-center justify-center shadow-lg shadow-[#6C5CE7]/25">
                <HiShieldCheck className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">
                  Welcome back, <span className="text-[#6C5CE7] font-semibold">{user?.name}</span>
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/jobs/add"
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#6C5CE7]/20 hover:opacity-95 transition-all shrink-0 cursor-pointer"
          >
            + Post a Job
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white shadow-lg shadow-[#6C5CE7]/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════ OVERVIEW TAB ═══════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stat Cards */}
            {statsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: <HiBriefcase />, color: '#6C5CE7', sub: `${stats?.activeJobs || 0} active` },
                    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <HiUsers />, color: '#00D2D3', sub: 'Registered accounts' },
                    { label: 'Applications', value: stats?.totalApplications || 0, icon: <HiDocumentText />, color: '#FD7272', sub: 'Total submissions' },
                    { label: 'Companies', value: stats?.totalCompanies || 0, icon: <HiChartBar />, color: '#ff9f43', sub: 'Unique employers' },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-2xl glass-card border border-slate-200/80 p-6 group transition-all shadow-md"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-15" style={{ background: stat.color }} />
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${stat.color}15`, color: stat.color }}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-4xl font-black text-slate-900 font-heading">{stat.value}</div>
                      <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  <div className="rounded-2xl glass-card border border-slate-200/80 p-6 shadow-md">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Jobs by Category</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryChartData}>
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={60} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#6C5CE7' }}
                          />
                          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {categoryChartData.map((_, index) => (
                              <Cell key={`cat-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Type Distribution */}
                  <div className="rounded-2xl glass-card border border-slate-200/80 p-6 shadow-md">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Jobs by Type</h3>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={typeChartData}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            innerRadius={50}
                            paddingAngle={3}
                            strokeWidth={0}
                            label={({ name, percent }: { name?: string; percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                          >
                            {typeChartData.map((_, index) => (
                              <Cell key={`type-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Applications */}
                {stats?.recentApplications?.length > 0 && (
                  <div className="rounded-2xl border border-slate-200/80 glass-card p-6 shadow-md">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Recent Applications</h3>
                    <div className="space-y-3">
                      {stats.recentApplications.map((app: any) => (
                        <div key={app._id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50/70 border border-slate-200">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.userId?.name || 'U')}&background=6C5CE7&color=fff`}
                              alt={app.userId?.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <p className="text-sm font-bold text-slate-900">{app.userId?.name || 'Unknown'}</p>
                              <p className="text-xs text-slate-500">Applied for <span className="text-[#6C5CE7] font-semibold">{app.jobId?.title || 'Unknown Job'}</span></p>
                            </div>
                          </div>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${statusColors[app.status] || ''}`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══════════════════ ALL JOBS TAB ═══════════════════ */}
        {activeTab === 'jobs' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search */}
            <div className="relative max-w-md">
              <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Search jobs by title or company..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#6C5CE7] shadow-sm transition-all"
              />
            </div>

            {jobsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="rounded-2xl glass-card border border-slate-200/80 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80">
                        <th className="py-4 px-6">Job</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Type</th>
                        <th className="py-4 px-6">Location</th>
                        <th className="py-4 px-6">Salary</th>
                        <th className="py-4 px-6">Posted By</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {(jobsData?.jobs || []).map((job: any) => (
                        <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={job.companyLogo || `https://ui-avatars.com/api/?name=${job.company}&background=6C5CE7&color=fff`}
                                alt={job.company}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm"
                              />
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{job.title}</p>
                                <p className="text-xs text-[#6C5CE7] font-semibold">{job.company}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600 text-xs font-semibold">{job.category}</td>
                          <td className="py-4 px-6">
                            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">{job.type}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <HiMapPin className="text-[#00D2D3] shrink-0" />
                              {job.location}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm font-bold text-slate-900">
                            ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            {typeof job.postedBy === 'object' ? job.postedBy?.name : 'Unknown'}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${job.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                              {job.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/jobs/${job._id}`}
                                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all shadow-sm"
                                title="View"
                              >
                                <HiEye className="text-base" />
                              </Link>
                              <button
                                onClick={() => handleDeleteJob(job._id, job.title)}
                                className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition-all shadow-sm cursor-pointer"
                                title="Delete"
                              >
                                <HiTrash className="text-base" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(jobsData?.jobs || []).length === 0 && (
                  <div className="text-center py-16 text-slate-500 text-sm">No jobs found.</div>
                )}

                {jobsData?.total > 0 && (
                  <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
                    Showing {jobsData.jobs.length} of {jobsData.total} jobs
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ ALL USERS TAB ═══════════════════ */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search */}
            <div className="relative max-w-md">
              <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#6C5CE7] shadow-sm transition-all"
              />
            </div>

            {usersLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="rounded-2xl glass-card border border-slate-200/80 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80">
                        <th className="py-4 px-6">User</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Role</th>
                        <th className="py-4 px-6">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {(usersData?.users || []).map((u: any) => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6C5CE7&color=fff`}
                                alt={u.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                              />
                              <span className="font-bold text-slate-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600 text-sm">{u.email}</td>
                          <td className="py-4 px-6">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                              u.role === 'admin'
                                ? 'bg-violet-50 text-[#6C5CE7] border-violet-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(usersData?.users || []).length === 0 && (
                  <div className="text-center py-16 text-slate-500 text-sm">No users found.</div>
                )}

                {usersData?.total > 0 && (
                  <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
                    Showing {usersData.users.length} of {usersData.total} users
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ APPLICATIONS TAB ═══════════════════ */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setAppFilter(s)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    appFilter === s
                      ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white shadow-md shadow-[#6C5CE7]/20'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm'
                  }`}
                >
                  {s === 'all' ? <HiDocumentText /> : statusIcons[s]}
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {appsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="rounded-2xl glass-card border border-slate-200/80 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80">
                        <th className="py-4 px-6">Applicant</th>
                        <th className="py-4 px-6">Job Applied</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {(appsData?.applications || []).map((app: any) => (
                        <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={app.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.userId?.name || 'U')}&background=6C5CE7&color=fff`}
                                alt={app.userId?.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{app.userId?.name || 'Unknown'}</p>
                                <p className="text-xs text-slate-500">{app.userId?.email || ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{app.jobId?.title || 'Deleted Job'}</p>
                              <p className="text-xs text-[#6C5CE7] font-semibold">{app.jobId?.company || ''}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${statusColors[app.status] || ''}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {app.status !== 'reviewed' && (
                                <button
                                  onClick={() => statusMutation.mutate({ id: app._id, status: 'reviewed' })}
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all cursor-pointer"
                                  title="Mark Reviewed"
                                >
                                  <HiEye className="text-sm" />
                                </button>
                              )}
                              {app.status !== 'accepted' && (
                                <button
                                  onClick={() => statusMutation.mutate({ id: app._id, status: 'accepted' })}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer"
                                  title="Accept"
                                >
                                  <HiCheckCircle className="text-sm" />
                                </button>
                              )}
                              {app.status !== 'rejected' && (
                                <button
                                  onClick={() => statusMutation.mutate({ id: app._id, status: 'rejected' })}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                                  title="Reject"
                                >
                                  <HiXCircle className="text-sm" />
                                </button>
                              )}
                              {app.status !== 'pending' && (
                                <button
                                  onClick={() => statusMutation.mutate({ id: app._id, status: 'pending' })}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                                  title="Reset to Pending"
                                >
                                  <HiArrowPath className="text-sm" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(appsData?.applications || []).length === 0 && (
                  <div className="text-center py-16 text-slate-500 text-sm">No applications found.</div>
                )}

                {appsData?.total > 0 && (
                  <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
                    Showing {appsData.applications.length} of {appsData.total} applications
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
