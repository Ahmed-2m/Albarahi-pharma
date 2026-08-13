// components/Header.tsx
import Link from 'next/link'

interface HeaderProps {
  companyName: string
  companySubtitle: string
  logo: string
}

export default function Header({ companyName, companySubtitle, logo }: HeaderProps) {
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
            
            {/* أضفنا gap-1.5 مع leading-none لإنشاء مسافة ثابتة ومريحة بين الجملتين */}
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
              <Link href="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link">About Us</Link>
            </li>
            <li className="nav-item">
              <Link href="/products" className="nav-link">Products</Link>
            </li>
            <li className="nav-item">
              <Link href="/services" className="nav-link">Services</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link">Contact</Link>
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