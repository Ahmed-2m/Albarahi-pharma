"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Settings,
  Building,
  PhoneCall,
  AlertTriangle,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
  Sparkles,
  X,
  Globe,
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"company" | "contact" | "emergency" | "content">("company");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [settings, setSettings] = useState({
    company_name: "",
    company_subtitle: "",
    logo: "",
    phone: "",
    phone2: "",
    email: "",
    email2: "",
    address: "",
    working_hours: "",
    emergency_phone: "",
    emergency_title: "",
    emergency_description: "",
    form_title: "",
    form_description: "",
    mission_text: "",
    vision_text: "",
    process_title: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*");

      if (error) throw error;

      const settingsObj: Record<string, string> = {};
      data?.forEach((item) => {
        settingsObj[item.key] = item.value;
      });
      setSettings((prev) => ({ ...prev, ...settingsObj }));
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value || "",
        type: "text",
      }));

      const { error } = await supabase
        .from("settings")
        .upsert(updates, { onConflict: "key" });

      if (error) throw error;

      setMessage({ text: "تم حفظ جميع الإعدادات والهوية بنجاح!", type: "success" });
      setTimeout(() => setMessage(null), 3500);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ text: "حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة لاحقاً.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "company", label: "معلومات الهوية والشركة", icon: Building },
    { id: "contact", label: "بيانات التواصل", icon: PhoneCall },
    { id: "emergency", label: "قسم الطوارئ", icon: AlertTriangle },
    { id: "content", label: "نموذج الرسالة ونموذج التواصل", icon: FileText },
  ];

  // دالة رفع الصورة
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      setMessage({ text: "❌ يرجى اختيار صورة فقط", type: "error" });
      return;
    }

    // التحقق من الحجم (حد أقصى 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: "❌ حجم الصورة كبير جداً (الحد الأقصى 2MB)", type: "error" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // إنشاء اسم فريد للصورة
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // رفع الصورة إلى Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // الحصول على الرابط العام للصورة
      const { data: publicUrlData } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // تحديث الإعدادات برابط الصورة
      setSettings(prev => ({ ...prev, logo: publicUrl }));
      setMessage({ text: "✅ تم رفع الشعار بنجاح!", type: "success" });
      
      // حفظ الشعار تلقائياً
      const { error: saveError } = await supabase
        .from("settings")
        .upsert({ key: 'logo', value: publicUrl, type: 'text' }, { onConflict: 'key' });

      if (saveError) throw saveError;

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ text: "❌ حدث خطأ أثناء رفع الصورة", type: "error" });
    } finally {
      setSaving(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col justify-center items-center space-y-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500 animate-pulse">
          جاري تحميل الإعدادات العامة...
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
              <Settings size={20} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              إعدادات النظام العامة
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            تحديث هويات الموقع وشعاره وبيانات التواصل الأساسية والنصوص التعريفية
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-teal-50 text-teal-800 border border-teal-100 text-xs font-extrabold flex items-center gap-1.5 self-start md:self-auto">
          <Sparkles size={14} className="text-teal-600" />
          <span>تزامن مع الجدول: settings</span>
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

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              <TabIcon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
          {/* TAB 1: COMPANY & LOGO */}
          {activeTab === "company" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Building size={18} className="text-teal-600" />
                  معلومات الشركة والكرامة البصرية
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  اسم المؤسسة، الشعار الرسمي، والعنوان الفرعي
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اسم الشركة / المؤسسة الرئيسي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.company_name}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="مؤسسة صادق البرحي"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    العنوان الفرعي للمؤسسة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.company_subtitle}
                    onChange={(e) => handleChange("company_subtitle", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="للمستلزمات الطبية والأدوية"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  صورة الشعار الرسمية
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="relative flex-1">
                    <Globe className="absolute right-3.5 top-3 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={settings.logo}
                      onChange={(e) => handleChange("logo", e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono dir-ltr text-right"
                      placeholder="رابط الشعار (اختياري)"
                    />
                  </div>

                  {/* زر رفع الصورة */}
                  <div className="flex items-center gap-2">
                    <label className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-2 whitespace-nowrap">
                      <ImageIcon size={16} />
                      <span>رفع صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    {/* زر إزالة الشعار - يظهر فقط إذا كان فيه شعار */}
                    {settings.logo && (
                      <button
                        type="button"
                        onClick={() => {
                          setSettings(prev => ({ ...prev, logo: '' }));
                          setMessage({ text: "✅ تم إزالة الشعار بنجاح!", type: "success" });
                          setTimeout(() => setMessage(null), 3000);
                        }}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-2 whitespace-nowrap"
                      >
                        <X size={16} />
                        <span>إزالة الشعار</span>
                      </button>
                    )}
                  </div>

                  {settings.logo && (
                    <div className="w-20 h-14 border border-slate-200 rounded-2xl bg-slate-50 p-1 flex items-center justify-center shrink-0 self-center shadow-2xs">
                      <img
                        src={settings.logo}
                        alt="معاينة الشعار"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/default-logo.png";
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  يمكنك ترك الحقل فارغاً لإخفاء الشعار، أو رفع صورة جديدة، أو إزالة الشعار الحالي.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT INFO */}
          {activeTab === "contact" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <PhoneCall size={18} className="text-teal-600" />
                  بيانات وحقول التواصل
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  أرقام الهواتف، البريد الإلكتروني، وساعات العمل بالمقر الرئيسي
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الهاتف الأساسي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="+967 1 000 000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الهاتف الثانوي
                  </label>
                  <input
                    type="text"
                    value={settings.phone2}
                    onChange={(e) => handleChange("phone2", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="+967 770 000 000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    البريد الإلكتروني الرئيسي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="info@albarahi-pharma.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    البريد الإلكتروني الثانوي
                  </label>
                  <input
                    type="email"
                    value={settings.email2}
                    onChange={(e) => handleChange("email2", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="sales@albarahi-pharma.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    العنوان الرئيسي للمقر <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="اليمن - صنعاء - شارع..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ساعات وأيام العمل الرسمية <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.working_hours}
                    onChange={(e) => handleChange("working_hours", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="السبت - الخميس: 8:00 صباحاً - 5:00 مساءً"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EMERGENCY */}
          {activeTab === "emergency" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-rose-600" />
                  قسم ونموذج الطوارئ المباشر
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  رقم الطوارئ السريع، العنوان وشرح المساعدة الطارئة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم خط الطوارئ السريع
                  </label>
                  <input
                    type="text"
                    value={settings.emergency_phone}
                    onChange={(e) => handleChange("emergency_phone", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="+967 770 000 999"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    عنوان قسم الطوارئ
                  </label>
                  <input
                    type="text"
                    value={settings.emergency_title}
                    onChange={(e) => handleChange("emergency_title", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="خدمة الطوارئ والتأمين الصيدلاني 24/7"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  وصف وتوضيح الطوارئ
                </label>
                <textarea
                  value={settings.emergency_description}
                  onChange={(e) => handleChange("emergency_description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none font-medium"
                  placeholder="نوفر الاستجابة والتجهيز الفوري للطلبات الطبية الحارجة والحرجة..."
                />
              </div>
            </div>
          )}

          {/* TAB 4: GENERAL CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-teal-600" />
                  نموذج الرسالة ونموذج التواصل
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  عناوين النماذج والوصف
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    عنوان نموذج التواصل بالموقع
                  </label>
                  <input
                    type="text"
                    value={settings.form_title}
                    onChange={(e) => handleChange("form_title", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="تواصل مع فريقنا الطبي"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    وصف نموذج التواصل
                  </label>
                  <input
                    type="text"
                    value={settings.form_description}
                    onChange={(e) => handleChange("form_description", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                    placeholder="سعداء بخدمتكم وتوفير الاستفسارات الصيدلانية"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نص رسالة المؤسسة (Mission Text)
                  </label>
                  <textarea
                    value={settings.mission_text}
                    onChange={(e) => handleChange("mission_text", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none font-medium"
                    placeholder="رسالتنا هي توفير أجود المنتجات الطبية بأعلى المعايير..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نص رؤية المؤسسة (Vision Text)
                  </label>
                  <textarea
                    value={settings.vision_text}
                    onChange={(e) => handleChange("vision_text", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none font-medium"
                    placeholder="رؤيتنا أن نكون الشريك الصيدلاني الأول والموثوق..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{saving ? "جاري حفظ الإعدادات..." : "حفظ جميع الإعدادات الآن"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}