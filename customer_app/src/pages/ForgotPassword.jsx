import React, { useState } from 'react';

export default function ForgotPassword({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (email) setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="flex-1 flex flex-col bg-surface dark:bg-surface-dim min-h-full overflow-y-auto">
      {/* Top Graphic Header (Sage x Cream Forest Theme) */}
      <div className="relative bg-gradient-to-br from-[#1C261A] via-[#283618] to-[#344E41] text-[#FAF7EE] pt-8 pb-14 px-6 overflow-hidden min-h-[170px] flex flex-col justify-between">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 rounded-full bg-[#A3B18A]/10 blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between z-10">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onNavigate('login'))}
            className="flex items-center gap-1 text-xs text-[#FAF7EE]/80 font-semibold hover:text-[#F2E8CF] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>{step > 1 ? 'Previous Step' : 'Back to Login'}</span>
          </button>
          
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#A3B18A]/20 text-[#FAF7EE] backdrop-blur-md border border-[#A3B18A]/30 uppercase tracking-wider">
            Step {step} of 3
          </span>
        </div>

        <div className="z-10 mt-4">
          <h1 className="text-2xl font-extrabold text-[#FAF7EE] font-headline tracking-tight">Reset Password</h1>
          <p className="text-[#A3B18A] text-xs font-medium mt-0.5">Recover access to your BiteDash account</p>
        </div>
      </div>

      {/* Floating Curved Card */}
      <div className="relative -mt-6 flex-1 rounded-t-[36px] bg-[#FAF7EE] dark:bg-[#1E293B] px-6 pt-7 pb-8 shadow-2xl flex flex-col justify-between">
        <div>
          {step === 1 && (
            <div>
              <div className="w-14 h-14 rounded-full bg-[#A3B18A]/20 text-[#3A5A40] dark:text-[#A3B18A] flex items-center justify-center mb-4 mx-auto">
                <span className="material-symbols-outlined text-2xl">lock_reset</span>
              </div>
              <h3 className="text-base font-bold text-on-surface font-headline text-center mb-1">Forgot your password?</h3>
              <p className="text-xs text-on-surface-variant text-center mb-6 max-w-xs mx-auto">
                Enter your registered email address to receive a 4-digit verification code.
              </p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Registered Email"
                    className="w-full bg-white dark:bg-slate-800 text-on-surface rounded-full py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A5A40] border border-slate-200 shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] hover:opacity-95 text-[#F2E8CF] font-bold py-3.5 rounded-full shadow-lg shadow-[#3A5A40]/30 transition-all flex items-center justify-center gap-2 text-base mt-4 active:scale-[0.98]"
                >
                  <span>Send OTP Code</span>
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="w-14 h-14 rounded-full bg-[#A3B18A]/20 text-[#3A5A40] dark:text-[#A3B18A] flex items-center justify-center mb-4 mx-auto">
                <span className="material-symbols-outlined text-2xl">mark_email_unread</span>
              </div>
              <h3 className="text-base font-bold text-on-surface font-headline text-center mb-1">Verify OTP Code</h3>
              <p className="text-xs text-on-surface-variant text-center mb-6">
                Enter the 4-digit code sent to <strong className="text-on-surface">{email || 'your email'}</strong>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[idx] = e.target.value;
                        setOtp(newOtp);
                      }}
                      className="w-12 h-14 bg-white dark:bg-slate-800 text-center text-xl font-bold font-mono rounded-2xl border border-[#3A5A40]/40 focus:ring-2 focus:ring-[#3A5A40] focus:outline-none text-on-surface"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] hover:opacity-95 text-[#F2E8CF] font-bold py-3.5 rounded-full shadow-lg shadow-[#3A5A40]/30 transition-all flex items-center justify-center gap-2 text-base active:scale-[0.98]"
                >
                  <span>Verify & Reset Password</span>
                  <span className="material-symbols-outlined text-lg">verified</span>
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#3A5A40]/15 text-[#3A5A40] dark:text-[#A3B18A] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl">task_alt</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface font-headline mb-1">Password Reset Successful!</h3>
              <p className="text-xs text-on-surface-variant mb-6 max-w-xs mx-auto">
                Your password has been reset securely. You can now log in with your account.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full bg-gradient-to-r from-[#283618] via-[#3A5A40] to-[#588157] hover:opacity-95 text-[#F2E8CF] font-bold py-3.5 rounded-full shadow-lg shadow-[#3A5A40]/30 transition-all flex items-center justify-center gap-2 text-base active:scale-[0.98]"
              >
                <span>Back to Login</span>
                <span className="material-symbols-outlined text-lg">login</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs text-on-surface-variant hover:text-[#3A5A40] font-semibold transition-colors"
          >
            Remember your password? <span className="text-[#3A5A40] dark:text-[#A3B18A] font-bold underline ml-1">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
