import React, { useState } from 'react';
import type { Product, ProductVariant } from '../types';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { cartStore } from '../store/cartStore';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants?.[0] || {
      id: 0,
      size: 'Standard',
      price: product.price,
      inStock: true,
    }
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cartStore.addItem(product, selectedVariant, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const savings = product.compareAtPrice && product.compareAtPrice > selectedVariant.price
    ? (product.compareAtPrice - selectedVariant.price).toFixed(2)
    : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300">
      {/* Product Image Section */}
      <a href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-neutral-100 block">
        {/* Main Image */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 ${
            product.hoverImageUrl ? 'group-hover:opacity-0' : ''
          }`}
          loading="lazy"
        />

        {/* Hover Image */}
        {product.hoverImageUrl && (
          <img
            src={product.hoverImageUrl}
            alt={`${product.name} view`}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Red Save Badge */}
        {savings && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#ff2d3b] text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded shadow-sm">
              SAVE £{savings}
            </span>
          </div>
        )}

        {/* Concentration Tag */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-black font-semibold text-[10px] uppercase px-2.5 py-0.5 rounded shadow-sm border border-gray-200">
            {product.scentFamily}
          </span>
        </div>
      </a>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Star Ratings */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </div>
            <span className="text-[11px] text-gray-500 font-medium">
              ({product.reviewCount || 48})
            </span>
          </div>

          {/* Title */}
          <a href={`/product/${product.slug}`} className="block">
            <h3 className="font-['Barlow',sans-serif] text-lg font-bold text-gray-900 group-hover:text-[#ff2d3b] transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
              {product.subtitle || product.concentration}
            </p>
          </a>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          {/* Size Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.variants.map((v) => (
                <button
                  key={v.size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(v);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold border transition-all ${
                    selectedVariant.size === v.size
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                  }`}
                >
                  {v.size.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {/* Price & Add */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-black font-['Barlow',sans-serif]">
                {cartStore.formatPrice(selectedVariant.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > selectedVariant.price && (
                <span className="text-xs text-gray-400 line-through">
                  {cartStore.formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 shadow-sm ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black hover:bg-[#ff2d3b] text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={13} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={13} />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
