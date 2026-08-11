import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function HomePage() {
  // 1. جلب بيانات الصفحة الرئيسية
  const { data: homeData } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'home')
    .single()

  // 2. جلب الإعدادات
  const { data: settings } = await supabase
    .from('settings')
    .select('*')

  // 3. جلب المميزات (Features)
  const { data: features } = await supabase
    .from('features')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  // 4. جلب الإحصائيات (Statistics)
  const { data: statistics } = await supabase
    .from('statistics')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  const getSetting = (key: string) => {
    return settings?.find(s => s.key === key)?.value || ''
  }

  // بناء البيانات من قاعدة البيانات فقط
  const siteData = {
    home: {
      companyName: homeData?.title || "Sadiq Al-Barhi",
      companySubtitle: getSetting('company_subtitle') || "Pharmaceutical & Medical Supplies",
      logo: getSetting('logo') || '',
      heroTitle: homeData?.subtitle || "Towards a Better Healthcare Future",
      heroDescription: homeData?.content || "Sadiq Al-Barhi Pharmaceutical & Medical Supplies - Your trusted partner in healthcare, providing quality medicines and medical supplies in Yemen.",
      heroImage: homeData?.image_url || "/images/hero.jpg",
      features: features || [],
      statistics: {
        sectionTitle: "Our Achievements",
        sectionDescription: "Numbers that speak for our excellence",
        stats: statistics || []
      }
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
                <Link href="/" className="nav-link active">Home</Link>
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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>{siteData.home.heroTitle}</h1>
            <p>{siteData.home.heroDescription}</p>
            <div className="hero-buttons">
              <Link href="/products" className="btn btn-primary">Explore Our Products</Link>
              <Link href="/about" className="btn btn-secondary">Learn About Us</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={siteData.home.heroImage} alt="Modern pharmaceutical laboratory" />
          </div>
        </div>
      </section>

      {/* Features Section - من قاعدة البيانات */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            {siteData.home.features.map((feature: any, index: number) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="products-preview">
        <div className="container">
          <h2 className="section-title">Our Featured Products</h2>
          <div className="products-grid">
            <div className="product-card">
              <img src="/images/default-product.jpg" alt="Cardiovascular Medicines" />
              <div className="product-info">
                <h3>Cardiovascular Medicines</h3>
                <p>High-quality products for healthcare professionals.</p>
                <Link href="/products" className="btn btn-outline">Learn More</Link>
              </div>
            </div>
            <div className="product-card">
              <img src="/images/default-product.jpg" alt="Respiratory System Medicines" />
              <div className="product-info">
                <h3>Respiratory System Medicines</h3>
                <p>High-quality products for healthcare professionals.</p>
                <Link href="/products" className="btn btn-outline">Learn More</Link>
              </div>
            </div>
            <div className="product-card">
              <img src="/images/default-product.jpg" alt="Medical Supplies & Equipment" />
              <div className="product-info">
                <h3>Medical Supplies & Equipment</h3>
                <p>High-quality products for healthcare professionals.</p>
                <Link href="/products" className="btn btn-outline">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - من قاعدة البيانات */}
      <section className="stats">
        <div className="container">
          <h2 className="section-titlee">{siteData.home.statistics.sectionTitle}</h2>
          <p className="section-description">{siteData.home.statistics.sectionDescription}</p>
          <div className="stats-grid">
            {siteData.home.statistics.stats.map((stat: any, index: number) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <p className="stat-description">{stat.description}</p>
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