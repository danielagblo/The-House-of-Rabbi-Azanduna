import React from 'react';
import type { Collection } from '../types';
import { Star } from 'lucide-react';

interface Props {
  collections: Collection[];
  title?: string;
  subtitle?: string;
}

export const CollectionsGrid: React.FC<Props> = ({
  collections,
  title = "Collections",
}) => {
  // Discovery sets matching top 2 cards in reference screenshot (complete boxed bundle products)
  const discoverySets = [
    {
      name: "The Royal Discovery Collection (Full Set)",
      slug: "royal-quintet-discovery-set",
      imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
      saveBadge: "SAVE GH₵190.00",
      reviewCount: 5159,
      originalPrice: "GH₵480.00",
      salePrice: "GH₵290.00",
      isProduct: true,
    },
    {
      name: "The Best Seller Extrait Collection (Full Set)",
      slug: "extrait-grand-discovery-wardrobe",
      imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
      saveBadge: "SAVE GH₵180.00",
      reviewCount: 1151,
      originalPrice: "GH₵450.00",
      salePrice: "GH₵270.00",
      isProduct: true,
    },
  ];

  // 3-Column Category Showcase Cards matching reference screenshot
  const showcaseCategories = [
    {
      title: "Oud Perfume Oils",
      slug: "oud-perfume-oils",
      imageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Oud Elixirs",
      slug: "royal-attars",
      imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Limited Edition",
      slug: "extrait-de-parfum",
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  return (
    <section className="pt-5 sm:pt-6 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* 1. Tall Condensed Heading matching reference screenshot */}
      <div className="text-center mb-4 sm:mb-5">
        <h1 className="font-['Barlow_Condensed',sans-serif] text-[38px] sm:text-[44px] lg:text-[48px] font-bold text-black tracking-normal leading-tight">
          {title}
        </h1>
      </div>

      {/* 2. Top 2-Column Discovery Collections Grid with review stars and prices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
        {discoverySets.map((set, idx) => (
          <div key={idx} className="flex flex-col group">
            <a
              href={`/product/${set.slug}`}
              className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100 shadow-2xs block"
            >
              <img
                src={set.imageUrl}
                alt={set.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Red Save Badge in Top Left */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#e62b32] text-white font-extrabold text-[11px] sm:text-[12px] uppercase px-2.5 py-1 rounded-[3px] shadow-xs tracking-wider">
                  {set.saveBadge}
                </span>
              </div>
            </a>

            {/* Below Image: Centered Title, Stars, and Price */}
            <div className="pt-3 text-center">
              <a href={`/product/${set.slug}`}>
                <h3 className="font-['Barlow',sans-serif] text-[15px] sm:text-[16px] font-bold text-black group-hover:text-[#e62b32] transition-colors">
                  {set.name}
                </h3>
              </a>

              {/* Red Star Ratings */}
              <div className="flex items-center justify-center gap-1 my-1">
                <div className="flex text-[#e62b32]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500 font-normal ml-0.5">
                  {set.reviewCount} reviews
                </span>
              </div>

              {/* Strikethrough Original Price & Sale Price */}
              <div className="font-['Barlow',sans-serif] text-[13px] sm:text-[14px] font-bold flex items-center justify-center gap-1.5">
                <span className="line-through text-[#e62b32] font-semibold">
                  {set.originalPrice}
                </span>
                <span className="text-black font-bold">
                  {set.salePrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. 3-Column Category Showcase Cards (Oud Perfume Oils, Oud Elixirs, Limited Edition) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
        {showcaseCategories.map((cat, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <a
              href={`/collections/${cat.slug}`}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-2xs block"
            >
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </a>

            <div className="pt-3.5 pb-2 text-center flex flex-col items-center w-full">
              <a href={`/collections/${cat.slug}`}>
                <h3 className="font-['Barlow_Condensed',sans-serif] text-2xl sm:text-[26px] font-bold text-black group-hover:text-[#e62b32] transition-colors mb-2.5">
                  {cat.title}
                </h3>
              </a>

              {/* Red VIEW NOW Button */}
              <a
                href={`/collections/${cat.slug}`}
                className="inline-block bg-[#e62b32] hover:bg-[#cf2229] text-white px-6 py-1.5 rounded-[4px] text-[11px] sm:text-[12px] font-extrabold uppercase tracking-wider shadow-xs transition-colors"
              >
                VIEW NOW
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Full-Width Picture Showcase for Home Scents with Title and VIEW NOW below it */}
      <div className="flex flex-col items-center group">
        <a
          href="/collections/home-scents"
          className="relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-2xs block"
        >
          <img
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1800&q=80"
            alt="Home Scents"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </a>

        <div className="pt-3.5 pb-2 text-center flex flex-col items-center w-full">
          <a href="/collections/home-scents">
            <h3 className="font-['Barlow_Condensed',sans-serif] text-2xl sm:text-[28px] font-bold text-black group-hover:text-[#e62b32] transition-colors mb-2.5">
              Home Scents
            </h3>
          </a>

          {/* Red VIEW NOW Button */}
          <a
            href="/collections/home-scents"
            className="inline-block bg-[#e62b32] hover:bg-[#cf2229] text-white px-7 py-2 rounded-[4px] text-[11px] sm:text-[12px] font-extrabold uppercase tracking-wider shadow-xs transition-colors"
          >
            VIEW NOW
          </a>
        </div>
      </div>
    </section>
  );
};
