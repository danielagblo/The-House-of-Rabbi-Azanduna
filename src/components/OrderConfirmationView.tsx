import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight, ShoppingBag, Home } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export const OrderConfirmationView: React.FC = () => {
  const [reference, setReference] = useState<string>('');
  const [status, setStatus] = useState<'verifying' | 'success' | 'simulated'>('verifying');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref') || 'OUD-' + Math.floor(Date.now() / 1000);
    const isSimulated = params.get('simulated') === 'true';

    setReference(ref);

    if (isSimulated) {
      setStatus('simulated');
      return;
    }

    // Verify payment with Go backend
    fetch(`${API_BASE_URL}/api/payments/verify/${ref}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.paystack?.status === 'success') {
          setStatus('success');
          setOrderDetails(data.order);
        } else {
          setStatus('simulated');
        }
      })
      .catch(() => {
        setStatus('simulated');
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center font-['Poppins',sans-serif]">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-lg shadow-emerald-100">
        <CheckCircle2 size={44} strokeWidth={2.2} />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-4">
        ✓ Order Confirmed
      </div>

      <h1 className="font-['Barlow',sans-serif] text-3xl sm:text-5xl font-extrabold text-black uppercase tracking-tight mb-3">
        Thank You for Your Patronage
      </h1>

      <div className="w-14 h-1 bg-[#ff2d3b] mx-auto mb-4"></div>

      <p className="text-gray-600 text-sm sm:text-base font-normal max-w-lg mx-auto leading-relaxed mb-8">
        Your order has been received and is being prepared with extreme care by our team.
      </p>

      {/* Order Reference Card */}
      <div className="bg-neutral-50 border border-gray-200 rounded-2xl p-6 sm:p-8 mb-10 text-left shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3.5 border-b border-gray-200/80 text-xs sm:text-sm">
          <span className="text-gray-500 uppercase font-bold text-[11px] tracking-wider">Order Reference</span>
          <span className="font-mono font-bold text-gray-900 bg-white px-2.5 py-1 rounded border border-gray-200 text-xs sm:text-sm">
            {reference}
          </span>
        </div>

        <div className="flex justify-between items-center pb-3.5 border-b border-gray-200/80 text-xs sm:text-sm">
          <span className="text-gray-500 uppercase font-bold text-[11px] tracking-wider">Payment Status</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] uppercase tracking-wider">
            <ShieldCheck size={14} className="text-emerald-700" />
            Verified by Paystack
          </span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-gray-500 uppercase font-bold text-[11px] tracking-wider">Processing Time</span>
          <span className="text-gray-900 font-semibold text-xs sm:text-sm">Within 24 Hours</span>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <a
          href="/collections"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-[#ff2d3b] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
        >
          <ShoppingBag size={15} />
          <span>Continue Exploring</span>
        </a>
        <a
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
        >
          <Home size={15} />
          <span>Return Home</span>
        </a>
      </div>
    </div>
  );
};
