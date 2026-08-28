"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { KeyRound, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // جلب البريد الإلكتروني الحالي للمستخدم المسجل دخولاً عند فتح الصفحة
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (user?.email) {
          setEmail(user.email);
        }
      } catch (err) {
        console.error("Error fetching user session:", err);
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUser();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password && password !== confirmPassword) {
      setMessage({ type: "error", text: "كلمتا المرور غير متطابقات!" });
      setLoading(false);
      return;
    }

    try {
      const updateData: { email?: string; password?: string } = {};
      if (email.trim() !== "") updateData.email = email.trim();
      if (password.trim() !== "") updateData.password = password.trim();

      if (Object.keys(updateData).length === 0) {
        setMessage({ type: "error", text: "الرجاء إدخال البريد أو كلمة المرور الجديدة للتعديل." });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser(updateData);

      if (error) throw error;

      setMessage({ type: "success", text: "تم تحديث بيانات الحساب بنجاح!" });
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "حدث خطأ أثناء التحديث." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs max-w-2xl">
      <div className="mb-6">
        <h2 className="text-base font-extrabold text-slate-900">إعدادات الحساب والأمان</h2>
        <p className="text-xs text-slate-500 mt-1">عرض وتحديث البريد الإلكتروني الحالي أو كلمة المرور الخاصة بلوحة التحكم.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {fetchingUser ? (
        <div className="py-12 flex items-center justify-center space-x-2">
          <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
          <span className="text-xs font-bold text-slate-500">جاري تحميل بيانات الحساب...</span>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني الحالي / الجديد</label>
            <div className="relative flex items-center">
              <Mail className="absolute right-3.5 text-slate-400" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                required
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">إذا قمت بتغيير البريد الإلكتروني، قد تتطلب بعض إعدادات المصادقة تأكيد البريد الجديد.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة المرور الجديدة (اتركها فارغة إذا لم ترد تغييرها)</label>
            <div className="relative flex items-center">
              <KeyRound className="absolute right-3.5 text-slate-400" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">تأكيد كلمة المرور الجديدة</label>
            <div className="relative flex items-center">
              <KeyRound className="absolute right-3.5 text-slate-400" size={16} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <span>حفظ التغييرات</span>}
          </button>
        </form>
      )}
    </div>
  );
}