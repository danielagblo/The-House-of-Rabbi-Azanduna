import React, { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../types';
import { cartStore } from '../store/cartStore';
import { X, Star, ShoppingBag, Check, Sparkles } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    return cartStore.subscribeQuickView((p) => {
      setProduct(p);
      if (p && p.variants && p.variants.length > 0) {
        setSelectedVariant(p.variants[0]);
      }
      setQuantity(1);
      setIsAdded(false);
    });
  }, []);

  if (!product) return null;

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      cartStore.addItem(product, selectedVariant, quantity);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        cartStore.closeQuickView();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#111116] border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => cartStore.closeQuickView()}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white bg-black/50 rounded-full"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-[4/5] bg-black/50 relative overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-amber-500/90 text-black text-[10px] font-bold uppercase tracking-widest rounded shadow">
                {product.scentFamily}
              </span>
            </div>
          </div>

          {/* Details & Fast Add */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <span className="text-zinc-400">({product.reviewCount || 36} verified reviews)</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-white mb-1">{product.name}</h2>
              <p className="text-xs uppercase tracking-wider text-amber-300/80 mb-4 font-sans font-medium">
                {product.subtitle || product.concentration}
              </p>
              <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Scent Notes Preview */}
              {product.notes && product.notes.length > 0 && (
                <div className="mb-6 bg-black/40 p-3.5 rounded-lg border border-zinc-800">
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block mb-2 flex items-center gap-1">
                    <Sparkles size={11} />
                    Olfactory Highlights
                  </span>
                  <div className="flex flex-col gap-1 text-xs text-zinc-300 font-light">
                    {product.notes.map((n, i) => (
                      <div key={i} className="flex gap-2">
                        <strong className="text-zinc-400 uppercase text-[10px] w-12 shrink-0">{n.layer}:</strong>
                        <span>{n.noteName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block mb-2">
                    Select Flacon Size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.size}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2 rounded-lg text-xs border text-left transition-all ${
                          selectedVariant?.size === v.size
                            ? 'bg-amber-500/20 border-amber-400 text-white font-semibold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[10px]">{v.size}</div>
                        <div className="font-bold text-amber-300 font-serif">
                          {cartStore.formatPrice(v.price)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price & Actions */}
            <div className="pt-4 border-t border-zinc-800 flex items-center gap-4">
              <div className="flex items-center border border-zinc-700 rounded-lg bg-black/40">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-zinc-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-3 text-sm font-semibold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-zinc-400 hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isAdded
                    ? 'bg-emerald-500 text-black'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black shadow-lg shadow-amber-500/20'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Bag • {cartStore.formatPrice((selectedVariant?.price || product.price) * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
