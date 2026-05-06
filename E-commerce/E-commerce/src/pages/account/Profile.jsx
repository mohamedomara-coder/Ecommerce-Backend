import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToastCtx } from '../../context/ToastContext';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { show } = useToastCtx();
  const [form, setForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', password: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) { show('Passwords do not match.', 'error'); return; }
    setSaving(true);
    setTimeout(() => {
      const updates = { name: form.name, email: form.email };
      if (form.password) updates.password = form.password;
      updateProfile(updates);
      show('Profile updated successfully!', 'success');
      setSaving(false);
      setForm((f) => ({ ...f, password: '', confirm: '' }));
    }, 500);
  };

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all bg-gray-50';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-4xl font-bold text-primary mb-8 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>My Profile</h1>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-heading font-bold text-2xl">
            {currentUser?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-heading font-bold text-xl text-primary">{currentUser?.name}</p>
            <p className="text-gray-500 text-sm">{currentUser?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-full capitalize">{currentUser?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="font-heading font-semibold text-lg text-primary">Edit Information</h2>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Full Name</label>
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email Address</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <hr className="border-gray-100" />
          <h2 className="font-heading font-semibold text-lg text-primary">Change Password</h2>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">New Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span></label>
            <input type="password" className={inputCls} placeholder="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Confirm Password</label>
            <input type="password" className={inputCls} placeholder="Confirm new password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-300 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
