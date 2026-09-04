import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;

  // Check for Basic Auth in headers
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Simple password check against env variable
    // Username can be anything, just checking password
    if (pwd === process.env.SITE_PASSWORD) {
      return NextResponse.next();
    }
  }

  // If no auth or incorrect password, request auth
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: '/((?!api/cron|_next/static|_next/image|favicon.ico).*)', // Protect everything except cron and statics
};
