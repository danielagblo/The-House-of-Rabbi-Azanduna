import { useRef } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  products: Product[];
  showHeading?: boolean;
}

export const FragranceCarousel: React.FC<Props> = ({ products, showHeading = true }) => {
  const scroller = useRef<HTMLDivElement>(null);

  const move = (direction: number) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(node.clientWidth * 0.8, 260), behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="pb-10 sm:pb-12" aria-label="Fragrances">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className={`flex items-center ${showHeading ? 'justify-between' : 'justify-end'} gap-4 mb-4`}>
          {showHeading && (
            <h2 className="font-['Barlow',sans-serif] text-2xl sm:text-3xl font-bold text-[#0B1F3A] uppercase tracking-tight">
              Fragrances
            </h2>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => move(-1)}
              className="w-9 h-9 rounded-full border border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Previous fragrances"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="w-9 h-9 rounded-full border border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Next fragrances"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-3.5 sm:scroll-px-6 lg:scroll-px-8 px-3.5 sm:px-6 lg:px-8 pb-2 no-scrollbar"
      >
        {products.map((product) => (
          <div key={product.id || product.slug} className="snap-start shrink-0 w-[210px] sm:w-[240px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
