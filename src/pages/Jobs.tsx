import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/jobs/JobCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { type JobCategory, type JobType, type ExperienceLevel } from '../types';
import { 
  HiMagnifyingGlass as SearchIcon, 
  HiChevronLeft as LeftIcon, 
  HiChevronRight as RightIcon, 
  HiFunnel as FunnelIcon,
  HiXMark as CloseIcon 
} from 'react-icons/hi2';

const categories: JobCategory[] = [
  'Technology', 'Finance', 'Marketing', 'Healthcare', 'Education', 'Design', 'Sales', 'Engineering', 'Legal', 'Other'
];
const types: JobType[] = ['Remote', 'Onsite', 'Hybrid'];
const experiences: ExperienceLevel[] = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Director'];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [maxSalary, setMaxSalary] = useState(searchParams.get('maxSalary') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setType(searchParams.get('type') || '');
    setExperience(searchParams.get('experience') || '');
    setMinSalary(searchParams.get('minSalary') || '');
    setMaxSalary(searchParams.get('maxSalary') || '');
    setSort(searchParams.get('sort') || 'newest');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Fetch Jobs
  const { data, isLoading } = useJobs({
    search,
    category,
    type,
    experience,
    minSalary: minSalary ? Number(minSalary) : undefined,
    maxSalary: maxSalary ? Number(maxSalary) : undefined,
    sort,
    page,
    limit: 8
  });

  const updateUrlParams = (updates: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, String(val));
      }
    });
    // Reset page to 1 when changing filters
    if (!updates.page && updates.page !== 1) {
      newParams.delete('page');
      setPage(1);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search });
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setType('');
    setExperience('');
    setMinSalary('');
    setMaxSalary('');
    setSort('newest');
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const jobsList = data?.jobs || [];
  const totalPages = data?.totalPages || 1;
  const totalJobsCount = data?.total || 0;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Search header banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card border border-slate-200/80 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-lg shadow-slate-100">
          <div className="space-y-1 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">Explore Careers</h1>
            <p className="text-xs sm:text-sm text-slate-500">Discover and apply to verified professional opportunities.</p>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-2.5 max-w-md w-full relative z-10 shrink-0">
            <div className="flex items-center bg-white border border-slate-200 focus-within:border-[#6C5CE7] rounded-xl px-3 py-2.5 w-full transition-all shadow-sm">
              <SearchIcon className="text-slate-400 mr-2 shrink-0 text-lg" />
              <input
                type="text"
                placeholder="Search job titles or companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-slate-800 placeholder-slate-400 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-95 shadow-md shadow-[#6C5CE7]/20 transition-all shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block p-6 rounded-2xl glass-card border border-slate-200/80 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h3 className="font-bold font-heading text-slate-900 flex items-center gap-1.5 text-sm">
                <FunnelIcon className="text-lg text-[#6C5CE7]" /> Filters
              </h3>
              <button 
                onClick={handleClearFilters}
                className="text-[11px] uppercase font-bold text-slate-400 hover:text-[#6C5CE7] transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => updateUrlParams({ category: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-[#6C5CE7] shadow-sm cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Job Type</label>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => updateUrlParams({ type: type === t ? '' : t })}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      type === t
                        ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white border-transparent shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => updateUrlParams({ experience: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-[#6C5CE7] shadow-sm cursor-pointer"
              >
                <option value="">All Levels</option>
                {experiences.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Salary (Min / Max)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min USD"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  onBlur={() => updateUrlParams({ minSalary })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-[#6C5CE7] shadow-sm"
                />
                <input
                  type="number"
                  placeholder="Max USD"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  onBlur={() => updateUrlParams({ maxSalary })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none focus:border-[#6C5CE7] shadow-sm"
                />
              </div>
            </div>
          </aside>

          {/* Results Grid + Sorting */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="flex justify-between items-center glass-card border border-slate-200/80 rounded-2xl px-5 py-3.5 shadow-sm">
              <span className="text-xs text-slate-600 font-medium">
                Showing <strong className="text-slate-900 font-bold">{totalJobsCount}</strong> jobs
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 text-xs bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 shadow-sm"
                >
                  <FunnelIcon className="text-sm text-[#6C5CE7]" /> Filters
                </button>

                <select
                  value={sort}
                  onChange={(e) => updateUrlParams({ sort: e.target.value })}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#6C5CE7] shadow-sm cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="salary_high">Salary: High to Low</option>
                  <option value="salary_low">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {/* Jobs Cards Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
              ) : jobsList.length === 0 ? (
                <div className="col-span-full py-16 text-center space-y-3 glass-card rounded-3xl border border-slate-200/80 shadow-md">
                  <p className="text-slate-900 text-lg font-bold font-heading">No listings matches found</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">Try refining your search keyword, category, location, or clearing filter values.</p>
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 mt-4 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                jobsList.map((job) => <JobCard key={job._id} job={job} />)
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-200/80">
                <button
                  disabled={page === 1}
                  onClick={() => updateUrlParams({ page: page - 1 })}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                >
                  <LeftIcon className="text-sm" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateUrlParams({ page: pNum })}
                      className={`w-9 h-9 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        page === pNum
                          ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] border-transparent text-white shadow-md shadow-[#6C5CE7]/30'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={page === totalPages}
                  onClick={() => updateUrlParams({ page: page + 1 })}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                >
                  <RightIcon className="text-sm" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Filter Dialog */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          
          <aside className="w-80 h-full bg-white/95 backdrop-blur-xl border-l border-slate-200 p-6 relative z-10 flex flex-col justify-between shadow-2xl animate-fade-in">
            <div className="space-y-6 overflow-y-auto pr-1 flex-1">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className="font-bold font-heading text-slate-900 flex items-center gap-1.5 text-sm">
                  <FunnelIcon className="text-[#6C5CE7]" /> Filters
                </h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500">
                  <CloseIcon className="text-base" />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => updateUrlParams({ category: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => updateUrlParams({ type: type === t ? '' : t })}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                        type === t
                          ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white border-transparent'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Experience Level</label>
                <select
                  value={experience}
                  onChange={(e) => updateUrlParams({ experience: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none"
                >
                  <option value="">All Levels</option>
                  {experiences.map((exp) => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Salary (Min / Max)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    onBlur={() => updateUrlParams({ minSalary })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    onBlur={() => updateUrlParams({ maxSalary })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 flex gap-3 mt-4 shrink-0">
              <button
                onClick={handleClearFilters}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/20"
              >
                Apply
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Jobs;
