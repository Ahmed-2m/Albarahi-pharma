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
  
  const [pageData, setPageData] = useState<{ title: string; subtitle: string }>({
    title: "Our Products",
    subtitle: "Explore our wide range of pharmaceutical and medical products"
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('category', { ascending: true })

        if (productsError) throw productsError

        const { data: pageInfo, error: pageError } = await supabase
          .from('pages')
          .select('title, subtitle')
          .eq('slug', 'products')
          .single()

        if (!pageError && pageInfo) {
          setPageData({
            title: pageInfo.title || "Our Products",
            subtitle: pageInfo.subtitle || "Explore our wide range of pharmaceutical and medical products"
          })
        }

        const uniqueCategories = [...new Set(products?.map(p => p.category) || [])]
        
        setAllProducts(products || [])
        setFilteredProducts(products || [])
        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filterProducts = (category: string) => {
    setActiveFilter(category)
    if (category === 'all') {
      setFilteredProducts(allProducts)
    } else {
      const filtered = allProducts.filter(p => p.category === category)
      setFilteredProducts(filtered)
    }
  }

  const getCategoryProducts = () => {
    if (activeFilter === 'all') {
      const grouped: { [key: string]: any[] } = {}
      allProducts.forEach((product: any) => {
        if (!grouped[product.category]) {
          grouped[product.category] = []
        }
        grouped[product.category].push(product)
      })
      return grouped
    } else {
      const grouped: { [key: string]: any[] } = {}
      const filtered = allProducts.filter(p => p.category === activeFilter)
      if (filtered.length > 0) {
        grouped[activeFilter] = filtered
      }
      return grouped
    }
  }

  // دالة لجلب الوصف بدقة مع احترام عملية الحذف والتفريغ
  const getCategoryDescription = (categoryName: string) => {
    const catProducts = allProducts.filter(p => p.category === categoryName);
    const baseItem = catProducts.find(p => p.name?.startsWith("عنصر أساسي -") || p.description);
    
    // إذا وجدنا وصفاً حقيقياً ومكتوباً في قاعدة البيانات نقوم بإرجاعه، وإلا نجعله فارغاً تماماً
    if (baseItem && baseItem.description && baseItem.description.trim() !== "" && baseItem.description !== "وصف الفئة") {
      return baseItem.description;
    }
    
    return ""; // إرجاع نص فارغ لكي يختفي الوصف تماماً عند حذفه
  };

  const groupedProducts = getCategoryProducts()
  const categoryNames = Object.keys(groupedProducts)

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading products...</div>
  }

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, #0A6E79 0%, #08545D 100%)',
        color: 'white',
        padding: '120px 0 60px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{pageData.title}</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
            {pageData.subtitle}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '1250px', margin: '0 auto', padding: '0 20px' }}>
          {/* Product Filters */}
          <div className="products-filter" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => filterProducts('all')}
              style={{
                padding: '10px 25px',
                borderRadius: '30px',
                border: '2px solid #0A6E79',
                background: activeFilter === 'all' ? '#0A6E79' : 'white',
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
                  background: activeFilter === category ? '#0A6E79' : 'white',
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
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '30px', 
              justifyContent: 'center',
              width: '100%' 
            }}>
              {categoryNames.map((categoryName: string, index: number) => {
                const categoryProducts = groupedProducts[categoryName]
                const categoryDescription = getCategoryDescription(categoryName)

                return (
                  <div key={index} className="product-detail" style={{
                    padding: '25px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    flex: '0 1 calc(50% - 15px)',
                    minWidth: '350px',
                    maxWidth: '580px'
                  }}>
                    <div className="product-detail-info" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      
                      {/* عنوان الفئة */}
                      <div style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #0A6E79 0%, #0d8390 100%)',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '10px',
                        marginBottom: categoryDescription ? '8px' : '15px',
                        boxShadow: '0 4px 12px rgba(10, 110, 121, 0.2)',
                        alignSelf: 'center'
                      }}>
                        <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>
                          {categoryName}
                        </h3>
                      </div>
                      
                      {/* وصف الفئة (يظهر فقط إذا كان موجوداً ولم يتم حذفه) */}
                      {categoryDescription && (
                        <p style={{ color: '#64748b', marginBottom: '15px', fontSize: '0.85rem' }}>
                          {categoryDescription}
                        </p>
                      )}
                      
                      {/* شبكة المنتجات */}
                      <div 
                        className="hide-scrollbar"
                        style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap',
                          gap: '12px', 
                          marginBottom: '20px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          maxHeight: '280px', 
                          overflowY: 'auto',  
                          padding: '5px',
                          scrollbarWidth: 'none', 
                          msOverflowStyle: 'none'  
                        }}
                      >
                        <style dangerouslySetInnerHTML={{ __html: `
                          .hide-scrollbar::-webkit-scrollbar {
                            display: none; 
                          }
                        `}} />

                        {categoryProducts.map((product: any, idx: number) => (
                          product.name?.startsWith("عنصر أساسي -") ? null : (
                            <div 
                              key={idx} 
                              className="product-card-item"
                              style={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '10px',
                                padding: '10px',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '6px',
                                width: '140px',
                                minHeight: '135px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(10, 110, 121, 0.12)';
                                e.currentTarget.style.borderColor = '#0A6E79';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                              }}
                            >
                              <div style={{ width: '100%', height: '65px', background: '#f8fafc', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {product.image_url ? (
                                  <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }} 
                                  />
                                ) : (
                                  <span style={{ fontSize: '9px', color: '#94a3b8' }}>No Image</span>
                                )}
                              </div>
                              
                              <div style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #0A6E79 0%, #0d8390 100%)',
                                padding: '4px 6px',
                                borderRadius: '5px',
                                boxShadow: '0 2px 4px rgba(10, 110, 121, 0.15)'
                              }}>
                                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#ffffff', lineHeight: '1.2', display: 'block' }}>
                                  {product.name}
                                </span>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                      
                      <div style={{ marginTop: 'auto' }}>
                        <Link href="/contact" className="btn btn-primary" style={{
                          display: 'inline-block',
                          padding: '10px 26px',
                          background: '#0A6E79',
                          color: 'white',
                          borderRadius: '30px',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          transition: 'all 0.3s'
                        }}>
                          Inquire Now
                        </Link>
                      </div>

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
      <section className="quality-section" style={{ padding: '80px 0', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', color: '#2C3E50', marginBottom: '50px' }}>
            Quality Assurance
          </h2>
          <div className="quality-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <div className="quality-item" style={{
              background: '#f8fafc',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
              <i className="fas fa-microscope" style={{ fontSize: '2.5rem', color: '#0A6E79', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2C3E50', marginBottom: '10px' }}>Laboratory Testing</h3>
              <p style={{ color: '#64748b' }}>Every product undergoes rigorous laboratory testing to ensure purity, potency, and safety before distribution.</p>
            </div>
            <div className="quality-item" style={{
              background: '#f8fafc',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '2.5rem', color: '#0A6E79', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2C3E50', marginBottom: '10px' }}>Authenticity Guarantee</h3>
              <p style={{ color: '#64748b' }}>We guarantee 100% authentic products sourced directly from authorized manufacturers and distributors.</p>
            </div>
            <div className="quality-item" style={{
              background: '#f8fafc',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
              <i className="fas fa-thermometer-half" style={{ fontSize: '2.5rem', color: '#0A6E79', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2C3E50', marginBottom: '10px' }}>Proper Storage</h3>
              <p style={{ color: '#64748b' }}>Temperature-controlled storage facilities ensure medications maintain their efficacy throughout the supply chain.</p>
            </div>
            <div className="quality-item" style={{
              background: '#f8fafc',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
              <i className="fas fa-certificate" style={{ fontSize: '2.5rem', color: '#0A6E79', marginBottom: '15px' }}></i>
              <h3 style={{ color: '#2C3E50', marginBottom: '10px' }}>Regulatory Compliance</h3>
              <p style={{ color: '#64748b' }}>All products comply with local and international pharmaceutical regulations and quality standards.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}