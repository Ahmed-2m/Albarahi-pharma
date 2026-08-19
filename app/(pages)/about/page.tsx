'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// مكون فرعي للصورة ليكون Client Component ويدعم التفاعل
function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div style={{
      width: '100%',
      flex: 1,
      minHeight: '450px',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      position: 'relative',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img 
        src={src} 
        alt={alt}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          padding: '15px',
          display: 'block',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s ease-in-out'
        }}
      />
    </div>
  )
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<any>(null)
  const [aboutUsData, setAboutUsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: pageRes } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'about')
        .single()

      const { data: aboutUsRes } = await supabase
        .from('about_us')
        .select('*')
        .single()

      setAboutData(pageRes)
      setAboutUsData(aboutUsRes)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>
  }

  const siteData = {
    about: {
      pageTitle: aboutData?.title || "",
      pageDescription: aboutData?.subtitle || "Learn about our journey, mission, and commitment to healthcare excellence",
      story: aboutUsData?.story || "",
      mission: aboutUsData?.mission || "",
      vision: aboutUsData?.vision || "",
      aboutImage: aboutData?.image_url || "",
      journey: aboutUsData?.timeline || []
    }
  }

  const sectionTitleStyle = {
    display: 'inline-block',
    background: '#0A6E79',
    color: '#ffffff',
    padding: '8px 24px',
    borderRadius: '30px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(10, 110, 121, 0.2)'
  };

  const descriptionText = siteData.about.pageDescription || "Learn about our journey, mission, and commitment to healthcare excellence";
  const words = descriptionText.split(" ");

  return (
    <div dir="ltr" style={{ textAlign: 'left' }}>
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
            {siteData.about.pageTitle}
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

      <section className="about-content" style={{ padding: '80px 0 40px' }}>
        <div className="container" style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="about-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '50px',
            alignItems: 'stretch'
          }}>
            <div className="about-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {siteData.about.story && (
                <div className="about-section" style={{ marginBottom: '30px' }}>
                  <h2 style={sectionTitleStyle}>Our Story</h2>
                  <p style={{ color: '#666', lineHeight: '1.8' }}>{siteData.about.story}</p>
                </div>
              )}
              {siteData.about.mission && (
                <div className="about-section" style={{ marginBottom: '30px' }}>
                  <h2 style={sectionTitleStyle}>Our Mission</h2>
                  <p style={{ color: '#666', lineHeight: '1.8' }}>{siteData.about.mission}</p>
                </div>
              )}
              {siteData.about.vision && (
                <div className="about-section" style={{ marginBottom: '0' }}>
                  <h2 style={sectionTitleStyle}>Our Vision</h2>
                  <p style={{ color: '#666', lineHeight: '1.8' }}>{siteData.about.vision}</p>
                </div>
              )}
            </div>
            {siteData.about.aboutImage && (
              <div className="about-image" style={{ display: 'flex', flexDirection: 'column' }}>
                <ZoomableImage src={siteData.about.aboutImage} alt="About Us" />
              </div>
            )}
          </div>
        </div>
      </section>

      <div style={{ width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '120px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #0A6E79, transparent)',
          borderRadius: '2px'
        }}></div>
      </div>

      {siteData.about.journey && siteData.about.journey.length > 0 && (
        <section className="history" style={{ padding: '40px 0 80px', background: '#f8f9fa', overflow: 'hidden' }}>
          <div className="container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span style={{
                display: 'inline-block',
                background: '#0A6E79',
                color: '#ffffff',
                padding: '12px 36px',
                borderRadius: '50px',
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: '0 8px 25px rgba(10, 110, 121, 0.25)',
                letterSpacing: '0.5px'
              }}>
                Our Journey
              </span>
            </div>
            <div style={{
              position: 'absolute',
              top: '130px',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '3px',
              background: '#0A6E79',
              opacity: '0.25'
            }}></div>
            <div style={{ position: 'relative' }}>
              {siteData.about.journey.map((item: any, index: number) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: isEven ? 'flex-start' : 'flex-end',
                    position: 'relative',
                    marginBottom: '50px',
                    width: '100%'
                  }}>
                    <div style={{
                      width: '45%',
                      background: '#fff',
                      padding: '30px',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                      border: '1px solid #eaeaea',
                      position: 'relative'
                    }}>
                      <h3 style={{ color: '#0A6E79', marginBottom: '10px', fontSize: '1.25rem', fontWeight: '700' }}>{item.title}</h3>
                      <p style={{ color: '#666', lineHeight: '1.8', fontSize: '0.95rem', margin: 0 }}>{item.description}</p>
                    </div>
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: '#0A6E79',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: '30px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(10, 110, 121, 0.3)',
                      zIndex: 2,
                      whiteSpace: 'nowrap'
                    }}>
                      {item.year}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}