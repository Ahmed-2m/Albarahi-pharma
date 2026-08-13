// components/Footer.tsx
import Link from 'next/link'

interface FooterProps {
  companyName: string
  companySubtitle: string
  logo: string
  phone: string
  email: string
  address: string
}

export default function Footer({ companyName, companySubtitle, logo, phone, email, address }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            
            {/* الشعار والاسم بجانب بعض بحجم محكوم ومناسب */}
            <div className="flex items-center gap-3 mb-3">
             {logo && (
               <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden bg-white/10 rounded-xl p-1 border border-white/10">
                 <img 
                   src={logo} 
                   alt={companyName} 
                    className="max-w-full max-h-full object-contain"
                  />
               </div>
              )}
             {/* التعديل هنا: إزالة الـ margin والـ padding الافتراضي مع المحاذاة */}
              <h3 className="text-base font-extrabold !m-0 !p-0 leading-none flex items-center">
               {companyName}
              </h3>
            </div>

            <p>{companySubtitle}</p>
            <p>{address}</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/services">Services</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Information</h4>
            <ul>
              <li><i className="fas fa-phone"></i> {phone}</li>
              <li><i className="fas fa-envelope"></i> {email}</li>
              <li><i className="fas fa-map-marker-alt"></i> {address}</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Working Hours</h4>
            <ul>
              <li>Saturday - Thursday: 8:00 AM - 6:00 PM</li>
              <li>Friday: Closed</li>
              <li>Emergency Service: 24/7</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {companyName} {companySubtitle}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}