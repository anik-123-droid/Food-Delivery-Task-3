import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const STANDARD_CATEGORIES = [
  'Combos & Meals',
  'Pizza',
  'Burger',
  'Biryani',
  'Chinese',
  'South Indian',
  'North Indian',
  'Rolls & Wraps',
  'Sandwiches',
  'Beverages & Shakes',
  'Desserts & Ice Cream',
  'Snacks & Starters',
];

export default function MenuManager() {
  const { dishes, toggleDishStock, addDish, removeDish } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [imageInputMode, setImageInputMode] = useState('file'); // 'file' or 'url'
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const [newDish, setNewDish] = useState({
    name: '',
    category: 'Combos & Meals',
    price: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  });

  // Dynamically compute all categories present in dishes plus standard list
  const existingCategories = Array.from(new Set(dishes.map((d) => d.category).filter(Boolean)));
  const allCategoryTabs = ['All', ...Array.from(new Set([...existingCategories, ...STANDARD_CATEGORIES]))];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDish({ ...newDish, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingDish(null);
    setNewDish({
      name: '',
      category: 'Combos & Meals',
      price: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    });
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (dish) => {
    setEditingDish(dish);
    setNewDish({
      id: dish.id,
      name: dish.name,
      category: dish.category,
      price: dish.price,
      description: dish.description || '',
      image: dish.image,
    });
    if (!STANDARD_CATEGORIES.includes(dish.category)) {
      setIsCustomCategory(true);
      setCustomCategoryInput(dish.category);
    } else {
      setIsCustomCategory(false);
      setCustomCategoryInput('');
    }
    setShowAddModal(true);
  };

  const filteredDishes = dishes.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) return;

    const finalCategory = isCustomCategory ? customCategoryInput.trim() || 'Combos' : newDish.category;

    addDish({
      ...newDish,
      id: editingDish ? editingDish.id : undefined,
      category: finalCategory,
      price: Number(newDish.price),
    });

    setNewDish({
      name: '',
      category: 'Combos & Meals',
      price: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    });
    setEditingDish(null);
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-surface dark:bg-surface-dim">
      {/* Top Bar Header */}
      <header className="bg-surface dark:bg-surface-dim px-4 py-3 border-b border-outline-variant/20 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="font-bold text-base text-on-surface leading-tight">Menu Manager</h1>
          <p className="text-[10px] text-on-surface-variant">Manage kitchen menu & dish categories</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-3 py-1.5 bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] text-[#F2E8CF] rounded-xl text-xs font-bold flex items-center gap-1 shadow-md hover:opacity-95 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Dish
        </button>
      </header>

      {/* Main Area */}
      <div className="p-3 flex flex-col gap-3">
        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search dish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-xs focus:outline-none focus:border-[#3A5A40]"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
          {allCategoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all shrink-0 border ${
                selectedCategory === cat
                  ? 'bg-[#3A5A40] text-[#F2E8CF] border-[#3A5A40] shadow-xs'
                  : 'bg-surface-container text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2x2 Grid Layout for Dishes (2 Dishes per Row) */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant text-xs">
            No dishes found in menu. Click "+ Add Dish" above to add new items!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 mt-1">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-surface-container rounded-2xl p-2.5 border border-outline-variant/30 shadow-xs flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative mb-2">
                  <img src={dish.image} alt={dish.name} className="w-full h-24 rounded-xl object-cover" />
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-black px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-xs truncate max-w-[85%]">
                    {dish.category}
                  </span>
                </div>

                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-on-surface truncate leading-tight" title={dish.name}>
                      {dish.name}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant/70 line-clamp-1 mt-0.5">{dish.description}</p>
                    <p className="text-xs font-black text-primary mt-1">₹{dish.price}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-outline-variant/20">
                    {/* Stock Toggle Button */}
                    <button
                      onClick={() => toggleDishStock(dish.id)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-colors ${
                        dish.inStock
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {dish.inStock ? 'IN STOCK' : 'OUT'}
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Edit Dish Button */}
                      <button
                        onClick={() => handleOpenEditModal(dish)}
                        className="p-1 text-primary hover:bg-primary/15 rounded-lg transition-colors"
                        title="Edit Dish"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>

                      {/* Delete Dish Button */}
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${dish.name}"?`)) {
                            removeDish(dish.id);
                          }
                        }}
                        className="p-1 text-error hover:bg-error/15 rounded-lg transition-colors"
                        title="Delete Dish"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-surface-dim rounded-3xl p-5 w-full max-w-sm border border-outline-variant/30 shadow-2xl flex flex-col gap-3 max-h-[85vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center sticky top-0 bg-surface dark:bg-surface-dim pb-2 border-b border-outline-variant/20 z-10">
              <h2 className="font-bold text-base text-on-surface">
                {editingDish ? 'Edit Menu Dish' : 'Add New Menu Dish'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. Crispy Burger & Fries Combo"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Category Selection Dropdown */}
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Category</label>
                  {!isCustomCategory ? (
                    <select
                      value={newDish.category}
                      onChange={(e) => {
                        if (e.target.value === 'CUSTOM_OPTION') {
                          setIsCustomCategory(true);
                        } else {
                          setNewDish({ ...newDish, category: e.target.value });
                        }
                      }}
                      className="w-full px-2.5 py-2 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface focus:outline-none font-bold"
                    >
                      {STANDARD_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="CUSTOM_OPTION">➕ Custom Category...</option>
                    </select>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Combos"
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="w-full px-2.5 py-2 pr-7 rounded-xl border border-primary bg-surface-container text-xs text-on-surface focus:outline-none font-bold"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomCategory(false)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-on-surface"
                        title="Back to dropdown"
                      >
                        ✖
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="249"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Image Input Options */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-on-surface-variant">Dish Image</label>
                  <div className="flex gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('file')}
                      className={`font-bold ${imageInputMode === 'file' ? 'text-primary underline' : 'text-on-surface-variant'}`}
                    >
                      📁 Device Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`font-bold ${imageInputMode === 'url' ? 'text-primary underline' : 'text-on-surface-variant'}`}
                    >
                      🔗 Paste URL
                    </button>
                  </div>
                </div>

                {imageInputMode === 'file' ? (
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-on-surface file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer"
                    />
                    {newDish.image && (
                      <div className="flex items-center gap-2 mt-1">
                        <img src={newDish.image} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-outline-variant" />
                        <span className="text-[10px] text-amber-600 font-bold">Image selected ✓</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Paste Image URL here..."
                      value={newDish.image}
                      onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                    <div className="flex gap-1.5 mt-1.5 overflow-x-auto hide-scrollbar">
                      {[
                        { label: '🎁 Combo', url: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=400&q=80' },
                        { label: '🍕 Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' },
                        { label: '🍔 Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
                        { label: '🍟 Fries', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80' },
                        { label: '🥤 Shake', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80' },
                        { label: '🍲 Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewDish({ ...newDish, image: preset.url })}
                          className="px-2 py-0.5 bg-surface-variant text-[10px] font-bold rounded-lg shrink-0 hover:bg-primary/20 text-on-surface"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-on-surface-variant block mb-1">Description</label>
                <textarea
                  placeholder="Short description..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface focus:outline-none h-14 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] text-[#F2E8CF] font-bold text-xs shadow-md hover:opacity-95"
                >
                  {editingDish ? 'Update Dish' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

