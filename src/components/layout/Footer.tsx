import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedinIn, FaTwitter, FaFacebookF } from 'react-icons/fa';
import { HiEnvelope as EnvelopeIcon, HiPhone as PhoneIcon, HiMapPin as MapIcon } from 'react-icons/hi2';

const Footer = () => {
  const categories = [
    'Technology',
    'Finance',
    'Marketing',
    'Healthcare',
    'Design',
    'Engineering',
  ];

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/80 pt-16 pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] flex items-center justify-center text-white shadow-md shadow-[#6C5CE7]/20">
                <span className="font-black text-lg font-heading">J</span>
              </div>
              <span className="text-xl font-black tracking-tight font-heading gradient-text">
                JobNest
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Connecting talent with opportunity. Find your dream job or hire the perfect candidate with JobNest's automated candidate-employer alignment system.
            </p>
            <div className="flex space-x-3 pt-2">
              {[
                { icon: <FaGithub />, link: '#' },
                { icon: <FaLinkedinIn />, link: '#' },
                { icon: <FaTwitter />, link: '#' },
                { icon: <FaFacebookF />, link: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-[#6C5CE7] hover:text-[#6C5CE7] text-slate-500 flex items-center justify-center hover:bg-violet-50 transition-all duration-200 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 font-heading">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'Browse Jobs', path: '/jobs' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Login Portal', path: '/login' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-600 hover:text-[#6C5CE7] transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Job Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 font-heading">
              Popular Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/jobs?category=${cat}`}
                    className="text-slate-600 hover:text-[#6C5CE7] transition-colors duration-150"
                  >
                    {cat} Jobs
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 font-heading">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-3">
                <MapIcon className="text-lg text-[#00D2D3] shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-600">
                  123 Innovation Drive,
                  <br />
                  San Francisco, CA 94105
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="text-lg text-[#00D2D3] shrink-0" />
                <span className="text-slate-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <EnvelopeIcon className="text-lg text-[#00D2D3] shrink-0" />
                <span className="text-slate-600">support@jobnest.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/80 pt-8 text-center flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 JobNest. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-800">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800">Terms of Service</a>
            <a href="#" className="hover:text-slate-800">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
