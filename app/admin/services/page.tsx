"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Save,
  Sparkles,
  ListPlus,
  ArrowUpDown,
  Check,
} from "lucide-react";

interface ServiceCard {
  id: string;
  icon: string | null;
  title: string;
  description: string | null;
  features: string[] | null;
  sort_order: number | null;
}

// قائمة الـ 20 أيقونة الطبية والصيدلانية الموحدة
const MEDICAL_ICONS = [
  { class: "fas fa-pills", label: "أدوية وحبوب" },
  { class: "fas fa-capsules", label: "كبسولات دواء" },
  { class: "fas fa-medkit", label: "حقيبة إسعافات" },
  { class: "fas fa-hospital", label: "مؤسسة طبية" },
  { class: "fas fa-stethoscope", label: "سماعة وفحص" },
  { class: "fas fa-heartbeat", label: "نبضات ورعاية" },
  { class: "fas fa-syringe", label: "حقن ومحاقن" },
  { class: "fas fa-prescription-bottle-medical", label: "وصفة طبية" },
  { class: "fas fa-microscope", label: "مختبر وأبحاث" },
  { class: "fas fa-shield-alt", label: "جودة وحماية" },
  { class: "fas fa-truck-medical", label: "نقل وتوريد طبي" },
  { class: "fas fa-thermometer", label: "مقياس حرارة" },
  { class: "fas fa-dna", label: "جينات وأدوية" },
  { class: "fas fa-briefcase-medical", label: "أدوات مهنية" },
  { class: "fas fa-mortar-pestle", label: "هاون صيدلاني" },
  { class: "fas fa-hand-holding-medical", label: "رعاية صحية" },
  { class: "fas fa-first-aid", label: "طوارئ وإسعاف" },
  { class: "fas fa-user-md", label: "طبيب متخصص" },
  { class: "fas fa-laptop-medical", label: "أنظمة طبية" },
  { class: "fas fa-award", label: "جودة معتمدة" },
];

export default function AdminServices() {
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState({
    icon: "fas fa-pills", // القيمة الافتتاحية أول أيقونة
    title: "",
    description: "",
    features: [] as string[],
    sort_order: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("service_cards")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const dataToSave = {
        ...formData,
        features: formData.features.filter((f) => f.trim() !== ""),
      };

      if (editingId) {
        const { error } = await supabase
          .from("service_cards")
          .update(dataToSave)
          .eq("id", editingId);

        if (error) throw error;
        setMessage({ text: "تم تحديث بطاقة الخدمة بنجاح!", type: "success" });
      } else {
        const { error } = await supabase
          .from("service_cards")
          .insert([dataToSave]);

        if (error) throw error;
        setMessage({ text: "تم إضافة الخدمة الجديدة بنجاح!", type: "success" });
      }

      setFormData({ icon: "fas fa-pills", title: "", description: "", features: [], sort_order: 0 });
      setEditingId(null);
      fetchServices();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error saving service:", error);
      setMessage({ text: "حدث خطأ أثناء حفظ الخدمة، يرجى إعادة المحاولة.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: ServiceCard) => {
    setEditingId(service.id);
    setFormData({
      icon: service.icon || "fas fa-pills",
      title: service.title || "",
      description: service.description || "",
      features: service.features || [],
      sort_order: service.sort_order || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("service_cards")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMessage({ text: "تم حذف الخدمة بنجاح!", type: "success" });
      setDeleteConfirmId(null);
      fetchServices();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error deleting service:", error);
      setMessage({ text: "حدث خطأ أثناء محاولة الحذف.", type: "error" });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ icon: "fas fa-pills", title: "", description: "", features: [], sort_order: 0 });
    setNewFeatureText("");
  };

  const handleAddFeaturePill = () => {
    if (!newFeatureText.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, newFeatureText.trim()],
    });
    setNewFeatureText("");
  };

  const handleRemoveFeaturePill = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col justify-center items-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500 animate-pulse">
          جاري تحميل بطاقات الخدمات...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Briefcase size={20} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              دليل بطاقات الخدمات
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            التحكم بكروت الخدمات اللوجستية والتوريد الطبي مع تفاصيل المميزات والترتيب
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-extrabold flex items-center gap-1.5 self-start md:self-auto">
          <Sparkles size={14} className="text-emerald-600" />
          <span>إجمالي الخدمات: {services.length}</span>
        </div>
      </div>

      {/* Toast Notification */}
      {message && (
        <div
          className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-bold shadow-xs transition-all ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                تأكيد حذف بطاقة الخدمة
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                هل أنت متأكد من رغبتك في حذف هذه الخدمة؟ سيتم إزالتها فوراً من قائمة خدمات الموقع الرئيسي.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                تأكيد الحذف النهائي
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit3 size={16} className="text-emerald-600" />
                تعديل بيانات الخدمة الحالية
              </>
            ) : (
              <>
                <Plus size={16} className="text-emerald-600" />
                إضافة بطاقة خدمة جديدة
              </>
            )}
          </h2>
          {editingId && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              وضع التعديل
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              عنوان الخدمة <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              placeholder="مثال: التوريد السريع، الدعم الفني الصيدلاني..."
              required
            />
          </div>

          {/* اختيار الأيقونة من المعرض الشبكي للـ 20 أيقونة */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              اختر أيقونة الخدمة الطبية <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2 max-h-52 overflow-y-auto p-2 bg-slate-50/80 border border-slate-200 rounded-2xl">
              {MEDICAL_ICONS.map((iconItem, idx) => {
                const isSelected = formData.icon === iconItem.class;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconItem.class })}
                    title={iconItem.label}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                    }`}
                  >
                    <i className={`${iconItem.class} text-lg mb-1`} />
                    <span className="text-[9px] text-center truncate w-full font-medium">
                      {iconItem.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              وصف الخدمة وشرحها الكامل <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none font-medium"
              placeholder="اكتب وصفاً مفصلاً ومميزاً للخدمة..."
              required
            />
          </div>

          {/* Features Pills Input Section */}
          <div className="space-y-2.5 bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl">
            <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ListPlus size={15} className="text-emerald-600" />
                مميزات الخدمة (Features)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {formData.features.length} مميزات مضافة
              </span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeaturePill();
                  }
                }}
                placeholder="اكتب ميزة جديدة واضغط إضافة أو Enter..."
                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={handleAddFeaturePill}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shrink-0"
              >
                إضافة ميزة
              </button>
            </div>

            {formData.features.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs"
                  >
                    <Check size={13} className="text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeaturePill(idx)}
                      className="text-slate-400 hover:text-rose-600 mr-1 transition-colors cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 font-medium pt-1">
                لم تقم بإضافة مميزات بعد. المزايا تظهر كقائمة شواهد للعملاء في كرت الخدمة.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ترتيب ظهور الخدمة (Sort Order)
            </label>
            <div className="relative w-full max-w-xs">
              <ArrowUpDown className="absolute right-3.5 top-3 text-slate-400" size={15} />
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : editingId ? (
                <Save size={16} />
              ) : (
                <Plus size={16} />
              )}
              <span>{submitting ? "جاري الحفظ..." : editingId ? "تحديث الخدمة" : "إضافة الخدمة"}</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                <X size={16} />
                <span>إلغاء</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="group rounded-3xl bg-white border border-slate-200/80 p-5 transition-all duration-200 hover:shadow-md hover:border-emerald-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    {service.icon?.startsWith("fa") ? (
                      <i className={service.icon} />
                    ) : (
                      <Briefcase size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {service.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400">
                      الترتيب: {service.sort_order ?? 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 text-slate-600 hover:text-emerald-700 transition-all cursor-pointer"
                    title="تعديل"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(service.id)}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {service.description}
              </p>

              {/* Features Chips */}
              {service.features && service.features.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-extrabold text-slate-400 block mb-1.5">
                    المميزات الأساسية ({service.features.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-800 text-[11px] font-semibold"
                      >
                        <Check size={11} className="text-emerald-600" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>جدول: service_cards</span>
              <span className="text-emerald-600 font-bold">نشط بالكامل</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}