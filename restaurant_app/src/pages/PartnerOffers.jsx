import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { getPromotions, savePromotion, deletePromotion, togglePromotionStatus, subscribeToEvents } from '../services/store';

const FOOD_PRESET_IMAGES = [
  {
    name: 'Flame-grilled Chicken',
    url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Gourmet Burger & Fries',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Delicious Chicken Wrap',
    url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hot & Crispy Pizza',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Royal Indian Biryani',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },
];

export const BANNER_THEMES = [
  {
    id: 'flame',
    name: 'Deep Forest & Sage',
    bgClass: 'bg-gradient-to-br from-[#1C261A] via-[#283618] to-[#344E41]',
    badgeBg: 'bg-[#A3B18A]/25 text-[#F2E8CF] border border-[#A3B18A]/30',
    btnClass: 'bg-[#F2E8CF] text-[#283618] hover:bg-white font-extrabold',
  },
  {
    id: 'gold',
    name: 'Luxury Dark & Gold',
    bgClass: 'bg-gradient-to-br from-[#1F1913] via-[#2A1E17] to-[#110D0A] border-2 border-amber-500/40',
    badgeBg: 'bg-amber-500/25 text-amber-300 border border-amber-400/40',
    btnClass: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold hover:brightness-110',
  },
  {
    id: 'emerald',
    name: 'Fresh Organic Green',
    bgClass: 'bg-gradient-to-br from-[#004D40] via-[#00695C] to-[#00251A]',
    badgeBg: 'bg-emerald-400/25 text-emerald-200 border border-emerald-300/30',
    btnClass: 'bg-emerald-400 text-slate-950 font-extrabold hover:bg-emerald-300',
  },
  {
    id: 'neon',
    name: 'Sage x Mint Forest',
    bgClass: 'bg-gradient-to-br from-[#3A5A40] via-[#588157] to-[#1C261A]',
    badgeBg: 'bg-white/20 text-[#FAF7EE] border border-white/30',
    btnClass: 'bg-[#F2E8CF] text-[#283618] hover:bg-white font-extrabold',
  },
  {
    id: 'royal',
    name: 'Royal Purple & Magenta',
    bgClass: 'bg-gradient-to-br from-[#4A148C] via-[#7B1FA2] to-[#C2185B]',
    badgeBg: 'bg-white/20 text-white border border-white/30',
    btnClass: 'bg-white text-purple-950 font-extrabold hover:bg-purple-50',
  },
  {
    id: 'cyber',
    name: 'Cyberpunk Cyan & Blue',
    bgClass: 'bg-gradient-to-br from-[#00C6FF] via-[#0072FF] to-[#002B49]',
    badgeBg: 'bg-white/20 text-white border border-white/30',
    btnClass: 'bg-slate-950 text-white hover:bg-black',
  },
  {
    id: 'sunset',
    name: 'Warm Cream & Olive Forest',
    bgClass: 'bg-gradient-to-br from-[#283618] via-[#3A5A40] to-[#588157]',
    badgeBg: 'bg-white/20 text-[#FAF7EE] border border-white/30 font-bold',
    btnClass: 'bg-[#F2E8CF] text-[#283618] hover:bg-white font-extrabold',
  },
  {
    id: 'midnight',
    name: 'Midnight Ocean Blue',
    bgClass: 'bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#3A506B]',
    badgeBg: 'bg-cyan-400/25 text-cyan-200 border border-cyan-300/30',
    btnClass: 'bg-cyan-400 text-slate-950 font-extrabold hover:bg-cyan-300',
  },
  {
    id: 'tropic',
    name: 'Tropical Mango Mint',
    bgClass: 'bg-gradient-to-br from-[#11998E] via-[#38EF7D] to-[#05445E]',
    badgeBg: 'bg-white/20 text-white border border-white/30',
    btnClass: 'bg-slate-950 text-white hover:bg-slate-900',
  },
  {
    id: 'rose',
    name: 'Rose Gold & Velvet',
    bgClass: 'bg-gradient-to-br from-[#4A0E17] via-[#800020] to-[#D4AF37] border-2 border-amber-300/40',
    badgeBg: 'bg-amber-400/25 text-amber-200 border border-amber-300/30',
    btnClass: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold hover:brightness-110',
  },
];

export const IMAGE_STYLES = [
  {
    id: 'cutout',
    name: '🪄 Seamless Cutout (No White BG)',
    desc: 'Dissolves surrounding white photo background onto ceramic plate',
  },
  {
    id: 'plate',
    name: '🍽️ Gourmet Circular Plate',
    desc: 'Full photo inside a gold & white rimmed dish plate',
  },
  {
    id: 'glass',
    name: '💎 3D Floating Glass Card',
    desc: 'Elevated floating card with glassmorphism glow',
  },
  {
    id: 'hexagon',
    name: '🛑 3D Cyber Hexagon Badge',
    desc: 'Futuristic 6-sided geometric badge frame with gold accent',
  },
  {
    id: 'badge',
    name: '🏆 Golden Trophy Stamp',
    desc: 'Rotated square stamp frame with golden seal badge',
  },
  {
    id: 'polaroid',
    name: '📸 Retro Glossy Polaroid',
    desc: 'Floating tilted white photo polaroid card',
  },
  {
    id: 'neon_ring',
    name: '⚡ Neon Pulse Glow Ring',
    desc: 'Futuristic cyan & purple glowing dual ring frame',
  },
];

export function PromoBannerImage({ imageUrl, imageStyle = 'cutout', title = '' }) {
  const src = imageUrl || FOOD_PRESET_IMAGES[0].url;

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

export default function PartnerOffers({ onNavigate }) {
  const { partner, restaurantName } = useRestaurant();
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: 'Order Now ->',
    discountTag: 'SPECIAL OFFER',
    imageUrl: FOOD_PRESET_IMAGES[0].url,
    themeId: 'flame',
    imageStyle: 'cutout',
    isActive: true,
  });

  const loadPartnerPromotions = () => {
    if (!partner) return;
    const all = getPromotions();
    const mine = all.filter(
      (p) =>
        (partner.id && p.restaurantId === partner.id) ||
        (partner.email && p.restaurantEmail && p.restaurantEmail.toLowerCase() === partner.email.toLowerCase()) ||
        (!p.restaurantId && !p.restaurantEmail)
    );
    setPromotions(mine);
  };

  useEffect(() => {
    loadPartnerPromotions();
    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'PROMOTION_MUTATION' || event.type === 'CROSS_SYNC_MUTATION') {
        loadPartnerPromotions();
      }
    });
    return () => unsubscribe();
  }, [partner?.id, partner?.email]);

  const handleOpenAddModal = () => {
    setEditingPromo(null);
    setFormData({
      title: 'Flame-grilled Chicken. Bold Flavour.',
      subtitle: 'PERi-PERi your way.',
      ctaText: 'Order Now ->',
      discountTag: 'SPECIAL OFFER',
      imageUrl: FOOD_PRESET_IMAGES[0].url,
      themeId: 'flame',
      imageStyle: 'cutout',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (promo) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title || '',
      subtitle: promo.subtitle || '',
      ctaText: promo.ctaText || 'Order Now ->',
      discountTag: promo.discountTag || '',
      imageUrl: promo.imageUrl || FOOD_PRESET_IMAGES[0].url,
      themeId: promo.themeId || 'flame',
      imageStyle: promo.imageStyle || 'cutout',
      isActive: promo.isActive !== false,
    });
    setShowModal(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a banner title!');
      return;
    }

    const payload = {
      id: editingPromo ? editingPromo.id : `PROMO-${Date.now()}`,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      ctaText: formData.ctaText.trim() || 'Order Now ->',
      discountTag: formData.discountTag.trim(),
      imageUrl: formData.imageUrl.trim() || FOOD_PRESET_IMAGES[0].url,
      themeId: formData.themeId || 'flame',
      imageStyle: formData.imageStyle || 'cutout',
      isActive: formData.isActive,
      restaurantId: partner?.id || 'RESTO-1',
      restaurantName: partner?.name || restaurantName,
      restaurantEmail: partner?.email || '',
      createdAt: new Date().toISOString(),
    };

    savePromotion(payload);
    setShowModal(false);
    loadPartnerPromotions();
  };

  const handleToggleActive = (id, e) => {
    e.stopPropagation();
    togglePromotionStatus(id);
    loadPartnerPromotions();
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this promotion ad banner?')) {
      deletePromotion(id);
      loadPartnerPromotions();
    }
  };

  const currentTheme = BANNER_THEMES.find((t) => t.id === formData.themeId) || BANNER_THEMES[0];

  return (
    <div className="flex-1 flex flex-col bg-surface dark:bg-surface-dim overflow-y-auto">
      {/* Top Header */}
      <header className="bg-surface dark:bg-surface-dim px-4 py-3 border-b border-outline-variant/20 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </button>
          <div>
            <h1 className="font-bold text-sm text-on-surface leading-tight">Promotions & Banners</h1>
            <p className="text-[10px] text-on-surface-variant font-medium">{restaurantName} Ad Studio</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-coral-orange hover:bg-coral-orange/90 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Create Custom Ad Banner</span>
        </button>
      </header>

      {/* Main Container */}
      <div className="p-4 flex flex-col gap-4">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-xl">campaign</span>
          </div>
          <div>
            <h3 className="font-headline font-extrabold text-xs text-on-surface">Promote Your Kitchen Offers</h3>
            <p className="text-[11px] text-on-surface-variant leading-snug mt-0.5">
              Create gourmet circular plate ad banners that feature live on the Customer App Home Carousel!
            </p>
          </div>
        </div>

        {/* Promotions List */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-on-surface-variant">
              Your Active Kitchen Banners ({promotions.length})
            </h3>
          </div>

          {promotions.length === 0 ? (
            <div className="bg-surface-container rounded-3xl p-8 text-center border border-outline-variant/30 flex flex-col items-center justify-center my-4">
              <div className="w-16 h-16 rounded-full bg-coral-orange/15 text-coral-orange flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface mb-1">No Promotion Banners Created Yet</h4>
              <p className="text-xs text-on-surface-variant max-w-xs mb-4">
                Upload photos from your folder or enter URLs to generate gourmet circular plate ad banners.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="bg-coral-orange text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-md"
              >
                + Create Custom Ad Banner
              </button>
            </div>
          ) : (
            promotions.map((promo) => {
              const theme = BANNER_THEMES.find((t) => t.id === promo.themeId) || BANNER_THEMES[0];
              return (
                <div
                  key={promo.id}
                  className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-3 relative overflow-hidden"
                >
                  {/* Ultra-Premium Circular Plate Banner Visual Box */}
                  <div className={`relative rounded-3xl overflow-hidden ${theme.bgClass} text-white p-4 min-h-[140px] flex justify-between items-center shadow-lg border border-white/10 group`}>
                    {/* Ambient Background Glow */}
                    <div className="absolute right-2 top-2 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="space-y-1.5 z-10 max-w-[60%]">
                      <div className="flex items-center gap-1.5">
                        {promo.discountTag && (
                          <span className={`text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${theme.badgeBg}`}>
                            🔥 {promo.discountTag}
                          </span>
                        )}
                      </div>

                      <h4 className="font-headline font-black text-base leading-snug drop-shadow-md tracking-tight">
                        {promo.title}
                      </h4>

                      <p className="text-[11px] text-white/95 font-medium leading-tight">
                        {promo.subtitle}
                      </p>

                      <div className="pt-1.5">
                        <span className={`text-[10px] font-extrabold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 shadow-md transition-transform group-hover:scale-105 ${theme.btnClass}`}>
                          <span>{promo.ctaText || 'Order Now ->'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Gourmet Image Container Component */}
                    <PromoBannerImage
                      imageUrl={promo.imageUrl}
                      imageStyle={promo.imageStyle || 'cutout'}
                      title={promo.title}
                      size="md"
                    />
                  </div>

                  {/* Footer Controls */}
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-2">
                      <span
                        onClick={(e) => handleToggleActive(promo.id, e)}
                        className={`cursor-pointer px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all flex items-center gap-1 ${
                          promo.isActive
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-500/15 border-slate-400/40 text-slate-500'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${promo.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                        <span>{promo.isActive ? 'LIVE ON CUSTOMER APP' : 'PAUSED'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(promo)}
                        className="px-3 py-1 bg-surface-container-high border border-outline-variant/30 rounded-xl text-[11px] font-bold text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={(e) => handleDelete(promo.id, e)}
                        className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-xl text-[11px] font-bold text-red-600 hover:bg-red-500/20 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add / Edit Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface dark:bg-surface-container-high rounded-3xl p-5 border border-outline-variant/30 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <h3 className="font-headline font-extrabold text-sm text-on-surface">
                {editingPromo ? 'Edit Promotion Banner' : 'Create Custom Ad Banner'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-on-surface-variant block mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flame-grilled Chicken. Bold Flavour."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface focus:border-coral-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-on-surface-variant block mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  placeholder="e.g. PERi-PERi your way."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface focus:border-coral-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-on-surface-variant block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Order Now ->"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface focus:border-coral-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-on-surface-variant block mb-1">Offer Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. SPECIAL OFFER"
                    value={formData.discountTag}
                    onChange={(e) => setFormData({ ...formData, discountTag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface focus:border-coral-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Theme Selector Grid */}
              <div>
                <label className="font-extrabold text-on-surface-variant block mb-1">Select Banner Visual Style Theme:</label>
                <div className="grid grid-cols-2 gap-2">
                  {BANNER_THEMES.map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => setFormData({ ...formData, themeId: theme.id })}
                      className={`p-2 rounded-xl cursor-pointer border transition-all text-[11px] font-bold flex items-center justify-between ${
                        formData.themeId === theme.id
                          ? 'border-coral-orange bg-coral-orange/10 text-coral-orange shadow-xs scale-102'
                          : 'border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <span>{theme.name}</span>
                      <span className={`w-4 h-4 rounded-full ${theme.bgClass} shadow-xs border border-white/20`}></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Image Framing Style Selector */}
              <div>
                <label className="font-extrabold text-on-surface-variant block mb-1">Select Food Image Framing Style:</label>
                <div className="flex flex-col gap-1.5">
                  {IMAGE_STYLES.map((style) => (
                    <div
                      key={style.id}
                      onClick={() => setFormData({ ...formData, imageStyle: style.id })}
                      className={`p-2.5 rounded-xl cursor-pointer border transition-all text-xs flex items-center justify-between ${
                        formData.imageStyle === style.id
                          ? 'border-coral-orange bg-coral-orange/10 text-coral-orange shadow-xs'
                          : 'border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold block">{style.name}</span>
                        <span className="text-[10px] text-on-surface-variant block mt-0.5">{style.desc}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.imageStyle === style.id ? 'border-coral-orange bg-coral-orange' : 'border-outline-variant'}`}>
                        {formData.imageStyle === style.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Photo Source Section */}
              <div>
                <label className="font-extrabold text-on-surface-variant block mb-1">Banner Food Photo Source</label>

                {/* Option A: Laptop / Phone File Upload */}
                <div className="mb-2">
                  <label className="w-full cursor-pointer bg-coral-orange/15 hover:bg-coral-orange/25 border border-coral-orange/30 rounded-xl px-3 py-2 text-center text-xs font-extrabold text-coral-orange flex items-center justify-center gap-1.5 transition-colors select-none">
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    <span>📁 Upload Photo from Laptop / Mobile Folder</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Option B: Image URL */}
                <input
                  type="url"
                  placeholder="Or paste Image URL (https://...)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container text-on-surface focus:border-coral-orange focus:outline-none mb-2"
                />

                {/* Option C: Food Presets */}
                <label className="font-bold text-on-surface-variant block mb-1 text-[11px]">Or Pick High Quality Food Preset:</label>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                  {FOOD_PRESET_IMAGES.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset.url}
                      alt={preset.name}
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className={`w-12 h-12 object-cover rounded-full border-2 cursor-pointer transition-transform shrink-0 ${
                        formData.imageUrl === preset.url
                          ? 'border-coral-orange scale-105 shadow-md ring-2 ring-coral-orange/40'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-coral-orange rounded"
                />
                <label htmlFor="isActiveToggle" className="font-extrabold text-on-surface cursor-pointer select-none">
                  Enable and show live in Customer App
                </label>
              </div>

              {/* Ultra-Premium Live Preview Box with Circular Plate Image */}
              <div className="pt-2">
                <label className="font-extrabold text-on-surface-variant block mb-1">Customer Carousel Live Preview:</label>
                <div className={`relative rounded-3xl overflow-hidden ${currentTheme.bgClass} text-white p-3.5 min-h-[120px] flex justify-between items-center shadow-lg border border-white/10`}>
                  <div className="space-y-1 max-w-[62%] z-10">
                    {formData.discountTag && (
                      <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${currentTheme.badgeBg}`}>
                        🔥 {formData.discountTag}
                      </span>
                    )}
                    <h5 className="font-headline font-black text-xs leading-snug drop-shadow-sm">{formData.title || 'Banner Title'}</h5>
                    <p className="text-[10px] text-white/95 font-medium leading-tight">{formData.subtitle || 'Banner description'}</p>
                    <div className="pt-1">
                      <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full inline-block shadow-md ${currentTheme.btnClass}`}>
                        {formData.ctaText || 'Order Now ->'}
                      </span>
                    </div>
                  </div>

                  {/* Circular Plate Live Preview Component */}
                  <PromoBannerImage
                    imageUrl={formData.imageUrl || FOOD_PRESET_IMAGES[0].url}
                    imageStyle={formData.imageStyle || 'cutout'}
                    title={formData.title}
                    size="sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface font-bold hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-coral-orange text-white font-extrabold shadow-md hover:bg-coral-orange/90 active:scale-95 transition-all"
                >
                  {editingPromo ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

