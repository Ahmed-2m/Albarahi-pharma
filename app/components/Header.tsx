// components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  companyName: string;
  companySubtitle: string;
  logo: string;
}

export default function Header({ companyName, companySubtitle, logo }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <header className="header" dir="ltr" style={{ textAlign: 'left' }}>
      <nav className="navbar">
        <div className="nav-container flex items-center justify-between relative">
          
          {/* قسم الشعار والاسم (تم ضبط العرض لمنع تكسر الكلمات) */}
          <Link href="/" className="flex items-center gap-3 text-decoration-none shrink-0">
            {logo && (
              <div className="h-11 flex items-center justify-center shrink-0 overflow-hidden bg-white rounded-xl px-2 py-1 border border-slate-200 shadow-sm">
                <img 
                  src={logo} 
                  alt={companyName} 
                  className="max-h-full w-auto object-contain"
                />
              </div>
            )}
            
            <div className="flex flex-col justify-center">
              <h2 className="text-base font-bold !m-0 !p-0 leading-tight text-slate-900 tracking-tight whitespace-nowrap">
                {companyName}
              </h2>
              {companySubtitle && (
                <span className="text-[11px] text-teal-600 font-medium leading-tight truncate max-w-[200px] sm:max-w-xs">
                  {companySubtitle}
                </span>
              )}
            </div>
          </Link>

          {/* روابط التنقل */}
          <ul 
            className="nav-menu"
            style={{ display: isMobileMenuOpen ? 'flex' : undefined }}
          >
            <li>
              <Link href="/" onClick={handleLinkClick} className={`nav-link ${isActive('/') ? 'active text-[#0A6E79] font-bold' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={handleLinkClick} className={`nav-link ${isActive('/about') ? 'active text-[#0A6E79] font-bold' : ''}`}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/products" onClick={handleLinkClick} className={`nav-link ${isActive('/products') ? 'active text-[#0A6E79] font-bold' : ''}`}>
                Products
              </Link>
            </li>
            <li>
              <Link href="/services" onClick={handleLinkClick} className={`nav-link ${isActive('/services') ? 'active text-[#0A6E79] font-bold' : ''}`}>
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={handleLinkClick} className={`nav-link ${isActive('/contact') ? 'active text-[#0A6E79] font-bold' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>

          {/* زر الهامبرغر للجوال */}
          <button 
            type="button"
            className="hamburger md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`w-6 h-0.5 bg-slate-800 my-1 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-slate-800 my-1 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-slate-800 my-1 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>

        </div>
      </nav>
    </header>
  );
}