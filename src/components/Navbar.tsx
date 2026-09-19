import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { cartStore } from '../store/cartStore';

export const Navbar: React.FC = () => {
  const [itemCount, setItemCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
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

  const isShopActive = currentPath === '/' || currentPath.startsWith('/collections') || currentPath.startsWith('/product');
  const isSaleActive = currentPath.startsWith('/sale');
  const isBlogActive = currentPath.startsWith('/blog');
  const isFaqsActive = currentPath.startsWith('/faqs');
  const isAboutActive = currentPath.startsWith('/about');

  return (
    <header className="w-full bg-white z-40">
      {/* Top Row: Search, Logo, Cart on Pure White Canvas */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-800 hover:text-black cursor-pointer rounded-md active:bg-gray-100"
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
        <div className="flex-1 lg:flex-initial text-center overflow-hidden">
          <a href="/" className="inline-block group">
            <span className="font-['Montserrat',sans-serif] text-[15px] min-[390px]:text-lg sm:text-[23px] font-bold tracking-[0.12em] min-[390px]:tracking-[0.18em] sm:tracking-[0.25em] text-black uppercase block truncate">
              RABBI AZANDUNA LTD
            </span>
          </a>
        </div>

        {/* Right: Cart Icon */}
        <div className="flex items-center justify-end w-auto lg:w-72 lg:w-80">
          <button
            onClick={() => cartStore.openDrawer()}
            className="p-2 text-gray-900 hover:text-[#e62b32] transition-colors relative flex items-center gap-1 group cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className="absolute top-0.5 right-0.5 bg-black text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Row: Dedicated Light Gray Strip matching screenshot */}
      <div className="bg-[#f4f4f4] border-y border-gray-200/80">
        <div className="hidden lg:flex items-center justify-center gap-8 sm:gap-10 py-2 max-w-7xl mx-auto px-4 font-['Barlow_Condensed',sans-serif] text-[18px] sm:text-[19px] font-bold tracking-[0.04em] uppercase leading-tight">
          <a
            href="/collections"
            className={`${isShopActive ? 'text-[#e62b32]' : 'text-[#1a1a1a] hover:underline'} transition-colors`}
          >
            SHOP
          </a>
          <a
            href="/sale"
            className={`px-3.5 py-1 rounded-[4px] text-[15px] font-extrabold transition-colors shadow-2xs tracking-[0.04em] leading-tight inline-flex items-center justify-center ${
              isSaleActive ? 'bg-[#cf2229] text-white ring-2 ring-[#e62b32]/50' : 'bg-[#e62b32] text-white hover:bg-[#cf2229]'
            }`}
          >
            SALE
          </a>
          <a
            href="/blog"
            className={`${isBlogActive ? 'text-[#e62b32]' : 'text-[#1a1a1a] hover:underline'} transition-colors`}
          >
            BLOG
          </a>
          <a
            href="/faqs"
            className={`${isFaqsActive ? 'text-[#e62b32]' : 'text-[#1a1a1a] hover:underline'} transition-colors`}
          >
            FAQS
          </a>
          <a
            href="/about"
            className={`${isAboutActive ? 'text-[#e62b32]' : 'text-[#1a1a1a] hover:underline'} transition-colors`}
          >
            ABOUT US
          </a>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-5 py-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-white border border-[#e2e2e2] rounded-[4px] py-2.5 px-4 pr-10 text-[14px] text-black placeholder:text-[#1a1a1a] focus:outline-none focus:border-black"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black p-1" aria-label="Search">
              <Search size={18} strokeWidth={2} />
            </button>
          </form>

          <nav className="flex flex-col gap-1 font-['Barlow_Condensed',sans-serif] text-xl font-bold uppercase text-black">
            <a
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-2 border-b border-gray-100 flex items-center justify-between ${isShopActive ? 'text-[#e62b32]' : 'hover:text-[#e62b32]'}`}
            >
              <span>SHOP</span>
              <span className="text-xs text-gray-400 font-normal">→</span>
            </a>
            <a
              href="/sale"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-2 border-b border-gray-100 flex items-center justify-between text-[#e62b32]"
            >
              <span>SALE</span>
              <span className="bg-[#e62b32] text-white text-[11px] font-extrabold px-2 py-0.5 rounded">20% OFF</span>
            </a>
            <a
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-2 border-b border-gray-100 flex items-center justify-between ${isBlogActive ? 'text-[#e62b32]' : 'hover:text-[#e62b32]'}`}
            >
              <span>BLOG</span>
              <span className="text-xs text-gray-400 font-normal">→</span>
            </a>
            <a
              href="/faqs"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-2 border-b border-gray-100 flex items-center justify-between ${isFaqsActive ? 'text-[#e62b32]' : 'hover:text-[#e62b32]'}`}
            >
              <span>FAQS</span>
              <span className="text-xs text-gray-400 font-normal">→</span>
            </a>
            <a
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2.5 px-2 flex items-center justify-between ${isAboutActive ? 'text-[#e62b32]' : 'hover:text-[#e62b32]'}`}
            >
              <span>ABOUT US</span>
              <span className="text-xs text-gray-400 font-normal">→</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
