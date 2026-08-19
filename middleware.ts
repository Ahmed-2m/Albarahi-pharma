import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // تعيين الكوكي في الطلب
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // إنشاء استجابة جديدة
          supabaseResponse = NextResponse.next({
            request,
          })
          // تعيين الكوكي في الاستجابة
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          // إزالة الكوكي من الطلب
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          // إنشاء استجابة جديدة
          supabaseResponse = NextResponse.next({
            request,
          })
          // إزالة الكوكي من الاستجابة
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // حماية المسار /admin
  if (!user && request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // منع الدخول لصفحة الـ login إذا كان مسجل دخول
  if (user && request.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}