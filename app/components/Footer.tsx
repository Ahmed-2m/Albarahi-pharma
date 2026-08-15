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
    <footer style={{
      background: 'linear-gradient(135deg, #0A6E79 0%, #08545D 100%)',
      color: '#ffffff',
      padding: '70px 0 20px',
      fontFamily: 'inherit',
      boxShadow: '0 -5px 20px rgba(0,0,0,0.1)'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* شبكة محتويات الفوتر */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2.5rem',
          marginBottom: '50px'
        }}>
          
          {/* القسم الأول: الشعار والنبذة */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex items-center gap-3">
              {logo && (
                <div style={{
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '5px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <img 
                    src={logo} 
                    alt={companyName} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, letterSpacing: '0.5px' }}>
                {companyName}
              </h3>
            </div>
            {companySubtitle && (
              <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: 0, lineHeight: '1.5' }}>
                {companySubtitle}
              </p>
            )}
            {address && (
              <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-map-marker-alt" style={{ opacity: 0.9 }}></i> {address}
              </p>
            )}
          </div>

          {/* القسم الثاني: روابط سريعة */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: '1.2rem',
              borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* القسم الثالث: معلومات التواصل */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: '1.2rem',
              borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              Contact Information
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', opacity: 0.9 }}>
                <i className="fas fa-phone" style={{ width: '16px', opacity: 0.8 }}></i> 
                <span>{phone}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', opacity: 0.9 }}>
                <i className="fas fa-envelope" style={{ width: '16px', opacity: 0.8 }}></i> 
                <span>{email}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem', opacity: 0.9 }}>
                <i className="fas fa-map-marker-alt" style={{ width: '16px', marginTop: '3px', opacity: 0.8 }}></i> 
                <span>{address}</span>
              </li>
            </ul>
          </div>

          {/* القسم الرابع: ساعات العمل */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              marginBottom: '1.2rem',
              borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              Working Hours
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem', opacity: 0.9 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-clock" style={{ width: '16px', opacity: 0.8 }}></i>
                <span>Saturday - Thursday: 8:00 AM - 6:00 PM</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-ban" style={{ width: '16px', opacity: 0.8 }}></i>
                <span>Friday: Closed</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-headset" style={{ width: '16px', opacity: 0.8 }}></i>
                <span>Emergency Service: 24/7</span>
              </li>
            </ul>
          </div>

        </div>

        {/* خط الفاصل السفلي */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '0.85rem',
          opacity: 0.8
        }}>
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} {companyName} {companySubtitle ? `- ${companySubtitle}` : ''}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}