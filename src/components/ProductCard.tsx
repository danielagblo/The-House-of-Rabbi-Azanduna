import React, { useState } from 'react';
import type { Product, ProductVariant } from '../types';
import { Star, Check } from 'lucide-react';
import { cartStore } from '../store/cartStore';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const [selectedVariant] = useState<ProductVariant>(
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
    cartStore.openDrawer();
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Calculate savings badge if compareAtPrice is greater
  const savings = product.compareAtPrice && product.compareAtPrice > product.price
    ? (product.compareAtPrice - product.price).toFixed(2)
    : null;

  // Price range calculation if variants have different prices
  const priceDisplay = (() => {
    if (product.variants && product.variants.length > 1) {
      const prices = product.variants.map((v) => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice !== maxPrice) {
        return `GH₵${minPrice.toFixed(2)} - GH₵${maxPrice.toFixed(2)}`;
      }
    }
    return `GH₵${product.price.toFixed(2)}`;
  })();

  return (
    <div className="group flex flex-col bg-transparent">
      {/* Product Image Wrapper with Rounded Corners */}
      <a
        href={`/product/${product.slug}`}
        className="relative aspect-square sm:aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 block shadow-2xs"
      >
        {/* Main Image */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 ${
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

        {/* Red Save Badge in Top Left */}
        {savings && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <span className="bg-[#e62b32] text-white font-extrabold text-[9px] min-[360px]:text-[10px] sm:text-[11px] uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-[3px] shadow-xs tracking-wider">
              SAVE GH₵{savings}
            </span>
          </div>
        )}
      </a>

      {/* Full-width Red Add to Cart Button (Exact match to Oud Attar reference) */}
      <button
        onClick={handleAddToCart}
        className={`w-full mt-2.5 sm:mt-3 py-2 sm:py-3 px-2 sm:px-4 rounded-[6px] font-bold text-xs sm:text-sm tracking-wide text-white transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs cursor-pointer ${
          isAdded
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : 'bg-[#e62b32] hover:bg-[#cf2229] active:scale-[0.99]'
        }`}
      >
        {isAdded ? (
          <>
            <Check size={15} />
            <span>Added To Cart</span>
          </>
        ) : (
          <span>Add To Cart</span>
        )}
      </button>

      {/* Product Info (Centered below button) */}
      <div className="pt-2 text-center">
        <a href={`/product/${product.slug}`} className="block">
          <h3 className="font-['Barlow',sans-serif] text-[14px] sm:text-[17px] font-bold text-gray-900 hover:text-[#e62b32] transition-colors leading-tight sm:leading-snug line-clamp-2">
            {product.name}
          </h3>
        </a>

        {/* Star Ratings (Red/Amber stars + review count) */}
        <div className="flex items-center justify-center gap-1 my-1">
          <div className="flex text-[#e62b32]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="currentColor" />
            ))}
          </div>
          <span className="text-[11px] sm:text-[12px] text-gray-500 font-normal ml-0.5">
            {product.reviewCount || 48} reviews
          </span>
        </div>

        {/* Price & Strikethrough Discount Price */}
        <div className="font-['Barlow',sans-serif] text-[14px] sm:text-[16px] font-bold text-gray-900 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          <span>{priceDisplay}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-gray-400 line-through text-[11px] sm:text-xs font-normal">
              GH₵{product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
