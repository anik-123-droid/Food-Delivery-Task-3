import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';

export default function PartnerDashboard({ onNavigate }) {
  const {
    isOnline,
    toggleOnlineStatus,
    restaurantName,
    orders,
    newOrdersCount,
    updateOrderStatus,
    acceptAllNewOrders,
    isMuted,
    handleToggleMute,
    todayEarnings,
    todayOrdersCount,
    totalEarnings,
    totalOrdersCount
  } = useRestaurant();

  // Date Mode: 'today', 'yesterday', 'custom'
  const [dateMode, setDateMode] = useState('today');

  // Format today's YYYY-MM-DD for date picker default
  const getTodayISO = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const [customDate, setCustomDate] = useState(getTodayISO());
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'New', 'Preparing', 'Ready', 'Delivered'

  // Helper to check if order matches target date
  const matchesDate = (placedAt, targetDateObj) => {
    if (!placedAt) return false;
    const orderDate = new Date(placedAt).toDateString();
    return orderDate === targetDateObj.toDateString();
  };

  // Helper to get active target date object based on dateMode
  const getActiveTargetDate = () => {
    if (dateMode === 'today') return new Date();
    if (dateMode === 'yesterday') {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      return y;
    }
    if (dateMode === 'custom' && customDate) {
      const [year, month, day] = customDate.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  };

  const activeTargetDate = getActiveTargetDate();

  // Helper to check if order is placed today
  const isToday = (placedAt) => matchesDate(placedAt, new Date());

  // Helper to check if order is placed yesterday
  const isYesterday = (placedAt) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return matchesDate(placedAt, y);
  };

  // Helper to format date display for order card
  const getOrderDateLabel = (placedAt, timeStr) => {
    if (!placedAt) return timeStr || 'Recent';
    if (isToday(placedAt)) return `Today, ${timeStr || new Date(placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (isYesterday(placedAt)) return `Yesterday, ${timeStr || new Date(placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const d = new Date(placedAt);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}, ${timeStr || d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // 1. Filter orders by selected Date Mode
  const dateFilteredOrders = orders.filter((o) => matchesDate(o.placedAt, activeTargetDate));

  // 2. Filter orders by Status
  const filteredOrders = activeFilter === 'All'
    ? dateFilteredOrders
    : dateFilteredOrders.filter(o => o.status === activeFilter);

  // Dynamic Sales & Orders Count for Selected Date View
  const displaySales = dateFilteredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const displayCount = dateFilteredOrders.length;

  // Header Title for Performance Card
  const getPerformanceHeaderTitle = () => {
    if (dateMode === 'today') return "Today's Kitchen Performance";
    if (dateMode === 'yesterday') return "Yesterday's Kitchen Performance";
    return `${activeTargetDate.getDate()} ${activeTargetDate.toLocaleString('default', { month: 'short' })} Kitchen Performance`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'bg-coral-orange/15 text-coral-orange border-coral-orange/30 animate-pulse font-extrabold';
      case 'Preparing':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'Ready':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'Delivered':
        return 'bg-slate-500/15 text-slate-600 border-slate-400/30';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-surface dark:bg-surface-dim overflow-y-auto">
      {/* Top Bar Header */}
      <header className="bg-surface dark:bg-surface-dim px-4 py-3 border-b border-outline-variant/20 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        {/* Clickable Top-Left Restaurant Name Header -> Navigates directly to Profile Page */}
        <div 
          onClick={() => onNavigate && onNavigate('profile')}
          className="flex items-center gap-2 cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800/60 p-1 px-1.5 rounded-xl transition-all select-none"
          title="Click to view & edit Restaurant Profile"
        >
          <div className="w-8 h-8 rounded-full bg-primary-container/15 flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-primary text-xl">restaurant</span>
          </div>
          <div>
            <div className="flex items-center gap-0.5">
              <h1 className="font-bold text-sm text-on-surface leading-tight truncate max-w-[130px] group-hover:text-primary transition-colors">{restaurantName}</h1>
              <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-primary">chevron_right</span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-medium">Partner Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Mute Toggle Button */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Order Alarm' : 'Mute Order Alarm'}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              isMuted
                ? 'bg-slate-200 text-slate-500 border-slate-300'
                : 'bg-amber-50 text-amber-600 border-amber-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* Modern ONLINE / OFFLINE Visual Toggle Switch Slider */}
          <div
            onClick={toggleOnlineStatus}
            title={isOnline ? "Click to set Kitchen OFFLINE" : "Click to set Kitchen ONLINE"}
            className={`relative w-[84px] h-[30px] rounded-full p-1 cursor-pointer transition-colors duration-300 select-none shadow-inner flex items-center ${
              isOnline
                ? 'bg-[#10B981] border border-emerald-600'
                : 'bg-[#D1D5DB] border border-slate-300'
            }`}
          >
            {/* ONLINE / OFFLINE Text Label */}
            <span
              className={`absolute text-[9px] font-extrabold tracking-wider transition-all duration-300 ${
                isOnline
                  ? 'left-2.5 text-white'
                  : 'right-2 text-slate-600'
              }`}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>

            {/* Sliding White Knob Circle */}
            <div
              className={`w-[22px] h-[22px] rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                isOnline ? 'translate-x-[54px]' : 'translate-x-0'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-slate-400'}`} />
            </div>
          </div>
        </div>
      </header>

      {/* RINGTONE LIVE ORDER ALERT BANNER (Shows when unaccepted orders exist) */}
      {newOrdersCount > 0 && (
        <div className="bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] text-[#FAF7EE] p-3 px-4 shadow-lg flex items-center justify-between animate-pulse sticky top-[57px] z-25 border-b-2 border-[#A3B18A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF7EE] text-[#283618] flex items-center justify-center shrink-0 shadow-md animate-bounce">
              <span className="material-symbols-outlined text-lg">notifications_active</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-black uppercase tracking-wider">🔔 Ringing: {newOrdersCount} New Order{newOrdersCount > 1 ? 's' : ''}!</p>
                <span className="text-[9px] bg-white/25 px-1.5 py-0.2 rounded font-mono">Continuous Alarm</span>
              </div>
              <p className="text-[10px] text-[#FAF7EE]/90">Ringtone will ring until you accept the order</p>
            </div>
          </div>

          <button
            onClick={acceptAllNewOrders}
            className="bg-[#F2E8CF] text-[#283618] font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md hover:bg-white active:scale-95 transition-all shrink-0 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Accept All</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 flex flex-col gap-4">
        {/* Dynamic Performance Summary Card for Selected Date */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-800 dark:text-white">
              {getPerformanceHeaderTitle()}
            </span>
            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">Kitchen Summary</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#A3B18A]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-lg">trending_up</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 font-extrabold">
                  {dateMode === 'today' ? "Today's Sales" : dateMode === 'yesterday' ? "Yesterday's Sales" : "Sales"}
                </p>
                <p className="text-base font-extrabold text-slate-900 dark:text-white font-numeric">₹{displaySales.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#A3B18A]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-lg">shopping_bag</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 font-extrabold">
                  {dateMode === 'today' ? "Today's Orders" : dateMode === 'yesterday' ? "Yesterday's Orders" : "Total Orders"}
                </p>
                <p className="text-base font-extrabold text-slate-900 dark:text-white font-numeric">{displayCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector Filter Bar (Today, Yesterday, Select Date Picker) */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 pl-2">Filter:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDateMode('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateMode === 'today'
                  ? 'bg-[#3A5A40] text-[#F2E8CF] shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              🌟 Today
            </button>
            <button
              type="button"
              onClick={() => setDateMode('yesterday')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateMode === 'yesterday'
                  ? 'bg-[#3A5A40] text-[#F2E8CF] shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              📅 Yesterday
            </button>

            {/* Custom Date Picker Pill Button */}
            <div 
              className={`relative flex items-center px-2 py-1 rounded-xl text-xs font-bold transition-all border ${
                dateMode === 'custom'
                  ? 'bg-[#3A5A40] text-[#F2E8CF] border-[#3A5A40] shadow-xs'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-sm mr-1 shrink-0">calendar_month</span>
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setCustomDate(e.target.value);
                    setDateMode('custom');
                  }
                }}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer w-24"
                style={{ colorScheme: dateMode === 'custom' ? 'dark' : 'auto' }}
              />
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {['All', 'New', 'Preparing', 'Ready', 'Delivered'].map((filter) => {
            const count = filter === 'All'
              ? dateFilteredOrders.length
              : dateFilteredOrders.filter(o => o.status === filter).length;
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
                }`}
              >
                {filter === 'New' && count > 0 && <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping mr-1"></span>}
                {filter} ({count})
              </button>
            );
          })}
        </div>

        {/* Live Orders List */}
        <div className="flex flex-col gap-3">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-1 block">receipt_long</span>
              <p className="font-medium text-slate-500">
                {dateMode === 'today'
                  ? 'No incoming orders for today yet'
                  : dateMode === 'yesterday'
                  ? 'No orders found for yesterday'
                  : `No orders found for selected date (${customDate})`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-surface-container rounded-2xl p-3.5 border shadow-sm flex flex-col gap-2.5 relative animate-page-enter ${
                  order.status === 'New'
                    ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20'
                    : 'border-outline-variant/30'
                }`}
              >
                {/* Order Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-on-surface font-mono">{order.id}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-primary font-numeric">₹{order.total}</span>
                    <p className="text-[10px] text-on-surface-variant/70 mt-0.5 font-numeric">
                      {getOrderDateLabel(order.placedAt, order.time)}
                    </p>
                  </div>
                </div>

                {/* Delivery / Table Tag */}
                <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant bg-surface-variant/40 px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-xs">room</span>
                  <span>{order.tableOrDelivery}</span>
                </div>

                {/* Items Summary */}
                <div className="flex flex-col gap-1 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-on-surface">
                      <span><span className="font-bold text-primary font-numeric">{item.qty}x</span> {item.name}</span>
                      <span className="text-on-surface-variant font-medium font-numeric">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-1 pt-2 border-t border-outline-variant/20">
                  {order.status === 'New' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white font-extrabold text-xs shadow-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 animate-pulse"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Accept Order (Stop Ring)</span>
                    </button>
                  )}

                  {order.status === 'Preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Ready')}
                      className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm hover:bg-amber-700 transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-sm">done_all</span>
                      <span>Mark Ready for Pickup</span>
                    </button>
                  )}

                  {order.status === 'Ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      className="w-full py-2.5 rounded-xl bg-slate-700 text-white font-bold text-xs shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-sm">local_shipping</span>
                      <span>Handed Over / Delivered</span>
                    </button>
                  )}

                  {order.status === 'Delivered' && (
                    <div className="w-full py-1.5 text-center text-xs font-extrabold text-slate-500 bg-slate-500/10 rounded-xl">
                      Completed & Delivered ✓
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
