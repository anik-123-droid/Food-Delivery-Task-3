import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getDishes, getRestaurants, getPromotions, subscribeToEvents } from '../services/store';
import AddressModal from '../components/AddressModal';

// Master Categories list with emoji icons
const CATEGORY_ICON_MAP = {
  All: '🍽️',
  Combos: '🎁',
  'Combos & Meals': '🎁',
  Pizza: '🍕',
  Burger: '🍔',
  Biryani: '🍲',
  Chinese: '🥢',
  'Beverages & Shakes': '🥤',
  Beverages: '🥤',
  'Desserts & Ice Cream': '🍨',
  Desserts: '🍨',
  'Snacks & Starters': '🍟',
  Snacks: '🍟',
  'South Indian': '🫓',
  'North Indian': '🥘',
  Sandwiches: '🥪',
  'Rolls & Wraps': '🌯',
};

const DEFAULT_CATEGORIES = [
  'All',
  'Combos & Meals',
  'Pizza',
  'Burger',
  'Biryani',
  'Chinese',
  'Beverages & Shakes',
  'Desserts & Ice Cream',
  'Snacks & Starters',
];

const BANNER_THEMES = {
  flame: {
    bgClass: 'bg-gradient-to-br from-[#1C261A] via-[#283618] to-[#344E41]',
    badgeBg: 'bg-[#A3B18A]/25 text-[#F2E8CF] border border-[#A3B18A]/30',
    btnClass: 'bg-[#F2E8CF] text-[#283618] hover:bg-white font-extrabold',
  },
  gold: {
    bgClass: 'bg-gradient-to-br from-[#1F1913] via-[#2A1E17] to-[#110D0A] border-2 border-amber-500/40',
    badgeBg: 'bg-amber-500/25 text-amber-300 border border-amber-400/40',
    btnClass: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold hover:brightness-110',
  },
  emerald: {
    bgClass: 'bg-gradient-to-br from-[#004D40] via-[#00695C] to-[#00251A]',
    badgeBg: 'bg-emerald-400/25 text-emerald-200 border border-emerald-300/30',
    btnClass: 'bg-emerald-400 text-slate-950 font-extrabold hover:bg-emerald-300',
  },
  neon: {
    bgClass: 'bg-gradient-to-br from-[#3A5A40] via-[#588157] to-[#1C261A]',
    badgeBg: 'bg-white/20 text-[#FAF7EE] border border-white/30',
    btnClass: 'bg-[#F2E8CF] text-[#283618] hover:bg-white font-extrabold',
  },
  royal: {
    bgClass: 'bg-gradient-to-br from-[#4A148C] via-[#7B1FA2] to-[#C2185B]',
    badgeBg: 'bg-white/20 text-white border border-white/30',
    btnClass: 'bg-white text-purple-950 font-extrabold hover:bg-purple-50',
  },
  cyber: {
    bgClass: 'bg-gradient-to-br from-[#00C6FF] via-[#0072FF] to-[#002B49]',
    badgeBg: 'bg-white/20 text-white border border-white/30',
    btnClass: 'bg-slate-950 text-white hover:bg-black',
  },
  sunset: {
    bgClass: 'bg-gradient-to-br from-[#283618] via-[#3A5A40] to-[#588157]',
    badgeBg: 'bg-white/20 text-[#FAF7EE] border border-white/30 font-bold',
    btnClass: 'bg-[#F2E8CF] text-[#283618] hover:bg-white font-extrabold',
  },
  midnight: {
    bgClass: 'bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#3A506B]',
    badgeBg: 'bg-cyan-400/25 text-cyan-200 border border-cyan-300/30',
    btnClass: 'bg-cyan-400 text-slate-950 font-extrabold hover:bg-cyan-300',
  },
  tropic: {
    bgClass: 'bg-gradient-to-br from-[#11998E] via-[#38EF7D] to-[#05445E]',
    badgeBg: 'bg-white/20 text-white border border-white/30',
    btnClass: 'bg-slate-950 text-white hover:bg-slate-900',
  },
  rose: {
    bgClass: 'bg-gradient-to-br from-[#4A0E17] via-[#800020] to-[#D4AF37] border-2 border-amber-300/40',
    badgeBg: 'bg-amber-400/25 text-amber-200 border border-amber-300/30',
    btnClass: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold hover:brightness-110',
  },
};

function PromoBannerImage({ imageUrl, imageStyle = 'cutout', title = '' }) {
  const src = imageUrl;

  // Option 1: 💎 3D Floating Glass Card
  if (imageStyle === 'glass') {
    return (
      <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 pointer-events-none z-10">
        <div className="absolute inset-0 bg-white/25 rounded-2xl blur-md"></div>
        <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/60 ring-2 ring-black/20 shadow-2xl relative z-10 transform -rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
          <img src={src} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.35)] rounded-2xl pointer-events-none"></div>
        </div>
      </div>
    );
  }

  // Option 2: 🍽️ Gourmet Circular Plate
  if (imageStyle === 'plate') {
    return (
      <div className="absolute -right-6 sm:-right-8 -top-6 -bottom-6 w-[56%] sm:w-[52%] pointer-events-none flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl transform scale-90"></div>
        <div className="w-[115%] h-[115%] rounded-full overflow-hidden border-[6px] border-amber-300/90 ring-4 ring-amber-500/40 shadow-[0_15px_45px_rgba(0,0,0,0.5)] relative bg-slate-950 group-hover:scale-105 transition-all duration-500 flex items-center justify-center">
          <img src={src} alt={title} className="w-full h-full object-cover object-center filter contrast-105" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_24px_rgba(0,0,0,0.5)] pointer-events-none"></div>
        </div>
      </div>
    );
  }

  // Option 3: 🛑 3D Cyber Hexagon Badge
  if (imageStyle === 'hexagon') {
    return (
      <div className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-32 sm:w-36 h-32 sm:h-36 pointer-events-none z-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full scale-90"></div>
        <div className="w-full h-full relative group-hover:scale-105 transition-all duration-300 flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}>
          <img src={src} alt={title} className="w-full h-full object-cover shadow-2xl" />
          <div className="absolute inset-0 border-4 border-amber-400/80 pointer-events-none" style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}></div>
        </div>
      </div>
    );
  }

  // Option 4: 🏆 Golden Trophy Stamp
  if (imageStyle === 'badge') {
    return (
      <div className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-28 sm:w-32 h-28 sm:h-32 pointer-events-none z-10">
        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-lg"></div>
        <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-amber-400 ring-4 ring-amber-500/30 shadow-2xl relative z-10 transform rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
          <img src={src} alt={title} className="w-full h-full object-cover" />
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-tl-xl shadow-md">★ TOP</div>
        </div>
      </div>
    );
  }

  // Option 5: 📸 Retro Glossy Polaroid Card
  if (imageStyle === 'polaroid') {
    return (
      <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-28 sm:w-32 h-32 sm:h-36 pointer-events-none z-10">
        <div className="w-full h-full bg-white p-2 pb-5 rounded-2xl shadow-2xl transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 border border-slate-200">
          <div className="w-full h-[80%] rounded-xl overflow-hidden bg-slate-900">
            <img src={src} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="text-[9px] font-black text-slate-800 text-center mt-1 truncate font-mono">#SPECIAL</div>
        </div>
      </div>
    );
  }

  // Option 6: ⚡ Neon Pulse Glow Ring
  if (imageStyle === 'neon_ring') {
    return (
      <div className="absolute -right-6 sm:-right-8 -top-6 -bottom-6 w-[56%] sm:w-[52%] pointer-events-none flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl animate-pulse"></div>
        <div className="w-[115%] h-[115%] rounded-full overflow-hidden border-[5px] border-cyan-400 ring-4 ring-purple-500 shadow-[0_0_30px_rgba(0,242,254,0.6)] relative bg-slate-950 group-hover:scale-105 transition-all duration-500 flex items-center justify-center">
          <img src={src} alt={title} className="w-full h-full object-cover object-center filter brightness-105 contrast-105" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,242,254,0.4)] pointer-events-none"></div>
        </div>
      </div>
    );
  }

  // Option 7: 🪄 Seamless Cutout (Default)
  return (
    <div className="absolute -right-6 sm:-right-8 -top-6 -bottom-6 w-[56%] sm:w-[52%] pointer-events-none flex items-center justify-center z-10">
      <div className="absolute inset-0 bg-white/25 rounded-full blur-xl transform scale-90"></div>
      <div className="w-[115%] h-[115%] rounded-full overflow-hidden border-[5px] sm:border-[6px] border-white/85 ring-4 ring-black/15 shadow-[0_15px_45px_rgba(0,0,0,0.5)] relative bg-white/95 group-hover:scale-105 transition-all duration-500 flex items-center justify-center p-2">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-contain object-center mix-blend-multiply filter contrast-105"
        />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_18px_rgba(0,0,0,0.25)] pointer-events-none"></div>
      </div>
    </div>
  );
}

export default function Home({ onNavigate, onSelectDish, onSelectRestaurant }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [dishes, setDishes] = useState(() => getDishes());
  const [restaurants, setRestaurants] = useState(() => getRestaurants());
  const [promotions, setPromotions] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const loadData = () => {
    setDishes(getDishes());
    setRestaurants(getRestaurants());
    const allPromos = getPromotions();
    const activePromos = allPromos.filter((p) => p.isActive !== false);
    setPromotions(activePromos);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToEvents(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  // Auto carousel slide
  useEffect(() => {
    if (promotions.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % promotions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  const existingDishCategories = Array.from(new Set(dishes.map((d) => d.category).filter(Boolean)));
  const allCategoryNames = ['All', ...Array.from(new Set([...existingDishCategories, ...DEFAULT_CATEGORIES])).filter(c => c !== 'All')];

  const categoriesList = allCategoryNames.map((name) => ({
    id: name,
    name: name,
    icon: CATEGORY_ICON_MAP[name] || '🍛',
  }));

  const getDishRestaurant = (dish) => {
    if (!dish) return null;
    const found = restaurants.find(
      (r) =>
        (dish.restaurantId && r.id === dish.restaurantId) ||
        (dish.restaurantEmail && r.email && r.email.toLowerCase() === dish.restaurantEmail.toLowerCase()) ||
        (dish.restaurantName && r.name && r.name.toLowerCase() === dish.restaurantName.toLowerCase())
    );
    if (found) return found;
    if (dish.restaurantName) {
      return { isOnline: true, name: dish.restaurantName };
    }
    if (restaurants.length > 0) {
      return restaurants[0];
    }
    return null;
  };

  const isDishRestoOnline = (dish) => {
    const resto = getDishRestaurant(dish);
    return resto?.isOnline !== false;
  };

  const handleAddDish = (dish, e) => {
    if (e) e.stopPropagation();
    const isOnline = isDishRestoOnline(dish);
    if (!isOnline) {
      const resto = getDishRestaurant(dish);
      alert(`${resto?.name || 'This kitchen'} is currently offline and not accepting orders!`);
      return;
    }
    if (!dish.inStock) return;
    addToCart(dish);
  };

  const q = searchQuery.toLowerCase().trim();

  // Filter Restaurants matching query
  const filteredRestaurants = restaurants.filter((r) => {
    if (!r) return false;
    if (!q) return true;
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.address && r.address.toLowerCase().includes(q)) ||
      (r.cuisine && r.cuisine.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q))
    );
  });

  // Filter Dishes matching query & category
  const filteredDishes = dishes.filter((dish) => {
    if (!dish || !dish.name) {
      return false;
    }

    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const resto = getDishRestaurant(dish);
    const matchesSearch =
      !q ||
      dish.name.toLowerCase().includes(q) ||
      (dish.category && dish.category.toLowerCase().includes(q)) ||
      (dish.restaurantName && dish.restaurantName.toLowerCase().includes(q)) ||
      (resto?.name && resto.name.toLowerCase().includes(q)) ||
      (dish.description && dish.description.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const activeAd = promotions[activeBannerIndex] || null;

  return (
    <div className="flex-1 pb-28 bg-[#FAF7EE] dark:bg-[#121A12] overflow-y-auto relative font-sans">
      {/* 1. TOP HEADER & SEARCH CARD (Sage x Cream Deep Forest Background with Curved Bottom) */}
      <div className="bg-gradient-to-b from-[#283618] via-[#344E41] to-[#1C261A] text-[#F2E8CF] pt-5 pb-7 px-4 rounded-b-[32px] shadow-xl relative z-20">
        {/* Location & Action Icons Row */}
        <div className="flex justify-between items-center mb-5">
          {/* Location Picker */}
          <div
            onClick={() => setShowAddressModal(true)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#A3B18A]/20 backdrop-blur-md flex items-center justify-center text-[#A3B18A]">
              <span className="material-symbols-outlined text-lg">location_on</span>
            </div>
            <div>
              <p className="text-[10px] text-[#A3B18A] font-bold uppercase tracking-wider leading-none">Location</p>
              <div className="flex items-center gap-1 mt-0.5">
                <h1 className="font-extrabold text-xs text-[#FAF7EE] truncate max-w-[170px]">
                  {user?.address || 'New York, USA'}
                </h1>
                <span className="material-symbols-outlined text-sm text-[#A3B18A] font-bold">expand_more</span>
              </div>
            </div>
          </div>

          {/* Cart & Notification Bell Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('checkout')}
              className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#F2E8CF] relative hover:bg-white/25 transition-all shadow-sm"
              title="Shopping Cart"
            >
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
              {useCart().getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F2E8CF] text-[#1C261A] text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-[#283618] shadow-md animate-pulse">
                  {useCart().getCartCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-[#F2E8CF] font-black text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
              title="User Profile"
            >
              {user?.name ? (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <span className="material-symbols-outlined text-xl">person</span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar & Tune Filter Button Row */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#FAF7EE] text-[#1C261A] text-xs font-semibold focus:outline-none shadow-md placeholder-slate-400 border border-[#E2D8C3]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => {
              if (searchQuery) setSearchQuery('');
              else setSearchQuery('Pizza');
            }}
            className="w-11 h-11 rounded-2xl bg-[#FAF7EE] text-[#3A5A40] flex items-center justify-center shadow-md hover:bg-[#F2E8CF] active:scale-95 transition-all shrink-0 border border-[#E2D8C3]"
            title="Filter Menu"
          >
            <span className="material-symbols-outlined text-xl font-bold">tune</span>
          </button>
        </div>
      </div>

      {/* Main Page Content Body */}
      <div className="p-4 flex flex-col gap-6 relative z-10">

        {/* 2. SPECIAL OFFERS SECTION (Dynamic Restaurant Partner Ads Rendered 100% Identical to Creation) */}
        {!q && promotions.length > 0 && activeAd && (() => {
          const theme = BANNER_THEMES[activeAd.themeId] || BANNER_THEMES.cyber || BANNER_THEMES.flame;
          return (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                  Special Offers
                </h3>
                <button
                  onClick={() => onNavigate('menu')}
                  className="text-xs text-[#3A5A40] dark:text-[#A3B18A] font-bold hover:underline"
                >
                  See All
                </button>
              </div>

              {/* Dynamic Ultra-Premium Banner Card matched 100% to Restaurant Partner creation */}
              <div className={`relative rounded-3xl overflow-hidden ${theme.bgClass} text-white p-4 min-h-[140px] flex justify-between items-center shadow-lg border border-white/10 group`}>
                {/* Ambient Background Glow */}
                <div className="absolute right-2 top-2 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none"></div>

                <div className="space-y-1.5 z-10 max-w-[60%]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeAd.discountTag && (
                      <span className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${theme.badgeBg}`}>
                        🔥 {activeAd.discountTag}
                      </span>
                    )}
                    {activeAd.restaurantName && (
                      <span className="text-[9px] font-bold text-white/85 truncate">
                        • {activeAd.restaurantName}
                      </span>
                    )}
                  </div>

                  <h4 className="font-headline font-black text-base leading-snug drop-shadow-md tracking-tight">
                    {activeAd.title}
                  </h4>

                  {activeAd.subtitle && (
                    <p className="text-[11px] text-white/95 font-medium leading-tight">
                      {activeAd.subtitle}
                    </p>
                  )}

                  <div className="pt-1.5">
                    <button
                      onClick={() => {
                        const resto = restaurants.find((r) => r.name === activeAd.restaurantName || r.id === activeAd.restaurantId);
                        if (resto && onSelectRestaurant) {
                          onSelectRestaurant(resto);
                        } else {
                          onNavigate('menu');
                        }
                      }}
                      className={`text-[10px] font-extrabold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 shadow-md transition-transform group-hover:scale-105 active:scale-95 ${theme.btnClass}`}
                    >
                      <span>{activeAd.ctaText || 'Order Now ->'}</span>
                    </button>
                  </div>
                </div>

                {/* Gourmet Image Framing Component (Renders exact imageStyle selected by restaurant) */}
                <PromoBannerImage
                  imageUrl={activeAd.imageUrl}
                  imageStyle={activeAd.imageStyle || 'cutout'}
                  title={activeAd.title}
                  size="md"
                />

                {/* Carousel Slider Dots */}
                {promotions.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                    {promotions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveBannerIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          activeBannerIndex === idx ? 'w-5 bg-white' : 'w-2 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* 3. CATEGORIES SECTION (Circular Icons Bar with Sage & Cream Accents) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
              Categories
            </h3>
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-[#3A5A40] dark:text-[#A3B18A] font-bold hover:underline"
            >
              See All
            </button>
          </div>

          <div className="flex gap-3.5 overflow-x-auto hide-scrollbar py-1">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center shrink-0 group focus:outline-none"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-xs border ${
                    selectedCategory === cat.id
                      ? 'bg-[#3A5A40] text-[#F2E8CF] border-[#3A5A40] shadow-md scale-105'
                      : 'bg-[#F2E8CF]/60 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-[#E2D8C3] dark:border-slate-700 hover:bg-[#F2E8CF]'
                  }`}
                >
                  <span>{cat.icon}</span>
                </div>
                <span
                  className={`text-[11px] mt-1.5 font-bold tracking-tight text-center truncate max-w-[68px] ${
                    selectedCategory === cat.id
                      ? 'text-[#3A5A40] dark:text-[#A3B18A] font-extrabold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. RESTAURANTS SEARCH RESULTS SECTION */}
        {q && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-lg">storefront</span>
                <span>Restaurants Matching "{searchQuery}" ({filteredRestaurants.length})</span>
              </h3>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center border border-slate-200 dark:border-slate-700 text-xs text-slate-500 font-medium">
                No matching restaurants found.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRestaurants.map((resto) => {
                  const restoDishesCount = dishes.filter(
                    (d) =>
                      (d.restaurantId && resto.id && d.restaurantId === resto.id) ||
                      (d.restaurantName && resto.name && d.restaurantName.toLowerCase() === resto.name.toLowerCase())
                  ).length;
                  const isOnline = resto.isOnline !== false;

                  return (
                    <div
                      key={resto.id || resto.name}
                      onClick={() => {
                        if (onSelectRestaurant) onSelectRestaurant(resto);
                        else onNavigate('menu');
                      }}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-[#FAF7EE] dark:bg-slate-700 flex items-center justify-center text-[#3A5A40] dark:text-[#A3B18A] font-bold text-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600">
                          {resto.coverImage ? (
                            <img src={resto.coverImage} alt={resto.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-2xl">restaurant</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#3A5A40] transition-colors">
                              {resto.name}
                            </h4>
                            <span
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                                isOnline
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                  : 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30'
                              }`}
                            >
                              {isOnline ? 'OPEN' : 'CLOSED'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold truncate max-w-[190px] mt-0.5">
                            {resto.address || 'Cyber Hub Food Court'}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1">
                            <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                              <span className="material-symbols-outlined text-xs">star</span> 4.5
                            </span>
                            <span>• 20-30 mins</span>
                            <span>• {restoDishesCount} dishes available</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectRestaurant) onSelectRestaurant(resto);
                          else onNavigate('menu');
                        }}
                        className="px-3 py-1.5 bg-[#3A5A40]/10 text-[#3A5A40] dark:text-[#A3B18A] hover:bg-[#3A5A40] hover:text-[#F2E8CF] text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 active:scale-95 shrink-0"
                      >
                        <span>View Menu</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. FEATURED PRODUCTS SECTION (2-Column Food Card Grid with ⭐ Badge & Heart Button from Image) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
              {q
                ? `Dishes Matching "${searchQuery}" (${filteredDishes.length})`
                : selectedCategory === 'All'
                ? 'Featured Products'
                : `${selectedCategory} Dishes`}
            </h3>
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-[#3A5A40] dark:text-[#A3B18A] font-bold hover:underline"
            >
              See All
            </button>
          </div>

          {filteredDishes.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center my-4">
              <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">no_food</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">No Dishes Available</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-xs mt-1">
                No dishes matching your criteria were found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {filteredDishes.map((dish) => {
                const resto = getDishRestaurant(dish);
                const isOnline = isDishRestoOnline(dish);

                return (
                  <div
                    key={dish.id}
                    onClick={() => {
                      if (onSelectDish) onSelectDish(dish);
                    }}
                    className="bg-white dark:bg-slate-800 rounded-3xl p-3 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {!isOnline && (
                      <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
                        <div className="bg-red-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded shadow-md tracking-wider uppercase rotate-[-10deg]">
                          RESTO OFFLINE
                        </div>
                      </div>
                    )}

                    {/* Dish Image Container with ⭐ Rating Badge & ❤️ Heart Button */}
                    <div className="relative mb-2.5">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className={`w-full h-32 rounded-2xl object-cover transition-transform group-hover:scale-102 ${
                          !isOnline ? 'grayscale' : ''
                        }`}
                      />

                      {/* Top Left Star Rating Badge */}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md rounded-full px-2 py-0.5 text-[10px] font-black text-slate-800 shadow-xs flex items-center gap-0.5">
                        <span className="text-amber-500">★</span>
                        <span>4.8</span>
                      </div>

                      {/* Top Right Heart Favorite Icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">favorite</span>
                      </button>
                    </div>

                    {/* Dish Details */}
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate leading-tight">
                          {dish.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                          {dish.restaurantName || resto?.name || (restaurants.length > 0 ? restaurants[0].name : 'Partner Kitchen')}
                        </p>
                      </div>

                      {/* Price & Add Button */}
                      <div className="flex justify-between items-center mt-3 pt-1">
                        <span className="font-black text-sm text-[#3A5A40] dark:text-[#A3B18A] font-numeric">
                          ₹{dish.price}
                        </span>
                        <button
                          onClick={(e) => handleAddDish(dish, e)}
                          disabled={!isOnline || !dish.inStock}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all ${
                            isOnline && dish.inStock
                              ? 'bg-[#3A5A40] text-[#F2E8CF] hover:bg-[#2A422F] active:scale-95'
                              : 'bg-slate-200 text-slate-500 cursor-not-allowed text-[10px]'
                          }`}
                        >
                          {!isOnline ? 'Closed' : dish.inStock ? '+ Add' : 'Out'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} />
    </div>
  );
}
