import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

export default function PartnerProfile({ onNavigate }) {
  const { partner, restaurantName, isOnline, toggleOnlineStatus, logoutPartner } = useRestaurant();

  const handleSignOut = () => {
    logoutPartner();
    onNavigate('welcome');
  };

  return (
    <div className="flex-1 flex flex-col bg-surface dark:bg-surface-dim overflow-y-auto">
      {/* Profile Header */}
      <div className="bg-surface-container p-6 text-center border-b border-outline-variant/30 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#283618] via-[#3A5A40] to-[#588157] text-[#F2E8CF] flex items-center justify-center shadow-lg shadow-[#3A5A40]/30 mb-3">
          <span className="material-symbols-outlined text-4xl">restaurant</span>
        </div>
        <h1 className="text-xl font-bold text-on-surface">{restaurantName}</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">Manager: {partner?.managerName || 'Kitchen Owner'}</p>
        <p className="text-[11px] text-on-surface-variant/80 font-mono mt-0.5">{partner?.email || 'partner@innodine.com'}</p>

        <div className="flex items-center gap-2 mt-3 bg-surface p-1.5 px-3 rounded-full border border-outline-variant/30">
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
          <span className="text-xs font-bold text-on-surface">{isOnline ? 'Kitchen Accepting Orders (Online)' : 'Kitchen Closed (Offline)'}</span>
          <button
            onClick={toggleOnlineStatus}
            className="ml-2 text-[10px] text-[#3A5A40] dark:text-[#A3B18A] font-extrabold hover:underline"
          >
            Switch
          </button>
        </div>
      </div>

      {/* Settings List */}
      <div className="p-4 flex flex-col gap-3">
        {/* Registration & License Details */}
        <div className="bg-surface-container rounded-2xl p-3.5 border border-outline-variant/30 shadow-sm flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Kitchen & License Details</span>

          <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Restaurant ID</span>
            <span className="font-bold text-on-surface font-mono">{partner?.id || 'RESTO-1'}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Cuisine Category</span>
            <span className="font-bold text-on-surface">{partner?.cuisine || 'Multi-Cuisine'}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">FSSAI License</span>
            <span className="font-bold text-on-surface font-numeric">{partner?.fssai || '11522003000841'}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Mobile Phone</span>
            <span className="font-bold text-on-surface font-numeric">{partner?.phone || '+91 98765 43210'}</span>
          </div>

          <div className="flex items-start justify-between text-xs py-1">
            <span className="text-on-surface-variant shrink-0 mr-2">Address</span>
            <span className="font-bold text-on-surface text-right">{partner?.address || '123 Food Street, Cyber Hub'}</span>
          </div>
        </div>

        {/* Onboarding & Payment Status */}
        <div className="bg-surface-container rounded-2xl p-3.5 border border-outline-variant/30 shadow-sm flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Onboarding & Payment</span>

          <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Registration Fee (₹500)</span>
            <span className="font-extrabold text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span>
              ₹500 Paid & Verified
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Transaction ID</span>
            <span className="font-bold text-on-surface text-[11px] font-mono">{partner?.paymentTxnId || 'TXN-INNO-500-INIT'}</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-on-surface-variant">Settlement Cycle</span>
            <span className="font-bold text-emerald-600">Real-Time Instant Bank</span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full py-3 bg-error/10 text-error border border-error/30 rounded-2xl font-bold text-xs hover:bg-error/20 transition-all flex items-center justify-center gap-1.5 mt-2 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out of Kitchen Portal
        </button>
      </div>
    </div>
  );
}
