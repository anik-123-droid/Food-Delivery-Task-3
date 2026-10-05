import React from 'react';

export default function PartnerWelcome({ onNavigate }) {
  return (
    <div className="flex-1 flex flex-col justify-between min-h-full bg-gradient-to-b from-[#283618] via-[#1E2819] to-[#121A10] text-[#F2E8CF] relative overflow-hidden font-playfair select-none px-6 py-10">
      {/* Decorative Sage & Cream Blur Orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#A3B18A]/20 blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-[#588157]/25 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-10 w-64 h-64 rounded-full bg-[#F2E8CF]/15 blur-2xl pointer-events-none"></div>

      {/* Animated Top-Right Dish (Smooth entry spin and graceful stop, pure plate only) */}
      <div className="absolute -top-12 -right-16 w-56 h-56 z-20 pointer-events-none animate-dish-spin-stop-tr">
        <div className="w-full h-full rounded-full shadow-[0_20px_45px_rgba(0,0,0,0.7)] overflow-hidden flex items-center justify-center border-2 border-[#A3B18A]/30">
          <img 
            src="/spinning_dish.jpg" 
            alt="Welcome Top Dish" 
            className="w-full h-full object-cover rounded-full scale-[1.22]"
          />
        </div>
      </div>

      {/* Animated Bottom-Left Dish (Smaller, outer corner placed, pure plate only) */}
      <div className="absolute -bottom-10 -left-12 w-44 h-44 z-20 pointer-events-none animate-dish-spin-stop-bl">
        <div className="w-full h-full rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.7)] overflow-hidden flex items-center justify-center border-2 border-[#A3B18A]/30">
          <img 
            src="/spinning_dish.jpg" 
            alt="Welcome Bottom Dish" 
            className="w-full h-full object-cover rounded-full scale-[1.22]"
          />
        </div>
      </div>

      {/* Center Branding & Premium 3D Logo */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 my-auto py-6">
        {/* Partner Logo Container */}
        <div className="mb-8 flex flex-col items-center">
          <img 
            src="/bitedash_logo.jpg" 
            alt="BiteDash Logo" 
            className="w-24 h-24 object-contain rounded-2xl drop-shadow-2xl mb-3 hover:scale-105 transition-transform"
          />
          <div className="flex items-center gap-2">
            <h1 className="font-playfair font-black text-3xl text-[#FAF7EE] tracking-tight italic">
              Bite<span className="text-[#A3B18A]">Dash</span>
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#A3B18A]/25 text-[#F2E8CF] px-2.5 py-0.5 rounded-full border border-[#A3B18A]/40 font-sans">
              Partner
            </span>
          </div>
          <p className="text-xs text-[#F2E8CF]/80 tracking-widest uppercase font-semibold mt-1 font-playfair">Kitchen & Restaurant Management</p>
        </div>

        {/* Welcome Back Heading */}
        <h2 className="font-playfair text-3xl font-extrabold text-[#FAF7EE] tracking-wide mb-8 italic">
          Welcome Back
        </h2>

        {/* Auth Buttons */}
        <div className="w-full max-w-xs space-y-4">
          {/* SIGN IN Outline Button */}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full py-3.5 px-6 rounded-full border border-[#A3B18A]/70 text-[#F2E8CF] font-playfair font-bold text-sm tracking-wider hover:bg-[#A3B18A]/15 active:scale-[0.98] transition-all shadow-md backdrop-blur-xs"
          >
            SIGN IN
          </button>

          {/* SIGN UP Solid Cream Button */}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="w-full py-3.5 px-6 rounded-full bg-[#F2E8CF] text-[#283618] font-playfair font-black text-sm tracking-wider hover:bg-white active:scale-[0.98] transition-all shadow-xl"
          >
            SIGN UP
          </button>
        </div>
      </div>

      {/* Social Media Login Footer Section */}
      <div className="z-10 text-center pt-4 pb-4">
        <p className="text-xs text-[#F2E8CF]/75 font-medium tracking-wide mb-4 font-playfair">
          Login with Social Media
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-10 h-10 rounded-full bg-[#FAF7EE]/10 hover:bg-[#FAF7EE]/20 border border-[#A3B18A]/30 flex items-center justify-center text-[#F2E8CF] transition-all active:scale-95 shadow-md"
            title="Instagram"
          >
            <span className="material-symbols-outlined text-lg">photo_camera</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-10 h-10 rounded-full bg-[#FAF7EE]/10 hover:bg-[#FAF7EE]/20 border border-[#A3B18A]/30 flex items-center justify-center text-[#F2E8CF] transition-all active:scale-95 shadow-md"
            title="Twitter"
          >
            <span className="material-symbols-outlined text-lg">tag</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-10 h-10 rounded-full bg-[#FAF7EE]/10 hover:bg-[#FAF7EE]/20 border border-[#A3B18A]/30 flex items-center justify-center text-[#F2E8CF] transition-all active:scale-95 shadow-md"
            title="Facebook"
          >
            <span className="material-symbols-outlined text-lg">public</span>
          </button>
        </div>
      </div>
    </div>
  );
}
