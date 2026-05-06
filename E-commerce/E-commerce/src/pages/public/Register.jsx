import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiCheck, HiOutlineEye, HiOutlineEyeOff, HiExclamationCircle, HiCheckCircle } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToastCtx } from '../../context/ToastContext';

const getStrength = (p) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};

const FloatingInput = memo(({ id, label, type = 'text', value, onChange, valid, errorMsg, rightOffset = 'right-0' }) => {
  const isError = !valid && value.length > 0;
  return (
    <div className="relative pt-2 pb-2">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer w-full border-b-2 bg-transparent py-2.5 text-sm focus:outline-none transition-colors ${
          isError ? 'border-red-400 text-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500 text-primary'
        } ${rightOffset === 'right-8' ? 'pr-10' : ''}`}
      />
      <label htmlFor={id} className={`absolute left-0 top-2.5 text-sm transition-all origin-left pointer-events-none peer-focus:-translate-y-4 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 ${
        isError ? 'text-red-500' : 'text-gray-400 peer-focus:text-amber-500'
      }`}>
        {label}
      </label>
      <div className={`absolute ${rightOffset} top-3`}>
        {value.length > 0 && (
          valid ? <HiCheckCircle className="w-5 h-5 text-green-500" /> : <HiExclamationCircle className="w-5 h-5 text-red-500" />
        )}
      </div>
      {isError && <p className="text-xs text-red-500 mt-1 absolute -bottom-3">{errorMsg}</p>}
    </div>
  );
});

const Register = () => {
  const { register } = useAuth();
  const { show } = useToastCtx();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isNameValid = form.name.length === 0 || form.name.trim().length >= 2;
  const isEmailValid = form.email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.length === 0 || form.password.length >= 8;
  const isConfirmValid = form.confirm.length === 0 || form.password === form.confirm;

  const strength = getStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500'][strength];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) return;
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) return;

    setLoading(true);
    setTimeout(() => {
      const result = register(form.name, form.email, form.password);
      if (result.success) { 
        show('Account created! Welcome to ShopLux!', 'success'); 
        navigate('/'); 
      } else { 
        show(result.error, 'error'); 
      }
      setLoading(false);
    }, 1000);
  };

  const handleSocial = (e) => {
    e.preventDefault();
    show('Social login coming soon!', 'info');
  };

  const handleNameChange = useCallback((e) => {
    setForm(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleEmailChange = useCallback((e) => {
    setForm(prev => ({ ...prev, email: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setForm(prev => ({ ...prev, password: e.target.value }));
  }, []);

  const handleConfirmChange = useCallback((e) => {
    setForm(prev => ({ ...prev, confirm: e.target.value }));
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#0A1628] to-[#1a2e4a] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Abstract Amber Blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 animate-blob animation-delay-4000"></div>

        <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 relative z-10 w-fit">
          ← Back to Store
        </Link>
        <div className="max-w-md mx-auto w-full animate-fadeInUp opacity-0 relative z-10" style={{ animationFillMode: 'forwards' }}>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 leading-tight">"Shop smarter, live better."</h2>
          
          <ul className="space-y-6 mt-12">
            <li className="flex items-center gap-4 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <HiCheck className="text-amber-400 w-5 h-5" />
              </div>
              <span className="font-medium">Curated luxury collections</span>
            </li>
            <li className="flex items-center gap-4 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <HiCheck className="text-amber-400 w-5 h-5" />
              </div>
              <span className="font-medium">Priority customer support</span>
            </li>
            <li className="flex items-center gap-4 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <HiCheck className="text-amber-400 w-5 h-5" />
              </div>
              <span className="font-medium">Free shipping on all orders</span>
            </li>
          </ul>

          <div className="mt-16 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-[#1a2e4a] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-[#1a2e4a] object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-[#1a2e4a] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="User" />
              <div className="w-10 h-10 rounded-full border-2 border-[#1a2e4a] bg-gray-800 flex items-center justify-center text-xs font-bold">+</div>
            </div>
            <p className="text-sm font-medium text-gray-300">Join 100k+ shoppers</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 relative z-10">© 2026 ShopLux. All rights reserved.</div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12 relative bg-white">
        <Link to="/" className="lg:hidden absolute top-6 left-6 text-sm font-medium text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
          ← Back to Store
        </Link>

        <div className="max-w-md w-full mx-auto animate-fadeInUp opacity-0 animate-delay-120" style={{ animationFillMode: 'forwards' }}>
          <div className="flex justify-center mb-8">
            <Link to="/" className="w-12 h-12 bg-[#0A1628] rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <span className="text-amber-400 font-heading font-bold text-xl">S</span>
            </Link>
          </div>
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-primary mb-2">Create Account</h1>
            <p className="text-gray-500">Enter your details below to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingInput
              id="name" label="Full Name" value={form.name}
              onChange={handleNameChange} valid={isNameValid} errorMsg="Name is required"
            />
            <FloatingInput
              id="email" label="Email Address" type="email" value={form.email}
              onChange={handleEmailChange} valid={isEmailValid} errorMsg="Valid email required"
            />

            <div className="relative pt-2 pb-2">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={form.password}
                onChange={handlePasswordChange}
                placeholder=" "
                className={`peer w-full border-b-2 bg-transparent py-2.5 pr-16 text-sm focus:outline-none transition-colors ${
                  !isPasswordValid && form.password ? 'border-red-400 text-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500 text-primary'
                }`}
              />
              <label htmlFor="password" className={`absolute left-0 top-2.5 text-sm transition-all origin-left pointer-events-none peer-focus:-translate-y-4 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 ${
                !isPasswordValid && form.password ? 'text-red-500' : 'text-gray-400 peer-focus:text-amber-500'
              }`}>
                Password
              </label>
              <div className="absolute right-8 top-3">
                {form.password.length > 0 && (
                  isPasswordValid ? <HiCheckCircle className="w-5 h-5 text-green-500" /> : <HiExclamationCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-gray-400 hover:text-primary transition-colors focus:outline-none"
              >
                {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
              </button>
              {!isPasswordValid && form.password && <p className="text-xs text-red-500 mt-1 absolute -bottom-3">Min. 8 characters required</p>}
            </div>

            {form.password && (
              <div className="pt-2 animate-fadeIn">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-gray-100'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Strength: <span className="font-semibold text-gray-700">{strengthLabel}</span></p>
              </div>
            )}

            <div className="relative pt-2 pb-2">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirm"
                value={form.confirm}
                onChange={handleConfirmChange}
                placeholder=" "
                className={`peer w-full border-b-2 bg-transparent py-2.5 pr-10 text-sm focus:outline-none transition-colors ${
                  !isConfirmValid && form.confirm ? 'border-red-400 text-red-500 focus:border-red-500' : 'border-gray-200 focus:border-amber-500 text-primary'
                }`}
              />
              <label htmlFor="confirm" className={`absolute left-0 top-2.5 text-sm transition-all origin-left pointer-events-none peer-focus:-translate-y-4 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 ${
                !isConfirmValid && form.confirm ? 'text-red-500' : 'text-gray-400 peer-focus:text-amber-500'
              }`}>
                Confirm Password
              </label>
              <div className="absolute right-0 top-3">
                {form.confirm.length > 0 && (
                  isConfirmValid ? <HiCheckCircle className="w-5 h-5 text-green-500" /> : <HiExclamationCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              {!isConfirmValid && form.confirm && <p className="text-xs text-red-500 mt-1 absolute -bottom-3">Passwords do not match</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !form.name || !form.email || !form.password || !form.confirm || !isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid}
              className="w-full bg-[#0A1628] text-white font-semibold py-4 rounded-2xl hover:bg-amber-500 hover:text-[#0A1628] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:hover:bg-[#0A1628] disabled:hover:text-white flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <button onClick={handleSocial} className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              <FcGoogle className="w-5 h-5" /> Google
            </button>
            <button onClick={handleSocial} className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              <FaApple className="w-5 h-5" /> Apple
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#0A1628] hover:text-amber-500 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
