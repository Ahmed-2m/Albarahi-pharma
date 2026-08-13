import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface AboutContentJSON {
  story?: string;
  mission?: string;
  vision?: string;
  timeline?: Array<{ year: string; title: string; description: string }>;
}

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

  // 3. جلب رحلة المؤسسة القديمة (كخيار احتياطي)
  const { data: journeyData } = await supabase
    .from('journey')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  const getSetting = (key: string) => {
    return settings?.find(s => s.key === key)?.value || ''
  }

  // --- تحليل مفصل للـ JSON المخزن داخل حقل content ---
  let parsedContent: AboutContentJSON = {};
  const rawContent = aboutData?.content || '';

  try {
    if (rawContent.trim().startsWith('{')) {
      parsedContent = JSON.parse(rawContent);
    } else {
      parsedContent = { story: rawContent };
    }
  } catch (error) {
    console.error("Error parsing content JSON:", error);
    parsedContent = { story: rawContent };
  }

  // تحديد نصوص (قصتنا، رسالتنا، رؤيتنا، والمسيرة) أولاً من JSON ثم fallback للإعدادات القديمة
  const storyText = parsedContent.story || "Sadiq Al-Barhi Pharmaceutical & Medical Supplies was founded with a vision to provide high-quality healthcare solutions to the people of Yemen.";
  const missionText = parsedContent.mission || getSetting('mission_text') || "To provide accessible, high-quality pharmaceutical products and medical supplies that improve the health and well-being of our communities.";
  const visionText = parsedContent.vision || getSetting('vision_text') || "To be the leading pharmaceutical and medical supplies company in Yemen, recognized for our commitment to quality, innovation, and customer satisfaction.";
  
  // تحديد المسيرة الزمنيّة (سواءً المضافة حديثاً في لوحة التحكم أو من الجدول القديم)
  const finalJourney = (parsedContent.timeline && parsedContent.timeline.length > 0) 
    ? parsedContent.timeline 
    : (journeyData || []);

  const siteData = {
    home: {
      companyName: getSetting('company_name') || "Sadiq Al-Barhi",
      companySubtitle: getSetting('company_subtitle') || "Pharmaceutical & Medical Supplies",
      logo: getSetting('logo') || ''
    },
    about: {
      pageTitle: aboutData?.title || "About Us",
      pageDescription: aboutData?.subtitle || "Learn about our journey, mission, and commitment to healthcare excellence",
      story: storyText,
      mission: missionText,
      vision: visionText,
      aboutImage: aboutData?.image_url || "/images/AZ1aWoVQxgUy.jpg",
      journey: finalJourney
    },
    contact: {
      phone: getSetting('phone') || "+967 1 234567",
      email: getSetting('email') || "info@sadiqalbarhi.com",
      address: getSetting('address') || "Sana'a, Yemen"
    }
  }

  return (
    <div>
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

              {siteData.about.mission && (
                <div className="about-section" style={{ marginBottom: '40px' }}>
                  <h2 style={{ color: '#2C3E50', marginBottom: '15px' }}>Our Mission</h2>
                  <p style={{ color: '#666', lineHeight: '1.8' }}>{siteData.about.mission}</p>
                </div>
              )}

              {siteData.about.vision && (
                <div className="about-section">
                  <h2 style={{ color: '#2C3E50', marginBottom: '15px' }}>Our Vision</h2>
                  <p style={{ color: '#666', lineHeight: '1.8' }}>{siteData.about.vision}</p>
                </div>
              )}
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

      {/* Company History - Our Journey */}
      {siteData.about.journey && siteData.about.journey.length > 0 && (
        <section className="history" style={{ padding: '80px 0', background: '#f8f9fa' }}>
          <div className="container">
            <h2 className="section-title" style={{ textAlign: 'center', fontSize: '2.5rem', color: '#2C3E50', marginBottom: '50px' }}>
              Our Journey
            </h2>
            <div className="timeline" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {siteData.about.journey.map((item: { year: string; title: string; description: string }, index: number) => (
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
                  <div className="timeline-content" style={{ flex: 1 }}>
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
      )}
    </div>
  )
}