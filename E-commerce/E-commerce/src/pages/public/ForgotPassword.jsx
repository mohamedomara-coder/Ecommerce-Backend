import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToastCtx } from '../../context/ToastContext';

const ForgotPassword = () => {
  const { show } = useToastCtx();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    show('Password reset link sent to your email!', 'success');
  };

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
          <h1 className="font-heading text-4xl font-bold text-primary mb-2">Forgot Password?</h1>
          <p className="text-gray-500">We'll send a reset link to your email</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="font-heading font-semibold text-xl text-primary mb-2">Check your inbox</h3>
              <p className="text-gray-500 text-sm mb-6">We sent a reset link to <strong>{email}</strong></p>
              <Link to="/login" className="text-accent font-semibold hover:underline">← Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email Address</label>
                <input type="email" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all bg-gray-50"
                  placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl hover:bg-accent hover:text-primary active:scale-[0.98] transition-all duration-300">
                Send Reset Link
              </button>
              <p className="text-center text-sm text-gray-500">
                <Link to="/login" className="text-accent hover:underline">← Back to Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
