// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// export default createMiddleware(routing);

// export const config = {
//   matcher: ['/((?!api|_next|.*\\..*).*)']
// };


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const locales = routing.locales as readonly string[]
const defaultLocale = routing.defaultLocale ?? "en"

const protectedRoutes = ["/profile", "/dashboard"]

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value
  const pathname = req.nextUrl.pathname
  const segments = pathname.split("/").filter(Boolean)

  const locale = locales.includes(segments[0]) ? segments[0] : defaultLocale

  const pathWithoutLocale = locales.includes(segments[0])
    ? "/" + segments.slice(1).join("/")
    : "/" + segments.join("/")

  

  if (!token && protectedRoutes.includes(pathWithoutLocale)) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url))
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
}
