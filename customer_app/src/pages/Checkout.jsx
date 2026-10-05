import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AddressModal from '../components/AddressModal';
import FakePaymentModal from '../components/FakePaymentModal';

export default function Checkout({ onNavigate }) {
  const { cartItems, updateQuantity, getCartCalculations, couponApplied, setCouponApplied, placeOrder } = useCart();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [cookingInstruction, setCookingInstruction] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { rawSubtotal, discount, deliveryFee, taxes, total } = getCartCalculations();

  const handlePaymentSuccess = () => {
    placeOrder(user);
    setShowPaymentModal(false);
    onNavigate('tracking');
  };

  return (
    <div className="flex-1 pb-28 bg-[#FAF7EE] dark:bg-[#121A12] overflow-y-auto relative">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7EE]/90 dark:bg-[#1C261A]/90 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-[#E2D8C3] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 transition-all shadow-xs border border-[#E2D8C3] dark:border-slate-700"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <h2 className="text-base font-extrabold text-[#1C261A] dark:text-[#FAF7EE] font-headline leading-tight">Order Checkout</h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">Review items & finalize payment</p>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <div className="p-4 space-y-4 relative z-10">
        {cartItems.length === 0 ? (
          <div className="bg-surface-container rounded-3xl p-8 text-center border border-outline-variant/30 flex flex-col items-center justify-center my-6">
            <div className="w-20 h-20 rounded-3xl bg-[#3A5A40]/15 text-[#3A5A40] flex items-center justify-center mb-4 shadow-inner">
              <span className="material-symbols-outlined text-4xl">shopping_cart</span>
            </div>
            <h3 className="font-headline font-extrabold text-base text-on-surface mb-1">Your cart is empty</h3>
            <p className="text-xs text-on-surface-variant mb-6 max-w-xs leading-relaxed">
              Explore our delicious chef's specials and add items to your cart.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-[#3A5A40] text-[#F2E8CF] font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-[#3A5A40]/25 hover:bg-[#283618] transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">restaurant_menu</span>
              <span>Explore Menu</span>
            </button>
          </div>
        ) : (
          <>
            {/* Delivery Location & Estimated Time Card */}
            <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-xs flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#3A5A40]/15 text-[#3A5A40] flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-extrabold text-xs uppercase tracking-wider text-on-surface-variant">
                      Delivery Location
                    </h3>
                    <p className="font-extrabold text-xs text-on-surface truncate max-w-[180px]">{user?.name || 'Customer'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-3 py-1.5 bg-[#3A5A40]/15 text-[#3A5A40] text-[11px] font-extrabold rounded-xl hover:bg-[#3A5A40]/25 transition-all flex items-center gap-1 active:scale-95"
                >
                  <span>Change</span>
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>

              <div className="pt-2 border-t border-outline-variant/15 flex justify-between items-center text-xs">
                <p className="text-on-surface-variant font-medium truncate max-w-[220px]">
                  {user?.address || 'Select Delivery Location'}
                </p>
                <span className="bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  <span>20-25 mins</span>
                </span>
              </div>
            </div>

            {/* Cart Order Items List */}
            <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/15">
                <h3 className="font-headline font-extrabold text-xs uppercase tracking-wider text-on-surface-variant">
                  Items Selected ({cartItems.length})
                </h3>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-[11px] font-extrabold text-[#3A5A40] dark:text-[#A3B18A] hover:underline flex items-center gap-0.5"
                >
                  <span>+ Add More Items</span>
                </button>
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-outline-variant/15 last:border-b-0 last:pb-0">
                    <div>
                      <h4 className="font-extrabold text-xs text-on-surface leading-snug">{item.name}</h4>
                      <span className="text-xs font-extrabold text-[#3A5A40] dark:text-[#A3B18A] block mt-0.5">₹{item.price}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-surface-container-high px-2.5 py-1.5 rounded-xl border border-outline-variant/30 shadow-xs shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 font-extrabold text-xs text-[#3A5A40] dark:text-[#A3B18A] flex items-center justify-center hover:bg-surface-container rounded-lg transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-extrabold text-on-surface min-w-[14px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 font-extrabold text-xs text-[#3A5A40] dark:text-[#A3B18A] flex items-center justify-center hover:bg-surface-container rounded-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cooking Instructions Note */}
              <div className="pt-2 border-t border-outline-variant/15">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">edit_note</span>
                  <input
                    type="text"
                    value={cookingInstruction}
                    onChange={(e) => setCookingInstruction(e.target.value)}
                    placeholder="Write cooking instructions (e.g. Less spicy, extra cheese)..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-[#3A5A40]"
                  />
                </div>
              </div>
            </div>

            {/* Coupons & Offers Banner */}
            <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">local_offer</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-on-surface">Apply Coupon</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium">Use code WELCOME50 for ₹50 off</p>
                  </div>
                </div>

                <button
                  onClick={() => setCouponApplied(!couponApplied)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all ${
                    couponApplied
                      ? 'bg-[#3A5A40] text-[#F2E8CF] shadow-xs'
                      : 'border border-[#3A5A40] text-[#3A5A40] hover:bg-[#3A5A40]/10'
                  }`}
                >
                  {couponApplied ? 'Applied ✓' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-xs space-y-3">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-wider text-on-surface-variant">
                Select Preferred Payment Mode
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'UPI', label: 'UPI / Google Pay / PhonePe', icon: 'qr_code_2', recommended: true },
                  { id: 'Card', label: 'Credit / Debit Card', icon: 'credit_card' },
                  { id: 'COD', label: 'Cash on Delivery', icon: 'payments' },
                ].map((method) => (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-[#3A5A40] bg-[#3A5A40]/10 text-[#3A5A40] font-extrabold shadow-2xs'
                        : 'border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="material-symbols-outlined text-xl">{method.icon}</span>
                      <div className="flex items-center gap-2">
                        <span>{method.label}</span>
                        {method.recommended && (
                          <span className="bg-[#3A5A40] text-[#F2E8CF] text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                            Fast
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => {}}
                      className="accent-[#3A5A40]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Detailed Bill Summary Card */}
            <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-xs space-y-2.5 text-xs">
              <h3 className="font-headline font-extrabold uppercase tracking-wider text-on-surface-variant mb-3">
                Bill Summary
              </h3>

              <div className="flex justify-between text-on-surface-variant">
                <span>Item Subtotal</span>
                <span className="font-bold text-on-surface">₹{rawSubtotal}</span>
              </div>

              {couponApplied && (
                <div className="flex justify-between text-amber-600 font-extrabold">
                  <span>Coupon Discount (WELCOME50)</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery Partner Fee</span>
                <span className="font-bold text-on-surface">
                  {deliveryFee === 0 ? <span className="text-amber-600 font-extrabold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-on-surface-variant">
                <span>Taxes & Kitchen Charges</span>
                <span className="font-bold text-on-surface">₹{taxes}</span>
              </div>

              <div className="flex justify-between items-center pt-3 mt-2 border-t border-outline-variant/20 text-sm font-extrabold text-on-surface">
                <span>Total Payable</span>
                <span className="text-[#3A5A40] dark:text-[#A3B18A] font-numeric text-lg font-extrabold">₹{total}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={() => onNavigate('payment')}
              className="w-full bg-[#3A5A40] hover:bg-[#283618] text-[#F2E8CF] font-extrabold py-4 rounded-2xl shadow-xl shadow-[#3A5A40]/30 flex items-center justify-between px-5 text-sm transition-transform active:scale-98 mt-2"
            >
              <div className="text-left">
                <span className="text-[10px] font-medium opacity-85 block uppercase tracking-wider">Pay Total</span>
                <span className="font-numeric font-extrabold text-base">₹{total}</span>
              </div>

              <div className="flex items-center gap-1 text-sm font-bold">
                <span>Proceed to Pay</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Address Change Modal */}
      <AddressModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} />
    </div>
  );
}
