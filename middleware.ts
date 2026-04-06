// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';

// export default createMiddleware(routing);

// export const config = {
//   matcher: ['/((?!api|_next|.*\\..*).*)']
// };

import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ka'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(en|ka)/:path*']
};