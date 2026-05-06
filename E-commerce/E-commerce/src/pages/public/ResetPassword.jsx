import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastCtx } from '../../context/ToastContext';

const ResetPassword = () => {
  const { show } = useToastCtx();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { show('Passwords do not match.', 'error'); return; }
    if (form.password.length < 8) { show('Password must be at least 8 characters.', 'error'); return; }
    show('Password reset successfully!', 'success');
    navigate('/login');
  };

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all bg-gray-50';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      <div className="absolute top-0 left-0 p-6 z-10">
        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
          ← Back to Store
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
          <Link to="/" className="w-12 h-12 bg-[#0A1628] rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <span className="text-amber-400 font-heading font-bold text-xl">S</span>
          </Link>
        </div>
        <div className="text-center mb-8 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h1 className="font-heading text-4xl font-bold text-primary mb-2">Reset Password</h1>
          <p className="text-gray-500">Enter your new password below</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">New Password</label>
              <input type="password" required className={inputCls} placeholder="Min. 8 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Confirm Password</label>
              <input type="password" required className={inputCls} placeholder="Repeat password"
                value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-300">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
