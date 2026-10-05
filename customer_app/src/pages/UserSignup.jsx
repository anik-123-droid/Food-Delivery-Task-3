import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserSignup({ onNavigate }) {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword && confirmPassword !== '') {
      setError('Passwords do not match.');
      return;
    }
    const res = signup(fullName, email, '', password);
    if (!res.success) {
      setError(res.message);
      return;
    }
    onNavigate('home');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#182017] min-h-full font-sans justify-between overflow-y-auto select-none relative">
      {/* Top Hero Food Imagery Header Banner */}
      <div className="relative h-48 w-full overflow-hidden flex flex-col justify-between p-6">
        {/* Background Image with Dark Vignette & Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.85]"
          style={{ backgroundImage: `url('/hero_food_bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#283618]/85 via-[#344E41]/80 to-[#182017]" />

        {/* Top Brand Logo & Subtitle */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-2">
          <div className="w-10 h-10 rounded-full bg-[#A3B18A]/20 backdrop-blur-md border border-[#A3B18A]/30 flex items-center justify-center shadow-lg mb-1 text-[#F2E8CF]">
            <span className="material-symbols-outlined text-xl font-bold">soup_kitchen</span>
          </div>
          <h2 className="text-[#FAF7EE] font-black text-lg tracking-wider uppercase font-headline">BiteDash</h2>
        </div>
      </div>

      {/* Main Glassmorphism Cream Card Body */}
      <div className="bg-[#FAF7EE]/95 backdrop-blur-xl rounded-t-[36px] -mt-8 pt-6 px-6 pb-6 flex-1 flex flex-col justify-between shadow-2xl relative z-10 border-t border-[#E3DBC6]">
        <div>
          {/* Header Title inside Card */}
          <div className="text-center mb-5">
            <h1 className="text-2xl font-extrabold text-slate-800 font-headline tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Join BiteDash & enjoy delicious meals delivered fast
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2 border border-red-200 shadow-sm">
              <span className="material-symbols-outlined text-base text-red-500">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                Full Name
              </label>
              <div className="relative flex items-center bg-[#F2E8CF]/35 border border-[#DDD3BC] focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/15 rounded-2xl px-3.5 py-2.5 transition-all duration-200 shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg mr-2.5">
                  person
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
                />
                {fullName.trim() !== '' && (
                  <span className="material-symbols-outlined text-[#3A5A40] text-lg font-bold ml-2">
                    check_circle
                  </span>
                )}
              </div>
            </div>

            {/* Phone or Gmail Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                Phone or Gmail
              </label>
              <div className="relative flex items-center bg-[#F2E8CF]/35 border border-[#DDD3BC] focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/15 rounded-2xl px-3.5 py-2.5 transition-all duration-200 shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg mr-2.5">
                  mail
                </span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
                />
                {email.trim() !== '' && (
                  <span className="material-symbols-outlined text-[#3A5A40] text-lg font-bold ml-2">
                    check_circle
                  </span>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                Password
              </label>
              <div className="relative flex items-center bg-[#F2E8CF]/35 border border-[#DDD3BC] focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/15 rounded-2xl px-3.5 py-2.5 transition-all duration-200 shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg mr-2.5">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 ml-2 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                Confirm Password
              </label>
              <div className="relative flex items-center bg-[#F2E8CF]/35 border border-[#DDD3BC] focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/15 rounded-2xl px-3.5 py-2.5 transition-all duration-200 shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg mr-2.5">
                  lock_reset
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 ml-2 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Solid Sage Green Gradient SIGN UP Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#3A5A40] via-[#588157] to-[#344E41] text-[#F2E8CF] font-headline font-bold text-sm tracking-wider shadow-lg shadow-[#3A5A40]/30 hover:opacity-95 hover:scale-[1.01] active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2"
            >
              <span>CREATE ACCOUNT</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </form>
        </div>

        {/* Footer Navigation Link */}
        <div className="pt-4 text-center border-t border-slate-100 mt-4">
          <p className="text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-[#3A5A40] font-bold hover:underline ml-1"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
