import React, { useState } from 'react';

export default function FakePaymentModal({ isOpen, onClose, total, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('gpay');
  const [upiId, setUpiId] = useState('user@okicici');
  const [cardNumber, setCardNumber] = useState('4532 8910 2341 8901');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success'

  if (!isOpen) return null;

  const handlePay = (e) => {
    if (e) e.preventDefault();
    setStatus('processing');

    // Simulate 1.8 seconds bank authentication
    setTimeout(() => {
      setStatus('success');
      // After 1.5 seconds success screen, finalize order
      setTimeout(() => {
        setStatus('idle');
        onSuccess();
      }, 1500);
    }, 1800);
  };

  return (
    <div className="absolute inset-0 -bottom-28 z-50 bg-surface dark:bg-surface-dim overflow-y-auto flex flex-col animate-page-enter">
      {/* Top Fading Header Sage Gradient Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#3A5A40]/20 via-[#A3B18A]/10 to-transparent pointer-events-none z-0"></div>

      {/* Clean Full-Page Header */}
      <header className="sticky top-0 z-40 bg-transparent px-4 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={status !== 'idle'}
            className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-on-surface hover:bg-[#FAF7EE] transition-all shadow-xs border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <h2 className="text-base font-extrabold text-on-surface font-headline leading-tight">Payment Gateway</h2>
            <p className="text-[11px] text-on-surface-variant font-medium">Select method & complete payment</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#A3B18A]/20 text-[#283618] dark:text-[#E7ECE0] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#A3B18A]/40">
          <span className="material-symbols-outlined text-xs">lock</span>
          <span>256-Bit Secure</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 relative z-10 flex-1 flex flex-col justify-between pb-8">
        <div>
          {/* Order Amount Summary Card */}
          <div className="bg-surface-container rounded-3xl p-4 border border-outline-variant/30 shadow-xs flex justify-between items-center mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-extrabold block">
                PAYING TO
              </span>
              <span className="font-extrabold text-sm text-on-surface">BiteDash Food Delivery</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-extrabold block">
                TOTAL AMOUNT
              </span>
              <span className="font-headline font-extrabold text-xl text-[#3A5A40] dark:text-[#A3B18A]">₹{total}</span>
            </div>
          </div>

          {/* Dynamic Content based on Payment Status */}
          {status === 'processing' && (
            <div className="bg-surface-container rounded-3xl p-8 text-center border border-outline-variant/30 flex flex-col items-center justify-center my-6 shadow-xs">
              <div className="w-16 h-16 border-4 border-[#3A5A40] border-t-transparent rounded-full animate-spin mb-4"></div>
              <h4 className="font-extrabold text-base text-on-surface font-headline">Connecting to Bank Gateway...</h4>
              <p className="text-xs text-on-surface-variant mt-2 max-w-xs leading-relaxed">
                Authenticating transaction of <strong className="text-[#3A5A40] dark:text-[#A3B18A]">₹{total}</strong>. Please do not press back or close app.
              </p>
              <div className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-[11px] font-extrabold text-on-surface-variant border border-outline-variant/20">
                <span className="material-symbols-outlined text-sm text-[#3A5A40]">verified_user</span>
                <span>Encrypted Bank Authentication</span>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-surface-container rounded-3xl p-8 text-center border border-outline-variant/30 flex flex-col items-center justify-center my-6 shadow-xs animate-page-enter">
              <div className="w-20 h-20 rounded-full bg-[#3A5A40] text-[#F2E8CF] flex items-center justify-center mb-4 shadow-xl shadow-[#3A5A40]/30 animate-bounce">
                <span className="material-symbols-outlined text-4xl font-extrabold">check</span>
              </div>
              <h4 className="font-extrabold text-xl text-[#3A5A40] dark:text-[#A3B18A] font-headline">Payment Successful!</h4>
              <p className="text-xs text-on-surface-variant mt-1 font-mono">Ref: TXN-{Math.floor(10000000 + Math.random() * 90000000)}</p>
              <p className="text-xs font-extrabold text-[#3A5A40] dark:text-[#A3B18A] mt-4 animate-pulse">Placing your order and redirecting...</p>
            </div>
          )}

          {status === 'idle' && (
            <form onSubmit={handlePay} className="space-y-4">
              <h3 className="font-headline font-extrabold text-xs uppercase tracking-wider text-on-surface-variant">
                Select Payment Option
              </h3>

              {/* UPI Option */}
              <div
                onClick={() => setSelectedMethod('gpay')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'gpay'
                    ? 'border-[#3A5A40] bg-[#3A5A40]/10 shadow-2xs'
                    : 'border-outline-variant/30 bg-surface-container hover:bg-surface-container-high'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-xl">qr_code_2</span>
                    <span className="font-extrabold text-xs text-on-surface">UPI / Instant Pay</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-[#283618] bg-[#A3B18A]/25 dark:text-[#E7ECE0] px-2 py-0.5 rounded-full border border-[#A3B18A]/40">
                    INSTANT
                  </span>
                </div>

                {selectedMethod === 'gpay' && (
                  <div className="mt-3 space-y-2 border-t border-outline-variant/20 pt-2.5">
                    <div className="flex gap-2">
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <div key={app} className="flex-1 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-outline-variant/30 text-[10px] font-extrabold text-center text-on-surface shadow-2xs">
                          {app}
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter VPA / UPI ID (e.g. 9876543210@ybl)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-white dark:bg-slate-900 text-xs text-on-surface focus:outline-none focus:border-[#3A5A40]"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Credit / Debit Card Option */}
              <div
                onClick={() => setSelectedMethod('card')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'card'
                    ? 'border-[#3A5A40] bg-[#3A5A40]/10 shadow-2xs'
                    : 'border-outline-variant/30 bg-surface-container hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-xl">credit_card</span>
                  <span className="font-extrabold text-xs text-on-surface">Credit / Debit Card</span>
                </div>

                {selectedMethod === 'card' && (
                  <div className="mt-3 space-y-2 border-t border-outline-variant/20 pt-2.5">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-white dark:bg-slate-900 text-xs font-mono text-on-surface focus:outline-none focus:border-[#3A5A40]"
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-1/2 px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-white dark:bg-slate-900 text-xs font-mono text-on-surface focus:outline-none focus:border-[#3A5A40]"
                        required
                      />
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-1/2 px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-white dark:bg-slate-900 text-xs font-mono text-on-surface focus:outline-none focus:border-[#3A5A40]"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Net Banking */}
              <div
                onClick={() => setSelectedMethod('netbanking')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'netbanking'
                    ? 'border-[#3A5A40] bg-[#3A5A40]/10 shadow-2xs'
                    : 'border-outline-variant/30 bg-surface-container hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-xl">account_balance</span>
                  <span className="font-extrabold text-xs text-on-surface">Net Banking (SBI, HDFC, ICICI)</span>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setSelectedMethod('cod')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === 'cod'
                    ? 'border-[#3A5A40] bg-[#3A5A40]/10 shadow-2xs'
                    : 'border-outline-variant/30 bg-surface-container hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#3A5A40] dark:text-[#A3B18A] text-xl">payments</span>
                  <span className="font-extrabold text-xs text-on-surface">Cash on Delivery</span>
                </div>
              </div>

              {/* Submit Payment CTA Button */}
              <button
                type="submit"
                className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] hover:opacity-95 text-[#F2E8CF] font-extrabold text-sm shadow-xl shadow-[#3A5A40]/30 flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <span>Pay ₹{total} Now</span>
                <span className="material-symbols-outlined text-lg">lock</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
