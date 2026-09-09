import { HiSparkles as SparkleIcon, HiCpuChip as ChipIcon, HiHeart as HeartIcon, HiShieldCheck as ShieldIcon } from 'react-icons/hi2';

const About = () => {
  const values = [
    {
      title: 'Integrity First',
      description: 'We verify every listing and candidate profile to maintain a secure, spam-free ecosystem for career advancement.',
      icon: <ShieldIcon className="text-xl text-[#00D2D3]" />
    },
    {
      title: 'Technology Powered',
      description: 'We build modern interfaces and APIs to simplify search queries, filters, applications, and portal management.',
      icon: <ChipIcon className="text-xl text-[#6C5CE7]" />
    },
    {
      title: 'Growth Centered',
      description: 'We connect job seekers and employers to accelerate recruitment speed, professional development, and project scaling.',
      icon: <SparkleIcon className="text-xl text-[#00D2D3]" />
    },
    {
      title: 'People Centric',
      description: 'We design experiences that respect candidate options, protect personal logs, and humanize digital recruitment.',
      icon: <HeartIcon className="text-xl text-[#6C5CE7]" />
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Intro Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-[#6C5CE7] text-xs font-bold shadow-sm">
            Our Story & Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-slate-900 leading-tight">
            Simplifying Recruitment with <span className="gradient-text">JobNest</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Founded in 2026, JobNest was created to address the friction of modern corporate hiring. Our platform provides clean architectures, verified listings, and robust tools to bridge the gap between talented job seekers and industry-leading teams.
          </p>
        </div>

        {/* Values Section */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-black font-heading text-slate-900">Our Core Values</h2>
            <p className="text-slate-500 text-sm mt-2">The operational concepts guiding our feature developments and community choices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="p-6 rounded-2xl glass-card border border-slate-200/80 space-y-4 shadow-md">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">{val.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="rounded-3xl glass-card border border-slate-200/80 p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="space-y-2 py-4 md:py-0">
              <p className="text-4xl font-black text-[#00D2D3] font-heading">24+</p>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">Active Job Openings</p>
              <p className="text-xs text-slate-500">Verifiably updated hourly</p>
            </div>
            <div className="space-y-2 py-4 md:py-0">
              <p className="text-4xl font-black text-[#6C5CE7] font-heading">94%</p>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">Candidate Success Rate</p>
              <p className="text-xs text-slate-500">Securing screening calls within 14 days</p>
            </div>
            <div className="space-y-2 py-4 md:py-0">
              <p className="text-4xl font-black text-[#00D2D3] font-heading">20+</p>
              <p className="text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">Partnered Companies</p>
              <p className="text-xs text-slate-500">From emerging startups to enterprise platforms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
