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
  Search,
  Sparkles,
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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    try {
      const { error } = await supabase
        .from("branches")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMessage({ text: "تم حذف الفرع بنجاح!", type: "success" });
      setDeleteConfirmId(null);
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

  const filteredBranches = branches.filter(
    (b) =>
      b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col justify-center items-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500 animate-pulse">
          جاري تحميل قائمة فروع المؤسسة...
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
            <div className="p-2 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100">
              <Building2 size={20} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              إدارة الفروع والمكاتب
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            إضافة فروع الشركة وتحديد العناوين، أرقام وساعات العمل مع التزامن المباشر
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-purple-50 text-purple-800 border border-purple-100 text-xs font-extrabold flex items-center gap-1.5 self-start md:self-auto">
          <Sparkles size={14} className="text-purple-600" />
          <span>إجمالي الفروع: {branches.length}</span>
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
            className="text-slate-400 hover:text-slate-600"
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
                تأكيد حذف الفرع
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                هل أنت متأكد من رغبتك في حذف هذا الفرع؟ لن تظهر بيناته في دليل الفروع للموقع الرئيسي.
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
                <Edit3 size={16} className="text-purple-600" />
                تعديل بيانات الفرع الحالي
              </>
            ) : (
              <>
                <Plus size={16} className="text-purple-600" />
                إضافة فرع جديد للمؤسسة
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم الفرع <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                placeholder="مثال: فرع المركز الرئيسي - صنعاء"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                العنوان الدقيق للمقر <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute right-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                  placeholder="شارع..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم التواصل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute right-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-mono dir-ltr text-right"
                  placeholder="+967 1 000 000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ساعات وأوقات العمل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute right-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                  placeholder="السبت - الخميس: 8:00 ص - 6:00 م"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : editingId ? (
                <Save size={16} />
              ) : (
                <Plus size={16} />
              )}
              <span>{submitting ? "جاري الحفظ..." : editingId ? "تحديث الفرع" : "إضافة الفرع"}</span>
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

      {/* Search Input Bar */}
      <div className="relative bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <Search className="absolute right-7 top-7 text-slate-400" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث باسم الفرع أو العنوان أو رقم الهاتف..."
          className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
        />
      </div>

      {/* Branches Grid & Cards */}
      {filteredBranches.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <Building2 size={40} className="mx-auto text-slate-300 stroke-[1.5]" />
          <h3 className="text-sm font-extrabold text-slate-800">
            لا توجد فروع مسجلة بهذه الكلمة
          </h3>
          <p className="text-xs text-slate-400">
            أضف فرعاً جديداً عبر النموذج المخصص أعلاه.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="group rounded-3xl bg-white border border-slate-200/80 p-5 transition-all duration-200 hover:shadow-md hover:border-purple-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0 shadow-2xs">
                      <Building size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {branch.name}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        فرع نشط
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(branch)}
                      className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 text-slate-600 hover:text-purple-700 transition-all cursor-pointer"
                      title="تعديل"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(branch.id)}
                      className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <MapPin size={15} className="text-purple-600 shrink-0" />
                    <span>{branch.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Phone size={15} className="text-purple-600 shrink-0" />
                      <span className="font-mono dir-ltr">{branch.phone}</span>
                    </div>
                    <a
                      href={`tel:${branch.phone}`}
                      className="text-[10px] font-bold text-purple-700 hover:underline"
                    >
                      اتصال
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Clock size={15} className="text-purple-600 shrink-0" />
                    <span>{branch.hours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span>جدول: branches</span>
                <span className="text-purple-700 font-bold">متزامن مع الموقع</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}