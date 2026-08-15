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

  // 3. جلب الإحصائيات (Statistics)
  const { data: statistics } = await supabase
    .from('statistics')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  // 4. جلب 4 خدمات فقط من لوحة التحكم مرتبة حسب الترتيب
  const { data: serviceCards, error: servicesError } = await supabase
    .from('service_cards')
    .select('*')
    .order('sort_order', { ascending: true })
    .limit(3)

  if (servicesError) {
    console.error("Error fetching service cards:", servicesError)
  }

  // 5. جلب المنتجات الحقيقية لعرضها في قسم Our Featured Products مع تدويرها أسبوعياً
  const { data: allProducts, error: productsError } = await supabase
    .from('products')
    .select('*')

  let featuredProducts: any[] = []

  if (!productsError && allProducts) {
    // تصفية واستبعاد عناصر وصف الفئات الأساسية
    const validProducts = allProducts.filter(p => !p.name?.startsWith("عنصر أساسي -"));

    if (validProducts.length > 0) {
      // حساب رقم الأسبوع الحالي في السنة لتتغير المنتجات تلقائياً كل أسبوع
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const weekNumber = Math.ceil((((now.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
      
      const countToTake = Math.min(3, validProducts.length); // عرض 3 منتجات
      const startIndex = (weekNumber * countToTake) % validProducts.length;
      
      // سحب المنتجات وتدويرها بناءً على الأسبوع
      for (let i = 0; i < countToTake; i++) {
        const index = (startIndex + i) % validProducts.length;
        featuredProducts.push(validProducts[index]);
      }
    }
  }

  const getSetting = (key: string) => {
    return settings?.find(s => s.key === key)?.value || ''
  }

  const siteData = {
    home: {
      companyName: getSetting('company_name') || "Sadiq Al-Barhi",
      companySubtitle: getSetting('company_subtitle') || "Pharmaceutical & Medical Supplies",
      logo: getSetting('logo') || '',
      heroTitle: homeData?.subtitle || "Towards a Better Healthcare Future",
      heroDescription: homeData?.content || "Sadiq Al-Barhi Pharmaceutical & Medical Supplies - Your trusted partner in healthcare, providing quality medicines and medical supplies in Yemen.",
      heroImage: homeData?.image_url || "/images/hero.jpg",
      services: serviceCards || [],
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
          
          <div className="hero-image hero-image-interactive">
            <img src={siteData.home.heroImage} alt="Modern pharmaceutical laboratory" />
          </div>
        </div>
      </section>

      {/* باقي أقسام الموقع */}
      <section className="features">
        <div className="container">
          {/* عنوان القسم محاط بإطار أخضر أنيق ومتناسق */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ 
              fontSize: '1.8rem', 
              color: '#0A6E79', 
              fontWeight: '700', 
              backgroundColor: '#e6f4f6', 
              border: '2px solid #0A6E79', 
              padding: '10px 30px', 
              borderRadius: '30px', 
              display: 'inline-block',
              boxShadow: '0 4px 12px rgba(10, 110, 121, 0.1)'
            }}>
              Why Choose Us?
            </span>
          </div>
          
          {siteData.home.services.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>No features available at the moment.</p>
          ) : (
            <div className="features-grid">
              {siteData.home.services.map((service: any, index: number) => (
                <div 
                  key={index} 
                  className="feature-card" 
                  style={{ 
                    maxHeight: '280px',      
                    overflowY: 'auto',        
                    scrollbarWidth: 'none',   
                    msOverflowStyle: 'none',  
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <style dangerouslySetInnerHTML={{ __html: `
                    .feature-card::-webkit-scrollbar {
                      display: none;
                    }
                  `}} />

                  <div className="feature-icon">
                    <i className={service.icon || 'fas fa-check-circle'}></i>
                  </div>
                  <h3 style={{ fontWeight: 'bold' }}>{service.title}</h3>
                  <p>{service.description}</p>

                  {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px', textAlign: 'left', width: '100%' }} dir="ltr">
                      {service.features.map((feat: string, fIdx: number) => (
                        <li key={fIdx} style={{ fontSize: '0.85rem', color: '#555', padding: '3px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#0A6E79', fontWeight: 'bold' }}>✓</span> {feat}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Preview (Featured Products) */}
      <section className="products-preview">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ 
              fontSize: '1.8rem', 
              color: '#0A6E79', 
              fontWeight: '700', 
              backgroundColor: '#e6f4f6', 
              border: '2px solid #0A6E79', 
              padding: '10px 30px', 
              borderRadius: '30px', 
              display: 'inline-block',
              boxShadow: '0 4px 12px rgba(10, 110, 121, 0.1)'
            }}>
              Our Featured Products
            </span>
          </div>
          
          {featuredProducts.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>No featured products available at the moment.</p>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product: any, index: number) => (
                <div className="product-card" key={product.id || index}>
                  <img 
                    src={product.image_url || "/images/default-product.jpg"} 
                    alt={product.name} 
                    style={{ objectFit: 'contain', background: '#f8fafc', padding: '10px' }} 
                  />
                  <div className="product-info">
                    {product.category && (
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ 
                          fontSize: '0.85rem', 
                          color: '#0A6E79', 
                          fontWeight: '600', 
                          backgroundColor: '#e6f4f6', 
                          border: '1px solid #0A6E79', 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          display: 'inline-block' 
                        }}>
                          {product.category}
                        </span>
                      </div>
                    )}

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px', color: '#222' }}>
                      {product.name}
                    </h3>
                    
                    {product.description && product.description.trim() !== "" && (
                      <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '15px' }}>
                        {product.description}
                      </p>
                    )}

                    <Link href="/products" className="btn btn-outline" style={{ marginTop: '10px' }}>Learn More</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <h2 className="section-titlee">{siteData.home.statistics.sectionTitle}</h2>
          <p className="section-description">{siteData.home.statistics.sectionDescription}</p>
          <div className="stats-grid">
            {siteData.home.statistics.stats.map((stat: any, index: number) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat_label">{stat.label}</div>
                <p className="stat-description">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}