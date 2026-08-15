'use client';

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ContactPage() {
  const [siteData, setSiteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // حالة حقول نموذج التواصل الجديدة
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'general', // القسم المستهدف
    subject: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            subject: formData.subject,
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'general',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      console.error('Error sending message:', err);
      setSubmitError('حدث خطأ أثناء إرسال الرسالة، يجدر المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. جلب بيانات صفحة الاتصال من Supabase
        const { data: contactData, error: contactError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', 'contact')
          .maybeSingle()

        if (contactError) throw contactError

        // 2. جلب الإعدادات
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')

        if (settingsError) throw settingsError

        const getSetting = (key: string) => {
          return settingsData?.find(s => s.key === key)?.value || ''
        }

        // 3. جلب بيانات الفروع
        const { data: branchesData, error: branchesError } = await supabase
          .from('branches')
          .select('*')
          .order('id', { ascending: true })

        if (branchesError) throw branchesError

        // 4. بناء البيانات من قاعدة البيانات وإضافة حقول معلومات التواصل الجديدة
        setSiteData({
          home: {
            companyName: getSetting('company_name') || "Sadiq Al-Barhi",
            companySubtitle: getSetting('company_subtitle') || "Pharmaceutical & Medical Supplies",
            logo: getSetting('logo') || ''
          },
          contact: {
            pageTitle: contactData?.title || "Contact Us",
            pageDescription: contactData?.subtitle || "We are here to serve you and answer all your inquiries",
            contactInfoTitle: getSetting('contact_info_title') || "Contact Information",
            contactInfoDescription: getSetting('contact_info_description') || "Get in touch with us through any of the following methods, and we'll be happy to serve you",
            
            phone: getSetting('phone') || "+967 1 234567",
            phone2: getSetting('phone2') || "+967 777 123456",
            email: getSetting('email') || "info@sadiqalbarhi.com",
            email2: getSetting('email2') || "sales@sadiqalbarhi.com",
            address: getSetting('address') || "Al-Zubairi Street, Sana'a, Yemen",
            workingHours: getSetting('working_hours') || "Saturday - Thursday: 8:00 AM - 6:00 PM",
            emergencyPhone: getSetting('emergency_phone') || "+967 777 999 888",
            emergencyTitle: getSetting('emergency_title') || "Emergency Service",
            emergencyDescription: getSetting('emergency_description') || "Available 24 hours daily for emergency medical needs",
            formTitle: getSetting('form_title') || "Send Us a Message",
            formDescription: getSetting('form_description') || "Get in touch with us and we'll respond as soon as possible"
          },
          branches: branchesData || []
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        setSiteData({
          home: {
            companyName: "Sadiq Al-Barhi",
            companySubtitle: "Pharmaceutical & Medical Supplies",
            logo: ''
          },
          contact: {
            pageTitle: "Contact Us",
            pageDescription: "We are here to serve you and answer all your inquiries",
            contactInfoTitle: "Contact Information",
            contactInfoDescription: "Get in touch with us through any of the following methods, and we'll be happy to serve you",
            phone: "+967 1 234567",
            phone2: "+967 777 123456",
            email: "info@sadiqalbarhi.com",
            email2: "sales@sadiqalbarhi.com",
            address: "Al-Zubairi Street, Sana'a, Yemen",
            workingHours: "Saturday - Thursday: 8:00 AM - 6:00 PM",
            emergencyPhone: "+967 777 999 888",
            emergencyTitle: "Emergency Service",
            emergencyDescription: "Available 24 hours daily for emergency medical needs",
            formTitle: "Send Us a Message",
            formDescription: "Get in touch with us and we'll respond as soon as possible"
          },
          branches: []
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading || !siteData) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, #0A6E79 0%, #08545D 100%)',
        color: 'white',
        padding: '120px 0 60px',
        textAlign: 'center',
        marginTop: '70px'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{siteData.contact.pageTitle}</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
            {siteData.contact.pageDescription}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="main-content" style={{ padding: '3rem 0', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div className="content-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start'
          }}>
            {/* Contact Information */}
            <div className="contact-info" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              {/* عنوان القسم بالتنسيق الجديد المطلوب */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #0A6E79 0%, #08545D 100%)',
                  color: 'white',
                  padding: '10px 25px',
                  borderRadius: '50px',
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  boxShadow: '0 4px 15px rgba(10, 110, 121, 0.2)',
                  letterSpacing: '0.5px'
                }}>
                  {siteData.contact.contactInfoTitle}
                </span>
                <p style={{ margin: '15px 0 0 0', fontSize: '0.95rem', color: '#666', lineHeight: '1.5' }}>
                  {siteData.contact.contactInfoDescription}
                </p>
              </div>
              
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem 0' }}>
                <i className="fas fa-phone" style={{ color: '#0A6E79', width: '20px', marginRight: '1rem', fontSize: '1.1rem' }}></i>
                <span style={{ color: '#333', fontWeight: '500' }}>{siteData.contact.phone}</span>
              </div>
              
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem 0' }}>
                <i className="fas fa-phone" style={{ color: '#0A6E79', width: '20px', marginRight: '1rem', fontSize: '1.1rem' }}></i>
                <span style={{ color: '#333', fontWeight: '500' }}>{siteData.contact.phone2}</span>
              </div>
              
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem 0' }}>
                <i className="fas fa-envelope" style={{ color: '#0A6E79', width: '20px', marginRight: '1rem', fontSize: '1.1rem' }}></i>
                <span style={{ color: '#333', fontWeight: '500' }}>{siteData.contact.email}</span>
              </div>
              
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem 0' }}>
                <i className="fas fa-envelope" style={{ color: '#0A6E79', width: '20px', marginRight: '1rem', fontSize: '1.1rem' }}></i>
                <span style={{ color: '#333', fontWeight: '500' }}>{siteData.contact.email2}</span>
              </div>
              
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem 0' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#0A6E79', width: '20px', marginRight: '1rem', fontSize: '1.1rem' }}></i>
                <span style={{ color: '#333', fontWeight: '500' }}>{siteData.contact.address}</span>
              </div>
              
              <div className="contact-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem 0' }}>
                <i className="fas fa-clock" style={{ color: '#0A6E79', width: '20px', marginRight: '1rem', fontSize: '1.1rem' }}></i>
                <span style={{ color: '#333', fontWeight: '500' }}>{siteData.contact.workingHours}</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container" style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              {/* عنوان القسم بالتنسيق الجديد المطلوب */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #0A6E79 0%, #08545D 100%)',
                  color: 'white',
                  padding: '10px 25px',
                  borderRadius: '50px',
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  boxShadow: '0 4px 15px rgba(10, 110, 121, 0.2)',
                  letterSpacing: '0.5px'
                }}>
                  {siteData.contact.formTitle}
                </span>
                <p style={{ margin: '15px 0 0 0', fontSize: '0.95rem', color: '#666', lineHeight: '1.5' }}>
                  {siteData.contact.formDescription}
                </p>
              </div>
              
              {submitSuccess && (
                <div style={{ background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '1rem' }}>
                  تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                </div>
              )}

              {submitError && (
                <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '1rem' }}>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>Full Name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' }} />
                </div>
                
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>Email Address *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' }} />
                </div>
                
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' }} />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="department" style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>Target Department *</label>
                  <select id="department" name="department" value={formData.department} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem', background: 'white' }}>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales & Pharmaceuticals</option>
                    <option value="medical">Medical Supplies</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>
                
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>Subject *</label>
                  <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' }} />
                </div>
                
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>Message *</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Please write your message here..." style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem', height: '120px', resize: 'vertical' }}></textarea>
                </div>
                
                <button type="submit" disabled={submitting} className="btn-submit" style={{
                  background: '#0A6E79',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  transition: 'background 0.3s'
                }}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="branches-section" style={{ padding: '3rem 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* عنوان القسم بالتنسيق الجديد المطلوب */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #0A6E79 0%, #08545D 100%)',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '50px',
              fontSize: '2rem',
              fontWeight: '800',
              boxShadow: '0 4px 15px rgba(10, 110, 121, 0.2)',
              letterSpacing: '0.5px'
            }}>
              Our Branches
            </span>
          </div>

          <div className="branches-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}>
            {siteData.branches && siteData.branches.length > 0 ? (
              siteData.branches.map((branch: any, index: number) => (
                <div key={index} className="branch-card" style={{
                  background: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  borderLeft: '4px solid #0A6E79',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  minHeight: '200px'
                }}>
                  <h3 style={{ color: '#0A6E79', marginBottom: '1rem', fontSize: '1.1rem' }}>{branch.name}</h3>
                  <div className="branch-info" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#0A6E79', width: '16px', marginRight: '0.5rem', marginTop: '2px', flexShrink: 0 }}></i>
                    <span style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.4' }}>{branch.address}</span>
                  </div>
                  <div className="branch-info" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                    <i className="fas fa-phone" style={{ color: '#0A6E79', width: '16px', marginRight: '0.5rem', marginTop: '2px', flexShrink: 0 }}></i>
                    <span style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.4' }}>{branch.phone}</span>
                  </div>
                  <div className="branch-info" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start' }}>
                    <i className="fas fa-clock" style={{ color: '#0A6E79', width: '16px', marginRight: '0.5rem', marginTop: '2px', flexShrink: 0 }}></i>
                    <span style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.4' }}>{branch.hours}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>No branches found. Please add branches to the database.</p>
            )}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="emergency-section" style={{
        background: 'linear-gradient(135deg, #0A6E79 0%, #08545D 100%)',
        color: 'white',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>{siteData.contact.emergencyTitle}</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.9, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            {siteData.contact.emergencyDescription}
          </p>
          <a href={`tel:${siteData.contact.emergencyPhone}`} className="emergency-btn" style={{
            background: 'white',
            color: '#0A6E79',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.3s',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            <i className="fas fa-phone"></i> {siteData.contact.emergencyPhone}
          </a>
        </div>
      </section>
    </div>
  )
}