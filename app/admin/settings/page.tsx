'use client';

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [settings, setSettings] = useState({
    company_name: '',
    company_subtitle: '',
    logo: '',
    phone: '',
    phone2: '',
    email: '',
    email2: '',
    address: '',
    working_hours: '',
    emergency_phone: '',
    emergency_title: '',
    emergency_description: '',
    form_title: '',
    form_description: '',
    mission_text: '',
    vision_text: '',
    process_title: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')

      if (error) throw error

      const settingsObj: any = {}
      data?.forEach(item => {
        settingsObj[item.key] = item.value
      })
      setSettings(prev => ({ ...prev, ...settingsObj }))
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value || '',
        type: 'text'
      }))

      const { error } = await supabase
        .from('settings')
        .upsert(updates, { onConflict: 'key' })

      if (error) throw error

      setMessage('✅ تم حفظ الإعدادات بنجاح!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('❌ حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ الإعدادات العامة</h1>
      <p className="text-gray-500 mb-8">هنا يمكنك تعديل شعار الموقع وجميع البيانات الأساسية</p>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">🏢 معلومات الشركة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الشركة *</label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الفرعي *</label>
            <input
              type="text"
              value={settings.company_subtitle}
              onChange={(e) => handleChange('company_subtitle', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">🔵 رابط الشعار (Logo URL) *</label>
          <div className="flex gap-4 items-start">
            <input
              type="text"
              value={settings.logo}
              onChange={(e) => handleChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
              required
            />
            {settings.logo && (
              <div className="w-16 h-16 border rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={settings.logo} 
                  alt="Logo preview" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/default-logo.png'
                  }}
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">ارفع الصورة على Supabase Storage أو استخدم رابط مباشر</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 mt-8">📞 معلومات الاتصال</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف الأساسي *</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف الثاني</label>
            <input
              type="text"
              value={settings.phone2}
              onChange={(e) => handleChange('phone2', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني الأساسي *</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني الثاني</label>
            <input
              type="email"
              value={settings.email2}
              onChange={(e) => handleChange('email2', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان *</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ساعات العمل *</label>
            <input
              type="text"
              value={settings.working_hours}
              onChange={(e) => handleChange('working_hours', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 mt-8">🆘 الطوارئ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الطوارئ</label>
            <input
              type="text"
              value={settings.emergency_phone}
              onChange={(e) => handleChange('emergency_phone', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الطوارئ</label>
            <input
              type="text"
              value={settings.emergency_title}
              onChange={(e) => handleChange('emergency_title', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف الطوارئ</label>
            <input
              type="text"
              value={settings.emergency_description}
              onChange={(e) => handleChange('emergency_description', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 mt-8">📝 النصوص الأخرى</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان نموذج التواصل</label>
            <input
              type="text"
              value={settings.form_title}
              onChange={(e) => handleChange('form_title', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف نموذج التواصل</label>
            <input
              type="text"
              value={settings.form_description}
              onChange={(e) => handleChange('form_description', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نص الرسالة (About)</label>
            <input
              type="text"
              value={settings.mission_text}
              onChange={(e) => handleChange('mission_text', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نص الرؤية (About)</label>
            <input
              type="text"
              value={settings.vision_text}
              onChange={(e) => handleChange('vision_text', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#0A6E79] text-white py-3 rounded-lg font-bold hover:bg-[#08545D] transition-all disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : '💾 حفظ جميع الإعدادات'}
        </button>
      </form>
    </div>
  )
}