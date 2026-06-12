import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const url = new URL(request.url);
    url.host = url.host.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next|static|favicon.ico).*)',
};
