'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // إذا نجح الدخول، توجيه للوحة التحكم
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <form 
        onSubmit={handleLogin} 
        className="w-full max-w-sm bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6"
      >
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">دخول الإدارة</h1>
          <p className="text-xs text-slate-400">الوصول المحمي للوحة تحكم الموقع</p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute right-3 top-3.5 text-slate-400" />
            <input 
              type="email" 
              placeholder="البريد الإلكتروني"
              className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none text-sm transition-all bg-slate-50/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute right-3 top-3.5 text-slate-400" />
            <input 
              type="password" 
              placeholder="كلمة المرور"
              className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none text-sm transition-all bg-slate-50/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-[11px] font-bold text-red-600 text-center bg-red-50 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </form>
    </div>
  )
}