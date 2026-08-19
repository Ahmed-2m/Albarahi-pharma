'use client';

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ServicesPage() {
  const [siteData, setSiteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. جلب بيانات الخدمات من Supabase
        const { data: servicesData, error: servicesError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', 'services')
          .maybeSingle()

        if (servicesError) throw servicesError

        // 2. جلب الإعدادات
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')

        if (settingsError) throw settingsError

        const getSetting = (key: string) => {
          return settingsData?.find(s => s.key === key)?.value || ''
        }

        // 3. جلب بيانات الخدمات من جدول service_cards
        const { data: serviceCards, error: serviceCardsError } = await supabase
          .from('service_cards')
          .select('*')
          .order('sort_order', { ascending: true })

        if (serviceCardsError) throw serviceCardsError

        // 4. جلب خطوات العملية من جدول process_steps
        const { data: processSteps, error: processStepsError } = await supabase
          .from('process_steps')
          .select('*')
          .order('step_number', { ascending: true })

        if (processStepsError) throw processStepsError

        // 5. بناء البيانات من قاعدة البيانات
        setSiteData({
          home: {
            companyName: getSetting('company_name') || "Sadiq Al-Barhi",
            companySubtitle: getSetting('company_subtitle') || "Pharmaceutical & Medical Supplies",
            logo: getSetting('logo') || ''
          },
          services: {
            pageTitle: servicesData?.title || "Our Services",
            pageDescription: servicesData?.subtitle || "Comprehensive range of specialized medical and pharmaceutical services",
            serviceCards: serviceCards || [],
            processSection: {
              title: getSetting('process_title') || "How We Serve You",
              steps: processSteps || []
            }
          },
          contact: {
            phone: getSetting('phone') || "+967 1 234567",
            email: getSetting('email') || "info@sadiqalbarhi.com",
            address: getSetting('address') || "Sana'a, Yemen"
          }
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        // بيانات افتراضية في حالة الخطأ
        setSiteData({
          home: {
            companyName: "Sadiq Al-Barhi",
            companySubtitle: "Pharmaceutical & Medical Supplies",
            logo: ''
          },
          services: {
            pageTitle: "Our Services",
            pageDescription: "Comprehensive range of specialized medical and pharmaceutical services",
            serviceCards: [],
            processSection: {
              title: "How We Serve You",
              steps: []
            }
          },
          contact: {
            phone: "+967 1 234567",
            email: "info@sadiqalbarhi.com",
            address: "Sana'a, Yemen"
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading || !siteData || !siteData.services) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  const descriptionText = siteData.services.pageDescription || "Comprehensive range of specialized medical and pharmaceutical services";
  const words = descriptionText.split(" ");

  return (
    <div dir="ltr" style={{ textAlign: 'left', background: '#f4f6f8', minHeight: '100vh' }}>
      {/* Page Header matching Products & About Page style */}
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
            {siteData.services.pageTitle}
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

      {/* Services Section */}
      <section className="services-section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
          {siteData.services.serviceCards && siteData.services.serviceCards.length > 0 ? (
            siteData.services.serviceCards.map((service: any, index: number) => (
              <div key={index} className="service-card" style={{
                background: 'white',
                padding: '30px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                marginBottom: '30px',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}>
                <div className="service-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div className="service-icon" style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(10, 110, 121, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#0A6E79'
                  }}>
                    <i className={service.icon || "fas fa-star"}></i>
                  </div>
                  <h3 style={{ color: '#2C3E50', fontSize: '1.2rem', margin: 0, fontWeight: '700' }}>{service.title || "Service Title"}</h3>
                </div>
                <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.6' }}>
                  {service.description || "Service description"}
                </p>
                
                {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                  <ul className="product-features" style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {service.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} style={{
                        padding: '5px 0',
                        color: '#555',
                        fontSize: '0.95rem'
                      }}>
                        <i className="fas fa-check" style={{ color: '#0A6E79', marginRight: '10px' }}></i> {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No services found. Please add services to the database.</p>
          )}
        </div>
      </section>

      {/* Service Process (Dynamic from process_steps table) */}
      <section className="service-process" style={{ padding: '80px 0', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
          {/* عنوان القسم بخلفية خضراء متناسقة وبارزة */}
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
              {siteData.services.processSection?.title || "How We Serve You"}
            </span>
          </div>

          <div className="process-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}>
            {siteData.services.processSection?.steps && siteData.services.processSection.steps.length > 0 ? (
              siteData.services.processSection.steps.map((step: any, index: number) => (
                <div key={index} className="process-step" style={{
                  background: '#f8fafc',
                  padding: '35px 25px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  border: '1px solid #e2e8f0',
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
                  <div className="step-number" style={{
                    width: '65px',
                    height: '65px',
                    background: 'rgba(10, 110, 121, 0.1)',
                    color: '#0A6E79',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '1.4rem',
                    boxShadow: '0 4px 10px rgba(10, 110, 121, 0.1)'
                  }}>
                    {step.icon ? <i className={step.icon}></i> : (step.step_number || (index + 1))}
                  </div>
                  {/* عنوان الخطوة: حجم أكبر، غامق، وواضح */}
                  <h3 style={{ 
                    color: '#1e293b', 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    marginBottom: '12px',
                    letterSpacing: '0.3px'
                  }}>
                    {step.title || "Step Title"}
                  </h3>
                  {/* وصف الخطوة: مرتب بخط مريح وواضح */}
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '0.95rem', 
                    lineHeight: '1.6', 
                    margin: 0 
                  }}>
                    {step.description || "Step description"}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>No process steps found. Please add steps to the database.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}