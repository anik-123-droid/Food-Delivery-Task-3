import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { getRestaurants } from '../services/store';

export default function PartnerSignup({ onNavigate }) {
  const { registerPartner } = useRestaurant();

  // Step state: 1 = Email & Password, 2 = Restaurant Details, 3 = ₹500 Payment
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 fields
  const [restaurantName, setRestaurantName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fssai, setFssai] = useState('');
  const [cuisine, setCuisine] = useState('Multi-Cuisine');

  // Step 3 (Payment) fields
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  const [error, setError] = useState('');

  // Handle Step 1 -> Step 2
  const handleStep1Submit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both Email and Password.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Check if email is already registered
    const allRestaurants = getRestaurants();
    const existing = allRestaurants.find(
      (r) => r.email && r.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      setError('This email is already registered. Please Sign In.');
      return;
    }

    setStep(2);
  };

  // Handle Step 2 -> Step 3 (Proceed to Payment)
  const handleStep2Submit = (e) => {
    e.preventDefault();
    setError('');

    if (!restaurantName.trim()) {
      setError('Please enter your Restaurant / Kitchen Name.');
      return;
    }

    if (!managerName.trim()) {
      setError('Please enter Owner / Manager Name.');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter Mobile Number.');
      return;
    }

    if (!address.trim()) {
      setError('Please enter complete Restaurant Address.');
      return;
    }

    if (!fssai.trim()) {
      setError('Please enter FSSAI License Number.');
      return;
    }

    setStep(3);
  };

  // Handle Step 3 Final Payment & Activation
  const handlePayAndActivate = (e) => {
    e.preventDefault();
    setError('');
    setIsProcessingPayment(true);

    const generatedTxn = `TXN-INNO-${Math.floor(100000 + Math.random() * 900000)}`;
    setTxnId(generatedTxn);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        const res = registerPartner({
          restaurantName: restaurantName.trim(),
          managerName: managerName.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          phone: phone.trim(),
          address: address.trim(),
          fssai: fssai.trim(),
          cuisine: cuisine,
          paymentTxnId: generatedTxn,
          paidAmount: 500,
        });

        if (!res.success) {
          setError(res.message);
          setPaymentSuccess(false);
          return;
        }

        onNavigate('dashboard');
      }, 1200);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#182017] min-h-full font-sans justify-between overflow-y-auto select-none relative">
      {/* Top Hero Food Header Banner */}
      <div className="relative h-48 w-full overflow-hidden flex flex-col justify-between p-6">
        {/* Background Image with Dark Vignette & Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.85]"
          style={{ backgroundImage: `url('/hero_food_bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#283618]/85 via-[#344E41]/80 to-[#182017]" />

        {/* Top Header Badge & Stepper */}
        <div className="relative z-10 flex items-center justify-between mt-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#A3B18A]/25 text-[#F2E8CF] px-2.5 py-1 rounded-full border border-[#A3B18A]/40 backdrop-blur-md">
            Partner Onboarding
          </span>
          <span className="text-xs font-bold text-[#F2E8CF] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-[#A3B18A]/30">
            Step {step} of 3
          </span>
        </div>
      </div>

      {/* Main Glassmorphism Cream Card Body */}
      <div className="bg-[#FAF7EE]/95 backdrop-blur-xl rounded-t-[36px] -mt-8 pt-6 px-6 pb-6 flex-1 flex flex-col justify-between shadow-2xl relative z-10 border-t border-[#E3DBC6]">
        <div>
          {/* Header Title inside Card */}
          <div className="text-center mb-5">
            <h1 className="text-2xl font-extrabold text-slate-800 font-headline tracking-tight">
              {step === 1 && 'Create Partner Account'}
              {step === 2 && 'Restaurant Details'}
              {step === 3 && 'Platform Activation Fee'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {step === 1 && 'Step 1: Account Login Credentials'}
              {step === 2 && 'Step 2: Kitchen & FSSAI Details'}
              {step === 3 && 'Step 3: Pay ₹500 one-time onboarding fee'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2 border border-red-200 shadow-sm animate-shake">
              <span className="material-symbols-outlined text-base text-red-500">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Email & Password */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-3.5">
              {/* Email Field */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                  Restaurant E-mail
                </label>
                <div className="relative flex items-center bg-slate-50/80 border border-slate-200 focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/10 rounded-2xl px-3.5 py-2.5 transition-all duration-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-2.5">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@example.com"
                    required
                    className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
                  />
                  {email.trim() !== '' && (
                    <span className="material-symbols-outlined text-emerald-600 text-lg font-bold ml-2">
                      check_circle
                    </span>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                  Password
                </label>
                <div className="relative flex items-center bg-slate-50/80 border border-slate-200 focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/10 rounded-2xl px-3.5 py-2.5 transition-all duration-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-2.5">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 ml-2 focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center bg-slate-50/80 border border-slate-200 focus-within:border-[#3A5A40] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3A5A40]/10 rounded-2xl px-3.5 py-2.5 transition-all duration-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-2.5">
                    lock_reset
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 ml-2 focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Next Step Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#3A5A40] via-[#588157] to-[#344E41] text-[#F2E8CF] font-headline font-bold text-sm tracking-wider shadow-lg shadow-[#3A5A40]/30 hover:opacity-95 hover:scale-[1.01] active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2"
              >
                <span>Continue to Step 2</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </form>
          )}

          {/* STEP 2: Restaurant Details */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-3">
              {/* Restaurant / Kitchen Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                  Restaurant Name *
                </label>
                <div className="relative flex items-center bg-slate-50/80 border border-slate-200 focus-within:border-[#3A5A40] focus-within:bg-white rounded-2xl px-3.5 py-2 transition-all duration-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-2">storefront</span>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Royal Spice Kitchen"
                    required
                    className="w-full bg-transparent text-slate-800 text-sm focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Owner / Manager Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                  Manager / Owner Name *
                </label>
                <div className="relative flex items-center bg-slate-50/80 border border-slate-200 focus-within:border-[#3A5A40] focus-within:bg-white rounded-2xl px-3.5 py-2 transition-all duration-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-2">person</span>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="Full name of owner"
                    required
                    className="w-full bg-transparent text-slate-800 text-sm focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                  Mobile Number *
                </label>
                <div className="relative flex items-center bg-slate-50/80 border border-slate-200 focus-within:border-[#3A5A40] focus-within:bg-white rounded-2xl px-3.5 py-2 transition-all duration-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-2">call</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full bg-transparent text-slate-800 text-sm focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* FSSAI License Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                  FSSAI License Number *
                </label>
                <div className="relative flex items-center bg-slate-50/80 border border-slate-200 focus-within:border-[#3A5A40] focus-within:bg-white rounded-2xl px-3.5 py-2 transition-all duration-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-2">badge</span>
                  <input
                    type="text"
                    value={fssai}
                    onChange={(e) => setFssai(e.target.value)}
                    placeholder="14-digit FSSAI number"
                    required
                    className="w-full bg-transparent text-slate-800 text-sm focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Restaurant Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                  Restaurant Address *
                </label>
                <div className="relative flex items-center bg-slate-50/80 border border-slate-200 focus-within:border-[#3A5A40] focus-within:bg-white rounded-2xl px-3.5 py-2 transition-all duration-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-2">location_on</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full address & landmark"
                    required
                    className="w-full bg-transparent text-slate-800 text-sm focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Cuisine Type */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block pl-1">
                  Primary Cuisine
                </label>
                <div className="relative flex items-center bg-slate-50/80 border border-slate-200 focus-within:border-[#3A5A40] focus-within:bg-white rounded-2xl px-3.5 py-2 transition-all duration-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-lg mr-2">restaurant_menu</span>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full bg-transparent text-slate-800 text-sm focus:outline-none font-medium"
                  >
                    <option value="Multi-Cuisine">Multi-Cuisine</option>
                    <option value="North Indian">North Indian</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Chinese / Asian">Chinese / Asian</option>
                    <option value="Fast Food & Burgers">Fast Food & Burgers</option>
                    <option value="Italian & Pizza">Italian & Pizza</option>
                    <option value="Desserts & Bakery">Desserts & Bakery</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 rounded-full border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 px-4 rounded-full bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] text-[#F2E8CF] font-bold text-xs tracking-wider shadow-lg shadow-[#3A5A40]/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Payment</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ₹500 Platform Onboarding Payment */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Payment Summary Box */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-lg border border-slate-700">
                <div className="flex justify-between items-start pb-3 border-b border-slate-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Partner Onboarding Fee</span>
                    <h3 className="font-bold text-sm text-white mt-0.5">{restaurantName}</h3>
                    <p className="text-[11px] text-slate-400">Owner: {managerName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400 font-numeric tracking-tight">₹500</span>
                    <span className="block text-[9px] text-slate-400">One-time Platform Fee</span>
                  </div>
                </div>

                <div className="pt-2.5 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Instant Portal Activation
                  </span>
                  <span className="text-slate-400">Status: <strong className="text-amber-300">Offline on Setup</strong></span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#3A5A40] bg-[#3A5A40]/10 text-[#3A5A40] font-bold shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg block mx-auto mb-0.5">qr_code_scanner</span>
                    <span className="text-[11px] block">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#3A5A40] bg-[#3A5A40]/10 text-[#3A5A40] font-bold shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg block mx-auto mb-0.5">credit_card</span>
                    <span className="text-[11px] block">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#3A5A40] bg-[#3A5A40]/10 text-[#3A5A40] font-bold shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg block mx-auto mb-0.5">account_balance</span>
                    <span className="text-[11px] block">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Payment Details Form based on method */}
              {paymentMethod === 'upi' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-700">Scan QR Code or Use UPI</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Auto-Verified</span>
                  </div>

                  {/* Mock QR Container */}
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-24 bg-white p-1.5 rounded-xl border-2 border-slate-300 shadow-inner flex flex-col items-center justify-center shrink-0">
                      <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white text-center p-1">
                        <span className="material-symbols-outlined text-2xl text-amber-400">qr_code_2</span>
                        <span className="text-[8px] font-mono tracking-tighter">PAY ₹500</span>
                      </div>
                    </div>
                    <div className="flex-1 text-xs space-y-1.5">
                      <p className="text-slate-600 font-medium text-[11px]">Scan using any UPI App</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                          <span key={app} className="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700 shadow-xs">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 block">Enter UPI ID / VPA</label>
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:border-[#3A5A40]">
                      <input
                        type="text"
                        placeholder="restaurant@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-800 focus:outline-none font-medium"
                      />
                      <span className="text-[10px] font-extrabold text-[#3A5A40] bg-[#A3B18A]/20 px-2 py-0.5 rounded-md shrink-0">
                        VERIFY
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8912"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#3A5A40]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#3A5A40]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#3A5A40]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                  <label className="text-[10px] font-bold text-slate-600 block">Select Your Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#3A5A40]"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Processing or Success State Indicator */}
              {isProcessingPayment && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
                  <div className="inline-block w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-amber-800">Processing ₹500 Fee Payment...</p>
                  <p className="text-[10px] text-amber-600">Connecting securely to payment gateway</p>
                </div>
              )}

              {paymentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                  <span className="material-symbols-outlined text-2xl text-emerald-600 block">check_circle</span>
                  <p className="text-xs font-bold text-emerald-800">Payment Successful! (₹500)</p>
                  <p className="text-[10px] text-emerald-600 font-mono">Txn: {txnId} • Activating Kitchen...</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessingPayment || paymentSuccess}
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 px-4 rounded-full border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  BACK
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment || paymentSuccess}
                  onClick={handlePayAndActivate}
                  className="flex-[2] py-3 px-4 rounded-full bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white font-bold text-xs tracking-wider shadow-lg shadow-emerald-700/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>PAY ₹500 & ACTIVATE</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Link */}
        <div className="pt-4 text-center border-t border-slate-100 mt-4">
          <p className="text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-[#3A5A40] font-bold hover:underline ml-1"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
