import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getActivePartner,
  getDishes,
  getOrders,
  getRestaurants,
  saveDish,
  saveRestaurant,
  setActivePartnerStore,
  subscribeToEvents,
  toggleDishStockStore,
  deleteDishStore,
  updateOrderStatusStore,
} from '../services/store';
import {
  startOrderRingtone,
  stopOrderRingtone,
  toggleMuteRingtone,
} from '../services/soundService';

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [partner, setPartner] = useState(() => {
    const active = getActivePartner();
    if (active && active.isLoggedIn) {
      return active;
    }
    return null;
  });

  const [isOnline, setIsOnline] = useState(() => partner?.isOnline === true);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // Sync dishes and orders specifically for the logged in partner & handle ringing
  useEffect(() => {
    if (!partner || !partner.email) {
      setDishes([]);
      setOrders([]);
      stopOrderRingtone();
      return;
    }

    const refreshPartnerData = () => {
      const allDishes = getDishes();
      const allRestaurants = getRestaurants();

      // Find IDs of other registered restaurants
      const otherRestaurantIds = new Set(
        allRestaurants
          .filter((r) => r.id !== partner.id && (!partner.email || r.email?.toLowerCase() !== partner.email?.toLowerCase()))
          .map((r) => r.id)
      );

      // Reconcile and link all existing manually added dishes to active partner if orphaned or unlinked
      let hasUpdates = false;
      const reconciledDishes = allDishes.map((d) => {
        if (!d) return d;
        const isDirectMatch =
          (partner.id && d.restaurantId === partner.id) ||
          (partner.email && d.restaurantEmail && d.restaurantEmail.toLowerCase() === partner.email.toLowerCase()) ||
          (partner.name && d.restaurantName && d.restaurantName.toLowerCase() === partner.name.toLowerCase());

        const isOrphaned = !d.restaurantId || !otherRestaurantIds.has(d.restaurantId);

        if (isDirectMatch || isOrphaned) {
          const needsPartnerIdUpdate = d.restaurantId !== partner.id;
          const needsPartnerNameUpdate = partner.name && d.restaurantName !== partner.name;
          const needsPartnerEmailUpdate = partner.email && d.restaurantEmail !== partner.email;

          if (needsPartnerIdUpdate || needsPartnerNameUpdate || needsPartnerEmailUpdate) {
            hasUpdates = true;
            return {
              ...d,
              restaurantId: partner.id,
              restaurantName: partner.name || d.restaurantName,
              restaurantEmail: partner.email || d.restaurantEmail,
            };
          }
        }
        return d;
      });

      if (hasUpdates) {
        try {
          localStorage.setItem('innodine_dishes', JSON.stringify(reconciledDishes));
        } catch (e) {}
      }

      const partnerDishes = reconciledDishes.filter(
        (d) =>
          d &&
          ((partner.id && d.restaurantId === partner.id) ||
            (partner.email && d.restaurantEmail && d.restaurantEmail.toLowerCase() === partner.email.toLowerCase()) ||
            (partner.name && d.restaurantName && d.restaurantName.toLowerCase() === partner.name.toLowerCase()) ||
            !otherRestaurantIds.has(d.restaurantId))
      );
      setDishes(partnerDishes);

      const allOrders = getOrders();
      const partnerOrders = allOrders.filter(
        (o) =>
          (partner.id && o.restaurantId === partner.id) ||
          (partner.email && o.restaurantEmail && o.restaurantEmail.toLowerCase() === partner.email.toLowerCase()) ||
          (partner.name && o.restaurantName && o.restaurantName.toLowerCase() === partner.name.toLowerCase())
      );
      setOrders(partnerOrders);

      // Check if there are any unaccepted 'New' orders for this kitchen
      const unacceptedNewOrders = partnerOrders.filter((o) => o.status === 'New');
      if (unacceptedNewOrders.length > 0) {
        startOrderRingtone();
      } else {
        stopOrderRingtone();
      }
    };

    refreshPartnerData();

    // High frequency interval ensures instantaneous order delivery cross-tabs/cross-ports without reloading
    const pollInterval = setInterval(() => {
      refreshPartnerData();
    }, 800);

    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'NEW_ORDER_PLACED' || event.type === 'ORDER_STATUS_MUTATION') {
        refreshPartnerData();
      }
      if (event.type === 'DISH_MUTATION' || event.type === 'CROSS_SYNC_MUTATION') {
        refreshPartnerData();
      }
      if (event.type === 'RESTAURANT_MUTATION') {
        const active = getActivePartner();
        if (active && partner && active.id === partner.id) {
          setPartner(active);
          setIsOnline(active.isOnline === true);
        }
      }
    });

    return () => {
      clearInterval(pollInterval);
      unsubscribe();
      stopOrderRingtone();
    };
  }, [partner?.id, partner?.email, partner?.name]);

  const restaurantName = partner?.name || 'Registered Kitchen';

  const registerPartner = (partnerData) => {
    const partnerEmail = (partnerData.email || `kitchen${Date.now()}@innodine.com`).trim().toLowerCase();
    const allRestaurants = getRestaurants();
    const existing = allRestaurants.find(
      (r) => r.email && r.email.toLowerCase() === partnerEmail
    );

    if (existing) {
      return { success: false, message: 'Kitchen email already registered! Please Partner Sign In.' };
    }

    const newPartner = {
      id: `RESTO-${Date.now()}`,
      name: partnerData.restaurantName || partnerData.name || 'New Kitchen',
      managerName: partnerData.managerName || 'Owner',
      email: partnerEmail,
      password: partnerData.password || 'password123',
      phone: partnerData.phone || '+91 98765 43210',
      address: partnerData.address || '123 Food Street, Cyber Hub',
      fssai: partnerData.fssai || '11522003000841',
      cuisine: partnerData.cuisine || 'Multi-Cuisine',
      isOnline: false, // Default to OFFLINE on new registration!
      isLoggedIn: true,
      isPaid: true,
      paidAmount: 500,
      paymentTxnId: partnerData.paymentTxnId || `TXN-INNO-${Date.now()}`,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    saveRestaurant(newPartner);
    setActivePartnerStore(newPartner);
    setPartner(newPartner);
    setIsOnline(false); // Set OFFLINE
    return { success: true, partner: newPartner };
  };

  const loginPartner = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const allRestaurants = getRestaurants();
    let existing = allRestaurants.find(
      (r) => r.email && r.email.toLowerCase() === cleanEmail
    );

    if (!existing) {
      try {
        const backendRes = await api.login(cleanEmail, password);
        if (backendRes && backendRes.success && backendRes.user) {
          existing = backendRes.user;
          saveRestaurant(existing);
        }
      } catch (e) {}
    }

    if (!existing) {
      return { success: false, message: 'Kitchen account not registered! Please Register Kitchen first.' };
    }

    if (existing.password && existing.password !== password) {
      return { success: false, message: 'Incorrect password! Please try again.' };
    }

    const targetPartner = { ...existing, isLoggedIn: true };
    saveRestaurant(targetPartner);
    setActivePartnerStore(targetPartner);
    setPartner(targetPartner);
    setIsOnline(targetPartner.isOnline === true);
    return { success: true, partner: targetPartner };
  };

  const logoutPartner = () => {
    stopOrderRingtone();
    if (partner) {
      const updated = { ...partner, isLoggedIn: false };
      saveRestaurant(updated);
    }
    setActivePartnerStore(null);
    setPartner(null);
    setIsOnline(false);
    setDishes([]);
    setOrders([]);
  };

  const toggleOnlineStatus = () => {
    if (!partner) return;
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    const updated = { ...partner, isOnline: nextStatus };
    saveRestaurant(updated);
    setActivePartnerStore(updated);
    setPartner(updated);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    stopOrderRingtone();
    updateOrderStatusStore(orderId, newStatus);
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, updatedAt: Date.now() } : o));
      const remainingNew = updated.filter((o) => o.status === 'New');
      if (remainingNew.length === 0) {
        stopOrderRingtone();
      }
      return updated;
    });
  };

  const acceptAllNewOrders = () => {
    stopOrderRingtone();
    const currentOrders = getOrders();
    currentOrders.forEach((o) => {
      if (o.status === 'New') {
        updateOrderStatusStore(o.id, 'Preparing');
      }
    });
    setOrders((prev) => prev.map((o) => (o.status === 'New' ? { ...o, status: 'Preparing', updatedAt: Date.now() } : o)));
    stopOrderRingtone();
  };

  const handleToggleMute = () => {
    const muted = toggleMuteRingtone();
    setIsMuted(muted);
  };

  const toggleDishStock = (dishId) => {
    toggleDishStockStore(dishId);
  };

  const removeDish = (dishId) => {
    deleteDishStore(dishId);
  };

  const addDish = (dishData) => {
    if (!partner) return null;
    const createdDish = saveDish({
      ...dishData,
      id: dishData.id || `dish-${Date.now()}`,
      restaurantId: partner.id,
      restaurantName: partner.name,
      restaurantEmail: partner.email,
      inStock: dishData.inStock !== undefined ? dishData.inStock : true,
    });
    return createdDish;
  };

  const newOrdersCount = orders.filter((o) => o.status === 'New').length;

  // Calculate today's earnings & today's orders count strictly for orders placed today
  const todayOrders = orders.filter((o) => {
    if (!o.placedAt) return false;
    const orderDate = new Date(o.placedAt).toDateString();
    const todayDate = new Date().toDateString();
    return orderDate === todayDate;
  });

  const todayEarnings = todayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const todayOrdersCount = todayOrders.length;

  // Calculate TOTAL earnings & TOTAL orders count across all orders (for Earning Page & Pocket Balance)
  const totalEarnings = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = orders.length;

  return (
    <RestaurantContext.Provider
      value={{
        partner,
        registerPartner,
        loginPartner,
        logoutPartner,
        isOnline,
        toggleOnlineStatus,
        restaurantName,
        orders,
        newOrdersCount,
        updateOrderStatus,
        acceptAllNewOrders,
        isMuted,
        handleToggleMute,
        selectedOrderId,
        setSelectedOrderId,
        dishes,
        toggleDishStock,
        addDish,
        removeDish,
        todayEarnings,
        todayOrdersCount,
        totalEarnings,
        totalOrdersCount,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  return useContext(RestaurantContext);
}
