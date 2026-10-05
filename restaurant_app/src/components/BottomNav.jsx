import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { newOrdersCount } = useRestaurant();

  const navItems = [
    { id: 'dashboard', label: 'Orders', icon: 'receipt_long', badge: newOrdersCount, matchTabs: ['dashboard'] },
    { id: 'menu', label: 'Menu', icon: 'menu_book', matchTabs: ['menu'] },
    { id: 'offers', label: 'Ads & Offers', icon: 'campaign', matchTabs: ['offers'] },
    { id: 'analytics', label: 'Earning', icon: 'payments', matchTabs: ['analytics'] },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 pointer-events-none z-50 flex justify-center">
      <nav className="pointer-events-auto w-full max-w-[390px] bg-[#FAF7EE]/90 dark:bg-[#1C261A]/90 backdrop-blur-xl backdrop-saturate-180 border border-[#E3DAC3] dark:border-white/10 rounded-full px-3 py-2 flex justify-around items-center shadow-[0_12px_32px_rgba(28,36,27,0.12),inset_0_1px_1px_rgba(255,255,255,0.85)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300">
        {navItems.map((item) => {
          const isActive = item.matchTabs.includes(activeTab);
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 relative select-none group ${isActive
                  ? 'text-[#3A5A40] dark:text-[#A3B18A]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#3A5A40] dark:hover:text-[#A3B18A]'
                }`}
            >
              {/* Icon Wrapper */}
              <div className="relative flex flex-col items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[22px] transition-all duration-300 ${isActive ? 'scale-110 fill-1 font-bold text-[#3A5A40] dark:text-[#A3B18A]' : 'scale-100 group-hover:scale-105'
                    }`}
                >
                  {item.icon}
                </span>

                {/* Badge for New Orders */}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#3A5A40] text-[#F2E8CF] text-[9px] font-black min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center shadow-md border-2 border-[#FAF7EE] dark:border-slate-900 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label below */}
              <span
                className={`text-[10px] tracking-tight mt-0.5 transition-all duration-200 ${isActive ? 'font-black opacity-100 text-[#3A5A40] dark:text-[#A3B18A]' : 'font-medium opacity-70'
                  }`}
              >
                {item.label}
              </span>

              {/* Active Tab Dot Indicator */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#3A5A40] dark:bg-[#A3B18A] shadow-[0_0_8px_rgba(58,90,64,0.9)] dark:shadow-[0_0_8px_rgba(163,177,138,0.9)] mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

