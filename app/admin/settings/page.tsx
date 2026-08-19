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
  ShieldCheck,
  ListOrdered,
} from "lucide-react";

// قائمة الـ 20 أيقونة الطبية والاحترافية الجاهزة للاختيار المرئي للأدمن
const AVAILABLE_ICONS = [
  { name: 'fas fa-microscope', label: 'المجهر (فحص)' },
  { name: 'fas fa-shield-alt', label: 'درع (حماية وضمان)' },
  { name: 'fas fa-thermometer-half', label: 'حرارة (تخزين)' },
  { name: 'fas fa-certificate', label: 'شهادة (امتثال)' },
  { name: 'fas fa-pills', label: 'أدوية وقبس' },
  { name: 'fas fa-capsules', label: 'كبسولات دواء' },
  { name: 'fas fa-syringe', label: 'حقنة طبية' },
  { name: 'fas fa-heartbeat', label: 'نبضات القلب' },
  { name: 'fas fa-hospital', label: 'مستشفى' },
  { name: 'fas fa-clinic-medical', label: 'عيادة طبية' },
  { name: 'fas fa-notes-medical', label: 'ملفات طبية' },
  { name: 'fas fa-file-medical', label: 'تقارير فحص' },
  { name: 'fas fa-stethoscope', label: 'سماعة طبية' },
  { name: 'fas fa-first-aid', label: 'إسعافات أولية' },
  { name: 'fas fa-check-circle', label: 'علامة صح' },
  { name: 'fas fa-award', label: 'جائزة وتميز' },
  { name: 'fas fa-flask', label: 'أنبوب مختبر' },
  { name: 'fas fa-box-open', label: 'تغليف وشحن' },
  { name: 'fas fa-dolly', label: 'نقل وتوزيع' },
  { name: 'fas fa-hands-helping', label: 'خدمة وثقة' },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"company" | "contact" | "emergency" | "content" | "quality" | "process" | "statistics">("company");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // إعدادات النظام العامة
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
    contact_info_title: "",
    contact_info_description: "",
    process_title: "",
  });

  // حالة إدارة قسم ضمان الجودة (Quality Items)
  const [qualityItems, setQualityItems] = useState<any[]>([]);
  const [editingQualityId, setEditingQualityId] = useState<number | null>(null);
  const [qTitle, setQTitle] = useState("");
  const [qDescription, setQDescription] = useState("");
  const [qIcon, setQIcon] = useState("fas fa-microscope");
  const [qOrder, setQOrder] = useState(0);
  const [qIsActive, setQIsActive] = useState(true);

  // حالة إدارة قسم خطوات العمل (Process Steps)
  const [processSteps, setProcessSteps] = useState<any[]>([]);
  const [editingProcessId, setEditingProcessId] = useState<number | null>(null);
  const [pNumber, setPNumber] = useState(1);
  const [pTitle, setPTitle] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pIcon, setPIcon] = useState("fas fa-check-circle");

  // حالة إدارة قسم الإحصائيات (Statistics / Achievements)
  const [statisticsItems, setStatisticsItems] = useState<any[]>([]);
  const [editingStatId, setEditingStatId] = useState<number | null>(null);
  const [statNumber, setStatNumber] = useState("");
  const [statLabel, setStatLabel] = useState("");
  const [statDescription, setStatDescription] = useState("");
  const [statOrder, setStatOrder] = useState(0);
  const [statIsActive, setStatIsActive] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchQualityItems();
    fetchProcessSteps();
    fetchStatisticsItems();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("settings").select("*");
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

  const fetchQualityItems = async () => {
    try {
      const { data, error } = await supabase
        .from("quality_items")
        .select("*")
        .order("order", { ascending: true });
      if (!error && data) {
        setQualityItems(data);
      }
    } catch (error) {
      console.error("Error fetching quality items:", error);
    }
  };

  const fetchProcessSteps = async () => {
    try {
      const { data, error } = await supabase
        .from("process_steps")
        .select("*")
        .order("step_number", { ascending: true });
      if (!error && data) {
        setProcessSteps(data);
      }
    } catch (error) {
      console.error("Error fetching process steps:", error);
    }
  };

  const fetchStatisticsItems = async () => {
    try {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .order("order", { ascending: true });
      if (!error && data) {
        setStatisticsItems(data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  // حفظ الإعدادات العامة
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

  // عمليات ضمان الجودة
  const handleSaveQualityItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingQualityId) {
        const { error } = await supabase
          .from("quality_items")
          .update({ title: qTitle, description: qDescription, icon: qIcon, order: qOrder, is_active: qIsActive })
          .eq("id", editingQualityId);

        if (error) throw error;
        setMessage({ text: "تم تحديث عنصر ضمان الجودة بنجاح!", type: "success" });
      } else {
        const { error } = await supabase
          .from("quality_items")
          .insert([{ title: qTitle, description: qDescription, icon: qIcon, order: qOrder, is_active: qIsActive }]);

        if (error) throw error;
        setMessage({ text: "تم إضافة عنصر ضمان الجودة بنجاح!", type: "success" });
      }

      resetQualityForm();
      fetchQualityItems();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving quality item:", error);
      setMessage({ text: "حدث خطأ أثناء حفظ عنصر الجودة", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleEditQuality = (item: any) => {
    setEditingQualityId(item.id);
    setQTitle(item.title);
    setQDescription(item.description);
    setQIcon(item.icon || "fas fa-microscope");
    setQOrder(item.order || 0);
    setQIsActive(item.is_active ?? true);
  };

  const handleDeleteQuality = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;
    try {
      const { error } = await supabase.from("quality_items").delete().eq("id", id);
      if (error) throw error;
      fetchQualityItems();
      setMessage({ text: "تم حذف العنصر بنجاح", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting quality item:", error);
    }
  };

  const resetQualityForm = () => {
    setEditingQualityId(null);
    setQTitle("");
    setQDescription("");
    setQIcon("fas fa-microscope");
    setQOrder(0);
    setQIsActive(true);
  };

  // عمليات قسم خطوات العمل
  const handleSaveProcessStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        step_number: pNumber,
        title: pTitle,
        description: pDescription,
        icon: pIcon,
      };

      if (editingProcessId) {
        const { error } = await supabase
          .from("process_steps")
          .update(payload)
          .eq("id", editingProcessId);

        if (error) throw error;
        setMessage({ text: "تم تحديث خطوة العمل بنجاح!", type: "success" });
      } else {
        const { error } = await supabase
          .from("process_steps")
          .insert([payload]);

        if (error) throw error;
        setMessage({ text: "تم إضافة خطوة العمل بنجاح!", type: "success" });
      }

      resetProcessForm();
      fetchProcessSteps();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving process step:", error);
      setMessage({ text: "حدث خطأ أثناء حفظ خطوة العمل", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleEditProcess = (step: any) => {
    setEditingProcessId(step.id);
    setPNumber(step.step_number || 1);
    setPTitle(step.title);
    setPDescription(step.description);
    setPIcon(step.icon || "fas fa-check-circle");
  };

  const handleDeleteProcess = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخطوة؟")) return;
    try {
      const { error } = await supabase.from("process_steps").delete().eq("id", id);
      if (error) throw error;
      fetchProcessSteps();
      setMessage({ text: "تم حذف الخطوة بنجاح", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting process step:", error);
    }
  };

  const resetProcessForm = () => {
    setEditingProcessId(null);
    setPNumber(processSteps.length + 1);
    setPTitle("");
    setPDescription("");
    setPIcon("fas fa-check-circle");
  };

  // عمليات قسم الإحصائيات
  const handleSaveStatistic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        number: statNumber,
        label: statLabel,
        description: statDescription,
        order: statOrder,
        is_active: statIsActive,
      };

      if (editingStatId) {
        const { error } = await supabase
          .from("statistics")
          .update(payload)
          .eq("id", editingStatId);

        if (error) throw error;
        setMessage({ text: "تم تحديث الإحصائية بنجاح!", type: "success" });
      } else {
        const { error } = await supabase
          .from("statistics")
          .insert([payload]);

        if (error) throw error;
        setMessage({ text: "تم إضافة الإحصائية بنجاح!", type: "success" });
      }

      resetStatForm();
      fetchStatisticsItems();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving statistic:", error);
      setMessage({ text: "حدث خطأ أثناء حفظ الإحصائية", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleEditStat = (item: any) => {
    setEditingStatId(item.id);
    setStatNumber(item.number || "");
    setStatLabel(item.label || "");
    setStatDescription(item.description || "");
    setStatOrder(item.order || 0);
    setStatIsActive(item.is_active ?? true);
  };

  const handleDeleteStat = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الإحصائية؟")) return;
    try {
      const { error } = await supabase.from("statistics").delete().eq("id", id);
      if (error) throw error;
      fetchStatisticsItems();
      setMessage({ text: "تم حذف الإحصائية بنجاح", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting statistic:", error);
    }
  };

  const resetStatForm = () => {
    setEditingStatId(null);
    setStatNumber("");
    setStatLabel("");
    setStatDescription("");
    setStatOrder(0);
    setStatIsActive(true);
  };

  const tabs = [
    { id: "company", label: "معلومات الهوية والشركة", icon: Building },
    { id: "contact", label: "بيانات التواصل", icon: PhoneCall },
    { id: "emergency", label: "قسم الطوارئ", icon: AlertTriangle },
    { id: "content", label: "نموذج الرسالة ونموذج التواصل", icon: FileText },
    { id: "quality", label: "قسم ضمان الجودة", icon: ShieldCheck },
    { id: "process", label: "قسم كيف نخدمك", icon: ListOrdered },
    { id: "statistics", label: "قسم الإحصائيات (Achievements)", icon: Sparkles },
  ];

  // دالة رفع الشعار
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: "❌ يرجى اختيار صورة فقط", type: "error" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: "❌ حجم الصورة كبير جداً (الحد الأقصى 2MB)", type: "error" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('logos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      setSettings(prev => ({ ...prev, logo: publicUrl }));
      setMessage({ text: "✅ تم رفع الشعار بنجاح!", type: "success" });
      
      await supabase.from("settings").upsert({ key: 'logo', value: publicUrl, type: 'text' }, { onConflict: 'key' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ text: "❌ حدث خطأ أثناء رفع الصورة", type: "error" });
    } finally {
      setSaving(false);
      if (e.target) e.target.value = '';
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
            تحديث هويات الموقع وشعاره، بيانات التواصل، ضمان الجودة، كيف نخدمك، وإحصائيات الموقع
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-2xl bg-teal-50 text-teal-800 border border-teal-100 text-xs font-extrabold flex items-center gap-1.5 self-start md:self-auto">
          <Sparkles size={14} className="text-teal-600" />
          <span>تزامن مع الجداول: settings, quality_items, process_steps, statistics</span>
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
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
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

      {/* TAB 1: COMPANY */}
      {activeTab === "company" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Building size={18} className="text-teal-600" />
                  معلومات الشركة والكرامة البصرية
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">اسم المؤسسة، الشعار الرسمي، والعنوان الفرعي</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الشركة / المؤسسة الرئيسي *</label>
                  <input
                    type="text"
                    value={settings.company_name}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">العنوان الفرعي للمؤسسة *</label>
                  <input
                    type="text"
                    value={settings.company_subtitle}
                    onChange={(e) => handleChange("company_subtitle", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 focus:outline-none focus:bg-white font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">صورة الشعار الرسمية</label>
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="relative flex-1">
                    <Globe className="absolute right-3.5 top-3 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={settings.logo}
                      onChange={(e) => handleChange("logo", e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-2 whitespace-nowrap">
                      <ImageIcon size={16} />
                      <span>رفع صورة</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
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
                        <span>إزالة</span>
                      </button>
                    )}
                  </div>
                  {settings.logo && (
                    <div className="w-20 h-14 border border-slate-200 rounded-2xl bg-slate-50 p-1 flex items-center justify-center shrink-0 self-center">
                      <img src={settings.logo} alt="شعار" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md cursor-pointer">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: CONTACT */}
      {activeTab === "contact" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <PhoneCall size={18} className="text-teal-600" />
                  بيانات وحقول التواصل
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">أرقام الهواتف، البريد الإلكتروني، وساعات العمل</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف الأساسي *</label>
                  <input type="text" value={settings.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف الثانوي</label>
                  <input type="text" value={settings.phone2} onChange={(e) => handleChange("phone2", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني الرئيسي *</label>
                  <input type="email" value={settings.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني الثانوي</label>
                  <input type="email" value={settings.email2} onChange={(e) => handleChange("email2", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">العنوان الرئيسي للمقر *</label>
                  <input type="text" value={settings.address} onChange={(e) => handleChange("address", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ساعات وأيام العمل الرسمية *</label>
                  <input type="text" value={settings.working_hours} onChange={(e) => handleChange("working_hours", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-medium" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md cursor-pointer">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: EMERGENCY */}
      {activeTab === "emergency" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-rose-600" />
                  قسم ونموذج الطوارئ المباشر
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">رقم الطوارئ السريع، العنوان وشرح المساعدة الطارئة</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم خط الطوارئ السريع</label>
                  <input type="text" value={settings.emergency_phone} onChange={(e) => handleChange("emergency_phone", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-mono dir-ltr text-right font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان قسم الطوارئ</label>
                  <input type="text" value={settings.emergency_title} onChange={(e) => handleChange("emergency_title", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف وتوضيح الطوارئ</label>
                <textarea value={settings.emergency_description} onChange={(e) => handleChange("emergency_description", e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 resize-none font-medium" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md cursor-pointer">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: CONTENT */}
      {activeTab === "content" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-teal-600" />
                  نموذج الرسالة ونموذج التواصل ونصوص صفحة اتصل بنا
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">عناوين النماذج ونصوص معلومات التواصل التي تظهر في صفحة الاتصال</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان نموذج التواصل بالموقع</label>
                  <input type="text" value={settings.form_title} onChange={(e) => handleChange("form_title", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف نموذج التواصل</label>
                  <input type="text" value={settings.form_description} onChange={(e) => handleChange("form_description", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-medium" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان قسم معلومات التواصل (contact_info_title)</label>
                  <input type="text" value={settings.contact_info_title} onChange={(e) => handleChange("contact_info_title", e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 font-medium" placeholder="Contact Information" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف قسم معلومات التواصل (contact_info_description)</label>
                  <textarea value={settings.contact_info_description} onChange={(e) => handleChange("contact_info_description", e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-xs text-slate-800 resize-none font-medium" placeholder="Get in touch with us through any of the following methods..." />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md cursor-pointer">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 5: QUALITY ASSURANCE */}
      {activeTab === "quality" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={18} className="text-teal-600" />
                إدارة قسم ضمان الجودة (Quality Assurance)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">إضافة وتعديل كروت ضمان الجودة مع اختيار الأيقونات الطبية المرئية (20 أيقونة)</p>
            </div>

            <form onSubmit={handleSaveQualityItem} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800">
                {editingQualityId ? "تعديل عنصر ضمان الجودة الحالي" : "إضافة عنصر جديد لضمان الجودة"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">العنوان *</label>
                  <input
                    type="text"
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    placeholder="مثال: فحص الجودة المخبرية"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الترتيب (Order)</label>
                  <input
                    type="number"
                    value={qOrder}
                    onChange={(e) => setQOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوصف</label>
                <textarea
                  value={qDescription}
                  onChange={(e) => setQDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
                  placeholder="شخص ووضح الميزة أو معيار الجودة..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">اختر الأيقونة المرئية ({AVAILABLE_ICONS.length} أيقونة متوفرة)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-white border border-slate-200 rounded-2xl">
                  {AVAILABLE_ICONS.map((ic, idx) => (
                    <div
                      key={idx}
                      onClick={() => setQIcon(ic.name)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl cursor-pointer transition-all ${
                        qIcon === ic.name
                          ? "bg-teal-50 border-2 border-teal-600 text-teal-800 shadow-2xs"
                          : "bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <i className={`${ic.name} text-xl mb-1 text-teal-600`}></i>
                      <span className="text-[10px] text-center font-bold">{ic.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="qIsActive"
                  checked={qIsActive}
                  onChange={(e) => setQIsActive(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="qIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  مفعل (يظهر في الموقع العام)
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer">
                  {editingQualityId ? "تحديث العنصر" : "إضافة العنصر الجديد"}
                </button>
                {editingQualityId && (
                  <button type="button" onClick={resetQualityForm} className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-700">
                    <th className="p-3">الأيقونة</th>
                    <th className="p-3">العنوان</th>
                    <th className="p-3">الوصف</th>
                    <th className="p-3">الترتيب</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">لا توجد عناصر مضافة حتى الآن.</td>
                    </tr>
                  ) : (
                    qualityItems.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 text-center">
                          <i className={`${item.icon} text-lg text-teal-600`}></i>
                        </td>
                        <td className="p-3 font-extrabold text-slate-900">{item.title}</td>
                        <td className="p-3 text-slate-500 max-w-xs truncate">{item.description}</td>
                        <td className="p-3">{item.order}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.is_active ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                            {item.is_active ? "مفعل" : "مخفي"}
                          </span>
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          <button onClick={() => handleEditQuality(item)} className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px] cursor-pointer">تعديل</button>
                          <button onClick={() => handleDeleteQuality(item.id)} className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] cursor-pointer">حذف</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PROCESS STEPS */}
      {activeTab === "process" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ListOrdered size={18} className="text-teal-600" />
                إدارة قسم كيف نخدمك (How We Serve You)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">إضافة وتعديل خطوات العمل، أرقامها، أيقوناتها، والنصوص التوضيحية</p>
            </div>

            <form onSubmit={handleSaveProcessStep} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800">
                {editingProcessId ? "تعديل خطوة العمل الحالية" : "إضافة خطوة عمل جديدة"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الخطوة (Step Number) *</label>
                  <input
                    type="number"
                    value={pNumber}
                    onChange={(e) => setPNumber(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الخطوة *</label>
                  <input
                    type="text"
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    placeholder="مثال: تقديم الطلب"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوصف</label>
                <textarea
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
                  placeholder="وصف تفصيلي للخطوة..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">اختر الأيقونة المرئية للخطوة</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-white border border-slate-200 rounded-2xl">
                  {AVAILABLE_ICONS.map((ic, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPIcon(ic.name)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl cursor-pointer transition-all ${
                        pIcon === ic.name
                          ? "bg-teal-50 border-2 border-teal-600 text-teal-800 shadow-2xs"
                          : "bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <i className={`${ic.name} text-xl mb-1 text-teal-600`}></i>
                      <span className="text-[10px] text-center font-bold">{ic.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer">
                  {editingProcessId ? "تحديث الخطوة" : "إضافة الخطوة"}
                </button>
                {editingProcessId && (
                  <button type="button" onClick={resetProcessForm} className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-700">
                    <th className="p-3">الرقم</th>
                    <th className="p-3">الأيقونة</th>
                    <th className="p-3">العنوان</th>
                    <th className="p-3">الوصف</th>
                    <th className="p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {processSteps.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">لا توجد خطوات عمل مسجلة حتى الآن.</td>
                    </tr>
                  ) : (
                    processSteps.map((step) => (
                      <tr key={step.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-teal-700">{step.step_number}</td>
                        <td className="p-3 text-center">
                          <i className={`${step.icon} text-lg text-teal-600`}></i>
                        </td>
                        <td className="p-3 font-extrabold text-slate-900">{step.title}</td>
                        <td className="p-3 text-slate-500 max-w-xs truncate">{step.description}</td>
                        <td className="p-3 flex items-center gap-2">
                          <button onClick={() => handleEditProcess(step)} className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px] cursor-pointer">تعديل</button>
                          <button onClick={() => handleDeleteProcess(step.id)} className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] cursor-pointer">حذف</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: STATISTICS / ACHIEVEMENTS */}
      {activeTab === "statistics" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-teal-600" />
                إدارة قسم الإحصائيات (Our Achievements)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">إضافة وتعديل الأرقام، العناوين، والوصف الخاص بإنجازات الشركة</p>
            </div>

            <form onSubmit={handleSaveStatistic} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800">
                {editingStatId ? "تعديل الإحصائية الحالية" : "إضافة إحصائية جديدة"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الرقم / القيمة (Number) *</label>
                  <input
                    type="text"
                    value={statNumber}
                    onChange={(e) => setStatNumber(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium dir-ltr text-right"
                    placeholder="مثال: 15+ أو 100k"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">العنوان / التصنيف (Label) *</label>
                  <input
                    type="text"
                    value={statLabel}
                    onChange={(e) => setStatLabel(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    placeholder="مثال: Years of Experience"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الترتيب (Order)</label>
                  <input
                    type="number"
                    value={statOrder}
                    onChange={(e) => setStatOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوصف المختصر</label>
                <textarea
                  value={statDescription}
                  onChange={(e) => setStatDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium resize-none"
                  placeholder="تفاصيل إضافية حول هذه الإحصائية..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="statIsActive"
                  checked={statIsActive}
                  onChange={(e) => setStatIsActive(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="statIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  مفعل (يظهر في الموقع العام)
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer">
                  {editingStatId ? "تحديث الإحصائية" : "إضافة الإحصائية"}
                </button>
                {editingStatId && (
                  <button type="button" onClick={resetStatForm} className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-700">
                    <th className="p-3">القيمة / الرقم</th>
                    <th className="p-3">العنوان</th>
                    <th className="p-3">الوصف</th>
                    <th className="p-3">الترتيب</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {statisticsItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400">لا توجد إحصائيات مسجلة حتى الآن.</td>
                    </tr>
                  ) : (
                    statisticsItems.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 font-extrabold text-teal-700 text-sm">{item.number}</td>
                        <td className="p-3 font-extrabold text-slate-900">{item.label}</td>
                        <td className="p-3 text-slate-500 max-w-xs truncate">{item.description}</td>
                        <td className="p-3">{item.order}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.is_active ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                            {item.is_active ? "مفعل" : "مخفي"}
                          </span>
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          <button onClick={() => handleEditStat(item)} className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px] cursor-pointer">تعديل</button>
                          <button onClick={() => handleDeleteStat(item.id)} className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] cursor-pointer">حذف</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}