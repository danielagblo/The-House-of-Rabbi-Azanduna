import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  products: Product[];
}

export const HeroCarousel: React.FC<Props> = ({ products }) => {
  const slides = products.filter((product) => product.imageUrl);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [slides.length, paused]);

  if (!slides.length) return null;

  const go = (next: number) => {
    const count = slides.length;
    setIndex((next + count) % count);
  };

  return (
    <section
      className="relative bg-[#0B1F3A] overflow-hidden"
      aria-label="Featured fragrances"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[150px] sm:h-[220px] lg:h-[260px]">
        {slides.map((product, slideIndex) => (
          <a
            key={product.id || product.slug}
            href={`/product/${product.slug}`}
            className={`absolute inset-0 block transition-opacity duration-700 ${
              slideIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={slideIndex !== index}
            tabIndex={slideIndex === index ? 0 : -1}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/85 via-[#0B1F3A]/20 to-[#0B1F3A]/25" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:pb-9 text-center text-white">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                The House of Rabbi Azanduna
              </p>
              <p className="font-['Barlow_Condensed',sans-serif] text-[22px] sm:text-[32px] font-bold leading-none mt-1">
                {product.name}
              </p>
            </div>
          </a>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#0B1F3A] hover:bg-white flex items-center justify-center cursor-pointer"
            aria-label="Previous hero image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#0B1F3A] hover:bg-white flex items-center justify-center cursor-pointer"
            aria-label="Next hero image"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2">
            {slides.map((product, slideIndex) => (
              <button
                key={product.id || product.slug}
                type="button"
                onClick={() => go(slideIndex)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  slideIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/55'
                }`}
                aria-label={`Show ${product.name}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
