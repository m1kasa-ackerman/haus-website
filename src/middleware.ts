import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isStudio = pathname.startsWith('/studio');
  const isLogin = pathname === '/studio/login';

  // Logged-in user hitting the login page → bounce to dashboard.
  if (isLogin && isLoggedIn) {
    return NextResponse.redirect(new URL('/studio', req.nextUrl.origin));
  }

  // Any other /studio route requires a session.
  if (isStudio && !isLogin && !isLoggedIn) {
    const url = new URL('/studio/login', req.nextUrl.origin);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  // Run on studio routes only; static assets/_next are excluded automatically.
  matcher: ['/studio/:path*']
};
