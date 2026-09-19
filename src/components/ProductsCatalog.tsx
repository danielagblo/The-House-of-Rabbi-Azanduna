import React, { useState, useMemo } from 'react';
import type { Product, Collection } from '../types';
import { ProductCard } from './ProductCard';
import { X } from 'lucide-react';

interface Props {
  initialProducts: Product[];
  collections: Collection[];
  initialCollectionSlug?: string;
  initialSearch?: string;
}

export const ProductsCatalog: React.FC<Props> = ({
  initialProducts,
  collections,
  initialCollectionSlug = 'all',
  initialSearch = '',
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollectionSlug);
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [visibleLimit, setVisibleLimit] = useState<number>(6);

  const scentFamilies = ['all', 'Oud', 'Woody', 'Amber', 'Floral', 'Oriental', 'Gourmand'];

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        if (selectedCollection !== 'all') {
          const col = collections.find((c) => c.slug === selectedCollection);
          if (col && product.collectionId !== col.id) return false;
        }

        if (selectedFamily !== 'all' && product.scentFamily.toLowerCase() !== selectedFamily.toLowerCase()) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchSubtitle = product.subtitle?.toLowerCase().includes(q);
          const matchNotes = product.notes?.some((n) => n.noteName.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchSubtitle && !matchNotes) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [initialProducts, collections, selectedCollection, selectedFamily, searchQuery, sortBy]);

  return (
    <div className="w-full bg-white">
      {/* Category Tabs */}
      <div className="border-b border-gray-200 pb-3 sm:pb-5 mb-6 sm:mb-8 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          <button
            onClick={() => setSelectedCollection('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs uppercase tracking-wider rounded-lg font-bold transition-all ${
              selectedCollection === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </button>
          {collections.map((col) => (
            <button
              key={col.slug}
              onClick={() => setSelectedCollection(col.slug)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs uppercase tracking-wider rounded-lg font-bold transition-all ${
                selectedCollection === col.slug
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
        {/* Scent Family Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-[11px] sm:text-xs uppercase text-gray-600 font-bold mr-1">
            Notes:
          </span>
          {scentFamilies.map((fam) => (
            <button
              key={fam}
              onClick={() => setSelectedFamily(fam)}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs rounded-md font-semibold transition-all ${
                selectedFamily === fam
                  ? 'bg-[#ff2d3b] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {fam === 'all' ? 'All Notes' : fam}
            </button>
          ))}
        </div>

        {/* Right Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-200">
          <span className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-black">{filteredProducts.length}</strong> fragrances
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white text-gray-800 text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-black font-medium"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedCollection !== 'all' || selectedFamily !== 'all' || searchQuery !== '') && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">Active:</span>
          {selectedCollection !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-200 text-black px-2.5 py-0.5 rounded-full font-semibold">
              {collections.find((c) => c.slug === selectedCollection)?.name}
              <button onClick={() => setSelectedCollection('all')}><X size={12} /></button>
            </span>
          )}
          {selectedFamily !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-200 text-black px-2.5 py-0.5 rounded-full font-semibold">
              {selectedFamily}
              <button onClick={() => setSelectedFamily('all')}><X size={12} /></button>
            </span>
          )}
          <button
            onClick={() => {
              setSelectedCollection('all');
              setSelectedFamily('all');
              setSearchQuery('');
            }}
            className="text-xs text-[#e62b32] underline font-bold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Product Grid: 2 columns on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
        {filteredProducts.slice(0, visibleLimit).map((product) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>

      {/* Pagination Progress Section */}
      <div className="mt-14 mb-4 text-center flex flex-col items-center justify-center">
        <p className="text-xs sm:text-sm text-gray-600 mb-3 font-['Poppins',sans-serif]">
          You have seen <strong className="text-black font-bold">{Math.min(visibleLimit, filteredProducts.length)}</strong> out of <strong className="text-black font-bold">{filteredProducts.length}</strong> products
        </p>

        {/* Red Progress Bar */}
        <div className="w-48 sm:w-64 h-1 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="bg-[#e62b32] h-full rounded-full transition-all duration-300"
            style={{
              width: `${filteredProducts.length > 0 ? (Math.min(visibleLimit, filteredProducts.length) / filteredProducts.length) * 100 : 100}%`
            }}
          ></div>
        </div>

        {visibleLimit < filteredProducts.length && (
          <button
            type="button"
            onClick={() => setVisibleLimit((prev) => prev + 6)}
            className="bg-[#e62b32] hover:bg-[#cf2229] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-lg shadow-xs transition-all uppercase tracking-wider font-['Barlow_Condensed',sans-serif] cursor-pointer"
          >
            Show more products
          </button>
        )}
      </div>
    </div>
  );
};
