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

  // حالة لتخزين عناصر ضمان الجودة القادمة من جدول quality_items
  const [qualityItems, setQualityItems] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. جلب المنتجات
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('category', { ascending: true })

        if (productsError) throw productsError

        // 2. جلب عناوين صفحة المنتجات
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

        // 3. جلب عناصر ضمان الجودة من الجدول الصحيح quality_items
        const { data: qualityData, error: qualityError } = await supabase
          .from('quality_items')
          .select('*')
          .eq('is_active', true)
          .order('order', { ascending: true })

        if (!qualityError && qualityData) {
          setQualityItems(qualityData)
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

  const getCategoryDescription = (categoryName: string) => {
    const catProducts = allProducts.filter(p => p.category === categoryName);
    const baseItem = catProducts.find(p => p.name?.startsWith("عنصر أساسي -") || p.description);
    
    if (baseItem && baseItem.description && baseItem.description.trim() !== "" && baseItem.description !== "وصف الفئة") {
      return baseItem.description;
    }
    
    return "";
  };

  const groupedProducts = getCategoryProducts()
  const categoryNames = Object.keys(groupedProducts)

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>
  }

  const descriptionText = pageData.subtitle || "Explore our wide range of pharmaceutical and medical products";
  const words = descriptionText.split(" ");

  return (
    <div dir="ltr" style={{ textAlign: 'left', background: '#f4f6f8', minHeight: '100vh' }}>
      {/* Page Header matching About Page style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cloudFadeIn {
          0% {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        .cloud-word {
          display: inline-block;
          opacity: 0;
          animation: cloudFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, #0A6E79 0%, #08545D 100%)',
        color: 'white',
        padding: '120px 0 60px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '20px', 
            fontWeight: '800',
            letterSpacing: '1px',
            textShadow: '0 2px 10px rgba(0,0,0,0.15)'
          }}>
            {pageData.title}
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            fontWeight: '500',
            opacity: 0.95, 
            maxWidth: '750px', 
            margin: '0 auto',
            lineHeight: '1.6',
            wordSpacing: '2px',
            textAlign: 'center'
          }}>
            {words.map((word: string, i: number) => (
              <span 
                key={i} 
                className="cloud-word" 
                style={{ 
                  animationDelay: `${i * 0.08}s`,
                  marginRight: '6px'
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" style={{ padding: '60px 0' }}>
        <div className="container" style={{ width: '90%', maxWidth: '1250px', margin: '0 auto' }}>
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
                      
                      {/* وصف الفئة */}
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

      {/* Quality Assurance (Dynamic from quality_items table) */}
      <section className="quality-section" style={{ padding: '80px 0', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #0A6E79 0%, #0d8390 100%)',
              color: '#ffffff',
              padding: '12px 35px',
              borderRadius: '50px',
              fontSize: '2.2rem',
              fontWeight: '700',
              boxShadow: '0 6px 20px rgba(10, 110, 121, 0.25)',
              letterSpacing: '0.5px'
            }}>
              Quality Assurance
            </span>
          </div>

          <div className="quality-grid" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            width: '100%'
          }}>
            {qualityItems.map((item, index) => (
              <div key={index} className="quality-item" style={{
                background: '#f8fafc',
                padding: '35px 25px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: '1 1 240px',
                maxWidth: '320px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(10, 110, 121, 0.1)';
                e.currentTarget.style.borderColor = '#0A6E79';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
              >
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(10, 110, 121, 0.1)',
                    color: '#0A6E79',
                    marginBottom: '20px'
                  }}>
                    <i className={item.icon || "fas fa-check-circle"} style={{ fontSize: '2rem' }}></i>
                  </div>
                  
                  <h3 style={{ 
                    color: '#1e293b', 
                    marginBottom: '12px', 
                    fontSize: '1.25rem', 
                    fontWeight: '700',
                    letterSpacing: '0.3px'
                  }}>
                    {item.title}
                  </h3>
                  
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '0.95rem', 
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}