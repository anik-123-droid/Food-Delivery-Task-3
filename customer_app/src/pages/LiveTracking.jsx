import React, { useState, useEffect } from 'react';
import { getOrders, subscribeToEvents } from '../services/store';
import { useAuth } from '../context/AuthContext';

export default function LiveTracking({ onNavigate }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const refreshOrders = () => {
      if (!user || !user.isLoggedIn || !user.email) {
        setOrders([]);
        return;
      }
      const allOrders = getOrders();
      const userOrders = allOrders.filter(
        (o) => o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()
      );
      setOrders(userOrders);
      if (selectedOrder) {
        const match = userOrders.find((o) => o.id === selectedOrder.id);
        if (match) setSelectedOrder(match);
      }
    };

    refreshOrders();

    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'NEW_ORDER_PLACED' || event.type === 'ORDER_STATUS_MUTATION' || event.type === 'CROSS_SYNC_MUTATION') {
        refreshOrders();
      }
    });

    return () => unsubscribe();
  }, [user?.email, user?.isLoggedIn, selectedOrder?.id]);

  const getStepIndex = (status) => {
    switch (status) {
      case 'New':
        return 0;
      case 'Preparing':
        return 1;
      case 'Ready':
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'New':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'Preparing':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Ready':
      case 'Out for Delivery':
        return 'bg-[#A3B18A]/25 text-[#283618] dark:text-[#E7ECE0] border-[#A3B18A]/40';
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/15 text-slate-600 border-slate-500/30';
    }
  };

  const trackingSteps = [
    { title: 'Order Placed', desc: 'Sent to restaurant kitchen', icon: 'receipt' },
    { title: 'Preparing Food', desc: 'Chef is preparing your meal', icon: 'skillet' },
    { title: 'Ready for Pickup', desc: 'Delivery hero is picking up your order', icon: 'moped' },
    { title: 'Delivered', desc: 'Enjoy your delicious meal!', icon: 'check_circle' },
  ];

  // VIEW 2: Detailed Order Tracking Screen
  if (selectedOrder) {
    const currentStep = getStepIndex(selectedOrder.status);

    return (
      <div className="flex-1 pb-24 bg-surface dark:bg-surface-dim px-4 py-4 overflow-y-auto">
        {/* Top Navigation & Back Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h2 className="text-lg font-bold text-on-surface font-headline leading-tight">Order Tracking</h2>
              <p className="text-xs text-on-surface-variant font-mono">{selectedOrder.id}</p>
            </div>
          </div>

          <span className={`border text-[10px] font-extrabold px-2.5 py-1 rounded-full animate-pulse ${getStatusBadgeStyle(selectedOrder.status)}`}>
            {selectedOrder.status || 'New'}
          </span>
        </div>

        {/* Live Delivery Map View */}
        <div className="relative h-44 w-full rounded-3xl overflow-hidden mb-4 border border-outline-variant/30 shadow-lg bg-slate-900 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80"
            alt="Live Delivery Map"
            className="w-full h-full object-cover opacity-60"
          />
          {/* Delivery Pulse Dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#3A5A40] text-[#F2E8CF] flex items-center justify-center shadow-2xl shadow-[#3A5A40]/60 animate-bounce">
              <span className="material-symbols-outlined text-2xl">moped</span>
            </div>
            <span className="bg-[#1C261A]/90 text-[#FAF7EE] font-mono font-bold text-[10px] px-3 py-1 rounded-full mt-2 border border-[#3A5A40]/40 shadow-md">
              Status: {selectedOrder.status}
            </span>
          </div>
        </div>

        {/* Order Details Banner */}
        <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-sm mb-4 space-y-2">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <span className="font-bold text-xs text-on-surface">Items Ordered ({selectedOrder.items?.length || 0})</span>
            <span className="font-extrabold text-sm text-[#3A5A40] dark:text-[#A3B18A]">₹{selectedOrder.total}</span>
          </div>
          <div className="space-y-1 text-xs text-on-surface-variant">
            {selectedOrder.items?.map((it, idx) => (
               <div key={idx} className="flex justify-between">
                <span>{it.name} × {it.qty}</span>
                <span className="font-semibold">₹{it.price * it.qty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Driver Card */}
        <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#3A5A40] text-[#F2E8CF] flex items-center justify-center font-bold shadow-md shadow-[#3A5A40]/20">
                <span className="material-symbols-outlined text-xl">person_pin</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface">Delivery Partner</h4>
                <p className="text-xs text-on-surface-variant">Assigned for {selectedOrder.id}</p>
                <span className="text-[11px] font-bold text-amber-600">4.9 ⭐ Verified Delivery Hero</span>
              </div>
            </div>

            <a
              href="tel:+919876543210"
              className="w-10 h-10 rounded-2xl bg-[#A3B18A]/20 text-[#3A5A40] dark:text-[#A3B18A] flex items-center justify-center hover:bg-[#A3B18A]/35 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">call</span>
            </a>
          </div>
        </div>

        {/* Vertical Step Timeline */}
        <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-sm space-y-4">
          <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-2">
            Real-Time Progress
          </h3>

          <div className="space-y-4 relative before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/30">
            {trackingSteps.map((step, idx) => {
              const isDone = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={idx} className="flex items-start gap-3 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 ${
                      isDone
                        ? 'bg-[#3A5A40] text-[#F2E8CF] shadow-md scale-105'
                        : 'bg-surface-container-high text-on-surface-variant/50'
                    }`}
                  >
                    <span className="material-symbols-outlined">{step.icon}</span>
                  </div>
                  <div className="pt-1">
                    <h4
                      className={`font-headline text-xs font-bold ${
                        isDone ? 'text-on-surface font-extrabold' : 'text-on-surface-variant/60'
                      }`}
                    >
                      {step.title} {isCurrent && <span className="text-[#3A5A40] dark:text-[#A3B18A] text-[10px] ml-1.5 font-bold animate-pulse">(Active)</span>}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 1: My Orders List Screen
  return (
    <div className="flex-1 pb-24 bg-surface dark:bg-surface-dim px-4 py-4 overflow-y-auto">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-on-surface font-headline leading-tight">My Orders</h2>
          <p className="text-xs text-on-surface-variant">View order history & live delivery status</p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors shadow-2xs"
        >
          <span className="material-symbols-outlined text-lg">home</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface-container rounded-3xl p-8 text-center border border-outline-variant/30 flex flex-col items-center justify-center my-8">
          <div className="w-16 h-16 rounded-full bg-[#A3B18A]/20 text-[#3A5A40] dark:text-[#A3B18A] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-3xl">receipt_long</span>
          </div>
          <h3 className="font-bold text-base text-on-surface mb-1">No Orders Placed Yet</h3>
          <p className="text-xs text-on-surface-variant max-w-xs mb-4">
            Explore our delicious menu items and place an order to track live delivery here!
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-2.5 bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] text-[#F2E8CF] rounded-2xl font-bold text-xs shadow-lg shadow-[#3A5A40]/25 hover:opacity-95"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const formattedTime = order.time
              ? `Today at ${order.time}`
              : new Date(order.placedAt || Date.now()).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col gap-2.5 relative"
              >
                {/* Header Row: Order ID, Date & Status Badge */}
                <div className="flex justify-between items-start border-b border-outline-variant/20 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-lg">restaurant</span>
                      <h4 className="font-bold text-xs text-on-surface font-headline">
                        {order.restaurantName || 'InnoDine Partner Kitchen'}
                      </h4>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 font-mono">
                      {order.id} • {formattedTime}
                    </p>
                  </div>

                  <span className={`border text-[10px] font-extrabold px-2.5 py-1 rounded-full ${getStatusBadgeStyle(order.status)}`}>
                    {order.status || 'New'}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="flex justify-between items-center text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="text-on-surface font-semibold truncate">
                      {order.items && order.items.length > 0
                        ? order.items.map((i) => `${i.name} × ${i.qty}`).join(', ')
                        : 'Food Order'}
                    </p>
                    <p className="text-[11px] text-on-surface-variant/80 mt-0.5 truncate">
                      {order.tableOrDelivery || 'Delivery Order'}
                    </p>
                  </div>

                  <span className="font-extrabold text-sm text-[#3A5A40] dark:text-[#A3B18A] shrink-0">₹{order.total}</span>
                </div>

                {/* Footer Action Button */}
                <div className="pt-2 border-t border-outline-variant/15 flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#3A5A40] dark:text-[#A3B18A] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Click to Track Order Details</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                  <span className="w-7 h-7 rounded-full bg-[#A3B18A]/20 text-[#3A5A40] dark:text-[#A3B18A] flex items-center justify-center group-hover:bg-[#3A5A40] group-hover:text-[#F2E8CF] transition-colors">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
