import React, { createContext, useContext, useState, useEffect } from 'react';
import { createOrder, getOrders, getRestaurants, getActivePartner, subscribeToEvents } from '../services/store';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [toastItem, setToastItem] = useState(null);

  // Auto clear toast after 2.4 seconds
  useEffect(() => {
    if (toastItem) {
      const timer = setTimeout(() => {
        setToastItem(null);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [toastItem]);

  // Load user-specific active order whenever user changes or new orders arrive
  useEffect(() => {
    const updateActiveUserOrder = () => {
      if (!user || !user.isLoggedIn || !user.email) {
        setActiveOrder(null);
        return;
      }
      const allOrders = getOrders();
      const userOrders = allOrders.filter(
        (o) => o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()
      );
      if (userOrders.length > 0) {
        setActiveOrder(userOrders[0]);
      } else {
        setActiveOrder(null);
      }
    };

    updateActiveUserOrder();

    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'ORDER_STATUS_MUTATION' || event.type === 'NEW_ORDER_PLACED') {
        updateActiveUserOrder();
      }
    });

    return () => unsubscribe();
  }, [user?.email, user?.isLoggedIn]);

  // Load user-specific cart when user logs in/out
  useEffect(() => {
    if (!user || !user.isLoggedIn || !user.email) {
      setCartItems([]);
      return;
    }
    try {
      const savedCart = localStorage.getItem(`innodine_cart_${user.email.toLowerCase()}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      setCartItems([]);
    }
  }, [user?.email, user?.isLoggedIn]);

  // Save cart per user email
  const saveUserCart = (items) => {
    setCartItems(items);
    if (user && user.email) {
      try {
        localStorage.setItem(`innodine_cart_${user.email.toLowerCase()}`, JSON.stringify(items));
      } catch (e) {}
    }
  };

  const addToCart = (item) => {
    const restaurants = getRestaurants();
    const itemResto = restaurants.find(
      (r) =>
        (item.restaurantId && r.id === item.restaurantId) ||
        (item.restaurantEmail && r.email && r.email.toLowerCase() === item.restaurantEmail.toLowerCase()) ||
        (item.restaurantName && r.name && r.name.toLowerCase() === item.restaurantName.toLowerCase())
    );

    if (itemResto && itemResto.isOnline === false) {
      alert(`${itemResto.name || 'This kitchen'} is currently offline and not accepting orders!`);
      return;
    }

    const existing = cartItems.find((i) => i.id === item.id);
    let updated;
    if (existing) {
      updated = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [...cartItems, { ...item, quantity: 1 }];
    }
    saveUserCart(updated);
    // Trigger global animated toast notification
    setToastItem({ ...item, timestamp: Date.now() });
  };

  const removeFromCart = (itemId) => {
    const updated = cartItems.filter((i) => i.id !== itemId);
    saveUserCart(updated);
  };

  const updateQuantity = (itemId, delta) => {
    const updated = cartItems
      .map((i) => {
        if (i.id === itemId) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      })
      .filter(Boolean);
    saveUserCart(updated);
  };

  const clearCart = () => {
    saveUserCart([]);
  };

  const [couponApplied, setCouponApplied] = useState(false);

  const getCartSubtotal = () =>
    cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const getCartCount = () =>
    cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const getCartCalculations = (isCoupon = couponApplied) => {
    const rawSubtotal = getCartSubtotal();
    const discount = isCoupon ? Math.min(50, rawSubtotal) : 0;
    const subtotal = Math.max(0, rawSubtotal - discount);
    const deliveryFee = subtotal > 0 ? (subtotal > 300 ? 0 : 35) : 0;
    const taxes = Math.round(subtotal * 0.05);
    const total = Math.max(0, subtotal + deliveryFee + taxes);

    return { rawSubtotal, discount, subtotal, deliveryFee, taxes, total };
  };

  const placeOrder = (customerDetails) => {
    if (cartItems.length === 0) return null;

    const restaurants = getRestaurants();
    const activePartner = getActivePartner();
    const primaryItem = cartItems[0] || {};
    const itemResto = restaurants.find(
      (r) =>
        (primaryItem.restaurantId && r.id === primaryItem.restaurantId) ||
        (primaryItem.restaurantEmail && r.email && r.email.toLowerCase() === primaryItem.restaurantEmail.toLowerCase()) ||
        (primaryItem.restaurantName && r.name && r.name.toLowerCase() === primaryItem.restaurantName.toLowerCase())
    );

    if (itemResto && itemResto.isOnline === false) {
      alert(`${itemResto.name || 'Kitchen'} is currently offline. Orders cannot be placed right now!`);
      return null;
    }

    const currentEmail = customerDetails?.email || user?.email || 'guest@innodine.com';
    const currentName = customerDetails?.name || user?.name || currentEmail.split('@')[0];

    const { total: totalAmount } = getCartCalculations();
    const targetRestoId = primaryItem.restaurantId || itemResto?.id || activePartner?.id || '';
    const targetRestoName = primaryItem.restaurantName || itemResto?.name || activePartner?.name || 'Gourmet Kitchen';
    const targetRestoEmail = primaryItem.restaurantEmail || itemResto?.email || activePartner?.email || '';

    const orderPayload = {
      customerName: currentName,
      customerEmail: currentEmail,
      customerPhone: customerDetails?.phone || user?.phone || '+91 98765 43210',
      tableOrDelivery: `Delivery • ${customerDetails?.address || user?.address || 'Tech Park, Suite 404'}`,
      total: totalAmount,
      restaurantId: targetRestoId,
      restaurantName: targetRestoName,
      restaurantEmail: targetRestoEmail,
      items: cartItems.map((i) => ({
        name: i.name,
        qty: i.quantity,
        price: i.price,
        note: i.customization || '',
        restaurantId: i.restaurantId || targetRestoId,
        restaurantName: i.restaurantName || targetRestoName,
      })),
    };

    const newOrder = createOrder(orderPayload);
    setActiveOrder(newOrder);
    setCouponApplied(false);
    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartSubtotal,
        getCartCount,
        getCartCalculations,
        couponApplied,
        setCouponApplied,
        activeOrder,
        setActiveOrder,
        placeOrder,
      }}
    >
      {/* Global Floating Animated Add To Cart Toast Banner */}
      {toastItem && (
        <div
          key={toastItem.timestamp}
          className="fixed top-4 left-1/2 z-50 min-w-[300px] max-w-[92vw] bg-gradient-to-r from-[#1C261A] via-[#283618] to-[#3A5A40] text-[#F2E8CF] p-2.5 px-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-[#A3B18A]/40 animate-cart-toast flex items-center justify-between pointer-events-none"
        >
          <div className="flex items-center gap-3">
            {toastItem.image ? (
              <img
                src={toastItem.image}
                alt={toastItem.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#A3B18A]/50 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#A3B18A]/20 flex items-center justify-center text-[#F2E8CF] shrink-0">
                <span className="material-symbols-outlined text-xl">shopping_cart</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#A3B18A] text-sm font-bold animate-bounce">
                  check_circle
                </span>
                <span className="text-xs font-black font-headline tracking-wide uppercase text-[#FAF7EE]">
                  Added to Cart!
                </span>
              </div>
              <p className="text-[11px] text-[#F2E8CF]/90 font-bold truncate max-w-[180px]">
                {toastItem.name} • ₹{toastItem.price}
              </p>
            </div>
          </div>

          <div className="bg-[#FAF7EE]/20 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-[#F2E8CF] border border-[#A3B18A]/30 shrink-0">
            🛒 Cart ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
          </div>
        </div>
      )}

      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
