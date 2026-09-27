import React, { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../types';
import { cartStore } from '../store/cartStore';
import { ProductCard } from './ProductCard';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Check,
  Sparkles,
  Droplets,
  AlertCircle,
  SunMedium,
  ChevronDown,
} from 'lucide-react';

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
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl || '');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [openSection, setOpenSection] = useState<'apply' | 'precautions' | 'storage' | null>('apply');

  useEffect(() => {
    if (product?.imageUrl) {
      setActiveImage(product.imageUrl);
    }
  }, [product?.imageUrl]);

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
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 font-['Poppins',sans-serif]">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase text-gray-400 mb-6 sm:mb-8 flex items-center gap-1.5 sm:gap-2 font-medium overflow-x-auto no-scrollbar whitespace-nowrap">
        <a href="/" className="hover:text-black">Home</a>
        <span>/</span>
        <a href="/collections" className="hover:text-black">Collections</a>
        <span>/</span>
        <span className="text-black font-bold truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Left Image Gallery */}
        <div className="space-y-3 sm:space-y-4">
          <div className="aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden border border-gray-200 relative shadow-sm">
            <img
              src={activeImage || product.imageUrl}
              alt={product.name}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes('unsplash.com')) {
                  target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80';
                }
              }}
              className="w-full h-full object-cover object-center"
            />
            {savings && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#ff2d3b] text-white font-extrabold text-[10px] sm:text-xs uppercase px-2.5 py-1 rounded shadow">
                SAVE GH₵{savings}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
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
        <div className="space-y-5 sm:space-y-6">
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

            <h1 className="font-['Barlow',sans-serif] text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-[#ff2d3b] mt-1">
              {product.subtitle || product.concentration}
            </p>
          </div>

          {/* Price Strip */}
          <div className="flex items-baseline gap-3 pb-5 sm:pb-6 border-b border-gray-200">
            <span className="font-['Barlow',sans-serif] text-2xl sm:text-3xl font-extrabold text-black">
              GH₵{selectedVariant.price.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > selectedVariant.price && (
              <span className="text-sm sm:text-base text-gray-400 line-through">
                GH₵{product.compareAtPrice.toFixed(2)}
              </span>
            )}
            {product.inStock !== false && selectedVariant.inStock !== false ? (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded">
                In Stock
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded">
                Out of Stock
              </span>
            )}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                {product.variants.map((v) => {
                  const isVarInStock = v.inStock !== false && product.inStock !== false;
                  return (
                    <button
                      key={v.size}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                        selectedVariant.size === v.size
                          ? 'bg-black text-white border-black font-bold shadow-sm'
                          : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs block truncate">{v.size}</span>
                        {!isVarInStock && (
                          <span className="text-[9px] font-bold text-red-500 uppercase shrink-0">Sold Out</span>
                        )}
                      </div>
                      <span className="font-['Barlow',sans-serif] font-bold text-xs sm:text-sm block mt-0.5">
                        GH₵{v.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-3 pt-3 sm:pt-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 px-1.5 sm:px-2 py-1 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 sm:px-3 py-2 text-gray-600 hover:text-black font-bold"
                >
                  -
                </button>
                <span className="px-2 sm:px-3 font-bold text-black text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 sm:px-3 py-2 text-gray-600 hover:text-black font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.inStock === false || selectedVariant.inStock === false}
                className={`flex-1 py-3.5 px-3 sm:px-6 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                  product.inStock === false || selectedVariant.inStock === false
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white cursor-pointer'
                    : 'bg-black hover:bg-[#ff2d3b] text-white shadow-md cursor-pointer'
                }`}
              >
                {product.inStock === false || selectedVariant.inStock === false ? (
                  <span>Out of Stock</span>
                ) : isAdded ? (
                  <>
                    <Check size={16} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span className="truncate">Add to Bag • GH₵{(selectedVariant.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                if (product.inStock === false || selectedVariant.inStock === false) return;
                cartStore.addItem(product, selectedVariant, quantity);
                cartStore.openDrawer();
              }}
              disabled={product.inStock === false || selectedVariant.inStock === false}
              className={`w-full py-3 font-extrabold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 ${
                product.inStock === false || selectedVariant.inStock === false
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-[#ff2d3b] hover:bg-[#e0202d] text-white cursor-pointer'
              }`}
            >
              <Sparkles size={15} />
              <span>{product.inStock !== false && selectedVariant.inStock !== false ? 'Buy Now with Paystack' : 'Currently Out of Stock'}</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5 sm:gap-3 pt-5 sm:pt-6 border-t border-gray-200 text-xs text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#ff2d3b] shrink-0" />
              <span>Authentic Aged Oud</span>
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

          {/* Care, Application & Precautions Accordion (Option 1) */}
          <div className="pt-6 border-t border-gray-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Application & Fragrance Care
            </h4>

            {/* How & Where to Apply */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/60 transition-all">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'apply' ? null : 'apply')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-semibold text-xs sm:text-sm text-gray-900 hover:bg-gray-100/70 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Droplets size={16} className="text-[#ff2d3b]" />
                  <span>How & Where to Apply</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${
                    openSection === 'apply' ? 'rotate-180 text-black' : ''
                  }`}
                />
              </button>
              {openSection === 'apply' && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200/60 bg-white">
                  <p>
                    Focus on your pulse points—such as the wrists, behind the ears, and the base of the neck. Body heat in these zones helps amplify and diffuse the scent throughout the day.
                  </p>
                </div>
              )}
            </div>

            {/* Precautions & Safe Use */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/60 transition-all">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'precautions' ? null : 'precautions')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-semibold text-xs sm:text-sm text-gray-900 hover:bg-gray-100/70 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <AlertCircle size={16} className="text-[#ff2d3b]" />
                  <span>Precautions & Safe Use</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${
                    openSection === 'precautions' ? 'rotate-180 text-black' : ''
                  }`}
                />
              </button>
              {openSection === 'precautions' && (
                <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200/60 bg-white">
                  <ul className="space-y-2 list-none">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 shrink-0">• Distance:</span>
                      <span>Spray from roughly 30 cm (12 inches) away to ensure an even mist.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 shrink-0">• Fabrics:</span>
                      <span>Avoid direct contact with light or delicate textiles to prevent staining.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 shrink-0">• Sensitive Areas:</span>
                      <span>Do not spray on irritated skin, eyes, or mucous membranes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 shrink-0">• Patch Test:</span>
                      <span>If you have sensitive skin, test a tiny amount on the inside of your wrist before full application.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Storage Tips */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/60 transition-all">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'storage' ? null : 'storage')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-semibold text-xs sm:text-sm text-gray-900 hover:bg-gray-100/70 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <SunMedium size={16} className="text-[#ff2d3b]" />
                  <span>Storage Tips</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${
                    openSection === 'storage' ? 'rotate-180 text-black' : ''
                  }`}
                />
              </button>
              {openSection === 'storage' && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200/60 bg-white">
                  <p>
                    Keep your fragrance in a cool, dry spot shielded from direct sunlight and sharp temperature shifts to preserve its original character and longevity.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Notes Breakdown */}
      {product.notes && product.notes.length > 0 && (
        <div className="mt-12 sm:mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-8">
          <h3 className="font-['Barlow',sans-serif] text-xl sm:text-2xl font-bold text-black uppercase mb-4 sm:mb-6">
            Fragrance Notes & Accord
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {product.notes.map((note, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xl">
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
        <div className="mt-12 sm:mt-16 border-t border-gray-200 pt-8 sm:pt-12">
          <h3 className="font-['Barlow',sans-serif] text-xl sm:text-2xl font-bold text-black uppercase mb-6 sm:mb-8 text-center">
            You May Also Like
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {relatedProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
