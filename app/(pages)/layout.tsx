import { supabase } from "@/lib/supabase";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default async function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // جلب البيانات والإعدادات من Supabase
  const { data: settings } = await supabase.from("settings").select("*");

  const getSetting = (key: string) => {
    return settings?.find((s) => s.key === key)?.value || "";
  };

  const companyName = getSetting("company_name") || "Sadiq Al-Barhi";
  const companySubtitle =
    getSetting("company_subtitle") || "Pharmaceutical & Medical Supplies";
  const logo = getSetting("logo") || "";
  const phone = getSetting("phone") || "+967 1 234567";
  const email = getSetting("email") || "info@sadiqalbarhi.com";
  const address = getSetting("address") || "Sana'a, Yemen";
  
  // 1. جلب ساعات العمل من قاعدة البيانات
  const workingHours = getSetting("working_hours") || "Sat - Thu: 8:00 AM - 6:00 PM\nFriday: Closed";

  return (
    <>
      {/* 1. الهيدر الخاص بصفحات الموقع */}
      <Header
        companyName={companyName}
        companySubtitle={companySubtitle}
        logo={logo}
      />

      {/* 2. محتوى الصفحات */}
      <main>{children}</main>

      {/* 3. الفوتر الخاص بصفحات الموقع (تم تمرير ساعات العمل هنا) */}
      <Footer
        companyName={companyName}
        companySubtitle={companySubtitle}
        logo={logo}
        phone={phone}
        email={email}
        address={address}
        workingHours={workingHours} 
      />
    </>
  );
}