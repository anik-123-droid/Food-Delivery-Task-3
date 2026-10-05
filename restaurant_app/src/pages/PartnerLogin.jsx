import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';

export default function PartnerLogin({ onNavigate }) {
  const { loginPartner } = useRestaurant();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both restaurant email and password.');
      return;
    }
    const res = await loginPartner(email, password);
    if (!res || !res.success) {
      setError(res?.message || 'Kitchen account not registered! Please Register Kitchen first.');
      return;
    }
    onNavigate('dashboard');
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

        {/* Top Brand Logo & Partner Badge */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#A3B18A]/25 text-[#F2E8CF] px-3 py-1 rounded-full border border-[#A3B18A]/40 shadow-sm backdrop-blur-md">
              Kitchen Partner Portal
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#A3B18A]/20 backdrop-blur-md border border-[#A3B18A]/30 flex items-center justify-center shadow-lg mb-1 text-[#F2E8CF]">
            <span className="material-symbols-outlined text-2xl font-bold">restaurant</span>
          </div>
          <h2 className="text-[#FAF7EE] font-black text-xl tracking-wider uppercase font-headline">BiteDash Partner</h2>
        </div>
      </div>

      {/* Main Glassmorphism Cream Card Body */}
      <div className="bg-[#FAF7EE]/95 backdrop-blur-xl rounded-t-[36px] -mt-10 pt-8 px-6 pb-6 flex-1 flex flex-col justify-between shadow-2xl relative z-10 border-t border-[#E3DBC6]">
        <div>
          {/* Header Title inside Card */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-slate-800 font-headline tracking-tight">
              Partner Sign In
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Sign in to manage orders & menu items
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2 border border-red-200 shadow-sm">
              <span className="material-symbols-outlined text-base text-red-500">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Restaurant Email Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block pl-1">
                Restaurant E-mail
              </label>
              <div className="relative flex items-center bg-[#F2E8CF]/35 border border-[#DDD3BC] focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/15 rounded-2xl px-3.5 py-3 transition-all duration-200 shadow-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg mr-2.5">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="restaurant@domain.com"
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
                  onClick={() => alert('Please contact Partner Support (+91 98765 43210) to reset password.')}
                  className="text-xs font-semibold text-slate-500 hover:text-[#3A5A40] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Solid Sage Green Gradient SIGN IN Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#3A5A40] via-[#588157] to-[#344E41] text-[#F2E8CF] font-headline font-bold text-sm tracking-wider shadow-lg shadow-[#3A5A40]/30 hover:opacity-95 hover:scale-[1.01] active:scale-[0.98] transition-all mt-6 flex items-center justify-center gap-2"
            >
              <span>SIGN IN TO KITCHEN</span>
              <span className="material-symbols-outlined text-base">storefront</span>
            </button>
          </form>
        </div>

        {/* Footer Navigation Link */}
        <div className="pt-6 text-center border-t border-slate-100 mt-4">
          <p className="text-xs text-slate-500 font-medium">
            New Kitchen Partner?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-[#3A5A40] font-bold hover:underline ml-1"
            >
              Register Kitchen
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
