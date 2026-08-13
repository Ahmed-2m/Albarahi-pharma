"use client";

import { useEffect, useState, useRef } from "react";
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
  Search,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface AboutContent {
  story?: string;
  mission?: string;
  vision?: string;
  timeline?: TimelineItem[];
}

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
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    image_url: "",
  });

  // Dedicated State for About Page Details
  const [aboutData, setAboutData] = useState<AboutContent>({
    story: "",
    mission: "",
    vision: "",
    timeline: [],
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*");

      if (error) throw error;
      
      // ترتيب مخصص حسب الطلب: home, about, products, services, contact
      const customOrder = ["home", "about", "products", "services", "contact"];
      const sortedData = (data || []).sort((a, b) => {
        const indexA = customOrder.indexOf(a.slug);
        const indexB = customOrder.indexOf(b.slug);
        
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return (a.slug || "").localeCompare(b.slug || "");
      });

      setPages(sortedData);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page: PageData) => {
    setEditingId(page.id);
    setEditingSlug(page.slug);

    setFormData({
      title: page.title || "",
      subtitle: page.subtitle || "",
      content: page.content || "",
      image_url: page.image_url || "",
    });

    // If editing About page, parse JSON from content column
    if (page.slug === "about") {
      try {
        if (page.content && page.content.trim().startsWith("{")) {
          const parsed = JSON.parse(page.content);
          setAboutData({
            story: parsed.story || "",
            mission: parsed.mission || "",
            vision: parsed.vision || "",
            timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
          });
        } else {
          setAboutData({
            story: page.content || "",
            mission: "",
            vision: "",
            timeline: [],
          });
        }
      } catch {
        setAboutData({
          story: page.content || "",
          mission: "",
          vision: "",
          timeline: [],
        });
      }
    }
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    try {
      let finalContent = formData.content;

      // Pack About data into JSON if page is 'about'
      if (editingSlug === "about") {
        finalContent = JSON.stringify(aboutData);
      }

      const updatePayload: any = {
        subtitle: formData.subtitle,
      };

      // If page is NOT home, include title
      if (editingSlug !== "home") {
        updatePayload.title = formData.title;
      }

      // If page is neither contact, products, nor services, include content and image_url
      if (editingSlug !== "contact" && editingSlug !== "products" && editingSlug !== "services") {
        updatePayload.content = finalContent;
        updatePayload.image_url = formData.image_url;
      }

      const { data, error } = await supabase
        .from("pages")
        .update(updatePayload)
        .eq("id", id)
        .select();

      if (error) throw error;

      setMessage({ text: "✅ تم حفظ التغييرات بنجاح!", type: "success" });
      setEditingId(null);
      setEditingSlug(null);
      await fetchPages();
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("❌ خطأ أثناء الحفظ:", error);
      setMessage({ text: "❌ حدث خطأ أثناء الحفظ", type: "error" });
    } finally {
      setSavingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingSlug(null);
    setFormData({ title: "", subtitle: "", content: "", image_url: "" });
  };

  const handleAddTimelineItem = () => {
    setAboutData((prev) => ({
      ...prev,
      timeline: [...(prev.timeline || []), { year: "", title: "", description: "" }],
    }));
  };

  const handleRemoveTimelineItem = (index: number) => {
    setAboutData((prev) => ({
      ...prev,
      timeline: prev.timeline?.filter((_, i) => i !== index),
    }));
  };

  const handleTimelineChange = (index: number, field: keyof TimelineItem, value: string) => {
    setAboutData((prev) => {
      const updated = [...(prev.timeline || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, timeline: updated };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ text: "❌ يرجى اختيار صورة فقط", type: "error" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: "❌ حجم الصورة كبير جداً (الحد الأقصى 2MB)", type: "error" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `page_${Date.now()}.${fileExt}`;
      const filePath = `pages/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("pages").upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("pages").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrlData.publicUrl }));
      setMessage({ text: "✅ تم رفع الصورة! اضغط حفظ لتثبيت التغيير.", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("❌ خطأ:", error);
      setMessage({ text: "❌ حدث خطأ أثناء رفع الصورة", type: "error" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }));
    setMessage({ text: "✅ تم إزالة الصورة! اضغط حفظ لتثبيت التغيير.", type: "success" });
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredPages = pages.filter(
    (page) =>
      page.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col justify-center items-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500 animate-pulse">
          جاري تحميل محتوى صفحات الموقع...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
              <FileText size={20} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">إدارة صفحات الموقع</h1>
          </div>
          <p className="text-xs text-slate-500">
            تعديل محتوى الصفحة الرئيسية، صفحة عن الشركة، الاتصال والصفحات الفرعية
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-100 text-xs font-extrabold flex items-center gap-1.5 self-start md:self-auto">
          <Sparkles size={14} className="text-amber-600" />
          <span>إجمالي الصفحات: {pages.length}</span>
        </div>
      </div>

      {/* Toast Alert */}
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
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <Search className="absolute right-7 top-7 text-slate-400" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بالعنوان أو مسار الصفحة (/slug)..."
          className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
        />
      </div>

      {/* Pages List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPages.map((page) => {
          const isEditing = editingId === page.id;

          return (
            <div
              key={page.id}
              className={`rounded-3xl bg-white border transition-all duration-200 p-5 md:p-6 ${
                isEditing
                  ? "border-amber-500 ring-2 ring-amber-500/10 shadow-md"
                  : "border-slate-200/80 hover:border-amber-200 shadow-xs"
              }`}
            >
              {isEditing ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-mono text-xs font-bold border border-amber-100">
                        /{page.slug}
                      </span>
                      <h3 className="text-xs font-extrabold text-slate-800">
                        تعديل بياني محتوى الصفحة
                      </h3>
                    </div>
                  </div>

                  {/* Main Title & Subtitle (Title hidden if page is 'home') */}
                  <div className={`grid grid-cols-1 ${page.slug === "home" ? "grid-cols-1" : "md:grid-cols-2"} gap-4`}>
                    {page.slug !== "home" && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          العنوان الرئيسي للصفحة
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        العنوان الفرعي
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* CUSTOM EDITING FOR ABOUT PAGE */}
                  {page.slug === "about" ? (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-amber-800 mb-1.5">
                          قصتنا (Our Story)
                        </label>
                        <textarea
                          value={aboutData.story}
                          onChange={(e) => setAboutData({ ...aboutData, story: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium leading-relaxed"
                          placeholder="اكتب نص قصتنا..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-amber-800 mb-1.5">
                            رسالتنا (Our Mission)
                          </label>
                          <textarea
                            value={aboutData.mission}
                            onChange={(e) =>
                              setAboutData({ ...aboutData, mission: e.target.value })
                            }
                            rows={3}
                            className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium leading-relaxed"
                            placeholder="اكتب نص رسالتنا..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-amber-800 mb-1.5">
                            رؤيتنا (Our Vision)
                          </label>
                          <textarea
                            value={aboutData.vision}
                            onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium leading-relaxed"
                            placeholder="اكتب نص رؤيتنا..."
                          />
                        </div>
                      </div>

                      {/* Timeline Section */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-extrabold text-slate-800">
                            مسيرة الشركة (Our Journey / Timeline)
                          </label>
                          <button
                            type="button"
                            onClick={handleAddTimelineItem}
                            className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-all"
                          >
                            <Plus size={14} />
                            <span>إضافة محطة جديدة</span>
                          </button>
                        </div>

                        {aboutData.timeline?.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-white p-3 rounded-xl border border-slate-200 items-center"
                          >
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                value={item.year}
                                onChange={(e) => handleTimelineChange(idx, "year", e.target.value)}
                                placeholder="السنة (e.g. 2015)"
                                className="w-full px-3 py-1.5 text-xs border rounded-xl font-bold bg-slate-50"
                              />
                            </div>
                            <div className="md:col-span-3">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleTimelineChange(idx, "title", e.target.value)}
                                placeholder="العنوان (e.g. Foundation)"
                                className="w-full px-3 py-1.5 text-xs border rounded-xl bg-slate-50"
                              />
                            </div>
                            <div className="md:col-span-6">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  handleTimelineChange(idx, "description", e.target.value)
                                }
                                placeholder="الوصف المختصر..."
                                className="w-full px-3 py-1.5 text-xs border rounded-xl bg-slate-50"
                              />
                            </div>
                            <div className="md:col-span-1 flex justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveTimelineItem(idx)}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : page.slug === "contact" || page.slug === "products" || page.slug === "services" ? (
                    // IF CONTACT, PRODUCTS, OR SERVICES PAGE: HIDE CONTENT & IMAGE FIELDS COMPLETELY
                    null
                  ) : (
                    /* NORMAL EDITING FOR OTHER PAGES */
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        المحتوى والنص التفصيلي للصفحة
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-y font-medium leading-relaxed"
                        placeholder="اكتب المحتوى التفصيلي للصفحة..."
                      />
                    </div>
                  )}

                  {/* Image Field (Hidden for Contact, Products, & Services Pages) */}
                  {page.slug !== "contact" && page.slug !== "products" && page.slug !== "services" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        صورة الصفحة
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <div className="relative flex-1">
                          <ImageIcon className="absolute right-3.5 top-3 text-slate-400" size={16} />
                          <input
                            type="text"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono dir-ltr text-right"
                            placeholder="رابط الصورة (اختياري)"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-2 whitespace-nowrap">
                            <ImageIcon size={16} />
                            <span>رفع صورة</span>
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>

                          {formData.image_url && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-2 whitespace-nowrap"
                            >
                              <X size={16} />
                              <span>إزالة</span>
                            </button>
                          )}
                        </div>

                        {uploading && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Loader2 size={16} className="animate-spin" />
                            <span>جاري الرفع...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleSave(page.id)}
                      disabled={savingId === page.id || uploading}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
                    >
                      {savingId === page.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      <span>{savingId === page.id ? "جاري الحفظ..." : "حفظ التغيرات"}</span>
                    </button>

                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <X size={16} />
                      <span>إلغاء</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* READ-ONLY VIEW */
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-mono font-bold border border-slate-200/80">
                        <Globe size={13} className="text-amber-600" />
                        /{page.slug}
                      </span>
                      {page.slug !== "home" && (
                        <h2 className="text-base font-extrabold text-slate-900">
                          {page.title || "بدون عنوان"}
                        </h2>
                      )}
                    </div>

                    {page.subtitle && (
                      <p className="text-xs font-bold text-amber-700">{page.subtitle}</p>
                    )}

                    {page.slug !== "contact" && page.slug !== "products" && page.slug !== "services" && (
                      page.content ? (
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                          {page.content}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          لا يوجد نص مفصل محدد لهذه الصفحة بعد.
                        </p>
                      )
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0 self-start">
                    <button
                      onClick={() => handleEdit(page)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 text-slate-700 hover:text-amber-800 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      <Edit3 size={15} />
                      <span>تعديل الصفحة</span>
                    </button>
                    {page.slug && (
                      <a
                        href={page.slug === "home" ? "/" : `/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-slate-400 hover:text-amber-700 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink size={12} />
                        معاينة بالموقع
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}