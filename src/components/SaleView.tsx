import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { API_BASE_URL } from '../config/api';
import { discountStore } from '../store/discountStore';

interface SaleViewProps {
  initialProducts: Product[];
}

export const SaleView: React.FC<SaleViewProps> = ({ initialProducts = [] }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(initialProducts.length === 0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && Array.isArray(data)) {
          setProducts(data);
          const hasAnyDiscount = data.some(
            (p: any) => p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price)
          );
          discountStore.setHasDiscounts(hasAnyDiscount);
        }
      })
      .catch(() => {
        // use initial
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const hasDiscounts = products.some(
    (p) => p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price)
  );

  // Display all products, prioritizing discounted items at the top if any exist
  const displayedProducts = [...products].sort((a, b) => {
    const discA = a.compareAtPrice && Number(a.compareAtPrice) > Number(a.price) ? 1 : 0;
    const discB = b.compareAtPrice && Number(b.compareAtPrice) > Number(b.price) ? 1 : 0;
    return discB - discA;
  });

  return (
    <div className="pt-4 sm:pt-5 pb-12 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* Header: Conditionally display Bank Holiday Sale / Minimum 20% Off! / Discount applied at checkout ONLY if discounts exist */}
      {hasDiscounts ? (
        <div className="text-center pt-1 pb-5 sm:pb-6">
          <h1 className="font-['Barlow',sans-serif] text-2xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight mb-1">
            Bank Holiday Sale
          </h1>
          <p className="font-['Barlow',sans-serif] text-lg sm:text-2xl font-bold text-[#e62b32] mb-1">
            Minimum 20% Off!
          </p>
          <p className="text-xs text-gray-500 font-normal">
            Discount applied at checkout
          </p>
        </div>
      ) : (
        <div className="text-center pt-1 pb-5 sm:pb-6">
          <h1 className="font-['Barlow',sans-serif] text-2xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight mb-1">
            All Fragrances
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal mt-1">
            Browse our complete selection of artisanal perfume oils and extrait de parfums
          </p>
        </div>
      )}

      {/* Products Grid: Displays ALL products */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-3 border-gray-300 border-t-[#e62b32] rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-gray-500 font-medium">Loading collection...</p>
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-50 border border-gray-200 rounded-xl my-6">
          <p className="text-base font-bold text-gray-800 mb-2 font-['Barlow',sans-serif]">
            No fragrances currently available.
          </p>
          <a
            href="/collections"
            className="inline-block bg-[#e62b32] hover:bg-[#cf2229] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-colors mt-2"
          >
            Explore Collections
          </a>
        </div>
      )}

      {/* Progress / Pagination indicator */}
      {displayedProducts.length > 0 && (
        <div className="mt-14 mb-4 text-center flex flex-col items-center justify-center">
          <p className="text-xs sm:text-sm text-gray-600 mb-3 font-['Poppins',sans-serif]">
            You have seen <strong className="text-black font-bold">{displayedProducts.length}</strong> out of <strong className="text-black font-bold">{displayedProducts.length}</strong> products
          </p>

          <div className="w-48 sm:w-64 h-1 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div className="bg-[#e62b32] h-full rounded-full" style={{ width: '100%' }}></div>
          </div>

          <button
            type="button"
            className="bg-[#e62b32] hover:bg-[#cf2229] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-lg shadow-xs transition-all uppercase tracking-wider font-['Barlow_Condensed',sans-serif] cursor-pointer"
          >
            Show more products
          </button>
        </div>
      )}
    </div>
  );
};
