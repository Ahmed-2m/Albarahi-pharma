// components/Header.tsx
'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  companyName: string
  companySubtitle: string
  logo: string
}

export default function Header({ companyName, companySubtitle, logo }: HeaderProps) {
  const pathname = usePathname();

  // دالة مساعدة لتحديد ما إذا كان الرابط هو الصفحة الحالية
  const isActive = (path: string) => pathname === path;

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          
          {/* قسم الشعار والاسم بجانب بعض بأسلوب متناسق */}
          <Link href="/" className="nav-logo flex items-center gap-3 text-decoration-none">
            {logo && (
              <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-200/80 p-1">
                <img 
                  src={logo} 
                  alt={companyName} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            
            <div className="flex flex-col justify-center gap-1.5">
              <h2 className="text-sm font-extrabold !m-0 !p-0 leading-none text-slate-900">
                {companyName}
              </h2>
              {companySubtitle && (
                <span className="text-[10px] text-teal-600 font-semibold leading-none">
                  {companySubtitle}
                </span>
              )}
            </div>
          </Link>

          <ul className="nav-menu">
            <li className="nav-item">
              <Link 
                href="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                style={{ color: isActive('/') ? '#0A6E79' : undefined, fontWeight: isActive('/') ? 'bold' : undefined }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/about" 
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                style={{ color: isActive('/about') ? '#0A6E79' : undefined, fontWeight: isActive('/about') ? 'bold' : undefined }}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/products" 
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                style={{ color: isActive('/products') ? '#0A6E79' : undefined, fontWeight: isActive('/products') ? 'bold' : undefined }}
              >
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/services" 
                className={`nav-link ${isActive('/services') ? 'active' : ''}`}
                style={{ color: isActive('/services') ? '#0A6E79' : undefined, fontWeight: isActive('/services') ? 'bold' : undefined }}
              >
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/contact" 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                style={{ color: isActive('/contact') ? '#0A6E79' : undefined, fontWeight: isActive('/contact') ? 'bold' : undefined }}
              >
                Contact
              </Link>
            </li>
          </ul>

          <div className="hamburger">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

        </div>
      </nav>
    </header>
  )
}