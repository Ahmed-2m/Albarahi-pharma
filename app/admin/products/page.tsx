"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Save,
  Tag,
  LayoutGrid,
  List,
  Sparkles,
  Filter,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
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
          .from("products")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        setMessage({ text: "تم تحديث بياني المنتج بنجاح!", type: "success" });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([formData]);

        if (error) throw error;
        setMessage({ text: "تم إضافة المنتج الجديد بنجاح!", type: "success" });
      }

      setFormData({ name: "", category: "", description: "", image_url: "" });
      setEditingId(null);
      fetchProducts();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage({ text: "حدث خطأ أثناء حفظ المنتج، يرجى المحاولة لاحقاً.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      category: product.category || "",
      description: product.description || "",
      image_url: product.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMessage({ text: "تم حذف المنتج بنجاح!", type: "success" });
      setDeleteConfirmId(null);
      fetchProducts();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage({ text: "حدث خطأ أثناء محاولة الحذف.", type: "error" });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", category: "", description: "", image_url: "" });
  };

  // Get unique categories
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  // Filter products by search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col justify-center items-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500 animate-pulse">
          جاري تحميل دلايل المنتجات الطبية...
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
            <div className="p-2 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
              <Package size={20} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              إدارة المنتجات الطبية
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            إضافة المنتجات الصيدلانية، تحديث الصور والتصنيفات، وإدارتها مباشرة في قاعدة البيانات
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "grid"
                  ? "bg-white text-teal-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="عرض كروت"
            >
              <LayoutGrid size={16} />
              <span className="hidden sm:inline">شبكة</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "table"
                  ? "bg-white text-teal-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="عرض جدول"
            >
              <List size={16} />
              <span className="hidden sm:inline">جدول</span>
            </button>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-teal-50 text-teal-800 border border-teal-100 text-xs font-extrabold flex items-center gap-1.5">
            <Sparkles size={14} className="text-teal-600" />
            <span>إجمالي المنتجات: {products.length}</span>
          </div>
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
                تأكيد حذف المنتج
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية وسيتم إزالته فوراً من قاعدة البيانات.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                تأكيد الحذف النهائي
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Card (Add or Edit Product) */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit3 size={16} className="text-teal-600" />
                تعديل بياني المنتج الحالي
              </>
            ) : (
              <>
                <Plus size={16} className="text-teal-600" />
                إضافة منتج طبي جديد
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
                اسم المنتج الطبي <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                placeholder="أدخل اسم المنتج بالكامل..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                التصنيف الصيدلاني <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                placeholder="مثال: Cardiovascular Medicines, Antibiotics..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              وصف المنتج واستخداماته
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none font-medium"
              placeholder="اكتب وصفاً شاملاً عن الاستخدام والدواعي..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رابط صورة المنتج (URL)
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <ImageIcon className="absolute right-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono dir-ltr text-right"
                  placeholder="https://example.com/product.jpg أو /images/product.jpg"
                />
              </div>

              {formData.image_url && (
                <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 self-center">
                  <img
                    src={formData.image_url}
                    alt="معاينة"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : editingId ? (
                <Save size={16} />
              ) : (
                <Plus size={16} />
              )}
              <span>{submitting ? "جاري الحفظ..." : editingId ? "تحديث المنتج" : "إضافة المنتج"}</span>
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو التصنيف أو الوصف..."
            className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
            >
              <option value="all">جميع التصنيفات ({products.length})</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Products Display (Grid View or Table View) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <Package size={40} className="mx-auto text-slate-300 stroke-[1.5]" />
          <h3 className="text-sm font-extrabold text-slate-800">
            لا توجد منتجات مطابقة للبحث
          </h3>
          <p className="text-xs text-slate-400">
            جرّب تغيير كلمات البحث أو أضف منتجاً جديداً عبر النموذج أعلاه.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-3xl bg-white border border-slate-200/80 p-4 transition-all duration-200 hover:shadow-md hover:border-teal-200 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                <div className="h-44 w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-300">
                      <ImageIcon size={32} />
                      <span className="text-[10px] font-semibold">بدون صورة</span>
                    </div>
                  )}
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-teal-800 text-[10px] font-bold border border-slate-200/60 shadow-xs flex items-center gap-1">
                    <Tag size={11} className="text-teal-600" />
                    {product.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {product.description || "لا يوجد وصف مدخل لهذا المنتج."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 text-slate-700 hover:text-teal-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(product.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold">
                  <th className="px-5 py-4">المنتج</th>
                  <th className="px-5 py-4">التصنيف</th>
                  <th className="px-5 py-4">الوصف</th>
                  <th className="px-5 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={18} className="text-slate-400" />
                          )}
                        </div>
                        <span className="font-extrabold text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold border border-teal-100 text-[11px]">
                        <Tag size={11} className="text-teal-600" />
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 max-w-md truncate">
                      {product.description || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-200 text-slate-600 hover:text-teal-700 transition-all cursor-pointer"
                          title="تعديل"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}