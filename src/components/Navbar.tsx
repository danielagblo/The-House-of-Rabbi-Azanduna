import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { cartStore } from '../store/cartStore';

export const Navbar: React.FC = () => {
  const [itemCount, setItemCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const update = () => {
      setItemCount(cartStore.getItemCount());
    };
    update();
    return cartStore.subscribe(update);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collections?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full bg-white z-40">
      {/* Top Row: Search, Logo, Cart on Pure White Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-800 hover:text-black cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Left: Search Box (Matching exact user screenshot) */}
        <div className="hidden lg:block w-72 lg:w-80">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-white border border-[#e2e2e2] rounded-[4px] py-2 px-4 pr-11 text-[13.5px] text-black placeholder:text-[#1a1a1a] focus:outline-none focus:border-black transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black hover:opacity-75 transition-opacity cursor-pointer flex items-center justify-center"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={2} />
            </button>
          </form>
        </div>

        {/* Center: RABBI AZANDUNA LTD Brand Wordmark (Exact Bold Geometric Montserrat Style as OUD ATTAR) */}
        <div className="flex-1 lg:flex-initial text-center">
          <a href="/" className="inline-block group whitespace-nowrap">
            <span className="font-['Montserrat',sans-serif] text-xl sm:text-[23px] font-bold tracking-[0.25em] text-black uppercase">
              RABBI AZANDUNA LTD
            </span>
          </a>
        </div>

        {/* Right: Cart Icon */}
        <div className="flex items-center justify-end w-auto lg:w-72 lg:w-80">
          <button
            onClick={() => cartStore.openDrawer()}
            className="p-1 text-gray-900 hover:text-[#e62b32] transition-colors relative flex items-center gap-1 group cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Row: Dedicated Light Gray Strip matching screenshot */}
      <div className="bg-[#f4f4f4] border-y border-gray-200/80">
        <div className="hidden lg:flex items-center justify-center gap-8 sm:gap-10 py-2 max-w-7xl mx-auto px-4 font-['Barlow_Condensed',sans-serif] text-[18px] sm:text-[19px] font-bold tracking-[0.04em] uppercase text-[#1a1a1a] leading-tight">
          <a href="/collections" className="text-[#e62b32] hover:opacity-80 transition-colors">
            SHOP
          </a>
          <a
            href="/sale"
            className="bg-[#e62b32] text-white px-3.5 py-1 rounded-[4px] text-[15px] font-extrabold hover:bg-[#cf2229] transition-colors shadow-2xs tracking-[0.04em] leading-tight inline-flex items-center justify-center"
          >
            SALE
          </a>
          <a href="/blog" className="hover:underline transition-all">
            BLOG
          </a>
          <a href="/faqs" className="hover:underline transition-all">
            FAQS
          </a>
          <a href="/about" className="hover:underline transition-all">
            ABOUT US
          </a>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-6 py-5 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative mb-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-white border border-[#e2e2e2] rounded-[4px] py-2 px-4 pr-10 text-[13.5px] text-black placeholder:text-[#1a1a1a]"
            />
            <Search size={18} strokeWidth={2} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black" />
          </form>

          <nav className="flex flex-col gap-4 font-['Barlow_Condensed',sans-serif] text-lg font-bold uppercase text-black">
            <a href="/collections" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#ff2d3b]">
              SHOP
            </a>
            <a
              href="/sale"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block self-start bg-[#ff2d3b] text-white px-3 py-0.5 rounded text-base font-bold"
            >
              SALE
            </a>
            <a href="/blog" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#ff2d3b]">
              BLOG
            </a>
            <a href="/faqs" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#ff2d3b]">
              FAQS
            </a>
            <a href="/about" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-[#ff2d3b]">
              ABOUT US
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
