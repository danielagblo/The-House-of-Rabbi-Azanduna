import React, { useState, useEffect } from 'react';
import { discountStore } from '../store/discountStore';

const announcements = [
  {
    text: "DISCOUNT AT CHECKOUT",
    href: "/sale",
  },
  {
    text: "BANK HOLIDAY SALE",
    href: "/sale",
  },
];

export const AnnouncementBar: React.FC = () => {
  const [hasDiscounts, setHasDiscounts] = useState<boolean>(discountStore.getHasDiscounts() === true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    discountStore.checkDiscounts().then((hasDisc) => {
      setHasDiscounts(hasDisc);
    });
    const unsub = discountStore.subscribe((hasDisc) => {
      setHasDiscounts(hasDisc);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!hasDiscounts) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [hasDiscounts]);

  // If there are no discount prices, remove the discount red announcement completely
  if (!hasDiscounts) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="bg-[#e62b32] text-white py-1.5 sm:py-2 px-2.5 sm:px-6 sticky top-0 z-50 flex items-center justify-between shadow-xs select-none overflow-hidden">
      <button
        onClick={handlePrev}
        className="text-white hover:opacity-80 transition-opacity p-1 cursor-pointer flex items-center z-10 shrink-0"
        aria-label="Previous announcement"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="text-center flex-1 overflow-hidden px-1 sm:px-2 relative h-6 flex items-center justify-center">
        <div
          className="flex w-full transition-transform duration-500 ease-out items-center"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {announcements.map((item, idx) => (
            <div key={idx} className="w-full shrink-0 flex items-center justify-center px-1">
              <a
                href={item.href}
                className="font-['Barlow_Condensed',sans-serif] text-[13px] min-[380px]:text-[15px] sm:text-[16px] font-semibold tracking-[0.04em] sm:tracking-[0.06em] uppercase underline underline-offset-0 decoration-1 hover:opacity-90 whitespace-nowrap block truncate"
              >
                {item.text}
              </a>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="text-white hover:opacity-80 transition-opacity p-1 cursor-pointer flex items-center z-10 shrink-0"
        aria-label="Next announcement"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
