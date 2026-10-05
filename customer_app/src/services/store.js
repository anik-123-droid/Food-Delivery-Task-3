// Real-Time Shared Store Engine for InnoDine Ecosystem with MongoDB Atlas API Integration
import { api } from './api';

const CHANNEL_NAME = 'innodine_realtime_bus';
let broadcastChannel = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported, falling back to storage events');
}

const KEYS = {
  RESTAURANTS: 'innodine_restaurants',
  DISHES: 'innodine_dishes',
  USERS: 'innodine_users',
  ACTIVE_USER: 'innodine_active_user',
  ACTIVE_PARTNER: 'innodine_active_partner',
  ORDERS: 'innodine_orders',
  PROMOTIONS: 'innodine_promotions',
};

const STATUS_WEIGHTS = {
  New: 1,
  Preparing: 2,
  Ready: 3,
  Delivered: 4,
  Cancelled: 5,
};

const mergeOrdersList = (localList = [], remoteList = []) => {
  const map = new Map();
  (Array.isArray(localList) ? localList : []).forEach((o) => {
    if (o && o.id) map.set(o.id, o);
  });

  (Array.isArray(remoteList) ? remoteList : []).forEach((remote) => {
    if (!remote || !remote.id) return;
    const local = map.get(remote.id);
    if (!local) {
      map.set(remote.id, remote);
    } else {
      const localWeight = STATUS_WEIGHTS[local.status] || 0;
      const remoteWeight = STATUS_WEIGHTS[remote.status] || 0;
      if (remoteWeight > localWeight) {
        map.set(remote.id, { ...local, ...remote });
      } else if (remoteWeight === localWeight && (remote.updatedAt || 0) >= (local.updatedAt || 0)) {
        map.set(remote.id, { ...local, ...remote });
      }
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const timeA = new Date(a.placedAt || a.updatedAt || 0).getTime();
    const timeB = new Date(b.placedAt || b.updatedAt || 0).getTime();
    return timeB - timeA;
  });
};

const listeners = new Set();
let isBridgeApplying = false;

// Cross-Origin Sync Bridge Infrastructure
let bridgeIframe = null;

const initBridge = () => {
  if (typeof window === 'undefined' || bridgeIframe) return;
  try {
    const currentPort = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
    const targetPort = currentPort === '3000' ? '3001' : '3000';
    const bridgeUrl = `http://localhost:${targetPort}/sync-bridge.html`;

    bridgeIframe = document.createElement('iframe');
    bridgeIframe.src = bridgeUrl;
    bridgeIframe.style.display = 'none';
    bridgeIframe.id = 'innodine_sync_bridge';

    bridgeIframe.onload = () => {
      try {
        if (bridgeIframe.contentWindow) {
          bridgeIframe.contentWindow.postMessage({ type: 'INNODINE_REQUEST_SYNC' }, '*');
        }
      } catch (err) {}
    };

    window.addEventListener('message', (event) => {
      if (!event.data || !event.data.type) return;

      if (
        event.data.type === 'INNODINE_CROSS_SYNC_RESPONSE' ||
        event.data.type === 'INNODINE_CROSS_STORAGE' ||
        event.data.type === 'INNODINE_CROSS_EVENT'
      ) {
        isBridgeApplying = true;
        try {
          if (event.data.key && event.data.value !== undefined) {
            try {
              if (event.data.key === KEYS.ORDERS) {
                const localOrders = getOrders();
                const incomingOrders = typeof event.data.value === 'string' ? JSON.parse(event.data.value) : event.data.value;
                const merged = mergeOrdersList(localOrders, incomingOrders);
                localStorage.setItem(KEYS.ORDERS, JSON.stringify(merged));
              } else {
                localStorage.setItem(event.data.key, event.data.value);
              }
            } catch (e) {}
          }

          if (event.data.fullData && typeof event.data.fullData === 'object') {
            Object.keys(event.data.fullData).forEach((k) => {
              // Only sync shared collections (dishes, orders, restaurants, users) — do not overwrite active user/partner
              if (k === KEYS.DISHES || k === KEYS.ORDERS || k === KEYS.RESTAURANTS || k === KEYS.USERS || k === KEYS.PROMOTIONS) {
                const val = event.data.fullData[k];
                if (val !== null && val !== undefined) {
                  try {
                    if (k === KEYS.ORDERS) {
                      const localOrders = getOrders();
                      const incomingOrders = typeof val === 'string' ? JSON.parse(val) : val;
                      const merged = mergeOrdersList(localOrders, incomingOrders);
                      localStorage.setItem(KEYS.ORDERS, JSON.stringify(merged));
                    } else {
                      localStorage.setItem(k, val);
                    }
                  } catch (e) {}
                }
              }
            });
          }
        } finally {
          setTimeout(() => { isBridgeApplying = false; }, 30);
        }

        // Notify all subscribers INSTANTLY
        const evt = event.data.event || { type: 'CROSS_SYNC_MUTATION', payload: {} };
        listeners.forEach((cb) => {
          try { cb(evt); } catch (e) {}
        });
      }
    });

    document.body.appendChild(bridgeIframe);
  } catch (e) {
    console.warn('Cross-origin sync bridge init error:', e);
  }
};

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initBridge, 50);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(initBridge, 50));
  }
}

// Fetch initial data from MongoDB Atlas on application startup without overwriting local data
const syncFromMongoAtlas = async () => {
  try {
    const mongoDishes = await api.getDishes();
    if (mongoDishes && mongoDishes.length > 0) {
      const localDishes = getDishes();
      if (localDishes.length === 0) {
        setStorageItem(KEYS.DISHES, mongoDishes);
      }
    }

    const mongoOrders = await api.getOrders();
    if (mongoOrders && mongoOrders.length > 0) {
      const localOrders = getOrders();
      if (localOrders.length === 0) {
        setStorageItem(KEYS.ORDERS, mongoOrders);
      }
    }
  } catch (err) {
    console.warn('Initial MongoDB Atlas fetch note:', err.message);
  }
};

syncFromMongoAtlas();

// Helper utilities for Storage
const getStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    const stringified = JSON.stringify(value);
    localStorage.setItem(key, stringified);

    if (!isBridgeApplying && bridgeIframe && bridgeIframe.contentWindow) {
      try {
        bridgeIframe.contentWindow.postMessage({
          type: 'INNODINE_WRITE_STORAGE',
          key,
          value: stringified,
        }, '*');
      } catch (err) {}
    }
  } catch (e) {
    console.error('Error saving to storage:', e);
  }
};

// Broadcast Event Dispatcher
export const broadcastEvent = (eventType, payload = {}) => {
  const message = { type: eventType, payload, timestamp: Date.now() };
  if (broadcastChannel) {
    broadcastChannel.postMessage(message);
  }
  try { localStorage.setItem('innodine_last_event', JSON.stringify(message)); } catch (e) {}

  if (!isBridgeApplying && bridgeIframe && bridgeIframe.contentWindow) {
    try {
      bridgeIframe.contentWindow.postMessage({
        type: 'INNODINE_WRITE_STORAGE',
        key: 'innodine_last_event',
        value: JSON.stringify(message),
      }, '*');
    } catch (e) {}
  }

  listeners.forEach((cb) => {
    try { cb(message); } catch (e) {}
  });
};

// Subscribe to Real-time Events
export const subscribeToEvents = (callback) => {
  listeners.add(callback);

  const handleMessage = (event) => {
    if (event.data && event.data.type) {
      callback(event.data);
    }
  };

  const handleStorageChange = (e) => {
    if (e.key && e.key.startsWith('innodine_')) {
      callback({ type: 'STORAGE_CHANGE', key: e.key });
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorageChange);

  return () => {
    listeners.delete(callback);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorageChange);
  };
};

// API Surface for Restaurants
export const getRestaurants = () => getStorageItem(KEYS.RESTAURANTS, []);
export const saveRestaurant = (restaurant) => {
  const list = getRestaurants();
  const targetId = restaurant.id || (restaurant.email ? `RESTO-${restaurant.email.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : `RESTO-${Date.now()}`);
  const cleanRestaurant = { ...restaurant, id: targetId };

  const index = list.findIndex(
    (r) => r.id === targetId || (r.email && cleanRestaurant.email && r.email.toLowerCase() === cleanRestaurant.email.toLowerCase())
  );
  let updatedList;
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = { ...updatedList[index], ...cleanRestaurant };
  } else {
    updatedList = [...list, cleanRestaurant];
  }

  setStorageItem(KEYS.RESTAURANTS, updatedList);

  const currentActive = getActivePartner();
  if (currentActive && currentActive.id === cleanRestaurant.id) {
    setStorageItem(KEYS.ACTIVE_PARTNER, { ...currentActive, ...cleanRestaurant });
  }

  broadcastEvent('RESTAURANT_MUTATION', cleanRestaurant);

  // Sync with MongoDB Atlas
  api.updateRestaurant(cleanRestaurant);
  return cleanRestaurant;
};

// API Surface for Dishes
export const getDishes = () => {
  const rawDishes = getStorageItem(KEYS.DISHES, []);
  return Array.isArray(rawDishes) ? rawDishes.filter((d) => d && d.name) : [];
};
export const saveDish = (dish) => {
  const list = getDishes();
  const index = list.findIndex((d) => d.id === dish.id);
  let updatedList;
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = { ...updatedList[index], ...dish };
  } else {
    updatedList = [...list, dish];
  }
  setStorageItem(KEYS.DISHES, updatedList);
  broadcastEvent('DISH_MUTATION', dish);

  // Sync to MongoDB Atlas
  api.addDish(dish);
  return dish;
};

export const toggleDishStockStore = (dishId) => {
  const list = getDishes();
  const updatedList = list.map((d) => (d.id === dishId ? { ...d, inStock: !d.inStock } : d));
  setStorageItem(KEYS.DISHES, updatedList);
  broadcastEvent('DISH_MUTATION', { id: dishId });

  const target = updatedList.find(d => d.id === dishId);
  if (target) {
    api.updateDish(dishId, { inStock: target.inStock });
  }
};

export const deleteDishStore = (dishId) => {
  const list = getDishes();
  const updatedList = list.filter((d) => d.id !== dishId);
  setStorageItem(KEYS.DISHES, updatedList);
  broadcastEvent('DISH_MUTATION', { id: dishId, deleted: true });

  // Sync deletion to MongoDB Atlas
  api.deleteDish(dishId);
};

// API Surface for Users
export const getUsers = () => getStorageItem(KEYS.USERS, []);
export const saveUser = (user) => {
  const list = getUsers();
  const index = list.findIndex((u) => u.email === user.email);
  let updatedList;
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = { ...updatedList[index], ...user };
  } else {
    updatedList = [...list, user];
  }
  setStorageItem(KEYS.USERS, updatedList);
  setStorageItem(KEYS.ACTIVE_USER, user);
  broadcastEvent('USER_MUTATION', user);

  // Register in MongoDB Atlas
  api.register(user);
  return user;
};

export const getActiveUser = () => getStorageItem(KEYS.ACTIVE_USER, null);
export const setActiveUserStore = (user) => setStorageItem(KEYS.ACTIVE_USER, user);

export const getActivePartner = () => getStorageItem(KEYS.ACTIVE_PARTNER, null);
export const setActivePartnerStore = (partner) => setStorageItem(KEYS.ACTIVE_PARTNER, partner);

// API Surface for Orders
export const getOrders = () => getStorageItem(KEYS.ORDERS, []);
export const createOrder = (orderData) => {
  const list = getOrders();
  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'New',
    placedAt: new Date().toISOString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...orderData,
  };
  const updatedList = [newOrder, ...list];
  setStorageItem(KEYS.ORDERS, updatedList);
  broadcastEvent('NEW_ORDER_PLACED', newOrder);

  // Sync Order to MongoDB Atlas
  api.createOrder(newOrder);
  return newOrder;
};

export const updateOrderStatusStore = (orderId, newStatus) => {
  const list = getOrders();
  const updatedList = list.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
  setStorageItem(KEYS.ORDERS, updatedList);
  broadcastEvent('ORDER_STATUS_MUTATION', { id: orderId, status: newStatus });

  // Sync status update to MongoDB Atlas
  api.updateOrderStatus(orderId, newStatus);
};

// API Surface for Promotional Ads & Banners
export const getPromotions = () => getStorageItem(KEYS.PROMOTIONS, []);

export const savePromotion = (promotion) => {
  const list = getPromotions();
  const targetId = promotion.id || `PROMO-${Date.now()}`;
  const cleanPromo = { ...promotion, id: targetId, isActive: promotion.isActive !== false };
  const index = list.findIndex((p) => p.id === targetId);
  let updatedList;
  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = { ...updatedList[index], ...cleanPromo };
  } else {
    updatedList = [cleanPromo, ...list];
  }
  setStorageItem(KEYS.PROMOTIONS, updatedList);
  broadcastEvent('PROMOTION_MUTATION', cleanPromo);
  return cleanPromo;
};

export const togglePromotionStatus = (promoId) => {
  const list = getPromotions();
  const updatedList = list.map((p) => (p.id === promoId ? { ...p, isActive: !p.isActive } : p));
  setStorageItem(KEYS.PROMOTIONS, updatedList);
  broadcastEvent('PROMOTION_MUTATION', { id: promoId });
};

export const deletePromotion = (promoId) => {
  const list = getPromotions();
  const updatedList = list.filter((p) => p.id !== promoId);
  setStorageItem(KEYS.PROMOTIONS, updatedList);
  broadcastEvent('PROMOTION_MUTATION', { id: promoId, deleted: true });
};

