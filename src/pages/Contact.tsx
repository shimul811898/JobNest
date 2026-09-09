import { useState } from 'react';
import { HiMapPin, HiPhone, HiEnvelope, HiCheckCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      toast.success('Your message has been sent successfully!');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      toast.error('Please fill in all required fields.');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-[#6C5CE7] text-xs font-bold shadow-sm">
            Get in Touch
          </span>
          <h1 className="text-4xl font-black font-heading text-slate-900">
            We'd Love to Hear <span className="gradient-text">From You</span>
          </h1>
          <p className="text-slate-600 text-sm">
            Have questions about posting jobs, managing application logs, or account verification? Submit the contact form below and our team will respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4 lg:col-span-1">
            {[
              { title: 'Visit Our HQ', text: '123 Innovation Drive, Suite 400, San Francisco, CA 94105', icon: <HiMapPin className="text-2xl text-[#00D2D3]" /> },
              { title: 'Call Our Helpline', text: '+1 (555) 123-4567 (Mon-Fri, 9am - 6pm PST)', icon: <HiPhone className="text-2xl text-[#6C5CE7]" /> },
              { title: 'Email Support', text: 'support@jobnest.com / sales@jobnest.com', icon: <HiEnvelope className="text-2xl text-[#00D2D3]" /> }
            ].map((card, idx) => (
              <div key={idx} className="p-6 rounded-2xl glass-card border border-slate-200/80 flex gap-4 items-start shadow-md">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading mb-1">{card.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 p-8 rounded-3xl glass-card border border-slate-200/80 shadow-xl shadow-slate-100">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <HiCheckCircle className="text-5xl text-[#00D2D3] animate-bounce" />
                <h3 className="text-xl font-bold text-slate-900 font-heading">Message Sent!</h3>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                  Thank you for reaching out. We have logged your support request and will follow up shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white text-sm font-semibold transition-all shadow-md shadow-[#6C5CE7]/20 cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-[#6C5CE7] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-[#6C5CE7] shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Feedback / Inquiry / Help"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-[#6C5CE7] shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your note here..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-[#6C5CE7] resize-none shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white py-3.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-md shadow-[#6C5CE7]/20 hover:opacity-95 cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
