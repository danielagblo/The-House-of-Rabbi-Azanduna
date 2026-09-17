import React from 'react';
import type { Collection } from '../types';

interface Props {
  collections: Collection[];
  title?: string;
  subtitle?: string;
}

export const CollectionsGrid: React.FC<Props> = ({
  collections,
  title = "Discovery Collections",
}) => {
  // Discount badges matching the Oud Attar screenshot
  const discountBadges = ["SAVE £19.60", "SAVE £18.00", "SAVE £15.00", "SAVE £22.00", "SAVE £12.00"];

  return (
    <section className="pt-6 sm:pt-7 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-transparent">
      {/* Bold Tall Heading matching Oud Attar screenshot */}
      <div className="text-center mb-5 sm:mb-6">
        <h1 className="font-['Barlow_Semi_Condensed',sans-serif] text-[34px] sm:text-[42px] font-extrabold text-black tracking-tight leading-none">
          {title}
        </h1>
      </div>

      {/* Grid of Large Collection Cards matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {collections.map((col, idx) => (
          <a
            key={col.id || col.slug}
            href={`/collections/${col.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl bg-neutral-100 shadow-2xs hover:shadow-md transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden bg-neutral-200">
              <img
                src={col.imageUrl}
                alt={col.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Red Discount / Save Badge in Top Left */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#e62b32] text-white font-extrabold text-[11px] uppercase px-2.5 py-1 rounded-[3px] shadow-xs tracking-wider">
                  {discountBadges[idx % discountBadges.length]}
                </span>
              </div>
            </div>

            {/* Collection Card Bottom Info */}
            <div className="p-6 bg-white flex flex-col justify-between flex-1 border-t border-gray-100">
              <div>
                <span className="text-[11px] font-bold text-[#ff2d3b] uppercase tracking-wider block mb-1">
                  {col.subtitle || "Exclusive Blend"}
                </span>
                <h3 className="font-['Barlow',sans-serif] text-2xl font-bold text-gray-900 group-hover:text-[#ff2d3b] transition-colors">
                  {col.name}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2 font-light">
                  {col.description}
                </p>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-black uppercase tracking-wider group-hover:underline">
                  Shop Collection &rarr;
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {col.badge || "Hand-Poured in UK"}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
