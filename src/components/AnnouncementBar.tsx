import React, { useState, useEffect } from 'react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const changeSlide = (newIndex: number) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFading(false);
    }, 200);
  };

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + announcements.length) % announcements.length;
    changeSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % announcements.length;
    changeSlide(nextIdx);
  };

  const current = announcements[currentIndex];

  return (
    <div className="bg-[#e62b32] text-white py-1.5 sm:py-2 px-4 sm:px-6 sticky top-0 z-50 flex items-center justify-between shadow-xs select-none">
      <button
        onClick={handlePrev}
        className="text-white hover:opacity-80 transition-opacity p-1 cursor-pointer flex items-center"
        aria-label="Previous announcement"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="text-center flex-1 overflow-hidden px-2">
        <a
          href={current.href}
          className={`font-['Barlow_Condensed',sans-serif] text-[15px] sm:text-[16px] font-semibold tracking-[0.06em] uppercase underline underline-offset-0 decoration-1 hover:opacity-90 transition-opacity duration-200 inline-block ${
            isFading ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
          }`}
        >
          {current.text}
        </a>
      </div>

      <button
        onClick={handleNext}
        className="text-white hover:opacity-80 transition-opacity p-1 cursor-pointer flex items-center"
        aria-label="Next announcement"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
