'use client';

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    description: '',
    features: [] as string[],
    sort_order: 0
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dataToSave = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== '')
      }

      if (editingId) {
        const { error } = await supabase
          .from('service_cards')
          .update(dataToSave)
          .eq('id', editingId)

        if (error) throw error
        setMessage('✅ تم تحديث الخدمة بنجاح!')
      } else {
        const { error } = await supabase
          .from('service_cards')
          .insert([dataToSave])

        if (error) throw error
        setMessage('✅ تم إضافة الخدمة بنجاح!')
      }

      setFormData({ icon: '', title: '', description: '', features: [], sort_order: 0 })
      setEditingId(null)
      fetchServices()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving service:', error)
      setMessage('❌ حدث خطأ أثناء الحفظ')
    }
  }

  const handleEdit = (service: any) => {
    setEditingId(service.id)
    setFormData({
      icon: service.icon || '',
      title: service.title || '',
      description: service.description || '',
      features: service.features || [],
      sort_order: service.sort_order || 0
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return

    try {
      const { error } = await supabase
        .from('service_cards')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage('✅ تم حذف الخدمة بنجاح!')
      fetchServices()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error deleting service:', error)
      setMessage('❌ حدث خطأ أثناء الحذف')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ icon: '', title: '', description: '', features: [], sort_order: 0 })
  }

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] })
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">💼 إدارة الخدمات</h1>
      <p className="text-gray-500 mb-8">إضافة وتعديل وحذف الخدمات</p>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* نموذج الإضافة/التعديل */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingId ? '✏️ تعديل خدمة' : '➕ إضافة خدمة جديدة'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">أيقونة (FontAwesome class) *</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
                required
                placeholder="fas fa-shipping-fast"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العنوان *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">المميزات (ميزة في كل سطر)</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
                  placeholder="ميزة الخدمة"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ➕ إضافة ميزة
            </button>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب العرض</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full max-w-xs px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-[#0A6E79] text-white rounded-lg hover:bg-[#08545D] transition"
            >
              {editingId ? '💾 تحديث' : '➕ إضافة'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      {/* قائمة الخدمات */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الخدمة</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الوصف</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">المميزات</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <i className={`${service.icon} text-[#0A6E79] text-xl`}></i>
                        <span className="font-medium text-gray-800">{service.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{service.description}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{service.features?.length || 0} ميزة</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    لا توجد خدمات. أضف خدمة جديدة!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}