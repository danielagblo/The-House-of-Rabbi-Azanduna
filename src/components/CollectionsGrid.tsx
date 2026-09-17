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
      {/* Tall Condensed Heading matching Oud Attar reference */}
      <div className="text-center mb-5 sm:mb-6">
        <h1 className="font-['Barlow_Condensed',sans-serif] text-[38px] sm:text-[44px] lg:text-[48px] font-medium text-black tracking-tight leading-tight">
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
            {/* Pure Full-Bleed Image Container with Top-Left Discount Badge */}
            <div className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden bg-neutral-200">
              <img
                src={col.imageUrl}
                alt={col.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Red Discount / Save Badge in Top Left */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#e62b32] text-white font-extrabold text-[11px] sm:text-[12px] uppercase px-2.5 py-1 rounded-[3px] shadow-xs tracking-wider">
                  {discountBadges[idx % discountBadges.length]}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
