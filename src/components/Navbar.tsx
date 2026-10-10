import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { cartStore } from '../store/cartStore';

const links = [
  { href: '/collections', label: 'Shop', match: (path: string) => path.startsWith('/collections') || path.startsWith('/product') },
  { href: '/blog', label: 'Blog', match: (path: string) => path.startsWith('/blog') },
  { href: '/faqs', label: 'FAQs', match: (path: string) => path.startsWith('/faqs') },
  { href: '/about', label: 'About Us', match: (path: string) => path.startsWith('/about') },
  { href: '/contact', label: 'Contact', match: (path: string) => path.startsWith('/contact') },
];

export const Navbar: React.FC = () => {
  const [itemCount, setItemCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className="w-full bg-white z-40 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-[64px] flex items-center gap-3 sm:gap-6">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#0B1F3A] cursor-pointer rounded-md"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <a href="/" className="shrink-0">
          <span className="font-['Montserrat',sans-serif] text-[15px] min-[390px]:text-lg sm:text-[20px] font-bold tracking-[0.14em] sm:tracking-[0.18em] text-[#0B1F3A] uppercase">
            Rabbi Azanduna
          </span>
        </a>

        <nav className="hidden lg:flex flex-1 items-center justify-center gap-7 font-['Barlow_Condensed',sans-serif] text-[18px] font-bold tracking-[0.04em] uppercase">
          {links.map((link) => {
            const active = link.match(currentPath);
            return (
              <a
                key={link.href}
                href={link.href}
                className={active ? 'text-[#0B1F3A] underline underline-offset-4' : 'text-[#0B1F3A]/75 hover:text-[#0B1F3A]'}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <button
          onClick={() => cartStore.openDrawer()}
          className="ml-auto lg:ml-0 p-2 text-[#0B1F3A] relative cursor-pointer"
          aria-label="Shopping Bag"
        >
          <ShoppingBag size={22} strokeWidth={1.5} />
          <span className="absolute top-0.5 right-0.5 bg-[#0B1F3A] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-gray-200 px-5 py-3 font-['Barlow_Condensed',sans-serif] text-xl font-bold uppercase text-[#0B1F3A]">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-gray-100 last:border-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
