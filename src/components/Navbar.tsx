import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
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
    <header className="w-full bg-white border-b border-gray-200 z-40 sticky top-0 shadow-xs">
      {/* Top Row: Search, Logo, User/Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-800 hover:text-black"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Left: Search Box */}
        <div className="hidden lg:block w-72 xl:w-80">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-white border border-gray-300 rounded-lg py-1.5 px-4 pr-10 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </form>
        </div>

        {/* Center: RABBI AZANDUNA LTD Brand Wordmark */}
        <div className="flex-1 lg:flex-initial text-center">
          <a href="/" className="inline-block group">
            <span className="font-['Barlow',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-[0.16em] text-black uppercase block">
              RABBI AZANDUNA
            </span>
            <span className="text-[9px] tracking-[0.3em] text-gray-500 font-bold uppercase block -mt-1">
              L T D
            </span>
          </a>
        </div>

        {/* Right: User & Cart Icons */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 w-auto lg:w-72 xl:w-80">
          <a
            href="/about"
            className="p-2 text-gray-700 hover:text-black transition-colors hidden sm:block"
            title="Account"
          >
            <User size={22} strokeWidth={1.75} />
          </a>

          <button
            onClick={() => cartStore.openDrawer()}
            className="p-2 text-gray-900 hover:text-[#ff2d3b] transition-colors relative flex items-center gap-1 group"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={22} strokeWidth={1.75} />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Row: Exact tall condensed typography from screenshot */}
      <div className="hidden lg:flex items-center justify-center gap-10 py-2.5 border-t border-gray-100 font-['Barlow_Condensed',sans-serif] text-[17px] font-bold tracking-normal uppercase text-black">
        <a href="/collections" className="hover:text-[#ff2d3b] transition-colors">
          SHOP
        </a>
        <a
          href="/sale"
          className="bg-[#ff2d3b] text-white px-3 py-0.5 rounded text-[15px] font-extrabold hover:bg-[#e0202d] transition-colors shadow-xs"
        >
          SALE
        </a>
        <a href="/blog" className="hover:text-[#ff2d3b] transition-colors">
          BLOG
        </a>
        <a href="/faqs" className="hover:text-[#ff2d3b] transition-colors">
          FAQS
        </a>
        <a href="/about" className="hover:text-[#ff2d3b] transition-colors">
          ABOUT US
        </a>
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
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 pr-10 text-xs text-gray-800"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
