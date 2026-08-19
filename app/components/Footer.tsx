// components/Footer.tsx
import Link from 'next/link'

interface FooterProps {
  companyName: string
  companySubtitle: string
  logo: string
  phone: string
  email: string
  address: string
  workingHours: string
}

export default function Footer({ companyName, companySubtitle, logo, phone, email, address, workingHours }: FooterProps) {
  return (
    <footer dir="ltr" style={{ textAlign: 'left' }} className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* القسم الأول: الشعار ونبذة الشركة */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {logo && (
                <div className="w-14 h-14 flex items-center justify-center shrink-0 overflow-hidden bg-white rounded-xl p-1 border border-slate-700 shadow-lg">
                  <img 
                    src={logo} 
                    alt={companyName} 
                    className="w-full h-full object-contain scale-125"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold text-white !m-0 !p-0 leading-none flex items-center tracking-tight">
                {companyName}
              </h3>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed font-normal">{companySubtitle}</p>
            <p className="text-sm text-slate-400 leading-relaxed font-normal flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-teal-500 shrink-0"></i>
              {address}
            </p>
          </div>

          {/* القسم الثاني: روابط سريعة */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* القسم الثالث: معلومات التواصل */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Contact Information</h4>
            <ul className="flex flex-col gap-3">
              <li className="text-sm text-slate-400 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <i className="fas fa-phone text-xs"></i>
                </div>
                <span dir="ltr">{phone}</span>
              </li>
              <li className="text-sm text-slate-400 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <i className="fas fa-envelope text-xs"></i>
                </div>
                <span className="truncate">{email}</span>
              </li>
              <li className="text-sm text-slate-400 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <i className="fas fa-map-marker-alt text-xs"></i>
                </div>
                <span className="line-clamp-1">{address}</span>
              </li>
            </ul>
          </div>

          {/* القسم الرابع: ساعات العمل */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Working Hours</h4>
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                  <i className="fas fa-clock text-xs"></i>
                </div>
                <p className="text-xs text-slate-300 font-medium whitespace-pre-line">
                  {workingHours || "Working hours not specified yet"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* الشريط السفلي */}
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} <span className="text-slate-400 font-medium">{companyName}</span> {companySubtitle}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}