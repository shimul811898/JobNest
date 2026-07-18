import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateJob } from '../hooks/useJobs';
import toast from 'react-hot-toast';
import { type JobCategory, type JobType, type ExperienceLevel } from '../types';
import { HiPlus, HiChevronLeft } from 'react-icons/hi2';

const categories: JobCategory[] = [
  'Technology', 'Finance', 'Marketing', 'Healthcare', 'Education', 'Design', 'Sales', 'Engineering', 'Legal', 'Other'
];
const types: JobType[] = ['Remote', 'Onsite', 'Hybrid'];
const experiences: ExperienceLevel[] = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Director'];

const AddJob = () => {
  const navigate = useNavigate();
  const createJobMutation = useCreateJob();

  // Form Fields State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<JobCategory>('Technology');
  const [type, setType] = useState<JobType>('Remote');
  const [experience, setExperience] = useState<ExperienceLevel>('Mid Level');
  
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  
  const [requirementsInput, setRequirementsInput] = useState('');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !company || !location || !minSalary || !maxSalary || !shortDesc || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (Number(minSalary) > Number(maxSalary)) {
      toast.error('Minimum salary cannot exceed maximum salary');
      return;
    }

    const jobPayload = {
      title,
      company,
      location,
      category,
      type,
      experience,
      salary: {
        min: Number(minSalary),
        max: Number(maxSalary),
        currency: 'USD'
      },
      shortDescription: shortDesc.slice(0, 199),
      description,
      companyLogo: companyLogo || undefined,
      requirements: requirementsInput.split('\n').map(r => r.trim()).filter(Boolean),
      responsibilities: responsibilitiesInput.split('\n').map(r => r.trim()).filter(Boolean),
      skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean)
    };

    setSubmitting(true);
    try {
      await createJobMutation.mutateAsync(jobPayload);
      navigate('/jobs/manage');
    } catch (err) {
      // error handled in mutation
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <HiChevronLeft className="text-sm" /> Back
        </button>

        {/* Card wrapper */}
        <div className="p-8 rounded-3xl glass border border-white/5 space-y-8 shadow-xl">
          <div className="border-b border-white/5 pb-5">
            <h1 className="text-2xl font-black font-heading text-slate-100 flex items-center gap-2">
              <HiPlus className="text-[#00D2D3]" /> Post a New Job
            </h1>
            <p className="text-xs text-slate-400 mt-1">Specify detailed career requirements to connect with verified candidates.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1: Title & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TechVista Inc"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40"
                />
              </div>
            </div>

            {/* Row 2: Location & Logo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Logo (URL)</label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={companyLogo}
                  onChange={(e) => setCompanyLogo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40"
                />
              </div>
            </div>

            {/* Row 3: Category, Type & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as JobCategory)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-slate-300 outline-none focus:border-[#6C5CE7]/40"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0f0f1a]">{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Work Mode *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as JobType)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-slate-300 outline-none focus:border-[#6C5CE7]/40"
                >
                  {types.map((t) => (
                    <option key={t} value={t} className="bg-[#0f0f1a]">{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience *</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-slate-300 outline-none focus:border-[#6C5CE7]/40"
                >
                  {experiences.map((exp) => (
                    <option key={exp} value={exp} className="bg-[#0f0f1a]">{exp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Salary Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Min Salary (USD / year) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 80000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Salary (USD / year) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 120000"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40"
                />
              </div>
            </div>

            {/* Row 5: Short Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Short Description *</label>
              <input
                type="text"
                required
                maxLength={200}
                placeholder="Brief summary showing in job cards (max 200 characters)..."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40"
              />
            </div>

            {/* Row 6: Full Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Job Description *</label>
              <textarea
                required
                rows={6}
                placeholder="Describe roles, day-to-day work, team context, and full specification details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40 resize-none"
              />
            </div>

            {/* Row 7: Skills (Comma separated) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Skills (comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, AWS, Node.js"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40"
              />
            </div>

            {/* Row 8: Requirements (Line-by-line) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Requirements (One per line)</label>
              <textarea
                rows={3}
                placeholder="5+ years of React experience&#10;BS degree in Computer Science&#10;Excellent communication skills"
                value={requirementsInput}
                onChange={(e) => setRequirementsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40 resize-none"
              />
            </div>

            {/* Row 9: Responsibilities (Line-by-line) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Responsibilities (One per line)</label>
              <textarea
                rows={3}
                placeholder="Develop reusable UI component packages&#10;Collaborate with API backend designers&#10;Conduct code reviews and lint checks"
                value={responsibilitiesInput}
                onChange={(e) => setResponsibilitiesInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-[#6C5CE7]/40 resize-none"
              />
            </div>

            {/* Form actions */}
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => navigate('/jobs/manage')}
                className="w-full py-3.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-bold text-sm hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-[#6C5CE7]/20 hover:opacity-95 disabled:opacity-50 transition-all"
              >
                {submitting ? 'Posting Listing...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJob;
