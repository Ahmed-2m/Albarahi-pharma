import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مؤسسة صادق البرحي - المستلزمات الطبية والأدوية",
  description: "الموقع الرسمي لمؤسسة صادق البرحي للتجهيزات والمستلزمات الطبية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-800 selection:bg-teal-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}