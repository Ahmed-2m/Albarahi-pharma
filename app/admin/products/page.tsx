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
  Tag,
  LayoutGrid,
  List,
  Upload,
  FolderPlus,
  FolderEdit,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  image_url: string | null;
  is_active?: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // مودال إدارة المنتج
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    description: "",
    image_url: "",
    is_active: true,
  });

  // مودال إدارة الفئة (الوصف والاسم)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      setProductForm((prev) => ({ ...prev, image_url: publicUrlData.publicUrl }));
      setMessage({ text: "تم رفع الصورة بنجاح!", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({ text: "فشل رفع الصورة، تأكد من إنشاء Bucket باسم 'products'.", type: "error" });
    } finally {
      setUploadingImage(false);
    }
  };

  const openAddProductModal = (categoryName: string) => {
    setEditingId(null);
    setTargetCategory(categoryName);
    setProductForm({
      name: "",
      category: categoryName,
      description: "",
      image_url: "",
      is_active: true,
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setTargetCategory(product.category);
    setProductForm({
      name: product.name || "",
      category: product.category || "",
      description: product.description || "",
      image_url: product.image_url || "",
      is_active: product.is_active ?? true,
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update({
            name: productForm.name,
            image_url: productForm.image_url,
            is_active: productForm.is_active
          })
          .eq("id", editingId);

        if (error) throw error;
        setMessage({ text: "تم تحديث المنتج بنجاح!", type: "success" });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([{ 
            name: productForm.name,
            category: targetCategory,
            image_url: productForm.image_url,
            is_active: productForm.is_active,
            description: null
          }]);

        if (error) throw error;
        setMessage({ text: "تم إضافة المنتج بنجاح!", type: "success" });
      }

      setIsProductModalOpen(false);
      setEditingId(null);
      fetchProducts();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage({ text: "حدث خطأ أثناء الحفظ.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;
    setSubmitting(true);

    try {
      if (editingCategoryName) {
        const { error } = await supabase
          .from("products")
          .update({ 
            category: categoryForm.name.trim(),
            description: categoryForm.description 
          })
          .eq("category", editingCategoryName);

        if (error) throw error;
        setMessage({ text: "تم تحديث بيانات الفئة بنجاح!", type: "success" });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([
            {
              name: `عنصر أساسي - ${categoryForm.name}`,
              category: categoryForm.name.trim(),
              description: categoryForm.description || "وصف الفئة",
              image_url: "",
              is_active: true,
            },
          ]);

        if (error) throw error;
        setMessage({ text: "تم إنشاء الفئة بنجاح!", type: "success" });
      }

      setIsCategoryModalOpen(false);
      setEditingCategoryName(null);
      setCategoryForm({ name: "", description: "" });
      fetchProducts();
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error("Error saving category:", error);
      setMessage({ text: "حدث خطأ أثناء حفظ الفئة.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setMessage({ text: "تم الحذف بنجاح!", type: "success" });
      setDeleteConfirmId(null);
      fetchProducts();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage({ text: "حدث خطأ أثناء الحذف.", type: "error" });
    }
  };

  const categoriesList = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const groupedProducts = categoriesList.reduce((acc: { [key: string]: Product[] }, cat) => {
    // تصفية العناصر الأساسية الخاصة بالفئة لعدم عرضها كمنتجات عادية
    acc[cat] = products.filter((p) => p.category === cat && !p.name?.startsWith("عنصر أساسي -"));
    return acc;
  }, {});

  const getCategoryDescription = (categoryName: string) => {
    const allCatItems = products.filter(p => p.category === categoryName);
    const baseItem = allCatItems.find(p => p.name?.startsWith("عنصر أساسي -") || p.description);
    return baseItem?.description || "لا يوجد وصف لهذه الفئة";
  };

  const filteredProducts = products.filter((product) => {
    if (product.name?.startsWith("عنصر أساسي -")) return false;
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === "all" || product.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col justify-center items-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500 animate-pulse">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="text-teal-600" size={22} />
            إدارة الفئات والمنتجات
          </h1>
          <p className="text-xs text-slate-500 mt-1">تحكم كامل بالفئات ووصفها والمنتجات التابعة لها</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingCategoryName(null);
              setCategoryForm({ name: "", description: "" });
              setIsCategoryModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
          >
            <FolderPlus size={16} />
            <span>إضافة فئة جديدة</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 ${viewMode === "grid" ? "bg-white text-teal-700 shadow-xs" : "text-slate-500"}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 ${viewMode === "table" ? "bg-white text-teal-700 shadow-xs" : "text-slate-500"}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-bold ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"}`}>
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-rose-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)}><X size={16} /></button>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <Trash2 size={32} className="mx-auto text-rose-600 bg-rose-50 p-2 rounded-xl" />
            <h3 className="text-sm font-bold">تأكيد الحذف</h3>
            <div className="flex justify-center gap-2 pt-2">
              <button onClick={() => handleDeleteProduct(deleteConfirmId)} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">حذف</button>
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-extrabold">{editingId ? "تعديل المنتج" : `إضافة منتج في فئة: ${targetCategory}`}</h3>
              <button onClick={() => setIsProductModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم المنتج</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-2xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-700">صورة المنتج</label>
                
                <div className="flex items-center gap-2 mb-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-dashed border-slate-300 hover:border-teal-500 rounded-2xl text-xs font-bold text-slate-600 hover:text-teal-700 cursor-pointer transition-all">
                    <Upload size={16} className="text-teal-600" />
                    <span>{uploadingImage ? "جاري الرفع..." : "اختر ملفاً من جهازك"}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploadingImage}
                      className="hidden" 
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={productForm.image_url || ""}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="أو ضع رابط الصورة المباشر URL هنا"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-600 focus:outline-teal-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 text-white rounded-2xl text-xs font-bold cursor-pointer">حفظ</button>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-2xl text-xs font-bold cursor-pointer">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-extrabold">{editingCategoryName ? "تعديل الفئة" : "إضافة فئة جديدة"}</h3>
              <button onClick={() => setIsCategoryModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم الفئة</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-2xl text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">وصف الفئة</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="اكتب وصفاً شاملاً يظهر أعلى الفئة في الموقع..."
                  className="w-full px-3 py-2 bg-slate-50 border rounded-2xl text-xs"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 text-white rounded-2xl text-xs font-bold cursor-pointer">حفظ الفئة</button>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-2xl text-xs font-bold cursor-pointer">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-3xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث..."
            className="w-full pl-4 pr-10 py-2 bg-slate-50 border rounded-2xl text-xs"
          />
        </div>
      </div>

      {/* Main View */}
      {viewMode === "grid" ? (
        <div className="space-y-6">
          {categoriesList.map((categoryName) => {
            const categoryProducts = groupedProducts[categoryName] || [];
            const categoryDesc = getCategoryDescription(categoryName);

            return (
              <div key={categoryName} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Tag size={18} className="text-teal-600" />
                      <span className="font-extrabold text-sm sm:text-base">{categoryName}</span>
                      <span className="text-[10px] bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full font-bold">{categoryProducts.length} منتجات</span>
                    </div>
                    <p className="text-xs text-slate-500 pr-6">{categoryDesc}</p>
                  </div>
                  <div className="gap-2 flex shrink-0">
                    <button
                      onClick={() => {
                        setEditingCategoryName(categoryName);
                        setCategoryForm({ name: categoryName, description: categoryDesc });
                        setIsCategoryModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-slate-50 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-all"
                    >
                      <FolderEdit size={14} /> تعديل الفئة
                    </button>
                    <button
                      onClick={() => openAddProductModal(categoryName)}
                      className="px-3.5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-teal-700 transition-all"
                    >
                      <Plus size={14} /> إضافة منتج
                    </button>
                  </div>
                </div>

                {/* حاوية المنتجات القابلة للسحب والتمرير (Scrollable Container) */}
                <div 
                  className="max-h-[340px] overflow-y-auto overflow-x-hidden p-1 pr-2 custom-scrollbar"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryProducts.map((product) => (
                      <div key={product.id} className="border p-3 rounded-2xl bg-slate-50/50 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="w-full h-32 bg-white border rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon size={20} className="text-slate-300" />
                            )}
                          </div>
                          <h4 className="text-xs font-bold truncate">{product.name}</h4>
                        </div>
                        <div className="flex justify-end gap-1 pt-2 border-t">
                          <button onClick={() => handleEditProduct(product)} className="p-1 border bg-white rounded-lg cursor-pointer hover:bg-slate-50"><Edit3 size={12} /></button>
                          <button onClick={() => setDeleteConfirmId(product.id)} className="p-1 border bg-white rounded-lg text-rose-600 cursor-pointer hover:bg-rose-50"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4">المنتج</th>
                <th className="p-4">الفئة</th>
                <th className="p-4">وصف الفئة</th>
                <th className="p-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold">{product.name}</td>
                  <td className="p-4 font-semibold text-teal-700">{product.category}</td>
                  <td className="p-4 text-slate-500">{getCategoryDescription(product.category)}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleEditProduct(product)} className="p-1.5 border rounded-lg ml-1 cursor-pointer"><Edit3 size={13} /></button>
                    <button onClick={() => setDeleteConfirmId(product.id)} className="p-1.5 border rounded-lg text-rose-600 cursor-pointer"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}