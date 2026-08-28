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
    <footer dir="ltr" style={{ textAlign: 'left' }} className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* تم تعديل الأعمدة هنا لتكون عموداً واحداً على الجوال وعمودين إلى 4 أعمدة في الشاشات الأكبر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* القسم الأول: الشعار ونبذة الشركة */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {logo && (
                <div className="w-12 h-12 flex items-center justify-center shrink-0 overflow-hidden bg-white rounded-xl p-1 border border-slate-700 shadow-md">
                  <img 
                    src={logo} 
                    alt={companyName} 
                    className="w-full h-full object-contain scale-110"
                  />
                </div>
              )}
              <h3 className="text-base font-bold text-white !m-0 !p-0 leading-tight tracking-tight">
                {companyName}
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">{companySubtitle}</p>
            <p className="text-xs text-slate-400 leading-relaxed font-normal flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-teal-500 shrink-0"></i>
              <span className="break-words">{address}</span>
            </p>
          </div>

          {/* القسم الثاني: روابط سريعة */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <span className="text-xs text-slate-600">›</span> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* القسم الثالث: معلومات التواصل */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Contact Information</h4>
            <ul className="flex flex-col gap-2.5">
              <li className="text-xs text-slate-400 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <i className="fas fa-phone text-[10px]"></i>
                </div>
                <span dir="ltr" className="break-all">{phone}</span>
              </li>
              <li className="text-xs text-slate-400 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <i className="fas fa-envelope text-[10px]"></i>
                </div>
                <span className="break-all">{email}</span>
              </li>
              <li className="text-xs text-slate-400 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <i className="fas fa-map-marker-alt text-[10px]"></i>
                </div>
                <span className="break-words">{address}</span>
              </li>
            </ul>
          </div>

          {/* القسم الرابع: ساعات العمل */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Working Hours</h4>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                  <i className="fas fa-clock text-[10px]"></i>
                </div>
                <p className="text-[11px] text-slate-300 font-medium whitespace-pre-line">
                  {workingHours || "Working hours not specified yet"}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* الشريط السفلي */}
        <div className="pt-6 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} <span className="text-slate-400 font-medium">{companyName}</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}