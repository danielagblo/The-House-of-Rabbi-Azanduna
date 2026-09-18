import React, { useState } from 'react';
import type { Product, ProductVariant } from '../types';
import { cartStore } from '../store/cartStore';
import { ProductCard } from './ProductCard';
import { Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Check, Sparkles } from 'lucide-react';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailView: React.FC<Props> = ({ product, relatedProducts }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants?.[0] || {
      id: 0,
      size: 'Standard',
      price: product.price,
      inStock: true,
    }
  );
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    cartStore.addItem(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const images = [product.imageUrl, product.hoverImageUrl].filter(Boolean) as string[];

  const savings = product.compareAtPrice && product.compareAtPrice > selectedVariant.price
    ? (product.compareAtPrice - selectedVariant.price).toFixed(2)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-['Poppins',sans-serif]">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase text-gray-400 mb-8 flex items-center gap-2 font-medium">
        <a href="/" className="hover:text-black">Home</a>
        <span>/</span>
        <a href="/collections" className="hover:text-black">Collections</a>
        <span>/</span>
        <span className="text-black font-bold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden border border-gray-200 relative shadow-sm">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {savings && (
              <span className="absolute top-4 left-4 bg-[#ff2d3b] text-white font-extrabold text-xs uppercase px-3 py-1 rounded shadow">
                SAVE GH₵{savings}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-black scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-amber-500">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-semibold">
                ({product.reviewCount || 48} reviews)
              </span>
            </div>

            <h1 className="font-['Barlow',sans-serif] text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff2d3b] mt-1">
              {product.subtitle || product.concentration}
            </p>
          </div>

          {/* Price Strip */}
          <div className="flex items-baseline gap-3 pb-6 border-b border-gray-200">
            <span className="font-['Barlow',sans-serif] text-3xl font-extrabold text-black">
              GH₵{selectedVariant.price.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > selectedVariant.price && (
              <span className="text-base text-gray-400 line-through">
                GH₵{product.compareAtPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">
              In Stock
            </span>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed font-light">
            {product.description}
          </p>

          {/* Size Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs uppercase font-bold text-gray-800 block">
                Select Flacon Size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.size}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedVariant.size === v.size
                        ? 'bg-black text-white border-black font-bold shadow-sm'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-xs block">{v.size}</span>
                    <span className="font-['Barlow',sans-serif] font-bold text-sm block mt-0.5">
                      GH₵{v.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-black font-bold"
                >
                  -
                </button>
                <span className="px-3 font-bold text-black text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-black font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black hover:bg-[#ff2d3b] text-white shadow-md'
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
                    <span>Add to Bag • GH₵{(selectedVariant.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                cartStore.addItem(product, selectedVariant, quantity);
                cartStore.openDrawer();
              }}
              className="w-full py-3 bg-[#ff2d3b] hover:bg-[#e0202d] text-white font-extrabold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={15} />
              <span>Buy Now with Paystack</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200 text-xs text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-[#ff2d3b] shrink-0" />
              <span>Free Delivery &gt; GH₵350</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#ff2d3b] shrink-0" />
              <span>Paystack Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw size={18} className="text-[#ff2d3b] shrink-0" />
              <span>100% Pure Perfume Oil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Notes Breakdown */}
      {product.notes && product.notes.length > 0 && (
        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <h3 className="font-['Barlow',sans-serif] text-2xl font-bold text-black uppercase mb-6">
            Fragrance Notes & Accord
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.notes.map((note, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-5 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ff2d3b] block mb-1">
                  {note.layer} notes
                </span>
                <h4 className="font-bold text-black text-sm mb-1">{note.noteName}</h4>
                {note.description && (
                  <p className="text-xs text-gray-500 font-light">{note.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Pairings */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h3 className="font-['Barlow',sans-serif] text-2xl font-bold text-black uppercase mb-8 text-center">
            You May Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
