import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserProfile({ onNavigate }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('welcome');
  };

  return (
    <div className="flex-1 pb-24 bg-surface dark:bg-surface-dim px-4 py-4 overflow-y-auto">
      {/* Profile Card Header */}
      <div className="bg-surface-container rounded-3xl p-5 border border-outline-variant/30 shadow-md text-center relative overflow-hidden mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#283618] via-[#3A5A40] to-[#588157] text-[#F2E8CF] flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-lg shadow-[#3A5A40]/30">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h2 className="font-headline font-extrabold text-lg text-on-surface">{user?.name || 'Guest User'}</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">{user?.email || 'Not logged in'}</p>
        <p className="text-xs text-on-surface-variant font-mono mt-0.5">{user?.phone || '+91 98765 43210'}</p>
        <span className="inline-block mt-2 bg-[#A3B18A]/25 text-[#283618] dark:text-[#E7ECE0] text-[11px] font-extrabold px-3 py-0.5 rounded-full border border-[#A3B18A]/40">
          BiteDash Member ⭐
        </span>
      </div>

      {/* Account Settings List */}
      <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-sm space-y-2 mb-4">
        <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-2 px-2">
          Saved Details
        </h3>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-variant/30 border border-outline-variant/20">
          <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A]">location_on</span>
          <div>
            <h4 className="font-bold text-xs text-on-surface">Delivery Address</h4>
            <p className="text-xs text-on-surface-variant">{user?.address || '123 Maple St, Tech Park'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-variant/30 border border-outline-variant/20">
          <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A]">call</span>
          <div>
            <h4 className="font-bold text-xs text-on-surface">Registered Mobile</h4>
            <p className="text-xs text-on-surface-variant">{user?.phone || '+91 98765 43210'}</p>
          </div>
        </div>
      </div>

      {/* Auth Action */}
      {user?.isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="w-full bg-error/10 hover:bg-error/20 text-error font-bold py-3 rounded-2xl border border-error/20 flex items-center justify-center gap-2 text-xs transition-colors"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Log Out of Account</span>
        </button>
      ) : (
        <button
          onClick={() => onNavigate('login')}
          className="w-full bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] hover:opacity-95 text-[#F2E8CF] font-bold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs transition-colors"
        >
          <span className="material-symbols-outlined text-base">login</span>
          <span>Sign In / Register</span>
        </button>
      )}
    </div>
  );
}
