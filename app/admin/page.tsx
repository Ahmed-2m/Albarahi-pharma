"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Package,
  Briefcase,
  Store,
  FileText,
  Settings,
  ArrowUpLeft,
  RefreshCw,
  Zap,
  TrendingUp,
  Activity,
  ShieldCheck,
  Globe,
  Sparkles,
  Layers,
  Database,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    services: 0,
    branches: 0,
    pages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  const fetchStats = async () => {
    try {
      const [
        { count: products },
        { count: services },
        { count: branches },
        { count: pages },
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("service_cards").select("*", { count: "exact", head: true }),
        supabase.from("branches").select("*", { count: "exact", head: true }),
        supabase.from("pages").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        products: products || 0,
        services: services || 0,
        branches: branches || 0,
        pages: pages || 0,
      });

      const now = new Date();
      setLastSyncTime(
        now.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
      );
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const cards = [
    {
      title: "إجمالي المنتجات الطبية",
      value: stats.products,
      icon: Package,
      gradient: "from-teal-500 to-teal-700",
      lightBg: "bg-teal-50 text-teal-700 border-teal-100",
      badge: "متجر / منتجات",
    },
    {
      title: "بطاقات الخدمات",
      value: stats.services,
      icon: Briefcase,
      gradient: "from-emerald-500 to-emerald-700",
      lightBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      badge: "خدمات المؤسسة",
    },
    {
      title: "الفروع والمواقع",
      value: stats.branches,
      icon: Store,
      gradient: "from-purple-500 to-purple-700",
      lightBg: "bg-purple-50 text-purple-700 border-purple-100",
      badge: "مراكز التوزيع",
    },
    {
      title: "الصفحات الديناميكية",
      value: stats.pages,
      icon: FileText,
      gradient: "from-amber-500 to-amber-600",
      lightBg: "bg-amber-50 text-amber-700 border-amber-100",
      badge: "محتوى الموقع",
    },
  ];

  const quickActions = [
    {
      label: "إدارة المنتجات الطبية",
      desc: "إضافة وتعديل المنتجات وأسعارها وتصنيفاتها",
      path: "/admin/products",
      icon: Package,
      accent: "teal",
    },
    {
      label: "دليل خدمات المؤسسة",
      desc: "تحديث كروت الخدمات ومميزاتها المعروضة",
      path: "/admin/services",
      icon: Briefcase,
      accent: "emerald",
    },
    {
      label: "محتوى صفحات الموقع",
      desc: "التحكم بالنصوص والعناوين والصور في الصفحات",
      path: "/admin/pages",
      icon: FileText,
      accent: "amber",
    },
    {
      label: "فروع ومكاتب الشركة",
      desc: "إدارة عناوين الفروع وأرقام التواصل وساعات العمل",
      path: "/admin/branches",
      icon: Store,
      accent: "purple",
    },
    {
      label: "الإعدادات العامة وهوية الموقع",
      desc: "تعديل الشعار ومعلومات التواصل والنصوص الأساسية",
      path: "/admin/settings",
      icon: Settings,
      accent: "slate",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col justify-center items-center space-y-4 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin" />
          <Database size={20} className="absolute inset-0 m-auto text-teal-700 animate-pulse" />
        </div>
        <p className="text-xs font-bold text-slate-500 animate-pulse">
          جاري المزامنة مع قاعدة البيانات...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800" dir="rtl">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-l from-slate-900 via-teal-950 to-teal-900 p-6 md:p-8 text-white shadow-lg overflow-hidden border border-teal-800/40">
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-200 text-[11px] font-semibold border border-white/10">
              <Sparkles size={13} className="text-amber-400" />
              <span>نظام لوحة التحكم الحديث • مؤسسة صادق البرحي</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              أهلاً بك في مركز إدارة المحتوى والموقع 👋
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              تحكم كامل ومباشر بمنتجات وخدمات وصفحات الموقع. التغيرات التي تجريها هنا تحدّث بيانات الموقع فوراً عبر قاعدة البيانات.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-teal-900 hover:bg-teal-50 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin text-teal-700" : "text-teal-700"} />
              <span>{refreshing ? "جاري المزامنة..." : "تحديث البيانات"}</span>
            </button>
            {lastSyncTime && (
              <span className="text-[10px] text-teal-200/80 font-medium">
                آخر تحديث: {lastSyncTime}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group relative rounded-2xl bg-white border border-slate-200/80 p-5 transition-all duration-200 hover:shadow-md hover:border-teal-300 overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${card.lightBg}`}
                  >
                    {card.badge}
                  </span>
                  <p className="text-xs font-semibold text-slate-500">
                    {card.title}
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                >
                  <Icon size={22} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 size={12} /> متصل ومباشر
                </span>
                <span className="font-semibold text-slate-400 group-hover:text-teal-700 transition-colors">
                  Supabase DB
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (2 Columns) */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                <Zap size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  الإجراءات والوصول السريع
                </h2>
                <p className="text-xs text-slate-400">
                  اختر القسم المطلوبة إدارته وتعديل بياناته
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 hidden sm:inline-block">
              5 أقسام رئيسية
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.path}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-teal-700 hover:border-teal-700 transition-all duration-200 shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:bg-white/20 group-hover:border-white/30 text-teal-700 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-2xs">
                      <ActionIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-white transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-[10px] text-slate-500 group-hover:text-teal-100 transition-colors mt-0.5 line-clamp-1">
                        {action.desc}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400 group-hover:text-white transition-transform group-hover:-translate-x-1 shrink-0 mr-2">
                    <ArrowUpLeft size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Health Card (1 Column) */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Activity size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  سلامة وتزامن النظام
                </h2>
                <p className="text-xs text-slate-400">
                  مؤشرات الربط واستجابة قاعدة البيانات
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      قاعدة البيانات Supabase
                    </h3>
                    <p className="text-[10px] text-slate-400">سيرفر الإنتاج المباشر</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  نشطة ومستقرة
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-2.5">
                  <Globe size={18} className="text-teal-600" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      تحديثات الموقع الفورية
                    </h3>
                    <p className="text-[10px] text-slate-400">المزامنة مع الزوار</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-100">
                  تلقائي Live
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-2.5">
                  <Layers size={18} className="text-purple-600" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      الجداول المفعّلة
                    </h3>
                    <p className="text-[10px] text-slate-400">4 جداول أساسية</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  جاهزة للتعديل
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] font-semibold text-slate-400">
              🔒 جميع عمليات التعديل والتحديث آمنة وتُحفظ لحظياً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
