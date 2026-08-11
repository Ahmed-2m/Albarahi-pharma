"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Building,
} from "lucide-react";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

export default function AdminBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    hours: "",
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from("branches")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("branches")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        setMessage({ text: "تم تحديث بيانات الفرع بنجاح!", type: "success" });
      } else {
        const { error } = await supabase
          .from("branches")
          .insert([formData]);

        if (error) throw error;
        setMessage({ text: "تم إضافة الفرع الجديد بنجاح!", type: "success" });
      }

      setFormData({ name: "", address: "", phone: "", hours: "" });
      setEditingId(null);
      fetchBranches();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error saving branch:", error);
      setMessage({ text: "حدث خطأ أثناء حفظ البيانات، يرجى إعادة المحاولة.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setFormData({
      name: branch.name || "",
      address: branch.address || "",
      phone: branch.phone || "",
      hours: branch.hours || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الفرع؟")) return;

    try {
      const { error } = await supabase
        .from("branches")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMessage({ text: "تم حذف الفرع بنجاح!", type: "success" });
      fetchBranches();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error deleting branch:", error);
      setMessage({ text: "حدث خطأ أثناء محاولة الحذف.", type: "error" });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", address: "", phone: "", hours: "" });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center space-y-3">
        <Loader2 className="w-9 h-9 text-teal-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-400 animate-pulse">
          جاري تحميل بيانات الفروع...
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
              <Building2 size={18} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">إدارة الفروع</h1>
          </div>
          <p className="text-xs text-slate-500">
            إضافة فروع جديدة، وتحديث التفاصيل والعناوين وأوقات العمل
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 self-start md:self-auto">
          <Building size={14} className="text-teal-600" />
          <span>إجمالي الفروع: {branches.length}</span>
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

      {/* Add / Edit Branch Form */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit3 size={15} className="text-teal-600" />
                تعديلبيانات الفرع
              </>
            ) : (
              <>
                <Plus size={15} className="text-teal-600" />
                إضافة فرع جديد
              </>
            )}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                اسم الفرع <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                placeholder="مثال: فرع الرياض - الملقا"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                العنوان <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute right-3.5 top-2.5 text-slate-400" size={15} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-3.5 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="شارع الملك فهد، طريق..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                رقم الهاتف <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute right-3.5 top-2.5 text-slate-400" size={15} />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-3.5 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dir-ltr text-right"
                  placeholder="+966 50 000 0000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ساعات العمل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute right-3.5 top-2.5 text-slate-400" size={15} />
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  className="w-full pl-3.5 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="السبت - الخميس: 8:00 ص - 6:00 م"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : editingId ? (
                <Save size={15} />
              ) : (
                <Plus size={15} />
              )}
              <span>{submitting ? "جاري الحفظ..." : editingId ? "تحديث البيانات" : "إضافة الفرع"}</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-all active:scale-95"
              >
                <X size={15} />
                <span>إلغاء</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Branches Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold">
                <th className="px-5 py-3.5">الفرع</th>
                <th className="px-5 py-3.5">العنوان</th>
                <th className="px-5 py-3.5">الهاتف</th>
                <th className="px-5 py-3.5">ساعات العمل</th>
                <th className="px-5 py-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {branches.length > 0 ? (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">{branch.name}</td>
                    <td className="px-5 py-4 text-slate-600">{branch.address}</td>
                    <td className="px-5 py-4 font-mono text-slate-600 dir-ltr text-right">
                      {branch.phone}
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-xs truncate">{branch.hours}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(branch)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-200 text-slate-600 hover:text-teal-700 transition-all"
                          title="تعديل"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(branch.id)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all"
                          title="حذف"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Building2 size={32} className="text-slate-300 stroke-[1.5]" />
                      <p className="text-xs font-semibold">لا توجد فروع مسجلة حالياً.</p>
                      <p className="text-[11px] text-slate-400">
                        قم بإضافة أول فرع باستخدام النموذج أعلاه.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}