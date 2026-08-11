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
  ExternalLink,
  Sparkles,
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
    { name: "الرئيسية", icon: LayoutDashboard, path: "/admin", badge: "Overview" },
    { name: "الصفحات", icon: FileText, path: "/admin/pages", badge: "Pages" },
    { name: "المنتجات", icon: Package, path: "/admin/products", badge: "Catalog" },
    { name: "الخدمات", icon: Briefcase, path: "/admin/services", badge: "Services" },
    { name: "الفروع", icon: Store, path: "/admin/branches", badge: "Locations" },
    { name: "الإعدادات", icon: Settings, path: "/admin/settings", badge: "System" },
  ];

  return (
    <div
      className="min-h-screen bg-slate-50/90 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-600 selection:text-white"
      dir="rtl"
    >
      {/* Top Floating Glass Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Toggle Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 text-slate-600 hover:text-teal-700 transition-all shadow-xs"
            aria-label="القائمة"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop Sidebar Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex p-2 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 text-slate-600 hover:text-teal-700 transition-all shadow-xs"
            title={isOpen ? "إخفاء الشريط الجانبي" : "إظهار الشريط الجانبي"}
          >
            {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* System Brand Title on Header (visible when sidebar collapsed or on mobile) */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              ص
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xs font-extrabold text-slate-900 leading-tight">
                مؤسسة صادق البرحي
              </h1>
              <p className="text-[10px] text-teal-600 font-semibold">
                لوحة التحكم المركزية
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Search & System Quick Status */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:flex items-center w-64 lg:w-80">
            <Search className="absolute right-3.5 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="ابحث في لوحة التحكم..."
              className="w-full pl-4 pr-10 py-2 bg-slate-100/70 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Quick Notification & User Badge */}
          <div className="flex items-center gap-2.5">
            <button 
              className="relative p-2 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all shadow-xs"
              title="الإشعارات والتحديثات"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            <div className="flex items-center gap-2.5 bg-slate-100/80 border border-slate-200/80 p-1.5 pr-2.5 rounded-xl">
              <div className="hidden lg:block text-right">
                <div className="flex items-center gap-1">
                  <h2 className="text-xs font-bold text-slate-900 leading-tight">
                    أدمن النظام
                  </h2>
                  <ShieldCheck size={13} className="text-teal-600" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Sadiq Al-Barhi
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                S
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Mobile Navigation Backdrop Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-white border-l border-slate-200 z-50 flex flex-col p-4 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-700 text-white font-bold flex items-center justify-center text-base shadow-sm">
                    ص
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">
                      البارحي فارما
                    </h2>
                    <p className="text-[10px] text-teal-600 font-medium">
                      إدارة النظام
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1.5 flex-1 overflow-y-auto">
                {menu.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? "bg-teal-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </div>
                      {active && (
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100 mt-auto">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-200/80"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink size={16} />
                    <span>الذهاب للموقع الرئيسي</span>
                  </div>
                </Link>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Desktop Collapsible Sidebar */}
        <motion.aside
          animate={{ width: isOpen ? 250 : 80 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="hidden md:flex flex-col bg-white border-l border-slate-200/80 sticky top-16 h-[calc(100vh-4rem)] z-20 shrink-0 shadow-xs"
        >
          {/* Header Brand */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100 h-16 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-teal-700 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs">
                ص
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <h1 className="text-xs font-bold text-slate-900">
                      البارحي فارما
                    </h1>
                    <p className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
                      <Sparkles size={11} /> لوحة الإدارة
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 ${
                    active
                      ? "bg-teal-50 text-teal-800 shadow-xs border border-teal-200/60"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  } ${!isOpen && "justify-center px-0"}`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      active ? "text-teal-700" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  {isOpen ? (
                    <span className="truncate">{item.name}</span>
                  ) : (
                    <span className="absolute right-full mr-3 px-2.5 py-1 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50 pointer-events-none shadow-md">
                      {item.name}
                    </span>
                  )}
                  {active && isOpen && (
                    <span className="mr-auto w-1.5 h-1.5 rounded-full bg-teal-600" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Back Link */}
          <div className="p-3 border-t border-slate-100">
            <Link
              href="/"
              target="_blank"
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:bg-teal-50 hover:text-teal-700 transition-all ${
                !isOpen && "justify-center px-0"
              }`}
            >
              <ExternalLink size={17} className="shrink-0 text-slate-400 group-hover:text-teal-700" />
              {isOpen && <span>زيارة الموقع العام</span>}
            </Link>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}