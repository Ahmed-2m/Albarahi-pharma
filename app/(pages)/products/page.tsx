'use client';

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<any>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب المنتجات
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('category', { ascending: true })

        if (productsError) throw productsError

        // جلب الإعدادات
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')

        if (settingsError) throw settingsError

        // استخراج التصنيفات
        const uniqueCategories = [...new Set(products?.map(p => p.category) || [])]
        
        setAllProducts(products || [])
        setFilteredProducts(products || [])
        setCategories(uniqueCategories)
        setSettings(settingsData?.reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.value
          return acc
        }, {}) || {})
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // دالة التصفية
  const filterProducts = (category: string) => {
    setActiveFilter(category)
    if (category === 'all') {
      setFilteredProducts(allProducts)
    } else {
      const filtered = allProducts.filter(p => p.category === category)
      setFilteredProducts(filtered)
    }
  }

  // تجميع المنتجات حسب التصنيف للعرض
  const getCategoryProducts = () => {
    if (activeFilter === 'all') {
      // عرض جميع المنتجات مجمعة حسب التصنيف
      const grouped: { [key: string]: any[] } = {}
      allProducts.forEach((product: any) => {
        if (!grouped[product.category]) {
          grouped[product.category] = []
        }
        grouped[product.category].push(product)
      })
      return grouped
    } else {
      // عرض التصنيف المحدد فقط
      const grouped: { [key: string]: any[] } = {}
      const filtered = allProducts.filter(p => p.category === activeFilter)
      if (filtered.length > 0) {
        grouped[activeFilter] = filtered
      }
      return grouped
    }
  }

  const groupedProducts = getCategoryProducts()
  const categoryNames = Object.keys(groupedProducts)

  // بيانات من قاعدة البيانات
  const companyName = settings.company_name || "Sadiq Al-Barhi"
  const companySubtitle = settings.company_subtitle || "Pharmaceutical & Medical Supplies"
  const logo = settings.logo || ''

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading products...</div>
  }

  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              {logo ? (
                <img 
                  src={logo} 
                  alt={companyName} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <h2>{companyName}</h2>
              )}
              <span>{companySubtitle}</span>
            </div>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/about" className="nav-link">About Us</Link>
              </li>
              <li className="nav-item">
                <Link href="/products" className="nav-link active">Products</Link>
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
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Our Products</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
            Explore our wide range of pharmaceutical and medical products
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" style={{ padding: '80px 0' }}>
        <div className="container">
          {/* Product Filters */}
          <div className="products-filter" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '50px'
          }}>
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => filterProducts('all')}
              style={{
                padding: '10px 25px',
                borderRadius: '30px',
                border: '2px solid #0A6E79',
                background: activeFilter === 'all' ? '#0A6E79' : 'transparent',
                color: activeFilter === 'all' ? 'white' : '#0A6E79',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
            >
              All Products
            </button>
            {categories.map((category: string, index: number) => (
              <button 
                key={index}
                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => filterProducts(category)}
                style={{
                  padding: '10px 25px',
                  borderRadius: '30px',
                  border: '2px solid #0A6E79',
                  background: activeFilter === category ? '#0A6E79' : 'transparent',
                  color: activeFilter === category ? 'white' : '#0A6E79',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Product Categories */}
          {categoryNames.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px' }}>
              {categoryNames.map((categoryName: string, index: number) => {
                const categoryProducts = groupedProducts[categoryName]
                return (
                  <div key={index} className="product-detail" style={{
                    display: 'grid',
                    gridTemplateColumns: '300px 1fr',
                    gap: '40px',
                    padding: '40px',
                    background: '#f8f9fa',
                    borderRadius: '15px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}>
                    <div>
                      <img 
                        className="product-category-image" 
                        src={categoryProducts[0]?.image_url || '/images/default-product.jpg'} 
                        alt={categoryName}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                    </div>
                    <div className="product-detail-info">
                      <h3 style={{ color: '#2C3E50', fontSize: '1.8rem', marginBottom: '10px' }}>{categoryName}</h3>
                      <p style={{ color: '#666', marginBottom: '20px' }}>
                        High-quality {categoryName} for healthcare professionals
                      </p>
                      
                      <h4 style={{ color: '#2C3E50', marginBottom: '10px' }}>Available Products:</h4>
                      <ul className="product-features" style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
                        {categoryProducts.map((product: any, idx: number) => (
                          <li key={idx} style={{ padding: '5px 0', color: '#555' }}>
                            <i className="fas fa-check" style={{ color: '#0A6E79', marginRight: '10px' }}></i> {product.name}
                          </li>
                        ))}
                      </ul>
                      
                      <Link href="/contact" className="btn btn-primary" style={{
                        display: 'inline-block',
                        padding: '12px 30px',
                        background: '#0A6E79',
                        color: 'white',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                      }}>
                        Inquire Now
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h3>No products found</h3>
              <p>Please add products to the database.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="quality-section" style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', color: '#2C3E50', marginBottom: '50px' }}>
            Quality Assurance
          </h2>
          <div className="quality-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <div className="quality-item" style={{
              background: 'white',
              padding: '30px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <i className="fas fa-microscope" style={{ fontSize: '2.5rem', color: '#0A6E79', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2C3E50', marginBottom: '10px' }}>Laboratory Testing</h3>
              <p style={{ color: '#666' }}>Every product undergoes rigorous laboratory testing to ensure purity, potency, and safety before distribution.</p>
            </div>
            <div className="quality-item" style={{
              background: 'white',
              padding: '30px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '2.5rem', color: '#0A6E79', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2C3E50', marginBottom: '10px' }}>Authenticity Guarantee</h3>
              <p style={{ color: '#666' }}>We guarantee 100% authentic products sourced directly from authorized manufacturers and distributors.</p>
            </div>
            <div className="quality-item" style={{
              background: 'white',
              padding: '30px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <i className="fas fa-thermometer-half" style={{ fontSize: '2.5rem', color: '#0A6E79', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2C3E50', marginBottom: '10px' }}>Proper Storage</h3>
              <p style={{ color: '#666' }}>Temperature-controlled storage facilities ensure medications maintain their efficacy throughout the supply chain.</p>
            </div>
            <div className="quality-item" style={{
              background: 'white',
              padding: '30px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <i className="fas fa-certificate" style={{ fontSize: '2.5rem', color: '#0A6E79', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2C3E50', marginBottom: '10px' }}>Regulatory Compliance</h3>
              <p style={{ color: '#666' }}>All products comply with local and international pharmaceutical regulations and quality standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              {logo ? (
                <img 
                  src={logo} 
                  alt={companyName} 
                  className="h-12 w-auto object-contain mb-2"
                />
              ) : (
                <h3>{companyName}</h3>
              )}
              <p>{companySubtitle}</p>
              <p>{settings.address || 'Sana\'a, Yemen'}</p>
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
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Information</h4>
              <ul>
                <li><i className="fas fa-phone"></i> {settings.phone || '+967 1 234567'}</li>
                <li><i className="fas fa-envelope"></i> {settings.email || 'info@sadiqalbarhi.com'}</li>
                <li><i className="fas fa-map-marker-alt"></i> {settings.address || 'Sana\'a, Yemen'}</li>
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
            <p>&copy; 2025 {companyName} {companySubtitle}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}