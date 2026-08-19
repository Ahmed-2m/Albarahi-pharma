"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client"; // تأكد من المسار الصحيح للملف الذي أنشأته للتو
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // استخدام العميل المتوافق مع الكوكيز والـ SSR
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // إعادة التوجيه الإجباري ليقوم الـ Middleware بقراءة الكوكيز المحفوظة تلقائياً
      window.location.href = "/admin";
      
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول، تأكد من البيانات المدخلة.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 space-y-6" dir="rtl">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-teal-50 border border-teal-100 rounded-2xl mx-auto flex items-center justify-center text-teal-700 shadow-xs">
          <Lock size={26} />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">دخول الإدارة</h1>
        <p className="text-xs text-slate-500">الوصول المحمي لوحة تحكم الموقع</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold">
          <ShieldAlert size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">البريد الإلكتروني</label>
          <div className="relative flex items-center">
            <Mail className="absolute right-3.5 text-slate-400" size={17} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@albarahi.com"
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">كلمة المرور</label>
          <div className="relative flex items-center">
            <Lock className="absolute right-3.5 text-slate-400" size={17} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              جاري التحقق... <Loader2 className="animate-spin" size={16} />
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </form>
    </div>
  );
}