import React, { useState, useEffect } from 'react';
import type { Collection, Product } from '../types';
import { Star } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface Props {
  collections: Collection[];
  title?: string;
  subtitle?: string;
}

export const CollectionsGrid: React.FC<Props> = ({
  collections: initialCollections = [],
  title = "Collections",
}) => {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [loading, setLoading] = useState<boolean>(initialCollections.length === 0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/collections`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setCollections(data);
        }
      })
      .catch((err) => console.error('Failed to load collections:', err))
      .finally(() => setLoading(false));
  }, []);

  // 1. Identify Discovery / Gift Sets collection
  const discoveryCollection = collections.find(
    (c) => c.slug === 'discovery-sets' || c.name.toLowerCase().includes('discovery')
  );

  // Discovery items (products inside the discovery collection)
  const discoveryProducts: Product[] = discoveryCollection?.products && discoveryCollection.products.length > 0
    ? discoveryCollection.products
    : [];

  // 2. Identify full-width bottom banner collection (Home Scents / Bakhoor)
  const bannerCollection = collections.find(
    (c) => c.slug === 'home-scents' || c.name.toLowerCase().includes('home') || c.name.toLowerCase().includes('bakhoor')
  );

  // 3. Grid showcase collections: all other collections
  const showcaseCollections = collections.filter((c) => {
    if (discoveryCollection && c.id === discoveryCollection.id && discoveryProducts.length > 0) {
      return false; // shown in top discovery row
    }
    if (bannerCollection && c.id === bannerCollection.id) {
      return false; // shown in bottom wide banner
    }
    return true;
  });

  return (
    <section className="pt-4 sm:pt-6 pb-12 sm:pb-14 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* 1. Condensed Heading */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="font-['Barlow_Condensed',sans-serif] text-[32px] sm:text-[44px] lg:text-[48px] font-bold text-black tracking-normal leading-tight">
          {title}
        </h1>
        {loading && (
          <p className="text-xs text-gray-400 mt-1 animate-pulse">Loading live collections...</p>
        )}
      </div>

      {/* 2. Top 2-Column Discovery / Gift Sets Grid */}
      {discoveryProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {discoveryProducts.map((prod) => {
            const savings = prod.compareAtPrice && prod.compareAtPrice > prod.price
              ? (prod.compareAtPrice - prod.price).toFixed(2)
              : null;
            return (
              <div key={prod.id || prod.slug} className="flex flex-col group">
                <a
                  href={`/product/${prod.slug}`}
                  className="relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 shadow-2xs block"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80';
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {savings && (
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                      <span className="bg-[#e62b32] text-white font-extrabold text-[10px] sm:text-[12px] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[3px] shadow-xs tracking-wider">
                        SAVE GH₵{savings}
                      </span>
                    </div>
                  )}
                </a>

                <div className="pt-3 text-center">
                  <a href={`/product/${prod.slug}`}>
                    <h3 className="font-['Barlow',sans-serif] text-[15px] sm:text-[16px] font-bold text-black group-hover:text-[#e62b32] transition-colors">
                      {prod.name}
                    </h3>
                  </a>

                  <div className="flex items-center justify-center gap-1 my-1">
                    <div className="flex text-[#e62b32]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500 font-normal ml-0.5">
                      {prod.reviewCount || 100}+ reviews
                    </span>
                  </div>

                  <div className="font-['Barlow',sans-serif] text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-1.5">
                    {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                      <span className="line-through text-[#e62b32] font-semibold">
                        GH₵{prod.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-black font-bold">
                      GH₵{prod.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Category Showcase Grid (All dynamic collections from database) */}
      {showcaseCollections.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-12">
          {showcaseCollections.map((cat) => {
            const productCount = cat.products ? cat.products.length : 0;
            return (
              <div key={cat.id || cat.slug} className="flex flex-col items-center group">
                <a
                  href={`/collections/${cat.slug}`}
                  className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-2xs block"
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80';
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Badge if present */}
                  {cat.badge && (
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                      <span className="bg-[#e62b32] text-white font-extrabold text-[10px] sm:text-[11px] uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-[3px] shadow-xs tracking-wider">
                        {cat.badge}
                      </span>
                    </div>
                  )}

                  {/* Product Count Pill */}
                  {productCount > 0 && (
                    <span className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded">
                      {productCount} {productCount === 1 ? 'Fragrance' : 'Fragrances'}
                    </span>
                  )}
                </a>

                <div className="pt-3 pb-2 text-center flex flex-col items-center w-full">
                  <a href={`/collections/${cat.slug}`}>
                    <h3 className="font-['Barlow_Condensed',sans-serif] text-2xl sm:text-[26px] font-bold text-black group-hover:text-[#e62b32] transition-colors mb-1">
                      {cat.name}
                    </h3>
                  </a>

                  {cat.subtitle && (
                    <p className="text-xs text-gray-500 font-medium mb-2.5 line-clamp-1">
                      {cat.subtitle}
                    </p>
                  )}

                  {/* Red VIEW NOW Button */}
                  <a
                    href={`/collections/${cat.slug}`}
                    className="inline-block bg-[#e62b32] hover:bg-[#cf2229] text-white px-6 py-1.5 rounded-[4px] text-[11px] sm:text-[12px] font-extrabold uppercase tracking-wider shadow-xs transition-colors"
                  >
                    VIEW NOW
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Full-Width Showcase for Home Scents / Bakhoor */}
      {bannerCollection && (
        <div className="flex flex-col items-center group">
          <a
            href={`/collections/${bannerCollection.slug}`}
            className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-2xs block"
          >
            <img
              src={bannerCollection.imageUrl}
              alt={bannerCollection.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1800&q=80';
              }}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {bannerCollection.badge && (
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                <span className="bg-[#e62b32] text-white font-extrabold text-[11px] sm:text-[12px] uppercase px-3 py-1 rounded-[3px] shadow-xs tracking-wider">
                  {bannerCollection.badge}
                </span>
              </div>
            )}
          </a>

          <div className="pt-3.5 pb-2 text-center flex flex-col items-center w-full">
            <a href={`/collections/${bannerCollection.slug}`}>
              <h3 className="font-['Barlow_Condensed',sans-serif] text-2xl sm:text-[28px] font-bold text-black group-hover:text-[#e62b32] transition-colors mb-1.5">
                {bannerCollection.name}
              </h3>
            </a>

            {bannerCollection.subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 font-medium mb-2.5">
                {bannerCollection.subtitle}
              </p>
            )}

            {/* Red VIEW NOW Button */}
            <a
              href={`/collections/${bannerCollection.slug}`}
              className="inline-block bg-[#e62b32] hover:bg-[#cf2229] text-white px-7 py-2 rounded-[4px] text-[11px] sm:text-[12px] font-extrabold uppercase tracking-wider shadow-xs transition-colors"
            >
              VIEW NOW
            </a>
          </div>
        </div>
      )}
    </section>
  );
};
