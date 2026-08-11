"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FileText,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Globe,
  Loader2,
  Sparkles,
} from "lucide-react";

interface PageData {
  id: string;
  slug: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
}

export default function AdminPages() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    image_url: "",
  });
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("slug", { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page: PageData) => {
    setEditingId(page.id);
    setFormData({
      title: page.title || "",
      subtitle: page.subtitle || "",
      content: page.content || "",
      image_url: page.image_url || "",
    });
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    try {
      const { error } = await supabase
        .from("pages")
        .update({
          title: formData.title,
          subtitle: formData.subtitle,
          content: formData.content,
          image_url: formData.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setMessage({ text: "تم تحديث محتوى الصفحة بنجاح!", type: "success" });
      setEditingId(null);
      fetchPages();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error updating page:", error);
      setMessage({ text: "حدث خطأ أثناء حفظ التغيرات، يرجى المحاولة لاحقاً.", type: "error" });
    } finally {
      setSavingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", subtitle: "", content: "", image_url: "" });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center space-y-3">
        <Loader2 className="w-9 h-9 text-teal-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-400 animate-pulse">
          جاري تحميل محتوى الصفحات...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <FileText size={18} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">إدارة الصفحات</h1>
          </div>
          <p className="text-xs text-slate-500">
            التحكم في العناوين والمحتوى النصي والصور الخاصة بصفحات الموقع
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <Sparkles size={14} className="text-teal-600" />
          <span>إجمالي الصفحات: {pages.length}</span>
        </div>
      </div>

      {/* Notification Message */}
      {message && (
        <div
          className={`flex items-center gap-2.5 p-4 rounded-xl border text-xs font-semibold transition-all ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Pages Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {pages.map((page) => {
          const isEditing = editingId === page.id;

          return (
            <div
              key={page.id}
              className={`rounded-2xl bg-white border transition-all duration-200 p-5 ${
                isEditing
                  ? "border-teal-500 ring-2 ring-teal-500/10 shadow-md"
                  : "border-slate-200/80 hover:border-slate-300 shadow-sm"
              }`}
            >
              {isEditing ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 font-mono text-[11px] font-bold border border-teal-100">
                        /{page.slug}
                      </span>
                      <h3 className="text-xs font-bold text-slate-700">تعديل بياني الصفحة</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        العنوان الرئيسي
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        placeholder="أدخل عنوان الصفحة"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        العنوان الفرعي
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        placeholder="أدخل العنوان الفرعي"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      محتوى الصفحة
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={4}
                      className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                      placeholder="أدخل النص المفصل للصفحة..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      رابط الصورة (URL)
                    </label>
                    <div className="relative">
                      <ImageIcon className="absolute right-3.5 top-2.5 text-slate-400" size={16} />
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full pl-3.5 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dir-ltr text-right"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleSave(page.id)}
                      disabled={savingId === page.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-70"
                    >
                      {savingId === page.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Save size={15} />
                      )}
                      <span>{savingId === page.id ? "جاري الحفظ..." : "حفظ التغيرات"}</span>
                    </button>

                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all active:scale-95"
                    >
                      <X size={15} />
                      <span>إلغاء</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-mono font-bold border border-slate-200/60">
                        <Globe size={11} className="text-teal-600" />
                        /{page.slug}
                      </span>
                      <h2 className="text-base font-bold text-slate-900">
                        {page.title || "بدون عنوان"}
                      </h2>
                    </div>

                    {page.subtitle && (
                      <p className="text-xs font-medium text-teal-700">{page.subtitle}</p>
                    )}

                    {page.content && (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {page.content}
                      </p>
                    )}

                    {page.image_url && (
                      <div className="pt-2">
                        <img
                          src={page.image_url}
                          alt={page.title || "Page Image"}
                          className="h-14 w-auto rounded-lg object-contain border border-slate-100 bg-slate-50 p-1"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleEdit(page)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-200 text-slate-700 hover:text-teal-700 font-bold text-xs transition-all shrink-0 self-start"
                  >
                    <Edit3 size={14} />
                    <span>تعديل</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}