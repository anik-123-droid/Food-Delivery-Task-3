import React from 'react';

export default function UserRewards({ onNavigate }) {
  return (
    <div className="flex-1 pb-24 bg-[#FAF7EE] dark:bg-[#12161A] px-4 py-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-black text-[#1C241B] dark:text-white font-headline leading-tight">
            BiteDash Rewards
          </h2>
          <p className="text-xs text-[#4E5A4D] dark:text-slate-400 font-medium">
            Earn Sage Points with every order & unlock exclusive rewards!
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#A3B18A]/20 text-[#3A5A40] dark:text-[#A3B18A] flex items-center justify-center font-bold text-xl">
          ✨
        </div>
      </div>

      {/* Main Loyalty Card */}
      <div className="bg-gradient-to-br from-[#1C261A] via-[#283618] to-[#344E41] rounded-3xl p-5 text-[#FAF7EE] shadow-lg space-y-4 mb-5 relative overflow-hidden border border-[#A3B18A]/20">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#A3B18A]/25 text-[#F2E8CF] px-2.5 py-0.5 rounded-full border border-[#A3B18A]/30">
              VIP Member Status
            </span>
            <h3 className="text-2xl font-black font-headline mt-1">320 Sage Points</h3>
          </div>
          <span className="text-3xl">🌿</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-[#FAF7EE]/90">
            <span>Progress to Gold Tier Reward</span>
            <span>320 / 500 Points</span>
          </div>
          <div className="w-full bg-black/25 h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div className="bg-[#A3B18A] h-full rounded-full w-[64%] transition-all duration-500 shadow-sm"></div>
          </div>
        </div>

        <p className="text-xs text-[#FAF7EE]/90 leading-relaxed font-medium">
          Order ₹180 more to unlock your <strong>Free Artisanal Dessert Reward</strong>!
        </p>

        <button
          onClick={() => onNavigate('home')}
          className="w-full bg-[#F2E8CF] hover:bg-white text-[#283618] font-extrabold text-xs py-3 rounded-2xl shadow-md active:scale-98 transition-transform flex items-center justify-center gap-1.5"
        >
          <span>Order Now to Earn Points</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#4E5A4D] dark:text-slate-400">
          Available Unlockable Rewards
        </h3>

        {[
          {
            title: 'Sage Treat: Free Artisan Beverage or Chai',
            desc: 'Unlock at 200 Points',
            status: 'Claimed',
            icon: '☕',
          },
          {
            title: 'Gold Reward: Free Starter or Gourmet Wrap',
            desc: 'Unlock at 500 Points',
            status: 'In Progress',
            icon: '🌯',
          },
          {
            title: 'Platinum Feast: Free Chef Special Combo Platter',
            desc: 'Unlock at 1000 Points',
            status: 'Locked',
            icon: '🍱',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#1E242B] rounded-2xl p-3.5 border border-[#A3B18A]/20 dark:border-slate-800 shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E7ECE0] dark:bg-slate-800 text-xl flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#1C241B] dark:text-white">{item.title}</h4>
                <p className="text-[11px] text-[#4E5A4D] dark:text-slate-400 font-medium">{item.desc}</p>
              </div>
            </div>

            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#E7ECE0] text-[#283618] dark:bg-slate-800 dark:text-slate-400">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
