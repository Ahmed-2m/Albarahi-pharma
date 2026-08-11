import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function AboutPage() {
  // 1. جلب بيانات About من Supabase
  const { data: aboutData } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'about')
    .single()

  // 2. جلب الإعدادات
  const { data: settings } = await supabase
    .from('settings')
    .select('*')

  // 3. جلب رحلة المؤسسة
  const { data: journeyData } = await supabase
    .from('journey')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  const getSetting = (key: string) => {
    return settings?.find(s => s.key === key)?.value || ''
  }

  // بناء البيانات من قاعدة البيانات فقط
  const siteData = {
    home: {
      companyName: getSetting('company_name') || "Sadiq Al-Barhi",
      companySubtitle: getSetting('company_subtitle') || "Pharmaceutical & Medical Supplies",
      logo: getSetting('logo') || ''
    },
    about: {
      pageTitle: aboutData?.title || "About Us",
      pageDescription: aboutData?.subtitle || "Learn about our journey, mission, and commitment to healthcare excellence",
      story: aboutData?.content || "Sadiq Al-Barhi Pharmaceutical & Medical Supplies was founded with a vision to provide high-quality healthcare solutions to the people of Yemen. Since our establishment, we have been committed to improving healthcare accessibility and quality throughout the region.",
      mission: getSetting('mission_text') || "To provide accessible, high-quality pharmaceutical products and medical supplies that improve the health and well-being of our communities.",
      vision: getSetting('vision_text') || "To be the leading pharmaceutical and medical supplies company in Yemen, recognized for our commitment to quality, innovation, and customer satisfaction.",
      aboutImage: aboutData?.image_url || "/images/AZ1aWoVQxgUy.jpg",
      journey: journeyData || []
    },
    contact: {
      phone: getSetting('phone') || "+967 1 234567",
      email: getSetting('email') || "info@sadiqalbarhi.com",
      address: getSetting('address') || "Sana'a, Yemen"
    }
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              {siteData.home.logo ? (
                <img 
                  src={siteData.home.logo} 
                  alt={siteData.home.companyName} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <h2>{siteData.home.companyName}</h2>
              )}
              <span>{siteData.home.companySubtitle}</span>
            </div>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/about" className="nav-link active">About Us</Link>
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

      {/* Page Header */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, #0A6E79 0%, #08545D 100%)',
        color: 'white',
        padding: '120px 0 60px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{siteData.about.pageTitle}</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
            {siteData.about.pageDescription}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="about-content" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="about-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '50px',
            alignItems: 'start'
          }}>
            <div className="about-text">
              <div className="about-section" style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#2C3E50', marginBottom: '15px' }}>Our Story</h2>
                <p style={{ color: '#666', lineHeight: '1.8' }}>{siteData.about.story}</p>
              </div>
              <div className="about-section" style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#2C3E50', marginBottom: '15px' }}>Our Mission</h2>
                <p style={{ color: '#666', lineHeight: '1.8' }}>{siteData.about.mission}</p>
              </div>
              <div className="about-section">
                <h2 style={{ color: '#2C3E50', marginBottom: '15px' }}>Our Vision</h2>
                <p style={{ color: '#666', lineHeight: '1.8' }}>{siteData.about.vision}</p>
              </div>
            </div>
            <div className="about-image">
              <img 
                src={siteData.about.aboutImage} 
                alt="About Us" 
                style={{ width: '100%', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company History - Our Journey (من قاعدة البيانات) */}
      <section className="history" style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', color: '#2C3E50', marginBottom: '50px' }}>
            Our Journey
          </h2>
          <div className="timeline" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {siteData.about.journey && siteData.about.journey.map((item: { year: string; title: string; description: string }, index: number) => (
              <div key={index} className="timeline-item" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '40px',
                marginBottom: '40px',
                paddingBottom: '40px',
                borderBottom: index < siteData.about.journey.length - 1 ? '1px solid #e0e0e0' : 'none'
              }}>
                <div className="timeline-year" style={{
                  minWidth: '80px',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  color: '#0A6E79',
                  lineHeight: '1.2'
                }}>
                  {item.year}
                </div>
                <div className="timeline-content" style={{
                  flex: 1
                }}>
                  <h3 style={{ 
                    color: '#2C3E50', 
                    marginBottom: '8px',
                    fontSize: '1.2rem',
                    fontWeight: '600'
                  }}>{item.title}</h3>
                  <p style={{ 
                    color: '#666',
                    lineHeight: '1.8',
                    fontSize: '1rem',
                    margin: 0
                  }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              {siteData.home.logo ? (
                <img 
                  src={siteData.home.logo} 
                  alt={siteData.home.companyName} 
                  className="h-12 w-auto object-contain mb-2"
                />
              ) : (
                <h3>{siteData.home.companyName}</h3>
              )}
              <p>{siteData.home.companySubtitle}</p>
              <p>{siteData.contact.address}</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
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
                <li><i className="fas fa-phone"></i> {siteData.contact.phone}</li>
                <li><i className="fas fa-envelope"></i> {siteData.contact.email}</li>
                <li><i className="fas fa-map-marker-alt"></i> {siteData.contact.address}</li>
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
            <p>&copy; 2025 {siteData.home.companyName} {siteData.home.companySubtitle}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}