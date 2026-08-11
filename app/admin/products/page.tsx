'use client';

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image_url: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        // تعديل
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        setMessage('✅ تم تحديث المنتج بنجاح!')
      } else {
        // إضافة جديد
        const { error } = await supabase
          .from('products')
          .insert([formData])

        if (error) throw error
        setMessage('✅ تم إضافة المنتج بنجاح!')
      }

      setFormData({ name: '', description: '', category: '', image_url: '' })
      setEditingId(null)
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving product:', error)
      setMessage('❌ حدث خطأ أثناء الحفظ')
    }
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      image_url: product.image_url || ''
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage('✅ تم حذف المنتج بنجاح!')
      fetchProducts()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error deleting product:', error)
      setMessage('❌ حدث خطأ أثناء الحذف')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', description: '', category: '', image_url: '' })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 إدارة المنتجات</h1>
      <p className="text-gray-500 mb-8">إضافة وتعديل وحذف المنتجات</p>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* نموذج الإضافة/التعديل */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingId ? '✏️ تعديل منتج' : '➕ إضافة منتج جديد'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
                required
                placeholder="مثال: Cardiovascular Medicines"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6E79]"
              placeholder="/images/product.jpg"
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

      {/* قائمة المنتجات */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">المنتج</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">التصنيف</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الوصف</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="h-10 w-10 object-cover rounded" />
                        )}
                        <span className="font-medium text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#0A6E79] bg-opacity-10 text-[#0A6E79] rounded text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{product.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
                    لا توجد منتجات. أضف منتجاً جديداً!
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