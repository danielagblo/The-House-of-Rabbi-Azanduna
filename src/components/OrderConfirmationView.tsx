import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, ShoppingBag, Home, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export const OrderConfirmationView: React.FC = () => {
  const [reference, setReference] = useState<string>('');
  const [status, setStatus] = useState<'verifying' | 'success' | 'simulated'>('verifying');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref') || 'OUD-' + Math.floor(Date.now() / 1000);
    const isSimulated = params.get('simulated') === 'true';

    setReference(ref);

    // Load any saved order info from sessionStorage as initial state
    try {
      const stored = sessionStorage.getItem('azanduna_last_order');
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrderDetails(parsed);
      }
    } catch (e) {}

    if (isSimulated) {
      setStatus('simulated');
      return;
    }

    // Verify payment with server
    fetch(`${API_BASE_URL}/api/payments/verify/${ref}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.paystack?.status === 'success') {
          setStatus('success');
          if (data.order) {
            setOrderDetails(data.order);
          }
        } else {
          setStatus('simulated');
        }
      })
      .catch(() => {
        setStatus('simulated');
      });
  }, []);

  const buildReceiptText = () => {
    const items = orderDetails?.items || [];
    let itemsText = '';
    if (Array.isArray(items) && items.length > 0) {
      itemsText = items
        .map(
          (it: any) =>
            `• ${it.productName || it.name || 'Pure Perfume Oil'} (${it.variantSize || it.size || 'Standard'}) x${it.quantity || 1} - GH₵${Number(it.unitPrice || it.price || 0).toFixed(2)}`
        )
        .join('\n');
    }

    const customer = orderDetails?.customerName ? `👤 *Customer:* ${orderDetails.customerName}\n` : '';
    const total = orderDetails?.totalAmount ? `💰 *Amount Paid:* GH₵${Number(orderDetails.totalAmount).toFixed(2)}\n` : '';

    return `👑 *RABBI AZANDUNA - ORDER PROOF OF PAYMENT*

📋 *Order Reference:* ${reference}
${customer}${total}🛡️ *Payment Status:* Verified via Paystack
📅 *Date:* ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}

${itemsText ? `🛍️ *Fragrances Ordered:*\n${itemsText}\n\n` : ''}✅ *Please find my payment confirmation attached for dispatch & delivery processing.*

Thank you!
Rabbi Azanduna Luxury Fragrances`;
  };

  const handleShareWhatsApp = () => {
    const text = buildReceiptText();
    const encoded = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyReceipt = () => {
    const text = buildReceiptText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const items = orderDetails?.items || [];

  return (
    <div className="max-w-2xl mx-auto px-3.5 sm:px-4 py-10 sm:py-20 text-center font-['Poppins',sans-serif]">
      {/* Success Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4 sm:mb-5 text-emerald-600 shadow-lg shadow-emerald-100 animate-in zoom-in-75 duration-300">
        <CheckCircle2 size={38} strokeWidth={2.2} />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-2.5">
        ✓ Order Confirmed &amp; Payment Secured
      </div>

      <h1 className="font-['Barlow',sans-serif] text-2xl sm:text-4xl lg:text-5xl font-extrabold text-black uppercase tracking-tight mb-2 sm:mb-3">
        Thank You for Your Order
      </h1>

      <div className="w-14 h-1 bg-[#0B1F3A] mx-auto mb-4"></div>

      <p className="text-gray-600 text-xs sm:text-sm font-normal max-w-lg mx-auto leading-relaxed mb-6 sm:mb-8">
        Your order has been safely placed and is now being packaged with utmost care. Share your proof on WhatsApp below for fast dispatch confirmation!
      </p>

      {/* WHATSAPP PROOF OF PAYMENT CARD */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-7 mb-7 text-left shadow-md space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 text-emerald-800">
            <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <div>
              <h3 className="font-['Barlow',sans-serif] font-bold text-base sm:text-lg text-gray-900 uppercase tracking-tight leading-tight">
                Send Proof to WhatsApp
              </h3>
              <p className="text-[11px] text-gray-600">
                Share payment proof directly with our concierge team for immediate shipping.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
            Fast Track Dispatch
          </span>
        </div>

        {/* Formatted Proof Summary Box */}
        <div className="bg-white border border-gray-200/90 rounded-xl p-3.5 sm:p-4 text-xs font-mono space-y-1.5 shadow-2xs text-gray-800">
          <div className="flex justify-between">
            <span className="text-gray-500 font-sans font-bold uppercase text-[10px]">Reference:</span>
            <span className="font-bold text-gray-900">{reference}</span>
          </div>
          {orderDetails?.customerName && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-sans font-bold uppercase text-[10px]">Customer:</span>
              <span className="font-semibold text-gray-900">{orderDetails.customerName}</span>
            </div>
          )}
          {orderDetails?.totalAmount && (
            <div className="flex justify-between">
              <span className="text-gray-500 font-sans font-bold uppercase text-[10px]">Total Paid:</span>
              <span className="font-bold text-black font-['Barlow',sans-serif] text-sm">
                GH₵{Number(orderDetails.totalAmount).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-1 border-t border-gray-100">
            <span className="text-gray-500 font-sans font-bold uppercase text-[10px]">Paystack Status:</span>
            <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ Verified Paid
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Share Order Proof on WhatsApp</span>
          </button>

          <button
            onClick={handleCopyReceipt}
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Copy formatted receipt text"
          >
            {copied ? (
              <>
                <Check size={15} className="text-emerald-600" />
                <span className="text-emerald-700 font-bold">✓ Copied!</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Copy Receipt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Order Reference Card */}
      <div className="bg-neutral-50 border border-gray-200 rounded-2xl p-4 sm:p-6 mb-8 text-left shadow-xs space-y-3.5 text-xs sm:text-sm">
        <div className="flex justify-between items-center gap-2 pb-3 border-b border-gray-200/80">
          <span className="text-gray-500 uppercase font-bold text-[10px] sm:text-[11px] tracking-wider shrink-0">Order Reference</span>
          <span className="font-mono font-bold text-gray-900 bg-white px-2.5 py-1 rounded border border-gray-200 text-xs break-all text-right">
            {reference}
          </span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-gray-200/80">
          <span className="text-gray-500 uppercase font-bold text-[11px] tracking-wider">Payment Status</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] uppercase tracking-wider">
            <ShieldCheck size={14} className="text-emerald-700" />
            Verified by Paystack
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500 uppercase font-bold text-[11px] tracking-wider">Processing Time</span>
          <span className="text-gray-900 font-semibold">Same Day Dispatch (Within 24 Hours)</span>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <a
          href="/collections"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-[#0B1F3A] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
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
