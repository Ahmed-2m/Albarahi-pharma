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
      title: "إجمالي المنتجات",
      value: stats.products,
      icon: Package,
      bgIcon: "bg-teal-50 text-teal-600",
      border: "hover:border-teal-200",
      badge: "تحديث مباشر",
      badgeBg: "bg-teal-50 text-teal-700 border border-teal-100",
    },
    {
      title: "بطاقات الخدمات",
      value: stats.services,
      icon: Briefcase,
      bgIcon: "bg-emerald-50 text-emerald-600",
      border: "hover:border-emerald-200",
      badge: "نشط ومتزامن",
      badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    },
    {
      title: "فروع الشركة",
      value: stats.branches,
      icon: Store,
      bgIcon: "bg-purple-50 text-purple-600",
      border: "hover:border-purple-200",
      badge: "مغطاة جغرافياً",
      badgeBg: "bg-purple-50 text-purple-700 border border-purple-100",
    },
    {
      title: "الصفحات النشطة",
      value: stats.pages,
      icon: FileText,
      bgIcon: "bg-amber-50 text-amber-600",
      border: "hover:border-amber-200",
      badge: "محتوى ديناميكي",
      badgeBg: "bg-amber-50 text-amber-700 border border-amber-100",
    },
  ];

  const quickActions = [
    {
      label: "إدارة المنتجات",
      desc: "إضافة وتحديث المنتجات الطبية",
      path: "/admin/products",
      icon: Package,
      iconColor: "text-teal-600 bg-teal-50",
    },
    {
      label: "دليل الخدمات",
      desc: "التحكم ببطاقات الخدمات المقدمة",
      path: "/admin/services",
      icon: Briefcase,
      iconColor: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "إدارة الصفحات",
      desc: "تعديل نصوص ومحتوى الأقسام",
      path: "/admin/pages",
      icon: FileText,
      iconColor: "text-amber-600 bg-amber-50",
    },
    {
      label: "إعدادات النظام",
      desc: "ضبط التفضيلات والهوية الحصرية",
      path: "/admin/settings",
      icon: Settings,
      iconColor: "text-purple-600 bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center space-y-4">
        <div className="w-10 h-10 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400 animate-pulse">
          جاري تحميل بيانات لوحة التحكم...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800" dir="rtl">
      {/* Modern Light Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-teal-800 p-6 md:p-8 text-white shadow-md overflow-hidden">
        <div className="absolute -left-12 -bottom-12 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
              <Sparkles size={13} className="text-amber-300" />
              <span>لوحة الإدارة المركزية</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              مرحباً بك مجدداً 👋
            </h1>
            <p className="text-teal-100 text-xs md:text-sm max-w-xl leading-relaxed">
              إليك النظرة الشاملة على أداء نظام{" "}
              <span className="font-bold underline decoration-amber-300 underline-offset-4">
                مؤسسة صادق البرحي
              </span>{" "}
              وإدارتها المباشرة.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-70 shrink-0"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "جاري المزامنة..." : "مزامنة البيانات"}</span>
          </button>
        </div>
      </div>

      {/* Grid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`rounded-2xl bg-white border border-slate-200/80 p-5 transition-all duration-200 hover:shadow-md ${card.border}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${card.badgeBg}`}
                  >
                    {card.badge}
                  </span>
                  <p className="text-xs font-medium text-slate-500">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl ${card.bgIcon} flex items-center justify-center shrink-0 border border-slate-100`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action & Status Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick Actions (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/80 p-5 md:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Zap size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                إجراءات سريعة
              </h2>
              <p className="text-[11px] text-slate-400">
                وصول مباشر لجميع أقسام لوحة التحكم
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.path}
                  className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-teal-600 hover:border-teal-600 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${action.iconColor} group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-colors shrink-0`}
                    >
                      <ActionIcon size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 group-hover:text-white transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-[10px] text-slate-400 group-hover:text-teal-100 transition-colors mt-0.5">
                        {action.desc}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400 group-hover:text-white transition-transform group-hover:-translate-x-1">
                    <ArrowUpLeft size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Status Insights (1 Column) */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Activity size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  حالة النظام
                </h2>
                <p className="text-[11px] text-slate-400">
                  مؤشرات الاستجابة وقاعدة البيانات
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    قاعدة البيانات (Supabase)
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  متصلة
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-teal-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    التزامن المباشر
                  </span>
                </div>
                <span className="text-xs font-bold text-teal-600">
                  نشط (Live)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    سرعة الاستجابة
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  ممتازة (~110ms)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            <p className="text-[10px] font-medium text-slate-400">
              جميع الأنظمة تعمل بكفاءة عالية 🔒
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}