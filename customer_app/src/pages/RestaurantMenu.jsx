import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getDishes, getRestaurants, subscribeToEvents } from '../services/store';

export default function RestaurantMenu({ restaurant, onNavigate, onSelectDish }) {
  const { cartItems, addToCart, updateQuantity, getCartCount, getCartSubtotal } = useCart();
  const [activeTab, setActiveTab] = useState('All');
  const [addedMessage, setAddedMessage] = useState('');
  const [restaurants, setRestaurants] = useState(() => getRestaurants());
  const [dishes, setDishes] = useState(() => getDishes());

  useEffect(() => {
    const updateStore = () => {
      setRestaurants(getRestaurants());
      setDishes(getDishes());
    };

    updateStore();
    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'DISH_MUTATION' || event.type === 'RESTAURANT_MUTATION' || event.type === 'CROSS_SYNC_MUTATION') {
        updateStore();
      }
    });
    return () => unsubscribe();
  }, []);

  const partner = restaurant || (restaurant?.id ? restaurants.find(r => r.id === restaurant.id) : null) || restaurants[0] || {
    name: 'Gourmet Kitchen',
    address: '123 Food Street, Sector 4, Cyber Hub',
    phone: '+91 98765 43210',
    fssai: '11522003000841',
    isOnline: true,
  };

  const isRestoOnline = partner.isOnline !== false;

  const partnerDishes = dishes.filter((dish) => {
    if (!dish || !dish.name) {
      return false;
    }
    if (!restaurant && restaurants.length <= 1) return true;
    return (
      (dish.restaurantId && partner.id && dish.restaurantId === partner.id) ||
      (dish.restaurantEmail && partner.email && dish.restaurantEmail.toLowerCase() === partner.email.toLowerCase()) ||
      (dish.restaurantName && partner.name && dish.restaurantName.toLowerCase() === partner.name.toLowerCase()) ||
      (!dish.restaurantId && partner.id)
    );
  });

  const existingDishCategories = Array.from(new Set(partnerDishes.map((d) => d.category).filter(Boolean)));
  const categories = ['All', ...Array.from(new Set([...existingDishCategories, 'Combos & Meals', 'Pizza', 'Burger', 'Biryani', 'Chinese', 'Beverages & Shakes', 'Desserts & Ice Cream', 'Snacks & Starters']))];

  const filteredDishes = partnerDishes.filter((dish) => {
    if (activeTab === 'All') return true;
    return dish.category === activeTab;
  });

  const getItemQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="flex-1 pb-28 bg-surface dark:bg-surface-dim">
      {/* Restaurant Cover Header */}
      <div className="relative h-48 w-full bg-slate-800">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
          alt="Restaurant Cover"
          className="w-full h-full object-cover opacity-80"
        />
        <button
          onClick={() => onNavigate('home')}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-900/70 text-white flex items-center justify-center backdrop-blur-md hover:bg-slate-900 transition-colors z-20"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </button>

        {/* Offline Banner if Kitchen is Closed */}
        {!isRestoOnline && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-10">
            <div className="rotate-[-6deg] border-2 border-red-500 bg-red-600/90 text-white font-extrabold text-xs px-4 py-1.5 rounded-xl shadow-xl tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
              <span className="material-symbols-outlined text-sm">block</span>
              <span>RESTO OFFLINE • KITCHEN CLOSED</span>
            </div>
          </div>
        )}
      </div>

      {/* Restaurant Details Card */}
      <div className="-mt-8 mx-4 bg-surface-container-lowest dark:bg-surface-container-high rounded-3xl p-4 shadow-xl border border-outline-variant/30 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-headline font-extrabold text-lg text-on-surface">
              {partner.name || 'Tasty Kitchen'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{partner.address || '123 Food Street, Cyber Hub'}</p>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 border ${
              isRestoOnline
                ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                : 'bg-red-500/15 text-red-600 border-red-500/30'
            }`}
          >
            <span>{isRestoOnline ? 'OPEN NOW' : 'CLOSED'}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-outline-variant/20 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-coral-orange text-base">call</span>
            <span>{partner.phone || '+91 98765 43210'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-coral-orange text-base">verified</span>
            <span>FSSAI: {partner.fssai || '11522003000841'}</span>
          </div>
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="sticky top-0 z-30 bg-surface/95 dark:bg-surface-dim/95 backdrop-blur-md py-3 px-4 mt-4 border-b border-outline-variant/20">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                activeTab === tab
                  ? 'bg-[#3A5A40] text-[#F2E8CF] shadow-md shadow-[#3A5A40]/25'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Item Cards */}
      <div className="px-4 mt-4 space-y-4">
        {filteredDishes.length === 0 ? (
          <div className="bg-surface-container rounded-3xl p-8 text-center border border-outline-variant/30 text-xs text-on-surface-variant">
            No dishes found in this category. Add dishes in the Partner App (`http://localhost:3001/`)!
          </div>
        ) : (
          filteredDishes.map((item) => {
            const qty = getItemQuantity(item.id);
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (onSelectDish) onSelectDish(item);
                }}
                className="bg-surface-container-lowest dark:bg-surface-container-high rounded-3xl p-4 border border-outline-variant/30 shadow-sm flex gap-3 cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
              >
                {!isRestoOnline && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
                    <div className="bg-red-600 text-white font-extrabold text-[9px] px-3 py-0.5 rounded shadow-md tracking-wider uppercase rotate-[-8deg]">
                      RESTO OFFLINE
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#A3B18A]/20 text-[#3A5A40] dark:text-[#A3B18A] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-on-surface">{item.name}</h3>
                  <span className="text-sm font-extrabold text-[#3A5A40] dark:text-[#A3B18A] block mt-0.5 font-numeric">
                    ₹{item.price}
                  </span>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1 leading-snug">
                    {item.description || 'Delicious dish prepared with fine ingredients.'}
                  </p>
                </div>

                <div className="relative shrink-0 flex flex-col items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                  {qty === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isRestoOnline) {
                          alert('This kitchen is currently offline!');
                          return;
                        }
                        addToCart(item);
                        setAddedMessage(`Added ${item.name}`);
                        setTimeout(() => setAddedMessage(''), 2000);
                      }}
                      disabled={!isRestoOnline || !item.inStock}
                      className={`-mt-4 text-[#F2E8CF] font-bold text-xs px-5 py-2 rounded-xl shadow-md border-2 border-surface transition-transform active:scale-95 flex items-center gap-1 ${
                        isRestoOnline && item.inStock
                          ? 'bg-[#3A5A40] hover:bg-[#283618]'
                          : 'bg-slate-400 cursor-not-allowed text-[10px]'
                      }`}
                    >
                      <span>{!isRestoOnline ? 'CLOSED' : item.inStock ? 'ADD' : 'OUT'}</span>
                    </button>
                  ) : (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="-mt-4 bg-[#3A5A40] text-[#F2E8CF] font-bold text-xs px-2 py-1.5 rounded-xl shadow-md border-2 border-surface flex items-center gap-2"
                    >
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/20"
                      >
                        -
                      </button>
                      <span>{qty}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/20"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating View Cart Bar */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-16 left-0 right-0 max-w-[420px] mx-auto px-4 z-40">
          <div className="bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] text-[#FAF7EE] rounded-2xl p-3 px-4 flex items-center justify-between shadow-xl shadow-[#3A5A40]/30 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-white/20 font-bold text-xs flex items-center justify-center text-[#F2E8CF]">
                {getCartCount()}
              </span>
              <div>
                <p className="text-xs font-semibold text-[#F2E8CF]/80">Item Total</p>
                <p className="text-sm font-extrabold font-numeric text-[#F2E8CF]">₹{getCartSubtotal()}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('checkout')}
              className="bg-[#F2E8CF] text-[#283618] font-extrabold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1 hover:bg-white transition-colors"
            >
              <span>View Cart</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
