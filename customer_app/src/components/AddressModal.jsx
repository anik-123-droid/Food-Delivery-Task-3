import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';

export default function AddressModal({ isOpen, onClose }) {
  const { user, updateAddress } = useAuth();

  const presets = [
    { title: 'Home', address: '123 Maple St, Tech Park, Suite 404', icon: 'home' },
    { title: 'Work / Office', address: 'Building 7, Cyber City, Phase 2, Floor 5', icon: 'work' },
    { title: 'Other', address: 'Flat 302, Green Valley Heights, MG Road', icon: 'location_on' },
  ];

  const [selectedPreset, setSelectedPreset] = useState(user?.address || presets[0].address);
  const [customAddress, setCustomAddress] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const finalAddress = isCustomMode && customAddress.trim() ? customAddress.trim() : selectedPreset;
    updateAddress(finalAddress);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-[#FAF7EE] dark:bg-[#1C261A] rounded-3xl p-5 w-full max-w-sm border border-[#E2D8C3] dark:border-slate-800 shadow-2xl flex flex-col gap-4 animate-scale-up text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-[#E2D8C3] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-2xl">location_on</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Change Delivery Address</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Address Options */}
        <div className="flex flex-col gap-2.5">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Saved Addresses</p>
          {presets.map((item, idx) => {
            const isSelected = !isCustomMode && selectedPreset === item.address;
            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedPreset(item.address);
                  setIsCustomMode(false);
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-[#3A5A40] bg-[#F2E8CF]/60 dark:bg-[#283618]/50 shadow-xs'
                    : 'border-[#E2D8C3] dark:border-slate-800 bg-white/70 dark:bg-slate-800/60 hover:bg-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#3A5A40] text-[#F2E8CF]' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.address}</p>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-lg font-bold">check_circle</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Address Input Option */}
        <div className="flex flex-col gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="text-xs font-extrabold text-[#3A5A40] dark:text-[#A3B18A] flex items-center gap-1 hover:underline text-left"
          >
            <span className="material-symbols-outlined text-base">add_location_alt</span>
            <span>+ Add / Enter Custom Address</span>
          </button>

          {isCustomMode && (
            <textarea
              placeholder="Enter full address (Flat, Building, Street, Landmark, Pincode)..."
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-[#3A5A40] bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none h-20 resize-none mt-1 shadow-inner"
            ></textarea>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-[#E2D8C3] dark:border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-2xl bg-[#3A5A40] hover:bg-[#283618] text-[#F2E8CF] font-bold text-xs shadow-lg shadow-[#3A5A40]/25 transition-transform active:scale-95"
          >
            Save & Deliver Here
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
