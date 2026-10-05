import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { getDishes, getRestaurants, subscribeToEvents } from '../services/store';

export default function DishDetail({ dish, onNavigate, onSelectDish }) {
  const { addToCart } = useCart();
  const [restaurants, setRestaurants] = useState(() => getRestaurants());
  const [allDishes, setAllDishes] = useState(() => getDishes());

  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const topRef = useRef(null);

  useEffect(() => {
    const updateStore = () => {
      setRestaurants(getRestaurants());
      setAllDishes(getDishes());
    };

    updateStore();
    const unsubscribe = subscribeToEvents(() => {
      updateStore();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (dish) {
      setQuantity(1);
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [dish?.id]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2200);
  };

  if (!dish) {
    return (
      <div className="flex-1 p-6 text-center text-on-surface flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-coral-orange/15 text-coral-orange flex items-center justify-center mb-3 animate-pulse">
          <span className="material-symbols-outlined text-4xl">fastfood</span>
        </div>
        <h3 className="font-extrabold text-base text-on-surface">No Dish Selected</h3>
        <p className="text-xs text-on-surface-variant max-w-xs mt-1 mb-5">
          Choose a mouth-watering meal from our handcrafted restaurant menu.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-coral-orange text-white rounded-2xl text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  // Find specific partner restaurant info for this dish
  const partnerRestaurant =
    restaurants.find(
      (r) =>
        (dish.restaurantId && r.id === dish.restaurantId) ||
        (dish.restaurantEmail && r.email && r.email.toLowerCase() === dish.restaurantEmail.toLowerCase()) ||
        (dish.restaurantName && r.name && r.name.toLowerCase() === dish.restaurantName.toLowerCase())
    ) || {
      name: dish.restaurantName || 'Gourmet Kitchen',
      address: '123 Food Street, Sector 4, Cyber Hub',
      phone: '+91 98765 43210',
      fssai: '11522003000841',
      isOnline: true,
    };

  const isRestoOnline = partnerRestaurant.isOnline !== false;

  // Filter real related dishes
  const relatedDishes = allDishes.filter(
    (d) => d.id !== dish.id && (d.category === dish.category || d.restaurantId === dish.restaurantId)
  );

  const handleAddToCart = () => {
    if (!isRestoOnline) {
      alert('This kitchen is currently offline and not accepting orders!');
      return;
    }
    if (!dish.inStock) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(dish);
    }
    triggerToast(`Added ${quantity}x ${dish.name} to Cart! 🛒`);
  };

  return (
    <div ref={topRef} className="flex-1 flex flex-col justify-between bg-surface dark:bg-surface-dim pb-24 relative">
      {/* Animated Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-[11px] font-extrabold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/20 animate-cart-toast flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        {/* 🌟 Ultra-Stylish Hero Header with Soft Curved Bottom */}
        <div className="relative w-full h-72 sm:h-80 bg-slate-900 rounded-b-[36px] overflow-hidden shadow-xl">
          {/* Main Background Image with Smooth Scaling & Object-Center */}
          <img
            src={dish.image}
            alt={dish.name}
            className={`w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105 ${
              !isRestoOnline ? 'grayscale' : ''
            }`}
          />

          {/* Gradient Overlay Mask for Text Legibility & Smooth Bottom Transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/25 to-black/60 pointer-events-none"></div>

          {/* Floating Top Nav Bar (Back Button) */}
          <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center">
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
              title="Back"
            >
              <span className="material-symbols-outlined text-xl font-black">arrow_back</span>
            </button>
          </div>

          {/* In Stock / Resto Status Badge */}
          <div className="absolute bottom-6 left-5 z-20">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-lg backdrop-blur-md border ${
                isRestoOnline && dish.inStock
                  ? 'bg-emerald-500/90 text-white border-emerald-300/40'
                  : 'bg-red-600/90 text-white border-red-300/40'
              }`}
            >
              {!isRestoOnline ? 'KITCHEN CLOSED' : dish.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
            </span>
          </div>

          {/* Offline Banner */}
          {!isRestoOnline && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-10">
              <div className="rotate-[-5deg] bg-red-600 text-white font-extrabold text-xs px-4 py-2 rounded-2xl shadow-2xl tracking-wider uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-base">block</span>
                <span>RESTO OFFLINE • KITCHEN CLOSED</span>
              </div>
            </div>
          )}
        </div>

        {/* 🌟 Floating Card Overlap Sheet */}
        <div className="-mt-6 px-4 relative z-20 space-y-4">
          {/* Main Dish Details Card */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-high rounded-3xl p-5 shadow-xl border border-outline-variant/30 backdrop-blur-md">
            <div className="flex justify-between items-start gap-3">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-coral-orange bg-coral-orange/15 px-2.5 py-0.5 rounded-lg inline-block mb-1.5 border border-coral-orange/20">
                  {dish.category || 'Special Dish'}
                </span>
                <h1 className="font-headline font-black text-xl sm:text-2xl text-on-surface leading-tight">
                  {dish.name}
                </h1>
              </div>

              <div className="text-right shrink-0">
                <span className="font-sans font-black text-2xl text-coral-orange block font-numeric tracking-tight">
                  ₹{dish.price}
                </span>
                <span className="text-[10px] text-on-surface-variant font-bold">Inclusive of taxes</span>
              </div>
            </div>

            {/* Quick Metrics Ribbon Bar */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mt-3 pt-3 border-t border-outline-variant/20">
              <div className="flex items-center gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-xl shrink-0 text-xs font-extrabold">
                <span className="material-symbols-outlined text-sm text-amber-500 fill-current">star</span>
                <span>4.9</span>
                <span className="text-[10px] opacity-75 font-normal">(180+)</span>
              </div>

              <div className="flex items-center gap-1 bg-blue-500/15 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-xl shrink-0 text-xs font-extrabold">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>15-20 mins</span>
              </div>

              <div className="flex items-center gap-1 bg-coral-orange/15 text-coral-orange px-3 py-1 rounded-xl shrink-0 text-xs font-extrabold">
                <span className="material-symbols-outlined text-sm">local_fire_department</span>
                <span>380 kcal</span>
              </div>

              <div className="flex items-center gap-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-xl shrink-0 text-xs font-extrabold">
                <span className="material-symbols-outlined text-sm">eco</span>
                <span>100% Fresh</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-on-surface-variant/90 mt-3.5 leading-relaxed font-medium">
              {dish.description ||
                'Prepared fresh with handpicked ingredients, aromatic herbs, authentic spices, and cooked to perfection for a delicious dining experience.'}
            </p>
          </div>

          {/* Kitchen Partner Info Card */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-high rounded-3xl p-4 shadow-md border border-outline-variant/30 space-y-2.5">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-coral-orange/15 text-coral-orange flex items-center justify-center font-bold shadow-xs">
                  <span className="material-symbols-outlined text-xl">storefront</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-extrabold text-xs text-on-surface">{partnerRestaurant.name}</h3>
                    <span className="material-symbols-outlined text-xs text-blue-500 fill-current">verified</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium">Kitchen Partner</p>
                </div>
              </div>

              <span
                className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border ${
                  isRestoOnline
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/15 text-red-600 border-red-500/30'
                }`}
              >
                {isRestoOnline ? 'OPEN NOW' : 'CLOSED'}
              </span>
            </div>

            <div className="space-y-2 text-xs text-on-surface-variant">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-coral-orange shrink-0 mt-0.5">location_on</span>
                <span className="text-[11px] leading-tight text-on-surface-variant/90 font-medium">
                  {partnerRestaurant.address || '123 Food Street, Sector 4, Cyber Hub'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-outline-variant/15">
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <span className="material-symbols-outlined text-sm text-coral-orange">call</span>
                  <span>{partnerRestaurant.phone || '+91 98765 43210'}</span>
                </div>
                <a
                  href={`tel:${partnerRestaurant.phone || '+919876543210'}`}
                  className="px-3 py-1 bg-coral-orange/15 text-coral-orange font-extrabold text-[11px] rounded-xl hover:bg-coral-orange/25 transition-transform active:scale-95 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">phone_in_talk</span>
                  <span>Call Kitchen</span>
                </a>
              </div>
            </div>
          </div>

          {/* Add to Cart Section (Quantity Stepper + Add Button) */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-high rounded-3xl p-3.5 border border-outline-variant/30 shadow-md flex items-center gap-3">
            {/* Quantity Stepper (- Qty +) */}
            <div className="flex items-center bg-surface-container dark:bg-slate-800 rounded-2xl p-1 border border-outline-variant/30 shrink-0 shadow-xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-black hover:bg-slate-100 active:scale-95 transition-all text-base shadow-xs"
              >
                -
              </button>
              <span className="w-8 text-center font-black text-sm text-slate-900 dark:text-white font-numeric">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-black hover:bg-slate-100 active:scale-95 transition-all text-base shadow-xs"
              >
                +
              </button>
            </div>

            {/* Add to Cart CTA Button */}
            <button
              onClick={handleAddToCart}
              disabled={!isRestoOnline || !dish.inStock}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs shadow-lg flex items-center justify-between transition-all active:scale-[0.98] ${
                isRestoOnline && dish.inStock
                  ? 'bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] hover:opacity-95 text-[#F2E8CF] shadow-[#3A5A40]/30'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">shopping_bag</span>
                <span>{!isRestoOnline ? 'Resto Offline' : dish.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </div>
              {isRestoOnline && dish.inStock && (
                <span className="font-numeric text-sm font-black bg-white/20 text-[#F2E8CF] px-2 py-0.5 rounded-lg">
                  ₹{dish.price * quantity}
                </span>
              )}
            </button>
          </div>

          {/* More Dishes Section */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="font-extrabold text-sm text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-lg">restaurant_menu</span>
                <span>More Dishes You May Like</span>
              </h3>
            </div>

            {relatedDishes.length === 0 ? (
              <div className="bg-surface-container rounded-2xl p-4 text-center border border-outline-variant/20 text-xs text-on-surface-variant">
                No other dishes in this category yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {relatedDishes.map((relDish) => (
                  <div
                    key={relDish.id}
                    onClick={() => {
                      if (onSelectDish) onSelectDish(relDish);
                      setQuantity(1);
                      if (topRef.current) {
                        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="bg-surface-container-lowest dark:bg-surface-container-high rounded-2xl p-2.5 border border-outline-variant/30 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {!isRestoOnline && (
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
                        <div className="bg-red-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded shadow-md tracking-wider uppercase rotate-[-10deg]">
                          RESTO OFFLINE
                        </div>
                      </div>
                    )}

                    <div className="relative mb-2">
                      <img
                        src={relDish.image}
                        alt={relDish.name}
                        className={`w-full h-28 rounded-xl object-cover transition-transform group-hover:scale-102 ${
                          !isRestoOnline ? 'grayscale' : ''
                        }`}
                      />
                    </div>

                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-on-surface truncate leading-tight">{relDish.name}</h4>
                        <p className="text-[10px] text-on-surface-variant font-medium truncate mt-0.5">
                          {relDish.restaurantName || (restaurants.length > 0 ? restaurants[0].name : 'Partner Kitchen')}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-outline-variant/15">
                        <span className="font-extrabold text-xs text-[#3A5A40] dark:text-[#A3B18A] font-numeric">₹{relDish.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isRestoOnline) {
                              alert('This kitchen is currently offline and not accepting orders!');
                              return;
                            }
                            if (!relDish.inStock) return;
                            addToCart(relDish);
                            triggerToast(`Added 1x ${relDish.name} to Cart! 🛒`);
                          }}
                          disabled={!isRestoOnline || !relDish.inStock}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold shadow-xs transition-all ${
                            isRestoOnline && relDish.inStock
                              ? 'bg-[#3A5A40] text-[#F2E8CF] hover:bg-[#283618] active:scale-95'
                              : 'bg-slate-300 text-slate-500 cursor-not-allowed text-[10px]'
                          }`}
                        >
                          {!isRestoOnline ? 'Closed' : relDish.inStock ? '+ Add' : 'Out'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

