import React, { useState, useEffect } from 'react';
import { cartStore } from '../store/cartStore';
import type { CartItem } from '../types';
import { X, Trash2, ShieldCheck, CreditCard, ArrowRight, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingCountry, setShippingCountry] = useState('United Kingdom');

  useEffect(() => {
    const update = () => {
      setIsOpen(cartStore.isCartDrawerOpen());
      setItems(cartStore.getItems());
    };
    update();
    return cartStore.subscribe(update);
  }, []);

  const subtotal = cartStore.getSubtotal();
  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const freeShippingThreshold = 50.0;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : 4.95;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'DISCOUNT' || promoCode.trim().toUpperCase() === 'OUD10') {
      setDiscountApplied(true);
    } else {
      alert('Invalid promo code. Try "DISCOUNT" for 10% off!');
    }
  };

  const handlePaystackCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) {
      alert('Please provide your name and email address.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone: '',
        shippingStreet,
        shippingCity,
        shippingCountry,
        currency: 'GBP',
        callbackUrl: window.location.origin + '/order/confirmation',
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          variantSize: item.selectedVariant.size,
          quantity: item.quantity,
          unitPrice: item.selectedVariant.price,
          imageUrl: item.product.imageUrl,
        })),
      };

      const response = await fetch('http://localhost:8080/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Server checkout initialization error');
      }

      const data = await response.json();

      if (data.paystack?.authorization_url) {
        cartStore.clearCart();
        cartStore.closeDrawer();
        window.location.href = data.paystack.authorization_url;
      } else {
        cartStore.clearCart();
        cartStore.closeDrawer();
        window.location.href = `/order/confirmation?reference=${data.reference || 'OUD-TEST'}&simulated=true`;
      }
    } catch (err) {
      const testRef = 'OUD-' + Date.now();
      cartStore.clearCart();
      cartStore.closeDrawer();
      window.location.href = `/order/confirmation?reference=${testRef}&simulated=true`;
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Poppins',sans-serif]">
      {/* Backdrop */}
      <div
        onClick={() => cartStore.closeDrawer()}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-gray-900 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <span className="font-['Barlow',sans-serif] text-xl font-bold uppercase tracking-wider text-black">
                Your Shopping Bag
              </span>
              <span className="text-xs bg-black text-white font-bold px-2 py-0.5 rounded-full">
                {cartStore.getItemCount()}
              </span>
            </div>
            <button
              onClick={() => cartStore.closeDrawer()}
              className="p-1.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              {isFreeShipping ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check size={14} /> Free UK Shipping Unlocked!
                </span>
              ) : (
                <span className="text-gray-700">
                  Add <strong className="text-[#ff2d3b]">£{(freeShippingThreshold - subtotal).toFixed(2)}</strong> more for <strong>FREE Delivery</strong>
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#ff2d3b] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-bold text-gray-900 text-lg mb-2">Your Bag is Empty</p>
                <p className="text-xs text-gray-500 mb-6">Discover our fine, long lasting range of Oud Perfume Oils.</p>
                <a
                  href="/collections"
                  onClick={() => cartStore.closeDrawer()}
                  className="inline-block px-6 py-2.5 bg-black text-white font-bold text-xs uppercase rounded-lg hover:bg-[#ff2d3b] transition-colors"
                >
                  Start Shopping
                </a>
              </div>
            ) : checkoutStep === 'cart' ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant.size}`}
                    className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-lg bg-neutral-200"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-['Barlow',sans-serif] text-sm font-bold text-gray-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => cartStore.removeItem(item.product.id, item.selectedVariant.size)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">{item.selectedVariant.size}</span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-300 rounded bg-white">
                          <button
                            onClick={() => cartStore.updateQuantity(item.product.id, item.selectedVariant.size, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:text-black font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => cartStore.updateQuantity(item.product.id, item.selectedVariant.size, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:text-black font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-['Barlow',sans-serif] font-bold text-black text-sm">
                          £{(item.selectedVariant.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <form onSubmit={handleApplyPromo} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Discount code (e.g. DISCOUNT)"
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black font-bold text-xs uppercase rounded-lg border border-gray-300"
                  >
                    Apply
                  </button>
                </form>
                {discountApplied && (
                  <p className="text-xs text-emerald-600 font-bold">✓ 10% Discount Applied!</p>
                )}
              </div>
            ) : (
              <form id="checkout-form" onSubmit={handlePaystackCheckout} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <h4 className="font-bold text-sm text-gray-900 uppercase">Customer Information</h4>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="text-xs text-gray-500 hover:text-black underline font-semibold"
                  >
                    Back to Items
                  </button>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-gray-700 mb-1">Shipping Address</label>
                  <input
                    type="text"
                    value={shippingStreet}
                    onChange={(e) => setShippingStreet(e.target.value)}
                    placeholder="Street Address"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-black focus:outline-none mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="City"
                      className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-black focus:outline-none"
                    />
                    <input
                      type="text"
                      value={shippingCountry}
                      onChange={(e) => setShippingCountry(e.target.value)}
                      placeholder="Country"
                      className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-gray-700">
                  <ShieldCheck size={20} className="text-[#ff2d3b] shrink-0" />
                  <span>Secure checkout processed by <strong>Paystack</strong>.</span>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-white space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">£{subtotal.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount (10%)</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{isFreeShipping ? <strong className="text-emerald-600 uppercase text-[10px]">Free</strong> : `£${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black pt-2 border-t border-gray-200">
                  <span className="font-['Barlow',sans-serif] uppercase">Total</span>
                  <span className="font-['Barlow',sans-serif] text-base text-[#ff2d3b]">
                    £{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  onClick={() => setCheckoutStep('details')}
                  className="w-full py-3.5 bg-black hover:bg-[#ff2d3b] text-white font-extrabold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Checkout</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#ff2d3b] hover:bg-[#e0202d] text-white font-extrabold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CreditCard size={16} />
                  <span>{isLoading ? 'Connecting...' : `Pay £${finalTotal.toFixed(2)} with Paystack`}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
