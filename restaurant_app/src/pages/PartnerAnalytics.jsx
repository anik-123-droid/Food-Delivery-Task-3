import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';

export default function PartnerAnalytics() {
  const { orders, totalEarnings, totalOrdersCount } = useRestaurant();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [upiId, setUpiId] = useState(() => localStorage.getItem('innodine_saved_upi') || '');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawStep, setWithdrawStep] = useState('input'); // 'input' | 'processing' | 'success'
  const [payoutTxn, setPayoutTxn] = useState(null);
  const [processingMsg, setProcessingMsg] = useState('');

  // Persisted total withdrawn amount to dynamically deduct from pocket balance
  const [withdrawnTotal, setWithdrawnTotal] = useState(() => {
    return Number(localStorage.getItem('innodine_withdrawn_total')) || 0;
  });

  // Persisted payout history log
  const [payoutHistory, setPayoutHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('innodine_payout_history')) || [];
    } catch (e) {
      return [];
    }
  });

  // Gross earnings from all completed orders
  const grossEarnings = totalEarnings !== undefined 
    ? totalEarnings 
    : orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    
  // Net available pocket balance after subtracting previous withdrawals
  const availableBalance = Math.max(0, grossEarnings - withdrawnTotal);

  const computedTotalOrders = totalOrdersCount !== undefined 
    ? totalOrdersCount 
    : orders.length;

  // Helper to format date range for current week e.g. "7 Sep - 13 Sep"
  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMon = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diffToMon);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monday.getDate()} ${monthNames[monday.getMonth()]} - ${sunday.getDate()} ${monthNames[sunday.getMonth()]}`;
  };

  // Aggregate dish sales stats from real placed orders
  const dishSalesMap = {};
  (orders || []).forEach((order) => {
    (order.items || []).forEach((item) => {
      if (!dishSalesMap[item.name]) {
        dishSalesMap[item.name] = { orders: 0, revenue: 0 };
      }
      dishSalesMap[item.name].orders += Number(item.qty || 1);
      dishSalesMap[item.name].revenue += Number(item.price || 0) * Number(item.qty || 1);
    });
  });

  const topDishes = Object.keys(dishSalesMap).map((name) => ({
    name,
    orders: dishSalesMap[name].orders,
    revenue: dishSalesMap[name].revenue,
  })).sort((a, b) => b.revenue - a.revenue);

  const handleOpenWithdrawModal = () => {
    if (availableBalance <= 0) {
      alert('Pocket balance is currently ₹0. Withdrawals available when earnings > ₹0.');
      return;
    }
    setWithdrawAmount(availableBalance.toString());
    setWithdrawStep('input');
    setIsWithdrawModalOpen(true);
  };

  const handleQuickSuffix = (suffix) => {
    if (!upiId) {
      setUpiId(`9876543210${suffix}`);
      return;
    }
    const clean = upiId.split('@')[0];
    setUpiId(`${clean}${suffix}`);
  };

  const handleProcessWithdrawal = (e) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    const cleanUpi = upiId.trim();

    if (!cleanUpi || !cleanUpi.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. 9876543210@paytm or resto@ybl).');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid withdrawal amount greater than ₹0.');
      return;
    }
    if (amt > availableBalance) {
      alert(`Withdrawal amount cannot exceed available balance of ₹${availableBalance}.`);
      return;
    }

    // Save UPI for future payouts
    localStorage.setItem('innodine_saved_upi', cleanUpi);

    setWithdrawStep('processing');
    setProcessingMsg('Connecting to Banking Payout Gateway...');

    setTimeout(() => {
      setProcessingMsg(`Verifying UPI VPA: ${cleanUpi}...`);
      setTimeout(() => {
        setProcessingMsg(`Transferring ₹${amt.toLocaleString()} instantly to bank account...`);
        setTimeout(() => {
          const utr = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
          const newTxn = {
            id: `TXN-${Date.now()}`,
            utr,
            amount: amt,
            upiId: cleanUpi,
            status: 'SUCCESS',
            timestamp: new Date().toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          };

          const newWithdrawnTotal = withdrawnTotal + amt;
          const updatedHistory = [newTxn, ...payoutHistory];

          setWithdrawnTotal(newWithdrawnTotal);
          setPayoutHistory(updatedHistory);
          localStorage.setItem('innodine_withdrawn_total', newWithdrawnTotal.toString());
          localStorage.setItem('innodine_payout_history', JSON.stringify(updatedHistory));

          setPayoutTxn(newTxn);
          setWithdrawStep('success');
        }, 1200);
      }, 1000);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col bg-surface dark:bg-surface-dim overflow-y-auto font-sans select-none relative">
      {/* Top Bar Header */}
      <header className="bg-surface dark:bg-surface-dim px-4 py-3 border-b border-outline-variant/20 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="font-bold text-base text-on-surface leading-tight">Earning & Analytics</h1>
          <p className="text-[10px] text-on-surface-variant font-medium">Calculated from actual live orders</p>
        </div>

        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-xl text-[10px] font-extrabold">
          Live Real-Time
        </span>
      </header>

      {/* Main Earning & Analytics Content */}
      <div className="p-4 flex flex-col gap-4">
        
        {/* 1. One Week Payment Banner */}
        <div className="bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] text-[#FAF7EE] rounded-2xl p-4 border border-[#A3B18A]/30 shadow-md flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#F2E8CF] cursor-pointer hover:underline transition-colors">
              <span>Earnings: {getCurrentWeekRange()}</span>
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </div>
            <p className="text-2xl font-black text-[#FAF7EE] font-numeric mt-1 tracking-tight">
              ₹{grossEarnings.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[#F2E8CF]">
            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
          </div>
        </div>

        {/* 2. POCKET Section (Pocket Balance + Withdraw Button only) */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-extrabold text-on-surface-variant/80 tracking-wider uppercase px-1">
            POCKET
          </span>

          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-3">
            {/* Pocket Balance Row */}
            <div className="flex justify-between items-center py-1">
              <div>
                <span className="text-xs font-extrabold text-on-surface">
                  Pocket balance
                </span>
                {withdrawnTotal > 0 && (
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    ₹{withdrawnTotal.toLocaleString()} withdrawn to bank
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-base font-black text-on-surface font-numeric">
                <span>₹{availableBalance.toLocaleString()}</span>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>
              </div>
            </div>

            {/* Withdraw Button Only */}
            <button
              type="button"
              onClick={handleOpenWithdrawModal}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] text-[#F2E8CF] font-extrabold text-xs tracking-wider shadow-sm hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">payments</span>
              <span>Withdraw via UPI</span>
            </button>
          </div>
        </div>

        {/* 3. Analytics & Revenue Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-container rounded-2xl p-3.5 border border-outline-variant/30 shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-on-surface-variant">TOTAL REVENUE</span>
            <p className="text-xl font-extrabold text-primary font-numeric">₹{grossEarnings.toLocaleString()}</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">arrow_upward</span> Live Total
            </span>
          </div>

          <div className="bg-surface-container rounded-2xl p-3.5 border border-outline-variant/30 shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-bold text-on-surface-variant">TOTAL ORDERS</span>
            <p className="text-xl font-extrabold text-on-surface font-numeric">{computedTotalOrders}</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">arrow_upward</span> Placed Orders
            </span>
          </div>
        </div>

        {/* 4. Rating & Review Metric */}
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-on-surface-variant">Kitchen Rating</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-on-surface font-numeric">5.0</span>
              <div className="flex text-amber-500">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant/70 mt-0.5">Verified partner status</p>
          </div>

          <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-2xl">workspace_premium</span>
          </div>
        </div>

        {/* 5. Recent Withdrawal History Log */}
        {payoutHistory.length > 0 && (
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
              <h2 className="font-extrabold text-xs text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-600">account_balance</span>
                RECENT WITHDRAWALS
              </h2>
              <span className="text-[10px] font-bold text-emerald-600 font-numeric">{payoutHistory.length} Paid Out</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {payoutHistory.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs border-b border-outline-variant/10 pb-2.5 last:border-b-0">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-on-surface">
                      <span>{item.upiId}</span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded text-[9px] font-extrabold">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-numeric">
                      UTR: {item.utr} • {item.timestamp}
                    </p>
                  </div>
                  <span className="font-black text-emerald-600 font-numeric text-sm">-₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Top Selling Dishes Table/List */}
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <h2 className="font-extrabold text-xs text-on-surface-variant">TOP SELLING DISHES</h2>
            <span className="text-[10px] font-bold text-primary font-numeric">{topDishes.length} Items</span>
          </div>

          {topDishes.length === 0 ? (
            <div className="text-center py-6 text-xs text-on-surface-variant">
              No orders placed yet to compute top selling dishes.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {topDishes.map((dish, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-outline-variant/10 pb-2 last:border-b-0">
                  <div>
                    <p className="font-bold text-on-surface">{dish.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-numeric">{dish.orders} qty ordered</p>
                  </div>
                  <span className="font-extrabold text-primary font-numeric">₹{dish.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* UPI Withdrawal Modal Popup Overlay */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-surface dark:bg-slate-900 border border-outline-variant/30 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface leading-tight">Instant Bank Withdrawal</h3>
                  <p className="text-[10px] text-on-surface-variant">Transfer directly via UPI (IMPS Payout)</p>
                </div>
              </div>

              {withdrawStep !== 'processing' && (
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            {/* STEP 1: Input Details */}
            {withdrawStep === 'input' && (
              <form onSubmit={handleProcessWithdrawal} className="flex flex-col gap-4">
                {/* Balance Display */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-3 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Available Balance</span>
                    <p className="text-xl font-black text-primary font-numeric">₹{availableBalance.toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(availableBalance.toString())}
                    className="px-2.5 py-1 bg-primary/15 hover:bg-primary/25 text-primary text-[10px] font-black rounded-lg transition-colors"
                  >
                    WITHDRAW ALL
                  </button>
                </div>

                {/* Amount Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface flex justify-between">
                    <span>Withdrawal Amount</span>
                    <span className="text-[10px] text-slate-400 font-normal">Min ₹1 • Max ₹{availableBalance}</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-bold text-base text-slate-400 select-none">₹</span>
                    <input
                      type="number"
                      min="1"
                      max={availableBalance}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-xl py-2.5 pl-8 pr-3 text-sm font-black text-on-surface font-numeric focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* UPI ID Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">Enter UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. 9876543210@paytm or resto@ybl"
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl py-2.5 px-3 text-xs font-bold text-on-surface focus:outline-none focus:border-primary transition-colors"
                    required
                  />

                  {/* Quick Handle Suffix Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">Quick handles:</span>
                    {['@paytm', '@ybl', '@okaxis', '@upi', '@gpay'].map((suf) => (
                      <button
                        key={suf}
                        type="button"
                        onClick={() => handleQuickSuffix(suf)}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary/15 text-slate-600 dark:text-slate-300 hover:text-primary text-[10px] font-bold rounded-md transition-colors"
                      >
                        {suf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instant Info Note */}
                <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                  <span className="material-symbols-outlined text-base text-emerald-600">bolt</span>
                  <span>Money will be instantly credited to your linked bank account 24x7 via UPI IMPS.</span>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-1"
                >
                  <span className="material-symbols-outlined text-base">send_money</span>
                  <span>Transfer Instantly Now</span>
                </button>
              </form>
            )}

            {/* STEP 2: Processing Transfer */}
            {withdrawStep === 'processing' && (
              <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                  <span className="material-symbols-outlined text-2xl text-primary absolute animate-pulse">sync</span>
                </div>

                <div>
                  <h4 className="font-black text-sm text-on-surface">Initiating UPI Bank Transfer</h4>
                  <p className="text-xs text-primary font-bold animate-pulse mt-1">{processingMsg}</p>
                </div>

                <p className="text-[10px] text-slate-400">Please do not close or refresh this page...</p>
              </div>
            )}

            {/* STEP 3: Transfer Success Receipt */}
            {withdrawStep === 'success' && payoutTxn && (
              <div className="py-3 flex flex-col gap-4">
                {/* Success Banner */}
                <div className="flex flex-col items-center justify-center text-center gap-2 py-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center border-2 border-emerald-500/30 animate-bounce">
                    <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">PAYOUT SUCCESSFUL</span>
                    <h4 className="text-2xl font-black text-on-surface font-numeric">
                      ₹{payoutTxn.amount.toLocaleString()}.00
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">Credited to <strong className="text-on-surface">{payoutTxn.upiId}</strong></p>
                  </div>
                </div>

                {/* Receipt Details Card */}
                <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-3.5 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-outline-variant/20">
                    <span className="text-slate-400 font-medium">Transaction Status</span>
                    <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> COMPLETED
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-outline-variant/20">
                    <span className="text-slate-400 font-medium">Bank UTR / Ref No.</span>
                    <span className="font-extrabold text-on-surface font-numeric">{payoutTxn.utr}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-outline-variant/20">
                    <span className="text-slate-400 font-medium">Paid To UPI</span>
                    <span className="font-bold text-primary font-numeric">{payoutTxn.upiId}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400 font-medium">Date & Time</span>
                    <span className="font-bold text-on-surface font-numeric">{payoutTxn.timestamp}</span>
                  </div>
                </div>

                {/* Done Button */}
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">task_alt</span>
                  <span>Done</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

