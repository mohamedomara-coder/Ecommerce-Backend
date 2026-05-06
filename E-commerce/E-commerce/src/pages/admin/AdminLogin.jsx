import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToastCtx } from '../../context/ToastContext';

const AdminLogin = () => {
  const { login } = useAuth();
  const { show } = useToastCtx();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.success && result.user.role === 'admin') {
        show('Welcome, Admin!', 'success');
        navigate('/admin/dashboard');
      } else {
        show(result.success ? 'Access denied. Admin only.' : result.error, 'error');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 relative">
      <div className="absolute top-0 left-0 p-6 z-10">
        <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          ← Back to Store
        </Link>
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform inline-flex">
            <span className="text-primary font-heading font-bold text-xl">S</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-gray-500 text-sm">ShopLux Administration</p>
        </div>

        <div className="bg-[#1E293B] rounded-3xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email Address</label>
              <input type="email" required className="w-full px-4 py-3 bg-[#0F172A] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                placeholder="admin@store.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
              <input type="password" required className="w-full px-4 py-3 bg-[#0F172A] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-accent text-primary font-bold py-3.5 rounded-2xl hover:bg-amber-400 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 mt-2">
              {loading ? 'Signing in…' : 'Sign In to Admin'}
            </button>
          </form>
          <div className="mt-4 p-3 bg-white/5 rounded-xl text-xs text-gray-500">
            admin@store.com / Admin123!
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
