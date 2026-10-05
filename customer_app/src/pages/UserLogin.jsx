import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserLogin({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }
    const res = await login(email, password);
    if (!res || !res.success) {
      setError(res?.message || 'Account not found! Please Sign Up first.');
      return;
    }
    onNavigate('home');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#182017] min-h-full font-sans justify-between overflow-y-auto select-none relative">
      {/* Top Hero Food Imagery Header Banner */}
      <div className="relative h-56 w-full overflow-hidden flex flex-col justify-between p-6">
        {/* Background Image with Dark Vignette & Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.85]"
          style={{ backgroundImage: `url('/hero_food_bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#283618]/85 via-[#344E41]/80 to-[#182017]" />

        {/* Top Brand Logo & Subtitle */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-4">
          <div className="w-12 h-12 rounded-full bg-[#A3B18A]/20 backdrop-blur-md border border-[#A3B18A]/30 flex items-center justify-center shadow-lg mb-2 text-[#F2E8CF]">
            <span className="material-symbols-outlined text-2xl font-bold">soup_kitchen</span>
          </div>
          <h2 className="text-[#FAF7EE] font-black text-xl tracking-wider uppercase font-headline">BiteDash</h2>
          <p className="text-[#F2E8CF]/80 text-[10px] uppercase font-bold tracking-widest mt-0.5">Delivering Joy</p>
        </div>
      </div>

      {/* Main Glassmorphism Cream Card Body */}
      <div className="bg-[#FAF7EE]/95 backdrop-blur-xl rounded-t-[36px] -mt-10 pt-8 px-6 pb-6 flex-1 flex flex-col justify-between shadow-2xl relative z-10 border-t border-[#E3DBC6]">
        <div>
          {/* Header Title inside Card */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-slate-800 font-headline tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Please sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2 border border-red-200 shadow-sm">
              <span className="material-symbols-outlined text-base text-red-500">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with Glass/Rounded Styling & Left Icon */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block pl-1">
                Email Address
              </label>
              <div className="relative flex items-center bg-[#F2E8CF]/35 border border-[#DDD3BC] focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/15 rounded-2xl px-3.5 py-3 transition-all duration-200 shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg mr-2.5">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password Field with Toggle */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block pl-1">
                Password
              </label>
              <div className="relative flex items-center bg-[#F2E8CF]/35 border border-[#DDD3BC] focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/15 rounded-2xl px-3.5 py-3 transition-all duration-200 shadow-sm">
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

              {/* Forgot Password Link */}
              <div className="text-right pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-semibold text-slate-500 hover:text-[#3A5A40] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Solid Sage Green Gradient SIGN IN Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#3A5A40] via-[#588157] to-[#344E41] text-[#F2E8CF] font-headline font-bold text-sm tracking-wider shadow-lg shadow-[#3A5A40]/30 hover:opacity-95 hover:scale-[1.01] active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2"
            >
              <span>SIGN IN</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </form>

          {/* Social Sign-In Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[11px] text-slate-400 font-medium">Or sign in with</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Social Buttons (Google & Apple) */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => alert('Google Sign-in simulation successful!')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google
            </button>
            <button 
              type="button"
              onClick={() => alert('Apple Sign-in simulation successful!')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 fill-current text-slate-800" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.81 1.44-.61.71-1.14 1.86-.99 2.96 1.07.08 2.16-.55 2.81-1.36z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>

        {/* Footer Navigation Link */}
        <div className="pt-6 text-center border-t border-slate-100 mt-4">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-[#3A5A40] font-bold hover:underline ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
