import { useState } from 'react';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import { useToastCtx } from '../../context/ToastContext';

const Contact = () => {
  const { show } = useToastCtx();
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      show('Message sent successfully! We will get back to you soon.', 'success');
      setForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Column */}
        <div className="w-full lg:w-5/12 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">Get in Touch</h1>
          <p className="text-gray-500 text-lg mb-10">Have a question or need assistance? We're here to help. Reach out to us through any of the channels below.</p>
          
          <div className="space-y-6 mb-12">
            {/* Info Cards */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <HiOutlineLocationMarker className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Address</h3>
                <p className="text-sm text-gray-500">123 Commerce Street<br />New York, NY 10001</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <HiOutlinePhone className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Phone</h3>
                <p className="text-sm text-gray-500">+1 800 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <HiOutlineMail className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Email</h3>
                <p className="text-sm text-gray-500">support@shoplux.com</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-3">Business Hours</h3>
            <p className="text-sm text-gray-500 mb-1">Monday - Friday: 9am - 6pm EST</p>
            <p className="text-sm text-gray-500">Saturday - Sunday: Closed</p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-7/12 animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input 
                  type="text" required
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input 
                  type="email" required
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <select 
                  value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors appearance-none"
                >
                  <option>General Inquiry</option>
                  <option>Order Issue</option>
                  <option>Returns</option>
                  <option>Product Question</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea 
                  required rows="5"
                  value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full py-4 mt-2 bg-[#0A1628] text-white font-semibold rounded-xl hover:bg-amber-500 transition-colors duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
