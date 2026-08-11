"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Package,
  Briefcase,
  Store,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Bell,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menu = [
    { name: "الرئيسية", icon: LayoutDashboard, path: "/admin" },
    { name: "الصفحات", icon: FileText, path: "/admin/pages" },
    { name: "المنتجات", icon: Package, path: "/admin/products" },
    { name: "الخدمات", icon: Briefcase, path: "/admin/services" },
    { name: "الفروع", icon: Store, path: "/admin/branches" },
    { name: "الإعدادات", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div
      className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white"
      dir="rtl"
    >
      {/* الهيدر العلوي */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* زر الموبايل */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* زر التوسيع والطي */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
          >
            {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* حقل البحث */}
          <div className="relative hidden sm:flex items-center w-64 lg:w-80">
            <Search className="absolute right-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="ابحث في النظام..."
              className="w-full pl-4 pr-10 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* معلومات المستخدم والتنبيهات */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
              S
            </div>
            <div className="hidden lg:block text-right">
              <div className="flex items-center gap-1">
                <h2 className="text-xs font-bold text-slate-900 leading-tight">
                  أدمن النظام
                </h2>
                <ShieldCheck size={13} className="text-teal-600" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Sadiq Al-Barhi
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى والقائمة */}
      <div className="flex flex-1">
        {/* الشريط الجانبي */}
        <motion.aside
          animate={{ width: isOpen ? 250 : 80 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="hidden md:flex flex-col bg-white border-l border-slate-200/80 sticky top-16 h-[calc(100vh-4rem)] z-20 shrink-0 shadow-sm"
        >
          {/* الشعار */}
          <div className="p-4 flex items-center gap-3 border-b border-slate-100 h-16 overflow-hidden">
            <div className="w-9 h-9 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
              ص
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h1 className="text-sm font-bold text-slate-900">
                    البارحي فارما
                  </h1>
                  <p className="text-[10px] text-teal-600 font-medium">
                    لوحة الإدارة
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* روابط القائمة */}
          <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    active
                      ? "bg-teal-50 text-teal-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  } ${!isOpen && "justify-center px-0"}`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 ${
                      active ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  {isOpen ? (
                    <span className="truncate">{item.name}</span>
                  ) : (
                    <span className="absolute right-full mr-3 px-2.5 py-1 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50 pointer-events-none">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* خروج */}
          <div className="p-3 border-t border-slate-100">
            <Link
              href="/"
              className={`group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all ${
                !isOpen && "justify-center px-0"
              }`}
            >
              <LogOut size={18} className="shrink-0 text-slate-400 group-hover:text-rose-600" />
              {isOpen && <span>العودة للموقع</span>}
            </Link>
          </div>
        </motion.aside>

        {/* الحاوية الرئيسية للمحتوى */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}