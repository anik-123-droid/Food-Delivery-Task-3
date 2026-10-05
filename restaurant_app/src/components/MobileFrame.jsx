import React from 'react';

export default function MobileFrame({ children, bottomNav }) {
  return (
    <div className="min-h-screen bg-[#182017] dark:bg-[#0E140D] flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* Clean Centered Rectangle Mobile View */}
      <div className="w-full max-w-[430px] h-screen sm:h-[880px] sm:max-h-[96vh] bg-[#FAF7EE] dark:bg-surface-dim sm:rounded-3xl sm:shadow-2xl sm:border border-[#A3B18A]/30 flex flex-col overflow-hidden relative">
        {/* Inner Content Area */}
        <div className={`flex-1 overflow-y-auto hide-scrollbar scroll-smooth flex flex-col text-on-surface bg-[#FAF7EE] dark:bg-surface font-sans ${bottomNav ? 'pb-24' : ''}`}>
          {children}
        </div>

        {bottomNav}
      </div>
    </div>
  );
}

