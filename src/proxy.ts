import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"
import createMiddleware from 'next-intl/middleware'

const { auth } = NextAuth(authConfig)

const intlMiddleware = createMiddleware({
  locales: ['en', 'am', 'ar', 'de', 'fr', 'es', 'it', 'ja', 'ko', 'zh', 'pt', 'pl', 'ru', 'tr', 'hi'],
  defaultLocale: 'en'
})

const protectedRoutes = ["/student", "/admin"]
const adminRoutes = ["/admin/superadmin"]

export default auth((req) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth
  
  const locales = ['en', 'am', 'ar', 'de', 'fr', 'es', 'it', 'ja', 'ko', 'zh', 'pt', 'pl', 'ru', 'tr', 'hi']
  const pathSegments = nextUrl.pathname.split('/')
  const possibleLocale = pathSegments[1]
  const currentLocale = locales.includes(possibleLocale) ? possibleLocale : 'en'

  // Remove locale prefix for route matching
  const pathname = nextUrl.pathname.replace(/^\/(en|am|ar|de|fr|es|it|ja|ko|zh|pt|pl|ru|tr|hi)/, '') || '/'
  
  // Define route types
  const isSuperAdminLogin = pathname === "/superadmin/login"
  const isAdminLogin = pathname === "/admin/login"
  const isAuthRoute = pathname.startsWith("/auth") || isAdminLogin || isSuperAdminLogin
  
  const isSuperAdminRoute = pathname.startsWith("/superadmin") && !isSuperAdminLogin
  const isAdminRoute = pathname.startsWith("/admin") && !isAdminLogin
  const isStudentRoute = pathname.startsWith("/student")

  const role = req.auth?.user?.role as string | undefined

  if (isAuthRoute) {
    if (isAuthenticated) {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL(`/${currentLocale}/superadmin/dashboard`, nextUrl))
      }
      if (role === "INSTRUCTOR" || role === "BLOG_MANAGER") {
        return NextResponse.redirect(new URL(`/${currentLocale}/admin/dashboard`, nextUrl))
      }
      return NextResponse.redirect(new URL(`/${currentLocale}/student/dashboard`, nextUrl))
    }
  }

  if (!isAuthenticated) {
    if (isSuperAdminRoute) {
      return NextResponse.redirect(new URL(`/${currentLocale}/superadmin/login`, nextUrl))
    }
    if (isAdminRoute) {
      return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, nextUrl))
    }
    if (isStudentRoute) {
      return NextResponse.redirect(new URL(`/${currentLocale}/auth/signin`, nextUrl))
    }
  }

  // RBAC Enforcement
  if (isSuperAdminRoute && role !== "ADMIN") {
    // If not super admin, kick out to their respective dashboards
    if (role === "INSTRUCTOR" || role === "BLOG_MANAGER") {
      return NextResponse.redirect(new URL(`/${currentLocale}/admin/dashboard`, nextUrl))
    }
    return NextResponse.redirect(new URL(`/${currentLocale}/student/dashboard`, nextUrl))
  }

  if (isAdminRoute) {
    if (role !== "ADMIN" && role !== "INSTRUCTOR" && role !== "BLOG_MANAGER") {
      return NextResponse.redirect(new URL(`/${currentLocale}/student/dashboard`, nextUrl))
    }
    // Fine-grained RBAC for /admin
    if (role === "INSTRUCTOR" && (pathname.startsWith("/admin/blog") || pathname.startsWith("/admin/users"))) {
      return NextResponse.redirect(new URL(`/${currentLocale}/admin/dashboard`, nextUrl))
    }
    if (role === "BLOG_MANAGER" && (pathname.startsWith("/admin/certificates") || pathname.startsWith("/admin/syllabus") || pathname.startsWith("/admin/users"))) {
      return NextResponse.redirect(new URL(`/${currentLocale}/admin/dashboard`, nextUrl))
    }
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|uploads|demo-syllabus\\.pdf|favicon.ico).*)']
}
