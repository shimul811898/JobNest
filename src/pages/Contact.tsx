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
    <div className="min-h-screen bg-[#0f0f1a] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 text-[#9580f3] text-xs font-semibold">
            Get in Touch
          </span>
          <h1 className="text-4xl font-extrabold font-heading text-slate-100">
            We'd Love to Hear <span className="gradient-text">From You</span>
          </h1>
          <p className="text-slate-400 text-sm">
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
              <div key={idx} className="p-6 rounded-2xl glass border border-white/5 flex gap-4 items-start hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200 font-heading mb-1">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 p-8 rounded-2xl glass border border-white/5">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <HiCheckCircle className="text-5xl text-[#00D2D3] animate-bounce" />
                <h3 className="text-xl font-bold text-slate-200 font-heading">Message Sent!</h3>
                <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                  Thank you for reaching out. We have logged your support request and will follow up shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5a3fd9] text-white text-sm font-semibold transition-all duration-150"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-[#6C5CE7]/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-[#6C5CE7]/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Feedback / Inquiry / Help"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-[#6C5CE7]/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your note here..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-[#6C5CE7]/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-[#6C5CE7]/20 hover:opacity-95"
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
