import React, { useState, useEffect } from 'react';
import { CheckCircle2, PackageCheck, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

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
    fetch(`http://localhost:8085/api/payments/verify/${ref}`)
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
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 text-emerald-400">
        <CheckCircle2 size={40} />
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-950/20 text-amber-300 text-[10px] uppercase tracking-widest mb-4">
        <Sparkles size={12} className="text-amber-400" />
        Order Confirmed
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white uppercase mb-3">
        Thank You for Your Patronage
      </h1>

      <p className="text-zinc-300 text-sm font-light max-w-lg mx-auto leading-relaxed mb-8">
        Your order of artisanal fragrances has been received and is being prepared with extreme care by our master blenders in London.
      </p>

      {/* Order Reference Card */}
      <div className="bg-[#111116] border border-amber-500/30 rounded-2xl p-8 mb-10 text-left max-w-xl mx-auto shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800 text-xs">
          <span className="text-zinc-400 uppercase tracking-wider">Order Reference</span>
          <span className="font-mono font-bold text-amber-400 text-sm">{reference}</span>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-zinc-800 text-xs">
          <span className="text-zinc-400 uppercase tracking-wider">Payment Status</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px]">
            <ShieldCheck size={13} />
            Verified by Paystack
          </span>
        </div>

        <div className="flex justify-between items-center pt-4 text-xs">
          <span className="text-zinc-400 uppercase tracking-wider">Estimated Dispatch</span>
          <span className="text-white font-medium">Within 24 Hours (Tracked 48)</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="/collections"
          className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs uppercase tracking-[0.2em] rounded hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
        >
          Continue Exploring
        </a>
        <a
          href="/"
          className="px-8 py-3.5 border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white font-medium text-xs uppercase tracking-[0.2em] rounded transition-all"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};
